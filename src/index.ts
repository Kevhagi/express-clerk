import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { initDatabase } from './models'
import apiRoutes from './routes'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware())

// !! TODO: Setup CORS properly
app.use(cors())
// const allowedOrigins = [
//   'http://localhost:3000', // Next.js local dev
//   'https://yourdomain.com' // Production domain
// ];
// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // needed if using cookies/auth headers
// }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Homepage
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Clerk Express Quickstart with Sequelize!',
    endpoints: {
      dashboard: '/api/dashboard',
      users: '/api/users',
      contacts: '/api/contacts',
      brands: '/api/brands',
      items: '/api/items',
      expenseTypes: '/api/expense-types',
      transactions: '/api/transactions',
      transactionItems: '/api/transaction-items',
      transactionExpenses: '/api/transaction-expenses'
    }
  })
})

// API routes
app.use('/api', apiRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection and sync models
    await initDatabase()
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at port ${PORT}`)
      console.log(`💾 Database connected and models synchronized`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
