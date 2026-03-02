import express from "express";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;
const SECRET_KEY = "whip-shea-super-secret-key";

app.use(express.json());
app.use(cors());

// --- Simple File-based DB ---
const DB_PATH = path.join(process.cwd(), "db.json");
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [
      {
        id: "admin-id",
        username: "Admin",
        password: bcrypt.hashSync("Llinass1190", 10),
        plainPassword: "Llinass1190",
        role: "admin",
        email: "lebm940@gmail.com",
        createdAt: Date.now()
      }
    ],
    history: []
  }));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- Auth Middleware ---
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non autorisé" });
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ error: "Token invalide" });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Accès refusé" });
  next();
};

// --- API Routes ---

// Registration
app.post("/api/auth/register", (req, res) => {
  const { username, password, email } = req.body;
  const db = getDB();
  if (db.users.find((u: any) => u.username === username)) {
    return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
  }
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    username,
    password: bcrypt.hashSync(password, 10),
    plainPassword: password, // Store plain password for admin view as requested
    role: "user",
    email,
    createdAt: Date.now()
  };
  db.users.push(newUser);
  saveDB(db);
  res.json({ success: true });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  const db = getDB();
  const user = db.users.find((u: any) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "24h" });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
});

// Admin: Get all users with full info
app.get("/api/admin/users", authenticate, isAdmin, (req, res) => {
  const db = getDB();
  res.json(db.users.map((u: any) => ({ 
    id: u.id, 
    username: u.username, 
    role: u.role, 
    email: u.email, 
    createdAt: u.createdAt,
    plainPassword: u.plainPassword || "Haché (Ancien compte)"
  })));
});

// Admin: Update user
app.put("/api/admin/users/:id", authenticate, isAdmin, (req, res) => {
  const { username, email, password } = req.body;
  const db = getDB();
  const userIndex = db.users.findIndex((u: any) => u.id === req.params.id);
  if (userIndex === -1) return res.status(404).json({ error: "Utilisateur non trouvé" });
  
  if (username) db.users[userIndex].username = username;
  if (email) db.users[userIndex].email = email;
  if (password) {
    db.users[userIndex].password = bcrypt.hashSync(password, 10);
    db.users[userIndex].plainPassword = password;
  }
  
  saveDB(db);
  res.json({ success: true });
});

// Admin: Get user history
app.get("/api/admin/history/:userId", authenticate, isAdmin, (req, res) => {
  const db = getDB();
  const userHistory = db.history.filter((h: any) => h.userId === req.params.userId);
  res.json(userHistory);
});

// Admin: Delete user
app.delete("/api/admin/users/:id", authenticate, isAdmin, (req, res) => {
  const db = getDB();
  db.users = db.users.filter((u: any) => u.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// User: Delete own account (RGPD)
app.delete("/api/user/me", authenticate, (req: any, res) => {
  const db = getDB();
  db.users = db.users.filter((u: any) => u.id !== req.user.id);
  saveDB(db);
  res.json({ success: true });
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
