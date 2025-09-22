# Environment Setup Guide

## Required Environment Variables

To make the chatbot work properly, you need to create a `.env.local` file in your project root with the following variables:

### 1. Create `.env.local` file

Create a file named `.env.local` in the root directory of your project (same level as `package.json`):

```bash
# Gemini API Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# MongoDB Configuration (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/nabha-care

# NextAuth Configuration (if using authentication)
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Replace `your_actual_gemini_api_key_here` in `.env.local` with your actual API key

### 3. Example `.env.local` file

```bash
# Gemini API Configuration
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nabha-care

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Important Notes

- **Never commit `.env.local` to version control** - it's already in `.gitignore`
- **Restart your development server** after adding environment variables
- **The API key should start with `AIzaSy`** for Gemini API
- **Make sure there are no spaces** around the `=` sign

### 5. Verify Setup

After setting up the environment variables:

1. Restart your development server: `npm run dev`
2. Open the browser console (F12)
3. Try sending a message in the chatbot
4. You should see logs like:
   - `✅ Gemini API key loaded successfully`
   - `🔄 Calling Gemini API...`
   - `✅ Gemini API response received`

### 6. Troubleshooting

If you see errors:

- **"GEMINI_API_KEY environment variable is not set"**: Check your `.env.local` file exists and has the correct variable name
- **"API authentication error"**: Your API key might be invalid or expired
- **"API quota exceeded"**: You've hit the free tier limit (50 requests/day)

### 7. Production Deployment

For production deployment, set these environment variables in your hosting platform:

- **Vercel**: Add in Project Settings > Environment Variables
- **Netlify**: Add in Site Settings > Environment Variables
- **Railway**: Add in Project Settings > Variables

## Security Best Practices

1. **Never expose API keys** in client-side code
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** to avoid unexpected charges
5. **Set up API key restrictions** in Google Cloud Console if needed
