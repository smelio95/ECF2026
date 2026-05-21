async function loadHours() {
    try {
        const response = await api.get('/horaires');
        const hoursGrid = document.getElementById('hoursGrid');
        if (response.horaires && response.horaires.length > 0) {
            hoursGrid.innerHTML = response.horaires.map(h => `
                <div class="hour-card">
                    <h3>${h.day}</h3>
                    <p>${h.opening_time === 'Fermé' ? 'Fermé' : `${h.opening_time} - ${h.closing_time}`}</p>
                </div>
            `).join('');
        } else {
            hoursGrid.innerHTML = '<p>Horaires non disponibles</p>';
        }
    } catch (error) {
        document.getElementById('hoursGrid').innerHTML = '<p>Erreur lors du chargement des horaires</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    loadHours();
});