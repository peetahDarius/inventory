from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreateEquipmentView.as_view(), name="list-create-equipment"),
    path("<int:pk>/", views.RetrieveUpdateDeleteEquipmentView.as_view(), name="retrieve-update-delete-equipment")
]
