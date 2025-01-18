from rest_framework import serializers
from application import models

class CreateUserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    username = serializers.EmailField()
    password = serializers.CharField()

class UserSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Users
        fields = ["user_id","username","is_user","is_admin","password","first_name","last_name","email","admin_id"]

    extra_kwargs = {'password': {'write_only': True}, }

    def create(self, validated_data):
        user = models.Users.objects.create_user(**validated_data)
        return user
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Users
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tasks
        fields = "__all__"


class CompleteTaskSerializer(serializers.Serializer):
    task_id = serializers.IntegerField()
    app_id = serializers.CharField()
    upload_screenshot = serializers.FileField()
