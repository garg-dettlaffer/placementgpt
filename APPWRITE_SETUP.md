# PlacementGPT - Appwrite Migration Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Appwrite Account
1. Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
2. Sign up for a free account
3. Create a new project called "PlacementGPT"
4. **Copy your Project ID** from the project settings

### Step 2: Get API Keys
1. In Appwrite Console, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it "Setup Key"
4. Select **All scopes** (for setup only)
5. **Copy the API Key** (you'll need it for the setup script)

### Step 3: Update Environment Variables

Edit `.env` file:
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here  # Paste your Project ID
VITE_GEMINI_API_KEY=AIzaSyAdRPxdTtyIa5xskWrGX5BY4zIMEAZGs70
VITE_PISTON_API_URL=https://emkc.org/api/v2/piston
VITE_APP_NAME=PlacementGPT
VITE_APP_URL=http://localhost:3000
```

### Step 4: Run Auto-Setup Script

1. Edit `setup-appwrite.js`:
   - Replace `YOUR_PROJECT_ID` with your actual Project ID
   - Replace `YOUR_API_KEY` with the API key you just created

2. Run the setup:
```bash
node setup-appwrite.js
```

This will automatically:
- ✅ Create the PlacementGPT database
- ✅ Create all collections (progress, problems, companies, etc.)
- ✅ Set up all attributes and schemas

**Expected output:**
```
🚀 Starting Appwrite setup...
✓ Database created: PlacementGPT
✓ Collection created: Progress
  ↳ Attribute created: userId
  ↳ Attribute created: solvedProblems
  ...
✅ Setup complete!
```

### Step 5: Configure Collection Permissions

In Appwrite Console → **Databases** → **placementgpt**:

For each collection, set **Permissions**:

**Progress Collection:**
- Read: `role:user`
- Create: `role:user`
- Update: `role:user`
- Delete: `role:user`

**Problems Collection:**
- Read: `role:all` (public)
- Create: `role:admin` (admin only)
- Update: `role:admin`
- Delete: `role:admin`

**Companies Collection:**
- Read: `role:all` (public)
- Create: `role:admin`
- Update: `role:admin`
- Delete: `role:admin`

**Mock Interviews Collection:**
- Read: `role:user`
- Create: `role:user`
- Update: `role:user`
- Delete: `role:user`

**Prep Plans Collection:**
- Read: `role:user`
- Create: `role:user`
- Update: `role:user`
- Delete: `role:user`

### Step 6: Add Sample Data (Optional)

You can manually add data in Appwrite Console or use the REST API:

**Sample Problem:**
```json
{
  "title": "Two Sum",
  "slug": "two-sum",
  "difficulty": "Easy",
  "acceptance": 48.5,
  "companies": "[\"Google\", \"Amazon\", \"Microsoft\"]",
  "tags": "[\"Array\", \"Hash Map\"]",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "examples": "[{\"input\": \"nums = [2,7,11,15], target = 9\", \"output\": \"[0,1]\"}]",
  "constraints": "[\"2 <= nums.length <= 10^4\"]",
  "starterCode": "{}",
  "testCases": "[]",
  "hints": "[]"
}
```

**Sample Company:**
```json
{
  "slug": "google",
  "name": "Google",
  "avgPackage": "₹42 LPA",
  "role": "SDE-1",
  "status": "Hiring",
  "focusAreas": "[\"DSA\", \"System Design\"]",
  "description": "Top tech company",
  "techStack": "[\"Python\", \"Java\", \"C++\"]",
  "interviewProcess": "[]"
}
```

### Step 7: Run the App Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` - your app should work! 🎉

---

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Migrate to Appwrite"
git push
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add **Environment Variables**:
   ```
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id_here
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_PISTON_API_URL=https://emkc.org/api/v2/piston
   VITE_APP_NAME=PlacementGPT
   VITE_APP_URL=https://your-app.vercel.app
   ```
4. Click **Deploy**
5. Done! Your app is live 🚀

### Step 3: Update Appwrite Allowed Origins

In Appwrite Console → **Settings** → **Platforms**:
- Add your Vercel URL: `https://your-app.vercel.app`
- This allows your deployed app to access Appwrite

---

##🔐 Authentication Setup

Appwrite handles authentication automatically using its built-in **Account** service. No additional setup required!

Features:
- ✅ Email/Password login
- ✅ Session management
- ✅ Password reset
- ✅ OAuth (Google) - just enable in Appwrite Console

To enable Google OAuth:
1. Go to Appwrite Console → **Auth** → **Settings**
2. Enable **Google** provider
3. Add your Google OAuth credentials

---

## 📊 Database Schema

### Collections Created:
1. **progress** - User study progress tracking
2. **problems** - Coding problems library
3. **companies** - Company database
4. **mock_interviews** - Mock interview sessions
5. **prep_plans** - User preparation plans

### User Data Structure:
- Uses Appwrite's built-in **Users** collection
- Additional user preferences stored in **Account.prefs**
- Progress data stored in **progress** collection

---

## 🛠 Migration Notes

### What Changed?
- ✅ Replaced PocketBase with Appwrite SDK
- ✅ Auth now uses Appwrite Account service
- ✅ Database operations use Appwrite Databases API
- ✅ All user references changed from `user.id` to `user.$id`
- ✅ JSON fields stored as strings (auto-parsed)

### File Changes:
- `src/services/pocketbase.js` → `src/services/appwrite.js`
- `src/context/AuthContext.jsx` - Updated for Appwrite
- `.env` - New Appwrite credentials

---

## 🐛 Troubleshooting

### "User not authenticated" error:
- Make sure you've set up collection permissions correctly
- Check that `role:user` has read/write access

### "Project not found":
- Verify `VITE_APPWRITE_PROJECT_ID` in `.env`
- Restart dev server after changing `.env`

### "Collection not found":
- Run `setup-appwrite.js` again
- Check Appwrite Console → Databases → placementgpt

### CORS errors on deployed site:
- Add your Vercel URL to Appwrite → Settings → Platforms

---

## 📞 Support

If you encounter issues:
1. Check Appwrite Console → **Logs** for detailed errors
2. Verify all environment variables are correct
3. Ensure collection permissions are set up
4. Check browser console for frontend errors

---

**Setup time: ~5 minutes** ⚡  
**No backend code required** 🎉  
**Auto-scaling included** 📈  
**Free tier: 75k requests/month** 💰
