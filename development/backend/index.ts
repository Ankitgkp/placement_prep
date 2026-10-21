import express from 'express';
import jwt from 'jsonwebtoken';
import { SignupSchema } from "./src/SignupSchema";
import { LoginSchema } from './src/LoginSchema';
import { PrismaClient } from '@prisma/client';
const app = express()
app.use(express.json())
const prisma = new PrismaClient()

app.post('/api/v1/signup', async (req, res) => {
    const result = SignupSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const isUserExists = await prisma.user.findFirst({
        where: {
            OR: [
                { email: result.data.email },
                { phone: result.data.phone }
            ]
        }
    })

    if (isUserExists) {
        res.status(403).json({
            message: "User Already Exists"
        })
        return;
    }

    try {
        const user = await prisma.user.create({
            data: {
                firstName: result.data.firstName,
                middleName: result.data.middleName,
                lastName: result.data.lastName,
                email: result.data.email,
                password: result.data.password,
                phone: result.data.phone
            }
        })
    } catch (e) {
        res.status(500).json({
            message: "Failed to create user"
        })
        return;
    }

    return res.status(200).json({
        message: "User Create Successfully",
    })

})

app.post('/api/v1/login', async (req, res) => {

    const result = LoginSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const user = await prisma.user.findFirst({
        where: {
            email: result.data.email,
            password: result.data.password
        }
    })

    if (!user) {
        return res.status(403).json({
            message: "Invalid Credintials"
        })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });


    return res.status(200).json({
        message: "User Logged in Successfully",
        userId: user.id,
        token
    })


})




app.listen(3000, () => {
    console.log("Listening on port 3000");
})