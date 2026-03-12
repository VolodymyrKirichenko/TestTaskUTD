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
 *       409:
 *         description: Email already registered
 */
router.post('/register', async (req: Request, res: Response) => {
  const {email, fullName, phone} = req.body as {
    email?: string;
    fullName?: string;
    phone?: string;
  };

  if (!fullName || !fullName.trim()) {
    res.status(400).json({success: false, message: 'Full name is required'});
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({success: false, message: 'Valid email is required'});
    return;
  }

  if (!phone || !phone.trim()) {
    res.status(400).json({success: false, message: 'Phone is required'});
    return;
  }

  const {data: existing} = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    res.status(409).json({success: false, message: 'Email already registered'});
    return;
  }

  const {data, error} = await supabase
    .from('profiles')
    .insert({full_name: fullName, email, phone})
    .select()
    .single();

  if (error) {
    res.status(500).json({success: false, message: error.message});
    return;
  }

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: data.id,
        fullName,
        email,
        phone,
      },
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
 *         description: Missing email
 *       404:
 *         description: User not found
 */
router.post('/login', async (req: Request, res: Response) => {
  const {email} = req.body as {email?: string};

  if (!email) {
    res.status(400).json({success: false, message: 'Email is required'});
    return;
  }

  const {data, error} = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    res.status(404).json({success: false, message: 'User not found'});
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
      },
    },
  });
});

export default router;
