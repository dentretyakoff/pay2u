from django.db import models
from django.utils import timezone

from subscriptions.models import UserSubscription
from users.models import User


class Payment(models.Model):
    """Оплата подписки."""
    amount = models.PositiveIntegerField('Сумма')
    date = models.DateTimeField('Дата оплаты', default=timezone.now)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_payments',
        verbose_name='Пользователь')
    user_subscription = models.ForeignKey(
        UserSubscription,
        on_delete=models.CASCADE,
        related_name='user_payments',
        verbose_name='Подписка пользователя')
