# ShipGo

ShipGo 是一个基于 TanStack Start 的全栈 SaaS 应用，内置 PostgreSQL、Drizzle ORM、
Better Auth、支付、积分、国际化内容和 Node.js 部署能力。

## 完整文档

启动应用后访问 [http://localhost:3000/zh/docs](http://localhost:3000/zh/docs)。文档包含：

- Docker 快速部署、手动开发环境、项目结构和第一个应用教程
- 品牌配置、国际化、内容、认证、数据库、支付、积分与外部集成
- 完整环境变量与 API 参考
- Node.js 与 Docker 部署、发布检查、运维和故障排查

文档源码位于 `content/docs`，中英文页面保持成对维护。

## 技术栈

- TanStack Start、React 19、Vite、Nitro
- PostgreSQL、Drizzle ORM、Better Auth
- Tailwind CSS 4、Radix UI、Fumadocs、Intlayer
- Stripe 或 Creem、Resend 或 Beehiiv、S3 兼容存储
- Node.js 24 与 Docker Compose

## 文件树概览

```text
.
├── content/              # 文档、博客与页面内容
├── drizzle/              # PostgreSQL Schema 迁移文件
├── public/               # 静态资源
├── scripts/              # 数据库、发布和运维脚本
├── src/
│   ├── config/           # 应用、支付和环境配置
│   ├── db/               # Drizzle Schema 与数据库连接
│   ├── providers/        # 支付等外部服务 Provider
│   ├── repositories/     # 数据访问层
│   ├── routes/           # 页面与 API 路由
│   ├── services/         # 业务服务
│   └── shared/           # 共享组件、Hooks 与工具
├── .env.local            # Docker Compose 使用的本地环境配置
├── docker-compose.yaml   # 应用与本地 PostgreSQL 服务编排
└── Dockerfile            # Node.js 24 多阶段构建
```

## Docker Quick Start

准备 Docker Desktop 或 Docker Engine、Node.js 24，并确保本机的 `3000` 与 `5432` 端口可用。
仓库已提供可直接启动的 `.env.local`；其中外部支付、邮件和第三方集成使用本地占位值，
实际调用这些服务前需要替换为真实凭据。每个变量的用途都写在 `.env.local` 中。

首次拉取项目时安装用于执行数据库迁移的本地依赖：

```bash
corepack enable
pnpm install --frozen-lockfile
```

### 使用 Compose 本地 PostgreSQL

先启动数据库，再从宿主机显式执行迁移。因为 `.env.local` 中的默认连接串使用容器内
主机名 `db`，宿主机执行迁移时需要临时改用 `localhost`：

```bash
docker compose up -d db
DATABASE_URL=postgresql://postgres:shipgo_local_password@localhost:5432/shipgo pnpm db:migrate
docker compose up --build -d app
docker compose ps
curl --fail http://localhost:3000/api/ping
```

### 使用 Neon、Supabase 等远程 PostgreSQL

将 `.env.local` 中的 `DATABASE_URL` 替换为服务商提供的 PostgreSQL 连接串，然后执行：

```bash
pnpm db:migrate
docker compose up --build -d app
docker compose ps
curl --fail http://localhost:3000/api/ping
```

Compose 不会自动执行数据库迁移。每次部署包含新的 Drizzle 迁移文件时，应先对目标数据库
单独执行 `pnpm db:migrate`，确认成功后再启动或更新应用。

应用代码、Drizzle 和运维脚本的数据库连接统一读取 `DATABASE_URL`。Compose 中的
`POSTGRES_USER`、`POSTGRES_PASSWORD` 与 `POSTGRES_DB` 仅用于初始化本地 PostgreSQL
容器，不属于应用环境变量；使用远程 PostgreSQL 时不会用到它们。

浏览器访问 [http://localhost:3000](http://localhost:3000)。

查看日志或停止服务：

```bash
docker compose logs -f app
docker compose down
```

需要同时删除本地 PostgreSQL 数据时：

```bash
docker compose down -v
```

## 配置说明

`.env.local` 是 Docker Compose 与本地命令使用的运行配置，`.env.example` 是可提交和复制的
同结构模板。变量解释统一维护在这两个配置文件中。生产部署前必须替换数据库密码、认证密钥、
定时任务密钥，以及实际启用的支付、邮件、OAuth、存储和分析服务凭据。
