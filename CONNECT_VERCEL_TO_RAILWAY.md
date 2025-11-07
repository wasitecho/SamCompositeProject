# 🔗 Connect Vercel Frontend to Railway Backend

Your frontend is already deployed at: **https://sam-composite-project-kvoi.vercel.app/**

## Quick Connection Steps

### Step 1: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click on your project: `sam-composite-project-kvoi`

2. **Navigate to Settings**
   - Click **Settings** tab
   - Click **Environment Variables** in the left sidebar

3. **Add API URL**
   - Click **Add New**
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://samcompositeproject-production.up.railway.app/api`
     - ⚠️ **Important**: Must include `/api` at the end (no trailing slash after `/api`)
     - Example: `https://samcompositeproject-production.up.railway.app/api`
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger automatic redeploy

### Step 2: Update CORS in Railway

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Open your backend service

2. **Add Environment Variable**
   - Click on your service
   - Go to **Variables** tab
   - Click **+ New Variable**

3. **Add CORS Configuration**
   - **Variable Name**: `CORS_ALLOWED_ORIGINS`
   - **Value**: `https://sam-composite-project-kvoi.vercel.app`
   - Click **Add**

4. **Redeploy Railway Service**
   - Railway will automatically redeploy when you add a variable
   - Or manually trigger a redeploy from the **Deployments** tab

### Step 3: Verify Connection

1. **Test Your Vercel App**
   - Visit: https://sam-composite-project-kvoi.vercel.app/
   - Open Browser Developer Tools (F12)
   - Go to **Console** tab - check for errors
   - Go to **Network** tab - verify API calls are going to your Railway backend

2. **Test API Endpoints**
   - Try to load products: Check if products appear
   - Try to login: Test authentication
   - Check Network tab to see if requests are successful

## Troubleshooting

### ❌ CORS Errors in Browser Console

**Error**: `Access to XMLHttpRequest at '...' from origin 'https://sam-composite-project-kvoi.vercel.app' has been blocked by CORS policy`

**Solution**:
1. Verify `CORS_ALLOWED_ORIGINS` in Railway includes: `https://sam-composite-project-kvoi.vercel.app`
2. Make sure there's no trailing slash in the URL
3. Restart your Railway service after adding the variable

### ❌ API Calls Going to localhost

**Error**: Network requests show `http://localhost:8080/api`

**Solution**:
1. Verify `VITE_API_BASE_URL` is set in Vercel environment variables
2. Make sure you redeployed after adding the variable
3. Clear browser cache and hard refresh (Ctrl+Shift+R)

### ❌ 404 or Connection Errors

**Error**: `Failed to fetch` or `Network Error`

**Solution**:
1. Verify your Railway backend URL is correct
2. Test the Railway URL directly in browser: `https://your-railway-url.railway.app/api/products`
3. Check Railway logs for errors
4. Verify Railway service is running

### ❌ Environment Variable Not Working

**Error**: Still using localhost URL

**Solution**:
1. Environment variables starting with `VITE_` must be set before build
2. You MUST redeploy after adding environment variables
3. Check Vercel build logs to verify the variable is being used
4. In Vercel, go to **Deployments** → Click on deployment → **Build Logs** to verify

## Quick Checklist

- [ ] Added `VITE_API_BASE_URL` in Vercel with your Railway backend URL
- [ ] Redeployed Vercel project after adding environment variable
- [ ] Added `CORS_ALLOWED_ORIGINS` in Railway with your Vercel URL
- [ ] Railway service redeployed after adding CORS variable
- [ ] Tested Vercel app and verified API calls work
- [ ] Checked browser console for errors
- [ ] Verified Network tab shows requests to Railway backend

## Need Your Railway URL?

If you don't know your Railway backend URL:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to **Settings** tab
4. Look for **Public Domain** or **Generate Domain**
5. Your URL will be something like: `https://your-service-name.up.railway.app`

## Example Configuration

**Vercel Environment Variable:**
```
VITE_API_BASE_URL=https://sam-composite-production.up.railway.app/api
```

**Railway Environment Variable:**
```
CORS_ALLOWED_ORIGINS=https://sam-composite-project-kvoi.vercel.app
```

## Still Having Issues?

1. **Check Vercel Build Logs**
   - Go to Vercel → Your Project → Deployments → Click deployment → Build Logs
   - Verify environment variables are being used

2. **Check Railway Logs**
   - Go to Railway → Your Service → Logs
   - Look for CORS or connection errors

3. **Test Backend Directly**
   - Open: `https://your-railway-url.railway.app/api/products` in browser
   - Should return JSON data (or error message, not 404)

4. **Verify CORS Configuration**
   - Check Railway variables include your Vercel URL exactly
   - No trailing slashes
   - Includes `https://` protocol

