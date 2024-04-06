from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from subscriptions.models import Category, Service, Subscription


User = get_user_model()


class ApiURLTests(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create(username='test_user')
        cls.token = Token.objects.create(user=cls.user)
        cls.client = APIClient()
        cls.client.credentials(HTTP_AUTHORIZATION=f'Token {cls.token.key}')

        cls.category_1 = Category.objects.create(
            name='category_1',
            description='categoty_description_1',
            image='category_image_1.png'
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
        cls.subscription_1 = Subscription.objects.create(
            name='subscription_1',
            description='subscription_description_1',
            price=100,
            months=1,
            service_id=cls.service_1.id,
            cashback=10
        )

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.user.delete()
        cls.token.delete()

    def test_category_list_url_is_correct(self):
        """URL категорий ожидаемый и отдаёт статус код 200."""
        url_categoty_list = reverse('category-list')
        self.assertEqual(url_categoty_list, '/api/v1/categories/')
        response = self.__class__.client.get(url_categoty_list)
        self.assertEqual(response.status_code, 200)

    def test_service_list_url_is_correct(self):
        """URL сервисов ожидаемый и отдаёт статус код 200."""
        url_service_list = reverse('service-list')
        self.assertEqual(url_service_list, '/api/v1/services/')
        response = self.__class__.client.get(url_service_list)
        self.assertEqual(response.status_code, 200)
        response = self.__class__.client.get(url_service_list + 'new/')
        self.assertEqual(response.status_code, 200)
        response = self.__class__.client.get(url_service_list + 'favorites/')
        self.assertEqual(response.status_code, 200)

    def test_service_detail_url_is_correct(self):
        """URL конкретного сервиса ожидаемый и отдаёт статус код 200."""
        url_service_detail = reverse(
            'service-detail', kwargs={'pk': self.category_1.id})
        response = self.__class__.client.get(url_service_detail)
        self.assertEqual(response.status_code, 200)
        response = self.__class__.client.post(url_service_detail + 'favorite/')
        self.assertEqual(response.status_code, 201)

    def test_subsciption_detail_url_is_correct(self):
        """URL подписки ожидаемый и отдаёт статус код 200."""
        url_subscription_detail = reverse(
            'subscription-detail', kwargs={'pk': self.subscription_1.id})
        self.assertEqual(
            url_subscription_detail,
            f'/api/v1/subscriptions/{self.subscription_1.id}/')
        response = self.__class__.client.get(url_subscription_detail)
        self.assertEqual(response.status_code, 200)
        response = self.__class__.client.post(
            url_subscription_detail + 'subscribe/')
        self.assertEqual(response.status_code, 200)

    def test_my_subscriptions_url_is_correct(self):
        """URL моих подписок ожидаемый и отдаёт статус код 200."""
        url_my_subscription_list = reverse('usersubscription-list')
        self.assertEqual(url_my_subscription_list, '/api/v1/mysubscriptions/')
        response = self.__class__.client.get(url_my_subscription_list)
        self.assertEqual(response.status_code, 200)

    def test_payment_url_is_correct(self):
        """URL платежей ожидаемый и отдаёт статус код 200."""
        url_payment_list = reverse('payment-list')
        self.assertEqual(url_payment_list, '/api/v1/payments/')
        response = self.__class__.client.get(url_payment_list)
        self.assertEqual(response.status_code, 200)
        response = self.__class__.client.get(url_payment_list + 'expenses/')
        self.assertEqual(response.status_code, 200)
