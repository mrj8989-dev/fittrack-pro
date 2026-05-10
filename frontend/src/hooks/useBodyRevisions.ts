import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

export function useBodyRevisions() {
  return useQuery({
    queryKey: ['body-revisions'],
    queryFn: () => api.get('/body-revisions').then(r => r.data),
  })
}

export function useNextRevision() {
  return useQuery({
    queryKey: ['next-revision'],
    queryFn: () => api.get('/body-revisions/next-revision').then(r => r.data),
  })
}

export function useWeightProgress() {
  return useQuery({
    queryKey: ['weight-progress'],
    queryFn: () => api.get('/body-revisions/progress').then(r => r.data),
  })
}