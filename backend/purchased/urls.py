from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListCreatePurchasedItemsView.as_view(), name="list-create-purchased"),
    path("pending/", views.PendingPurchasesView.as_view(), name="list-pending-purchases"),
    path("<int:pk>/", views.RetrieveUpdateDestroyItemView.as_view(), name="retrieve-update-destroy-purchase")
]
