# My App

A modern React TypeScript application with real-time features, user authentication, and a responsive UI.

## Features

- 🔐 **Authentication System**
  - User login and registration
  - Password reset functionality
  - JWT-based authentication
  - Protected routes

- 👥 **User Management**
  - User profiles
  - User settings
  - User search functionality

- 💬 **Real-time Communication**
  - Chat system using Socket.IO
  - Real-time updates

- 🎨 **Modern UI/UX**
  - Responsive design
  - Bootstrap 5 integration
  - Modern icon sets (Font Awesome, Bootstrap Icons, React Icons)
  - Toast notifications for user feedback
  - Sidebar navigation

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: 
  - Bootstrap 5
  - React Bootstrap
  - MDB React UI Kit
- **HTTP Client**: Axios
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT (JSON Web Token)
- **Testing**: Jest, React Testing Library
- **Additional Libraries**:
  - React Toastify for notifications
  - Various security packages (crypto, jsonwebtoken)
  - Form validation with validator

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd my-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
REACT_APP_API_URL=your_api_url
# Add other environment variables as needed
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service functions
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
└── assets/        # Static assets (images, icons)
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React team for the amazing framework
- Bootstrap team for the UI components
- All other open-source contributors whose work is used in this project 

## Contact

- Email: nathanscott5467@gmail.com
