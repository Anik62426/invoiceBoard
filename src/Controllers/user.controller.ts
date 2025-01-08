import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { firstName, lastName, email, phoneNumber, panCardNumber, password } =
    req.body;

  try {
  
    const defaultPhoneNumber = '+923054170452';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email " });
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCardNumber)) {
      return res.status(400).json({ message: "Invalid PANCard Number " });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { panCardNumber }] },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or PAN Card Number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber: phoneNumber || defaultPhoneNumber,
        panCardNumber,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Signing Up" });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Error" });
  }
};

export { registerUser, loginUser };
