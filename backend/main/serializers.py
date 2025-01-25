import json

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['roles'] = json.loads(instance.roles)  # Parse the string into JSON
        return data

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'roles']
