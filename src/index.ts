import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { initDatabase } from './models/index.js'
import apiRoutes from './routes/index.js'
import { seedBrands } from './seeders/seedBrands.js'
import { seedItems } from './seeders/seedItems.js'
import { seedContacts } from './seeders/seedContacts.js'
import { 
  clerkIdInjectorWithLogging, 
  performanceLogger
} from './middleware/index.js'

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(clerkMiddleware())

// Inject clerk ID into request and log all requests
app.use(clerkIdInjectorWithLogging)

// Performance logging middleware - logs execution time for all endpoints
app.use(performanceLogger)

app.use(cors())

// !! TODO: Setup CORS properly
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

// !! CORS setup - allow all origins for development
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200)
//   } else {
//     next()
//   }
// })

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
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
    
    // Seed initial data
    console.log('🌱 Starting data seeding...')
    if (process.env.NODE_ENV === 'development') {
      try {
        await seedContacts()
        console.log('✅ Contacts seeded successfully')
        
        await seedBrands()
        console.log('✅ Brands seeded successfully')
        
        await seedItems()
        console.log('✅ Items seeded successfully')
        
        console.log('🎉 All seeding completed successfully!')
      } catch (seedingError) {
        console.warn('⚠️  Seeding failed, but server will continue:', seedingError)
      }
    }
    
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
