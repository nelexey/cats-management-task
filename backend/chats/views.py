from rest_framework import generics, permissions
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer

class ChatHistoryView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        other_id = self.kwargs['other_user_id']
        return Message.objects.filter(
            (Q(sender=user) & Q(recipient_id=other_id)) |
            (Q(sender_id=other_id) & Q(recipient=user))
        ).order_by('created_at')