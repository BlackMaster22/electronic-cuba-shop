// src/components/ui/Button.tsx
import { ReactNode } from 'react';

type ButtonVariant = 'default' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    [key: string]: any; // Permite props adicionales (onClick, type, etc.)
}

const variantClasses = {
    default: 'bg-primary-600 hover:bg-primary-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800',
};

const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
};

export function Button({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={[
                'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
                variantClasses[variant],
                sizeClasses[size],
                className,
            ].join(' ')}
            {...props}
        >
            {children}
        </button>
    );
}