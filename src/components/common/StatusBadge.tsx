import { ContractStatus, STATUS_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, Clock, Lock, Send, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ContractStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<ContractStatus, { className: string; Icon: React.ComponentType<any> }> = {
  CREATED: { className: 'status-created', Icon: Circle },
  APPROVED: { className: 'status-approved', Icon: Clock },
  SENT: { className: 'status-sent', Icon: Send },
  SIGNED: { className: 'status-signed', Icon: CheckCircle },
  LOCKED: { className: 'status-locked', Icon: Lock },
  REVOKED: { className: 'status-revoked', Icon: XCircle },
};

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const { className, Icon } = statusConfig[status];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <span className={cn('status-badge', className, sizeClasses[size])}>
      {showIcon && <Icon size={iconSizes[size]} />}
      {STATUS_LABELS[status]}
    </span>
  );
}
