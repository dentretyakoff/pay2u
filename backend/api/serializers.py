from datetime import date
from rest_framework import serializers

from payments.models import Payment
from subscriptions.models import (Category,
                                  Service,
                                  UserSubscription,
                                  Subscription)


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категорий."""
    services_count = serializers.IntegerField()

    class Meta:
        model = Category
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор подписок."""
    class Meta:
        model = Subscription
        fields = '__all__'


class ServiceListSerializer(serializers.ModelSerializer):
    """Сериализатор списка сервисов с максимальным кэшбеком его подписок."""
    cashback = serializers.IntegerField()

    class Meta:
        model = Service
        fields = '__all__'


class ServiceRetrieveSerializer(serializers.ModelSerializer):
    """Сериализатор конкретного сервиса со вложенными подписками и значком
    'избранное'.
    """
    subscriptions = SubscriptionSerializer(many=True)
    is_favorited = serializers.SerializerMethodField()

    def get_is_favorited(self, service: Service) -> bool:
        user = self.context['request'].user
        return user.favorites.filter(service=service).exists()

    class Meta:
        model = Service
        fields = '__all__'


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор подписок пользователя."""
    service_name = serializers.SlugRelatedField(
        slug_field='name', source='subscription.service', read_only=True)
    service_color = serializers.SlugRelatedField(
        slug_field='color', source='subscription.service', read_only=True)
    service_image = serializers.SerializerMethodField()
    subscription_name = serializers.SlugRelatedField(
        slug_field='name', source='subscription', read_only=True)
    subscription_price = serializers.SlugRelatedField(
        slug_field='price', source='subscription', read_only=True)

    def get_service_image(self, user_subscription):
        return self.context['request'].build_absolute_uri(
            user_subscription.subscription.service.image.url)

    class Meta:
        model = UserSubscription
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    """Сериализатор оплат подписок пользователя."""
    service_name = serializers.SlugRelatedField(
        slug_field='name',
        source='user_subscription.subscription.service',
        read_only=True)

    class Meta:
        model = Payment
        exclude = ('id', 'user', 'user_subscription')


class ExpensesSerializer(serializers.ModelSerializer):
    """Сериализатор затрат в месяц и общего кешбека пользователя."""
    total_cashback = serializers.SerializerMethodField()
    monthly_expenses = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ('total_cashback', 'monthly_expenses')

    def get_total_cashback(self, payment: Payment) -> int:
        queryset = self.instance.filter(cashback_status=True)
        return sum(payment.cashback for payment in queryset)

    def get_monthly_expenses(self, payment: Payment) -> int:
        year_month = f'{date.today().year}-{date.today().month:02}'
        queryset = self.instance.filter(date__startswith=year_month)
        return sum(payment.amount for payment in queryset)
