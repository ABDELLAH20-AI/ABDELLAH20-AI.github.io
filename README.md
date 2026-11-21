# Abdellah Ettaouil's ePortfolio (hacker theme)

A static ePortfolio for the Career & Management course (ENSEEIHT, Networks). Plain HTML, CSS and JavaScript, no build step, ready for GitHub Pages.

Features: boot screen, matrix rain background, typing effect, glitch title, animated skill bars, section headings and terminal windows that type themselves out when you scroll to them (click a window to skip), and an interactive terminal at the bottom. Commands include `help`, `ls`, `cat`, `cd`, `nmap`, `ping`, `neofetch`, `theme amber`, `matrix`, `hack`, and a 3-level beginner CTF (`ctf`, `submit flag{...}`, `base64 -d`, `rot13`). The third flag is hidden in an HTML comment in `index.html`.

## Files

```
index.html      all page content (look for <!-- EDIT --> comments)
style.css       theme and layout
script.js       effects and terminal; edit the CONFIG block at the top
assets/cv.pdf   your CV (add it when ready, see below)
```

## Edit your content

1. Open `index.html` and replace every `[text in brackets]` and each block marked `<!-- EDIT -->`.
2. In `script.js`, update `CONFIG` (name, typing roles, email, LinkedIn).
3. When your CV is ready, save it as `assets/cv.pdf`. Then in `index.html` swap the `[ CV: coming soon ]` span for `<a class="btn btn-alt" href="assets/cv.pdf" download>[ download CV ]</a>`, and in `script.js` change the `cv` command back to `location.href = "assets/cv.pdf"`.
4. Preview locally by opening `index.html` in a browser.

## Deploy on GitHub Pages

### Option A: personal site (`https://ABDELLAH20-AI.github.io`)
1. On GitHub, create a **public** repository named exactly `ABDELLAH20-AI.github.io`.
2. Upload the files: on the repo page click **Add file → Upload files**, drag in `index.html`, `style.css`, `script.js`, `README.md` and the `assets` folder, then **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. Wait 1 to 2 minutes, then visit `https://ABDELLAH20-AI.github.io`.

### Option B: project site (`https://ABDELLAH20-AI.github.io/eportfolio`)
Same steps, but name the repository `eportfolio` (or anything you like). The URL will be `https://ABDELLAH20-AI.github.io/<repo-name>`.

### Using git from the command line
```bash
git init
git add .
git commit -m "Initial ePortfolio"
git branch -M main
git remote add origin https://github.com/ABDELLAH20-AI/ABDELLAH20-AI.github.io.git
git push -u origin main
```
Then enable Pages as in step 3.

## Updating
Edit files, commit and push (or upload again on GitHub). The site updates within a minute or two.
