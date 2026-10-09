# Ecovion 🌿

Ecovion is a modern, responsive web application focused on showcasing smart material systems for sustainable agriculture and environmental innovation. This project represents a complete frontend redesign seamlessly integrated with a powerful backend infrastructure to provide a beautiful, scalable experience.

## Key Features

- **Modern UI/UX**: Built with React and tailored with custom CSS for a premium aesthetic, featuring smooth interactions, fluid typography, and clean layouts.
- **Client-Side Rendering (CSR)**: Powered by Vite and TanStack Router for ultra-fast, snappy page transitions.
- **Advanced Markdown Blog Engine**: A robust editorial journal powered by `react-markdown` and `remark-gfm` that natively renders tables, nested lists, blockquotes, and dynamic typography directly from Markdown.
- **Dynamic Content Management (CMS)**: A custom-built Admin Dashboard allowing authorized users to seamlessly add, edit, and manage articles.
- **Role-Based Authentication**: Secure Admin portal protected via Firebase Authentication, cross-referenced with a secure Firestore `members` registry to restrict unauthorized access.
- **Featured Content Engine**: An intelligent database system that dynamically promotes designated articles to the top of the journal or automatically falls back to the latest publication.
- **Vercel Serverless Architecture**: Leverages Vercel serverless functions (`api/og-preview.js`) and edge routing to dynamically inject Open Graph `<meta>` tags into the Single Page Application (SPA), ensuring pixel-perfect previews on Twitter, LinkedIn, and WhatsApp.
- **Web Share API**: Native device-level sharing integration with graceful clipboard fallbacks.

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="TanStack Router" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</p>

## Getting Started

To run this project locally on your machine, you'll need [Node.js](https://nodejs.org/) installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Bangadhipati/ecovion
   cd ecovion
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Firebase and Cloudinary configuration:
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   VITE_FIREBASE_PROJECT_ID="..."
   VITE_FIREBASE_STORAGE_BUCKET="..."
   VITE_FIREBASE_MESSAGING_SENDER_ID="..."
   VITE_FIREBASE_APP_ID="..."
   VITE_FIREBASE_MEASUREMENT_ID="..."
   VITE_CLOUDINARY_CLOUD_NAME="..."
   VITE_CLOUDINARY_UPLOAD_PRESET="..."
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Development Credits

Designed and Developed by **Debarghya Bhowmick** as part of an internship project.
