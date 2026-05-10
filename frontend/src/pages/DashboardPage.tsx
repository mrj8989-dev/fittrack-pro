import { useAuth } from '../context/AuthContext'
import { useWorkoutSessions, usePersonalRecords } from '../hooks/useWorkoutSessions'
import { useWorkoutPlans } from '../hooks/useWorkoutPlans'
import { useNextRevision, useWeightProgress } from '../hooks/useBodyRevisions'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

function MetricCard({ label, value, delta, deltaPositive }: {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
}) {
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
      <div style={{ fontSize: '24px', fontWeight: 500, color: 'var(--text-primary)' }}>
        {value}
      </div>
      {delta && (
        <div style={{ fontSize: '12px', color: deltaPositive !== false ? 'var(--accent-primary)' : '#E24B4A', marginTop: '4px' }}>
          {delta}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px' }}>
      {children}
    </h2>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { data: sessions = [], isLoading: loadingSessions } = useWorkoutSessions()
  const { data: records = [], isLoading: loadingRecords } = usePersonalRecords()
  const { data: plans = [], isLoading: loadingPlans } = useWorkoutPlans()
  const { data: nextRevision } = useNextRevision()
  const { data: weightProgress = [] } = useWeightProgress()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  // Calcular volumen semanal de las últimas 8 semanas
  const weeklyVolume = () => {
    const weeks: Record<string, number> = {}
    sessions.forEach((session: any) => {
      const date = new Date(session.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const key = weekStart.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
      const volume = session.sets?.reduce((acc: number, set: any) =>
        acc + (set.weight || 0) * (set.reps || 0), 0) || 0
      weeks[key] = (weeks[key] || 0) + volume
    })
    return Object.entries(weeks)
      .slice(-8)
      .map(([week, volume]) => ({ week, volume: Math.round(volume) }))
  }

  // Sesiones este mes
  const sessionsThisMonth = sessions.filter((s: any) => {
    const d = new Date(s.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // Volumen total este mes
  const volumeThisMonth = sessions
    .filter((s: any) => {
      const d = new Date(s.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((acc: number, session: any) =>
      acc + (session.sets?.reduce((a: number, set: any) =>
        a + (set.weight || 0) * (set.reps || 0), 0) || 0), 0)

  const lastWeight = weightProgress.length > 0
    ? weightProgress[weightProgress.length - 1].weight
    : null

  const isLoading = loadingSessions || loadingRecords || loadingPlans

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '14px' }}>Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {greeting()}, {user?.name?.split(' ')[0]} 💪
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {plans.length > 0 ? `Plan activo: ${plans[0].name}` : 'Sin plan activo todavía'}
          </p>
        </div>
        {sessions.length > 0 && (
          <div style={{
            background: 'var(--accent-primary)',
            color: '#fff',
            fontSize: '12px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 500,
          }}>
            {sessionsThisMonth} sesiones este mes
          </div>
        )}
      </div>

      {/* MÉTRICAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '1.5rem',
      }}>
        <MetricCard
          label="Peso actual"
          value={lastWeight ? `${lastWeight} kg` : '— kg'}
          delta={lastWeight ? `→ objetivo 70 kg` : 'Sin revisiones'}
        />
        <MetricCard
          label="Sesiones"
          value={String(sessionsThisMonth)}
          delta="este mes"
        />
        <MetricCard
          label="Volumen total"
          value={volumeThisMonth > 0 ? `${(volumeThisMonth / 1000).toFixed(1)}t` : '0 kg'}
          delta="este mes"
        />
        <MetricCard
          label="Próx. revisión"
          value={nextRevision ? `${nextRevision.daysUntilRevision}d` : '—'}
          delta={nextRevision ? new Date(nextRevision.nextRevisionDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : ''}
        />
      </div>

      {/* GRÁFICAS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '12px',
        marginBottom: '1.5rem',
      }}>

        {/* Volumen semanal */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <SectionTitle>Volumen semanal (kg)</SectionTitle>
          {weeklyVolume().length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyVolume()} barSize={20}>
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: any) => [`${v} kg`, 'Volumen']}
                />
                <Bar dataKey="volume" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              Registra sesiones para ver el volumen
            </div>
          )}
        </div>

        {/* Peso corporal */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <SectionTitle>Evolución del peso (kg)</SectionTitle>
          {weightProgress.length > 1 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={weightProgress.map((r: any) => ({
                fecha: new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
                peso: r.weight,
              }))}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-secondary)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v: any) => [`${v} kg`, 'Peso']}
                />
                <Area type="monotone" dataKey="peso" stroke="var(--accent-primary)" strokeWidth={2} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              Añade revisiones para ver tu evolución
            </div>
          )}
        </div>
      </div>

      {/* RÉCORDS + PLAN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '12px',
      }}>

        {/* Récords personales */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <SectionTitle>Récords personales</SectionTitle>
          {records.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {records.slice(0, 5).map((record: any) => {
                const maxWeight = Math.max(...records.map((r: any) => r.maxWeight || 0))
                const pct = maxWeight > 0 ? ((record.maxWeight || 0) / maxWeight) * 100 : 0
                return (
                  <div key={record.exerciseId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {record.exerciseName || `Ejercicio`}
                      </span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {record.maxWeight} kg × {record.reps} reps
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                      <div style={{ height: '4px', width: `${pct}%`, background: 'var(--accent-primary)', borderRadius: '2px', transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', padding: '1rem 0' }}>
              Registra sesiones para ver tus récords
            </div>
          )}
        </div>

        {/* Plan activo */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '0.5px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
        }}>
          <SectionTitle>Plan activo</SectionTitle>
          {plans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {plans[0].name}
              </div>
              {plans[0].workouts?.map((workout: any) => (
                <div key={workout.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 12px',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: 'var(--accent-primary)', flexShrink: 0,
                  }} />
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', flex: 1 }}>
                    {workout.name}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    {['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][workout.dayOfWeek || 0]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-tertiary)', fontSize: '13px', padding: '1rem 0' }}>
              No tienes ningún plan activo
            </div>
          )}
        </div>

      </div>
    </div>
  )
}