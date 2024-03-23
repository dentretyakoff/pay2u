from rest_framework import serializers

from subscriptions.models import (Category,
                                  Service,
                                  UserSubscription,
                                  Subscription)


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категорий."""
    services_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_services_count(self, obj):
        return obj.services.count()


class SubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор подписок."""
    class Meta:
        model = Subscription
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    """Сериализатор сервисов."""
    class Meta:
        model = Service
        fields = '__all__'


class ServiceRetrieveSerializer(ServiceSerializer):
    """Сериализатор конкретного сервиса со вложенными подписками."""
    subscriptions = SubscriptionSerializer(many=True)


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор подписок пользователя."""
    class Meta:
        model = UserSubscription
        fields = '__all__'
