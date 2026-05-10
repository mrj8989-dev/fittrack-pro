import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

export function useStartSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { workoutId: string; notes?: string }) =>
      api.post('/workout-sessions', data).then(r => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workout-sessions'] }),
  })
}

export function useAddSet() {
  return useMutation({
    mutationFn: ({ sessionId, data }: {
      sessionId: string
      data: { exerciseId: string; setNumber: number; reps?: number; weight?: number; completed: boolean }
    }) => api.post(`/workout-sessions/${sessionId}/sets`, data).then(r => r.data),
  })
}

export function useCompleteSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) =>
      api.put(`/workout-sessions/${sessionId}/complete`, {}).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-sessions'] })
      queryClient.invalidateQueries({ queryKey: ['personal-records'] })
    },
  })
}