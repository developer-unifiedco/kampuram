import InputError from '@/components/input-error';
import { AdminLayout } from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Check, ExternalLink, HelpCircle, Phone, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface SettingsProps {
    whatsappNumber: string;
}

export default function AdminSettings({ whatsappNumber }: SettingsProps) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        whatsapp_number: whatsappNumber,
    });

    const [testMessage, setTestMessage] = useState('Hi, testing the Kampuram WhatsApp enquiry link.');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('admin.settings.update'));
    };

    // Cleaned digit string for test link
    const cleanDigits = data.whatsapp_number.replace(/\D+/g, '');
    const isUsableNumber = cleanDigits.length >= 7 && cleanDigits.length <= 15;
    const testUrl = isUsableNumber
        ? `https://wa.me/${cleanDigits}?text=${encodeURIComponent(testMessage)}`
        : null;

    return (
        <AdminLayout
            title="WhatsApp Settings - Kampuram Admin"
            breadcrumbs={[{ label: 'WhatsApp Settings' }]}
        >
            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#282723]">WhatsApp Settings</h1>
                    <p className="mt-1 text-sm text-[#77746E]">
                        Update the single shared WhatsApp contact number used across the public website.
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E8E4DD] bg-white p-6 shadow-xs sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Number Input */}
                        <div>
                            <label
                                htmlFor="whatsapp_number"
                                className="block text-xs font-semibold tracking-wider text-[#55524B] uppercase"
                            >
                                WhatsApp Phone Number (with Country Code)
                            </label>
                            <p className="mt-1 text-xs text-[#8A867E]">
                                Enter the international number without plus, dashes or spaces. For India, start with 91 (e.g.{' '}
                                <code className="rounded-sm bg-[#FAF8F4] px-1.5 py-0.5 font-mono text-[#BD4714]">919388002975</code>).
                            </p>

                            <div className="relative mt-2">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#9A968E]">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <input
                                    id="whatsapp_number"
                                    type="text"
                                    name="whatsapp_number"
                                    value={data.whatsapp_number}
                                    onChange={(e) => setData('whatsapp_number', e.target.value)}
                                    required
                                    className="block w-full rounded-xl border border-[#DDD8D0] bg-[#FAF8F4]/50 py-2.5 pr-3 pl-10 text-sm font-medium text-[#282723] transition focus:border-[#ED6A2F] focus:bg-white focus:ring-2 focus:ring-[#ED6A2F]/20 focus:outline-hidden"
                                    placeholder="919388002975"
                                />
                            </div>
                            <InputError message={errors.whatsapp_number} className="mt-1.5" />
                        </div>

                        {/* Live Test WhatsApp Link */}
                        <div className="rounded-xl border border-[#ECE8E1] bg-[#FAF8F4] p-4 text-xs text-[#55524B]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[#282723]">Verify Before Saving:</span>
                                    <span>Recipient: +{cleanDigits || '...'}</span>
                                </div>

                                {testUrl ? (
                                    <a
                                        href={testUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white shadow-xs transition hover:bg-emerald-700"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        <span>Test WhatsApp Link</span>
                                    </a>
                                ) : (
                                    <span className="text-amber-700">Enter a valid number to test</span>
                                )}
                            </div>
                        </div>

                        {/* Save Action */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#ED6A2F] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-[#D95821] focus:ring-2 focus:ring-[#ED6A2F] focus:ring-offset-2 focus:outline-hidden disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                <span>{processing ? 'Saving...' : 'Save WhatsApp Number'}</span>
                            </button>

                            {recentlySuccessful && (
                                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                                    <Check className="h-3.5 w-3.5" />
                                    <span>Saved successfully</span>
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
