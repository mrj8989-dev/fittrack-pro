import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      background: '#0a0e17',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.25)',
        zIndex: 0,
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(15,110,86,0.3) 100%)',
        zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '0.5rem',
          }}>
            <i className="ti ti-bolt" style={{ color: 'var(--accent-primary)', fontSize: '28px' }} aria-hidden="true" />
            <span style={{ fontSize: '24px', fontWeight: 500, color: '#fff' }}>
              Fit<span style={{ color: 'var(--accent-primary)' }}>Track</span>
            </span>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
            Tu plataforma de entrenamiento personal
          </p>
        </div>

        <div style={{
          background: 'rgba(22,27,34,0.85)',
          backdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '2rem',
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '1.5rem', color: '#fff' }}>
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `0.5px solid ${errors.email ? '#E24B4A' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <p style={{ fontSize: '12px', color: '#E24B4A', marginTop: '4px' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                Contraseña
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: `0.5px solid ${errors.password ? '#E24B4A' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.password && (
                <p style={{ fontSize: '12px', color: '#E24B4A', marginTop: '4px' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(226,75,74,0.1)',
                border: '0.5px solid #E24B4A',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#E24B4A',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                background: loading ? 'var(--accent-dark)' : 'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                marginTop: '0.5rem',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '1.5rem' }}>
          FitTrack Pro · Tu progreso, tu historia
        </p>
      </div>
    </div>
  )
}