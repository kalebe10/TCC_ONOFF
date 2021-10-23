from __future__ import unicode_literals

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from django.db import models


class Modulo(models.Model):
    nome = models.CharField(max_length=100, blank=True)
    apelido = models.CharField(max_length=100, blank=True, default="")
    sala = models.CharField(max_length=100, blank=True, default=0)
    mac = models.CharField(max_length=100, blank=True,
                           default="")
    ativo = models.BooleanField(default=False)
    data_hora_modifica = models.CharField(max_length=100, blank=True)
    ssidRede = models.CharField(max_length=100, blank=True, default="")
    pswRede = models.CharField(max_length=100, blank=True, default="")
    user = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Modulos'


class Sala(models.Model):
    nome = models.CharField(max_length=100)
    andar = models.CharField(max_length=100)
    ativo = models.BooleanField(default=False)
    user = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Salas'


class Andar(models.Model):
    nome = models.CharField(max_length=100)
    ativo = models.BooleanField(default=False)
    user = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Andar'


class Secret(models.Model):
    nome = models.CharField(max_length=100, unique=True)
    user = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Secret'


class Agendador(models.Model):
    nome = models.CharField(max_length=100, blank=True)
    data = models.CharField(max_length=100, blank=True, null=True)
    hora = models.CharField(max_length=100, blank=True, null=True)
    data_inicio = models.CharField(max_length=100, blank=True, null=True)
    hora_inicio = models.CharField(max_length=100, blank=True, null=True)
    data_fim = models.CharField(max_length=100, blank=True, null=True)
    hora_fim = models.CharField(max_length=100, blank=True, null=True)
    dia_semana = models.CharField(max_length=100, blank=True, default="")
    loop = models.BooleanField(default=False, blank=True)
    data_loop = models.IntegerField(blank=True, default=0)
    hora_loop = models.IntegerField(blank=True, default=0)
    tipo_acionamento = models.IntegerField(blank=True, default=0)
    minuto_loop = models.IntegerField(blank=True, default=0)
    ligar = models.BooleanField(default=False, blank=True)
    desligar = models.BooleanField(default=False, blank=True)
    modulo = models.TextField(blank=True)
    sala = models.CharField(max_length=100, blank=True)
    andar = models.CharField(max_length=100, blank=True)
    ativo = models.BooleanField(default=False, blank=True)
    data_hora = models.DateTimeField(auto_now=True)
    user = models.IntegerField(blank=True, default=0)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name_plural = 'Agendador'


class User(AbstractBaseUser, PermissionsMixin):
    """
    An abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required. Other fields are optional.
    """
    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    password = models.CharField(_('password'), max_length=128)
    last_login = models.DateTimeField(_('last login'), blank=True, null=True)
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=150, blank=True)
    email = models.EmailField(_('email address'), blank=True)
    nivel = models.IntegerField(_('nivel'), default=0, blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_(
            'Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    is_superuser = models.BooleanField(
        _('superuser'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
