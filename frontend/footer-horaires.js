// Chargement des horaires dans le footer (toutes les pages)
async function loadFooterHoraires() {
    const footerDiv = document.getElementById('footerHoraires');
    if (!footerDiv) return;

    try {
        const response = await api.get('/horaires');
        if (response.horaires && response.horaires.length > 0) {
            footerDiv.innerHTML = response.horaires.map(h => `
                <p class="footer-hour">
                    <strong>${h.day}:</strong>
                    ${h.opening_time === 'Fermé' ? 'Fermé' : `${h.opening_time} - ${h.closing_time}`}
                </p>
            `).join('');
        } else {
            footerDiv.innerHTML = '<p class="footer-hour">Horaires non disponibles</p>';
        }
    } catch (error) {
        footerDiv.innerHTML = '<p class="footer-hour">Non disponible</p>';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooterHoraires);
} else {
    loadFooterHoraires();
}
