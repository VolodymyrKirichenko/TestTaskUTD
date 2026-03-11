import '@supabase/functions-js/edge-runtime.d.ts';
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

interface RegistrationPayload {
  type: 'INSERT';
  table: 'registrations';
  record: {
    id: string;
    event_id: string;
    full_name: string;
    email: string;
    phone: string;
    created_at: string;
  };
}

Deno.serve(async (req) => {
  try {
    const payload: RegistrationPayload = await req.json();
    const {record} = payload;

    console.log(
      `[Process Registration] New registration received: ${record.full_name} (${record.email}) for event ${record.event_id}`
    );

    // Simulate sending confirmation email
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log(`[Email] Confirmation email sent to ${record.email}`);

    // Fetch event details for logging
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const {data: event} = await supabase
      .from('events')
      .select('title, date')
      .eq('id', record.event_id)
      .single();

    if (event) {
      console.log(
        `[Process Registration] ${record.full_name} registered for "${event.title}" (${event.date})`
      );
    }

    console.log(
      `[Process Registration] Job completed successfully for registration ${record.id}`
    );

    return new Response(
      JSON.stringify({success: true, registrationId: record.id}),
      {headers: {'Content-Type': 'application/json'}}
    );
  } catch (err) {
    console.error('[Process Registration] Error:', err);
    return new Response(JSON.stringify({success: false, error: String(err)}), {
      status: 500,
      headers: {'Content-Type': 'application/json'},
    });
  }
});
