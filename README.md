<div align="center">

<br/>

<a href="https://github.com/Madeshmadmax7/BatsUp">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=58&duration=3000&pause=1500&color=FFFFFF&background=09090B00&center=true&vCenter=true&width=850&height=100&lines=BATSUP" alt="BATSUP" />
</a>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=14&duration=4000&pause=1000&color=8B949E&center=true&vCenter=true&width=700&height=30&lines=Cricket+Tournament+Management+System;React+%7C+Spring+Boot+%7C+Tailwind+CSS+%7C+MySQL" alt="tagline" />

<br/>
<br/>

![React](https://img.shields.io/badge/React-Frontend-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

<br/>
<br/>

<img src="./screenshots/dashboard.png" width="95%" />

<br/>

**BatsUp Manager is a full-stack cricket tournament management platform built using React, Spring Boot, Tailwind CSS, and MySQL. It streamlines tournament organization, player statistics tracking, team management, match scheduling, analytics, and communication through a modern responsive interface backed by scalable REST APIs and relational database architecture.**

<br/>

<p align="center">

<a href="#features">
  <img src="https://img.shields.io/badge/Features-0D1117?style=for-the-badge&logo=readthedocs&logoColor=white"/>
</a>

<a href="#system-architecture">
  <img src="https://img.shields.io/badge/Architecture-0D1117?style=for-the-badge&logo=dependabot&logoColor=white"/>
</a>

<a href="#technology-stack">
  <img src="https://img.shields.io/badge/Tech%20Stack-0D1117?style=for-the-badge&logo=stackshare&logoColor=white"/>
</a>

<a href="#repository-setup">
  <img src="https://img.shields.io/badge/Setup-0D1117?style=for-the-badge&logo=rocket&logoColor=white"/>
</a>

</p>

</div>

---

## Overview

BatsUp Manager combines a React frontend, Spring Boot backend, Tailwind CSS styling, and MySQL database into a unified platform capable of managing tournaments, tracking player statistics, scheduling matches, organizing teams, broadcasting updates, and visualizing tournament insights in real time.

<br/>


<div align="center">

<img src="./screenshots/dashboard.gif" width="100%" />

</div>

<br/>

Experience the complete tournament management workflow including match scheduling, tournament analytics, team management, and newsletter operations through a modern responsive interface.

<br/>

<table width="95%">
<tr>

<td width="50%" valign="top">

## Why BatsUp?

- Comprehensive tournament management
- Real-time player statistics tracking
- Interactive team management
- Match scheduling and organization
- Analytics and tournament insights
- Responsive web design
- Secure REST API integration
- Fast and scalable architecture

</td>

<td width="50%" valign="top">

## Built With

- **Frontend:** React · Tailwind CSS
- **Backend:** Spring Boot · Spring MVC
- **Database:** MySQL
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Language:** Java · JavaScript
- **Infrastructure:** GitHub · Maven · NPM

</td>

</tr>
</table>

---

# Features

## Match Scheduling

<table width="100%">
<tr>
<th width="50%" align="center">Tournament Register</th>
<th width="50%" align="center">Team Registering</th>
</tr>

<tr>
<td align="center" valign="top">

<img src="./screenshots/tournament-registering.png" alt="tournament-registering"/>

</td>

<td align="center" valign="top">

<img src="./screenshots/team-creation.png" alt="team-creation"/>

</td>
</tr>
</table>

<br/>

The scheduling engine enables organizers to create fixtures, assign venues, manage match timings, and monitor tournament progression efficiently.

### Core Capabilities

- Match scheduling
- Fixture management
- Venue assignment
- Team allocation
- Schedule updates
- Match tracking
- Tournament progression
- Automated organization

---

## Tournament Analytics

<div align="center">

<img src="./screenshots/scorecard.png" width="90%" />

</div>

<br/>

Advanced analytics provide insights into tournament progress, team standings, player performances, rankings, and overall competition statistics.

### Analytics Features

- Tournament rankings
- Team performance analysis
- Match insights
- Statistics dashboard
- Historical records
- Progress monitoring
- Performance comparison


---

## Team Management

<div align="center">

<img src="./screenshots/team-creation.png" width="90%" />

</div>

<br/>

BatsUp includes intelligent team management systems capable of visualizing squad composition, player roles, team standings, performance metrics, and tournament participation records.

### Management Features

- Squad composition tracking
- Player role assignments
- Team performance metrics
- Team standings visualization
- Match history management
- Team statistics
- Performance analysis
- Tournament participation records

---

## Newsletter Management

<div align="center">

<img src="./screenshots/newsletter.png" width="90%" />

</div>

<br/>

The newsletter system enables administrators to share tournament announcements, match updates, schedules, and important information with participants and audiences.

### Newsletter Features

- Tournament announcements
- Match updates
- Event notifications
- Newsletter campaigns
- Audience engagement
- Information broadcasting
- Schedule reminders
- Communication management

---

# System Architecture

```text
 ┌──────────────────────────┐
 │      React Frontend      │
 │  Tailwind CSS Interface  │
 └────────────┬─────────────┘
              │
           REST API
              │
              ▼
 ┌──────────────────────────┐
 │     Spring Boot API      │
 │  Business Logic Layer    │
 │ CRUD Operations          │
 └────────────┬─────────────┘
              │
              ▼
 ┌──────────────────────────┐
 │        MySQL DB          │
 │ Tournament Data Storage  │
 └──────────────────────────┘
```

---

# Technology Stack

| Frontend | Backend | Database | UI Components | Development |
|:---|:---|:---|:---|:---|
| React.js | Spring Boot | MySQL | Lucide React | Maven |
| JavaScript | Spring MVC | MySQL Workbench | React Icons | ESLint |
| HTML5 | Spring Data JPA | Relational Database | Tailwind CSS | Postman |
| CSS3 | REST APIs | MySQL Server | Responsive UI | Git |
| Tailwind CSS | Java 17 | SQL Queries | Component Library | GitHub |

---

# Application Flow

```text
User Interaction
      │
      ▼
React Components
      │
      ▼
REST API Requests
      │
      ▼
Spring Boot Controllers
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
MySQL Database
      │
      ▼
Response Processing
      │
      ▼
User Dashboard
```

---

# Project Structure

```bash
BatsUp/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
├── screenshots/
│
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

# Modules

| Module | Description |
|:---|:---|
| Tournament Manager | Tournament creation and management |
| Team Management | Team registration and squad management |
| Match Scheduling | Fixture planning and scheduling |
| Tournament Analytics | Rankings and performance analysis |
| Newsletter Management | Announcements and updates |
| Authentication | Secure user access |
| Player Profiles | Statistics and records |
| Responsive UI | Mobile and desktop support |

---

# Deployment

| Service | Platform |
|:---|:---|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MySQL |
| Build Tool | Maven + Vite |
| Source Control | GitHub |

---

# Repository Setup

<details>
<summary><b>Installation & Setup</b></summary>

```bash
# Clone the repository
git clone https://github.com/Madeshmadmax7/BatsUp.git

# Navigate to project directory
cd BatsUp

# Install dependencies
npm install
```

</details>

---

<details>
<summary><b>Development Server</b></summary>

```bash
# Start development server
npm run dev

# Runs at
http://localhost:5173
```

</details>

---

<details>
<summary><b>Production Build</b></summary>

```bash
# Create optimized production build
npm run build

# Preview build
npm run preview
```

</details>

---

<details>
<summary><b>Linting</b></summary>

```bash
# Run ESLint
npm run lint

# Fix issues
npm run lint -- --fix
```

</details>

---

# Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

---

# API Integration

The frontend communicates with Spring Boot services using REST APIs.

Example:

```javascript
import axios from "axios";

const api=axios.create({
  baseURL:import.meta.env.VITE_API_URL
});

export default api;
```

---

# Performance Optimization

- Component-based architecture
- Optimized REST API communication
- Tailwind CSS utility optimization
- Code splitting and lazy loading
- Responsive image delivery
- Fast Vite production builds
- Efficient state management
- Optimized asset loading

---

# Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile Browsers

---

# Screenshots Directory

```text
screenshots/
├── dashboard.gif
├── match-scheduling.png
├── fixture-management.png
├── tournament-analytics.png
├── team-management.png
└── newsletter.png
```

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=34&duration=4000&pause=2000&color=FFFFFF&background=09090B00&center=true&vCenter=true&width=650&height=60&lines=Cricket+Tournament+Management" />

<br/>

![Stars](https://img.shields.io/github/stars/Madeshmadmax7/BatsUp?style=flat-square&color=white&labelColor=09090b)
![License](https://img.shields.io/badge/License-MIT-white?style=flat-square&labelColor=09090b)
![React Powered](https://img.shields.io/badge/React-Powered-white?style=flat-square&labelColor=09090b)

<br/>

### Built with React • Spring Boot • Tailwind CSS • MySQL

Star this repository if you found BatsUp useful

</div>
