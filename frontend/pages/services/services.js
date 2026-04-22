const ROOT = window.ROOT_PATH || '../../'; //
//
async function loadThemes() {
    try {
        const response = await api.get('/themes');
        const themes   = response.themes || [];
        const select   = document.getElementById('themeFilter');
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value       = theme.id;
            option.textContent = theme.label;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur thèmes:', error);
    }
}

async function loadRegimes() {
    try {
        const response = await api.get('/regimes'); // api.get
        const regimes  = response.regimes || [];
        const select   = document.getElementById('regimeFilter');
        regimes.forEach(regime => {
            const option = document.createElement('option');
            option.value       = regime.id;
            option.textContent = regime.label;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur régimes:', error);
    }
}

async function loadServices(filters = {}) {
    try {
        const queryParams = new URLSearchParams();
        if (filters.prixMax)    queryParams.append('prixMax',    filters.prixMax);
        if (filters.theme_id)   queryParams.append('theme_id',   filters.theme_id);
        if (filters.regime_id)  queryParams.append('regime_id',  filters.regime_id);

        const url      = `/services${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        const response = await api.get(url);
        const services = response.services || [];
        const count    = response.count || services.length;

        document.getElementById('resultsTitle').textContent =
            `${count} service${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;

        displayServices(services);
    } catch (error) {
        document.getElementById('servicesGrid').innerHTML =
            '<p class="error">Erreur lors du chargement des services</p>';
    }
}

function displayServices(services) {
    const grid = document.getElementById('servicesGrid');
    if (services.length === 0) {
        grid.innerHTML = '<p class="no-results">Aucun service ne correspond à vos critères</p>';
        return;
    }

    grid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-header">
                <h3>${service.name}</h3>
                <span class="service-price">${service.price} €</span>
            </div>
            <p class="service-description">${service.description || 'Aucune description disponible'}</p>
            <div class="service-meta">
                ${service.theme    ? `<span class="badge">${service.theme.label}</span>`    : ''}
                ${service.regime   ? `<span class="badge">${service.regime.label}</span>`   : ''}
                ${service.duration ? `<span class="badge">${service.duration} min</span>`   : ''}
            </div>
            ${service.plats && service.plats.length > 0 ? `
                <div class="service-plats">
                    <h4>Plats inclus (${service.plats.length})</h4>
                    <ul>
                        ${service.plats.slice(0, 3).map(p => `<li>${p.title}</li>`).join('')}
                        ${service.plats.length > 3 ? `<li>Et ${service.plats.length - 3} autre${service.plats.length - 3 > 1 ? 's' : ''}...</li>` : ''}
                    </ul>
                </div>
            ` : ''}
            <div class="service-actions">
                <a href="${ROOT}pages/service-detail/service-detail.html?id=${service.id}" class="btn btn-secondary">Voir le détail</a>
                <button class="btn btn-primary" onclick="reserveService(${service.id})">Réserver</button>
            </div>
        </div>
    `).join('');
}

function applyFilters() {
    loadServices({
        prixMax:   document.getElementById('priceMax').value,
        theme_id:  document.getElementById('themeFilter').value,
        regime_id: document.getElementById('regimeFilter').value
    });
}

function resetFilters() {
    document.getElementById('priceMax').value      = '';
    document.getElementById('themeFilter').value   = '';
    document.getElementById('regimeFilter').value  = '';
    loadServices();
}

function reserveService(serviceId) {
    if (!localStorage.getItem('token')) {
        alert('Vous devez être connecté pour réserver un service');
        window.location.href = ROOT + 'pages/login/login.html';
        return;
    }
    window.location.href = `${ROOT}pages/service-detail/service-detail.html?id=${serviceId}`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    loadThemes();
    loadRegimes();
    loadServices();
});
