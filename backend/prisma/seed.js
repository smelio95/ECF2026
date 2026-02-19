import prisma from '../prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Début du seeding enrichi...');

  // ============================================================
  // 1. RÔLES
  // ============================================================
  console.log('📝 Création des rôles...');

  const adminRole = await prisma.role.upsert({
    where: { label: 'ADMIN' },
    update: {},
    create: { label: 'ADMIN' }
  });
  const employeeRole = await prisma.role.upsert({
    where: { label: 'EMPLOYEE' },
    update: {},
    create: { label: 'EMPLOYEE' }
  });
  const userRole = await prisma.role.upsert({
    where: { label: 'UTILISATEUR' },
    update: {},
    create: { label: 'UTILISATEUR' }
  });

  console.log('✅ Rôles créés');

  // ============================================================
  // 2. UTILISATEURS (3 admins, 4 employés, 8 clients)
  // ============================================================
  console.log('👥 Création des utilisateurs...');

  const hashAdmin    = await bcrypt.hash('Admin123!',    10);
  const hashEmployee = await bcrypt.hash('Employee123!', 10);
  const hashUser     = await bcrypt.hash('User123!',     10);

  // ── Administrateurs
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@vitegourmand.fr' },
    update: {},
    create: {
      email: 'admin@vitegourmand.fr', password: hashAdmin,
      firstname: 'Julie', lastname: 'Martin',
      phone: '0601020304', address: '12 rue de la Paix', city: 'Paris',
      role_id: adminRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'admin2@vitegourmand.fr' },
    update: {},
    create: {
      email: 'admin2@vitegourmand.fr', password: hashAdmin,
      firstname: 'Marc', lastname: 'Dupuis',
      phone: '0601020305', address: '8 avenue Victor Hugo', city: 'Lyon',
      role_id: adminRole.id
    }
  });

  // ── Employés
  const employee1 = await prisma.user.upsert({
    where: { email: 'jose@vitegourmand.fr' },
    update: {},
    create: {
      email: 'jose@vitegourmand.fr', password: hashEmployee,
      firstname: 'José', lastname: 'Rodriguez',
      phone: '0605060708', address: '3 rue du Moulin', city: 'Bordeaux',
      role_id: employeeRole.id
    }
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'marie@vitegourmand.fr' },
    update: {},
    create: {
      email: 'marie@vitegourmand.fr', password: hashEmployee,
      firstname: 'Marie', lastname: 'Leblanc',
      phone: '0605060709', address: '15 boulevard des Fleurs', city: 'Nantes',
      role_id: employeeRole.id
    }
  });

  const employee3 = await prisma.user.upsert({
    where: { email: 'pierre@vitegourmand.fr' },
    update: {},
    create: {
      email: 'pierre@vitegourmand.fr', password: hashEmployee,
      firstname: 'Pierre', lastname: 'Fontaine',
      phone: '0605060710', address: '27 rue des Acacias', city: 'Marseille',
      role_id: employeeRole.id
    }
  });

  const employee4 = await prisma.user.upsert({
    where: { email: 'sophie@vitegourmand.fr' },
    update: {},
    create: {
      email: 'sophie@vitegourmand.fr', password: hashEmployee,
      firstname: 'Sophie', lastname: 'Bernard',
      phone: '0605060711', address: '5 allée des Pins', city: 'Toulouse',
      role_id: employeeRole.id
    }
  });

  // ── Clients
  const client1 = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com', password: hashUser,
      firstname: 'Jean', lastname: 'Dupont',
      phone: '0609101112', address: '42 rue Nationale', city: 'Lille',
      role_id: userRole.id
    }
  });

  const client2 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com', password: hashUser,
      firstname: 'Alice', lastname: 'Moreau',
      phone: '0609101113', address: '7 place du Marché', city: 'Strasbourg',
      role_id: userRole.id
    }
  });

  const client3 = await prisma.user.upsert({
    where: { email: 'thomas@example.com' },
    update: {},
    create: {
      email: 'thomas@example.com', password: hashUser,
      firstname: 'Thomas', lastname: 'Petit',
      phone: '0609101114', address: '19 impasse des Lilas', city: 'Rennes',
      role_id: userRole.id
    }
  });

  const client4 = await prisma.user.upsert({
    where: { email: 'camille@example.com' },
    update: {},
    create: {
      email: 'camille@example.com', password: hashUser,
      firstname: 'Camille', lastname: 'Rousseau',
      phone: '0609101115', address: '33 rue de la Liberté', city: 'Nice',
      role_id: userRole.id
    }
  });

  const client5 = await prisma.user.upsert({
    where: { email: 'lucas@example.com' },
    update: {},
    create: {
      email: 'lucas@example.com', password: hashUser,
      firstname: 'Lucas', lastname: 'Girard',
      phone: '0609101116', address: '88 avenue du Lac', city: 'Montpellier',
      role_id: userRole.id
    }
  });

  const client6 = await prisma.user.upsert({
    where: { email: 'emma@example.com' },
    update: {},
    create: {
      email: 'emma@example.com', password: hashUser,
      firstname: 'Emma', lastname: 'Laurent',
      phone: '0609101117', address: '14 rue Victor Hugo', city: 'Grenoble',
      role_id: userRole.id
    }
  });

  const client7 = await prisma.user.upsert({
    where: { email: 'hugo@example.com' },
    update: {},
    create: {
      email: 'hugo@example.com', password: hashUser,
      firstname: 'Hugo', lastname: 'Simon',
      phone: '0609101118', address: '2 square des Arts', city: 'Dijon',
      role_id: userRole.id
    }
  });

  console.log('✅ 13 utilisateurs créés');

  // ============================================================
  // 3. RÉGIMES
  // ============================================================
  console.log('🥗 Création des régimes...');

  const regimeClassique = await prisma.regime.upsert({ where: { label: 'Classique' },    update: {}, create: { label: 'Classique' } });
  const regimeVegetarien= await prisma.regime.upsert({ where: { label: 'Végétarien' },   update: {}, create: { label: 'Végétarien' } });
  const regimeVegan     = await prisma.regime.upsert({ where: { label: 'Vegan' },        update: {}, create: { label: 'Vegan' } });
  const regimeSansGluten= await prisma.regime.upsert({ where: { label: 'Sans Gluten' },  update: {}, create: { label: 'Sans Gluten' } });
  const regimeHalal     = await prisma.regime.upsert({ where: { label: 'Halal' },        update: {}, create: { label: 'Halal' } });

  console.log('✅ 5 régimes créés');

  // ============================================================
  // 4. THÈMES
  // ============================================================
  console.log('🎨 Création des thèmes...');

  const themeNoel      = await prisma.theme.upsert({ where: { label: 'Noël' },           update: {}, create: { label: 'Noël' } });
  const themePaques    = await prisma.theme.upsert({ where: { label: 'Pâques' },         update: {}, create: { label: 'Pâques' } });
  const themeClassique = await prisma.theme.upsert({ where: { label: 'Classique' },      update: {}, create: { label: 'Classique' } });
  const themeEvenement = await prisma.theme.upsert({ where: { label: 'Événement' },      update: {}, create: { label: 'Événement' } });
  const themeMariage   = await prisma.theme.upsert({ where: { label: 'Mariage' },        update: {}, create: { label: 'Mariage' } });
  const themeEte       = await prisma.theme.upsert({ where: { label: 'Été / BBQ' },      update: {}, create: { label: 'Été / BBQ' } });
  const themeAsiatique = await prisma.theme.upsert({ where: { label: 'Asiatique' },      update: {}, create: { label: 'Asiatique' } });
  const themeMed       = await prisma.theme.upsert({ where: { label: 'Méditerranéen' },  update: {}, create: { label: 'Méditerranéen' } });

  console.log('✅ 8 thèmes créés');

  // ============================================================
  // 5. ALLERGÈNES
  // ============================================================
  console.log('⚠️  Création des allergènes...');

  const allergeneLabels = [
    'Gluten','Lactose','Fruits à coque','Œufs','Poisson',
    'Crustacés','Soja','Céleri','Moutarde','Sésame',
    'Arachides','Sulfites','Lupin','Mollusques'
  ];

  for (const label of allergeneLabels) {
    await prisma.allergene.upsert({ where: { label }, update: {}, create: { label } });
  }

  const getAllergene = l => prisma.allergene.findUnique({ where: { label: l } });
  const [gluten, lactose, fruitsAcoque, oeufs, poisson, crustaces, soja, celeri, moutarde, sesame, arachides, sulfites] =
    await Promise.all(allergeneLabels.slice(0,12).map(getAllergene));

  console.log('✅ 14 allergènes créés');

  // ============================================================
  // 6. PLATS (20 plats avec photos Unsplash)
  // ============================================================
  console.log('🍽️  Création des plats...');

  await prisma.plat.deleteMany({});

  const platsData = [
    { title: 'Foie Gras Poêlé',              photo: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', allergenes: [lactose, oeufs] },
    { title: 'Saint-Jacques Poêlées',         photo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', allergenes: [crustaces, poisson] },
    { title: 'Dinde Farcie aux Marrons',      photo: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400', allergenes: [gluten, celeri] },
    { title: 'Plateau de Fromages',          photo: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400', allergenes: [lactose] },
    { title: 'Bûche Glacée Praliné',         photo: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400', allergenes: [lactose, oeufs, fruitsAcoque] },
    { title: 'Saumon Gravlax',               photo: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400', allergenes: [poisson] },
    { title: 'Velouté de Champignons',       photo: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', allergenes: [celeri] },
    { title: 'Risotto aux Truffes',          photo: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', allergenes: [lactose] },
    { title: 'Crème Brûlée Vanille',         photo: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400', allergenes: [lactose, oeufs] },
    { title: 'Assortiment de Macarons',      photo: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400', allergenes: [oeufs, fruitsAcoque] },
    { title: 'Quiche Lorraine',              photo: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', allergenes: [gluten, lactose, oeufs] },
    { title: 'Taboulé Oriental',             photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', allergenes: [] },
    { title: 'Carpaccio de Bœuf',           photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', allergenes: [moutarde] },
    { title: 'Plateau de Sushis',           photo: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', allergenes: [poisson, soja, sesame] },
    { title: 'Brochettes d\'Agneau',        photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', allergenes: [celeri] },
    { title: 'Tarte Tatin',                  photo: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', allergenes: [gluten, lactose, oeufs] },
    { title: 'Gaspacho Andalou',            photo: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', allergenes: [] },
    { title: 'Panna Cotta aux Fruits Rouges', photo: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400', allergenes: [lactose, sulfites] },
    { title: 'Burger Gourmet',               photo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', allergenes: [gluten, oeufs, lactose, sesame] },
    { title: 'Assiette de Charcuteries',    photo: 'https://images.unsplash.com/photo-1606851181050-5ee29f1b0a97?w=400', allergenes: [sulfites] },
  ];

  const plats = [];
  for (const { title, photo, allergenes: alls } of platsData) {
    const plat = await prisma.plat.create({ data: { title, photo } });
    if (alls.length) {
      await prisma.plat.update({
        where: { id: plat.id },
        data: { allergenes: { connect: alls.filter(Boolean).map(a => ({ id: a.id })) } }
      });
    }
    plats.push(plat);
  }

  const [foieGras, saintJacques, dinde, fromages, buche, saumon, soupe, risotto,
         cremeBrulee, macarons, quiche, taboule, carpaccio, sushis, brochettes,
         tarteTatin, gaspacho, pannaCotta, burger, charcuterie] = plats;

  console.log('✅ 20 plats créés avec allergènes');

  // ============================================================
  // 7. SERVICES / MENUS (10 services variés)
  // ============================================================
  console.log('🎪 Création des services...');

  // Supprimer dans le bon ordre pour respecter les contraintes FK
  await prisma.review.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});

  const services = [];

  services.push(await prisma.service.create({ data: {
    name: 'Menu Gastronomique Noël',
    description: 'Menu d\'exception 5 services pour vos fêtes de fin d\'année. Foie gras, Saint-Jacques, dinde farcie, fromages affinés et bûche glacée praliné.',
    price: 95, duration: 180,
    regime_id: regimeClassique.id, theme_id: themeNoel.id,
    plats: { connect: [foieGras, saintJacques, dinde, fromages, buche].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Cocktail Dînatoire Prestige',
    description: 'Buffet élaboré avec verrines, mises en bouche et desserts raffinés. Idéal pour vos réceptions professionnelles et anniversaires.',
    price: 65, duration: 120,
    regime_id: regimeClassique.id, theme_id: themeEvenement.id,
    plats: { connect: [saumon, soupe, macarons, charcuterie].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Menu Végétarien Gourmet',
    description: 'Découvrez notre sélection végétarienne raffinée. Risotto aux truffes, velouté de champignons et desserts maison sans compromis.',
    price: 55, duration: 150,
    regime_id: regimeVegetarien.id, theme_id: themeClassique.id,
    plats: { connect: [risotto, soupe, cremeBrulee, taboule].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Brunch Pâques en Famille',
    description: 'Un brunch festif et convivial pour célébrer Pâques. Quiche lorraine, taboulé frais, macarons colorés et surprises gourmandes.',
    price: 45, duration: 90,
    regime_id: regimeClassique.id, theme_id: themePaques.id,
    plats: { connect: [quiche, taboule, macarons, tarteTatin].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Menu Vegan Saison',
    description: 'Une cuisine végane créative et savoureuse. Gaspacho andalou, taboulé oriental et desserts sans produits animaux.',
    price: 50, duration: 120,
    regime_id: regimeVegan.id, theme_id: themeClassique.id,
    plats: { connect: [taboule, soupe, gaspacho].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Soirée Gastronomique Classique',
    description: 'Le grand classique de Vite & Gourmand. Saumon gravlax, risotto aux truffes, plateau de fromages affinés et crème brûlée maison.',
    price: 75, duration: 180,
    regime_id: regimeClassique.id, theme_id: themeClassique.id,
    plats: { connect: [saumon, risotto, fromages, cremeBrulee].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Banquet Mariage Prestige',
    description: 'Le menu de vos rêves pour votre jour J. Foie gras, Saint-Jacques, saumon, plateau de fromages et pièce montée de macarons.',
    price: 135, duration: 240,
    regime_id: regimeClassique.id, theme_id: themeMariage.id,
    plats: { connect: [foieGras, saintJacques, saumon, fromages, macarons, pannaCotta].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'BBQ Summer Party',
    description: 'Profitez de l\'été avec nos brochettes d\'agneau, burgers gourmets et desserts frais. Parfait pour vos fêtes en plein air.',
    price: 48, duration: 120,
    regime_id: regimeClassique.id, theme_id: themeEte.id,
    plats: { connect: [brochettes, burger, taboule, pannaCotta].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Menu Asiatique Fusion',
    description: 'Voyage culinaire en Asie avec nos sushis premium, carpaccio et desserts aux saveurs exotiques.',
    price: 70, duration: 150,
    regime_id: regimeSansGluten.id, theme_id: themeAsiatique.id,
    plats: { connect: [sushis, carpaccio, pannaCotta].map(p => ({ id: p.id })) }
  }}));

  services.push(await prisma.service.create({ data: {
    name: 'Buffet Méditerranéen',
    description: 'Les saveurs du bassin méditerranéen : gaspacho, carpaccio, charcuteries et tarte tatin en dessert.',
    price: 58, duration: 120,
    regime_id: regimeClassique.id, theme_id: themeMed.id,
    plats: { connect: [gaspacho, carpaccio, charcuterie, tarteTatin].map(p => ({ id: p.id })) }
  }}));

  console.log('✅ 10 services créés');

  // ============================================================
  // 8. HORAIRES
  // ============================================================
  console.log('🕐 Création des horaires...');

  await prisma.horaire.deleteMany({});

  const horaires = [
    { day: 'Lundi',     opening_time: '09:00', closing_time: '18:00' },
    { day: 'Mardi',     opening_time: '09:00', closing_time: '18:00' },
    { day: 'Mercredi',  opening_time: '09:00', closing_time: '18:00' },
    { day: 'Jeudi',     opening_time: '09:00', closing_time: '18:00' },
    { day: 'Vendredi',  opening_time: '09:00', closing_time: '20:00' },
    { day: 'Samedi',    opening_time: '10:00', closing_time: '20:00' },
    { day: 'Dimanche',  opening_time: 'Fermé', closing_time: 'Fermé' },
  ];
  for (const h of horaires) await prisma.horaire.create({ data: h });

  console.log('✅ Horaires créés');

  // ============================================================
  // 9. COMMANDES (15 appointments variés)
  // ============================================================
  console.log('📅 Création des commandes...');

  const appointmentDefs = [
    { client: client1, employee: employee1, service: services[0], date: new Date('2026-01-15T19:00:00'), status: 'TERMINE' },
    { client: client2, employee: employee2, service: services[1], date: new Date('2026-01-22T20:00:00'), status: 'TERMINE' },
    { client: client3, employee: employee1, service: services[2], date: new Date('2026-02-01T12:00:00'), status: 'ACCEPTE' },
    { client: client4, employee: employee3, service: services[3], date: new Date('2026-02-10T11:00:00'), status: 'ACCEPTE' },
    { client: client5, employee: employee2, service: services[4], date: new Date('2026-02-14T19:00:00'), status: 'EN_PREPARATION' },
    { client: client6, employee: employee4, service: services[5], date: new Date('2026-02-18T20:00:00'), status: 'PENDING' },
    { client: client7, employee: employee1, service: services[6], date: new Date('2026-03-15T18:00:00'), status: 'PENDING' },
    { client: client1, employee: employee3, service: services[7], date: new Date('2026-03-20T14:00:00'), status: 'PENDING' },
    { client: client2, employee: employee2, service: services[8], date: new Date('2026-03-28T19:00:00'), status: 'PENDING' },
    { client: client3, employee: employee4, service: services[9], date: new Date('2026-04-05T12:00:00'), status: 'PENDING' },
    { client: client4, employee: employee1, service: services[0], date: new Date('2025-12-24T19:00:00'), status: 'TERMINE' },
    { client: client5, employee: employee2, service: services[5], date: new Date('2025-11-10T20:00:00'), status: 'TERMINE' },
    { client: client6, employee: employee3, service: services[2], date: new Date('2026-01-08T12:00:00'), status: 'ANNULE' },
    { client: client7, employee: employee1, service: services[1], date: new Date('2026-02-05T19:00:00'), status: 'TERMINE' },
    { client: client1, employee: employee4, service: services[6], date: new Date('2026-06-20T18:00:00'), status: 'PENDING' },
  ];

  for (const apt of appointmentDefs) {
    await prisma.appointment.create({
      data: {
        date: apt.date,
        status: apt.status,
        user_id: apt.client.id,
        employee_id: apt.employee.id,
        service_id: apt.service.id
      }
    });
  }

  console.log('✅ 15 commandes créées');

  // ============================================================
  // 10. REVIEWS (18 avis variés, statuts mixtes)
  // ============================================================
  console.log('⭐ Création des avis...');

  const reviewDefs = [
    { user: client1, service: services[0], note: 5, status: 'APPROVED',
      description: 'Prestation absolument exceptionnelle ! Le foie gras était fondant à souhait, les Saint-Jacques parfaitement saisies. Un repas de Noël inoubliable !' },
    { user: client2, service: services[1], note: 4, status: 'APPROVED',
      description: 'Très bon cocktail dînatoire, les verrines étaient délicieuses. Service impeccable et présentation soignée. Je recommande vivement.' },
    { user: client3, service: services[2], note: 5, status: 'APPROVED',
      description: 'Menu végétarien absolument bluffant, on ne manque de rien ! Le risotto aux truffes est à tomber. Bravo au chef !' },
    { user: client4, service: services[3], note: 4, status: 'APPROVED',
      description: 'Un brunch de Pâques très réussi, les enfants ont adoré. Les macarons colorés étaient magnifiques et délicieux.' },
    { user: client5, service: services[4], note: 5, status: 'APPROVED',
      description: 'Le gaspacho était frais et savoureux, le taboulé parfaitement assaisonné. Excellent rapport qualité-prix pour un menu vegan !' },
    { user: client6, service: services[5], note: 4, status: 'APPROVED',
      description: 'Soirée gastronomique de haut vol. Le saumon gravlax et le risotto aux truffes m\'ont particulièrement impressionné.' },
    { user: client7, service: services[6], note: 5, status: 'APPROVED',
      description: 'Notre mariage était parfait grâce à Vite & Gourmand ! Les convives n\'ont que des éloges. Merci infiniment pour ce moment magique.' },
    { user: client1, service: services[7], note: 4, status: 'APPROVED',
      description: 'BBQ estival très réussi ! Les brochettes d\'agneau étaient parfaitement marinées. Ambiance festive garantie.' },
    { user: client2, service: services[8], note: 5, status: 'APPROVED',
      description: 'Les sushis étaient de qualité restaurant japonais premium. Le carpaccio de bœuf était divin. On reviendra !' },
    { user: client3, service: services[9], note: 4, status: 'APPROVED',
      description: 'Belle découverte méditerranéenne ! Le gaspacho et les charcuteries étaient excellents. La tarte tatin en dessert était un vrai délice.' },
    { user: client4, service: services[0], note: 3, status: 'PENDING',
      description: 'Bon repas dans l\'ensemble, mais le service a pris un peu de retard. La qualité des plats rattrapait heureusement cela.' },
    { user: client5, service: services[5], note: 5, status: 'PENDING',
      description: 'Incroyable soirée gastronomique ! Chaque plat était une véritable œuvre d\'art culinaire. Le rapport qualité-prix est imbattable.' },
    { user: client6, service: services[2], note: 2, status: 'REJECTED',
      description: 'Déçu par les portions qui manquaient de générosité. Le goût était bon mais on est resté sur notre faim.' },
    { user: client7, service: services[1], note: 4, status: 'APPROVED',
      description: 'Cocktail dînatoire très professionnel, les invités ont été impressionnés. Les macarons en fin de repas étaient sublimes.' },
    { user: client1, service: services[6], note: 5, status: 'PENDING',
      description: 'Banquet de mariage digne d\'un 3 étoiles ! Tout était parfait du début à la fin. Les 135€ sont largement justifiés.' },
    { user: client2, service: services[3], note: 4, status: 'APPROVED',
      description: 'Super brunch en famille pour Pâques, les enfants ont adoré les macarons colorés. Ambiance chaleureuse et conviviale.' },
    { user: client3, service: services[7], note: 3, status: 'PENDING',
      description: 'Bien mais le burger manquait un peu de sauce. Les brochettes en revanche étaient excellentes. Expérience globalement positive.' },
    { user: client4, service: services[8], note: 5, status: 'APPROVED',
      description: 'Découverte gastronomique ! Je ne savais pas qu\'un traiteur pouvait réaliser des sushis de cette qualité. Bluffant !' },
  ];

  for (const r of reviewDefs) {
    await prisma.review.create({
      data: {
        note: r.note, description: r.description, status: r.status,
        user_id: r.user.id, service_id: r.service.id
      }
    });
  }

  console.log('✅ 18 avis créés');

  // ============================================================
  // RÉSUMÉ
  // ============================================================
  console.log('\n🎉 Seeding enrichi terminé avec succès!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Comptes de test:');
  console.log('   ADMIN:       admin@vitegourmand.fr    / Admin123!');
  console.log('   ADMIN 2:     admin2@vitegourmand.fr   / Admin123!');
  console.log('   EMPLOYEE 1:  jose@vitegourmand.fr     / Employee123!');
  console.log('   EMPLOYEE 2:  marie@vitegourmand.fr    / Employee123!');
  console.log('   EMPLOYEE 3:  pierre@vitegourmand.fr   / Employee123!');
  console.log('   EMPLOYEE 4:  sophie@vitegourmand.fr   / Employee123!');
  console.log('   CLIENT 1:    client@example.com       / User123!');
  console.log('   CLIENT 2:    alice@example.com        / User123!');
  console.log('   (+ 5 autres clients)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Données créées:');
  console.log('   - 3 rôles');
  console.log('   - 13 utilisateurs (2 admins, 4 employés, 7 clients)');
  console.log('   - 5 régimes, 8 thèmes');
  console.log('   - 14 allergènes');
  console.log('   - 20 plats avec photos Unsplash');
  console.log('   - 10 services / menus complets');
  console.log('   - 7 horaires');
  console.log('   - 15 commandes (statuts variés)');
  console.log('   - 18 avis (10 approuvés, 5 en attente, 1 rejeté)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });