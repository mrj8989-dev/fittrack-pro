import { useState, useEffect, useRef } from 'react'
import { useWorkoutPlans } from '../hooks/useWorkoutPlans'
import { useStartSession, useAddSet, useCompleteSession } from '../hooks/useWorkoutSession'
import { useNavigate } from 'react-router-dom'

interface SetLog {
  exerciseId: string
  setNumber: number
  weight: number | ''
  reps: number | ''
  completed: boolean
}

function RestTimer({ seconds, onDone }: { seconds: number; onDone: () => void }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) { onDone(); return }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining])

  const pct = (remaining / seconds) * 100

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      background: 'var(--bg-secondary)',
      border: '0.5px solid var(--accent-primary)',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      zIndex: 100,
      minWidth: '180px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        ⏱ Descanso
      </div>
      <div style={{ fontSize: '36px', fontWeight: 500, color: remaining <= 10 ? '#E24B4A' : 'var(--accent-primary)', marginBottom: '8px', textAlign: 'center' }}>
        {String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}
      </div>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
        <div style={{
          height: '4px',
          width: `${pct}%`,
          background: remaining <= 10 ? '#E24B4A' : 'var(--accent-primary)',
          borderRadius: '2px',
          transition: 'width 1s linear',
        }} />
      </div>
      <button
        onClick={onDone}
        style={{
          marginTop: '10px', width: '100%',
          padding: '6px',
          background: 'transparent',
          border: '0.5px solid var(--border)',
          borderRadius: '8px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Saltar
      </button>
    </div>
  )
}

