from django.urls import path
from . import views


urlpatterns = [
    path("", views.ListCreateReferenceView.as_view(), name="list-create-references"),
    path("<int:pk>/", views.RetrieveUpdateDeleteReferenceView.as_view(), name="retrieve-update-delete-references")
]
