# PlacementGPT - Complete Setup Guide

This guide walks you through every step to get PlacementGPT running locally and prepare for deployment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Project Setup](#step-1-project-setup)
3. [Step 2: Environment Configuration](#step-2-environment-configuration)
4. [Step 3: Database Setup](#step-3-database-setup)
5. [Step 4: Running Locally](#step-4-running-locally)
6. [Step 5: Verification Checklist](#step-5-verification-checklist)
7. [Step 6: First Time User Testing](#step-6-first-time-user-testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js v16+** ([Download](https://nodejs.org/))
  - Test: `node --version` (should show v16+)
  - Test: `npm --version` (should show v8+)
  
- **Git** (Optional but recommended)
  - Test: `git --version`

### API Keys & Accounts

1. **Google Gemini API Key** (Free)
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account (create one if needed)
   - Click "Create API key"
   - Copy the key (you'll need it in Step 2)

2. **PocketBase Instance** (Free)
   - Option A: [PocketHost.io](https://pockethost.io) - Zero setup, free tier
   - Option B: Self-host on your machine (included in project)

3. **Razorpay Account** (Optional - for payments)
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Sign up with email
   - Copy test key from Settings → API Keys

---

## Step 1: Project Setup

### 1a. Navigate to Project Directory
```bash
cd c:/Users/krish/Downloads/placementgpt
```

### 1b. Install Dependencies
```bash
npm install
```
This will install all required packages (React, Vite, Tailwind, etc.) and may take 2-5 minutes.

**What's being installed:**
- React 18, Vite 5, Tailwind CSS 3
- PocketBase SDK, Gemini AI, Framer Motion
- React Router, Monaco Editor, Recharts
- 15+ other production dependencies

### 1c. Verify Installation
```bash
npm list
```
Should show a tree of all installed packages without errors.

---

## Step 2: Environment Configuration

### 2a. Create .env File
```bash
# Windows (Command Prompt or PowerShell)
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

### 2b. Edit .env with Your Values
Open `.env` in your text editor and update:

```env
# Required: PocketBase URL
VITE_POCKETBASE_URL=https://YOUR_APP_NAME.pockethost.io
# OR if self-hosting locally:
# VITE_POCKETBASE_URL=http://localhost:8090

# Required: Google Gemini API Key (from Step 1 Prerequisites)
VITE_GEMINI_API_KEY=AIzaSyA...........................

# Optional: Razorpay Test Key (for payment features)
VITE_RAZORPAY_KEY=rzp_test_...........................

# These are defaults - no changes needed
VITE_PISTON_API_URL=https://emkc.org/api/v2/piston
VITE_APP_NAME=PlacementGPT
VITE_APP_URL=http://localhost:5173
```

### 2c. Verify Changes
```bash
# Windows
type .env

# Mac/Linux
cat .env
```

---

## Step 3: Database Setup

Choose ONE option below:

### Option A: PocketHost.io (Recommended - 5 minutes, no setup)

#### 3a. Create Free Account
1. Go to [PocketHost.io](https://pockethost.io)
2. Click "Sign Up"
3. Use email/password you remember
4. Verify email (check spam folder)

#### 3b. Create New App
1. Log in to PocketHost dashboard
2. Click "Create App" 
3. Name it (e.g., "placementgpt-dev")
4. Click "Create"
5. Wait 30 seconds for app creation
6. Copy the app URL (looks like: `https://placementgpt-dev.pockethost.io`)

#### 3c. Open Database Admin UI
1. Open app URL + `/_/` (e.g., `https://placementgpt-dev.pockethost.io/_/`)
2. Default login:
   - Email: `admin@example.com`
   - Password: `0123456789`
3. **CHANGE THIS IMMEDIATELY** → Settings → Auth → Change password

#### 3d. Create Collections
In the Admin UI, create these 6 collections:

**Collection 1: users**
- Click "Create collection"
- Name: `users`
- Create fields:
  - `email` (Email type, Required, Unique)
  - `password` (Password type, Required)
  - `name` (Text, Required)
  - `college` (Text, Required)
  - `branch` (Text, Required)
  - `graduationYear` (Number)
  - `cgpa` (Number)
  - `targetCompanies` (JSON)
  - `skills` (JSON)
  - `plan` (Select: free/pro)
  - `credits` (Number)
  - `avatar` (File)

**Collection 2: progress**
- Create fields:
  - `user` (Relation to users, Required)
  - `solvedProblems` (JSON)
  - `attemptedProblems` (JSON)
  - `accuracy` (Number)
  - `studyTime` (Number)
  - `streak` (Number)
  - `topicStats` (JSON)
  - `weeklyXP` (Number)
  - `totalXP` (Number)

**Collection 3: mock_interviews**
- Create fields:
  - `user` (Relation to users, Required)
  - `sessionId` (Text, Required)
  - `type` (Select: dsa/system_design/behavioral)
  - `company` (Text)
  - `questions` (JSON)
  - `responses` (JSON)
  - `score` (Number)
  - `feedback` (JSON)
  - `duration` (Number)

**Collection 4: prep_plans**
- Create fields:
  - `user` (Relation to users, Required)
  - `company` (Text, Required)
  - `roadmap` (JSON)
  - `progress` (Number)
  - `customNotes` (Text)

**Collection 5: problems**
- Create fields:
  - `title` (Text, Required)
  - `slug` (Text, Required, Unique)
  - `difficulty` (Select: Easy/Medium/Hard)
  - `acceptance` (Number)
  - `companies` (JSON)
  - `tags` (JSON)
  - `description` (Text)
  - `examples` (JSON)
  - `constraints` (JSON)
  - `starterCode` (JSON)
  - `testCases` (JSON)
  - `hints` (JSON)
  - `solution` (Text)

**Collection 6: companies**
- Create fields:
  - `slug` (Text, Required, Unique)
  - `name` (Text, Required)
  - `avgPackage` (Text)
  - `role` (Text)
  - `visitsCollege` (Boolean)
  - `status` (Select: HIRING/CLOSED/SOON)
  - `focusAreas` (JSON)
  - `commonQuestions` (JSON)
  - `interviewRounds` (JSON)
  - `resources` (JSON)

#### 3e. Update .env
Copy your app URL to .env:
```env
VITE_POCKETBASE_URL=https://your-app-name.pockethost.io
```

---

### Option B: Self-Host PocketBase Locally (10 minutes, more control)

#### 3a. Download PocketBase
1. Go to [pocketbase.io/docs](https://pocketbase.io/docs/#installation)
2. Download for your OS (Windows/Mac/Linux)
3. Extract to a folder (e.g., `C:/PocketBase`)

#### 3b. Start PocketBase Server
```bash
# Windows
cd C:/PocketBase
./pocketbase.exe serve

# Mac/Linux
cd /path/to/pocketbase
./pocketbase serve
```

You should see:
```
▶ Server started at http://127.0.0.1:8090
▶ Admin UI available at http://127.0.0.1:8090/_/
```

#### 3c. Open Admin UI
- Go to `http://127.0.0.1:8090/_/` in browser
- First time opens collection creation wizard
- Create the 6 collections listed in Option A

#### 3d. Update .env
```env
VITE_POCKETBASE_URL=http://localhost:8090
```

---

## Step 4: Running Locally

### 4a. Start Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

### 4b. Open in Browser
- Click the link or go to `http://localhost:5173`
- You should see the PlacementGPT landing page

### 4c. Keep Server Running
- Leave the terminal open while developing
- Changes to files auto-reload in browser
- Press `q` to stop the server

---

## Step 5: Verification Checklist

Test these features to verify everything works:

### ✅ Landing Page
- [ ] Visit `http://localhost:5173` 
- [ ] See hero section with gradient text
- [ ] "Try for Free" button works
- [ ] Features section displays 6 items
- [ ] Testimonials carousel works
- [ ] Footer renders

### ✅ Authentication
- [ ] Click "Try for Free" → Signup page opens
- [ ] Toggle between Login and Signup tabs works
- [ ] Email validation works (remove @ breaks it)
- [ ] Password strength meter appears on signup
- [ ] College dropdown populated with 22 colleges
- [ ] Branch dropdown populated with 10 branches
- [ ] Try to signup with test account:
  - Email: `test@example.com`
  - Password: `TestPassword123!`
  - College: `IIT Bombay`
  - Branch: `Computer Science`
  - Year: `2025`

### ✅ Onboarding
- [ ] After signup, redirects to onboarding
- [ ] Step 1 (Welcome) displays your name
- [ ] Step 2 (Companies) shows 20 companies, can select 3+
- [ ] Step 3 (Profile) has CGPA input and skills selector
- [ ] Step 4 shows loading while generating roadmap
- [ ] Next/Back buttons work

### ✅ Dashboard
- [ ] After onboarding, redirects to dashboard
- [ ] Welcome message shows your first name
- [ ] 4 stat cards visible (Problems, Accuracy, Study, XP)
- [ ] Streak widget shows 7-day calendar
- [ ] Quick Actions buttons work
- [ ] Sidebar navigation works (click Dashboard, Problems, etc.)

### ✅ Theme Toggle
- [ ] Click sun/moon icon in navbar
- [ ] Dark mode activates (background darkens)
- [ ] Refresh page - dark mode persists
- [ ] Click again to return to light mode

### ✅ Settings Page
- [ ] Navigate to Settings via sidebar
- [ ] Profile section editable
- [ ] Notification toggles work
- [ ] Theme selector works
- [ ] Logout button appears at bottom

### ✅ Other Pages
- [ ] Problems page loads with search and filters
- [ ] Mock Interview shows chat interface
- [ ] Resume Analyzer shows upload area
- [ ] Analytics shows charts and stats

### ❌ Expected Errors (Normal)
These errors are OK - they mean components are wired:
```
Cannot read property 'user' of null   ← No user logged in yet
Failed to fetch from PocketBase        ← If DB not configured
Invalid API key                        ← If Gemini key not set
```

---

## Step 6: First Time User Testing

### Full Flow Test
1. **Fresh signup**: New email (e.g., john+1@gmail.com)
2. **Onboarding**: Select companies, enter CGPA
3. **Dashboard**: View initial stats
4. **Problems**: Search and click a problem
5. **Workspace**: Try writing Python code and clicking Run
6. **Settings**: Change a preference

### Expected Behavior
- No crashes or white screens
- Buttons respond to clicks
- Forms validate input
- Toast notifications appear
- Loading spinners show during async operations

### Debugging Tips
- **Open DevTools**: Press `F12` or Right-click → Inspect
- **Console tab**: Shows errors and warnings in red
- **Network tab**: Shows API calls to PocketBase/Gemini
- **Application tab**: Shows localStorage (theme, auth token)

---

## Deployment

### Production Build

#### Create Optimized Build
```bash
npm run build
```

Creates `dist/` folder with optimized files (~500KB gzipped).

#### Test Build Locally
```bash
npm run preview
```

Opens production build on `http://localhost:4173` for testing.

### Option 1: Deploy to Vercel (Recommended)

#### 1a. Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub/GitLab/Bitbucket
- Authorize Vercel

#### 1b. Push to GitHub
```bash
# Create GitHub repo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/placementgpt.git
git push -u origin main
```

#### 1c. Deploy from Vercel Dashboard
1. Click "Add New Project"
2. Select your `placementgpt` repo
3. Framework: Detect as Vite
4. Root Directory: `./` 
5. Environment: Add 3 variables:
   - `VITE_POCKETBASE_URL`
   - `VITE_GEMINI_API_KEY`
   - `VITE_RAZORPAY_KEY`
6. Click "Deploy"

#### 1d. Update PocketBase CORS
In PocketBase Admin UI:
1. Go to Settings → API Rules
2. Add Vercel domain to CORS allowed origins
3. Example: `https://placementgpt.vercel.app`

### Option 2: Deploy to Railway

#### For PocketBase Backend
1. Create Railway account
2. Connect GitHub repo with Dockerfile
3. Set environment variables
4. Deploy

### Update Production URLs
After deployment, update all references:
- App URLs in docs
- OAuth redirect URLs
- API CORS settings
- Analytics tracking (if any)

---

## Troubleshooting

### Problem: `npm install` fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Problem: `npm run dev` crashes
```bash
# Check Node version
node --version

# Should be v16 or higher
# If older, download from nodejs.org
```

### Problem: Blank screen on http://localhost:5173
1. Check browser console (F12 → Console) for errors
2. Wait 5 seconds for Vite to compile
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check `.env` file exists

### Problem: "Cannot connect to PocketBase"
```
Error: Failed to fetch http://localhost:8090

Solutions:
1. If using PocketHost.io:
   - Check VITE_POCKETBASE_URL is correct
   - Verify app exists on PocketHost dashboard

2. If self-hosting:
   - Ensure `./pocketbase serve` is running
   - Check port 8090 isn't blocked by firewall
   - Try http://127.0.0.1:8090 instead of localhost
```

### Problem: Gemini API errors
```
Error: Invalid API key

Solutions:
1. Verify key in .env is correct (no spaces)
2. Check key in Google AI Studio hasn't expired
3. Ensure API is enabled in Google Cloud Console
4. Try creating new key if stuck
```

### Problem: Code doesn't run in CodingWorkspace
```
Error: Piston API unavailable

Solutions:
1. Check internet connection
2. Verify VITE_PISTON_API_URL is correct
3. Try: curl https://emkc.org/api/v2/piston/runtimes
4. Use local judge if needed
```

### Problem: Database migration issues
If PocketBase schema changes:
1. Drop and recreate collections
2. Run seed scripts (when available)
3. Update field names in `services/pocketbase.js`

---

## Next Steps After Setup

1. **Customize constants.js**
   - Add your colleges, companies, etc.
   - Adjust difficulty levels, skills list

2. **Populate sample data**
   - Add 10-20 problems to test
   - Add companies with details

3. **Customize branding**
   - Update logo in public/
   - Change primary color in tailwind.config.js
   - Update footer links

4. **Enable features**
   - Connect Razorpay for payments
   - Add OAuth (Google login)
   - Enable email notifications

5. **Deploy to production**
   - Build and deploy to Vercel
   - Deploy PocketBase to Railway
   - Update all URLs and API keys

---

## Help & Support

- **Docs**: See README.md for API usage
- **GitHub Issues**: Report bugs with details
- **Email**: Contact support@placementgpt.com (when available)
- **Discord**: Join community server (when available)

---

**You're all set! 🚀 Happy coding!**
