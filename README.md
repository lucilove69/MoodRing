# MySpace 2005 Clone

A nostalgic recreation of the classic MySpace social network from 2005, built with modern web technologies.

## Features

- User registration and authentication
- Customizable profile pages with HTML/CSS editor (like original MySpace)
- Friends system with the iconic Top 8 friends feature
- Music player with iframe integration
- Bulletin board system
- Comments sections on profiles
- Profile visitor counter and stats

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js with Express
- **Database:** LowDB (JSON file-based database)
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev:all
   ```
   This will start both the frontend (Vite) and backend (Express) servers.

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
JWT_SECRET=yoursecretkey
PORT=3001
```

## Default User

The system comes with a default "Tom" user (MySpace's co-founder who was everyone's first friend):
- Email: tom@myspace.com
- Password: password

## Project Structure

- `/src` - Frontend React application
- `/server` - Backend Express server
- `/public` - Static assets including images and fonts

## License

This project is for educational purposes only. MySpace is a registered trademark of its respective owners.