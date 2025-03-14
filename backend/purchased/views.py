from urllib import request
from django.shortcuts import render
from rest_framework import status, generics, mixins
from .serializers import GetPurchasedItemSerializer, PurchasedItemSerializer
from .models import PurchasedItem
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import APIView
# Create your views here.

class ListCreatePurchasedItemsView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    queryset = PurchasedItem.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return PurchasedItemSerializer
        
        if self.request.method == "GET":
            return GetPurchasedItemSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):        
        request.data["created_by"] = request.user.id
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDestroyItemView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    queryset = PurchasedItem.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self):
        if self.request.method == "GET":
            return GetPurchasedItemSerializer
        else:
            return PurchasedItemSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
    

class PendingPurchasesView(APIView):
    
    serializer_class = PurchasedItemSerializer
    
    def get(self, request:request, *args, **kwargs):
        purchases = PurchasedItem.objects.filter(status="pending")
        serializer = self.serializer_class(instance=purchases, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)