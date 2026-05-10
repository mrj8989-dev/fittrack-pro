import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export function useWorkoutPlans() {
  return useQuery({
    queryKey: ['workout-plans'],
    queryFn: () => api.get('/workout-plans').then(r => r.data),
  })
}