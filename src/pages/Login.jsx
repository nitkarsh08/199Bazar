import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo-full.png'
import { useStore } from '../context/StoreContext'

const input = 'w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-brand'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { notify } = useStore()
  const on = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (mode === 'signup' && form.name.trim().length < 2) return setError('Enter your name')
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError('Enter a valid 10-digit mobile number')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setError('')
    // TODO: call your login / register API here.
    notify(mode === 'login' ? 'Logged in successfully' : 'Account created')
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <img src={logo} alt="199Bazar" className="mx-auto h-20 w-auto" />
        <p className="mt-2 text-center text-sm text-gray-500">Sab Ke Liye, Sab Kuch</p>

        <div role="tablist" className="mt-6 grid grid-cols-2 rounded-full bg-gray-100 p-1 text-sm font-semibold">
          {[['login', 'Login'], ['signup', 'Sign up']].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => { setMode(id); setError('') }}
              className={`rounded-full py-2 ${mode === id ? 'bg-white shadow' : 'text-gray-500'}`}>{label}</button>
          ))}
        </div>

        <form onSubmit={submit} noValidate className="mt-5 space-y-4">
          {mode === 'signup' && (
            <label className="block text-sm font-medium">Full name<input className={`${input} mt-1`} value={form.name} onChange={on('name')} autoComplete="name" /></label>
          )}
          <label className="block text-sm font-medium">Mobile number<input className={`${input} mt-1`} value={form.phone} onChange={on('phone')} inputMode="numeric" maxLength={10} autoComplete="tel" placeholder="10-digit number" /></label>
          <label className="block text-sm font-medium">Password<input className={`${input} mt-1`} type="password" value={form.password} onChange={on('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded-full bg-brand py-3 font-bold text-white hover:bg-brand-dark">{mode === 'login' ? 'Login' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
