async function loadComponent(id, path) {
    const container = document.getElementById(id);

    if (!container) return;

    try {
        const response = await fetch(path);
        const html = await response.text();

        container.innerHTML = html;
    } catch (error) {
        console.error(`Erreur chargement ${id}:`, error);
    }
}

function toggleMobileMenu() {
    document.querySelector('.nav-menu')?.classList.toggle('active');
}

function setupHeaderLinks() {
    const root = window.ROOT_PATH || './';

    const links = {
        logoHomeLink: root + 'index.html',
        homeLink: root + 'index.html',
        servicesLink: root + 'pages/services/services.html',
        loginLink: root + 'pages/login/login.html',
        profileLink: root + 'pages/profile/profile.html'
    };

    Object.entries(links).forEach(([id, href]) => {
        const element = document.getElementById(id);
        if (element) element.href = href;
    });
}

async function loadLayout() {
    const root = window.ROOT_PATH || './';

    await loadComponent('navbar', root + 'shared/navbar.html');
    await loadComponent('footer', root + 'shared/footer.html');

    setupHeaderLinks();

    const logoutLink = document.getElementById('logoutLink');

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    if (typeof updateNavigation === 'function') {
        updateNavigation();
    }

    if (typeof loadFooterHoraires === 'function') {
        loadFooterHoraires();
    }
}

document.addEventListener('DOMContentLoaded', loadLayout);