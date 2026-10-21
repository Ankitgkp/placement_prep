import express from 'express';
import { SignupSchema } from "./src/SignupSchema";

const app = express()
app.use(express.json())
const prisma = new PrismaClient()

app.post('/api/v1/signup', (req, res) => {
    const data = SignupSchema.safeParse(req.body);

    if (!data.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        })
    }


})