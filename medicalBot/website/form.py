from django import forms

class upload(forms.Form):
    name = forms.CharField(label='Name', max_length=100)
    file = forms.FileField()