# 📌 Job Offers API

A high-performance REST API to manage job offer listings, with support for full CRUD operations, flexible filtering, and robust data validation. Designed with modern development standards for type safety, testability, and CI/CD integration.

---

## 🔍 Overview

### 🎯 Purpose

The **Job Offers API** provides endpoints to manage and query job offer listings. It is ideal for platforms that need scalable and reliable job-related data management, emphasizing:

- Type safety with TypeScript
- Input/output validation
- Modular and testable architecture
- Developer experience and automation

---

## 🛠️ Tech Stack

| Component    | Technology                     | Purpose                            |
| ------------ | ------------------------------ | ---------------------------------- |
| Runtime      | Node.js + TypeScript           | Type-safe JavaScript execution     |
| Framework    | Fastify                        | High-performance HTTP server       |
| Database     | MongoDB + Mongoose             | Document storage with ODM          |
| Validation   | Joi                            | Schema-based validation            |
| Testing      | Vitest + MongoDB Memory Server | Unit and integration tests         |
| Code Quality | ESLint + Prettier + Husky      | Linting, formatting, and Git hooks |
| CI/CD        | GitHub Actions + Render        | Automation and deployment          |

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure the following are installed:

| Tool    | Minimum Version |
| ------- | --------------- |
| Node.js | 18+             |
| npm     | 8+              |
| MongoDB | 5+              |
| Git     | 2.30+           |

### 📦 Installation

```bash
git clone https://github.com/fmarinoa/job-offers-api
cd job-offers-api
npm install
```

Git hooks will be automatically set up via Husky (`npx husky install` runs post-install).

### ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
PORT=3000
MONGO_URL='mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<AppCluster>'
NODE_ENV=development
```

### 🧪 Development Mode

To run the server with hot reload:

```bash
npm run dev
```

Expected console output:

```bash
✅ Server running on http://127.0.0.1:3000
```

Verify endpoint availability:

```bash
curl http://localhost:3000/job-offers
```

### 🧪 Running Tests

Run unit and integration tests:

```bash
npm test
```

This uses an in-memory MongoDB server for fast and isolated test execution.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repo
2. Create a new branch: git checkout -b feature/your-feature
3. Commit your changes: git commit -m "feat: add new feature"
4. Push the branch: git push origin feature/your-feature
5. Open a pull request

---

## 📄 License

This project is licensed under the [MIT License](https://github.com/fmarinoa/job-offers-api?tab=MIT-1-ov-file).

---

## 📬 Contact.

Maintained by [Franco Mariño](https://francomarino.vercel.app/). Feel free to open an issue or PR.
