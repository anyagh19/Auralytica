from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
import pandas as pd
import json
import numpy as np
from mcp_server.tools import get_encoding_plan, do_encoding
from asgiref.sync import async_to_sync
from .ml_model import SalesPredictionModel
from .sales_analytics import SalesAnalytics
import os
from django.conf import settings


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


def none(response):
    return HttpResponse("hello any")


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class GetPredictionFromUploadedFile(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # ---- 1. Read CSV file ----
            file = request.FILES.get('file')
            if not file:
                return Response({"error": "No file uploaded"}, status=400)
            
            data = pd.read_csv(file)
            
            # ✅ Replace NaN values before any processing
            data = data.replace([np.inf, -np.inf], np.nan)
            data = data.fillna('')

            # ---- 2. Prepare columns for Gemini ----
            columns = []
            for col in data.columns:
                sample_values = data[col].dropna().astype(str).head(5).tolist()
                
                columns.append({
                    "name": col,
                    "dataType": str(data[col].dtype),
                    "sample": sample_values if sample_values else [""],
                    "unique": int(data[col].nunique())
                })

            # ---- 3. Get encoding plan from MCP/Gemini ----
            encoding_plan_raw = async_to_sync(get_encoding_plan)(columns)

            # ---- 4. Parse JSON response ----
            try:
                encoding_plan_dict = json.loads(encoding_plan_raw)
                encoding_plan = encoding_plan_dict["encoding_plan"]
            except (json.JSONDecodeError, KeyError) as e:
                return Response({
                    "error": "Invalid encoding plan format",
                    "raw": encoding_plan_raw,
                    "details": str(e)
                }, status=400)

            # ---- 5. Convert dataframe to records for encoding ----
            df_records = data.to_dict(orient="records")

            # ---- 6. Apply the encoding ----
            encoded_result = async_to_sync(do_encoding)(
                {"encoding_plan": encoding_plan}, 
                df_records
            )
            
            # Clean NaN values
            def clean_nan(obj):
                if isinstance(obj, dict):
                    return {k: clean_nan(v) for k, v in obj.items()}
                elif isinstance(obj, list):
                    return [clean_nan(item) for item in obj]
                elif isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
                    return None
                return obj
            
            encoded_result = clean_nan(encoded_result)

            # ---- 7. Return BOTH plan and encoded data ----
            return Response({
                "columns": columns,
                "encoding_plan": encoding_plan,
                "encoded_data": encoded_result
            })
            
        except Exception as e:
            import traceback
            return Response({
                "error": "Processing failed",
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=500)


class TrainModel(APIView):
    """
    Train ML model on encoded data
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Get encoded data from request
            encoded_data = request.data.get('encoded_data')
            model_type = request.data.get('model_type', 'random_forest')
            target_column = request.data.get('target_column', 'Total Revenue')
            
            if not encoded_data:
                return Response({"error": "No encoded data provided"}, status=400)
            
            # Convert to DataFrame
            df = pd.DataFrame(encoded_data)
            
            # Check if target column exists
            if target_column not in df.columns:
                return Response({
                    "error": f"Target column '{target_column}' not found",
                    "available_columns": list(df.columns)
                }, status=400)
            
            # Initialize and train model
            model = SalesPredictionModel()
            metrics = model.train_model(
                df,
                target_col=target_column,
                model_type=model_type,
                test_size=0.2
            )
            
            # Save model
            model_dir = os.path.join(settings.BASE_DIR, 'saved_models')
            os.makedirs(model_dir, exist_ok=True)
            model_path = os.path.join(model_dir, 'sales_model.pkl')
            model.save_model(model_path)
            
            return Response({
                "success": True,
                "message": "Model trained successfully",
                "metrics": metrics,
                "model_path": model_path
            })
            
        except Exception as e:
            import traceback
            return Response({
                "error": "Training failed",
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=500)


class MakePrediction(APIView):
    """
    Make predictions using trained model
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Get data for prediction
            encoded_data = request.data.get('encoded_data')
            
            if not encoded_data:
                return Response({"error": "No data provided for prediction"}, status=400)
            
            # Convert to DataFrame
            df = pd.DataFrame(encoded_data)
            
            # Load model
            model_path = os.path.join(settings.BASE_DIR, 'saved_models', 'sales_model.pkl')
            
            if not os.path.exists(model_path):
                return Response({
                    "error": "No trained model found. Please train a model first."
                }, status=400)
            
            model = SalesPredictionModel()
            model.load_model(model_path)
            
            # Make predictions
            predictions = model.predict(df)
            
            # Clean predictions (remove NaN/inf)
            predictions = np.nan_to_num(predictions, nan=0.0, posinf=0.0, neginf=0.0)
            
            # Add predictions to dataframe
            df[f'Predicted_{model.target_column}'] = predictions
            
            # Calculate actual vs predicted if target exists
            comparison = None
            if model.target_column in df.columns:
                actual = df[model.target_column].values
                
                # Clean actual values
                actual = np.nan_to_num(actual, nan=0.0, posinf=0.0, neginf=0.0)
                
                # Calculate metrics
                rmse = float(np.sqrt(np.mean((actual - predictions) ** 2)))
                mae = float(np.mean(np.abs(actual - predictions)))
                
                # Calculate R2 safely
                ss_res = np.sum((actual - predictions) ** 2)
                ss_tot = np.sum((actual - np.mean(actual)) ** 2)
                r2 = float(1 - (ss_res / ss_tot)) if ss_tot != 0 else 0.0
                
                comparison = {
                    "actual": [float(x) for x in actual],
                    "predicted": [float(x) for x in predictions],
                    "rmse": rmse,
                    "mae": mae,
                    "r2": r2
                }
            
            # Clean the dataframe for JSON serialization
            df_clean = df.replace([np.inf, -np.inf], np.nan).fillna(0)
            
            return Response({
                "success": True,
                "predictions": [float(x) for x in predictions],
                "model_info": model.model_metadata,
                "comparison": comparison,
                "predicted_data": df_clean.to_dict(orient="records")[:10]  # First 10 rows
            })
            
        except Exception as e:
            import traceback
            return Response({
                "error": "Prediction failed",
                "details": str(e),
                "traceback": traceback.format_exc()
            }, status=500)


class GetModelInfo(APIView):
    """
    Get information about the trained model
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            model_path = os.path.join(settings.BASE_DIR, 'saved_models', 'sales_model.pkl')
            
            if not os.path.exists(model_path):
                return Response({
                    "model_exists": False,
                    "message": "No trained model found"
                })
            
            model = SalesPredictionModel()
            metadata = model.load_model(model_path)
            
            return Response({
                "model_exists": True,
                "metadata": metadata
            })
            
        except Exception as e:
            return Response({
                "error": "Failed to load model info",
                "details": str(e)
            }, status=500)