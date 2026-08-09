import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';

type AuthMode = 'login' | 'signup';

interface AuthModalProps {
    initialMode?: AuthMode;
    onClose?: () => void;
    onSuccess?: (username: string) => void;
    standalone?: boolean;
}

export function AuthModal({ initialMode = 'login', onClose, onSuccess, standalone = false }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [error, setError] = useState('');

    const close = () => onClose?.();
    const getUsers = () => ({
        users: (localStorage.getItem('user') || '').split(',').filter(Boolean),
        passwords: (localStorage.getItem('passw') || '').split(',').filter(Boolean),
    });

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        const form = new FormData(event.currentTarget);
        const username = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        const { users, passwords } = getUsers();
        const index = users.indexOf(username);
        if (index === -1 || passwords[index] !== password) {
            setError('Login Failed! Incorrect username or password.');
            return;
        }
        localStorage.setItem('currentUser', username);
        onSuccess?.(username);
        if (standalone) window.location.href = '/dashboard';
    }

    function handleSignup(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        const form = new FormData(event.currentTarget);
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        const confirmation = String(form.get('confirm') || '');
        if (password !== confirmation) {
            setError('Passwords do not match.');
            return;
        }
        const { users, passwords } = getUsers();
        if (users.includes(email)) {
            setError('An account with this email already exists.');
            return;
        }
        localStorage.setItem('user', [...users, email].join(','));
        localStorage.setItem('passw', [...passwords, password].join(','));
        localStorage.setItem('currentUser', email);
        onSuccess?.(email);
        if (standalone) window.location.href = '/dashboard';
    }

    const card = (
        <div className="relative w-full max-w-[440px] overflow-hidden rounded-2xl bg-white text-[#2f3542] shadow-2xl">
            <div className="relative bg-[#ffe4c4] px-5 py-6 text-center">
                <button type="button" onClick={close} aria-label="Close authentication dialog" className="absolute right-5 top-4 text-3xl leading-none text-[#6f6b67] hover:text-black">
                    <X size={28} />
                </button>
                <h2 className="text-3xl font-bold sm:text-4xl">{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
                <p className="mt-1 text-sm sm:text-base">{mode === 'login' ? 'Log in to your account' : "Let's get you started! Please enter your details."}</p>
            </div>
            <div className="px-6 py-5 sm:px-8">
                <a href="http://localhost:3000/api/auth/google" className="mx-auto flex h-12 w-full max-w-[220px] items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white text-base font-semibold shadow-sm transition hover:bg-gray-50" aria-label="Continue with Google"><span className="text-xl font-bold text-[#4285f4]">G</span> Continue with Google</a>
                <div className="my-5 flex items-center gap-3 text-center text-sm text-gray-500"><hr className="flex-1" />or<hr className="flex-1" /></div>

                <p className="mb-4 text-center text-base font-medium">{mode === 'login' ? 'Log in with your email address' : 'Sign up with your email address'}</p>
                <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-3">
                    <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    {mode === 'signup' && <input name="confirm" type="password" required placeholder="Confirm your password" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />}
                    {mode === 'login' && <a href="#forgot-password" onClick={(event) => event.preventDefault()} className="block text-[#8b174e]">Forgot your password?</a>}
                    {mode === 'signup' && <p className="text-base leading-relaxed">When using Dreamscape you accept our <button type="button" className="font-medium text-[#a81759]">Terms &amp; Conditions</button> and <button type="button" className="font-medium text-[#a81759]">Privacy Policy</button>.</p>}
                    {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                    <button type="submit" className="w-full rounded-xl bg-[#176df5] py-3 text-lg font-semibold text-white transition hover:bg-[#0f59d0]">{mode === 'login' ? 'Log In' : 'Sign Up'}</button>
                </form>
                <p className="mt-4 text-center text-base">
                    {mode === 'login' ? 'No account? ' : 'Already have an account? '}
                    <button type="button" onClick={() => { setError(''); setMode(mode === 'login' ? 'signup' : 'login'); }} className="font-semibold text-[#1d5aef]">{mode === 'login' ? 'Sign up' : 'Log In'}</button>
                </p>
            </div>
        </div>
    );

    if (standalone) return <div className="flex min-h-screen items-center justify-center bg-[#0e1724] px-4 py-8">{card}</div>;
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-5 backdrop-blur-md" role="dialog" aria-modal="true">{card}</div>;
}
