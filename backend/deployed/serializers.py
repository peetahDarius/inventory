from rest_framework import serializers

from api.models import User
from .models import DeployedItem

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class GetDeployedItemSerializer(serializers.ModelSerializer):
    
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = DeployedItem
        fields = "__all__"

class DeployedItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = DeployedItem
        fields = "__all__"