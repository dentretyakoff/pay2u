from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (CategoryListRetrieveViewSet,
                       ServiceListRetrieveViewSet,
                       UserSubscriptionViewSet,
                       SubscriptionRetrieveViewSet,
                       PaymentListViewSet)

router = DefaultRouter()
router.register('categories', CategoryListRetrieveViewSet)
router.register('services', ServiceListRetrieveViewSet)
router.register('subscriptions', SubscriptionRetrieveViewSet)
router.register('mysubscriptions', UserSubscriptionViewSet)
router.register('payments', PaymentListViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
