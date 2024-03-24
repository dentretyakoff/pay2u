from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F
from django.db import IntegrityError
from django.utils import timezone
from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializers import (CategorySerializer,
                             ServiceSerializer,
                             ServiceRetrieveSerializer,
                             UserSubscriptionSerializer,
                             SubscriptionSerializer)
from .filters import ServiceSearch, SubscriptionFilter, UserSubscriptionFilter
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

    def retrieve(self, request, *args, **kwargs):
        self.queryset = Service.objects.prefetch_related('subscriptions').all()
        self.serializer_class = ServiceRetrieveSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=('get',))
    def new(self, request):
        """Список новых сервисов."""
        date_delta = timezone.now() - timezone.timedelta(settings.DATE_DELTA)
        services = self.get_queryset().filter(created__gt=date_delta)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=('get',))
    def favorites(self, request):
        """Список избранных сервисов пользователя."""
        favorites = self.request.user.favorites.all()
        services = Service.objects.filter(favorites__in=favorites)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=('post', 'delete'))
    def favorite(self, request, pk=None):
        """Добавить/удалить сервис в избранном пользователя."""
        service = self.get_object()
        if request.method == 'POST':
            try:
                service.favorites.create(user=request.user)
                return Response(status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response(
                    {'error': 'Уже в избранном'},
                    status=status.HTTP_400_BAD_REQUEST)
        if request.method == 'DELETE':
            try:
                favorite = service.favorites.get(user=request.user)
                favorite.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except ObjectDoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)


class SubscriptionListRetrieveViewSet(mixins.ListModelMixin,
                                      mixins.RetrieveModelMixin,
                                      viewsets.GenericViewSet):
    """Получает варианты подписок или данные о конкретной подписке."""
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    filter_backends = (SubscriptionFilter,)

    @action(detail=True, methods=('post',))
    def subscribe(self, request, pk=None):
        subscription = self.get_object()
        user = request.user
        serializer = SubscriptionSerializer(instance=subscription)
        if user.my_subscriptions.filter(subscription=subscription).exists():
            return Response({'error': 'Уже в подписках.'},
                            status=status.HTTP_400_BAD_REQUEST)
        subscription.subscribers.create(user=user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserSubscriptionViewSet(mixins.ListModelMixin,
                              mixins.RetrieveModelMixin,
                              viewsets.GenericViewSet):
    """Получает подписки пользователя."""
    queryset = UserSubscription.objects.select_related('subscription')\
        .annotate(service_name=F('subscription__service__name'))\
        .order_by('end_date').all()
    serializer_class = UserSubscriptionSerializer
    filter_backends = (UserSubscriptionFilter,)

    @action(detail=True, methods=('post', 'delete'))
    def renewal(self, request, pk=None):
        user_subscription = self.get_object()
        renewal_status = {'POST': True, 'DELETE': False}
        user_subscription.renewal_status = renewal_status[request.method]
        user_subscription.save()
        serializer = UserSubscriptionSerializer(instance=user_subscription)
        return Response(serializer.data, status=status.HTTP_200_OK)
