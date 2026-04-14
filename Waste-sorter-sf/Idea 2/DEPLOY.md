# Deploy Trash Simulation to GitHub + Vercel

Follow these steps in order.

---

## Step 1: Create a new repo on GitHub

1. Open **https://github.com/new**
2. Set **Repository name** (e.g. `trash-simulation`).
3. Choose **Public**.
4. **Do not** check "Add a README", ".gitignore", or "License" (this project already has them).
5. Click **Create repository**.

---

## Step 2: Push this project to GitHub

Open a terminal in this project folder (`Idea 2`) and run the commands below.

**If you don’t have Git yet:** install from https://git-scm.com/downloads

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and the repo name you chose (e.g. `trash-simulation`).

### Windows (PowerShell)

```powershell
cd "c:\Users\alice\OneDrive\Desktop\Waste-sorter-sf\Idea 2"

git init
git add .
git commit -m "Initial commit: Trash Simulation"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Mac/Linux (Terminal)

```bash
cd "/path/to/Idea 2"

git init
git add .
git commit -m "Initial commit: Trash Simulation"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

When you run `git push`, you may be asked to sign in to GitHub (browser or token).

---

## Step 3: Deploy on Vercel

1. Go to **https://vercel.com** and sign in (choose **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** the repository you just pushed (e.g. `trash-simulation`).
4. Vercel will detect the app. Keep the defaults:
   - **Framework Preset:** Vite  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `dist`  
   - **Install Command:** `npm install`
5. Click **Deploy**.
6. Wait for the build to finish. Your app will be live at a URL like `trash-simulation-xxxx.vercel.app`.

You can change the project name in Vercel’s project settings to get a cleaner URL.

---

## Troubleshooting

- **"git is not recognized"**  
  Install Git from https://git-scm.com/downloads and restart the terminal.

- **Push rejected (auth)**  
  Sign in to GitHub in the browser when prompted, or use a Personal Access Token: GitHub → Settings → Developer settings → Personal access tokens.

- **Vercel build fails**  
  Make sure the build works locally: run `npm install` then `npm run build`. If that fails, fix the errors first, then push again; Vercel will redeploy.
