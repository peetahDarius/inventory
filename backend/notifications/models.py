from django.db import models

# Create your models here.


class Notification(models.Model):
    name = models.TextField()
    read = models.BooleanField(default=False)
    read_by = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name[:50]