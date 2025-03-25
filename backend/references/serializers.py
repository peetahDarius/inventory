from rest_framework import serializers

from api.models import User
from .models import References

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email"]
        
class GetReferencesSerializer(serializers.ModelSerializer):
    
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = References
        fields = "__all__"
        
class ReferencesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = References
        fields = "__all__"