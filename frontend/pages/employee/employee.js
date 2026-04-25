//const ROOT = window.ROOT_PATH || '../../';
let myAppointments       = [];
let currentAppointmentId = null;

function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

async function checkEmployeeAccess() {
    const user = getCurrentUser();
    const role = (user?.role?.label || user?.role || '').toString().toUpperCase();

    if (!user || !['EMPLOYEE', 'ADMIN'].includes(role)) {
        alert('Accès réservé aux employés');
        window.location.href = ROOT + 'index.html';
        return false;
    }
    document.getElementById('welcomeMessage').textContent = `Bienvenue ${user.firstname || ''} ${user.lastname || ''}`;
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
    document.getElementById('appointmentDetails').textContent = `Statut actuel : ${currentStatus}`;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('statusModal').style.display = 'block';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

document.getElementById('updateStatusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await api.put(`/appointments/${currentAppointmentId}`, {
            status: document.getElementById('newStatus').value
        });
        alert('Statut mis à jour avec succès');
        closeAllModals();
        loadMyAppointments();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
});

window.onclick = (e) => { 
    if (e.target.classList.contains('modal')) 
        closeAllModals(); 
    };


document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = ROOT + 'pages/login/login.html';
        return;
    }
    if (!await checkEmployeeAccess()) return;
    updateNavigation();
    loadMyAppointments();
});

function showCreatePlatModal() {
    document.getElementById('createPlatModal').style.display = 'block';
}

function showCreateServiceModal() {
    document.getElementById('createServiceModal').style.display = 'block';
}

function switchTab(tabName, event) {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    if (event?.target) {
        event.target.classList.add('active');
    }

    document.getElementById(tabName + 'Tab').classList.add('active');

    if (tabName === 'appointments') {
        loadMyAppointments();
    }

    if (tabName === 'catalog') {
        loadEmployeeCatalog();
    }
}

async function loadEmployeeCatalog() {
    try {
        const [plats, servicesResponse] = await Promise.all([
            api.get('/plats'),
            api.get('/services')
        ]);

        const services = servicesResponse.services || [];

        document.getElementById('employeePlatsList').innerHTML = plats.map(plat => `
            <div class="admin-item">
                <h3>${plat.title}</h3>
                ${plat.photo ? `<img src="${plat.photo}" alt="${plat.title}" class="item-image">` : ''}
            </div>
        `).join('');

        document.getElementById('employeeServicesList').innerHTML = services.map(service => `
            <div class="admin-item">
                <h3>${service.name}</h3>
                <p>${service.description || ''}</p>
                <p><strong>${service.price} €</strong></p>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erreur chargement catalogue employé:', error);
    }
}