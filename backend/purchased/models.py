from django.db import models

from api.models import User

# Create your models here.

class PurchasedItem(models.Model):
    name = models.TextField()
    quantity = models.IntegerField()
    description = models.TextField()
    price = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="purchases")
    creator_id = models.IntegerField(editable=False)
    status = models.CharField(max_length=50, default="pending")
    seller_name = models.TextField(null=True, blank=True)
    seller_contact = models.CharField(max_length=50, null=True, blank=True)
    seller_description = models.TextField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # On creation, capture the user ID.
        if self.pk is None and self.created_by:
            self.creator_id = self.created_by.id
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name