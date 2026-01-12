from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error , r2_score
from ..serializers import SalesSerializer
from ..models import Sales


class ReadSalesDataView(generics.GenericAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        sales = self.get_queryset()

        # 1️⃣ Serialize queryset
        serializer = self.get_serializer(sales, many=True)

        # 2️⃣ Convert serialized data (list of dicts) to DataFrame
        df = pd.DataFrame(serializer.data)

        # (Optional) Do processing / ML prediction here
        # prediction = model.predict(df[features])
        y = df['quantity']
        x = df.drop(columns=['quantity'])

        x_train, x_test, y_train, y_test = train_test_split(
            x, y, test_size=0.2, random_state=42
        )

        x_train1 = pd.get_dummies(x_train)
        x_test1 = pd.get_dummies(x_test)
        
        x_test1 = x_test1.reindex(columns=x_train1.columns, fill_value=0)

        lr = LinearRegression()
        lr.fit(x_train1 , y_train)

        pred = lr.predict(x_train1)
        pred2 = lr.predict(x_test1)

        mean = mean_squared_error(y_train , pred)
        r2 = r2_score(y_train , pred)

        rf = RandomForestRegressor(max_depth=2 , random_state=100)
        rf.fit(x_train1 , y_train)

        pred = rf.predict(x_train1)
        pred2 = rf.predict(x_test1)

        # 3️⃣ Convert back to JSON
        return Response({
            "rows": len(df),
            "data": serializer.data,
            'y': y,
            'x': x,
            'x_train': x_train,
            'x_test': x_test,
            'y_train': y_train,
            'y_test': y_test,
            'xt':x_train1,
            'pred': pred,
            'p2': pred2.tolist(),
            'mean': mean,
            'r2':r2
        })


class RandomForestView(generics.GenericAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        sales = self.get_queryset()

        # 1️⃣ Serialize queryset
        serializer = self.get_serializer(sales, many=True)

        # 2️⃣ Convert serialized data (list of dicts) to DataFrame
        df = pd.DataFrame(serializer.data)

        # (Optional) Do processing / ML prediction here
        # prediction = model.predict(df[features])
        y = df['quantity']
        x = df.drop(columns=['quantity'])

        x_train, x_test, y_train, y_test = train_test_split(
            x, y, test_size=0.2, random_state=42
        )

        x_train1 = pd.get_dummies(x_train)
        x_test1 = pd.get_dummies(x_test)
        
        x_test1 = x_test1.reindex(columns=x_train1.columns, fill_value=0)

        lr = LinearRegression()
        lr.fit(x_train1 , y_train)

        pred = lr.predict(x_train1)
        pred2 = lr.predict(x_test1)

        mean = mean_squared_error(y_train , pred)
        r2 = r2_score(y_train , pred)

        # 3️⃣ Convert back to JSON
        return Response({
            "rows": len(df),
            "data": serializer.data,
            'y': y,
            'x': x,
            'x_train': x_train,
            'x_test': x_test,
            'y_train': y_train,
            'y_test': y_test,
            'xt':x_train1,
            'pred': pred,
            'p2': pred2.tolist(),
            'mean': mean,
            'r2':r2
        })
