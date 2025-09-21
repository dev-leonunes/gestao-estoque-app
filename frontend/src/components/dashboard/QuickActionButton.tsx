import React from 'react';
import { Button } from '../ui/button';

interface QuickActionButtonProps {
  label: string;
  icon: React.ReactNode;
}

export function QuickActionButton({ label, icon }: QuickActionButtonProps) {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      {icon}
      {label}
    </Button>
  );
}
