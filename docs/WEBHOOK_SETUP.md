# Webhook Auto-Update Setup

This guide helps you set up automatic webhook URL updates when your server restarts.

## 🚀 Quick Setup

### 1. Add Required Environment Variables

Add these to your `.env` file:

```env
# Required for automatic webhook updates
VAPI_ASSISTANT_ID=your-assistant-id-here
NEXT_PUBLIC_WEBHOOK_URL=https://your-cloudflare-url.trycloudflare.com
VAPI_API_KEY=your-vapi-api-key-here
```

### 2. Use the New Scripts

Instead of `npm run dev`, use:

```bash
# For development
npm run dev:webhook

# For production
npm run start:webhook
```

## 🔄 How It Works

1. **Script starts** → Updates VAPI webhook URL
2. **Server starts** → Your app is ready with updated webhooks
3. **Every restart** → Webhook URL is automatically updated

## 📋 What You Need

- **VAPI_ASSISTANT_ID**: Your VAPI assistant ID
- **NEXT_PUBLIC_WEBHOOK_URL**: Your current tunnel URL (Cloudflare, ngrok, etc.)
- **VAPI_API_KEY**: Your VAPI API key

## 🛠️ Manual Update (if needed)

```bash
npm run update-webhook your-assistant-id https://new-url.trycloudflare.com
```

## ✅ Benefits

- ✅ **Automatic**: No manual webhook updates needed
- ✅ **Reliable**: Webhook URL always matches your current tunnel
- ✅ **Easy**: Just use `npm run dev:webhook` instead of `npm run dev`
- ✅ **Safe**: Falls back gracefully if webhook update fails
