 # QuickBook App
 
 Dormitory booking management system.
 
 Tech Stack:
 - Frontend: React.js with Material-UI
 - Backend: Node.js with Express.js
 - Database: PostgreSQL with Sequelize ORM
 - Authentication: JWT tokens
 - Real-time: Socket.io
 - File Upload: Multer
 
 ## Setup
### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file (see `.env.example`).
4. Seed the database (creates tables & seed data):
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm start
   ```
 
 ### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
 
 ## Project Structure
 ```
 quickbook-app/
 ├── backend/
 │   ├── config/
 │   ├── controllers/
 │   ├── middleware/
 │   ├── models/
 │   ├── routes/
 │   ├── uploads/
 │   ├── utils/
 │   └── server.js
 ├── frontend/
 │   ├── public/
 │   └── src/
 │       ├── components/
 │       │   ├── Auth/
 │       │   ├── Dashboard/
 │       │   ├── Booking/
 │       │   ├── Profile/
 │       │   ├── Admin/
 │       │   └── Common/
 │       ├── pages/
 │       ├── hooks/
 │       ├── context/
 │       ├── utils/
 │       └── styles/
 └── README.md
 ```
 
 ## Next Steps
 Proceed to Phase 2: Database setup and model creation.