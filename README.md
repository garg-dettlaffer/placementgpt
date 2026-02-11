# PlacementGPT - AI-Powered Placement Preparation Platform

A comprehensive, production-ready web application built with React 18, Vite, Tailwind CSS, and powered by Google Gemini Pro AI, PocketBase backend, and Piston API for code execution.

## 🎯 Features

- **AI-Powered Learning**: Personalized preparation roadmaps based on your profile and target companies
- **Coding Practice**: 500+ DSA problems with AI hints and editorials
- **Mock Interviews**: Realistic technical interviews with instant AI feedback
- **Resume Analysis**: ATS-optimized resume suggestions powered by Gemini
- **Progress Tracking**: Real-time analytics and performance metrics
- **Company Prep**: Targeted roadmaps for 100+ companies
- **Code Execution**: Run and test code in multiple languages
- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Mobile-first, works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router v6** - Routing
- **Recharts** - Data visualization
- **Monaco Editor** - Code editor
- **Lucide React** - Icons

### Backend & Services
- **PocketBase** - Self-hosted backend (SQLite)
- **Google Gemini Pro API** - AI capabilities
- **Piston API** - Code execution engine
- **Razorpay** - Payments (optional)

### State Management
- **React Context API** - Auth, Theme, Progress
- **Zustand** - Additional state management

## 📦 Project Structure

```
placementgpt/
├── src/
│   ├── components/
│   │   ├── layout/           (Navbar, Sidebar, Footer)
│   │   ├── auth/             (ProtectedRoute, AuthGuard)
│   │   ├── common/           (LoadingSpinner, Modal, ErrorBoundary)
│   │   ├── problem/          (Problem-related components)
│   │   ├── company/          (Company-related components)
│   │   └── dashboard/        (Dashboard widgets)
│   ├── pages/                (12 main pages)
│   ├── services/             (PocketBase, Gemini, Piston APIs)
│   ├── context/              (Auth, Theme, Progress contexts)
│   ├── hooks/                (Custom React hooks)
│   ├── utils/                (Helpers, constants, data)
│   ├── App.jsx               (Main routing)
│   ├── main.jsx              (React entry point)
│   └── index.css             (Global styles + Tailwind)
├── public/                   (Static assets)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env                      (Environment variables)
├── .env.example              (Template)
├── index.html
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Google Gemini API key (free tier available)
- PocketBase instance (self-hosted or PocketHost)

### Installation

1. **Clone the repository**
```bash
cd placementgpt
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your credentials
VITE_POCKETBASE_URL=https://your-pockethost-app.pockethost.io
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_RAZORPAY_KEY=your_razorpay_key_here
VITE_PISTON_API_URL=https://emkc.org/api/v2/piston
```

4. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 PocketBase Setup

### Option 1: PocketHost (Recommended - No setup required)

1. Go to [PocketHost.io](https://pockethost.io)
2. Create a free account and new app
3. Copy the app URL to `.env`
4. Use PocketBase Admin UI to create collections

### Option 2: Self-Host PocketBase

```bash
# Download from https://pocketbase.io/docs/#installation
./pocketbase serve

