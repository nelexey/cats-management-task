from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from .models import Cat

User = get_user_model()

class CatTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pw1')
        self.user2 = User.objects.create_user(username='user2', password='pw2')
        
        self.cat_url = reverse('cat-list')
        
        self.cat_data = {
            'name': 'Барсик',
            'birth_date': '2020-01-01',
            'gender': 'M',
            'color': 'black'
        }

    def test_create_cat_authenticated(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.cat_url, self.cat_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cat.objects.count(), 1)
        self.assertEqual(Cat.objects.get().owner, self.user1)

    def test_unauthenticated_access_denied(self):
        response = self.client.get(self.cat_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_cats_isolation(self):
        Cat.objects.create(owner=self.user1, name='Кот1', birth_date='2020-01-01', gender='M', color='black')
        Cat.objects.create(owner=self.user2, name='Кот2', birth_date='2021-01-01', gender='F', color='colored')
        
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.cat_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Пользователь 1 должен получить только 1 запись
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Кот1')
