# Generated by Django 5.1.3 on 2025-01-28 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('website', '0002_alter_content_id_alter_conversation_user_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='multiple',
            name='document',
            field=models.FileField(blank=True, null=True, upload_to=''),
        ),
        migrations.AddField(
            model_name='multiple',
            name='uploaded_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
