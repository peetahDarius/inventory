from django.db import models

from api.models import User

# Create your models here.


class DeployedItem(models.Model):
    name = models.TextField()
    quantity = models.IntegerField()
    stock_id = models.IntegerField()
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="deployed")
    creator_id = models.IntegerField(editable=False, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="update_deployed")
    updator_id = models.IntegerField(editable=False, null=True)
    latitude = models.CharField(max_length=50, null=True)
    longitude = models.CharField(max_length=50, null=True)
    location = models.CharField(max_length=250)
    
    def save(self, *args, **kwargs):
        # On creation, capture the user ID.
        if self.pk is None and self.created_by:
            self.creator_id = self.created_by.id
            
        if self.pk is None and self.updated_by:
            self.updator_id = self.updated_by.id
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name