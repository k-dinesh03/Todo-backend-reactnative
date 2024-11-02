import userModel from "../models/userModel";

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post('/register', async (req: any, res: any) => {
    try {
        const { firstName, lastName, age, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 15);

        const user = await userModel.create({
            first_name: firstName,
            last_name: lastName,
            age: age,
            email: email,
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: user._id, email: user.email }, // payload : details to generate token
            process.env.JWT_SECRET, // secret key
            { expiresIn: '1d' } // token expires in 1 hour
        )
        user.password = undefined;

        res.status(200).json({ user_id: user._id, token, message: "Register successful!" });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/allusers', async (req: any, res: any) => {
    try {
        const users = await userModel.find({}, '-password');
        res.status(200).json(users);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.get('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id, '-password', { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user);

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

router.post('/signin', async (req: any, res: any) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password!" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            user_id: user._id,
            token,
            message: "Login successful!",
        });

    } catch (error: any) {
        res.status(500).json({ message: "Internal server error." });
    }
});

router.put('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, age, email } = req.body;

        const user = await userModel.findByIdAndUpdate(id,
            {
                first_name: firstName,
                last_name: lastName,
                age: age,
                email: email
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        user.password = undefined;
        res.status(200).json({ user, message: "User updated successfully!" })

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({ message: "User Deleted!" });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;
