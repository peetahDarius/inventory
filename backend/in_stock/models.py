from django.db import models

from api.models import User

# Create your models here.


class Stock(models.Model):
    name = models.TextField()
    item_id = models.IntegerField()
    quantity = models.IntegerField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="create_stocks")
    creator_id = models.IntegerField(editable=False)
    
    def save(self, *args, **kwargs):
        # On creation, capture the user ID.
        if self.pk is None and self.created_by:
            self.creator_id = self.created_by.id
        super().save(*args, **kwargs)
        
    def __str__(self):
        return self.name