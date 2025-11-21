from rest_framework import generics , status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from ..serializers import InventorySerializer , CreateInventoryProductSerializer
from ..models import Inventory

class CreateInventoryProductView(generics.CreateAPIView):
    queryset = Inventory.objects.all()
    serializer_class = CreateInventoryProductSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class ListInventoryProductsView(generics.ListAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]