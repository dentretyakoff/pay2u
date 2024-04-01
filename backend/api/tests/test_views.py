import shutil
import tempfile

from django.conf import settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase, override_settings

from subscriptions.models import Category, Service


TEMP_MEDIA_ROOT = tempfile.mkdtemp(dir=settings.BASE_DIR)

User = get_user_model()


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class ApiViewTests(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        user = User.objects.create(username='test_user')
        cls.token = Token.objects.create(user=user)
        cls.client = APIClient()
        cls.client.credentials(HTTP_AUTHORIZATION=f'Token {cls.token.key}')

        cls.url_categoty_list = reverse('category-list')
        cls.url_service_list = reverse('service-list')
        cls.url_new_service_list = cls.url_service_list + 'new/'
        cls.url_favorite_services_list = cls.url_service_list + 'favorite/'

        cls.category_1 = Category.objects.create(
            name='category_1',
            description='categoty_description_1',
            image='category_image_1.png'
        )
        cls.category_2 = Category.objects.create(
            name='category_2',
            description='category_description_2',
            image='category_image_2.png'
        )
        cls.service_1 = Service.objects.create(
            name='service_1',
            description='service_description_1',
            color='#111111',
            image='service_logo_1.png',
            image_card='service_card_1.png',
            category_id=cls.category_1.id,
            rating=10,
            created='2024-01-01T08:00:00+07:00'
        )
        cls.service_2 = Service.objects.create(
            name='service_2',
            description='service_description_2',
            color='#222222',
            image='service_logo_2.png',
            image_card='service_card_2.png',
            category_id=cls.category_1.id,
            rating=5,
            created='2024-01-01T08:00:00+07:00'
        )

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEMP_MEDIA_ROOT, ignore_errors=True)

    def test_categories_list_returns_all_categories(self):
        """В категориях возвращаются все категории."""
        response = self.__class__.client.get(self.url_categoty_list)
        self.assertEqual(len(response.data), 2)
        new_category = Category.objects.create(
            name='category_3',
            description='description_3',
            image='image_3')
        response = self.__class__.client.get(self.url_categoty_list)
        self.assertEqual(len(response.data), 3)
        new_category.delete()
        response = self.__class__.client.get(self.url_categoty_list)
        self.assertEqual(len(response.data), 2)

    def test_categories_list_returns_correct_fields(self):
        """В категориях возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_categoty_list)
        first_category = response.data[0]
        expected_fields = {'id', 'services_count', 'name', 'description',
                           'image'}
        self.assertEqual(set(first_category), expected_fields)

    def test_categories_list_returns_correct_data(self):
        """В категориях возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_categoty_list)
        for category in response.data:
            if category['name'] == 'category_1':
                break
        expected_data = {
            'name': 'category_1',
            'description': 'categoty_description_1',
            'image': f'http://testserver{settings.MEDIA_URL}category_image_1.png',   # noqa
            'services_count': 2,
        }
        self.assertDictContainsSubset(expected_data, category)

    def test_services_list_returns_all_services(self):
        """В сервисах возвращаются все сервисы."""
        response = self.__class__.client.get(self.url_service_list)
        self.assertEqual(len(response.data), 2)
        new_service = Service.objects.create(
            name='service_3',
            description='service_description_3',
            color='#333333',
            image='service_logo_3.png',
            image_card='service_card_3.png',
            category_id=self.category_1.id,
            rating=1,
            created='2024-01-01T08:00:00+07:00')
        response = self.__class__.client.get(self.url_service_list)
        self.assertEqual(len(response.data), 3)
        new_service.delete()
        response = self.__class__.client.get(self.url_service_list)
        self.assertEqual(len(response.data), 2)

    def test_services_list_returns_correct_fields(self):
        """В сервисах возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_service_list)
        first_category = response.data[0]
        expected_fields = {'id', 'cashback', 'name', 'color', 'image'}
        self.assertEqual(set(first_category), expected_fields)

    def test_services_list_returns_correct_data(self):
        """В категориях возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_service_list)
        for service in response.data:
            if service['name'] == 'service_1':
                break
        expected_data = {
            'name': 'service_1',
            'color': '#111111',
            'image': f'http://testserver{settings.MEDIA_URL}service_logo_1.png',   # noqa
        }
        self.assertDictContainsSubset(expected_data, service)

    def test_services_list_ordered_by_service_rating(self):
        """Сервисы отсортированы по рейтингу в порядке убывания."""
        response = self.__class__.client.get(self.url_service_list)
        first_service = response.data[0]
        self.assertEqual(first_service['name'], 'service_1')
        self.service_1.rating = 1
        self.service_1.save()
        response = self.__class__.client.get(self.url_service_list)
        first_service = response.data[0]
        self.assertEqual(first_service['name'], 'service_2')

    def test_new_services_list_returns_all_new_services(self):
        """В новых сервисах возвращаются все, только новые, сервисы."""
        response = self.__class__.client.get(self.url_new_service_list)
        servicies_count = len(response.data)
        old_service = Service.objects.create(
            name='old_service',
            description='old_service_description_3',
            color='#333333',
            image='old_service_logo_3.png',
            image_card='old_service_card_3.png',
            category_id=self.category_1.id,
            rating=1,
            created='2023-01-01T08:00:00+07:00')
        response = self.__class__.client.get(self.url_new_service_list)
        self.assertEqual(len(response.data), servicies_count)
        new_service = Service.objects.create(
            name='new_service',
            description='new_service_description_3',
            color='#333333',
            image='new_service_logo_3.png',
            image_card='new_service_card_3.png',
            category_id=self.category_1.id,
            rating=1,
            created=timezone.now())
        response = self.__class__.client.get(self.url_new_service_list)
        self.assertEqual(len(response.data), servicies_count + 1)
        old_service.delete()
        new_service.delete()
        response = self.__class__.client.get(self.url_new_service_list)
        self.assertEqual(len(response.data), servicies_count)

    def test_services_name_filter(self):
        """В сервисах работает фильтр по имени сервиса."""
        response = self.__class__.client.get(
            self.url_service_list + '?name=s')
        self.assertEqual(len(response.data), 2)
        response = self.__class__.client.get(
            self.url_service_list + '?name=service_1')
        self.assertEqual(len(response.data), 1)
        response = self.__class__.client.get(
            self.url_service_list + '?name=404')
        self.assertEqual(len(response.data), 0)

    def test_services_category_filter(self):
        response = self.__class__.client.get(
            self.url_service_list + '?category_id=1')
        self.assertEqual(len(response.data), 2)
        response = self.__class__.client.get(
            self.url_service_list + '?category_id=2')
        self.assertEqual(len(response.data), 0)
