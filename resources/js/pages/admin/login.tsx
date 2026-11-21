import InputError from '@/components/input-error';
import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col justify-center bg-[#FAF8F4] px-4 py-12 sm:px-6 lg:px-8">
            <Head title="Sign In - Kampuram Admin" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src="/kampuram-site/assets/kampuram-business-group-logo.png"
                        alt="Kampuram Business Group"
                        className="h-16 w-auto object-contain"
                    />
                </div>

                <div className="mt-6 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-[#282723]">Admin Sign In</h1>
                    <p className="mt-1 text-sm text-[#77746E]">Catalogue management for Kampuram Business Group</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="rounded-2xl border border-[#E9E5DF] bg-white p-8 shadow-xs sm:p-10">
                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase">
                                Email Address
                            </label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9A968E]">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="username"
                                    autoFocus
                                    required
                                    className="block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 pr-3 pl-10 text-sm text-[#282723] placeholder-[#A8A49C] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                    placeholder="owner@kampuram.com"
                                />
                            </div>
                            <InputError message={errors.email} className="mt-1.5" />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase">
                                Password
                            </label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9A968E]">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 pr-3 pl-10 text-sm text-[#282723] placeholder-[#A8A49C] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                    placeholder="••••••••••••"
                                />
                            </div>
                            <InputError message={errors.password} className="mt-1.5" />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ED6A2F] py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-[#D95821] focus:ring-2 focus:ring-[#ED6A2F] focus:ring-offset-2 focus:outline-hidden disabled:opacity-50"
                            >
                                <span>{processing ? 'Signing in...' : 'Sign in to Dashboard'}</span>
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-[#EFECE6] pt-4 text-center text-xs text-[#8A867E]">
                        <span>Secure operator-assisted account recovery available</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
