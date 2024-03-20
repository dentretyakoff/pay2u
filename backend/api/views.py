from rest_framework import mixins, viewsets

from api.serializers import CategorySerializer
from subscriptions.models import Category, Service


class CategoryListRetrieveViewSet(mixins.ListModelMixin,
                                  mixins.RetrieveModelMixin,
                                  viewsets.GenericViewSet):
    """Получает категории списком или по одной."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ServiceListRetrieveViewSet(mixins.ListModelMixin,
                                 mixins.RetrieveModelMixin,
                                 viewsets.GenericViewSet):
    """Получает сервисы списком или по одному."""
    queryset = Service.objects.all()
    serializer_class = CategorySerializer
