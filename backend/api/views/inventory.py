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

    def create(self, request, *args, **kwargs):
        product_name = request.data.get("product_name")
        brand_name = request.data.get("brand_name")
        price = request.data.get("price")
        quantity = int(request.data.get("quantity", 0))

        # Check if same product exists
        existing = Inventory.objects.filter(
            product_name=product_name,
            brand_name=brand_name,
            price=price,
            author=request.user
        ).first()

        if existing:
            existing.quantity += quantity
            existing.save()

            return Response(
                InventorySerializer(existing).data,
                status=status.HTTP_200_OK
            )

        # Product doesn't exist → create new
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class ListInventoryProductsView(generics.ListAPIView):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

class DeleteInventoryProductView(generics.DestroyAPIView):
    queryset= Inventory.objects.all()
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]