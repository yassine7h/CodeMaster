from django.contrib.auth.models import Group, User
from rest_framework import serializers
from subprocess import run


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class CodeResultSerializer(serializers.Serializer):

    def execute(self, payload):
        command = ["python", "-c", payload]
        output = run(command, check=True, capture_output=True, text=True)
        if output.stdout is not None and output.stdout != "":
            print(output.stdout)
        if output.stderr is not None and output.stderr != "":
            print(output.stderr)
