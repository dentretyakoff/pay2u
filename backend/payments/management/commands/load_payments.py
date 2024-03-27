import json
from datetime import datetime

from django.core.management import BaseCommand
from django.conf import settings

from payments.models import Payment
from subscriptions.models import UserSubscription
from users.models import User


class Command(BaseCommand):
    """Менеджмент-команда для загрузки тестовых оплат."""
    help = 'Загрузить тестовые данные оплат подписок'

    def handle(self, *args, **kwarg):
        data_dir = settings.BASE_DIR / 'test_data'
        payments_data = data_dir / 'payments.json'
        user_subscriptions = data_dir / 'user_subscriptions.json'
        user = User.objects.get(username='dev_user')
        try:
            # Создание подписок пользователя
            with open(user_subscriptions, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for user_sub_data in data:
                    UserSubscription.objects.get_or_create(
                        start_date=datetime.fromisoformat(user_sub_data['start_date']),  # noqa
                        end_date=datetime.fromisoformat(user_sub_data['end_date']),  # noqa
                        user=user,
                        subscription_id=user_sub_data['subscription_id'])
            self.stdout.write(self.style.SUCCESS(
                'Подписки пользователя загружены.'))

            # Изменение кешбэка
            with open(payments_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for payment_data in data:
                    payment = Payment.objects.get(
                        pk=payment_data['payment_id'])
                    payment.cashback_status = payment_data['cashback_status']
                    payment.save()
            self.stdout.write(self.style.SUCCESS(
                'Статусы кешбэков изменены.'))
        except Exception as e:
            print(f'Ошибка загрузки оплат: {e}')
