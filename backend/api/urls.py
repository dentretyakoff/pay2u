from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (CategoryListRetrieveViewSet,
                       ServiceListRetrieveViewSet,
                       UserSubscriptionViewSet,
                       SubscriptionListRetrieveViewSet)

router = DefaultRouter()
router.register('categories', CategoryListRetrieveViewSet)
router.register('services', ServiceListRetrieveViewSet)
router.register('subscriptions', SubscriptionListRetrieveViewSet)
router.register('mysubscriptions', UserSubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
