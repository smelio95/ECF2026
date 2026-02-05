# Schéma SQL – Base relationnelle (PostgreSQL)

## Table role
- id SERIAL PRIMARY KEY
- name VARCHAR(50) NOT NULL

---

## Table user
- id SERIAL PRIMARY KEY
- firstname VARCHAR(50)
- lastname VARCHAR(50)
- email VARCHAR(100) UNIQUE NOT NULL
- password VARCHAR(255) NOT NULL
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- role_id INT REFERENCES role(id)

---

## Table service
- id SERIAL PRIMARY KEY
- name VARCHAR(100) NOT NULL
- description TEXT
- duration INT
- price DECIMAL(10,2)

---

## Table appointment
- id SERIAL PRIMARY KEY
- date TIMESTAMP NOT NULL
- status VARCHAR(50)
- user_id INT REFERENCES user(id)
- service_id INT REFERENCES service(id)
- employee_id INT REFERENCES user(id)

---

## Remarques

- Les clés primaires sont définies avec SERIAL
- Les relations sont assurées par des clés étrangères
- La table appointment référence deux utilisateurs :
  - un client
  - un employé
- Le hash du mot de passe sera géré côté backend
