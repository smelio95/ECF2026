# Modèle Logique de Données (MLD)

## Table ROLE
- id (PK)
- name

---

## Table USER
- id (PK)
- firstname
- lastname
- email
- password
- created_at
- role_id (FK → ROLE.id)

---

## Table SERVICE
- id (PK)
- name
- description
- duration
- price

---

## Table APPOINTMENT
- id (PK)
- date
- status
- user_id (FK → USER.id)
- service_id (FK → SERVICE.id)
- employee_id (FK → USER.id)

## Clés et relations

- Un utilisateur est lié à un rôle via role_id
- Un rendez-vous est lié à un utilisateur (client)
- Un rendez-vous est lié à un service
- Un rendez-vous est lié à un employé (utilisateur avec rôle EMPLOYEE)
