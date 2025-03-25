from django.urls import path
from . import views


urlpatterns = [
    path("", views.ListCreateNotificationsView.as_view(), name="list-create-notifications"),
    path("<int:pk>/", views.RetrieveUpdateDestroyNotificationsView.as_view(), name="retrieve-update-delete")
]
