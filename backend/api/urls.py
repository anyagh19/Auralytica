# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Existing endpoints
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='delete-note'),
    
    # ML endpoints
    path('get-encoding-plan/', views.GetPredictionFromUploadedFile.as_view(), name='get-encoding-plan'),
    path('train-model/', views.TrainModel.as_view(), name='train-model'),
    path('predict/', views.MakePrediction.as_view(), name='make-prediction'),
    path('model-info/', views.GetModelInfo.as_view(), name='model-info'),
]