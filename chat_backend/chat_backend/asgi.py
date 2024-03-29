# chat_backend/asgi.py
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_backend.settings')
django_asgi_app = get_asgi_application()

# Importing Django Channels routing here ensures that Django is fully set up
# before importing parts of your application that might depend on the app registry.
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
