import React from 'react';
import { Button } from '../ui/button';

interface QuickActionModalButtonProps {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

export function QuickActionModalButton({ label, icon, onClick }: QuickActionModalButtonProps) {
    return (
        <Button
            variant="outline"
            className="quick-action-button w-full justify-start gap-2 bg-white hover:bg-gray-50 text-gray-900 border-gray-200 hover:border-gray-300 transition-colors"
            onClick={onClick}
        >
            {icon}
            <span className="text-gray-900">{label}</span>
        </Button>
    );
}
