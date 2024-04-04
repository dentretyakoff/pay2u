from dateutil.relativedelta import relativedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient, APITestCase

from payments.models import Payment
from subscriptions.models import (
    Category, Favorite, PromoCode, Service, Subscription, UserSubscription)


User = get_user_model()


class ApiViewTests(APITestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User.objects.create(username='test_user')
        token = Token.objects.create(user=cls.user)
        cls.client = APIClient()
        cls.client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

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
        cls.subscription_1 = Subscription.objects.create(
            name='subscription_1',
            description='subscription_description_1',
            price=100,
            months=1,
            service_id=cls.service_1.id,
            cashback=10
        )
        cls.subscription_2 = Subscription.objects.create(
            name='subscription_2',
            description='subscription_description_2',
            price=420,
            months=6,
            service_id=cls.service_1.id,
            cashback=20
        )

        cls.url_categoty_list = reverse('category-list')
        cls.url_service_list = reverse('service-list')
        cls.url_new_service_list = cls.url_service_list + 'new/'
        cls.url_favorite_service_list = cls.url_service_list + 'favorites/'
        cls.url_service_detail = reverse(
            'service-detail', kwargs={'pk': cls.category_1.id})
        cls.url_service_to_favorite = cls.url_service_detail + 'favorite/'
        cls.url_subscription_detail = reverse(
            'subscription-detail', kwargs={'pk': cls.subscription_1.id})
        cls.url_subscribe = cls.url_subscription_detail + 'subscribe/'
        cls.url_my_subscription_list = reverse('usersubscription-list')
        cls.url_payment_list = reverse('payment-list')
        cls.url_payment_expenses = cls.url_payment_list + 'expenses/'

    def test_category_list_returns_all_categories(self):
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

    def test_category_list_returns_correct_fields(self):
        """В категориях возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_categoty_list)
        first_category = response.data[0]
        expected_fields = {'id', 'services_count', 'name', 'description',
                           'image'}
        self.assertEqual(set(first_category), expected_fields)

    def test_category_list_returns_correct_data(self):
        """В категориях возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_categoty_list)
        for category in response.data:
            if category.get('name') == 'category_1':
                break
        expected_data = {
            'name': 'category_1',
            'description': 'categoty_description_1',
            'image': f'http://testserver{settings.MEDIA_URL}category_image_1.png',   # noqa
            'services_count': 2,
        }
        self.assertDictContainsSubset(expected_data, category)

    def test_service_list_returns_all_services(self):
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

    def test_service_list_returns_correct_fields(self):
        """В сервисах возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_service_list)
        first_category = response.data[0]
        expected_fields = {'id', 'cashback', 'name', 'color', 'image'}
        self.assertEqual(set(first_category), expected_fields)

    def test_service_list_returns_correct_data(self):
        """В категориях возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_service_list)
        for service in response.data:
            if service.get('name') == 'service_1':
                break
        expected_data = {
            'name': 'service_1',
            'color': '#111111',
            'image': f'http://testserver{settings.MEDIA_URL}service_logo_1.png',   # noqa
            'cashback': 20,
        }
        self.assertDictContainsSubset(expected_data, service)

    def test_service_list_ordered_by_service_rating(self):
        """Сервисы отсортированы по рейтингу в порядке убывания."""
        response = self.__class__.client.get(self.url_service_list)
        first_service = response.data[0]
        self.assertEqual(first_service['name'], 'service_1')
        self.service_1.rating = 1
        self.service_1.save()
        response = self.__class__.client.get(self.url_service_list)
        first_service = response.data[0]
        self.assertEqual(first_service['name'], 'service_2')

    def test_new_service_list_returns_all_new_services(self):
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

    def test_favorite_service_list_returns_all_favorite_services(self):
        """В избранном возвращаются все, только избранные, сервисы."""
        response = self.__class__.client.get(self.url_favorite_service_list)
        favorite_count = len(response.data)
        favorite_1 = Favorite.objects.create(
            user=self.user, service=self.service_1)
        response = self.__class__.client.get(self.url_favorite_service_list)
        self.assertEqual(len(response.data), favorite_count + 1)
        favorite_1.delete()
        response = self.__class__.client.get(self.url_favorite_service_list)
        self.assertEqual(len(response.data), favorite_count)

    def test_service_list_name_filter(self):
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

    def test_service_list_category_filter(self):
        response = self.__class__.client.get(
            self.url_service_list + '?category_id=1')
        self.assertEqual(len(response.data), 2)
        response = self.__class__.client.get(
            self.url_service_list + '?category_id=2')
        self.assertEqual(len(response.data), 0)

    def test_service_detail_returns_correct_fields(self):
        """В сервисе возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_service_detail)
        expected_fields = {
            'id', 'subscriptions', 'is_favorited', 'name', 'description',
            'image_card', 'category'
        }
        self.assertEqual(set(response.data), expected_fields)
        subscriptions = response.data.get('subscriptions')
        expected_subscription_fields = {
            'id', 'is_subscribe', 'name', 'description', 'price', 'months',
            'cashback', 'service'
        }
        self.assertEqual(set(subscriptions[0]), expected_subscription_fields)

    def test_service_detail_returns_correct_data(self):
        """В сервисе возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_service_detail)
        expected_data = {
            'name': 'service_1',
            'is_favorited': False,
            'description': 'service_description_1',
            'image_card': f'http://testserver{settings.MEDIA_URL}service_card_1.png',   # noqa,
            'category': 1
        }
        self.assertDictContainsSubset(expected_data, response.data)
        subscription = response.data.get('subscriptions')[0]
        expected_subscription_data = {
            'name': 'subscription_1',
            'description': 'subscription_description_1',
            'is_subscribe': False,
            'price': 100,
            'months': 1,
            'cashback': 10
        }
        self.assertDictContainsSubset(expected_subscription_data, subscription)

    def test_subscription_detail_returns_correct_fields(self):
        """В подписке возвращаются ожидаемые поля."""
        response = self.__class__.client.get(self.url_subscription_detail)
        expected_fields = {
            'id', 'is_subscribe', 'name', 'description', 'price', 'months',
            'cashback', 'service'
        }
        self.assertEqual(set(response.data), expected_fields)

    def test_subscription_detail_returns_correct_data(self):
        """В подписке возвращаются корректные данные."""
        response = self.__class__.client.get(self.url_subscription_detail)
        expected_data = {
            'name': 'subscription_1',
            'description': 'subscription_description_1',
            'is_subscribe': False,
            'price': 100,
            'months': 1,
            'cashback': 10
        }
        self.assertDictContainsSubset(expected_data, response.data)

    def test_subscribe_create_relation_first_time(self):
        """Ручка подписки создаёт новую подписку в базе, если таковой нет.
        Повторно создать имеющуюся подписку невозможно."""
        response = self.__class__.client.post(self.url_subscribe)
        self.assertEqual(response.status_code, 200)
        user_sub = UserSubscription.objects.filter(
            user=self.user, subscription=self.subscription_1)
        self.assertTrue(user_sub.exists())
        response = self.__class__.client.post(self.url_subscribe)
        self.assertEqual(response.status_code, 400)
        user_sub = UserSubscription.objects.filter(
            user=self.user, subscription=self.subscription_1)
        self.assertEqual(len(user_sub), 1)
        user_sub.delete()

    def test_subscribe_update_relation_if_relation_exists(self):
        """Ручка подписки активирует имеющуюся существующую подписку и
        задаёт новое время начала и конца действия.
        Если подписка уже активна - модель не должна измениться."""
        UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1, status=False)
        unactive_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        self.assertFalse(unactive_sub.status)

        old_start_date = unactive_sub.start_date
        old_end_date = unactive_sub.end_date
        self.__class__.client.post(self.url_subscribe)
        active_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        self.assertTrue(active_sub.status)
        self.assertNotEqual(old_start_date, active_sub.start_date)
        self.assertNotEqual(old_end_date, active_sub.end_date)

        self.__class__.client.post(self.url_subscribe)
        not_changed_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        self.assertEqual(active_sub, not_changed_sub)

    def test_favorite_post_create_relation(self):
        """Добавление в избранное создаёт связь в БД только если такой нет."""
        favorite = Favorite.objects.filter(
            user=self.user, service=self.service_1)
        self.assertFalse(favorite.exists())

        self.__class__.client.post(self.url_service_to_favorite)
        favorite = Favorite.objects.filter(
            user=self.user, service=self.service_1)
        self.assertTrue(favorite.exists())

        response = self.__class__.client.post(self.url_service_to_favorite)
        self.assertEqual(response.status_code, 400)

    def test_favorite_delete_relation(self):
        """Удаляет связь, только если такая есть."""
        response = self.__class__.client.delete(self.url_service_to_favorite)
        self.assertEqual(response.status_code, 404)
        Favorite.objects.create(user=self.user, service=self.service_1)
        response = self.__class__.client.delete(self.url_service_to_favorite)
        favorite = Favorite.objects.filter(
            user=self.user, service=self.service_1)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(favorite.exists())

    def test_my_subscription_list_returns_active_subscriptions(self):
        """Возвращает все активные подписки пользователя."""
        response = self.__class__.client.get(self.url_my_subscription_list)
        self.assertFalse(response.data)
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        response = self.__class__.client.get(self.url_my_subscription_list)
        self.assertEqual(len(response.data), 1)
        user_sub.status = False
        user_sub.save()
        response = self.__class__.client.get(self.url_my_subscription_list)
        self.assertFalse(response.data)
        user_sub.delete()

    def test_my_subscription_list_false_returns_unactive_subscriptions(self):
        """Возвращает все неактивные подписки пользователя при status=False."""
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        url_my_subscriptions_false = (
            self.url_my_subscription_list + '?status=False')
        response = self.__class__.client.get(url_my_subscriptions_false)
        self.assertFalse(response.data)
        user_sub.status = False
        user_sub.save()
        response = self.__class__.client.get(url_my_subscriptions_false)
        self.assertEqual(len(response.data), 1)
        user_sub.delete()
        response = self.__class__.client.get(url_my_subscriptions_false)
        self.assertFalse(response.data)

    def test_my_subscription_list_ordered_by_end_date(self):
        """Мои подписки отсортированы по дате окончания подписки.
        Время окончания подписки высчитывается из начала и длительности."""
        user_sub_1 = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        user_sub_2 = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_2)
        response = self.__class__.client.get(self.url_my_subscription_list)
        first_sub = response.data[0]
        self.assertEqual(first_sub.get('subscription_name'), 'subscription_1')
        user_sub_2.delete()

        user_sub_2 = UserSubscription.objects.create(
            user=self.user,
            subscription=self.subscription_2,
            start_date=timezone.now()-relativedelta(months=6)
        )
        response = self.__class__.client.get(self.url_my_subscription_list)
        first_sub = response.data[0]
        self.assertEqual(first_sub.get('subscription_name'), 'subscription_2')
        user_sub_1.delete()
        user_sub_2.delete()

    def test_my_subscription_list_returns_correct_fields(self):
        """В моих подписках возвращаются ожидаемые поля."""
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        response = self.__class__.client.get(self.url_my_subscription_list)
        user_sub_data = response.data[0]
        expected_fields = {
            'id', 'service_name', 'service_color', 'service_image',
            'subscription_price', 'subscription_name', 'subscription_price',
            'subscription_months', 'start_date', 'end_date', 'status',
            'renewal_status', 'user', 'subscription',
        }
        self.assertEqual(set(user_sub_data), expected_fields)
        user_sub.delete()

    def test_my_subscription_list_returns_correct_data(self):
        """В моих подписках возвращаются корректные данные."""
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        response = self.__class__.client.get(self.url_my_subscription_list)
        user_sub_data = response.data[0]
        expected_data = {
            'service_name': 'service_1',
            'service_color': '#111111',
            'service_image': f'http://testserver{settings.MEDIA_URL}service_logo_1.png',   # noqa
            'subscription_name': 'subscription_1',
            'subscription_price': 100,
            'subscription_months': 1,
            'status': True,
            'renewal_status': True,
        }
        self.assertDictContainsSubset(expected_data, user_sub_data)
        user_sub.delete()

    def test_my_subscription_detail_returns_correct_fields(self):
        """В подписке возвращаются ожидаемые поля."""
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        url_my_subscription_detail = reverse(
            'usersubscription-detail', kwargs={'pk': user_sub.id})
        response = self.__class__.client.get(url_my_subscription_detail)
        expected_fields = {
            'id', 'service_name', 'service_color', 'service_image',
            'subscription_price', 'subscription_name', 'subscription_price',
            'subscription_months', 'start_date', 'end_date', 'status',
            'renewal_status', 'user', 'subscription',
        }
        self.assertEqual(set(response.data), expected_fields)
        user_sub.delete()

    def test_my_subscription_detail_returns_correct_data(self):
        """В моих подписках возвращаются корректные данные."""
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        url_my_subscription_detail = reverse(
            'usersubscription-detail', kwargs={'pk': user_sub.id})
        response = self.__class__.client.get(url_my_subscription_detail)
        expected_data = {
            'service_name': 'service_1',
            'service_color': '#111111',
            'service_image': f'http://testserver{settings.MEDIA_URL}service_logo_1.png',   # noqa
            'subscription_name': 'subscription_1',
            'subscription_price': 100,
            'subscription_months': 1,
            'status': True,
            'renewal_status': True,
        }
        self.assertDictContainsSubset(expected_data, response.data)
        user_sub.delete()

    def test_subscribe_relate_promocode_to_user_if_exists(self):
        """Новый промокод выдаётся при наличии при создании новой или продлении
        старой подписки. Ручка /promocodes возвращает все промокоды.
        """
        promocode_1 = PromoCode.objects.create(
            code='ABCDEFG1234',
            end_date=timezone.now()+relativedelta(months=1),
            subscription_id=self.subscription_1.id
        )
        promocode_2 = PromoCode.objects.create(
            code='QWERTYU9876',
            end_date=timezone.now()+relativedelta(months=1),
            subscription_id=self.subscription_1.id
        )
        self.__class__.client.post(self.url_subscribe)
        user_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        url_my_subscription_promocodes = reverse(
            'usersubscription-detail', kwargs={'pk': user_sub.id}
        ) + 'promocodes/'
        response = self.__class__.client.get(url_my_subscription_promocodes)
        self.assertEqual(len(response.data), 1)
        self.__class__.client.post(self.url_subscribe)
        self.assertEqual(len(response.data), 1)
        user_sub.status = False
        user_sub.save()
        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(url_my_subscription_promocodes)
        self.assertEqual(len(response.data), 2)
        user_sub.status = False
        user_sub.save()
        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(url_my_subscription_promocodes)
        self.assertEqual(len(response.data), 2)
        user_sub.delete()
        promocode_1.delete()
        promocode_2.delete()

    def test_subscription_detail_promocodes_returns_correct_data(self):
        """Возвращается корректный промокод."""
        promocode_1 = PromoCode.objects.create(
            code='ABCDEFG1234',
            end_date=timezone.now()+relativedelta(months=1),
            subscription_id=self.subscription_1.id
        )
        self.__class__.client.post(self.url_subscribe)
        user_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        url_my_subscription_promocodes = reverse(
            'usersubscription-detail', kwargs={'pk': user_sub.id}
        ) + 'promocodes/'
        response = self.__class__.client.get(url_my_subscription_promocodes)
        promocode_data = response.data[0]
        expected_data = {
            'code': 'ABCDEFG1234',
            'user': self.user.id,
            'subscription': self.subscription_1.id,
            'usage_status': True
        }
        self.assertDictContainsSubset(expected_data, promocode_data)
        user_sub.delete()
        promocode_1.delete()

    def test_subscription_detail_renewal_post_activate_delete_deactivate(self):
        """Post запрос на ручку /renewal включает автопродление подписки,
        delete запрос - отключает автопродление.
        При создании подписки автопродление включено по умолчанию.
        """
        user_sub = UserSubscription.objects.create(
            user=self.user, subscription=self.subscription_1)
        self.assertTrue(user_sub.renewal_status)
        url_my_subscription_renewal = reverse(
            'usersubscription-detail', kwargs={'pk': user_sub.id}
        ) + 'renewal/'
        response = self.__class__.client.delete(url_my_subscription_renewal)
        self.assertFalse(response.data.get('renewal_status'))
        response = self.__class__.client.post(url_my_subscription_renewal)
        self.assertTrue(response.data.get('renewal_status'))

    def test_subscribe_create_payment_when_created_or_activated(self):
        """При подключении или повторной активации подписки создаётся чек
        об оплате. Все чеки пользователя отдаются через ручку /payments.
        """
        self.__class__.client.post(self.url_subscribe)
        user_sub = UserSubscription.objects.get(
            user=self.user, subscription=self.subscription_1)
        response = self.__class__.client.get(self.url_payment_list)
        payment = response.data[0]
        expected_data = {
            "service_name": "service_1",
            "amount": 100,
            "cashback": 10,
            "cashback_status": False,
        }
        self.assertDictContainsSubset(expected_data, payment)

        first_payment_datetime = payment.get('date')
        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(self.url_payment_list)
        payment = response.data[0]
        self.assertEqual(payment.get('date'), first_payment_datetime)

        user_sub.status = False
        user_sub.save()
        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(self.url_payment_list)
        payment = response.data[0]
        self.assertNotEqual(payment.get('date'), first_payment_datetime)

    def test_payment_list_returns_correct_data(self):
        """Чеки возвращаются корректно, новый чек добавляется сверху."""
        Payment.objects.all().delete()
        response = self.__class__.client.get(self.url_payment_list)
        self.assertFalse(response.data)

        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(self.url_payment_list)
        self.assertEqual(len(response.data), 1)
        new_payment = response.data[0]
        expected_data = {
            "service_name": "service_1",
            "amount": 100,
            "cashback": 10,
            "cashback_status": False,
        }
        self.assertDictContainsSubset(expected_data, new_payment)

        url_subscribe_subscription_2 = reverse(
            'subscription-detail', kwargs={'pk': self.subscription_2.id}
        ) + 'subscribe/'
        self.__class__.client.post(url_subscribe_subscription_2)
        response = self.__class__.client.get(self.url_payment_list)
        self.assertEqual(len(response.data), 2)
        new_payment = response.data[0]
        expected_data = {
            "service_name": "service_1",
            "amount": 420,
            "cashback": 84,
            "cashback_status": False,
        }
        self.assertDictContainsSubset(expected_data, new_payment)
        UserSubscription.objects.all().delete()

    def test_payment_expenses_return_correct_data(self):
        """Подсчёт потраченной суммы и кэшбэка осуществляется корректно."""
        Payment.objects.all().delete()
        response = self.__class__.client.get(self.url_payment_expenses)
        expected_data = {'total_cashback': 0, 'monthly_expenses': 0}
        self.assertDictEqual(response.data, expected_data)

        self.__class__.client.post(self.url_subscribe)
        response = self.__class__.client.get(self.url_payment_expenses)
        expected_data = {'total_cashback': 0, 'monthly_expenses': 100}
        self.assertDictEqual(response.data, expected_data)

        url_subscribe_subscription_2 = reverse(
            'subscription-detail', kwargs={'pk': self.subscription_2.id}
        ) + 'subscribe/'
        self.__class__.client.post(url_subscribe_subscription_2)
        response = self.__class__.client.get(self.url_payment_expenses)
        expected_data = {'total_cashback': 0, 'monthly_expenses': 520}
        self.assertDictEqual(response.data, expected_data)

        Payment.objects.all().update(cashback_status=True)
        response = self.__class__.client.get(self.url_payment_expenses)
        expected_data = {'total_cashback': 94, 'monthly_expenses': 520}
        self.assertDictEqual(response.data, expected_data)
        UserSubscription.objects.all().delete()
