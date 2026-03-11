import {Router, Request, Response} from 'express';
import {supabase} from '../config/supabase';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterBody'
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 */
router.post('/register', async (req: Request, res: Response) => {
  const {email, password, fullName} = req.body as {
    email?: string;
    password?: string;
    fullName?: string;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({success: false, message: 'Valid email is required'});
    return;
  }

  if (!password || password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
    return;
  }

  if (!fullName || !fullName.trim()) {
    res.status(400).json({success: false, message: 'Full name is required'});
    return;
  }

  const {data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {full_name: fullName},
    },
  });

  if (error) {
    res.status(400).json({success: false, message: error.message});
    return;
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: data.user!.id,
        fullName,
        email: data.user!.email!,
      },
      accessToken: data.session?.access_token,
    },
  });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginBody'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request, res: Response) => {
  const {email, password} = req.body as {email?: string; password?: string};

  if (!email || !password) {
    res
      .status(400)
      .json({success: false, message: 'Email and password are required'});
    return;
  }

  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    res
      .status(401)
      .json({success: false, message: 'Invalid email or password'});
    return;
  }

  const fullName = data.user.user_metadata?.full_name || '';

  res.json({
    success: true,
    data: {
      user: {
        id: data.user.id,
        fullName,
        email: data.user.email!,
      },
      accessToken: data.session.access_token,
    },
  });
});

export default router;
