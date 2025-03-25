from rest_framework import generics, status, mixins

from notifications.models import Notification
from in_stock.models import Stock
from .serializers import DeployedItemSerializer, GetDeployedItemSerializer
from .models import DeployedItem
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from django.db import transaction

class ListCreateDeployedItemsView(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return DeployedItemSerializer
        if self.request.method == "GET":
            return GetDeployedItemSerializer
        
    queryset = DeployedItem.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id

        stock_id = request.data.get("stock_id")
        quantity = request.data.get("quantity")
        
        if not quantity:
            return Response({"detail": "quantity is required"})
        
        try:
            with transaction.atomic():
                stock = Stock.objects.get(id=stock_id)
                if int(quantity) > stock.quantity:
                    return Response(
                        {"detail": "You cannot deploy more than the available stock"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                elif int(quantity) == stock.quantity:
                    stock.delete()
                    notification = Notification(name=f"item, {stock.name}, has been depleted in the stock.")
                    notification.save()
                    
                else:
                    stock.quantity -= int(quantity)
                    stock.save()

                return self.create(request, *args, **kwargs)
        
        except Stock.DoesNotExist:
            return Response({"detail": f"stock with id {stock_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({"detail": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
    
    
class RetrieveUpdateDestroyDeplotedItemsView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    def get_serializer_class(self):
        
        if self.request.method == "GET":
            return GetDeployedItemSerializer
        
        else:
            return DeployedItemSerializer
        
    queryset = DeployedItem.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        request.data["updated_by"] = request.user.id
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)