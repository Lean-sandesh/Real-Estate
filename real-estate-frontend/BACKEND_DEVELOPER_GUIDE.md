# Real Estate Frontend - Backend Developer Guide

This guide provides all the necessary information for backend developers to work with the real estate frontend application.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB Atlas account

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-estate-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the following environment variables:
     ```
     VITE_MONGODB_URI=your_mongodb_atlas_connection_string
     VITE_API_URL=http://localhost:5000/api  # Update with your backend URL
     ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Integration

The frontend is set up to communicate with the following API endpoints:

### Properties
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/properties/:id/images` - Upload property images

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## State Management

The application uses React Context for state management. The main context (`AppContext`) provides:
- User authentication state
- Property listing and management
- Loading and error states

## Directory Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── context/       # React context providers
├── pages/         # Page components
├── services/      # API service layer
└── utils/         # Utility functions
```

## Development Workflow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The application will be available at `http://localhost:5173`

3. For backend development, ensure your API server is running at the URL specified in `VITE_API_URL`

## Best Practices

1. **Environment Variables**
   - Keep sensitive information in `.env`
   - Never commit `.env` to version control

2. **API Integration**
   - Use the provided service layer (`services/`) for all API calls
   - Handle errors appropriately in the UI

3. **State Management**
   - Use the context API for global state
   - Keep component-specific state local to the component

## Support

For any questions or issues, please contact the development team.
