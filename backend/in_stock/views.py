from django.shortcuts import render
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated

from purchased.models import PurchasedItem
from .models import Stock
from rest_framework.response import Response
from .serializers import GetStockSerialier, StockSerializer
# Create your views here.

class ListCreateStockView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return StockSerializer
        elif self.request.method == "GET":
            return GetStockSerialier
    
    queryset = Stock.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def post(self, request, *args, **kwargs):
        item_id = request.data.get("item_id")
        item_name = request.data.get("name")
        item_quantity = request.data.get("quantity")
        
        if not item_id:
            return Response({"detail": "item_id is required"})
        
        if not item_name:
            return Response({"detail": "name is required"})
        
        if not item_quantity:
            return Response({"detail": "quantity is required"})
        
        request.data["created_by"] = request.user.id
        
        try:
            pending_item = PurchasedItem.objects.get(id=item_id)
            pending_item.status = "stocked"
            pending_item.save()
            
            try:
                stock_item = Stock.objects.get(name=item_name)
                stock_item.quantity += item_quantity
                stock_item.save()
                return Response(data=request.data, status=status.HTTP_201_CREATED)
                
            except Stock.DoesNotExist:
                return self.create(request, *args, **kwargs)
        
        except PurchasedItem.DoesNotExist:
            response = {"detail": f"purchased item with id {item_id} not found"}
            return Response(data=response, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"detail": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    

class RetrieveUpdateDestroyStockView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    def get_serializer_class(self):
        if self.request.method == "GET":
            return GetStockSerialier
        else:
            return StockSerializer
        
        
    queryset = Stock.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)