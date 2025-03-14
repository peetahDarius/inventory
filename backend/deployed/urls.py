from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreateDeployedItemsView.as_view(), name="list-create-deployed"),
    path("<int:pk>/", views.RetrieveUpdateDestroyDeplotedItemsView.as_view(), name="retrieve-update-delete-deployed")
]
