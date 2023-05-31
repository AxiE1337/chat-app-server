import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const users = [
  {
    username: 'john123',
    password: 'password',
    name: 'John',
    created_at: new Date(Date.now()),
  },
  {
    username: 'alex123',
    password: 'password',
    name: 'Alex',
    created_at: new Date(Date.now()),
  },
  {
    username: 'barry123',
    password: 'password',
    name: 'Barry',
    created_at: new Date(Date.now()),
  },
  {
    username: 'jessy123',
    password: 'password',
    name: 'Jessy',
    created_at: new Date(Date.now()),
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (let user of users) {
    await prisma.user.create({
      data: user,
    })
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
