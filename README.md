<div align="center">

<br/>

<a href="https://github.com/Madeshmadmax7/BatsUp">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=58&duration=3000&pause=1500&color=FFFFFF&background=09090B00&center=true&vCenter=true&width=850&height=100&lines=BATSUP+MANAGER" alt="BATSUP MANAGER" />
</a>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=14&duration=4000&pause=1000&color=8B949E&center=true&vCenter=true&width=700&height=30&lines=Cricket+Tournament+Management+System;React+%7C+Vite+%7C+Tailwind+CSS+%7C+Axios+%7C+RESTful+API" alt="tagline" />

<br/>
<br/>

![React](https://img.shields.io/badge/React-Frontend-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<br/>
<br/>

<img src="./screenshots/dashboard.png" width="95%" />

<br/>

**BatsUp Manager is a comprehensive cricket tournament management platform designed to streamline tournament organization, player statistics tracking, team management, and match scheduling through an intuitive web interface and seamless API integration.**

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

BatsUp Manager combines a React frontend, modern build tooling with Vite, responsive Tailwind CSS styling, and RESTful API integration into a unified platform capable of managing tournaments, tracking player statistics, scheduling matches, and visualizing tournament data in real time.

<br/>

<table width="95%">
<tr>

<td width="50%" valign="top">

## Why BatsUp?

- Comprehensive tournament management
- Real-time player statistics tracking
- Interactive team management interface
- Match scheduling and organization
- Intuitive analytics dashboard
- Responsive web design
- Seamless API integration
- Fast and lightweight application

</td>

<td width="50%" valign="top">

## Built With

- **Frontend:** React · Vite · Tailwind CSS
- **HTTP Client:** Axios · REST APIs
- **UI Components:** Lucide React · React Icons
- **Routing:** React Router DOM
- **Build Tool:** Vite with HMR
- **Language:** JavaScript (ES6+)
- **Infrastructure:** GitHub · NPM

</td>

</tr>
</table>

---

# Features

## Tournament Management Dashboard

<table width="100%">
<tr>
<th width="50%" align="center">Dashboard Overview</th>
<th width="50%" align="center">Tournament Analytics</th>
</tr>

<tr>
<td align="center" valign="top">

<img src="./screenshots/dashboard.png" alt="Dashboard Overview"/>

</td>

<td align="center" valign="top">

<img src="./screenshots/tournament-dashboard.png" alt="Tournament Analytics"/>

</td>
</tr>
</table>

<br/>

The management dashboard provides comprehensive visualization of tournament progress, team standings, player performance metrics, and match schedules.

### Core Capabilities

- Real-time tournament metrics
- Team standings and rankings
- Interactive match scheduling
- Player performance statistics
- Team management interface
- Match result tracking
- Tournament progress monitoring
- Performance analytics and insights

---

## Tournament Organization

<div align="center">

<img src="./screenshots/tournament-view.png" width="90%" />

</div>

<br/>

The platform provides comprehensive tournament management capabilities, enabling users to organize tournaments, manage teams, schedule matches, and track comprehensive statistics across the entire event lifecycle.

```text
Tournament Creation
      ↓
Team Management
      ↓
Player Registration
      ↓
Match Scheduling
      ↓
Live Match Tracking
      ↓
Results & Analytics
```

### Organization Features

- Tournament creation and setup
- Team registration system
- Player profile management
- Flexible match scheduling
- Real-time score updates
- Comprehensive statistics tracking
- Automated rankings calculation

---

## Player Statistics Engine

<table>
<tr>
<td width="50%">

### Analytics Capabilities

- Player performance metrics
- Batting statistics analysis
- Bowling statistics tracking
- Match-by-match performance
- Historical data comparison
- Detailed player profiles

</td>

<td width="50%">

```text
Player Registration
      ↓
Match Participation
      ↓
Performance Tracking
      ↓
Statistics Processing
      ↓
Analytics Dashboard
```

</td>
</tr>
</table>

---

## Team Management System

<div align="center">

<img src="./screenshots/team-management.png" width="90%" />

</div>

<br/>

BatsUp includes intelligent team management systems capable of visualizing squad composition, player roles, team standings, performance metrics, and team progression.

### Management Features

- Squad composition tracking
- Player role assignments
- Team performance metrics
- Squad statistics
- Team standings visualization
- Performance analysis
- Injury and availability tracking

---

# System Workflow

<div align="center">

<img src="./screenshots/workflow.jpg" width="95%" />

</div>

---

# System Architecture

```text
 ┌──────────────────────────┐
 │    React Frontend        │
 │ Tournament Management    │
 └────────────┬─────────────┘
              │
              │ HTTPS / Axios
              ▼
 ┌──────────────────────────┐
 │      RESTful Backend     │
 │ APIs & Data Processing   │
 │ Business Logic           │
 └────────────┬─────────────┘
              │
      ┌───────┴────────┐
      ▼                ▼
 ┌───────────┐   ┌─────────────┐
 │ Database  │   │ Cache Layer │
 │ Storage   │   │ (Redis)     │
 └───────────┘   └─────────────┘
              │
              ▼
 ┌──────────────────────────┐
 │   Analytics Engine       │
 │ Statistics & Insights    │
 └──────────────────────────┘
```

---

# Technology Stack

| Frontend | Build Tools | HTTP & Routing | UI Components | Development |
|:---|:---|:---|:---|:---|
| React.js | Vite | Axios | Lucide React | ESLint |
| JavaScript | NPM | React Router DOM | React Icons | Autoprefixer |
| HTML5 | Hot Module Reload | REST APIs | Tailwind CSS | PostCSS |
| CSS3 | Rollup | API Integration | Component Library | Vite Plugins |
| Tailwind CSS | Production Build | Data Fetching | Icon Sets | Package Management |

---

# Application Flow

```text
User Interaction
      │
      ▼
React Components
      │
      ▼
Axios HTTP Requests
      │
 ┌────┴─────┐
 ▼          ▼
API Calls  Routing
 │          │
 └────┬─────┘
      ▼
Backend Processing
      │
      ▼
Database Operations
      │
      ▼
Response & Display
      │
      ▼
Dashboard & Views
```

---

# Project Structure

```bash
BatsUp/
│
├── src/
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── services/         # API services (Axios)
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # Tailwind styles
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
│
├── public/               # Static assets
├── screenshots/          # README assets
│
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies
├── index.html            # HTML template
└── README.md
```

---

# Modules

| Module | Description |
|:---|:---|
| Tournament Manager | Tournament creation and organization |
| Team Management | Team registration and squad management |
| Player Profiles | Player statistics and performance tracking |
| Match Scheduler | Match scheduling and organization |
| Analytics Engine | Performance metrics and statistics |
| Dashboard | Real-time analytics visualization |
| API Integration | Seamless backend communication |
| Responsive UI | Mobile-friendly interface |

---

# Deployment

| Service | Platform |
|:---|:---|
| Frontend | Vercel / Netlify |
| Build Output | Static Assets |
| Backend API | Node/Express or Python |
| Database | PostgreSQL / MongoDB |
| Hosting | AWS / Azure / DigitalOcean |

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
# Start development server with HMR
npm run dev

# Server runs at http://localhost:5173
```

</details>

---

<details>
<summary><b>Build for Production</b></summary>

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

</details>

---

<details>
<summary><b>Linting</b></summary>

```bash
# Run ESLint checks
npm run lint

# Fix linting issues
npm run lint -- --fix
```

</details>

---

# Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-api-endpoint.com
VITE_API_KEY=your-api-key
VITE_ENVIRONMENT=development
```

---

# API Integration

The application uses Axios for HTTP requests. Configure your API endpoints in:

```
src/services/api.js
```

Example:

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default API;
```

---

# Performance Optimization

- **Code Splitting:** Lazy loading with React Router
- **Bundle Optimization:** Vite's built-in tree-shaking
- **CSS Purging:** Tailwind CSS purges unused styles
- **Image Optimization:** Optimized asset delivery
- **HMR:** Fast Hot Module Replacement during development

---

# Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

---

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=34&duration=4000&pause=2000&color=FFFFFF&background=09090B00&center=true&vCenter=true&width=650&height=60&lines=Cricket+Tournament+Management" />

<br/>

![Stars](https://img.shields.io/github/stars/Madeshmadmax7/BatsUp?style=flat-square&color=white&labelColor=09090b)
![License](https://img.shields.io/badge/License-MIT-white?style=flat-square&labelColor=09090b)
![React Powered](https://img.shields.io/badge/React-Powered-white?style=flat-square&labelColor=09090b)

<br/>

Star this repository if you found BatsUp useful

</div>