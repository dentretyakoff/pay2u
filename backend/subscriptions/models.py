from dateutil.relativedelta import relativedelta
from django.db import models
from django.utils import timezone

from users.models import User


class Service(models.Model):
    """Сервис подписок."""
    name = models.CharField('Сервис', max_length=200, unique=True)
    description = models.TextField('Описание cервиса')
    color = models.CharField('Цвет', max_length=7)
    image = models.ImageField('Лого сервиса', upload_to='services/')
    created = models.DateTimeField('Дата создания', default=timezone.now)
    category = models.ForeignKey(
        'Category',
        on_delete=models.CASCADE,
        related_name='services',
        verbose_name='Категория')


class Category(models.Model):
    """Категория подписок."""
    name = models.CharField('Категория', max_length=200, unique=True)
    description = models.TextField('Описание категории')
    image = models.ImageField('Лого категории', upload_to='categories/')


class Subscription(models.Model):
    """Вариант подписки на сервис."""
    name = models.CharField('Подписка', max_length=200)
    description = models.TextField('Описание подписки')
    price = models.IntegerField('Стоимость')
    months = models.IntegerField('Период действия в месяцах')
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name='Сервис')


class Favorite(models.Model):
    """Избранные сервисы пользователей."""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='Пользователь')
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name='Сервис')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=('user', 'service'),
                                    name='unique_user_service')
        ]


class UserSubscription(models.Model):
    """Подписки пользователя."""
    start_date = models.DateTimeField('Дата начала', default=timezone.now)
    end_date = models.DateTimeField('Дата окончания')
    status = models.BooleanField('Статус', default=True)
    renewal_status = models.BooleanField('Статус автопродления', default=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_subscriptions',
        verbose_name='Пользователь')
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='subscribers',
        verbose_name='Подписка')

    def save(self, *args, **kwargs):
        """
        Вычисление даты окончания подписки.
        При подключении оплаты дату можно забирать из чеков,
        возможно этот метод стоит убрать.
        """
        if not self.end_date:
            self.end_date = self.start_date + relativedelta(
                month=self.subscription.months)
        super().save(*args, **kwargs)


class PromoCode(models.Model):
    """Промокоды сервисов для активации подписок
    на устройствах пользователей."""
    code = models.CharField('Промокод', max_length=20)
    start_date = models.DateTimeField('Дата создания', default=timezone.now)
    end_date = models.DateTimeField('Дата истечения')
    usage_status = models.BooleanField('Статус использования', default=False)
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='promo_codes',
        verbose_name='Подписка')
