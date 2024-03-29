import json
from channels.generic.websocket import WebsocketConsumer
from .models import Message
from asgiref.sync import async_to_sync
import uuid


class ChatConsumer(WebsocketConsumer):
    connected_users = set()

    def connect(self):
        self.room_group_name = 'chat_room'
        self.user_name = self.scope['url_route']['kwargs']['user_name']
        ChatConsumer.connected_users.add(self.user_name)
        # Broadcast the updated user list
        self.broadcast_user_list()
        # self.user_name = f"User_{uuid.uuid4().hex[:6]}"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        ChatConsumer.connected_users.discard(self.user_name)
        # Broadcast the updated user list
        self.broadcast_user_list()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        #message_data_json = json.loads(message)

        # Save message to the database
        msg = Message.objects.create(content=message, author=self.user_name)
        print('message', message)
        # Broadcast message to the room group including timestamp and author
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'type': 'text',
                    'author': message['author'],
                    'content' : message['content'],
                    'timestamp' : message['timestamp']
                    }
            }
        )
        self.broadcast_user_list()

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']
        print('chat_message', message)
        # Send message to WebSocket
        self.send(text_data=json.dumps(message))


    def broadcast_user_list(self):
        # Convert the set of users to a list to make it JSON-serializable
        user_list = list(ChatConsumer.connected_users)
        print('broadcast called', user_list);
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, # The name of the group where all clients are added
            {
                "type": "chat_user_list",  # Method that handles this event
                "message": json.dumps({"type": "user_list", "users": user_list})
            }
        )

    def chat_user_list(self, event):
        # Handler for the chat.user_list event type
        # Send the user list to the WebSocket
        print('chat_user_list', event)
        self.send(text_data=event["message"])
