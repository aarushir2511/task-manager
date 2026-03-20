import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ msg: "Wrong password" });

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  res.json({ accessToken, refreshToken });
};

export const refresh = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const decoded: any = jwt.verify(refreshToken, process.env.JWT_SECRET!);

  const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

  res.json({ accessToken });
};

export const logout = (req: Request, res: Response) => {
  res.json({ msg: "Logged out" });
};