import { PrismaClient } from './prisma/generated';
import app from './app';
const PORT = 4000;
const prisma  = new PrismaClient();


export {prisma};


app.listen(PORT, () => {
    console.log(`Server started: ${PORT}`);
});
