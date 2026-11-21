import { AdminSharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, ChevronRight, LogOut, MessageSquare, Phone, ShieldAlert, Sparkles, Store } from 'lucide-react';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    title: string;
    breadcrumbs?: { label: string; href?: string }[];
    children: ReactNode;
}

export function AdminLayout({ title, breadcrumbs, children }: AdminLayoutProps) {
    const { auth, flash, name } = usePage<AdminSharedData>().props;
    const { post, processing } = useForm({});

    const handleSignOut = () => {
        post(route('admin.logout'));
    };

    return (
        <div className="min-h-screen bg-[#FAF8F4] text-[#282723] antialiased">
            <Head title={title} />

            {/* Top Navigation */}
            <header className="sticky top-0 z-30 border-b border-[#E9E5DF] bg-[#FAF8F4]/95 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Brand */}
                    <div className="flex items-center gap-6">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-3 transition-opacity hover:opacity-85">
                            <img
                                src="/kampuram-site/assets/kampuram-business-group-logo.png"
                                alt="Kampuram Business Group"
                                className="h-9 w-auto object-contain"
                            />
                            <span className="hidden rounded-full bg-[#ED6A2F]/10 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-[#BD4714] uppercase sm:inline-block">
                                Admin
                            </span>
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden items-center gap-1 md:flex">
                            <Link
                                href={route('admin.dashboard')}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    route().current('admin.dashboard') || route().current('admin.listings.*')
                                        ? 'bg-[#EFECE6] text-[#282723]'
                                        : 'text-[#77746E] hover:bg-[#F2EFEA] hover:text-[#282723]'
                                }`}
                            >
                                <Store className="h-4 w-4" />
                                <span>Businesses</span>
                            </Link>
                            <Link
                                href={route('admin.settings.edit')}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                    route().current('admin.settings.*')
                                        ? 'bg-[#EFECE6] text-[#282723]'
                                        : 'text-[#77746E] hover:bg-[#F2EFEA] hover:text-[#282723]'
                                }`}
                            >
                                <Phone className="h-4 w-4" />
                                <span>WhatsApp Settings</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Admin Profile & Actions */}
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                            <div className="text-sm font-medium text-[#282723]">{auth.admin?.name || 'Admin'}</div>
                            <div className="text-xs text-[#77746E]">{auth.admin?.email}</div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={processing}
                            title="Sign out of admin"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DDD8D0] bg-white px-3 py-1.5 text-xs font-semibold text-[#55524B] shadow-xs transition hover:bg-[#F7F5F0] hover:text-[#BD4714] focus:ring-2 focus:ring-[#ED6A2F] focus:outline-hidden disabled:opacity-50"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>

                {/* Breadcrumbs bar if provided */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="border-t border-[#EFECE6] bg-[#F7F4EE]/60 px-4 py-2 sm:px-6 lg:px-8">
                        <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs text-[#77746E]">
                            <Link href={route('admin.dashboard')} className="hover:text-[#BD4714]">
                                Overview
                            </Link>
                            {breadcrumbs.map((crumb, idx) => (
                                <span key={idx} className="flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3 text-[#A8A49C]" />
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-[#BD4714]">
                                            {crumb.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-[#282723]">{crumb.label}</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Flash Feedback */}
            {flash?.success && (
                <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3.5 text-sm font-medium text-emerald-900 shadow-xs">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            {flash?.error && (
                <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-sm font-medium text-rose-900 shadow-xs">
                        <ShieldAlert className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

            {/* Simple Luxury Footer */}
            <footer className="mt-16 border-t border-[#E9E5DF] py-6 text-center text-xs text-[#8A867E]">
                <div className="mx-auto max-w-7xl px-4">
                    <span>Kampuram Business Group &bull; Admin Panel</span>
                </div>
            </footer>
        </div>
    );
}