# Admin UI: http://localhost:8090/_/
```

### Create Collections in PocketBase

Create the following collections in the Admin UI:

1. **users**
   - email (Email, Unique, Required)
   - password (Password, Required)
   - name (Text, Required)
   - college (Text, Required)
   - branch (Text, Required)
   - graduationYear (Number, Required)
   - cgpa (Number)
   - plan (Select: free/pro)
   - credits (Number, Default: 10)
   - targetCompanies (JSON)
   - skills (JSON)
   - avatar (File)
   - resumeUrl (File)

2. **progress**
   - user (Relation to users, Required)
   - solvedProblems (JSON)
   - attemptedProblems (JSON)
   - accuracy (Number)
   - studyTime (Number)
   - streak (Number)
   - topicStats (JSON)
   - weeklyXP (Number)
   - totalXP (Number)

3. **mock_interviews**
   - user (Relation to users, Required)
   - sessionId (Text, Required)
   - type (Select: dsa/system_design/behavioral)
   - company (Text)
   - questions (JSON)
   - responses (JSON)
   - score (Number)
   - feedback (JSON)
   - duration (Number)

4. **prep_plans**
   - user (Relation to users, Required)
   - company (Text, Required)
   - roadmap (JSON)
   - progress (Number)
   - customNotes (Text)

5. **problems** (Pre-populate with coding problems)
   - title (Text, Required)
   - slug (Text, Unique, Required)
   - difficulty (Select: Easy/Medium/Hard)
   - acceptance (Number)
   - companies (JSON)
   - tags (JSON)
   - description (Text)
   - examples (JSON)
   - constraints (JSON)
   - starterCode (JSON)
   - testCases (JSON)
   - hints (JSON)
   - solution (Text)
   - videoUrl (Text)

6. **companies** (Pre-populate with company data)
   - slug (Text, Unique, Required)
   - name (Text, Required)
   - logo (File)
   - avgPackage (Text)
   - role (Text)
   - visitsCollege (Boolean)
   - status (Select: HIRING/CLOSED/SOON/PAUSED)
   - focusAreas (JSON)
   - commonQuestions (JSON)
   - interviewRounds (JSON)
   - interviewTips (Text)
   - pastQuestions (JSON)
   - resources (JSON)

##  Routing

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

### Protected Routes (Authentication Required)
- `/dashboard` - Main dashboard
- `/onboarding` - Initial setup wizard
- `/problems` - Problem library
- `/problem/:slug` - Coding workspace
- `/prep-plans` - Company prep paths
- `/prep-plan/:slug` - Company-specific roadmap
- `/mock-interview` - Mock interview mode
- `/resume-analyzer` - Resume analysis tool
- `/analytics` - Progress analytics
- `/settings` - User settings

## 🔐 Authentication Flow

1. **Signup**
   - Form validation (email, password strength, etc.)
   - Account creation with PocketBase
   - Auto-create progress record
   - Redirect to onboarding

2. **Login**
   - Email/password authentication
   - JWT token management
   - Auto-redirect based on onboarding status

3. **Protected Routes**
   - ProtectedRoute component checks authentication
   - Redirects unauthenticated users to login
   - Shows loading spinner while checking auth

## 🎨 Customization

### Modify Colors
Edit `tailwind.config.js`:
```javascript
extend: {
  colors: {
    primary: {
      // Change these values
      500: '#0ea5e9',
      600: '#0284c7',
      // ...
    }
  }
}
```

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Use ProtectedRoute for private pages

### Update Constants
Edit `src/utils/constants.js`:
- COLLEGES
- BRANCHES
- TOP_COMPANIES
- PROBLEM_TOPICS
- And more...

## 📚 API Integration

### Gemini AI Integration
```javascript
import { gemini } from '../services/gemini.js';

// Generate personalized roadmap
const roadmap = await gemini.analyzePlacement(
  college, branch, targetCompanies, cgpa
);
```

###Piston Code Execution
```javascript
import { piston } from '../services/piston.js';

// Execute code
const result = await piston.execute(
  language,
  code,
  stdin,
  testCases
);
```

### PocketBase Operations
```javascript
import { db, auth } from '../services/pocketbase.js';

// Fetch problems
const problems = await db.getProblems({ difficulty: 'Medium' });

// Sign up user
const user = await auth.signUp(email, password, name, college, branch, year);
```

## 🚀 Deployment

### Frontend (Vercel - Recommended)
```bash
npm run build
# Deploy the 'dist' folder to Vercel
```

### Backend (Railway - Free Tier)
1. Deploy PocketBase to Railway
2. Update `VITE_POCKETBASE_URL` in production

### Environment Variables (Production)
Update in your deployment platform:
- `VITE_POCKETBASE_URL`
- `VITE_GEMINI_API_KEY`
- `VITE_RAZORPAY_KEY`

## 🧪 Testing Features Locally

### Mock Data
The app includes sample data for testing:
- 20+ companies
- 4 sample problems
- Mock user progress

### API Mocking
- Gemini responses are mocked for preview
- All endpoints support offline testing

## 📖 Documentation

### Component Documentation
Each component has clear prop documentation:
- `ProtectedRoute` - Route protection wrapper
- `LoadingSpinner` - Reusable loader component
- `Modal` - Reusable modal component with ConfirmModal variant

### Hook Documentation
- `useAuth()` - Authentication management
- `useTheme()` - Theme management
- `useProgress()` - User progress tracking
- `useProblems()` - Problem data fetching
- `useCompanies()` - Company data fetching

## 🐛 Troubleshooting

### PocketBase Connection Issues
```
Error: Failed to connect to PocketBase
→ Check VITE_POCKETBASE_URL in .env
→ Ensure PocketBase instance is running
→ Check CORS settings in PocketBase
```

### Gemini API Errors
```
Error: Invalid API key
→ Verify VITE_GEMINI_API_KEY in .env
→ Check API quotas and billing
→ Ensure Pro membership (optional)
```

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Environment Variables Reference

```env
# PocketBase (Required)
VITE_POCKETBASE_URL=https://your-app.pockethost.io

# Google Gemini (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key

# Razorpay (Optional for payments)
VITE_RAZORPAY_KEY=your_razorpay_key

# Piston API (Community default - no key needed)
VITE_PISTON_API_URL=https://emkc.org/api/v2/piston

# App Configuration
VITE_APP_NAME=PlacementGPT
VITE_APP_URL=http://localhost:5173
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎓 Educational Use

This platform is designed for educational purposes to help students prepare for tech interviews and placements. Modify and extend it for your institution's needs!

## 📞 Support

For issues and questions:
1. Check the FAQ in Settings
2. Review the documentation
3. Check GitHub Issues
4. Create a new issue with details

---

**Built with ❤️ for placement success**

**Happy Coding!** 🚀
