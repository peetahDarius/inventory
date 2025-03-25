from django.shortcuts import render
from rest_framework import generics, mixins
from .models import Equipments
from .serializers import EquipmentSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.


class ListCreateEquipmentView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = EquipmentSerializer
    queryset = Equipments.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDeleteEquipmentView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = EquipmentSerializer
    queryset = Equipments.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)