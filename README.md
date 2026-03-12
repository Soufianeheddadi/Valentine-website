# Valentine Website 💕

An interactive "Will You Be My Valentine?" page inspired by TikTok trends.  
A cute CSS-drawn bunny follows your cursor. Say **Yes** or try to click **No** — the bunny won't let you get away with it! 🐰

## ✨ Features

- Bunny smoothly follows the cursor
- **Yes** button grows bigger each time **No** is clicked (up to 3×)
- After 3 **No** clicks → bunny goes 😡 angry, arm points toward **Yes**, and **No** starts escaping the cursor
- Hover near **No** → it jumps randomly (left / right / up)
- Click **No** while bunny is angry → both buttons become **Yes! 💖**
- Click **Yes** → celebration overlay with confetti 🎉

## 🚀 Run Locally

**Prerequisites:** [Node.js](https://nodejs.org) (v18 or later)

```bash
# Install nothing extra — uses npx automatically
npm start
```

Then open **http://localhost:3000** in your browser.

## 🌐 Live Site

The site is automatically deployed to **GitHub Pages** on every push to `main`.  
You can visit it at:

```
https://soufianeheddadi.github.io/Valentine-website/
```

## 📁 Files

| File | Description |
|---|---|
| `index.html` | Page markup |
| `style.css` | Pink Valentine theme + CSS bunny |
| `script.js` | Bunny animation + button interactions |