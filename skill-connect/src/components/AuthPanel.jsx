import { useState } from 'react';
import { createPortal } from 'react-dom';
import { loginUser, registerUser } from '../api/client';

const AuthPanel = ({ user, onAuthenticated, onLogout }) => {
  const [open, setOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const result = registering ? await registerUser(form) : await loginUser({ email: form.email, password: form.password });
      onAuthenticated(result);
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'customer' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (user) {
    return (
      <button type="button" onClick={onLogout} className="text-sm border border-white/50 px-3 py-1.5 rounded hover:text-yellow-400">
        Sign out
      </button>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm border border-yellow-400 text-yellow-300 px-3 py-1.5 rounded hover:bg-yellow-400 hover:text-black">
        Sign in
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 px-4 py-24" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="relative z-[101] mx-auto my-4 bg-white text-black rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold">{registering ? 'Create account' : 'Welcome back'}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close sign in dialog" className="text-2xl">&times;</button>
            </div>
            {registering && <input required minLength="2" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border p-3 rounded mb-3" />}
            {registering && (
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full border p-3 rounded mb-3">
                <option value="customer">I need a skilled worker</option>
                <option value="worker">I provide skilled services</option>
              </select>
            )}
            <input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full border p-3 rounded mb-3" />
            <input required minLength="8" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full border p-3 rounded mb-3" />
            {message && <p className="text-red-600 text-sm mb-3">{message}</p>}
            <button type="submit" className="w-full bg-yellow-400 py-3 rounded font-semibold hover:bg-yellow-300">{registering ? 'Create account' : 'Sign in'}</button>
            <button type="button" onClick={() => setRegistering(!registering)} className="w-full mt-3 text-sm text-gray-600 underline">
              {registering ? 'Already have an account? Sign in' : 'New to SkillConnect? Create an account'}
            </button>
          </form>
        </div>,
        document.body,
      )}
    </>
  );
};

export default AuthPanel;