export default function WorkoutPage() {
  const navigate = useNavigate()
  const { data: plans = [], isLoading } = useWorkoutPlans()
  const startSession = useStartSession()
  const addSet = useAddSet()
  const completeSession = useCompleteSession()

  const [phase, setPhase] = useState<'select' | 'active' | 'done'>('select')
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sets, setSets] = useState<Record<string, SetLog[]>>({})
  const [restTimer, setRestTimer] = useState<{ seconds: number; active: boolean }>({ seconds: 0, active: false })
  const [notes, setNotes] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<any>(null)

  // Cronómetro de sesión
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const formatElapsed = () => {
    const m = Math.floor(elapsed / 60)
    const s = elapsed % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const initSets = (workout: any) => {
    const initial: Record<string, SetLog[]> = {}
    workout.exercises?.forEach((we: any) => {
      initial[we.exerciseId] = Array.from({ length: we.sets }, (_, i) => ({
        exerciseId: we.exerciseId,
        setNumber: i + 1,
        weight: '',
        reps: we.reps || '',
        completed: false,
      }))
    })
    return initial
  }

  const handleSelectWorkout = async (workout: any) => {
    const session = await startSession.mutateAsync({ workoutId: workout.id })
    setSessionId(session.id)
    setSelectedWorkout(workout)
    setSets(initSets(workout))
    setPhase('active')
  }

  const handleSetChange = (exerciseId: string, setIdx: number, field: 'weight' | 'reps', value: string) => {
    setSets(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === setIdx ? { ...s, [field]: value === '' ? '' : Number(value) } : s
      )
    }))
  }

  const handleCompleteSet = async (exerciseId: string, setIdx: number, restTime: number) => {
    if (!sessionId) return
    const set = sets[exerciseId][setIdx]
    await addSet.mutateAsync({
      sessionId,
      data: {
        exerciseId,
        setNumber: set.setNumber,
        reps: set.reps === '' ? undefined : Number(set.reps),
        weight: set.weight === '' ? undefined : Number(set.weight),
        completed: true,
      }
    })
    setSets(prev => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((s, i) =>
        i === setIdx ? { ...s, completed: true } : s
      )
    }))
    if (restTime > 0) setRestTimer({ seconds: restTime, active: true })
  }

  const handleFinish = async () => {
    if (!sessionId) return
    await completeSession.mutateAsync(sessionId)
    setPhase('done')
    clearInterval(timerRef.current)
  }

  const completedSets = Object.values(sets).flat().filter(s => s.completed).length
  const totalSets = Object.values(sets).flat().length

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>Cargando...</div>
    </div>
  )

  // FASE: SELECCIONAR WORKOUT
  if (phase === 'select') return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
        ¿Qué entrenamos hoy?
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Selecciona el workout de tu plan
      </p>

      {plans.length === 0 ? (
        <div style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>
          No tienes planes de entrenamiento. Crea uno primero.
        </div>
      ) : (
        plans.map((plan: any) => (
          <div key={plan.id} style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              {plan.name}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plan.workouts?.map((workout: any) => (
                <button
                  key={workout.id}
                  onClick={() => handleSelectWorkout(workout)}
                  disabled={startSession.isPending}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-secondary)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(29,158,117,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="ti ti-barbell" style={{ fontSize: '20px', color: 'var(--accent-primary)' }} aria-hidden="true" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {workout.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {workout.exercises?.length || 0} ejercicios · {['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][workout.dayOfWeek || 0]}
                    </div>
                  </div>
                  <i className="ti ti-arrow-right" style={{ fontSize: '18px', color: 'var(--text-tertiary)' }} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )

  // FASE: SESIÓN ACTIVA
  if (phase === 'active') return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* Header sesión */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px',
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {selectedWorkout?.name}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            ⏱ {formatElapsed()} · {completedSets}/{totalSets} series completadas
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            padding: '6px 14px',
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}>
            {Math.round((completedSets / Math.max(totalSets, 1)) * 100)}% completado
          </div>
          <button
            onClick={handleFinish}
            disabled={completeSession.isPending}
            style={{
              padding: '6px 16px',
              background: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* Barra de progreso */}
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', marginBottom: '1.5rem' }}>
        <div style={{
          height: '4px',
          width: `${(completedSets / Math.max(totalSets, 1)) * 100}%`,
          background: 'var(--accent-primary)',
          borderRadius: '2px',
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Ejercicios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {selectedWorkout?.exercises?.map((we: any) => {
          const exerciseSets = sets[we.exerciseId] || []
          const allDone = exerciseSets.every(s => s.completed)

          return (
            <div key={we.exerciseId} style={{
              background: 'var(--bg-secondary)',
              border: `0.5px solid ${allDone ? 'var(--accent-primary)' : 'var(--border)'}`,
              borderRadius: '12px',
              padding: '1.25rem',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                {allDone && (
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <i className="ti ti-check" style={{ fontSize: '12px', color: '#fff' }} aria-hidden="true" />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {we.exercise?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {we.sets} series · {we.reps} reps · {we.restTime}s descanso
                  </div>
                </div>
                    {we.exercise?.videoUrl && (
                    
                    <a href={we.exercise.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: '18px' }}
                    >
                        <i className="ti ti-brand-youtube" aria-hidden="true" />
                    </a>
                    )}
              </div>

              {/* Cabecera tabla */}
              <div style={{
                display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px',
                gap: '8px', marginBottom: '6px',
                fontSize: '11px', color: 'var(--text-tertiary)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                <span>Serie</span>
                <span>Peso (kg)</span>
                <span>Reps</span>
                <span></span>
              </div>

              {/* Series */}
              {exerciseSets.map((set, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px',
                  gap: '8px', marginBottom: '6px', alignItems: 'center',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: set.completed ? 'var(--accent-primary)' : 'var(--bg-primary)',
                    border: `0.5px solid ${set.completed ? 'var(--accent-primary)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 500,
                    color: set.completed ? '#fff' : 'var(--text-secondary)',
                  }}>
                    {set.completed ? <i className="ti ti-check" style={{ fontSize: '12px' }} aria-hidden="true" /> : idx + 1}
                  </div>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={e => handleSetChange(we.exerciseId, idx, 'weight', e.target.value)}
                    disabled={set.completed}
                    placeholder="0"
                    style={{
                      padding: '8px 10px',
                      background: set.completed ? 'var(--bg-primary)' : 'var(--bg-primary)',
                      border: `0.5px solid ${set.completed ? 'transparent' : 'var(--border)'}`,
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      opacity: set.completed ? 0.5 : 1,
                    }}
                  />
                  <input
                    type="number"
                    value={set.reps}
                    onChange={e => handleSetChange(we.exerciseId, idx, 'reps', e.target.value)}
                    disabled={set.completed}
                    placeholder="0"
                    style={{
                      padding: '8px 10px',
                      background: 'var(--bg-primary)',
                      border: `0.5px solid ${set.completed ? 'transparent' : 'var(--border)'}`,
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      opacity: set.completed ? 0.5 : 1,
                    }}
                  />
                  <button
                    onClick={() => handleCompleteSet(we.exerciseId, idx, we.restTime || 90)}
                    disabled={set.completed || addSet.isPending}
                    style={{
                      padding: '8px',
                      background: set.completed ? 'var(--accent-primary)' : 'var(--bg-primary)',
                      border: `0.5px solid ${set.completed ? 'var(--accent-primary)' : 'var(--border)'}`,
                      borderRadius: '8px',
                      color: set.completed ? '#fff' : 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: set.completed ? 'default' : 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    {set.completed ? '✓' : 'Hecho'}
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Notas */}
      <div style={{ marginTop: '1.5rem' }}>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notas de la sesión (opcional)..."
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: 'var(--bg-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '13px',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Cronómetro de descanso */}
      {restTimer.active && (
        <RestTimer
          seconds={restTimer.seconds}
          onDone={() => setRestTimer({ seconds: 0, active: false })}
        />
      )}
    </div>
  )

  // FASE: SESIÓN COMPLETADA
  return (
    <div style={{
      maxWidth: '500px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center',
    }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'rgba(29,158,117,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <i className="ti ti-trophy" style={{ fontSize: '36px', color: 'var(--accent-primary)' }} aria-hidden="true" />
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
        ¡Sesión completada!
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        {selectedWorkout?.name}
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
        Duración: {formatElapsed()} · {completedSets} series completadas
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => { setPhase('select'); setElapsed(0); setNotes('') }}
          style={{
            padding: '10px 24px',
            background: 'var(--accent-primary)',
            color: '#fff', border: 'none',
            borderRadius: '10px', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          Otro entrenamiento
        </button>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 24px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '0.5px solid var(--border)',
            borderRadius: '10px', fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  )
}