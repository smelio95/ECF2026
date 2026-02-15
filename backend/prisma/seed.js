import prisma from '../prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Début du seeding...');

  // 1. Créer les rôles
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

  // 2. Créer les utilisateurs de test
  console.log('👥 Création des utilisateurs...');

  const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
  const hashedEmployeePassword = await bcrypt.hash('Employee123!', 10);
  const hashedUserPassword = await bcrypt.hash('User123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@vitegourmand.fr' },
    update: {},
    create: {
      email: 'admin@vitegourmand.fr',
      password: hashedAdminPassword,
      firstname: 'Julie',
      lastname: 'Admin',
      phone: '0601020304',
      role_id: adminRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'jose@vitegourmand.fr' },
    update: {},
    create: {
      email: 'jose@vitegourmand.fr',
      password: hashedEmployeePassword,
      firstname: 'José',
      lastname: 'Employee',
      phone: '0605060708',
      role_id: employeeRole.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: hashedUserPassword,
      firstname: 'Jean',
      lastname: 'Dupont',
      phone: '0609101112',
      role_id: userRole.id
    }
  });

  console.log('✅ Utilisateurs créés');

  // 3. Créer les régimes
  console.log('🥗 Création des régimes...');

  await prisma.regime.upsert({
    where: { label: 'Classique' },
    update: {},
    create: { label: 'Classique' }
  });

  await prisma.regime.upsert({
    where: { label: 'Végétarien' },
    update: {},
    create: { label: 'Végétarien' }
  });

  await prisma.regime.upsert({
    where: { label: 'Vegan' },
    update: {},
    create: { label: 'Vegan' }
  });

  console.log('✅ Régimes créés');

  // 4. Créer les thèmes
  console.log('🎨 Création des thèmes...');

  await prisma.theme.upsert({
    where: { label: 'Noël' },
    update: {},
    create: { label: 'Noël' }
  });

  await prisma.theme.upsert({
    where: { label: 'Pâques' },
    update: {},
    create: { label: 'Pâques' }
  });

  await prisma.theme.upsert({
    where: { label: 'Classique' },
    update: {},
    create: { label: 'Classique' }
  });

  await prisma.theme.upsert({
    where: { label: 'Événement' },
    update: {},
    create: { label: 'Événement' }
  });

  console.log('✅ Thèmes créés');

  // 5. Créer les allergènes
  console.log('⚠️ Création des allergènes...');

  const allergenes = [
    'Gluten', 
    'Lactose', 
    'Fruits à coque', 
    'Œufs', 
    'Poisson', 
    'Crustacés', 
    'Soja', 
    'Céleri'
  ];
  
  for (const label of allergenes) {
    await prisma.allergene.upsert({
      where: { label },
      update: {},
      create: { label }
    });
  }

  console.log('✅ Allergènes créés');

  // 6. Créer les horaires
  console.log('🕐 Création des horaires...');

  const horaires = [
    { day: 'Lundi', opening_time: '09:00', closing_time: '18:00' },
    { day: 'Mardi', opening_time: '09:00', closing_time: '18:00' },
    { day: 'Mercredi', opening_time: '09:00', closing_time: '18:00' },
    { day: 'Jeudi', opening_time: '09:00', closing_time: '18:00' },
    { day: 'Vendredi', opening_time: '09:00', closing_time: '20:00' },
    { day: 'Samedi', opening_time: '10:00', closing_time: '20:00' },
    { day: 'Dimanche', opening_time: 'Fermé', closing_time: 'Fermé' },
  ];

  // Supprimer les horaires existants d'abord
  await prisma.horaire.deleteMany({});

  for (const horaire of horaires) {
    await prisma.horaire.create({
      data: horaire
    });
  }

  console.log('✅ Horaires créés');

  console.log('\n🎉 Seeding terminé avec succès!\n');
  console.log('📋 Comptes de test créés:');
  console.log('   ADMIN:    admin@vitegourmand.fr / Admin123!');
  console.log('   EMPLOYEE: jose@vitegourmand.fr / Employee123!');
  console.log('   CLIENT:   client@example.com / User123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });