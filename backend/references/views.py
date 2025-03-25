from django.shortcuts import render
from rest_framework import generics, mixins
from .serializers import GetReferencesSerializer, ReferencesSerializer
from .models import References
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class ListCreateReferenceView(generics.GenericAPIView, mixins.CreateModelMixin, mixins.ListModelMixin):
    
    queryset = References.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self, *args, **kwargs):
        
        if self.request.method == "GET":
            return GetReferencesSerializer
        else:
            return ReferencesSerializer
    
    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return self.create(request, *args, **kwargs)
    

class RetrieveUpdateDeleteReferenceView(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    
    queryset = References.objects.all()
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == "GET":
            return GetReferencesSerializer
        else:
            return ReferencesSerializer
    
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)