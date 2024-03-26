from django.utils.decorators import method_decorator
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


service_schema = method_decorator(
    name='list',
    decorator=swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'name', openapi.IN_QUERY,
                description='Допустим поиск по началу названия.',
                type=openapi.TYPE_STRING),
            openapi.Parameter(
                'category_id', openapi.IN_QUERY,
                type=openapi.TYPE_INTEGER),
        ]
    )
)


user_subscription_schema = method_decorator(
    name='list',
    decorator=swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'status', openapi.IN_QUERY,
                description='False для получения неактивных подписок.',
                type=openapi.TYPE_STRING),
        ]
    )
)
