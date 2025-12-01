# Domicilia

A full-stack application with Next.js frontend and MERN backend.

## Project Structure

```
domicilia/
├── frontend/     # Next.js application
└── backend/      # Express/Node.js server
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string if needed.

5. Make sure MongoDB is running on your system.

6. Start the server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

## Technologies

### Frontend
- Next.js 14
- React 18
- TypeScript

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- CORS

