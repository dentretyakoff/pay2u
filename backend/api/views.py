from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count, Max
from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import mixins, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.serializers import (CategorySerializer,
                             ServiceListSerializer,
                             ServiceRetrieveSerializer,
                             UserSubscriptionSerializer,
                             SubscriptionSerializer,
                             PaymentSerializer,
                             ExpensesSerializer,
                             PromoCodeSerializer)
from .openapi import service_schema, user_subscription_schema
from .filters import ServiceSearch, UserSubscriptionFilter
from payments.models import Payment
from subscriptions.models import (Category,
                                  Favorite,
                                  Service,
                                  UserSubscription,
                                  Subscription)


class CategoryListRetrieveViewSet(viewsets.ReadOnlyModelViewSet):
    """Получает категории списком или по одной."""
    queryset = (Category.objects
                .annotate(services_count=Count('services'))
                .order_by('-services_count').all())
    serializer_class = CategorySerializer


@service_schema
class ServiceListRetrieveViewSet(viewsets.ReadOnlyModelViewSet):
    """Получает сервисы списком или по одному."""
    queryset = (Service.objects
                .annotate(cashback=Max('subscriptions__cashback'))
                .order_by('-rating').all())
    serializer_class = ServiceListSerializer
    filter_backends = (ServiceSearch,)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.get_queryset().prefetch_related('subscriptions')
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
        services = self.get_queryset().filter(favorites__user=request.user)
        serializer = self.get_serializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT),
        responses={status.HTTP_200_OK: ServiceListSerializer()})
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
            favorite = get_object_or_404(
                Favorite, service=service, user=request.user)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)


class SubscriptionRetrieveViewSet(mixins.RetrieveModelMixin,
                                  viewsets.GenericViewSet):
    """Получает данные о конкретной подписке."""
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT),
        responses={status.HTTP_200_OK: SubscriptionSerializer()})
    @action(detail=True, methods=('post',))
    def subscribe(self, request, pk=None):
        """Подписаться на выбранный сервис."""
        subscription = self.get_object()
        user = request.user
        user_subscription, created = UserSubscription.objects.get_or_create(
            user=user, subscription=subscription)
        serializer = SubscriptionSerializer(instance=subscription,
                                            context={'request': request})
        if not created and user_subscription.status:
            return Response({'error': 'Уже в подписках.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not created:
            user_subscription.status = True
            user_subscription.start_date = timezone.now()
            user_subscription.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


@user_subscription_schema
class UserSubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    """Получает подписки пользователя."""
    queryset = (UserSubscription.objects
                .select_related('subscription__service')
                .order_by('end_date').all())
    serializer_class = UserSubscriptionSerializer
    filter_backends = (UserSubscriptionFilter,)

    @swagger_auto_schema(
        method='post',
        request_body=openapi.Schema(type=openapi.TYPE_OBJECT),
        responses={status.HTTP_200_OK: UserSubscriptionSerializer()})
    @action(detail=True, methods=('post', 'delete'))
    def renewal(self, request, pk=None):
        """Отвключить/включить автопродление подписки."""
        user_subscription = self.get_object()
        renewal_status = {'POST': True, 'DELETE': False}
        user_subscription.renewal_status = renewal_status[request.method]
        user_subscription.save()
        serializer = UserSubscriptionSerializer(
            instance=user_subscription, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(responses={status.HTTP_200_OK: PromoCodeSerializer()})
    @action(detail=True, methods=('get',))
    def promocodes(self, request, pk=None):
        """
        Получить список промокодов пользователя выданных для сервиса.
        """
        user_subscription = self.get_object()
        promocodes = (user_subscription.subscription.promo_codes
                      .filter(user=request.user)
                      .order_by('-start_date'))
        serializer = PromoCodeSerializer(promocodes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentListViewSet(mixins.ListModelMixin,
                         viewsets.GenericViewSet):
    """Получает чеки пользователя."""
    queryset = (Payment.objects
                .select_related('user_subscription__subscription__service')
                .all())
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    @swagger_auto_schema(responses={status.HTTP_200_OK: ExpensesSerializer()})
    @action(detail=False, methods=('get',))
    def expenses(self, request):
        """Получает затраты пользователя в текущем месяце
        и кешбек за все время."""
        serializer = ExpensesSerializer(self.get_queryset())
        return Response(serializer.data, status=status.HTTP_200_OK)
