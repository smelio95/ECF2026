// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
let allAppointments = [];
let allPlats        = [];
let allThemes       = [];
let allRegimes      = [];
let allUsers        = [];
let allReviews      = [];
let currentEditId   = null;

// ══════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════
function toggleMobileMenu() {
    document.querySelector('.nav-menu').classList.toggle('active');
}

/*async function checkAdminAccess() {
    const user = getCurrentUser();
    if (!user || user.role.label !== 'ADMIN') {
        alert('Accès réservé aux administrateurs');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}
*/


async function checkAdminAccess() {
    const user = getCurrentUser();
    const role = user?.role?.label || user?.role || '';
    if (!user || role.toString().toUpperCase() !== 'ADMIN') {
        alert('Accès réservé aux administrateurs');
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}



// ══════════════════════════════════════════
// DASHBOARD STATS
// ══════════════════════════════════════════
async function loadDashboardStats() {
    try {
        const [services, appointments, plats, users, reviews] = await Promise.all([
            api.get('/services'),
            api.get('/appointments'),
            api.get('/plats'),
            api.get('/users'),
            api.get('/reviews')
        ]);

        document.getElementById('totalServices').textContent     = services.services?.length || 0;
        document.getElementById('totalAppointments').textContent = appointments?.length || 0;
        document.getElementById('totalPlats').textContent        = plats?.length || 0;
        document.getElementById('totalUsers').textContent        = users?.length || 0;

        const pendingEl = document.getElementById('totalPendingReviews');
        if (pendingEl) {
            const pending = (reviews?.reviews || reviews || []).filter(r => r.status === 'PENDING').length;
            pendingEl.textContent = pending;
        }
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

// ══════════════════════════════════════════
// TABS
// ══════════════════════════════════════════
function switchTab(tabName, event) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    if (event && event.target) event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');

    if      (tabName === 'services')     loadServices();
    else if (tabName === 'plats')        loadPlats();
    else if (tabName === 'appointments') loadAppointments();
    else if (tabName === 'users')        loadUsers();
    else if (tabName === 'reviews')      loadReviews();
    else if (tabName === 'horaires')     loadHoraires();
}

// ══════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    currentEditId = null;
}

// ══════════════════════════════════════════
// SERVICES
// ══════════════════════════════════════════
async function loadServices() {
    try {
        const response = await api.get('/services');
        const services = response.services || [];
        const listDiv  = document.getElementById('servicesList');

        if (services.length === 0) {
            listDiv.innerHTML = '<p class="no-results">Aucun service créé</p>';
            return;
        }

        listDiv.innerHTML = services.map(service => `
            <div class="admin-item">
                <div class="item-header">
                    <h3>${service.name}</h3>
                    <span class="item-price">${service.price} €</span>
                </div>
                <p>${service.description || 'Pas de description'}</p>
                <div class="item-meta">
                    <span class="badge">${service.regime?.label || 'Pas de régime'}</span>
                    <span class="badge">${service.theme?.label || 'Pas de thème'}</span>
                    <span class="badge">${service.plats?.length || 0} plats</span>
                    <span class="badge">${service.duration || 0} min</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-primary" onclick="showServiceModal(${service.id})">Modifier</button>
                    <button class="btn btn-sm btn-danger"  onclick="deleteService(${service.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement services:', error);
    }
}

async function loadFormData() {
    try {
        [allThemes, allRegimes, allPlats] = await Promise.all([
            api.get('/themes').then(r => r.themes || []),
            api.get('/regimes').then(r => r.regimes || []),
            api.get('/plats')
        ]);

        document.getElementById('serviceTheme').innerHTML =
            '<option value="">Aucun</option>' +
            allThemes.map(t => `<option value="${t.id}">${t.label}</option>`).join('');

        document.getElementById('serviceRegime').innerHTML =
            '<option value="">Aucun</option>' +
            allRegimes.map(r => `<option value="${r.id}">${r.label}</option>`).join('');

        document.getElementById('platsCheckboxes').innerHTML =
            allPlats.map(p => `
                <label class="checkbox-label">
                    <input type="checkbox" value="${p.id}"> ${p.title}
                </label>
            `).join('');
    } catch (error) {
        console.error('Erreur chargement données formulaire:', error);
    }
}

async function showServiceModal(id) {
    await loadFormData();
    currentEditId = id || null;

    const modal = document.getElementById('createServiceModal');
    const title = modal.querySelector('h2');

    if (id) {
        title.textContent = 'Modifier le Service';
        try {
            const service = await api.get(`/services/${id}`);
            document.getElementById('serviceName').value        = service.name || '';
            document.getElementById('serviceDescription').value = service.description || '';
            document.getElementById('servicePrice').value       = service.price || '';
            document.getElementById('serviceDuration').value    = service.duration || 120;
            document.getElementById('serviceTheme').value       = service.theme_id || '';
            document.getElementById('serviceRegime').value      = service.regime_id || '';

            const platIds = (service.plats || []).map(p => p.id);
            document.querySelectorAll('#platsCheckboxes input[type="checkbox"]').forEach(cb => {
                cb.checked = platIds.includes(parseInt(cb.value));
            });
        } catch (e) {
            console.error('Erreur chargement service:', e);
        }
    } else {
        title.textContent = 'Créer un Nouveau Service';
        document.getElementById('createServiceForm').reset();
        document.getElementById('serviceDuration').value = 120;
    }

    modal.style.display = 'block';
}

// ══════════════════════════════════════════
// PLATS
// ══════════════════════════════════════════
async function loadPlats() {
    try {
        const plats = await api.get('/plats');
        allPlats = plats;
        const listDiv = document.getElementById('platsList');

        if (plats.length === 0) {
            listDiv.innerHTML = '<p class="no-results">Aucun plat créé</p>';
            return;
        }

        listDiv.innerHTML = plats.map(plat => `
            <div class="admin-item">
                <div class="item-header">
                    <h3>${plat.title}</h3>
                </div>
                ${plat.photo ? `<img src="${plat.photo}" alt="${plat.title}" class="item-image">` : ''}
                <p class="item-date">Créé le ${new Date(plat.created_at).toLocaleDateString('fr-FR')}</p>
                <div class="item-actions">
                    <button class="btn btn-sm btn-danger" onclick="deletePlat(${plat.id})">Supprimer</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur chargement plats:', error);
    }
}

function showCreatePlatModal() {
    document.getElementById('createPlatModal').style.display = 'block';
}

async function deletePlat(id) {
    if (!confirm('Supprimer ce plat ?')) return;
    try {
        await api.delete(`/plats/${id}`);
        alert('Plat supprimé');
        loadPlats();
        loadDashboardStats();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// ══════════════════════════════════════════
// APPOINTMENTS
// ══════════════════════════════════════════
async function loadAppointments() {
    try {
        allAppointments = await api.get('/appointments');
        filterAppointments('all');
    } catch (error) {
        console.error('Erreur chargement commandes:', error);
    }
}

function displayAppointments(appointments) {
    const listDiv = document.getElementById('appointmentsList');

    if (!appointments || appointments.length === 0) {
        listDiv.innerHTML = '<p class="no-results">Aucune commande</p>';
        return;
    }

    listDiv.innerHTML = appointments.map(apt => `
        <div class="admin-item">
            <div class="item-header">
                <h3>${apt.service?.name || 'Service supprimé'}</h3>
                <span class="status-badge status-${apt.status.toLowerCase()}">${apt.status}</span>
            </div>
            <p><strong>Client:</strong> ${apt.user?.firstname} ${apt.user?.lastname} (${apt.user?.email})</p>
            <p><strong>Employé:</strong> ${apt.employee?.firstname} ${apt.employee?.lastname}</p>
            <p><strong>Date:</strong> ${new Date(apt.date).toLocaleString('fr-FR')}</p>
            <p><strong>Prix:</strong> ${apt.service?.price} €</p>
            <div class="item-actions">
                <button class="btn btn-sm btn-primary" onclick="showChangeStatusModal(${apt.id}, '${apt.status}')">Changer statut</button>
                <button class="btn btn-sm btn-danger"  onclick="deleteAppointment(${apt.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
}

function filterAppointments(status) {
    if (status === 'all') {
        displayAppointments(allAppointments);
    } else {
        displayAppointments(allAppointments.filter(apt => apt.status === status));
    }
}

function showChangeStatusModal(id, currentStatus) {
    currentEditId = id;
    document.getElementById('currentAppointmentStatus').textContent = currentStatus;
    document.getElementById('newStatus').value = currentStatus;
    document.getElementById('changeStatusModal').style.display = 'block';
}

async function deleteAppointment(id) {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
        await api.delete(`/appointments/${id}`);
        alert('Commande supprimée');
        loadAppointments();
        loadDashboardStats();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// ══════════════════════════════════════════
// USERS
// ══════════════════════════════════════════
async function loadUsers() {
    try {
        allUsers = await api.get('/users');
        const listDiv = document.getElementById('usersList');

        const grouped = {
            ADMIN:       allUsers.filter(u => u.role?.label === 'ADMIN'),
            EMPLOYEE:    allUsers.filter(u => u.role?.label === 'EMPLOYEE'),
            UTILISATEUR: allUsers.filter(u => u.role?.label === 'UTILISATEUR')
        };

        listDiv.innerHTML = Object.entries(grouped).map(([role, users]) => `
            <div class="user-group">
                <div class="user-group-title">${role} (${users.length})</div>
                ${users.map(user => `
                    <div class="admin-item">
                        <div class="user-info-row">
                            <div class="user-avatar" style="background:${role === 'ADMIN' ? '#c0392b' : role === 'EMPLOYEE' ? '#2980b9' : '#27ae60'}">
                                ${user.firstname[0]}${user.lastname[0]}
                            </div>
                            <div>
                                <strong>${user.firstname} ${user.lastname}</strong>
                                <span class="role-badge role-${role}">${role}</span>
                                <p>${user.email}</p>
                                ${user.phone ? `<p>Tél: ${user.phone}</p>` : ''}
                                ${user.city  ? `<p>${user.city}</p>`       : ''}
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="btn btn-sm btn-primary" onclick="showUserModal(${user.id})">Modifier</button>
                            <button class="btn btn-sm btn-danger"  onclick="deleteUser(${user.id}, '${user.firstname} ${user.lastname}')">Supprimer</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');

        document.getElementById('totalUsers').textContent = allUsers.length;
    } catch (error) {
        console.error('Erreur chargement utilisateurs:', error);
    }
}

async function showUserModal(id) {
    currentEditId = id || null;
    const modal    = document.getElementById('userModal');
    const title    = modal.querySelector('h2');
    const pwdField = document.getElementById('userPassword');

    if (id) {
        title.textContent = "Modifier l'Utilisateur";
        pwdField.required = false;
        pwdField.placeholder = 'Laisser vide = inchangé';
        const user = allUsers.find(u => u.id === id);
        if (user) {
            document.getElementById('userFirstname').value = user.firstname || '';
            document.getElementById('userLastname').value  = user.lastname  || '';
            document.getElementById('userEmail').value     = user.email     || '';
            document.getElementById('userPhone').value     = user.phone     || '';
            document.getElementById('userAddress').value   = user.address   || '';
            document.getElementById('userCity').value      = user.city      || '';
            document.getElementById('userRole').value      = user.role?.label || 'UTILISATEUR';
            document.getElementById('userPassword').value  = '';
        }
    } else {
        title.textContent = 'Créer un Utilisateur';
        pwdField.required = true;
        pwdField.placeholder = 'Mot de passe';
        document.getElementById('userForm').reset();
    }

    modal.style.display = 'block';
}

async function deleteUser(id, name) {
    if (!confirm(`Supprimer l'utilisateur ${name} ?`)) return;
    try {
        await api.delete(`/users/${id}`);
        alert('Utilisateur supprimé');
        loadUsers();
        loadDashboardStats();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// ══════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════
async function loadReviews() {
    try {
        const response = await api.get('/reviews');
        allReviews = response.reviews || response || [];
        filterReviews('all');
    } catch (error) {
        console.error('Erreur chargement avis:', error);
    }
}

function filterReviews(status) {
    const filtered = status === 'all' ? allReviews : allReviews.filter(r => r.status === status);
    const listDiv  = document.getElementById('reviewsList');

    if (filtered.length === 0) {
        listDiv.innerHTML = '<p class="no-results">Aucun avis</p>';
        return;
    }

    listDiv.innerHTML = filtered.map(rev => `
        <div class="admin-item review-${rev.status.toLowerCase()}">
            <div class="item-header">
                <h3>${rev.user?.firstname} ${rev.user?.lastname}</h3>
                <span class="status-badge status-${rev.status.toLowerCase()}">${rev.status}</span>
            </div>
            <p><strong>Service:</strong> ${rev.service?.name || 'N/A'}</p>
            <p class="review-stars-display">${'⭐'.repeat(rev.note)}${'☆'.repeat(5 - rev.note)}</p>
            <p>${rev.description || ''}</p>
            <p class="item-date">${new Date(rev.created_at).toLocaleDateString('fr-FR')}</p>
            <div class="item-actions">
                ${rev.status !== 'APPROVED' ? `<button class="btn btn-sm btn-success" onclick="moderateReview(${rev.id}, 'APPROVED')">✅ Approuver</button>` : ''}
                ${rev.status !== 'REJECTED' ? `<button class="btn btn-sm btn-warning" onclick="moderateReview(${rev.id}, 'REJECTED')">❌ Rejeter</button>`  : ''}
                <button class="btn btn-sm btn-danger" onclick="deleteReview(${rev.id})">🗑️ Supprimer</button>
            </div>
        </div>
    `).join('');
}

async function moderateReview(id, status) {
    try {
        await api.put(`/reviews/${id}`, { status });
        loadReviews();
        loadDashboardStats();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

async function deleteReview(id) {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
        await api.delete(`/reviews/${id}`);
        loadReviews();
        loadDashboardStats();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// ══════════════════════════════════════════
// HORAIRES
// ══════════════════════════════════════════
async function loadHoraires() {
    try {
        const response = await api.get('/horaires');
        const horaires = response.horaires || [];
        const listDiv  = document.getElementById('horairesList');

        listDiv.innerHTML = `
            <table class="horaires-table">
                <thead>
                    <tr><th>Jour</th><th>Ouverture</th><th>Fermeture</th><th>Statut</th></tr>
                </thead>
                <tbody>
                    ${horaires.map(h => `
                        <tr>
                            <td><strong>${h.day}</strong></td>
                            <td><input class="form-control" id="open_${h.id}" value="${h.opening_time}"></td>
                            <td><input class="form-control" id="close_${h.id}" value="${h.closing_time}"></td>
                            <td>${h.opening_time === 'Fermé' ? '🔴 Fermé' : '🟢 Ouvert'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top:1rem">
                <button class="btn btn-primary" onclick="saveHoraires(${JSON.stringify(horaires.map(h => h.id))})">
                    💾 Sauvegarder les horaires
                </button>
                <small style="color:var(--text-light); margin-left:1rem">
                    Tapez "Fermé" dans les deux champs pour marquer un jour fermé.
                </small>
            </div>
        `;
    } catch (error) {
        console.error('Erreur chargement horaires:', error);
    }
}

async function saveHoraires(ids) {
    try {
        for (const id of ids) {
            const opening_time = document.getElementById(`open_${id}`).value.trim();
            const closing_time = document.getElementById(`close_${id}`).value.trim();
            await api.put(`/horaires/${id}`, { opening_time, closing_time });
        }
        alert('Horaires sauvegardés !');
        loadHoraires();
    } catch (error) {
        alert('Erreur: ' + error.message);
    }
}

// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════
window.onclick = e => { if (e.target.classList.contains('modal')) closeAllModals(); };

document.addEventListener('DOMContentLoaded', async () => {
    if (!isAuthenticated()) {
        window.location.href = '../../pages/login/login.html';
        return;
    }

    if (!await checkAdminAccess()) return;

    updateNavigation();
    loadDashboardStats();
    loadServices();

    // Attacher les formulaires
    document.getElementById('createServiceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedPlats = Array.from(document.querySelectorAll('#platsCheckboxes input:checked'))
            .map(cb => parseInt(cb.value));
        const serviceData = {
            name:        document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            price:       parseFloat(document.getElementById('servicePrice').value),
            duration:    parseInt(document.getElementById('serviceDuration').value) || 120,
            theme_id:    parseInt(document.getElementById('serviceTheme').value) || null,
            regime_id:   parseInt(document.getElementById('serviceRegime').value) || null,
            plat_ids:    selectedPlats
        };
        try {
            if (currentEditId) {
                await api.put(`/services/${currentEditId}`, serviceData);
                alert('Service modifié avec succès');
            } else {
                await api.post('/services', serviceData);
                alert('Service créé avec succès');
            }
            closeAllModals();
            loadServices();
            loadDashboardStats();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });

    document.getElementById('createPlatForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const platData = {
            title: document.getElementById('platTitle').value,
            photo: document.getElementById('platPhoto').value || null
        };
        try {
            await api.post('/plats', platData);
            alert('Plat créé avec succès');
            closeAllModals();
            document.getElementById('createPlatForm').reset();
            loadPlats();
            loadDashboardStats();
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    });

    const changeStatusForm = document.getElementById('changeStatusForm');
    if (changeStatusForm) {
        changeStatusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await api.put(`/appointments/${currentEditId}`, {
                    status: document.getElementById('newStatus').value
                });
                alert('Statut mis à jour');
                closeAllModals();
                loadAppointments();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }

    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pwd = document.getElementById('userPassword').value;
            const userData = {
                firstname: document.getElementById('userFirstname').value,
                lastname:  document.getElementById('userLastname').value,
                email:     document.getElementById('userEmail').value,
                phone:     document.getElementById('userPhone').value || null,
                address:   document.getElementById('userAddress').value || null,
                city:      document.getElementById('userCity').value || null,
                role:      document.getElementById('userRole').value
            };
            if (pwd) userData.password = pwd;
            try {
                if (currentEditId) {
                    await api.put(`/users/${currentEditId}`, userData);
                    alert('Utilisateur modifié');
                } else {
                    await api.post('/users', userData);
                    alert('Utilisateur créé');
                }
                closeAllModals();
                loadUsers();
                loadDashboardStats();
            } catch (error) {
                alert('Erreur: ' + error.message);
            }
        });
    }
});
