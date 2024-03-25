import json
import os

from django.core.files import File
from django.core.management import BaseCommand
from django.conf import settings

from subscriptions.models import Service, Category, Subscription


class Command(BaseCommand):
    """Менеджмент-команда для загрузки тестовых данных."""
    help = 'Загрузить тестовые данные'

    def handle(self, *args, **kwarg):
        data_dir = settings.BASE_DIR / 'test_data'
        service_data = data_dir / 'services.json'
        category_data = data_dir / 'categories.json'
        subscription_data = data_dir / 'subscriptions.json'
        try:
            # Загрузка категорий
            with open(category_data, encoding='utf-8') as json_file:
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
            with open(service_data, encoding='utf-8') as json_file:
                data = json.load(json_file)
                for service_data in data:
                    category = Category.objects.get(
                        id=service_data['category_id'])
                    service, created = Service.objects.get_or_create(
                        name=service_data['name'],
                        description=service_data['description'],
                        color=service_data['color'],
                        rating=service_data['rating'],
                        category=category)
                    if created:
                        image_path = data_dir.joinpath(
                            'services_img', service_data['logo'])
                        with open(image_path, 'rb') as img:
                            service.image.save(os.path.basename(image_path),
                                               File(img), save=True)
            self.stdout.write(self.style.SUCCESS('Сервисы загружены.'))

            # Загрузка подписок
            with open(subscription_data, encoding='utf-8') as json_file:
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
        except Exception as e:
            print(f'Ошибка загрузки данных: {e}')
