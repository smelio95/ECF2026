document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
   
    const firstname      = document.getElementById('firstname').value.trim();
    const lastname       = document.getElementById('lastname').value.trim();
    const email          = document.getElementById('email').value.trim();
    const password       = document.getElementById('password').value;
    const phone          = document.getElementById('phone').value.trim();
    const errorDiv       = document.getElementById('errorMessage'); 
    const successDiv     = document.getElementById('successMessage');
    const registerButton = document.getElementById('registerButton');
    const ROOT           = window.ROOT_PATH || '../../'; 
    
    errorDiv.style.display   = 'none';
    successDiv.style.display = 'none';

    if (password.length < 8) {
        errorDiv.textContent   = 'Le mot de passe doit contenir au moins 8 caractères';
        errorDiv.style.display = 'block';
        return;
    }

    registerButton.disabled    = true;
    registerButton.textContent = 'Création en cours...';

    try {
        const userData = { firstname, lastname, email, password };
        if (phone) userData.phone = phone;

        await api.post('/auth/register', userData);

        successDiv.textContent   = 'Compte créé avec succès ! Redirection vers la connexion...';
        successDiv.style.display = 'block';

        setTimeout(() => { window.location.href = ROOT + 'pages/login/login.html'; }, 2000);
    } catch (error) {
        errorDiv.textContent       = error.message || 'Une erreur est survenue lors de la création du compte'; 
        errorDiv.style.display     = 'block';
        registerButton.disabled    = false;
        registerButton.textContent = 'Créer mon compte';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ROOT = window.ROOT_PATH || '../../';
    if (localStorage.getItem('token')) {
        window.location.href = ROOT + 'pages/profile/profile.html';
    }
});