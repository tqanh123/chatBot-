from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(Conversation)
admin.site.register(User)
admin.site.register(Content)
admin.site.register(Multiple)