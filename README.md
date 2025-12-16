#  Voice to Text Application

A modern **Voice-to-Text (Speech-to-Text)** web application built with **Next.js, TypeScript, and Deepgram AI**. This app allows users to record their voice directly from the browser and instantly convert speech into accurate text using AI.

##  Features

*  Real-time voice recording using browser microphone
*  AI-powered speech-to-text using **Deepgram (Nova-2 model)**
*  Fast and serverless backend with Next.js API Routes
*  Copy and download transcribed text
*  Clean, responsive UI with Tailwind CSS & shadcn/ui
*  Secure API handling (API key stays on server)

##  Tech Stack

### Frontend

* **TypeScript** – Type-safe development
* **React 19** – Component-based UI
* **Next.js 16 (App Router)** – Full-stack React framework
* **Tailwind CSS v4** – Utility-first styling
* **shadcn/ui** – Reusable UI components
* **Browser Media APIs** – `MediaRecorder`, `getUserMedia`

### Backend

* **Next.js API Routes** – Serverless backend
* **Deepgram API** – Speech-to-text AI (Nova-2)

## How It Works

1. User clicks the microphone button
2. Browser requests microphone permission
3. Audio is recorded using `MediaRecorder`
4. Audio is converted to Base64
5. Base64 audio is sent to `/api/transcribe`
6. Server forwards audio to Deepgram API
7. Deepgram processes and returns transcribed text
8. Text is displayed in the UI with copy/download options

## Project Structure

```bash
voicetotext/
├── app/                # App Router pages & layouts
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities & API helpers
├── public/             # Static assets
├── styles/             # Global styles
├── app/api/transcribe  # Speech-to-text API route
├── .gitignore
├── next.config.mjs
├── package.json
└── README.md
```

##  Environment Variables

Create a `.env.local` file in the root directory:

```env
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

Never expose your API key on the client side.


##  Getting Started

### 1️ Clone the repository

```bash
git clone https://github.com/bhavana9635/voicetotext.git
cd voicetotext
```

###  Install dependencies

```bash
npm install
# or
pnpm install
```

###  Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Deployment

Deployment Link : https://voicetotext-git-main-pes2ug22cs128s-projects.vercel.app


##  Author

**Bhavana Prakash Talavar**

* GitHub: [https://github.com/bhavana9635](https://github.com/bhavana9635)




