let currentService = null;
let currentRating  = 0;

function toggleMobileMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function getServiceIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function loadService() {
    const serviceId = getServiceIdFromUrl();
    if (!serviceId) { showError(); return; }

    try {
        const response = await api.get(`/services/${serviceId}`);
        currentService = response;
        displayService(currentService);
        loadReviews(serviceId);
    } catch (error) {
        console.error('Erreur chargement service:', error);
        showError();
    }
}

function displayService(service) {
    document.getElementById('loadingState').style.display  = 'none';
    document.getElementById('serviceContent').style.display = 'block';
    document.title = `${service.name} - Vite & Gourmand`;

    document.getElementById('breadcrumbName').textContent   = service.name;
    document.getElementById('serviceName').textContent      = service.name;
    document.getElementById('serviceDescription').textContent = service.description || '';
    document.getElementById('servicePrice').textContent     = `${service.price} €`;
    document.getElementById('serviceDuration').textContent  = `${service.duration} min`;

    document.getElementById('serviceBadges').innerHTML = `
        ${service.theme  ? `<span class="badge badge-theme">${service.theme.label}</span>`   : ''}
        ${service.regime ? `<span class="badge badge-regime">${service.regime.label}</span>` : ''}
    `;

    displayPlats(service.plats || []);

    const allergenes = [];
    (service.plats || []).forEach(plat => {
        (plat.allergenes || []).forEach(a => {
            if (!allergenes.find(e => e.id === a.id)) allergenes.push(a);
        });
    });
    displayAllergenes(allergenes);

    if (isAuthenticated()) {
        document.getElementById('addReviewBtn').style.display = 'block';
    }
}

function displayPlats(plats) {
    const platsList = document.getElementById('platsList');
    if (plats.length === 0) {
        platsList.innerHTML = '<p class="no-results">Aucun plat associé</p>';
        return;
    }
    platsList.innerHTML = plats.map(plat => `
        <div class="plat-detail-card">
            ${plat.photo
                ? `<img src="${plat.photo}" alt="${plat.title}" class="plat-detail-img"
                       onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                   <div class="plat-img-placeholder" style="display:none;">🍽️</div>`
                : `<div class="plat-img-placeholder">🍽️</div>`
            }
            <div class="plat-detail-info">
                <h4>${plat.title}</h4>
                ${plat.allergenes && plat.allergenes.length > 0
                    ? `<div class="plat-allergenes">
                           ${plat.allergenes.map(a => `<span class="allergene-badge">⚠️ ${a.label}</span>`).join('')}
                       </div>`
                    : '<p class="no-allergene">✅ Sans allergène majeur</p>'
                }
            </div>
        </div>
    `).join('');
}

function displayAllergenes(allergenes) {
    const div = document.getElementById('allergenesList');
    if (allergenes.length === 0) {
        div.innerHTML = '<p class="no-allergene">✅ Ce menu ne contient pas d\'allergènes majeurs déclarés</p>';
        return;
    }
    div.innerHTML = allergenes.map(a => `<span class="allergene-badge-large">⚠️ ${a.label}</span>`).join('');
}

async function loadReviews(serviceId) {
    try {
        const response = await api.get(`/reviews/service/${serviceId}`);
        const reviews  = response.reviews || [];

        document.getElementById('serviceRating').textContent =
            response.averageNote > 0
                ? `${response.averageNote}/5 (${response.count} avis)`
                : 'Aucun avis';

        displayReviews(reviews);
    } catch (error) {
        console.error('Erreur reviews:', error);
    }
}

function displayReviews(reviews) {
    const div = document.getElementById('reviewsList');
    if (reviews.length === 0) {
        div.innerHTML = '<p class="no-results">Aucun avis pour ce service. Soyez le premier à laisser un commentaire !</p>';
        return;
    }
    div.innerHTML = reviews.map(rev => `
        <div class="review-item">
            <div class="review-item-header">
                <div>
                    <strong>${rev.user?.firstname} ${rev.user?.lastname}</strong>
                    <span class="review-stars">${'⭐'.repeat(rev.note)}${'☆'.repeat(5 - rev.note)}</span>
                </div>
                <small class="review-date">${new Date(rev.created_at).toLocaleDateString('fr-FR')}</small>
            </div>
            <p class="review-text">"${rev.description || ''}"</p>
        </div>
    `).join('');
}

function setRating(note) {
    currentRating = note;
    document.getElementById('reviewNote').value = note;
    document.querySelectorAll('.star').forEach((star, index) => {
        star.style.opacity = index < note ? '1' : '0.3';
    });
}

function showReviewForm() {
    if (!isAuthenticated()) { window.location.href = ROOT + 'pages/login/login.html'; return; }
    document.getElementById('reviewForm').style.display = 'block';
}

function hideReviewForm() {
    document.getElementById('reviewForm').style.display = 'none';
}

async function submitReview() {
    if (currentRating === 0) { alert('Veuillez sélectionner une note'); return; }
    try {
        await api.post('/reviews', {
            note:        currentRating,
            description: document.getElementById('reviewDesc').value,
            service_id:  currentService.id
        });
        document.getElementById('reviewSuccess').style.display = 'block';
        setTimeout(() => { hideReviewForm(); loadReviews(currentService.id); }, 2000);
    } catch (error) {
        alert('Erreur lors de l\'envoi : ' + error.message);
    }
}

function goToReservation() {
    if (!isAuthenticated()) { window.location.href = ROOT + 'pages/login/login.html'; return; }
    openReservationModal();
}

async function openReservationModal() {
    document.getElementById('modalServiceName').textContent  = currentService.name;
    document.getElementById('modalServicePrice').textContent = `${currentService.price} €`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);
    document.getElementById('appointmentDate').min = tomorrow.toISOString().slice(0, 16);

    try {
        const employees = await api.get('/users/employees'); 
        document.getElementById('employeeSelect').innerHTML = employees.map(emp =>
            `<option value="${emp.id}">👨‍🍳 ${emp.firstname} ${emp.lastname}</option>`
        ).join('');
    } catch (error) {
        console.error('Erreur chargement employés:', error);
    }

    document.getElementById('reservationModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('reservationModal').style.display = 'none';
    document.getElementById('reservationError').style.display   = 'none';
    document.getElementById('reservationSuccess').style.display = 'none';
}

document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn        = document.getElementById('submitReservation');
    const errorDiv   = document.getElementById('reservationError');
    const successDiv = document.getElementById('reservationSuccess');

    btn.disabled    = true;
    btn.textContent = 'Réservation en cours...';
    errorDiv.style.display = 'none';

    try {
        await api.post('/appointments', {
            date:        document.getElementById('appointmentDate').value,
            service_id:  currentService.id,
            employee_id: parseInt(document.getElementById('employeeSelect').value)
        });
        successDiv.textContent   = '✅ Réservation confirmée ! Vous pouvez la retrouver dans votre espace personnel.';
        successDiv.style.display = 'block';
        btn.textContent          = '✅ Réservé !';
        setTimeout(() => { closeModal(); btn.disabled = false; btn.textContent = 'Confirmer la réservation'; }, 3000);
    } catch (error) {
        errorDiv.textContent    = 'Erreur : ' + error.message;
        errorDiv.style.display  = 'block';
        btn.disabled            = false;
        btn.textContent         = 'Confirmer la réservation';
    }
});

function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display   = 'block';
}

window.onclick = (e) => { if (e.target.classList.contains('modal')) closeModal(); };

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    loadService();
});
