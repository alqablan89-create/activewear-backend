import { db } from "./db";
import { users, categories } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  await db.insert(users).values({
    username: "admin@liftmeup.com",
    password: hashedPassword,
    fullName: "Admin User",
    isAdmin: true,
  }).onConflictDoNothing();

  console.log("Admin user created: admin@liftmeup.com / admin123");

  // Create categories
  const categoriesToCreate = [
    {
      nameEn: "Performance Shirt",
      nameAr: "قميص الأداء",
      slug: "performance-shirt",
      displayOrder: 1,
    },
    {
      nameEn: "Hooded Top",
      nameAr: "قمة مقنعين",
      slug: "hooded",
      displayOrder: 2,
    },
    {
      nameEn: "T-Shirt",
      nameAr: "تي شيرت",
      slug: "t-shirt",
      displayOrder: 3,
    },
    {
      nameEn: "Caps",
      nameAr: "قبعات",
      slug: "caps",
      displayOrder: 4,
    },
    {
      nameEn: "Fragrance",
      nameAr: "عطر",
      slug: "fragrance",
      displayOrder: 5,
    },
  ];

  for (const category of categoriesToCreate) {
    await db.insert(categories).values(category).onConflictDoNothing();
  }

  console.log("Categories created successfully");
  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
