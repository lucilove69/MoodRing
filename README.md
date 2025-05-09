# MoodRing - A Modern Social Media Platform

MoodRing is a feature-rich social media platform built with React, TypeScript, and modern web technologies. It features a beautiful Frutiger Aero-inspired design, real-time interactions, and a comprehensive set of features for social networking.

## Features

### Core Features
- User authentication and authorization
- Real-time messaging and notifications
- Custom emoticon system
- Theme customization
- Privacy controls
- Responsive design

### Technical Features
- TypeScript for type safety
- React for UI components
- Context API for state management
- Custom hooks for reusable logic
- Form validation
- Error boundaries
- Loading states
- Security measures
- Keyboard shortcuts

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/moodring.git
cd moodring
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
project/
├── src/
│   ├── components/     # React components
│   ├── context/       # Context providers
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
└── package.json       # Project configuration
```

## Components

### Layout
The `Layout` component provides the main structure of the application, including:
- Responsive sidebar
- Top navigation
- Theme toggle
- Notification center
- Settings modal

### Authentication
The `Auth` component handles user authentication with:
- Login
- Registration
- Password recovery
- Form validation
- Error handling

### Notification Center
The `NotificationCenter` component manages notifications with:
- Real-time updates
- Browser notifications
- Notification types
- Read/unread states

### Error Boundary
The `ErrorBoundary` component provides graceful error handling:
- Catches runtime errors
- Displays user-friendly error messages
- Provides recovery options

### Loading
The `Loading` component shows loading states:
- Customizable sizes
- Full-screen option
- Loading text
- Smooth animations

## Utilities

### Hooks
- `useLocalStorage`: Persistent storage with type safety
- `useTheme`: Theme management
- `useOnlineStatus`: User presence tracking
- `useWindowSize`: Responsive layouts
- `useScrollPosition`: Scroll-based effects
- `useMediaQuery`: Responsive design
- `useKeyboardShortcut`: Keyboard navigation
- `useClipboard`: Copy/paste functionality
- `useNotifications`: Browser notifications
- `useFileUpload`: File handling
- `useAnimation`: Animation control

### Validation
The validation system provides:
- Form validation
- Field validation
- Common validation rules
- Custom validation rules
- Error messages

### Security
Security features include:
- Token management
- CSRF protection
- XSS prevention
- Input sanitization
- Password hashing
- Secure storage
- Rate limiting
- Content Security Policy
- Security headers

## Theme System

The theme system uses CSS variables for consistent styling:
- Light/dark mode
- Custom colors
- Typography
- Spacing
- Border radius
- Transitions
- Z-index layers
- Glassmorphism effects

## Keyboard Shortcuts

- `T`: Toggle theme
- `M`: Toggle sidebar
- `S`: Toggle settings
- `H`: Go to home
- `P`: Go to profile
- `N`: Go to notifications
- `C`: Go to messages

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Frutiger Aero design inspiration
- MySpace for emoticon inspiration
- React and TypeScript communities