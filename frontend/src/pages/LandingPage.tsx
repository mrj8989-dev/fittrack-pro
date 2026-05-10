import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: 'ti-barbell',
    title: 'Rutinas personalizadas',
    description: 'Planes de entrenamiento adaptados a tu nivel y objetivos. Upper/Lower, Push/Pull, Fullbody y más.',
  },
  {
    icon: 'ti-chart-line',
    title: 'Progreso en tiempo real',
    description: 'Gráficas de fuerza, volumen y peso corporal. Visualiza tu evolución semana a semana.',
  },
  {
    icon: 'ti-trophy',
    title: 'Récords personales',
    description: 'Registra cada serie con peso y repeticiones. Supera tus marcas y vélo reflejado al instante.',
  },
  {
    icon: 'ti-camera',
    title: 'Revisiones corporales',
    description: 'Fotos de progreso, medidas y % de grasa corporal. Comparativas visuales entre revisiones.',
  },
  {
    icon: 'ti-clock',
    title: 'Seguimiento de sesiones',
    description: 'Registra cada entrenamiento en tiempo real. Historial completo con notas y duración.',
  },
  {
    icon: 'ti-adjustments',
    title: 'Totalmente personalizable',
    description: 'Elige tu color de acento, modo oscuro o claro, e intervalo de revisiones a tu gusto.',
  },
]

const stats = [
  { value: '24+', label: 'Ejercicios con vídeo' },
  { value: '4', label: 'Días de entrenamiento' },
  { value: '100%', label: 'Tuyo y personal' },
  { value: '0€', label: 'Sin suscripciones' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0a0e17', minHeight: '100vh', color: '#e6edf3' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem',
        background: 'rgba(10,14,23,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ti ti-bolt" style={{ color: 'var(--accent-primary)', fontSize: '22px' }} aria-hidden="true" />
          <span style={{ fontSize: '18px', fontWeight: 500 }}>
            Fit<span style={{ color: 'var(--accent-primary)' }}>Track</span>
          </span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '8px 20px',
            background: 'var(--accent-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Iniciar sesión
        </button>
      </nav>

      {/* HERO */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.2)',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,14,23,0.3) 0%, rgba(10,14,23,0.95) 100%)',
          zIndex: 1,
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center',
          padding: '0 1.5rem',
          maxWidth: '700px',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(29,158,117,0.15)',
            border: '0.5px solid rgba(29,158,117,0.4)',
            borderRadius: '20px',
            padding: '6px 16px',
            fontSize: '12px',
            color: 'var(--accent-primary)',
            marginBottom: '1.5rem',
          }}>
            <i className="ti ti-bolt" style={{ fontSize: '14px' }} aria-hidden="true" />
            Tu plataforma de entrenamiento personal
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: '#fff',
          }}>
            Entrena con propósito.<br />
            <span style={{ color: 'var(--accent-primary)' }}>Mide tu progreso.</span>
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
          }}>
            Registra tus entrenamientos, sigue tus récords personales, controla tu evolución física y mantén la constancia que necesitas para transformar tu cuerpo.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px',
                background: 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Empezar ahora
              <i className="ti ti-arrow-right" style={{ marginLeft: '8px', fontSize: '16px', verticalAlign: '-2px' }} aria-hidden="true" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '14px 32px',
                background: 'transparent',
                color: 'rgba(255,255,255,0.7)',
                border: '0.5px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Ver más
            </button>
          </div>
        </div>

        <div style={{
          position: 'absolute', bottom: '2rem', left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: '2rem', zIndex: 2,
          flexWrap: 'wrap', padding: '0 1rem',
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--accent-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding: '5rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Todo lo que necesitas para progresar
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto' }}>
            Sin suscripciones, sin límites. Tu progreso, tus datos, tu plataforma.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {features.map(feature => (
            <div key={feature.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'rgba(29,158,117,0.15)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <i className={`ti ${feature.icon}`} style={{ fontSize: '20px', color: 'var(--accent-primary)' }} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD PREVIEW */}
      <div style={{ padding: '3rem 2rem 5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
            Diseñado para ser tuyo
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }}>
            Dashboard limpio con toda la información que necesitas de un vistazo
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '6px',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
          }}>
            {['#ff5f57', '#ffbd2e', '#28c840'].map(c => (
              <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, textAlign: 'center', fontSize: '11px',
              color: 'rgba(255,255,255,0.3)',
            }}>
              fittrack.pro/dashboard
            </div>
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '1rem' }}>
              {[
                { label: 'Peso actual', value: '62 kg', delta: '→ obj. 70kg' },
                { label: 'Sesiones', value: '8', delta: 'este mes' },
                { label: 'Volumen', value: '14.2t', delta: '+18% vs anterior' },
                { label: 'Próx. revisión', value: '14 días', delta: '24 Mayo' },
              ].map(m => (
                <div key={m.label} style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px', padding: '12px',
                }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div style={{ fontSize: '18px', fontWeight: 500, color: '#fff' }}>{m.value}</div>
                  <div style={{ fontSize: '10px', color: 'var(--accent-primary)', marginTop: '2px' }}>{m.delta}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>Volumen semanal</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
                  {[45, 55, 48, 65, 60, 75, 90].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--accent-primary)' : 'rgba(29,158,117,0.3)', borderRadius: '2px 2px 0 0', height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Récords</div>
                {[
                  { name: 'Press banca', val: '60kg', pct: 75 },
                  { name: 'Peso muerto', val: '90kg', pct: 90 },
                  { name: 'Sentadilla', val: '70kg', pct: 65 },
                ].map(r => (
                  <div key={r.name} style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '3px' }}>
                      <span>{r.name}</span><span style={{ color: '#fff' }}>{r.val}</span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                      <div style={{ height: '3px', width: `${r.pct}%`, background: 'var(--accent-primary)', borderRadius: '2px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
            background: 'linear-gradient(transparent, #0a0e17)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>
          Listo para empezar?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>
          Tu progreso empieza hoy.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '14px 40px',
            background: 'var(--accent-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Empezar ahora
          <i className="ti ti-arrow-right" style={{ marginLeft: '8px', fontSize: '16px', verticalAlign: '-2px' }} aria-hidden="true" />
        </button>
      </div>

      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.2)',
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        FitTrack Pro · Tu progreso, tu historia
      </footer>
    </div>
  )
}