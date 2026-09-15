# Deploying NIKAHFIX to a VPS

A complete, copy-pasteable walkthrough for putting this site live on a Linux VPS (DigitalOcean, Vultr, Linode, Hostinger VPS, etc.) with a real domain and HTTPS. Written for **Ubuntu 22.04/24.04**; the same steps work on Debian with minor package-name differences.

Total time: ~30–45 minutes for a first deploy.

---

## 0. What you'll need before starting

- A VPS with root or sudo SSH access (1 vCPU / 1GB RAM is plenty for this site).
- A domain name (optional but recommended) — e.g. `nikahfix-budiandini.com` or a subdomain like `wedding.yourdomain.com`.
- This project's code, either pushed to a Git repository (GitHub/GitLab, can be private) or ready to upload directly from your computer.

---

## 1. Point your domain at the VPS (skip if using the bare IP)

In your domain registrar's DNS settings, add an **A record**:

| Type | Name | Value |
|---|---|---|
| A | `@` (or `wedding` for a subdomain) | your VPS's IP address |

DNS changes can take a few minutes to a few hours to propagate. You can start the server setup below while you wait.

---

## 2. Connect to your VPS

From your own computer's terminal:

```bash
ssh root@YOUR_VPS_IP
```

(Replace with your actual username/IP — your VPS provider emails these when you create the server.)

It's good practice to do the rest as a non-root user. If you only have `root`, create one:

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

From here on, run everything as this user (commands use `sudo` where needed).

---

## 3. Update the system and install Node.js

```bash
sudo apt update && sudo apt upgrade -y
```

Install Node.js 20 (the version this project was built and tested with) via NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify:

```bash
node -v   # should print v20.x.x
npm -v
```

