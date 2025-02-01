from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home', views.home, name='home'),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('updateScript', views.updateScript, name='updateScript'),
    path('<int:id>/upload', views.upload_file, name='upload'),
    path('conversation/', views.create_conversation, name='conversation'),
    path('<int:id>', views.show_conversation, name='show_conversation'),
    path('upload/', views.upload_file, name='upload_file'),
    path('update_content/', views.update_content, name='update_content'),
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)