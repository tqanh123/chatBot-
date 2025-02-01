from django import forms
from django.forms import ModelForm
from .models import Multiple

class MultipleForm(forms.Form):
    file = forms.FileField()

