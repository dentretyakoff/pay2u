from rest_framework import serializers

from subscriptions.models import Category, Service


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категорий."""
    services_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = '__all__'

    def get_services_count(self, obj):
        return obj.services.count()


class ServiceSerializer(serializers.ModelSerializer):
    """Сериализатор сервисов."""
    class Meta:
        model = Service
        fields = '__all__'
