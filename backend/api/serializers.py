from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Inventory , Sales

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id" , "username" , "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self , validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model= Inventory
        fields= ['id' , 'product_name' , 'brand_name' ,'category', 'quantity' ,'price',  'created_at' , 'author']
        extra_kwargs = {"author" : {"read_only": True}}

class CreateInventoryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model= Inventory    
        fields=[  'product_name' , 'brand_name' ,'category', 'quantity' , 'price', ]

    def create(self, validated_data):
        # Automatically set the author to the logged-in user
        request = self.context.get('request')
        validated_data['author'] = request.user
        return super().create(validated_data)

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0.")
        return value

class SalesSerializer(serializers.ModelSerializer):
    class Meta:
        model= Sales
        fields= ['id' , 'product_name' , 'brand_name' ,'category', 'quantity' ,'price',  'created_at' , 'author']
        extra_kwargs = {"author" : {"read_only": True}}
