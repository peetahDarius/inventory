from rest_framework import serializers
from api.models import User
from .models import PurchasedItem

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email"]


class GetPurchasedItemSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = PurchasedItem
        fields = "__all__"

class PurchasedItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PurchasedItem
        fields = "__all__"