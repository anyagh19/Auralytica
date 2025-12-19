from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Inventory(models.Model):
    product_name = models.CharField(max_length=100)
    brand_name = models.CharField("ENter Brand of Product", max_length=50)
    CATEGORY_CHOICES = [
        ("ELECTRONICS", "Electronics"),
        ("GROCERY", "Grocery"),
        ("CLOTHING", "Clothing"),
        ("OTHER", "Other"),
    ]
    category= models.CharField( max_length=50 , choices= CATEGORY_CHOICES)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User , on_delete=models.CASCADE , related_name="inventory")

    def __str__(self):
        return self.product_name
    

class Sales(models.Model):
    product_name = models.CharField(max_length=100)
    brand_name = models.CharField("ENter Brand of Product", max_length=50)
    CATEGORY_CHOICES = [
        ("ELECTRONICS", "Electronics"),
        ("GROCERY", "Grocery"),
        ("CLOTHING", "Clothing"),
        ("OTHER", "Other"),
    ]
    category= models.CharField( max_length=50 , choices= CATEGORY_CHOICES)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User , on_delete=models.CASCADE , related_name="sales")

    def __str__(self):
        return self.product_name
    
