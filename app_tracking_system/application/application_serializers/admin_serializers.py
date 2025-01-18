from rest_framework import serializers
from application import models

class CreateAppSerializer(serializers.Serializer):
    app_name = serializers.CharField(required=True,max_length=50)
    app_link = serializers.CharField(required=True,max_length=100)
    app_category = serializers.CharField(required=True)
    app_subcategory = serializers.CharField(required=True)
    app_points = serializers.IntegerField(required=True)
    image = serializers.FileField(required=True)

class SaveAppSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Apps
        fields = "__all__"


class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Users
        fields = "__all__"

class CreateTaskSerializer(serializers.Serializer):
    app_id = serializers.CharField()
    to_user = serializers.CharField()

class SaveTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tasks
        fields = "__all__"