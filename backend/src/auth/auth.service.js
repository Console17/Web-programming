import userModel from "../users/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

async function signUp(req, res) {
  const { userName, email, password, role } = req.body;

  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: "user already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
    role,
  });

  const payload = {
    userId: newUser._id,
    role: newUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({ token });
}

async function signIn(req, res) {
  const { email, password } = req.body;

  const existUser = await userModel.findOne({ email }).select("password role");
  if (!existUser) {
    return res.status(400).json({ message: "email or password is incorrect" });
  }
  const isPassEqual = await bcrypt.compare(password, existUser.password);
  if (!isPassEqual) {
    return res.status(400).json({ message: "email or password is incorrect" });
  }

  const payload = {
    userId: existUser._id,
    role: existUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
}

async function currentUser() {}

export const AuthService = {
  signUp,
  signIn,
  currentUser,
};
