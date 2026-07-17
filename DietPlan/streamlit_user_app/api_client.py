import requests

API_BASE_URL = 'http://localhost:8000'

class NutriAIClient:
    @staticmethod
    def auth_headers(access_token: str | None):
        headers = {}
        if access_token:
            headers['Authorization'] = f'Bearer {access_token}'
        return headers

    @staticmethod
    def get_health_metrics(weight_kg, height_cm, age, sex, activity_level, access_token=None):
        response = requests.post(
            f'{API_BASE_URL}/health',
            json={
                'weight_kg': weight_kg,
                'height_cm': height_cm,
                'age': age,
                'sex': sex,
                'activity_level': activity_level,
            },
            headers=NutriAIClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def register_user(username, email, password, role='user'):
        response = requests.post(
            f'{API_BASE_URL}/auth/register',
            json={
                'username': username,
                'email': email,
                'password': password,
                'role': role,
            },
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def login_user(username, password):
        response = requests.post(
            f'{API_BASE_URL}/auth/login',
            json={
                'username': username,
                'password': password,
            },
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_profile(user_id, access_token=None):
        response = requests.get(
            f'{API_BASE_URL}/users/{user_id}',
            headers=NutriAIClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def update_profile(user_id, profile_data, access_token=None):
        response = requests.put(
            f'{API_BASE_URL}/users/{user_id}',
            json=profile_data,
            headers=NutriAIClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_diet_history(user_id, access_token=None):
        response = requests.get(
            f'{API_BASE_URL}/users/{user_id}/diet_plans',
            headers=NutriAIClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()

    @staticmethod
    def get_recommendation(user_id, weight_kg, height_cm, age, sex, activity_level, access_token=None):
        response = requests.post(
            f'{API_BASE_URL}/recommendation',
            json={
                'weight_kg': weight_kg,
                'height_cm': height_cm,
                'age': age,
                'sex': sex,
                'activity_level': activity_level,
            },
            headers=NutriAIClient.auth_headers(access_token),
        )
        response.raise_for_status()
        return response.json()
