from django.db import models

# Create your models here.

class Equipments(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)