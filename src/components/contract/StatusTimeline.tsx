import { ContractStatus, STATUS_LABELS, STATUS_ORDER, StatusTransition } from '@/types';
import { cn } from '@/lib/utils';
import { Check, Circle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface StatusTimelineProps {
  currentStatus: ContractStatus;
  transitions: StatusTransition[];
}

export function StatusTimeline({ currentStatus, transitions }: StatusTimelineProps) {
  const isRevoked = currentStatus === 'REVOKED';
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const getStatusState = (status: ContractStatus, index: number) => {
    if (isRevoked) {
      const revokedTransition = transitions.find(t => t.to === 'REVOKED');
      const revokedFromIndex = revokedTransition 
        ? STATUS_ORDER.indexOf(revokedTransition.from) 
        : -1;
      
      if (index <= revokedFromIndex) return 'completed';
      return 'inactive';
    }
    
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'current';
    return 'inactive';
  };

  const getTransitionTimestamp = (status: ContractStatus) => {
    const transition = transitions.find(t => t.to === status);
    return transition ? format(new Date(transition.timestamp), 'MMM d, yyyy h:mm a') : null;
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />

      <div className="space-y-6">
        {STATUS_ORDER.map((status, index) => {
          const state = getStatusState(status, index);
          const timestamp = getTransitionTimestamp(status);

          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-start gap-4"
            >
              {/* Status indicator */}
              <div
                className={cn(
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
                  state === 'completed' && 'bg-primary border-primary',
                  state === 'current' && 'bg-primary border-primary animate-pulse-subtle',
                  state === 'inactive' && 'bg-background border-border'
                )}
              >
                {state === 'completed' ? (
                  <Check className="w-4 h-4 text-primary-foreground" />
                ) : state === 'current' ? (
                  <Circle className="w-3 h-3 text-primary-foreground fill-current" />
                ) : (
                  <Circle className="w-3 h-3 text-muted-foreground" />
                )}
              </div>

              {/* Status info */}
              <div className="flex-1 pt-1">
                <p
                  className={cn(
                    'font-medium',
                    state === 'inactive' ? 'text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {STATUS_LABELS[status]}
                </p>
                {timestamp && (
                  <p className="text-xs text-muted-foreground mt-0.5">{timestamp}</p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Revoked state */}
        {isRevoked && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="relative flex items-start gap-4"
          >
            <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-destructive border-2 border-destructive">
              <X className="w-4 h-4 text-destructive-foreground" />
            </div>
            <div className="flex-1 pt-1">
              <p className="font-medium text-destructive">Revoked</p>
              {getTransitionTimestamp('REVOKED') && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getTransitionTimestamp('REVOKED')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
