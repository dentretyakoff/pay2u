import csv
import os
from datetime import timedelta

from django.core.files import File
from django.core.management import BaseCommand
from django.conf import settings

from subscriptions.models import Service, Category, Subscription


class Command(BaseCommand):
    """Менеджмент-команда для загрузки тестовых данных."""
    help = 'Загрузить тестовые данные'

    def handle(self, *args, **kwarg):
        data_dir = settings.BASE_DIR / 'test_data'
        service_data = data_dir / 'services.csv'
        category_data = data_dir / 'categories.csv'
        subscription_data = data_dir / 'subscriptions.csv'
        try:
            # Загрузка сервисов
            with open(service_data, encoding='utf-8') as csv_file:
                reader = csv.reader(csv_file)
                for row in reader:
                    service, _ = Service.objects.get_or_create(
                        name=row[0],
                        description=row[1],
                        color=row[2])
                    image_path = data_dir.joinpath('services_img', row[3])
                    with open(image_path, 'rb') as img:
                        service.image.save(os.path.basename(image_path),
                                           File(img), save=True)
            self.stdout.write(self.style.SUCCESS('Сервисы загружены.'))

            # Загрузка категорий
            with open(category_data, encoding='utf-8') as csv_file:
                reader = csv.reader(csv_file)
                for row in reader:
                    category, _ = Category.objects.get_or_create(
                        name=row[0], description=row[1],)
                    image_path = data_dir.joinpath('categories_img', row[2])
                    with open(image_path, 'rb') as img:
                        category.image.save(os.path.basename(image_path),
                                            File(img), save=True)
            self.stdout.write(self.style.SUCCESS(
                'Категории загружены загружены.'))

            # Загрузка подписок
            with open(subscription_data, encoding='utf-8') as csv_file:
                reader = csv.reader(csv_file)
                for row in reader:
                    service = Service.objects.get(id=int(row[4]))
                    category = Category.objects.get(id=int(row[5]))
                    Subscription.objects.get_or_create(
                        name=row[0],
                        description=row[1],
                        price=int(row[2]),
                        duration=timedelta(int(row[3])),
                        service=service,
                        category=category)
            self.stdout.write(self.style.SUCCESS('Подписки загружены.'))
        except Exception as e:
            print(f'Ошибка загрузки данных: {e}')
