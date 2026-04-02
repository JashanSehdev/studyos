import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db.js";

// --signup----------
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check for all fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exisiting = await pool.query(
      `
            select * from users where email = $1`,
      [email],
    );

    if (exisiting.rows.length > 0) {
      return res.status(400).json({ message: "User already registered" });
    }
    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user details

    const result = await pool.query(
      `
        INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`,
      [name, email, hashedPassword],
    );

    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    res.status(201).json({ user: result.rows[0] });
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

    const result = await pool.query(
      `
            SELECT * FROM users where email = $1
        `,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email and password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
