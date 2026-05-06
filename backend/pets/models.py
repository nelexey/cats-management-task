from django.db import models
from django.conf import settings

class Cat(models.Model):
    COLOR_CHOICES = (
        ('black', 'черный'),
        ('colored', 'цветной'),
    )
    GENDER_CHOICES = (
        ('M', 'кот'),
        ('F', 'кошка'),
    )

    name = models.CharField(max_length=100)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    color = models.CharField(max_length=10, choices=COLOR_CHOICES)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cats')
    
    def __str__(self):
        return self.name
