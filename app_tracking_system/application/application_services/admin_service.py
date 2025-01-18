from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.response import Response
from application.application_serializers import admin_serializers
from application import models
from rest_framework.permissions import IsAuthenticated
from app_tracking_system import settings
import base64
from rest_framework.parsers import MultiPartParser
import random,string,os


class CreateAppForUser(CreateAPIView):
    """This class is to create an App to the user"""
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser,]
    serializer_class = admin_serializers.CreateAppSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            request.mutable = True
            mutable_data = request.data.copy()

            file= request.FILES.get("image")
            # upload_dir = os.path.join(settings.BASE_DIR, "uploads")
            #
            # # Create the directory if it doesn't exist
            # os.makedirs(upload_dir, exist_ok=True)

            # Define the file path
            file_path = os.path.join(settings.MEDIA_ROOT, file.name)
            # file_path = file_path.replace("\\", "/")
            # Save the file to the specified directory
            with open(file_path, "wb") as dest:
                for chunk in file.chunks():  # Handle large files by writing in chunks
                    dest.write(chunk)

            relative_path = os.path.relpath(file_path, "C:/project_files/test_060125_frontend/my-react-app/public")
            relative_path = relative_path.replace("\\", "/")
            print(relative_path)

            # Optional: Save the file path in the database
            mutable_data["app_logo"] = relative_path
            mutable_data["app_created_by"] = user.user_id
            mutable_data["app_id"] = "APP"+''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
            serialiser_class = admin_serializers.SaveAppSerializer(data=mutable_data)
            if serialiser_class.is_valid():
                serialiser_class.save()

                return Response({"status_code":200,
                                 "error":None,
                                 "data":serialiser_class.data})
            else:
                return Response({"status_code": 400,
                                 "error": str(serialiser_class.errors),
                                 "data":[]})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})

class CreateTask(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = admin_serializers.CreateTaskSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            print(user)
            task = {"user":request.data["to_user"],
                    "admin":user.user_id,
                    "app":request.data["app_id"],
                    "is_completed":0,
                    "screenshot":""}

            serialiser_class = admin_serializers.SaveTaskSerializer(data=task)
            if serialiser_class.is_valid():
                serialiser_class.save()

                return Response({"status_code": 200,
                                 "error": None,
                                 "data": serialiser_class.data})
            else:
                return Response({"status_code": 400,
                                 "error": str(serialiser_class.errors),
                                 "data": []})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})

class ViewUsers(ListAPIView):
    """This class is to view the users who all are added by the admin"""
    permission_classes = [IsAuthenticated]
    serializer_class = admin_serializers.ListUserSerializer
    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            admin_users = models.Users.objects.filter(admin_id=user.user_id)
            serialiser_class = admin_serializers.ListUserSerializer(instance=admin_users,many=True)
            return Response({"status_code":200,
                             "error":None,
                             "data":serialiser_class.data})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})

class ViewApp(ListAPIView):
    """This class is to view the app created by the admin"""
    permission_classes = [IsAuthenticated]
    serializer_class = admin_serializers.ListUserSerializer

    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            admin_apps = models.Apps.objects.filter(app_created_by=user.user_id)
            serialiser_class = admin_serializers.SaveAppSerializer(instance=admin_apps, many=True)
            return Response({"status_code": 200,
                             "error": None,
                             "data": serialiser_class.data})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})

