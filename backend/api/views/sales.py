from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated , AllowAny
from rest_framework.response import Response
from ..serializers import SalesSerializer
from ..models import Sales

class CreateSalesProductView(generics.CreateAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(author=request.user)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

class ListSalesProductsView(generics.ListAPIView):
    queryset = Sales.objects.all()
    serializer_class = SalesSerializer