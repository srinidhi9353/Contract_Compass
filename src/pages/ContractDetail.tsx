import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatusTimeline } from '@/components/contract/StatusTimeline';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ContractForm } from '@/components/contract/ContractForm';
import { useContractStore } from '@/store/contractStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { canTransition, getNextStatus, STATUS_LABELS, ContractStatus, TRANSITIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, XCircle, AlertTriangle, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contract = useContractStore((state) => state.getContract(id!));
  const transitionStatus = useContractStore((state) => state.transitionStatus);
  const blueprint = useBlueprintStore((state) => 
    contract ? state.getBlueprint(contract.blueprintId) : undefined
  );

  if (!contract) {
    return (
      <MainLayout title="Contract Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">The contract you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate('/contracts')}>
            Back to Contracts
          </Button>
        </div>
      </MainLayout>
    );
  }

  const nextStatus = getNextStatus(contract.status);
  const canRevoke = canTransition(contract.status, 'REVOKED');
  const isReadOnly = contract.status === 'LOCKED' || contract.status === 'REVOKED';

  const handleTransition = (newStatus: ContractStatus) => {
    const success = transitionStatus(contract.id, newStatus);
    if (success) {
      toast.success(`Contract status updated to ${STATUS_LABELS[newStatus]}`);
    } else {
      toast.error('Failed to update status');
    }
  };

  return (
    <MainLayout 
      title={contract.name}
      subtitle={`Based on ${contract.blueprintName}`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => navigate('/contracts')}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contracts
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Status</p>
                <div className="mt-2">
                  <StatusBadge status={contract.status} size="lg" />
                </div>
              </div>
              <div className="flex gap-3">
                {!isReadOnly && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Values
                  </Button>
                )}
                {nextStatus && (
                  <Button size="sm" onClick={() => handleTransition(nextStatus)}>
                    Move to {STATUS_LABELS[nextStatus]}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                {canRevoke && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <XCircle className="w-4 h-4 mr-2" />
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                          Revoke Contract
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to revoke this contract? This action cannot be undone 
                          and the contract will no longer be valid.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleTransition('REVOKED')}
                        >
                          Revoke Contract
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </motion.div>

          {/* Contract Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <h2 className="font-semibold text-foreground mb-6">Contract Details</h2>
            
            {blueprint ? (
              <ContractForm
                fields={blueprint.fields}
                values={contract.values}
                onChange={() => {}}
                readOnly
              />
            ) : (
              <div className="space-y-4">
                {Object.entries(contract.values).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-foreground">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <h2 className="font-semibold text-foreground mb-6">Status Timeline</h2>
            <StatusTimeline
              currentStatus={contract.status}
              transitions={contract.transitions}
            />
          </motion.div>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-xl border border-border p-6 shadow-card"
          >
            <h2 className="font-semibold text-foreground mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">
                  {format(new Date(contract.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              {contract.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground">
                    {format(new Date(contract.updatedAt), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Template</span>
                <span className="text-foreground">{contract.blueprintName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract ID</span>
                <span className="text-foreground font-mono text-xs">{contract.id}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
