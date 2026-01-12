from django.db import transaction
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from ..serializers import SalesSerializer
from ..models import Sales , Inventory

class CreateSalesProductView(generics.CreateAPIView):
    serializer_class = SalesSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data['product_id']
        qty = serializer.validated_data['quantity']

        try:
            with transaction.atomic():
                inventory = Inventory.objects.select_for_update().get(
                    id=product_id
                )

                if inventory.quantity < qty:
                    return Response(
                        {"error": "Insufficient stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # decrease inventory
                inventory.quantity -= qty
                inventory.save()

                # create sale
                sale = Sales.objects.create(
                    product_name=inventory.product_name,
                    brand_name=inventory.brand_name,
                    category=inventory.category,
                    quantity=qty,
                    price=inventory.price,
                    author=request.user
                )

        except Inventory.DoesNotExist:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            SalesSerializer(sale).data,
            status=status.HTTP_201_CREATED
        )


class ListSalesProductsView(generics.ListAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

class DeleteSalesProductView(generics.DestroyAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [IsAuthenticated]

