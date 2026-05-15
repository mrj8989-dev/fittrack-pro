import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useExerciseProgress } from '../hooks/useWorkoutSessions'
import { usePersonalRecords } from '../hooks/useWorkoutSessions'
import api from '../lib/api'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '0.5px solid var(--border)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 500, color: 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '4px' }}>{sub}</div>}
    </div>
  )
}

export default function ProgressPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('')
  const { data: records = [], isLoading: loadingRecords } = usePersonalRecords()
  const { data: exercises = [] } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => api.get('/exercises').then(r => r.data),
  })
  const { data: progress = [], isLoading: loadingProgress } = useExerciseProgress(selectedExerciseId)

  const selectedExercise = exercises.find((e: any) => e.id === selectedExerciseId)

  // Calcular stats del ejercicio seleccionado
  const maxWeight = progress.length > 0 ? Math.max(...progress.map((p: any) => p.weight || 0)) : 0
  const firstWeight = progress.length > 0 ? progress[0].weight || 0 : 0
  const improvement = maxWeight > 0 && firstWeight > 0
    ? (((maxWeight - firstWeight) / firstWeight) * 100).toFixed(1)
    : null
  const totalSessions = progress.length > 0
    ? [...new Set(progress.map((p: any) => p.date.split('T')[0]))].length
    : 0

  const chartData = progress.map((p: any) => ({
    fecha: new Date(p.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    peso: p.weight,
    volumen: p.volume,
    reps: p.reps,
  }))

  // Agrupar récords por grupo muscular
  const recordsByMuscle: Record<string, any[]> = {}
  records.forEach((r: any) => {
    const exercise = exercises.find((e: any) => e.id === r.exerciseId)
    const group = exercise?.muscleGroup || 'Otros'
    if (!recordsByMuscle[group]) recordsByMuscle[group] = []
    recordsByMuscle[group].push({ ...r, exerciseName: exercise?.name })
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Progreso
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Evolución de fuerza y volumen por ejercicio
        </p>
      </div>

      {/* SELECTOR DE EJERCICIO */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '0.5px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          Selecciona un ejercicio para ver su progreso
        </div>
        <select
          value={selectedExerciseId}
          onChange={e => setSelectedExerciseId(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg-primary)',
            border: '0.5px solid var(--border)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">— Elige un ejercicio —</option>
          {Object.entries(
            exercises.reduce((acc: any, ex: any) => {
              if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = []
              acc[ex.muscleGroup].push(ex)
              return acc
            }, {})
          ).map(([group, exs]: any) => (
            <optgroup key={group} label={group}>
              {exs.map((ex: any) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* GRÁFICAS DEL EJERCICIO SELECCIONADO */}
      {selectedExerciseId && (
        <>
          {loadingProgress ? (
            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
              Cargando progreso...
            </div>
          ) : progress.length === 0 ? (
            <div style={{
              background: 'var(--bg-secondary)',
              border: '0.5px solid var(--border)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}>
              <i className="ti ti-chart-line" style={{ fontSize: '32px', color: 'var(--text-tertiary)', display: 'block', marginBottom: '8px' }} aria-hidden="true" />
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Aún no hay datos para {selectedExercise?.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Registra sesiones con este ejercicio para ver tu progreso
              </div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                marginBottom: '1.5rem',
              }}>
                <StatCard label="Récord máximo" value={`${maxWeight} kg`} sub="peso levantado" />
                <StatCard label="Mejora total" value={improvement ? `+${improvement}%` : '—'} sub="desde el inicio" />
                <StatCard label="Sesiones" value={String(totalSessions)} sub="con este ejercicio" />
                <StatCard
                  label="Último registro"
                  value={progress.length > 0 ? `${progress[progress.length - 1].weight} kg` : '—'}
                  sub={progress.length > 0 ? new Date(progress[progress.length - 1].date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''}
                />
              </div>

              {/* Gráfica de peso */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Evolución del peso — {selectedExercise?.name}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(v: any) => [`${v} kg`, 'Peso']}
                    />
                    <ReferenceLine y={maxWeight} stroke="var(--accent-primary)" strokeDasharray="4 4" label={{ value: 'Récord', fill: 'var(--accent-primary)', fontSize: 11 }} />
                    <Line type="monotone" dataKey="peso" stroke="var(--accent-primary)" strokeWidth={2} dot={{ fill: 'var(--accent-primary)', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica de volumen */}
              <div style={{
                background: 'var(--bg-secondary)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Volumen por sesión (kg × reps) — {selectedExercise?.name}
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(v: any) => [`${v} kg`, 'Volumen']}
                    />
                    <Line type="monotone" dataKey="volumen" stroke="#7F77DD" strokeWidth={2} dot={{ fill: '#7F77DD', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </>
      )}

      {/* RÉCORDS POR GRUPO MUSCULAR */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Récords personales por grupo muscular
        </h2>

        {loadingRecords ? (
          <div style={{ color: 'var(--text-tertiary)', fontSize: '13px' }}>Cargando récords...</div>
        ) : records.length === 0 ? (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Aún no tienes récords. ¡Empieza a entrenar!
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
          }}>
            {Object.entries(recordsByMuscle).map(([group, recs]) => (
              <div key={group} style={{
                background: 'var(--bg-secondary)',
                border: '0.5px solid var(--border)',
                borderRadius: '12px',
                padding: '1.25rem',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  {group}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recs.map((rec: any) => {
                    const maxInGroup = Math.max(...recs.map((r: any) => r.maxWeight || 0))
                    const pct = maxInGroup > 0 ? ((rec.maxWeight || 0) / maxInGroup) * 100 : 0
                    return (
                      <div key={rec.exerciseId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                          <span
                            style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}
                            onClick={() => setSelectedExerciseId(rec.exerciseId)}
                          >
                            {rec.exerciseName || rec.exerciseId}
                          </span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {rec.maxWeight} kg
                          </span>
                        </div>
                        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                          <div style={{
                            height: '4px',
                            width: `${pct}%`,
                            background: 'var(--accent-primary)',
                            borderRadius: '2px',
                            transition: 'width 0.5s',
                          }} />
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '3px' }}>
                          {rec.reps} reps · {new Date(rec.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}