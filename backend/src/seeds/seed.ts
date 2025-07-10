import { DataSource } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { Ad } from '../modules/ads/ad.entity';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { AdCategory } from '../modules/ads/enums/ad-category.enum';
import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_PASSWORD || !process.env.DB_USERNAME || !process.env.DB_NAME) {
  throw new Error('Missing DB environment variables!');
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Ad],
  synchronize: true, // dev
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepo = AppDataSource.getRepository(User);
  const adRepo = AppDataSource.getRepository(Ad);

  // Delete data first - using CASCADE
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query('TRUNCATE TABLE "ads" CASCADE');
    await queryRunner.query('TRUNCATE TABLE "users" CASCADE');
    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }

  // Create 10 users
  const users: User[] = [];

  for (let i = 0; i < 10; i++) {
    const password = await bcrypt.hash('password123', 10);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const user = userRepo.create({
      username: faker.internet.username({ firstName, lastName }).toLowerCase(),
      password,
      registeredAt: new Date(),
      phone: '+3816' + faker.string.numeric(7),
    });
    users.push(await userRepo.save(user));
  }

  console.log(`Seeded ${users.length} users`);

  // Create 100 ads
  const ads: Ad[] = [];

  for (let i = 0; i < 100; i++) {
    const ad = adRepo.create({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 500, max: 50000 })),
      category: faker.helpers.arrayElement(Object.values(AdCategory)) as AdCategory,
      city: faker.location.city(),
      imageUrl: faker.image.url(),
      user: faker.helpers.arrayElement(users),
      createdAt: faker.date.recent({ days: 30 }),
    });
    ads.push(await adRepo.save(ad));
  }

  console.log(`Seeded ${ads.length} ads`);
  await AppDataSource.destroy();
  console.log('Seeding completed.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  AppDataSource.destroy();
});
