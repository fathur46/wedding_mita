// PM2 process file — runs the production build (`next start`), not the dev
// server. Build first, then start/reload through this file:
//
//   npm run build
//   pm2 start ecosystem.config.js
//
// Later updates:
//   npm run build
//   pm2 restart nikahfix
//
// See DEPLOYMENT.md for the full VPS setup walkthrough.
//
// Runs Next's actual CLI entry (node_modules/next/dist/bin/next) with Node
// directly, rather than going through "npm start" — npm's own launcher is a
// shell/batch wrapper (npm.cmd on Windows, a shell script on Linux) that PM2
// can't spawn reliably cross-platform. Next's CLI file is plain JS with a
// #!/usr/bin/env node shebang, so this works identically on Windows and the
// Ubuntu VPS.

module.exports = {
  apps: [
    {
      name: "nikahfix",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      // Single instance only: RSVP/Guest Book persist to plain JSON files
      // under data/, which isn't safe for concurrent writes from multiple
      // processes — don't switch this to cluster mode.
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3141,
      },
    },
  ],
};
