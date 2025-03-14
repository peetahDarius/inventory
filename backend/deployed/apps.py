from django.apps import AppConfig


class DeployedConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'deployed'
