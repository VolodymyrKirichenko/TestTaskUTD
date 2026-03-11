-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: calls Edge Function on new registration
CREATE OR REPLACE FUNCTION notify_registration()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://duzdzqflwyonmzmggtyd.supabase.co/functions/v1/process-registration'::text,
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1emR6cWZsd3lvbm16bWdndHlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzIyNTQ5MSwiZXhwIjoyMDg4ODAxNDkxfQ.KqFstLRYPDq4jGRLtCLXTeTxFvatcLClvMr9jgTaR44"}'::jsonb,
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', 'registrations',
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: fires after each new registration insert
DROP TRIGGER IF EXISTS on_registration_insert ON registrations;
CREATE TRIGGER on_registration_insert
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_registration();
