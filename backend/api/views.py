from rest_framework import mixins, viewsets

from api.serializers import (CategorySerializer,
                             ServiceSerializer,
                             UserSubscriptionSerializer,
                             SubscriptionSerializer)
from .filters import ServiceSearch, SubscriptionFilter
from subscriptions.models import (Category,
                                  Service,
                                  UserSubscription,
                                  Subscription)


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
    filter_backends = (ServiceSearch,)


class SubscriptionListRetrieveViewSet(mixins.ListModelMixin,
                                      mixins.RetrieveModelMixin,
                                      viewsets.GenericViewSet):
    """Получает варианты подписок или данные о конкретной подписке."""
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    filter_backends = (SubscriptionFilter,)


class UserSubscriptionViewSet(viewsets.ModelViewSet):
    """Получает подписки пользователя."""
    queryset = UserSubscription.objects.all()
    serializer_class = UserSubscriptionSerializer

    def get_queryset(self):
        user = self.request.user
        return UserSubscription.objects.filter(user=user)
