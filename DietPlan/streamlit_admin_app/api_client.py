import requests

API_BASE_URL = 'http://localhost:8000'

class NutriAIAdminClient:
    @staticmethod
    def auth_headers(access_token: str | None):
        headers = {}
        if access_token:
            headers['Authorization'] = f'Bearer {access_token}'
        return headers

    @staticmethod
    def ping(access_token=None):
        response = requests.get(
            f'{API_BASE_URL}/',
            headers=NutriAIAdminClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def login(username, password):
        response = requests.post(
            f'{API_BASE_URL}/auth/login',
            json={
                'username': username,
                'password': password,
            },
        )
        response.raise_for_status()
        return response.json()
