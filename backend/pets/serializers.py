from rest_framework import serializers
from .models import Cat

class CatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cat
        fields = ['id', 'name', 'birth_date', 'gender', 'color', 'owner']
        read_only_fields = ['owner']
