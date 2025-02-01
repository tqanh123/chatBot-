import json
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import HttpResponse
from flask import redirect
from .form import *
from .models import *
from .functions.functions import handle_uploaded_file


allConversation = Conversation.objects.all
# Create your views here.
def home(request):
    return render(request, 'home.html', {'all': allConversation})

def login(request):
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        email = request.POST['Email']
        password = request.POST['Password']
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, 'Email or password is incorrect')
    # is_admin = request.session.get('admin', False)
    # context.update({'is_admin': is_admin})
    return render(request, "login.html")

def signup(request):
    if request.method == "POST":
        fname = request.POST['FName']
        lname = request.POST['LName']
        email = request.POST['Email']
        password = request.POST['Password']
        confirm_password = request.POST['ConfirmPassword']

        if password != confirm_password:
            messages.error(request, "Mật khẩu không khớp. Vui lòng thử lại.")
            return redirect('signup')

        user = User.objects.create_user(email=email, password=password, first_name=fname, last_name=lname)
        user.save()
        return redirect('login')
    return render(request, "signup.html")

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

def upload_file(request):
    # if request.method == 'POST' and request.FILES['file']:
    #     file = request.FILES['file']
    #     id = int(request.POST['conId'])
    #     try:
    #         con = Conversation.objects.get(id=id)
    #         multiple = Multiple(files=file, conversation=con)
    #         multiple.save()
    #         return JsonResponse({'message': 'File uploaded successfully'})
    #     except Conversation.DoesNotExist:
    #         return JsonResponse({'error': 'Conversation not found'}, status=404)
    #     return redirect('home')
    # return JsonResponse({'error': 'File upload failed'}, status=400)
    if request.method == 'POST':
        form = MultipleForm(request.POST, request.FILES)
        files = request.FILES.getlist('file')
        for f in files:
            Multiple.objects.create(file=f)
        return redirect('upload_file')
    else:
        form = MultipleForm()
    documents = Multiple.objects.all()
    return render(request, 'upload.html', {'form': form, 'documents': documents})

def update_content(request):
    if request.method == 'POST':
        content = Content.objects.get(id=request.POST['id'])
        content.content = request.POST['content']
        content.save()
        return JsonResponse({'message': 'Responses saved successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
 
def show_conversation(request, id):
        conversation = Conversation.objects.get(id=id)
        content = Content.objects.filter(con=conversation)
        last = content.last()
        print(last)
        return render(request, 'home.html', {'contents': content, 'all': allConversation, 'conversation': conversation, 'last': last})
