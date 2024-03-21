from rest_framework import mixins, viewsets

from api.serializers import (CategorySerializer,
                             ServiceSerializer,
                             UserSubscriptionSerializer)
from subscriptions.models import Category, Service, UserSubscription


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
    serializer_class = ServiceSerializer


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """Получает подпискки пользователя."""
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer

    def get_queryset(self):
        user = self.request.user
        return UserSubscription.objects.filter(user=user)
