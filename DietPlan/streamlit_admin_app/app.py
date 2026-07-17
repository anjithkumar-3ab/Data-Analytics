import streamlit as st
from streamlit_admin_app.api_client import NutriAIAdminClient

st.set_page_config(page_title='NutriAI Admin Portal')

if 'admin_user' not in st.session_state:
    st.session_state.admin_user = None

st.title('NutriAI Admin Portal')

if st.session_state.admin_user is None:
    with st.form('admin_login'):
        username = st.text_input('Admin username')
        password = st.text_input('Password', type='password')
        submitted = st.form_submit_button('Sign In')

    if submitted:
        try:
            user = NutriAIAdminClient.login(username, password)
            if user['role'] != 'admin':
                st.error('Only admin users may access this portal.')
            else:
                st.session_state.admin_user = user
                st.session_state.admin_token = user.get('access_token')
                st.success(f"Signed in as admin {user['username']}")
        except Exception as exc:
            st.error(f'Login failed: {exc}')
else:
    st.sidebar.success(f"Signed in as {st.session_state.admin_user['username']}")
    if st.sidebar.button('Logout'):
        st.session_state.admin_user = None
            st.session_state.admin_token = None
            st.experimental_rerun()

        st.sidebar.header('Navigation')
        section = st.sidebar.selectbox('Section', ['Users', 'Foods', 'Plans', 'Reports'])

        if section == 'Users':
            st.header('Manage Users')
            st.info('User management and role assignment will be available here.')
        elif section == 'Foods':
            st.header('Food Database')
            st.info('Food database import and nutrition management will be available here.')
        elif section == 'Plans':
            st.header('Diet Plans')
            st.info('Review and approve personalized diet plans from users.')
        else:
            st.header('Reports')
            try:
                ping = NutriAIAdminClient.ping(st.session_state.admin_token)
