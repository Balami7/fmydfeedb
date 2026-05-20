import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

async function main() {
  console.log("🔧 Starting database setup...");

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
  }

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashPassword(adminPassword),
        role: "admin",
      },
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${admin.email}`);

    // Add sample products
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: "Sample Product 1",
          description: "This is a sample product",
          price: 5000,
          quantity: 10,
        },
      }),
      prisma.product.create({
        data: {
          name: "Sample Product 2",
          description: "Another sample product",
          price: 7500,
          quantity: 15,
        },
      }),
    ]);

    console.log("✅ Sample products created");

    // Add sample services
    await Promise.all([
      prisma.service.create({
        data: {
          name: "Service 1",
          description: "Description for service 1",
        },
      }),
      prisma.service.create({
        data: {
          name: "Service 2",
          description: "Description for service 2",
        },
      }),
    ]);

    console.log("✅ Sample services created");

    console.log("\n✨ Database setup completed successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. Update the admin password in production");
    console.log("2. Run 'npm install' to install dependencies");
    console.log("3. Run 'npm run dev' to start the development server");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
