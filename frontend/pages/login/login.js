function getRoleLabel(user) {
    if (!user) return '';
    if (user.role && typeof user.role === 'object' && user.role.label)
        return user.role.label.toString().toUpperCase();
    if (user.role && typeof user.role === 'string')
        return user.role.toString().toUpperCase();
    if (user.roleLabel)
        return user.roleLabel.toString().toUpperCase();
    return '';
}

function redirectByRole(user) {
    const role = getRoleLabel(user);
    const ROOT = window.ROOT_PATH || '../../';
    if (role === 'ADMIN') {
        window.location.href = ROOT + 'pages/admin/admin.html';
    } else if (role === 'EMPLOYEE') {
        window.location.href = ROOT + 'pages/employee/employee.html';
    } else {
        window.location.href = ROOT + 'pages/profile/profile.html';
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email       = document.getElementById('email').value;
    const password    = document.getElementById('password').value;
    const errorDiv    = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');

    loginButton.disabled    = true;
    loginButton.textContent = 'Connexion en cours...';
    errorDiv.style.display  = 'none';

    try {
        const response = await api.post('/auth/login', { email, password });
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            redirectByRole(response.user);
        }
    } catch (error) {
        errorDiv.textContent    = error.message || 'Email ou mot de passe incorrect';
        errorDiv.style.display  = 'block';
        loginButton.disabled    = false;
        loginButton.textContent = 'Se connecter';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('token')) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        redirectByRole(user);
    }
});
