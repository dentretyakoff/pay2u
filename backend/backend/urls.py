from django.urls import path, include

from backend.yasg import urlpatterns as yasg_urls


urlpatterns = [
    path('api/', include('api.urls')),
]

urlpatterns += yasg_urls
