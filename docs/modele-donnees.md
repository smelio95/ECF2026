# Modèle de données (Base relationnelle)

## Table : Role
- id (int)
- name (string)  
  Exemples : USER, EMPLOYEE, ADMIN

---

## Table : User
- id (int)
- firstname (string)
- lastname (string)
- email (string)
- password (string)
- role_id (int)
- created_at (date)

---

## Table : Service
- id (int)
- name (string)
- description (string)
- duration (int)
- price (float)

---

## Table : Appointment
- id (int)
- date (date)
- status (string)
- user_id (int)
- service_id (int)
- employee_id (int)

## Relations
- Un utilisateur possède un rôle
- Un utilisateur peut avoir plusieurs rendez-vous
- Un service peut être lié à plusieurs rendez-vous
- Un employé peut gérer plusieurs rendez-vous