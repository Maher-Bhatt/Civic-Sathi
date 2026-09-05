import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { API_BASE_URL } from '../services/api';

export function useLiveEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sse = new EventSource(`${API_BASE_URL}/api/v1/events`);

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_COMPLAINT' || data.type === 'STATUS_UPDATE') {
          queryClient.invalidateQueries({ queryKey: ['muni_complaints'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard_kpis'] });
          queryClient.invalidateQueries({ queryKey: ['live_activity'] });
          queryClient.invalidateQueries({ queryKey: ['systemic_issues'] });
          
          if (data.type === 'NEW_COMPLAINT') {
            toast.info(`New complaint received: ${data.category || 'General'}`);
          }
        }
      } catch (err) {
        console.error('Error parsing SSE event data', err);
      }
    };

    sse.onerror = (err) => {
      console.error('SSE Error:', err);
    };

    return () => {
      sse.close();
    };
  }, [queryClient]);
}
