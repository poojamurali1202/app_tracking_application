from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission
from django.contrib.auth.base_user import BaseUserManager


class Apps(models.Model):
    app_id = models.CharField(primary_key=True, max_length=100)
    app_name = models.CharField(max_length=100, blank=False, null=False)
    app_link = models.CharField(max_length=100, blank=False, null=False)
    app_points = models.IntegerField(blank=False,null=False)
    app_logo = models.TextField(null=False,blank=False)
    app_created_by = models.ForeignKey("Users", models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserManager(BaseUserManager):
    def create_user(self,
                    username: str,
                    password: str,
                    is_staff=False,
                    is_superuser=True,
                    **extra_fields

                    ) -> "Users":
        if not username:
            raise ValueError("User must have an email")

        users = self.model(username=username, **extra_fields)
        users.set_password(password)
        users.is_active = True
        users.is_staff = is_staff
        users.is_superuser = is_superuser
        users.save()

        return users

class Users(AbstractUser):
    username = models.CharField(max_length=10,unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    is_staff = models.IntegerField()
    is_active = models.IntegerField(blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    user_id = models.CharField(primary_key=True, max_length=10)
    user_phone = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255)
    is_admin = models.IntegerField()
    is_user = models.IntegerField()
    admin_id = models.ForeignKey("Users", models.DO_NOTHING, blank=True, null=True,related_name="Admin")
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',  # Specify custom related name
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',  # Specify custom related name
        blank=True
    )

    objects = UserManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ["user_id"]

class Tasks(models.Model):
    task_id = models.AutoField(primary_key=True)
    is_completed = models.IntegerField()
    screenshot = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    admin = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True,db_column='admin_id')
    app = models.ForeignKey("Apps", models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, related_name='applicationtasks_user_set', blank=True, null=True)


