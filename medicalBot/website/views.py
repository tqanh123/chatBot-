import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from .form import upload
from .models import *
from .functions.functions import handle_uploaded_file


allConversation = Conversation.objects.all
# Create your views here.
def home(request):
    return render(request, 'home.html', {'all': allConversation})

def create_conversation(request):
    print('create_conversation')
    conversation = Conversation.objects.create()
    conversation.name = 'đoạn chat ' + str(conversation.id)
    conversation.save()
    return render(request, f'/{conversation.id}', {})

def updateScript(request):
    print('updateScript')
    if request.method == 'POST':
        data = json.loads(request.body)
        actor = data.get('sender')
        message = data.get('message')
        conversation = Conversation.objects.get(id=data.get('conId'))
        num = data.get('num')

        Content.objects.create(con=conversation, actor=actor, content=message, number=num)
        return JsonResponse({'message': 'Responses saved successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

def upload_file(request, id):
    print('upload_file')
    if request.method == 'POST':
        if 'file' in request.FILES:
            upload_file = request.FILES['file']
            print(upload_file)
            file = Multiple.objects.create(files=upload_file)
        else:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        
    return render(request, 'home.html', {'files': file})

    # conversation = Conversation.objects.get(id=id)
    # content = Content.objects.filter(con=conversation)
    # last = content.last()
    # if request.method == 'POST':
    #     files = request.FILES.getlist('files')
    #     print('files: ',files)
    #     for file in files:
    #         Multiple.objects.create(files=file)
    #     files = Multiple.objects.all()
    #     # return render(request, 'home.html', {'files': files, 'contents': content, 'all': allConversation, 'conversation': conversation, 'last': last})
    #     return render(request, 'home.html', {'files':files})
    # else:
    #     # return render(request, 'home.html', {'files': Multiple.objects.all(), 'contents': content, 'all': allConversation, 'conversation': conversation, 'last': last})
    #     return render(request, 'home.html', {'files':Multiple.objects.all()})

def show_conversation(request, id):
        conversation = Conversation.objects.get(id=id)
        content = Content.objects.filter(con=conversation)
        last = content.last()
        print(last)
        return render(request, 'home.html', {'contents': content, 'all': allConversation, 'conversation': conversation, 'last': last})
   