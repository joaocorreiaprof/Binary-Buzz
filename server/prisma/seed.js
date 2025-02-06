// prisma/seed.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create a global group if not exists
  const globalGroup = await prisma.group.upsert({
    where: { name: "Global Chat" },
    update: {},
    create: {
      name: "Global Chat",
      isGlobal: true,
      createdAt: new Date(),
    },
  });

  const user = await prisma.user.findFirst();

  if (user) {
    // Add user to the global group
    await prisma.userGroup.create({
      data: {
        userId: user.id,
        groupId: globalGroup.id,
      },
    });
  }

  console.log("Global group seeded and user added.");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
