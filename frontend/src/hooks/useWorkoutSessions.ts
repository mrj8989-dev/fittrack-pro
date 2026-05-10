import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export function useWorkoutSessions() {
  return useQuery({
    queryKey: ['workout-sessions'],
    queryFn: () => api.get('/workout-sessions').then(r => r.data),
  })
}

export function usePersonalRecords() {
  return useQuery({
    queryKey: ['personal-records'],
    queryFn: () => api.get('/workout-sessions/records').then(r => r.data),
  })
}

export function useExerciseProgress(exerciseId: string) {
  return useQuery({
    queryKey: ['progress', exerciseId],
    queryFn: () => api.get(`/workout-sessions/progress?exerciseId=${exerciseId}`).then(r => r.data),
    enabled: !!exerciseId,
  })
}