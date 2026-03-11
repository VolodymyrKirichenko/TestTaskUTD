import {Router, Request, Response} from 'express';
import {EventRegistration} from '@fullstack/shared';
import {supabase} from '../config/supabase';

const router = Router();

// GET /api/events
router.get('/', async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  );
  const search = (req.query.search as string) || '';
  const dateFrom = (req.query.dateFrom as string) || '';
  const dateTo = (req.query.dateTo as string) || '';

  let query = supabase
    .from('events')
    .select('id, title, date, location, short_description', {count: 'exact'});

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  if (dateFrom) {
    query = query.gte('date', dateFrom);
  }

  if (dateTo) {
    query = query.lte('date', dateTo);
  }

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const {data, count, error} = await query
    .order('date', {ascending: true})
    .range(start, end);

  if (error) {
    res.status(500).json({success: false, message: error.message});
    return;
  }

  const total = count || 0;

  res.json({
    data: (data || []).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      shortDescription: e.short_description,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

// GET /api/events/:id
router.get('/:id', async (req: Request, res: Response) => {
  const {data, error} = await supabase
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) {
    res.status(404).json({success: false, message: 'Event not found'});
    return;
  }

  res.json({
    data: {
      id: data.id,
      title: data.title,
      date: data.date,
      location: data.location,
      shortDescription: data.short_description,
      description: data.description,
    },
    success: true,
  });
});

// POST /api/events/:id/register
router.post('/:id/register', async (req: Request, res: Response) => {
  const {data: event} = await supabase
    .from('events')
    .select('id')
    .eq('id', req.params.id)
    .single();

  if (!event) {
    res.status(404).json({success: false, message: 'Event not found'});
    return;
  }

  const {fullName, email, phone, password} = req.body as EventRegistration;

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

  if (!password || password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters',
    });
    return;
  }

  // Check duplicate registration for this event
  const {data: existing} = await supabase
    .from('registrations')
    .select('id')
    .eq('event_id', req.params.id)
    .eq('email', email)
    .single();

  if (existing) {
    res.status(409).json({
      success: false,
      message: 'You are already registered for this event',
    });
    return;
  }

  // Create Supabase Auth user (or skip if already exists)
  const {data: authData, error: authError} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {full_name: fullName},
    },
  });

  if (authError && !authError.message.includes('already registered')) {
    res.status(400).json({success: false, message: authError.message});
    return;
  }

  const userId = authData?.user?.id;

  const {error} = await supabase.from('registrations').insert({
    event_id: req.params.id,
    full_name: fullName,
    email,
    phone,
  });

  if (error) {
    res.status(500).json({success: false, message: error.message});
    return;
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: {
        id: userId || '',
        fullName,
        email,
      },
    },
  });
});

export default router;
