from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from application.application_services import admin_service, user_service
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include
from app_tracking_system import settings
from django.conf.urls.static import static


schema_view = get_schema_view(
    openapi.Info(
        title="Application Tracking System",
        default_version="v1",
        description="API for Tracking the Application Downloaded by the user",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="support@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('jwt_token/',
         include([
             path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
             # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
             # path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify')
         ]
         )),
    path('user_service/',
         include([
             path('user_signup/', user_service.UserSignup.as_view()),
             path('view_user_profile', user_service.ViewUserProfile.as_view()),
            path('view_task/', user_service.TaskAssignedforUser.as_view()),
             path('task_by_user', user_service.UpdateTaskbyUser.as_view()),

         ])),
    path('admin_service/',include([
            path('create_app/', admin_service.CreateAppForUser.as_view()),
            path('create_task/',admin_service.CreateTask.as_view()),
             path('view_users/', admin_service.ViewUsers.as_view()),
             path('view_apps/', admin_service.ViewApp.as_view()),
    ]))
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
