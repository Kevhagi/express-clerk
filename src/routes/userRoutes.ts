import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { clerkClient, getAuth, requireAuth } from '@clerk/express'

const router = Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

// Use requireAuth() to protect this route
// If user is not authenticated, requireAuth() will redirect back to the homepage
router.get('/protected', requireAuth(), async (req, res) => {
  // Use `getAuth()` to get the user's `userId`
  // or you can use `req.auth`
  const { userId } = getAuth(req)

  // Use Clerk's JavaScript Backend SDK to get the user's User object
  const user = await clerkClient.users.getUser(userId)

  res.json({ user })
})

// Assuming you have a template engine installed and are using a Clerk JavaScript SDK on this page
router.get('/sign-in', (req, res) => {
  res.render('sign-in')
})

export default router;
