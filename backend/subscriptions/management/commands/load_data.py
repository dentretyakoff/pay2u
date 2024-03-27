import json
import os
from datetime import datetime

from django.core.files import File
from django.core.management import BaseCommand
from django.conf import settings

from subscriptions.models import (Service, Category,
                                  Subscription, PromoCode)


class Command(BaseCommand):
    """Менеджмент-команда для загрузки тестовых данных."""
    help = 'Загрузить тестовые данные'

    def handle(self, *args, **kwarg):
        data_dir = settings.BASE_DIR / 'test_data'
        services_data = data_dir / 'services.json'
        categories_data = data_dir / 'categories.json'
        subscriptions_data = data_dir / 'subscriptions.json'
        promocodes_data = data_dir / 'promocodes.json'
        try:
            # Загрузка категорий
            with open(categories_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for category_data in data:
                    category, created = Category.objects.get_or_create(
                        name=category_data['name'],
                        description=category_data['description'])
                    image_path = data_dir.joinpath(
                        'categories_img', category_data['image'])
                    if created:
                        with open(image_path, 'rb') as img:
                            category.image.save(os.path.basename(image_path),
                                                File(img), save=True)
            self.stdout.write(self.style.SUCCESS(
                'Категории загружены загружены.'))

            # Загрузка сервисов
            with open(services_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for service_data in data:
                    category = Category.objects.get(
                        id=service_data['category_id'])
                    service, created = Service.objects.get_or_create(
                        name=service_data['name'],
                        description=service_data['description'],
                        color=service_data['color'],
                        rating=service_data['rating'],
                        created=datetime.fromisoformat(service_data['created']),  # noqa
                        category=category)
                    if created:
                        image_path = data_dir.joinpath(
                            'services_img', service_data['logo'])
                        with open(image_path, 'rb') as img:
                            service.image.save(os.path.basename(image_path),
                                               File(img), save=True)
            self.stdout.write(self.style.SUCCESS('Сервисы загружены.'))

            # Загрузка подписок
            with open(subscriptions_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for subscription_data in data:
                    service = Service.objects.get(
                        id=subscription_data['service_id'])
                    Subscription.objects.get_or_create(
                        name=subscription_data['name'],
                        description=subscription_data['description'],
                        price=subscription_data['price'],
                        months=subscription_data['months'],
                        cashback=subscription_data['cashback'],
                        service=service)
            self.stdout.write(self.style.SUCCESS('Подписки загружены.'))

            # Загрузка промокодов
            with open(promocodes_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for promocode_data in data:
                    PromoCode.objects.get_or_create(
                        code=promocode_data['code'],
                        end_date=promocode_data['end_date'],
                        subscription_id=promocode_data['subscription_id'])
            self.stdout.write(self.style.SUCCESS('Промокоды загружены.'))
        except Exception as e:
            print(f'Ошибка загрузки данных: {e}')
