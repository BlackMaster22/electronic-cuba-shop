// src/app/admin/financial/page.tsx
'use client';

import { useState } from 'react';
import { FinancialDashboard } from '@/components/admin/FinancialDashboard';

export default function FinancialPage() {
    const [period, setPeriod] = useState('all');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión Económica</h1>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
                Resumen financiero y métricas clave de tu tienda.
            </p>

            <FinancialDashboard period={period} onPeriodChange={setPeriod} />
        </div>
    );
}