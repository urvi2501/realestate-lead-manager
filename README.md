# PrimeNest Realty — Real Estate CRM Frontend

A modern **React-based frontend** for PrimeNest Realty, a full-stack Real Estate CRM designed for managing leads, customers, properties, follow-ups, reports, analytics and client communication.

## 🏠 About PrimeNest Realty

**PrimeNest Realty — Smart Real Estate CRM for Lead & Property Management**

The application provides a centralized interface for real estate agencies, brokers and property sales teams to manage their daily customer and property operations.



## 🚀 Key Features

* 🔐 Secure login and logout
* 👥 Lead management
* 👤 Customer management
* 🏠 Property management
* 📅 Follow-up tracking
* 📊 Reports and analytics
* 📧 Email communication
* 💬 Message templates
* 🔎 Search and filtering
* 📄 Pagination
* 📱 Responsive user interface
* 📈 Dashboard statistics
* 📥 Report export support



## 🛠️ Technology Stack

* React
* JavaScript
* Vite
* Axios
* Bootstrap
* Recharts
* jsPDF
* XLSX



## 📂 Project Structure

 id="v0c8pp"
frontend/
│
├── src/
│   ├── components/
│   │   ├── AddCustomer.jsx
│   │   ├── CustomerList.jsx
│   │   ├── Email.jsx
│   │   ├── EmailSender.jsx
│   │   ├── FollowUpList.jsx
│   │   ├── MessageTemplate.jsx
│   │   ├── MessageTemplateList.jsx
│   │   ├── PropertyForm.jsx
│   │   └── PropertyList.jsx
│   │
│   ├── Analytics.jsx
│   ├── Reports.jsx
│   ├── App.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md

## 🔗 Backend

The frontend communicates with the PrimeNest Realty Spring Boot backend through REST APIs.

Backend repository:

**realestate-lead-manager-backend**

The backend provides authentication, business logic, database operations and secured APIs.



## ▶️ Running the Frontend Locally

### 1. Clone the repository

 id="4slj5d"
git clone https://github.com/urvi2501/realestate-lead-manager.git

### 2. Open the frontend directory

id="dfb1ja"
cd realestate-lead-manager


### 3. Install dependencies

 id="1w6sl2"
npm install


### 4. Start the development server

```bash id="5pqy47"
npm run dev
```

The frontend will normally be available at:

```text id="1q5s5c"
http://localhost:5173
```

---

## 🔐 Authentication

The application uses JWT-based authentication provided by the backend.

After successful login, the authentication token is stored locally and used for secured API requests.

---

## 📊 CRM Modules

### Dashboard

Provides a centralized overview of leads, customers, properties and business statistics.

### Lead Management

Manage incoming property enquiries and track their status from new lead to conversion.

### Customer Management

Maintain customer contact information, requirements and status.

### Property Management

Manage property listings including type, location, price and availability status.

### Follow-ups

Track scheduled customer follow-ups and their completion status.

### Reports & Analytics

Analyze:

* Lead status
* Lead sources
* Property types
* Locations
* Budgets
* Follow-up activity
* Customer statistics
* Conversion performance

Reports can also be exported for business use.

### Communication

Use email and reusable message templates to communicate with leads and customers.


## 💼 Business Use Case

PrimeNest Realty can be customized for:

* Real estate agencies
* Property consultants
* Independent brokers
* Builders and developers
* Property sales teams
* Rental businesses

Branding, fields, workflows, reports and integrations can be customized according to client requirements.



## 🔮 Possible Future Enhancements

* Production cloud deployment
* Progressive Web App support
* Advanced dashboards
* Notification system
* WhatsApp Cloud API integration
* Multi-company SaaS support
* Additional user roles and permissions
* Mobile application



## 👩‍💻 Project

**PrimeNest Realty — Real Estate CRM**

Frontend built using:

**React + Vite + Axios + Bootstrap + Recharts**

Backend:

**Java + Spring Boot + Spring Security + JPA/Hibernate + MySQL**



## 📄 License

This project is intended for demonstration, customization and commercial project development.
