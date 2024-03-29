from django.db import models

class Message(models.Model):
    author = models.CharField(max_length=100)  # Username
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
