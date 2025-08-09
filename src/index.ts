import 'dotenv/config'
import express from 'express'
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from '@clerk/express'
import { initDatabase } from './models'
import apiRoutes from './routes'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Homepage
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Clerk Express Quickstart with Sequelize!',
    endpoints: {
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

// Use requireAuth() to protect this route
// If user is not authenticated, requireAuth() will redirect back to the homepage
app.get('/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  // or you can use `req.auth`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  res.json({ user })
})

// Assuming you have a template engine installed and are using a Clerk JavaScript SDK on this page
app.get('/sign-in', (req, res) => {
  res.render('sign-in')
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
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
      console.log(`🚀 Server running at http://localhost:${PORT}`)
      console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
      console.log(`💾 Database connected and models synchronized`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
