# urls.py
from django.urls import path
from .views.prediction import  GetPredictionFromUploadedFile, TrainModel, MakePrediction, GetModelInfo
from .views.inventory import CreateInventoryProductView , ListInventoryProductsView , DeleteInventoryProductView
from .views.sales import CreateSalesProductView , ListSalesProductsView , DeleteSalesProductView
from .views.sales_analizer import ReadSalesDataView , RandomForestView

urlpatterns = [
    # Existing endpoints
    
    
    # ML endpoints
    path('get-encoding-plan/', GetPredictionFromUploadedFile.as_view(), name='get-encoding-plan'),
    path('train-model/', TrainModel.as_view(), name='train-model'),
    path('predict/', MakePrediction.as_view(), name='make-prediction'),
    path('model-info/', GetModelInfo.as_view(), name='model-info'),
    path('create-inventory-product/', CreateInventoryProductView.as_view() , name='create-inventory-product' ),
    path('list-inventory-product/' , ListInventoryProductsView.as_view() , name='list-inventory-product'),
    path('delete-inventory-product/<int:pk>/' , DeleteInventoryProductView.as_view() , name='delete-inventory-product'),
    path('create-sales-product/' , CreateSalesProductView.as_view() , name='create-sales-product'),
    path('list-sales-product/' , ListSalesProductsView.as_view() , name='list-sales-product'),
    path('delete-sales-product/<int:pk>' , DeleteSalesProductView.as_view(), name='delere-sales-product'),
    path('read-csv' , ReadSalesDataView.as_view(), name='read-sales-data'),
    path('random-forest' , RandomForestView.as_view(), name='read-sales-data'),

]