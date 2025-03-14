from . import views
from django.urls import path

urlpatterns = [
    path("", views.ListCreateStockView.as_view(), name="list-create-stock"),
    path("<int:pk>/", views.RetrieveUpdateDestroyStockView.as_view(), name="retrieve-update-delete-stock")
]
