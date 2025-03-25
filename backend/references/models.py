from django.db import models
from api.models import User

# Create your models here.

class References(models.Model):
    client_name = models.CharField(max_length=250)
    client_phone = models.CharField(max_length=50)
    client_package = models.CharField( max_length=250)
    client_location = models.CharField(max_length=250)
    longitude = models.CharField(max_length=150)
    latitude = models.CharField(max_length=150)
    referer_name = models.CharField(max_length=250)
    referer_phone = models.CharField(max_length=50)
    mpesa_message = models.TextField()
    awarded = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="references")
    creator_id = models.IntegerField(editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        # On creation, capture the user ID.
        if self.pk is None and self.created_by:
            self.creator_id = self.created_by.id
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name