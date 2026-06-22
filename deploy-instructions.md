# Deployment & Lifecycle Instructions - VPS Self-Hosted Setup

This guide explains how to deploy, run, and maintain the zero-dependency product image enrichment pipeline on a self-hosted VPS (such as DigitalOcean, Linode, AWS EC2, or custom server).

---

## 1. Environment Variables Checklist
Configure these in your production `.env` or VPS system context:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/sierra-fish-pets

# Image Enrichment Scheduler Settings
IMAGE_BATCH_SIZE=50
IMAGE_PROCESS_INTERVAL=60000

# Image Lookup APIs (Optional but recommended for high accuracy)
UPCITEMDB_API_KEY=
BARCODE_LOOKUP_API_KEY=
```

---

## 2. Persistent Image Storage Setup
All images are downloaded to `uploads/products/` in the project root directory.

> [!WARNING]
> Since Next.js deployments on self-hosted VPS servers (e.g. using CI/CD pipelines, Git clones, or zip extractions) usually overwrite the project directory, you **must preserve the uploads directory** between deployments.
> 
> Execute these commands on your VPS to link the project upload directory to a persistent location:

```bash
# 1. Create a persistent folder outside the deployment path
mkdir -p /var/www/sierra-persistent/uploads/products

# 2. Inside your active deployment folder, create a symlink to that folder
ln -s /var/www/sierra-persistent/uploads/ ./uploads
```

---

## 3. Web Process Manager Setup (PM2)
Since we removed Redis and BullMQ, no background worker processes, docker containers, or Redis servers are needed! The image enrichment scheduler runs completely inside the main Next.js web application process.

### Install PM2
```bash
npm install -g pm2
```

### Process Configuration (`ecosystem.config.js`)
Create an `ecosystem.config.js` file in your root folder:

```javascript
module.exports = {
  apps: [
    {
      name: "sierra-web",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

### Start Next.js via PM2
```bash
# Start Next.js server (which automatically boots the background scheduler on DB connect)
pm2 start ecosystem.config.js

# Save process list to auto-start on VPS reboot
pm2 save
pm2 startup
```

### Monitor Enrichment Logs
```bash
# Show Next.js console logs containing scheduler & download traces
pm2 logs sierra-web
```
