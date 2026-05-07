import json
import asyncio
from uuid import uuid4
from datetime import datetime
from django.utils import timezone
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.other_user_id = self.scope['url_route']['kwargs']['other_user_id']
        self.user = self.scope['user']
        
        user_ids = sorted([int(self.user.id), int(self.other_user_id)])
        self.room_group_name = f'chat_{user_ids[0]}_{user_ids[1]}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('text', '').strip()
        
        if not message_text:
            return
        
        message_id = str(uuid4())
        now = timezone.now().isoformat()
        
        # Отправляем СРАЗУ
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message_id': message_id,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'text': message_text,
                'created_at': now,
            }
        )
        
        # Сохраняем в БД в фоне
        asyncio.create_task(
            self.save_message(message_text)
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'id': event['message_id'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'text': event['text'],
            'created_at': event['created_at'],
        }))

    @database_sync_to_async
    def save_message(self, text):
        return Message.objects.create(
            sender=self.user,
            recipient_id=self.other_user_id,
            text=text
        )
