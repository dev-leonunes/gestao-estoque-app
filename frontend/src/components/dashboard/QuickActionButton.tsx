// src/components/dashboard/QuickActionButton.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

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