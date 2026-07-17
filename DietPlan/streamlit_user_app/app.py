import requests
import streamlit as st
from streamlit_user_app.api_client import NutriAIClient

st.set_page_config(page_title='NutriAI User Dashboard')

if 'user' not in st.session_state:
    st.session_state.user = None
if 'token' not in st.session_state:
    st.session_state.token = None

st.title('NutriAI User Dashboard')

if st.session_state.token and st.session_state.user is None:
    try:
        current_user = NutriAIClient.get_current_user(st.session_state.token)
        st.session_state.user = current_user
    except requests.exceptions.HTTPError as exc:
        if exc.response is not None and exc.response.status_code == 401:
            st.warning('Session expired. Please sign in again.')
            st.session_state.token = None
            st.session_state.user = None
            st.session_state.profile = None
        else:
            st.error(f'Unable to verify session: {exc}')
    except Exception as exc:
        st.error(f'Unable to verify session: {exc}')

if st.session_state.user is None:
    auth_mode = st.sidebar.selectbox('Choose action', ['Login', 'Register'])

    if auth_mode == 'Login':
        with st.form('login_form'):
            username = st.text_input('Username')
            password = st.text_input('Password', type='password')
            submitted = st.form_submit_button('Sign In')

        if submitted:
            try:
                user = NutriAIClient.login_user(username, password)
                st.session_state.user = user
                st.session_state.token = user.get('access_token')
                st.success(f"Welcome back, {user['username']}!")
            except Exception as exc:
                st.error(f'Login failed: {exc}')

    else:
        with st.form('register_form'):
            username = st.text_input('Username')
            email = st.text_input('Email')
            password = st.text_input('Password', type='password')
            submitted = st.form_submit_button('Register')

        if submitted:
            try:
                user = NutriAIClient.register_user(username, email, password)
                st.session_state.user = user
                st.session_state.token = user.get('access_token')
                st.success(f"Registered successfully as {user['username']}.")
            except Exception as exc:
                st.error(f'Registration failed: {exc}')
else:
    st.sidebar.success(f"Signed in as {st.session_state.user['username']}")
    if st.sidebar.button('Logout'):
        st.session_state.user = None
        st.session_state.profile = None
        st.experimental_rerun()

    user_id = st.session_state.user['id']
    if 'profile' not in st.session_state or st.session_state.profile is None:
        try:
            st.session_state.profile = NutriAIClient.get_profile(user_id, st.session_state.token)
        except Exception as exc:
            st.error(f'Unable to load profile: {exc}')
            st.session_state.profile = {}

    profile = st.session_state.profile
    st.header('Profile')
    with st.form('profile_form'):
        age = st.number_input('Age', min_value=10, max_value=120, value=profile.get('age', 30))
        sex = st.selectbox('Sex', ['male', 'female', 'other'], index=['male', 'female', 'other'].index(profile.get('sex', 'male')) if profile.get('sex') in ['male', 'female', 'other'] else 0)
        height_cm = st.number_input('Height (cm)', min_value=100.0, max_value=250.0, value=profile.get('height_cm', 170.0))
        weight_kg = st.number_input('Weight (kg)', min_value=30.0, max_value=200.0, value=profile.get('weight_kg', 70.0))
        activity_level = st.selectbox('Activity level', ['sedentary', 'light', 'moderate', 'active', 'very_active'], index=['sedentary', 'light', 'moderate', 'active', 'very_active'].index(profile.get('activity_level', 'sedentary')) if profile.get('activity_level') in ['sedentary', 'light', 'moderate', 'active', 'very_active'] else 0)
        goal = st.text_input('Goal', value=profile.get('goal', ''))
        save_profile = st.form_submit_button('Save profile')

    if save_profile:
        try:
            updated_profile = NutriAIClient.update_profile(user_id, {
                'age': age,
                'sex': sex,
                'height_cm': height_cm,
                'weight_kg': weight_kg,
                'activity_level': activity_level,
                'goal': goal,
            }, st.session_state.token)
            st.session_state.profile = updated_profile
            st.success('Profile saved successfully.')
        except Exception as exc:
            st.error(f'Unable to save profile: {exc}')

    st.header('Personal Health Metrics')
    with st.form('health_form'):
        health_age = st.number_input('Age', min_value=10, max_value=120, value=age)
        health_sex = st.selectbox('Sex', ['male', 'female', 'other'], index=['male', 'female', 'other'].index(sex))
        health_height = st.number_input('Height (cm)', min_value=100.0, max_value=250.0, value=height_cm)
        health_weight = st.number_input('Weight (kg)', min_value=30.0, max_value=200.0, value=weight_kg)
        health_activity = st.selectbox('Activity level', ['sedentary', 'light', 'moderate', 'active', 'very_active'], index=['sedentary', 'light', 'moderate', 'active', 'very_active'].index(activity_level))
        calculate = st.form_submit_button('Calculate')

    if calculate:
        try:
            data = NutriAIClient.get_health_metrics(
                health_weight,
                health_height,
                health_age,
                health_sex,
                health_activity,
                st.session_state.token,
            )
            st.metric('BMI', f"{data['bmi']:.2f}")
            st.metric('BMR', f"{data['bmr']:.0f} kcal/day")
            st.metric('TDEE', f"{data['tdee']:.0f} kcal/day")
            st.success('Health metrics retrieved from NutriAI backend.')
        except Exception as exc:
            st.error(f'Unable to fetch health metrics: {exc}')

    st.header('Diet Recommendation')
    if st.button('Generate Diet Plan'):
        try:
            recommendation = NutriAIClient.get_recommendation(
                user_id,
                weight_kg,
                height_cm,
                age,
                sex,
                activity_level,
                st.session_state.token,
            )
            st.subheader(f"Diet category: {recommendation['diet_category']}")
            st.write('**Health summary**')
            st.write(recommendation['health'])
            st.write('**Suggested meal plan**')
            for meal in recommendation['plan']['meals']:
                st.markdown(f"**{meal['name']}**")
                for item in meal['items']:
                    st.write(f"- {item}")
        except Exception as exc:
            st.error(f'Unable to generate diet recommendation: {exc}')

    st.header('Saved Diet Plan History')
    try:
        history = NutriAIClient.get_diet_history(user_id, st.session_state.token)
        if history:
            plan_ids = [f"#{saved['id']} - {saved['diet_category']}" for saved in history]
            selected_label = st.selectbox('Select a saved diet plan', plan_ids)
            selected_index = plan_ids.index(selected_label)
            selected_plan = history[selected_index]

            st.subheader(f"Plan {selected_plan['id']} details")
            st.write(f"**Diet category:** {selected_plan['diet_category']}")
            st.write(f"**Calories target:** {selected_plan['calories_target']:.0f}")
            plan = selected_plan.get('plan', {})
            meals = plan.get('meals', [])
            st.write('**Suggested meal plan**')
            for meal in meals:
                st.markdown(f"**{meal['name']}**")
                for item in meal.get('items', []):
                    st.write(f"- {item}")
        else:
            st.info('No saved diet plans yet. Generate one to store it.')
    except Exception as exc:
        st.error(f'Unable to load diet history: {exc}')
