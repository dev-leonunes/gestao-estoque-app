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
            className="w-full justify-start gap-2 cursor-pointer"
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </Button>
    );
}
