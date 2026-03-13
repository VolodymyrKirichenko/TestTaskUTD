import {Router, Request, Response} from 'express';
import {EventRegistration} from '@fullstack/shared';
import {supabase} from '../config/supabase';
import {registrationQueue} from '../queues/registration.queue';

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Get paginated list of events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Paginated events list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
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
  const email = (req.query.email as string) || '';

  let registeredEventIds: Set<string> = new Set();

  if (email && data?.length) {
    const {data: regs} = await supabase
      .from('registrations')
      .select('event_id')
      .eq('email', email)
      .in(
        'event_id',
        data.map((e) => e.id)
      );

    registeredEventIds = new Set((regs || []).map((r) => r.event_id));
  }

  res.json({
    data: (data || []).map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      shortDescription: e.short_description,
      isRegistered: registeredEventIds.has(e.id),
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Get event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: User email to check registration status
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Event'
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Event not found
 */
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

  const email = (req.query.email as string) || '';
  let isRegistered = false;

  if (email) {
    const {data: reg} = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', req.params.id)
      .eq('email', email)
      .single();

    isRegistered = !!reg;
  }

  res.json({
    data: {
      id: data.id,
      title: data.title,
      date: data.date,
      location: data.location,
      shortDescription: data.short_description,
      description: data.description,
      isRegistered,
    },
    success: true,
  });
});

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     tags: [Events]
 *     summary: Register for an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventRegistration'
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: Event not found
 *       409:
 *         description: Already registered
 */
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

  const {fullName, email, phone} = req.body as EventRegistration;

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

  if (process.env.REDIS_ENABLED === 'true') {
    try {
      await registrationQueue.add('process-registration', {
        eventId: req.params.id,
        fullName,
        email,
        phone,
      });
    } catch {
      // Redis unavailable — not critical
    }
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful',
  });
});

/**
 * @swagger
 * /api/events/{id}/register:
 *   delete:
 *     tags: [Events]
 *     summary: Unregister from an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Unregistered successfully
 *       400:
 *         description: Email is required
 *       404:
 *         description: Registration not found
 */
router.delete('/:id/register', async (req: Request, res: Response) => {
  const email = (req.query.email as string) || '';

  if (!email) {
    res.status(400).json({success: false, message: 'Email is required'});
    return;
  }

  const {data, error} = await supabase
    .from('registrations')
    .delete()
    .eq('event_id', req.params.id)
    .eq('email', email)
    .select()
    .single();

  if (error || !data) {
    res.status(404).json({success: false, message: 'Registration not found'});
    return;
  }

  res.json({
    success: true,
    message: 'Unregistered successfully',
  });
});

export default router;
