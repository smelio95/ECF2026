//const ROOT = window.ROOT_PATH || '../../';
let currentUser = null;

async function loadProfile() {
    try {
        const response = await api.get('/auth/me');
        currentUser = response.user;

        document.getElementById('profileInfo').innerHTML = `
            <p><strong>Nom:</strong> ${currentUser.firstname} ${currentUser.lastname}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Rôle:</strong> ${currentUser.role.label}</p>
            ${currentUser.phone   ? `<p><strong>Téléphone:</strong> ${currentUser.phone}</p>`   : ''}
            ${currentUser.address ? `<p><strong>Adresse:</strong> ${currentUser.address}</p>`   : ''}
            ${currentUser.city    ? `<p><strong>Ville:</strong> ${currentUser.city}</p>`         : ''}
        `;

        document.getElementById('editFirstname').value = currentUser.firstname || '';
        document.getElementById('editLastname').value  = currentUser.lastname  || '';
        document.getElementById('editPhone').value     = currentUser.phone     || '';
        document.getElementById('editAddress').value   = currentUser.address   || '';
        document.getElementById('editCity').value      = currentUser.city      || '';
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('403')) {
            logout();
        }
    }
}

async function loadAppointments() {
    try {
        const appointments = await api.get('/appointments/me') || [];
        const listDiv = document.getElementById('appointmentsList');

        if (appointments.length === 0) {
            listDiv.innerHTML = '<p class="no-results">Aucune commande pour le moment</p>';
            return;
        }

        listDiv.innerHTML = appointments.map(apt => `
            <div class="appointment-card">
                <h3>${apt.service?.name || 'Service inconnu'}</h3>
                <p><strong>Date:</strong> ${new Date(apt.date).toLocaleString('fr-FR')}</p>
                <p><strong>Statut:</strong> <span class="status-badge status-${apt.status.toLowerCase()}">${apt.status}</span></p>
                <p><strong>Employé:</strong> ${apt.employee?.firstname} ${apt.employee?.lastname}</p>
            </div>
        `).join('');
    } catch (error) {
        document.getElementById('appointmentsList').innerHTML =
            '<p class="error">Erreur lors du chargement des commandes</p>';
    }
}

function toggleEditMode() {
    const infoDiv  = document.getElementById('profileInfo');
    const editDiv  = document.getElementById('editForm');
    const isEditing = editDiv.style.display !== 'none';
    infoDiv.style.display = isEditing ? 'block' : 'none';
    editDiv.style.display = isEditing ? 'none'  : 'block';
}

document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await api.put('/auth/me', {
            firstname: document.getElementById('editFirstname').value,
            lastname:  document.getElementById('editLastname').value,
            phone:     document.getElementById('editPhone').value,
            address:   document.getElementById('editAddress').value,
            city:      document.getElementById('editCity').value
        });
        alert('Profil mis à jour avec succès');
        toggleEditMode();
        loadProfile();
    } catch (error) {
        alert('Erreur lors de la mise à jour: ' + error.message);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (!isAuthenticated()) {
        window.location.href = ROOT + 'pages/login/login.html';
        return;
    }
    updateNavigation();
    loadProfile();
    loadAppointments();
});
