# Deepansh Singh — Portfolio

Welcome to the source code for my personal portfolio website! This project is designed to showcase my skills, projects, and professional experience as a Web Developer and Engineering Student. 

It features a premium, non-neon dark theme ("Ice-Amethyst" palette), smooth micro-animations, a fully functioning contact form, and seamless deployment configuration for Vercel.

## 🌟 Features

- **Premium UI/UX**: Custom design system using CSS variables, featuring a sleek obsidian background, periwinkle and slate-blue gradients, and glassmorphic elements.
- **Interactive Elements**: Custom cursor blinking, typing effects, hover-glows on cards, and animated ambient background blobs.
- **Smooth Navigation**: Sticky navigation bar, scroll-spy highlights, mobile-friendly toggle menu, and a floating Back-to-Top button.
- **Dynamic Content**: Data is driven via local JSON files (`server/data/portfolio.json`), making it easy to update projects and skills.
- **Working Contact Form**: Built-in Node.js/Express backend integrated with `nodemailer` to send contact form submissions directly to your email, while keeping a backup in local JSON.
- **Serverless Ready**: Pre-configured `vercel.json` for effortless deployment on Vercel, separating static assets and the Express API serverless function.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla, Custom Properties, Animations), Vanilla JavaScript.
- **Backend**: Node.js, Express.js.
- **Packages**: `nodemailer` (for emails), `dotenv` (for environment variables), `cors`, `express`.
- **Deployment**: Configured for **Vercel** (Static + Serverless API).

## 🚀 Getting Started Locally

To run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/singhdeepansh235-cloud/PORTFOLIO.git
cd PORTFOLIO
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory. You will need a Google App Password to enable email delivery for the contact form.

```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password
PORT=3000
```
*(To generate an app password, go to your Google Account > Security > 2-Step Verification > App Passwords).*

### 4. Run the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`. 
- The frontend will be served at the root (`/`).
- The API endpoints are accessible at `/api/contact` and `/api/portfolio`.

## 🌐 Deploying to Vercel

This project is pre-configured for Vercel. 

1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add your `EMAIL_USER` and `EMAIL_PASS`.
5. Click **Deploy**. 

Vercel will automatically read `vercel.json`, treating the `public` folder as static files and `server/server.js` as a serverless function for API routes.

## 📂 Project Structure

```
PORTFOLIO/
├── public/                 # Static frontend assets
│   ├── css/                # Stylesheets (style.css, animations.css)
│   ├── images/             # Images and logos
│   ├── js/                 # Client-side scripts (main.js, particles.js)
│   ├── index.html          # Main HTML entry point
│   └── resume.pdf          # Generated PDF resume
├── server/                 # Express Backend
│   ├── data/               # Local JSON databases (portfolio.json, messages.json)
│   ├── routes/             # Express API routes (contact.js, portfolio.js)
│   └── server.js           # Main Express server file
├── .env                    # Environment variables (ignored in Git)
├── package.json            # NPM dependencies and scripts
└── vercel.json             # Vercel deployment configuration
```

## 📄 License

This project is licensed under the MIT License.