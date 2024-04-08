import os

from django.core.management import BaseCommand
from rest_framework.authtoken.models import Token

from users.models import User


class Command(BaseCommand):
    """Создание пользователя для разработки."""
    help = 'Создание пользователя для разработки'

    def handle(self, *args, **kwarg):
        username = os.getenv('DEV_USER_USERNAME', default='dev_user')
        password = os.getenv('DEV_USER_PASSWORD', default='dev_user_password')
        token = os.getenv('DEV_USER_TOKEN')
        if not token:
            self.stdout.write(
                self.style.ERROR('Заполни DEV_USER_TOKEN в файле .env'))
            return
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            user = User.objects.create_user(username=username,
                                            password=password)
            Token.objects.create(user=user, key=token)
            self.stdout.write(
                self.style.SUCCESS('Создан пользователь с токеном'))
            self.stdout.write(f'{username}\n{token}')
