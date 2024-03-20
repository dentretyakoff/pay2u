from rest_framework import serializers

from subscriptions.models import Category, Service


class CategorySerializer(serializers.ModelSerializer):
    """Сериализатор категорий."""
    class Meta:
        model = Category
        fields = '__all__'


class ServiceSerializer(serializers.ModelSerializer):
    """Сериализатор сервисов."""
    class Meta:
        model = Service
        fields = '__all__'
