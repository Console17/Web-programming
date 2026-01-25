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
    role: role === "customer" ? "user" : role,
  });

  const payload = {
    userId: newUser._id,
    role: newUser.role === "customer" ? "user" : newUser.role,
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
    role: existUser.role === "customer" ? "user" : existUser.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
}

async function currentUser(req, res) {
  try {
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e });
  }
}

async function createAdmin(req, res) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "userName, email and password are required" });
    }

    const existUser = await userModel.findOne({
      email: String(email).toLowerCase(),
    });
    if (existUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await userModel.create({
      userName,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      _id: newAdmin._id,
      userName: newAdmin.userName,
      email: newAdmin.email,
      role: newAdmin.role,
      balance: newAdmin.balance,
      createdAt: newAdmin.createdAt,
    });
  } catch (e) {
    res.status(500).json({ message: e?.message || String(e) });
  }
}

async function makeAdmin(req, res) {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.json({ message: "User is already admin" });
    }

    user.role = "admin";
    await user.save();

    res.json({
      message: "User upgraded to admin",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e?.message || String(e) });
  }
}

export const AuthService = {
  signUp,
  signIn,
  currentUser,
  createAdmin,
  makeAdmin,
};
