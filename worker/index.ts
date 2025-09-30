import { Hono } from "hono";
import { jwt } from "hono/jwt";

const app = new Hono<{ Bindings: { DB: D1Database, JWT_SECRET: string } }>();

// 注册
app.post("/register", async (c) => {
  const { username, password } = await c.req.json();
  try {
    await c.env.DB.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    ).bind(username, password).run();
    return c.json({ success: true });
  } catch {
    return c.json({ error: "User exists" }, 400);
  }
});

// 登录
app.post("/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = await c.env.DB.prepare(
    "SELECT * FROM users WHERE username=? AND password=?"
  ).bind(username, password).first();

  if (!user) return c.json({ error: "Invalid" }, 401);

  const token = await jwt.sign({ user: username }, c.env.JWT_SECRET);
  return c.json({ success: true, token });
});

// 上传分数
app.post("/score", async (c) => {
  const { score, token } = await c.req.json();
  try {
    const payload = await jwt.verify(token, c.env.JWT_SECRET);
    const user = payload.user as string;
    await c.env.DB.prepare(
      "INSERT INTO scores (username, score) VALUES (?, ?)"
    ).bind(user, score).run();
    return c.json({ success: true });
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

// 排行榜
app.get("/leaderboard", async (c) => {
  const rows = await c.env.DB.prepare(
    "SELECT username, MAX(score) as highscore FROM scores GROUP BY username ORDER BY highscore DESC LIMIT 10"
  ).all();
  return c.json(rows.results);
});

export default app;
