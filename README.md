# Civil Engineer Website

A comprehensive, professional website for a civil engineer specializing in construction services and real estate development. Built with React, TypeScript, and Firebase.

## Features

### 🌐 Public Website
- **Modern Homepage** with hero section, featured properties, and services overview
- **About Page** showcasing engineer's profile, experience, and certifications
- **Services Page** with construction services and process details
- **Properties Page** with advanced filtering and search capabilities
- **Property Detail Pages** with image galleries and contact integration
- **Projects Gallery** showing ongoing and completed projects with progress tracking
- **Contact Page** with form submission, Google Maps, and WhatsApp integration

### 🔐 Admin Panel
- **Dashboard** with statistics and overview
- **Property Management** - Add, edit, delete properties
- **Contact Management** - View and manage inquiries
- **Firebase Integration** for real-time data management

### 🚀 Technical Features
- **Responsive Design** optimized for all devices
- **Firebase Integration** (Firestore, Auth, Storage)
- **WhatsApp Integration** for instant communication
- **Google Maps Integration** for location display
- **SEO Optimized** with proper meta tags and structure
- **Modern UI/UX** with smooth animations and micro-interactions

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Setup Instructions

### 1. Firebase Configuration
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - **Firestore Database**
   - **Authentication** (Email/Password)
   - **Storage**
3. Replace the Firebase config in `src/firebase/config.js` with your project credentials

### 2. Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Firebase Setup
1. **Authentication**: Create an admin user in Firebase Auth
2. **Firestore**: Create a user document with `isAdmin: true`
3. **Database Collections**:
   - `plots`: Properties and plots data
   - `services`: Construction services
   - `projects`: Project portfolio
   - `contacts`: Contact form submissions
   - `users`: User authentication data

### 4. Admin Access
- Visit `/admin-login` to access the admin panel
- Use your Firebase admin credentials to log in

## Database Structure

### Collections:
- **plots**: `{ title, price, area, location, images[], status, description, type }`
- **services**: `{ title, description, iconUrl }`
- **projects**: `{ name, status, progress, images[], description, location }`
- **contacts**: `{ name, email, phone, message, timestamp }`
- **users**: `{ uid, email, isAdmin }`

## Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
The built files in `dist/` can be deployed to any static hosting service.

## Customization

### WhatsApp Number
Update the phone number in:
- `src/components/WhatsAppButton.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/PropertyDetailPage.tsx`

### Contact Information
Update contact details in:
- `src/components/Footer.tsx`
- `src/pages/ContactPage.tsx`

### Google Maps
Replace the Google Maps embed URL in `src/pages/ContactPage.tsx` with your actual location.

## Features in Detail

### Property Management
- Add/edit/delete properties
- Image upload and management
- Status tracking (available/sold)
- Advanced filtering and search

### Contact System
- Contact form with Firebase integration
- WhatsApp integration for instant messaging
- Email notifications
- Admin dashboard for managing inquiries

### Project Gallery
- Showcase completed and ongoing projects
- Progress tracking
- Before/after image galleries
- Project status management

### SEO & Performance
- Optimized meta tags
- Responsive images
- Fast loading times
- Mobile-first design
- Clean URL structure

## Support

For support and customization requests, please contact the development team.

---

Built with ❤️ for professional civil engineering services.