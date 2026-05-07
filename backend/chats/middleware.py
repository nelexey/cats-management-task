from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        close_old_connections()
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_params = dict(qp.split("=") for qp in query_string.split("&") if "=" in qp)
        token = query_params.get("token")

        if token:
            try:
                UntypedToken(token)
                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data.get("user_id")
                scope["user"] = await get_user(user_id)
            except (InvalidToken, TokenError, Exception):
                from django.contrib.auth.models import AnonymousUser
                scope["user"] = AnonymousUser()
        else:
            from django.contrib.auth.models import AnonymousUser
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)