import EventDetailClient from './EventDetailClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function generateStaticParams() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events?limit=1000`);
    const data = await response.json();
    const events = data.data ?? [];
    return events.map((event: {id: string}) => ({id: event.id}));
  } catch {
    return [];
  }
}

export default function EventDetailPage() {
  return <EventDetailClient />;
}