Install Git (needed if you're cloning the repo):

```bash
sudo apt install -y git
```

---

## 4. Get the project onto the server

**Option A — Git (recommended, makes future updates a one-liner):**

```bash
cd ~
git clone https://github.com/your-username/your-repo.git nikahfix
cd nikahfix
```

**Option B — Upload directly from your computer (no Git repo needed):**

Run this from your **local machine** (not the VPS), from the project's parent folder:

```bash
rsync -avz --exclude node_modules --exclude .next ./nikahfix deploy@YOUR_VPS_IP:~/nikahfix
```

Then SSH back into the VPS and `cd ~/nikahfix`.

---

## 5. Install dependencies and build

Still inside `~/nikahfix` on the VPS:

```bash
npm install
npm run build
```

Add your real photos/video now if you haven't already (see the main [README](README.md) for exactly which files go where), then rebuild with `npm run build` again if you added them after this step.

Quick sanity check that it runs:

```bash
npm start
```

Visit `http://YOUR_VPS_IP:3141` in a browser — you should see the profile-select screen. Press `Ctrl+C` to stop it; we'll run it properly with a process manager next.

(This project's `ecosystem.config.js` runs the app on port `3141` rather than Next's default `3000` — every command and config below already matches that.)

---

## 6. Keep it running with PM2

`npm start` dies the moment you close your SSH session. [PM2](https://pm2.keymetrics.io/) keeps the app running in the background and restarts it automatically if it crashes or the server reboots.

```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
```

`ecosystem.config.js` (already in the repo) tells PM2 to run Next's production server directly (equivalent to `next start`, never `next dev`) with `NODE_ENV=production` and a single instance. It runs Next's CLI file directly rather than through `npm start`, since `npm`'s own launcher is a shell/batch wrapper that process managers can't always spawn reliably — this way it's identical on Linux and Windows. It's kept to one instance deliberately: RSVP/Guest Book write to plain JSON files under `data/`, which isn't safe for concurrent writes from multiple cluster workers.

Make PM2 itself start on server boot:

```bash
pm2 startup
```

This prints a command starting with `sudo env PATH=...` — copy and run exactly that line (it's specific to your system).

Useful PM2 commands going forward:

```bash
pm2 status              # is it running?
pm2 logs nikahfix        # tail the app's logs
pm2 restart nikahfix     # restart after a change
```

---

## 7. Put Nginx in front of it (reverse proxy)

Running Next.js directly on port 3141 works, but you want port 80/443 (standard web ports) pointing at it, plus room to add HTTPS. Install Nginx:

```bash
sudo apt install -y nginx
```

This repo already includes a ready-made config at [`nikahfix.nginx.conf`](nikahfix.nginx.conf), pointed at port `3141`. Install it:

```bash
sudo cp ~/nikahfix/nikahfix.nginx.conf /etc/nginx/sites-available/nikahfix
sudo nano /etc/nginx/sites-available/nikahfix   # replace yourdomain.com with your real domain (or the VPS IP)
```

Then enable it:

```bash
sudo ln -s /etc/nginx/sites-available/nikahfix /etc/nginx/sites-enabled/
sudo nginx -t          # should say "syntax is ok" / "test is successful"
sudo systemctl restart nginx
```

---

## 8. Open the firewall

If `ufw` is active (common default on many VPS images):

```bash
sudo ufw allow 'Nginx Full'   # opens 80 and 443
sudo ufw allow OpenSSH        # don't lock yourself out of SSH
sudo ufw enable               # if not already enabled
sudo ufw status
```

At this point, visiting `http://yourdomain.com` (or `http://YOUR_VPS_IP`) should show the site over plain HTTP.

---

## 9. Enable HTTPS (free, via Let's Encrypt)

Only do this once your domain's DNS is actually pointing at the VPS (step 1).

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will ask for an email (for renewal notices) and offer to redirect HTTP → HTTPS automatically — say yes. It edits your Nginx config for you.

Certificates auto-renew via a systemd timer Certbot installs; confirm it's active:

```bash
sudo systemctl status certbot.timer
```

Your site is now live at `https://yourdomain.com`.

---

## 10. Updating the site later

Whenever you change content (`lib/content.ts`), swap photos, or pull code updates:

```bash
cd ~/nikahfix
git pull                 # if using Git (Option A above) — or re-upload via rsync
npm install               # only needed if dependencies changed
npm run build
pm2 restart nikahfix
```

That's it — no downtime beyond the few seconds PM2 takes to restart.

---

## 11. About the RSVP & Guest Book data

This app stores RSVPs and Guest Book messages as JSON files under `data/` on the server's disk (`data/rsvp.json`, `data/guestbook.json`). On a VPS (unlike serverless platforms) this persists fine across restarts and deploys — but it lives on that one server's disk, so:

- **Back it up periodically**, especially as the wedding date approaches:
  ```bash
  scp deploy@YOUR_VPS_IP:~/nikahfix/data/*.json ./backup/
  ```
- If you ever migrate to a new VPS, copy the `data/` folder over along with the code.
- `npm run build` and `git pull` never touch `data/` — your submissions are safe across updates.

---

## Troubleshooting

**Site shows "502 Bad Gateway"** — the Next.js app isn't running. Check `pm2 status` and `pm2 logs nikahfix` for errors.

**Changes to `lib/content.ts` don't show up** — you need to rebuild: `npm run build && pm2 restart nikahfix`. Editing files alone doesn't recompile the production build (that's only automatic in `npm run dev`, which you shouldn't use in production).

**Port 3141 already in use** — something else is already running there. Check with `sudo lsof -i :3141` and stop the conflicting process, or change the port: edit `PORT: 3141` in `ecosystem.config.js` to something else, run `pm2 restart nikahfix`, and update the `proxy_pass` line in `nikahfix.nginx.conf` (and the copy in `/etc/nginx/sites-available/nikahfix`) to match.

**Certbot fails with a DNS/challenge error** — your domain's A record probably hasn't propagated yet. Wait a bit and retest with `dig yourdomain.com` — it should return your VPS's IP.
