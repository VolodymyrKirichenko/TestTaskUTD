import {Router, Request, Response} from 'express';
import {supabase} from '../config/supabase';

const router = Router();

// POST /api/auth/register
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

// POST /api/auth/login
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
