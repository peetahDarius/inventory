from rest_framework import serializers

from .models import Equipments


class EquipmentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Equipments
        fields = "__all__"