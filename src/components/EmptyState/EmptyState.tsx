import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <HelpCircle className="h-12 w-12 text-zinc-600" />,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-900/50 border border-zinc-800/80 mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="max-w-sm text-sm text-zinc-400 mb-8">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
