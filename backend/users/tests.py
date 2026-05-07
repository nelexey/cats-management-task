# users/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAuthTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.list_url = reverse('user_list')
        self.user_data = {
            'username': 'testuser',
            'password': 'StrongPassword123!'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        new_user_data = {
            'username': 'newuser',
            'password': 'StrongPassword123!'
        }
        response = self.client.post(self.register_url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.filter(username='newuser').count(), 1)

    def test_user_login(self):
        response = self.client.post(self.login_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_user_list_authenticated_excludes_self(self):
        User.objects.create_user(username='other_breeder', password='pw')
        
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.list_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'other_breeder')

    def test_user_list_unauthenticated_denied(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)