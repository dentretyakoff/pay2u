from rest_framework import filters


class ServiceSearch(filters.BaseFilterBackend):
    """Поиск по сервисам."""
    def filter_queryset(self, request, queryset, view):
        service = request.query_params.get('name')
        category_id = request.query_params.get('category_id')
        if service:
            queryset = queryset.filter(name__istartswith=service)
        if category_id:
            queryset = queryset.filter(category=category_id)
        return queryset


class SubscriptionFilter(filters.BaseFilterBackend):
    """Фильтр планов подписок по сервису."""
    def filter_queryset(self, request, queryset, view):
        service_id = request.query_params.get('service_id')
        if service_id:
            queryset = queryset.filter(service=service_id)
        return queryset
