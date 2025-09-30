

# 🚀 部署步骤（只用 Cloudflare）

1. **上传到 GitHub / GitLab**
   把这个 `game2048-worker/` 文件夹作为一个仓库。

2. **Cloudflare Dashboard** → **Workers & Pages** → **Create Worker**
   选择 **从 GitHub 导入**，绑定这个仓库。

3. **数据库初始化**
   在本地或 Cloudflare 控制台运行：

   ```bash
   wrangler d1 create game2048-db
   wrangler d1 execute game2048-db --file=worker/schema.sql
   ```

   把返回的 `database_id` 填到 `wrangler.toml`。

4. **部署 Worker**

   ```bash
   npm install
   npm run deploy
   ```

   成功后你会得到一个地址，比如：

   ```
   https://game2048.yourname.workers.dev
   ```

5. **测试接口**

   * 注册：`POST /register { "username":"test", "password":"123" }`
   * 登录：`POST /login { "username":"test", "password":"123" }`
   * 上传分数：`POST /score { "score":2048, "token":"登录时返回的token" }`
   * 排行榜：`GET /leaderboard`

---

👉 这样，你就能 **直接在 Cloudflare 部署一个完整可用的 Worker 后端**。
要不要我帮你生成一个 **现成的 GitHub Repo 模板链接**，你直接 Fork 然后在 Cloudflare 里点一下就能跑？
