import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"
import bcrypt from "bcrypt";

// --signup----------
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check for all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exisiting = await User.findOne({email});

    if (exisiting) {
      return res.status(400).json({ message: "User already registered" });
    }
    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user details

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(201).json({ user: {
      id: user._id,
      name: user.name,
      email: user.email
    } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//----Login-----------

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({email});

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email and password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//-----Logout--------------

export const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.clearCookie("token", cookieOptions);
  res.json({ message: "logged out Successfully" });
};
