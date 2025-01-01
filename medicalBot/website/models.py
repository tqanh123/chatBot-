from typing import Any
from django.db import models

# Create your models here.

class User(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.IntegerField()
    gender = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    age = models.IntegerField()
    isGuest = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Conversation(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    date = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name 

class Content(models.Model):
    id = models.AutoField(primary_key=True)
    con = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    actor = models.CharField(max_length=200)
    content = models.TextField()
    number = models.IntegerField()

    def __str__(self):
        return self.content + ' - ' + self.actor + ' - ' + str(self.number) 
    
class Multiple(models.Model):
    files = models.FileField()
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)


    
    
    
