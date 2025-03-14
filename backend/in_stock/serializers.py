from rest_framework import serializers

from api.models import User
from .models import Stock


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        

class GetStockSerialier(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = Stock
        fields = "__all__"

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = "__all__"