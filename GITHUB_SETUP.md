# Connect This Project to GitHub

Use these steps to connect your **CCP Project** folder to your repository:

**Repository URL:** `https://github.com/aliceljp6-a11y/CCP-Project.git`

---

## 1. Install Git (if you don’t have it)

1. Download: https://git-scm.com/download/win  
2. Run the installer (default options are fine).  
3. **Close and reopen** Cursor/terminal so it picks up Git.

To check: open a **new** terminal and run:

```bash
git --version
```

If you see a version number, Git is ready.

---

## 2. Open terminal in your project folder

- In Cursor: **Terminal → New Terminal**, then run:
  ```bash
  cd "c:\Users\alice\OneDrive\Desktop\CCP Project"
  ```
- Or in File Explorer: open this folder, type `cmd` or `powershell` in the address bar, press Enter.

---

## 3. Initialize Git and connect to GitHub

Run these commands **one at a time** in that folder:

```bash
# Initialize a new Git repo in this folder
git init

# Add the GitHub repo as the "origin" remote
git remote add origin https://github.com/aliceljp6-a11y/CCP-Project.git

# Stage all files (respects .gitignore)
git add .

# First commit
git commit -m "Initial commit: Recology Transfer Station virtual tour"

# Use main as the default branch (if your GitHub repo expects "main")
git branch -M main

# Push to GitHub (you may be asked to sign in)
git push -u origin main
```

---

## 4. If the GitHub repo already has files (e.g. README)

If the repo was created with a README or other files, do this instead of a plain `git push`:

```bash
git pull origin main --allow-unrelated-histories
# Resolve any conflicts if asked, then:
git push -u origin main
```

---

## 5. After the first push

- Your code will be at: **https://github.com/aliceljp6-a11y/CCP-Project**
- For future updates:
  ```bash
  git add .
  git commit -m "Describe your change"
  git push
  ```

---

## Authentication

- **HTTPS:** When you `git push`, Git may open a browser or ask for your GitHub username and a **Personal Access Token** (not your password). Create a token: GitHub → Settings → Developer settings → Personal access tokens.
- **SSH:** If you use SSH keys with GitHub, use this remote instead:
  ```bash
  git remote set-url origin git@github.com:aliceljp6-a11y/CCP-Project.git
  ```
