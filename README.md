# PCMI - Meet

A full-featured React Native video calling application built with Expo, Firebase Authentication, and Stream SDK.

## Features

### 🔐 Authentication
- Email/password signup and login
- Secure session management
- Password reset functionality
- User profile management

### 📹 Video Calling
- One-on-one video calls
- Group video conferencing
- Audio-only calls
- Camera toggle (front/back)
- Mute/unmute audio
- Speaker phone toggle
- Screen sharing capability
- In-call chat functionality

### 👥 Contact Management
- Contact list with online status
- Search functionality
- Quick call actions
- Contact status indicators

### 📱 User Interface
- Clean, modern design
- Dark/Light theme support
- Responsive layout for all devices
- Smooth animations and transitions
- Material Design principles

### 📊 Call History
- Complete call history tracking
- Filter by call type (video/audio/missed)
- Search through call history
- Call duration tracking
- Retry calls from history

### ⚙️ Settings
- Profile management
- Theme toggle
- Notification preferences
- Audio/video settings
- Privacy controls

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **Firebase** - Authentication and backend services
- **Stream SDK** - Real-time video calling
- **TypeScript** - Type safety and better developer experience
- **Zustand** - State management
- **Lucide React Native** - Icon library

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/pcmi-meet.git
cd pcmi-meet
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your Firebase and Stream credentials:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_STREAM_API_KEY=your_stream_api_key
```

5. Start the development server:
```bash
npm run dev
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Get your Firebase configuration and update the `.env` file
4. Configure security rules for your project

## Stream Setup

1. Create a Stream account at [Stream.io](https://getstream.io/)
2. Create a new Video & Audio app
3. Get your API key and update the `.env` file
4. Configure your Stream app settings

## Project Structure

```
app/
├── (auth)/          # Authentication screens
├── (tabs)/          # Main app tabs
├── call/            # Video calling screens
├── _layout.tsx      # Root layout
└── +not-found.tsx   # 404 screen

context/
├── AuthContext.tsx     # Authentication context
├── StreamContext.tsx   # Stream SDK context
└── ThemeContext.tsx    # Theme management

types/
└── env.d.ts         # Environment type definitions
```

## Building for Production

### Web
```bash
npm run build:web
```

### Mobile
For mobile builds, you'll need to eject from Expo managed workflow or use EAS Build:

```bash
npx eas build --platform ios
npx eas build --platform android
```

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Security

- All API keys should be stored securely
- Use Firebase Security Rules for data protection
- Implement proper authentication checks
- Regular security audits recommended

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the development team.