# 🧮 EZTax – Simplify Your Taxes, Maximize Savings!

[Live Demo 🔗](https://ez-tax-tax-automation-tool.vercel.app/)  
[Portfolio 📂](https://worthyjobs-tech.vercel.app/Rishabh%20Sharma?id=1Icgw0BSzTxU3Ruv1eAhu-TuNXyT_otTf)

EZTax is a **personalized tax automation tool** designed for Indian taxpayers. It not only computes taxes but **educates users**, compares regimes, and empowers them to make smarter financial decisions — all in real time.

![Banner](./assets/hero-image.png)

---

## 🚀 Features

- 🔐 **Secure user authentication** with Supabase
- 🧠 **Dynamic tax engine** that factors in age, city, HRA, deductions & more
- 📊 **Old vs New regime comparison** with optimal suggestion
- 📄 **PDF export** of tax summary
- 🎓 **Step-by-step explanations** of tax impact
- 💬 **Real-time calculation** & form validation
- ✨ **User-friendly UI** built with React.js

---

## 📌 Why EZTax?

> 💡 *“Nearly 90% of Indian individuals struggle with tax filing. EZTax bridges that gap with automation, education, and personalization.”*

Traditional tools offer static calculations. EZTax dynamically adapts to the user's profile and helps them **understand** taxation laws like 80C, HRA, 80D, and exemptions based on location and age.

---

## 🧩 Tech Stack

| Frontend | Backend | Database | Auth |
|----------|---------|----------|------|
| React.js | Supabase Functions | PostgreSQL (via Supabase) | Supabase Auth |

---

## 🧠 Core Modules

### 🧮 Calculation Engine
A modular, type-safe tax calculator supporting:
- 📈 Slab-wise income tax rules
- 🏙️ Metro/non-metro classification
- 👵 Senior citizen exemptions
- 🔁 Old vs New regime adaptability
- 🎯 Custom deduction mapping (80C, 80D, HRA, etc.)

### 🧾 Dynamic Forms
Forms adjust dynamically based on:
- Age & city type
- Regime choice
- Deduction eligibility  
Includes real-time validation, conditional rendering, and multi-step navigation.

### 📊 Summary & Visualization
Real-time visualization of:
- Total tax
- Deductions
- Slab-wise calculations  
Includes downloadable PDF summaries with complete breakdown.

---

## 📐 System Architecture

Frontend (React)
|
|── Auth & DB: Supabase
|── Tax Engine: Utility Modules
|── Forms: Dynamic React Components
|── Summary: Real-time Calculation + PDF Generator


---

## 🔬 Research & Design

### 🧭 User Research
- Conducted interviews with students, CAs, and professionals
- Mapped real user pain points like HRA confusion & regime switching
- Designed intuitive UX based on journey mapping

### 🧠 Mathematical Modeling
- Engineered formulas for gross income, exemptions, deductions
- Factored in edge cases like metro cities, senior citizen rebates
- Optimized logic using memoization and clean state handling

---

## 📸 Screenshots

| Setup Profile | Tax Summary |
|---------------|-------------|
| ![setup](./assets/setup.png) | ![summary](./assets/summary.png) |

---

## 🛠️ Future Enhancements

- 🧾 XML export for government portals
- 🧑‍⚖️ Legal section references & tooltips
- 🏦 Investment advice based on returns
- 🌐 Multilingual support

---

## 👨‍💻 About Me

**Rishabh Sharma**  
📧 [rishabhar1974@gmail.com](mailto:rishabhar1974@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/rishabh-sharma25/)  
💻 [GitHub](https://github.com/Rishabh-Sh1rma)

---

## 📢 Feedback

Have suggestions or feature requests? Feel free to open an [issue](https://github.com/Rishabh-Sh1rma/ez-tax-tax-automation-tool/issues) or reach out via email. Your feedback helps make EZTax better!

---

## 📝 License

MIT © Rishabh Sharma  
All tax rules are based on public government data and for educational purposes only.
