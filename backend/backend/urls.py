from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from backend.yasg import urlpatterns as yasg_urls


urlpatterns = [
    path('api/', include('api.urls')),
]

urlpatterns += yasg_urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
