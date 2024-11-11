const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.users.createMany({
    data: [
      { username: 'alice', password: 'ea0fb1a6ec4d46ea06e068ee573c631e5d3930f10ac1601e648f7c37ff7aa71e' },
      { username: 'bob', password: '11b7eaf0ac26da906753e123a1382e597de9facd5601f4ec20e9416803f9dcbf' },
  
    ],
  });

  const users = await prisma.users.findMany();
  
  await prisma.posts.createMany({
    data: [
      { title: 'alice Post', content: 'This is a post by alice.', authorId: users[0].id },
      { title: 'bob Post', content: 'This is a post by bob.', authorId: users[1].id },
      { title: 'alice Post', content: 'This is a post by alice.', authorId: users[0].id },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });