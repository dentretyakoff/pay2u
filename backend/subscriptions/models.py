from django.db import models

from users.models import User


class Service(models.Model):
    """Сервис подписок."""
    name = models.CharField('Сервис', max_length=200, unique=True)
    description = models.TextField('Описание cервиса')


class Category(models.Model):
    """Категория подписок."""
    name = models.CharField('Категория', max_length=200, unique=True)
    description = models.TextField('Описание категории')


class Subscription(models.Model):
    """Вариант подписки на сервис."""
    name = models.CharField('Подписка', max_length=200)
    description = models.TextField('Описание подписки')
    price = models.IntegerField('Стоимость')
    duration = models.DurationField('Период действия')
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name='Сервис')
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='categories',
        verbose_name='Категория')


class Favorite(models.Model):
    """Избранные подписки пользователя."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favourites',
        verbose_name='Пользователь')
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='favourites',
        verbose_name='Подписка')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=('user', 'subscription'),
                                    name='unique_user_subscription')
        ]
