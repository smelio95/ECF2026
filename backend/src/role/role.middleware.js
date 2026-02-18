export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        // Debug
        console.log('=== REQUIRE ROLE DEBUG ===');
        console.log('User:', req.user);
        console.log('User Role:', req.user?.role);
        console.log('User Role Label:', req.user?.role?.label);
        console.log('Allowed Roles:', allowedRoles);
        console.log('========================');

        if (!req.user) {
            return res.status(401).json({ 
                message: "Authentification requise" 
            });
        }

        if (!req.user.role || !req.user.role.label) {
            return res.status(403).json({ 
                message: "Rôle utilisateur non défini" 
            });
        }

        const userRole = req.user.role.label;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: `Accès refusé. Rôle requis: ${allowedRoles.join(', ')}. Votre rôle: ${userRole}` 
            });
        }

        next();
    };
};