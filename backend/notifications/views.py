from django.shortcuts import render
from rest_framework import generics, mixins
from .models import Notification
from .serializers import NotitificationSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here.


class ListCreateNotificationsView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    serializer_class = NotitificationSerializer
    permission_classes = [IsAuthenticated, ]
    
    def get_queryset(self):
        queryset = Notification.objects.all()
        if self.request.method == "GET":
            queryset = queryset.filter(read=False)
        return queryset

    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
    
    
class RetrieveUpdateDestroyNotificationsView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    serializer_class = NotitificationSerializer
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)