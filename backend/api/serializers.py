from rest_framework import serializers

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


class ServiceSerializer(serializers.ModelSerializer):
    """Сериализатор сервисов."""
    class Meta:
        model = Service
        fields = '__all__'


class ServiceRetrieveSerializer(ServiceSerializer):
    """Сериализатор конкретного сервиса со вложенными подписками."""
    subscriptions = SubscriptionSerializer(many=True)
    is_favorited = serializers.SerializerMethodField()

    def get_is_favorited(self, service: Service) -> bool:
        user = self.context['request'].user
        return user.favorites.filter(service=service).exists()


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор подписок пользователя."""
    service_name = serializers.SlugRelatedField(slug_field='name',
                                                source='subscription.service',
                                                read_only=True)
    service_color = serializers.SlugRelatedField(slug_field='color',
                                                 source='subscription.service',
                                                 read_only=True)
    service_image = serializers.SlugRelatedField(slug_field='image.url',
                                                 source='subscription.service',
                                                 read_only=True)
    subscription_name = serializers.SlugRelatedField(slug_field='name',
                                                     source='subscription',
                                                     read_only=True)
    subscription_price = serializers.SlugRelatedField(slug_field='price',
                                                      source='subscription',
                                                      read_only=True)

    class Meta:
        model = UserSubscription
        fields = '__all__'
