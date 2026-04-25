// Gestion de l'authentification
// Les pages définissent window.ROOT_PATH = '../../' avant d'inclure ce fichier

const ROOT = window.ROOT_PATH || './'; //

function isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined && token !== '';
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (error) {
        return null;
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = ROOT + 'pages/login/login.html';
}

function updateNavigation() {
    const loginLink   = document.getElementById('loginLink');
    const profileLink = document.getElementById('profileLink');
    const logoutLink  = document.getElementById('logoutLink');

    if (!loginLink || !profileLink || !logoutLink) return;

    const authenticated = isAuthenticated();
    const user = getCurrentUser();
    const role = (user?.role?.label || user?.role || '').toString().toUpperCase();

    if (authenticated && user) {
        loginLink.style.display   = 'none';
        profileLink.style.display = 'block';
        profileLink.textContent   = user.firstname || 'Mon Compte';
        logoutLink.style.display  = 'block';

        const navMenu = document.querySelector('.nav-menu');
        const existingSpaceLink = document.querySelector('.space-link');
        if (existingSpaceLink) existingSpaceLink.remove();

        if (role === 'ADMIN') {
            const adminLink = document.createElement('li');
            adminLink.className = 'space-link';
            adminLink.innerHTML = `<a href="${ROOT}pages/admin/admin.html">Espace Admin</a>`;
            navMenu.insertBefore(adminLink, profileLink.parentElement);

        } else if (role === 'EMPLOYEE') {
            const employeeLink = document.createElement('li');
            employeeLink.className = 'space-link';
            employeeLink.innerHTML = `<a href="${ROOT}pages/employee/employee.html">Espace Employé</a>`;
            navMenu.insertBefore(employeeLink, profileLink.parentElement);
        }
    } else {
        loginLink.style.display   = 'block';
        profileLink.style.display = 'none';
        logoutLink.style.display  = 'none';

        const existingSpaceLink = document.querySelector('.space-link');
        if (existingSpaceLink) existingSpaceLink.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                logout();
            }
        });
    }
});
