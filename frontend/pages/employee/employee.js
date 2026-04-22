const ROOT = window.ROOT_PATH || '../../';
let myAppointments       = [];
let currentAppointmentId = null;

function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

async function checkEmployeeAccess() {
    const user = getCurrentUser();
    if (!user || (user.role.label !== 'EMPLOYEE' && user.role.label !== 'ADMIN')) {
        alert('Accès réservé aux employés');
        window.location.href = ROOT + 'index.html';
        return false;
    }
    document.getElementById('welcomeMessage').textContent = `Bienvenue ${user.firstname} ${user.lastname}`;
    return true;
}

async function loadMyAppointments() {
    try {
        const appointments = await api.get('/appointments');
        const user         = getCurrentUser();
        myAppointments     = appointments.filter(apt => apt.employee_id === user.id);
        displayMyAppointments(myAppointments);
        updateStats();
    } catch (error) {
        console.error('Erreur chargement commandes:', error);
    }
}

function displayMyAppointments(appointments) {
    const listDiv = document.getElementById('myAppointmentsList');
    if (!appointments || appointments.length === 0) {
        listDiv.innerHTML = '<div class="no-results-full">Aucune commande assignée</div>';
        return;
    }
    listDiv.innerHTML = appointments.map(apt => `
        <div class="appointment-card-full">
            <div class="appointment-status">
                <span class="status-badge status-${apt.status.toLowerCase()}">${apt.status}</span>
            </div>
            <h3>${apt.service?.name || 'Service supprimé'}</h3>
            <div class="appointment-info">
                <p><strong>Client:</strong> ${apt.user?.firstname} ${apt.user?.lastname}</p>
                <p><strong>Email:</strong> ${apt.user?.email}</p>
                <p><strong>Téléphone:</strong> ${apt.user?.phone || 'Non renseigné'}</p>
                <p><strong>Date:</strong> ${new Date(apt.date).toLocaleString('fr-FR')}</p>
                <p><strong>Prix:</strong> ${apt.service?.price} €</p>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-primary" onclick="showStatusModal(${apt.id}, '${apt.status}')">
                    Modifier le statut
                </button>
            </div>
        </div>
    `).join('');
}

function filterMyAppointments(status, event) {
    document.querySelectorAll('.filter-buttons .btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    if (status === 'all') {
        displayMyAppointments(myAppointments);
    } else {
        displayMyAppointments(myAppointments.filter(apt => apt.status === status));
    }
}

function updateStats() {
    document.getElementById('myAppointmentsCount').textContent = myAppointments.length;
    document.getElementById('pendingCount').textContent =
        myAppointments.filter(a => a.status === 'PENDING').length;
    document.getElementById('completedCount').textContent =
        myAppointments.filter(a => a.status === 'TERMINE').length;
}

function showStatusModal(appointmentId, currentStatus) {
    currentAppointmentId = appointmentId;
    document.getElementById('currentStatus').textContent = currentStatus;
    document.getElementById('newStatusSelect').value     = currentStatus;
    document.getElementById('statusModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('statusModal').style.display = 'none';
}

document.getElementById('updateStatusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await api.put(`/appointments/${currentAppointmentId}`, {
            status: document.getElementById('newStatusSelect').value
        });
        alert('Statut mis à jour avec succès');
        closeModal();
        loadMyAppointments();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
});

window.onclick = (e) => { if (e.target.classList.contains('modal')) closeModal(); };

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = ROOT + 'pages/login/login.html';
        return;
    }
    if (!await checkEmployeeAccess()) return;
    updateNavigation();
    loadMyAppointments();
});
