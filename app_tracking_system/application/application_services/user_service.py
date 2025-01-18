from rest_framework.generics import CreateAPIView, RetrieveAPIView, GenericAPIView
from rest_framework.response import Response
from application.application_serializers import user_serializers
from application import models
from app_tracking_system import settings
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser
import random, string,os


class UserSignup(CreateAPIView):
    """This class is to Register the User"""
    permission_classes = [AllowAny, ]
    serializer_class = user_serializers.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        try:
            request.data["username"] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
            request.data['user_id'] = "USR_" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
            request.data['is_admin'] = 0
            request.data['is_user'] = 1
            request.data["admin_id"] = "USR_9BSN4"
            user = models.Users.objects.filter(email=request.data["email"])
            if user:
                return Response({"status_code": 400,
                                 "message": "Email already registered Please Login",
                                 "error": None,
                                 "data": []})
            serializer = user_serializers.UserSignupSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({"status_code": 200,
                                 "message": "User Registered Successfully",
                                 "error": None,
                                 "data": serializer.data})
            else:
                return Response({"status_code": 400,
                                 "message": "Unable to Registered User",
                                 "error": str(serializer.errors),
                                 "data": []})
        except Exception as error:
            return Response({"status_code": 500,
                             "message": "Unable to Registered User",
                             "error": str(error),
                             "data": []})


class ViewUserProfile(RetrieveAPIView):
    """This class is to view the user profile"""
    permission_classes = [IsAuthenticated]
    serializer_class = user_serializers.UserSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            user_data = user_serializers.UserSerializer(request.user)
            return Response({"status_code": 200,
                             "error": None,
                             "data": user_data.data})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})


class TaskAssignedforUser(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    """This class is to retrieve the task that is assigned for the user"""

    def retrieve(self, request, *args, **kwargs):
        try:
            tasks = models.Tasks.objects.filter(user_id=request.user.user_id, is_completed=0)
            serializer_class = user_serializers.TaskSerializer(tasks,many=True)
            return Response({"status_code": 200,
                             "error": None,
                             "data": serializer_class.data})
        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})


class UpdateTaskbyUser(CreateAPIView):
    parser_classes = [MultiPartParser,]
    permission_classes = [IsAuthenticated]
    serializer_class = user_serializers.CompleteTaskSerializer

    def post(self, request, *args, **kwargs):
        try:
            task = models.Tasks.objects.filter(task_id=request.data['task_id'])
            if task:
                request.mutable = True
                mutable_data = request.data.copy()

                file = request.FILES.get("upload_screenshot")
                file_path = os.path.join(settings.MEDIA_ROOT, file.name)
                # file_path = file_path.replace("\\", "/")
                # Save the file to the specified directory
                with open(file_path, "wb") as dest:
                    for chunk in file.chunks():  # Handle large files by writing in chunks
                        dest.write(chunk)

                relative_path = os.path.relpath(file_path, "C:/project_files/test_060125_frontend/my-react-app/public")
                relative_path = relative_path.replace("\\", "/")

                task.update(is_completed=1,screenshot=relative_path)
                return Response({"status_code": 200,
                                 "error": None,
                                 "data": []})
            else:
                return Response({"status_code": 400,
                                 "error": "Task does not exist",
                                 "data": []})

        except Exception as error:
            return Response({"status_code": 500,
                             "error": str(error),
                             "data": []})



