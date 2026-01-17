import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useContractStore } from '@/store/contractStore';
import { useBlueprintStore } from '@/store/blueprintStore';
import { ContractStatus, STATUS_ORDER } from '@/types';
import { FileText, FolderOpen, Clock, CheckCircle, Lock, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface DashboardProps {
  userName?: string;
}

export default function Dashboard({ userName }: DashboardProps = {}) {
  const navigate = useNavigate();
  const contracts = useContractStore((state) => state.contracts);
  const blueprints = useBlueprintStore((state) => state.blueprints);

  // Calculate stats
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => 
    !['LOCKED', 'REVOKED'].includes(c.status)
  ).length;
  const signedContracts = contracts.filter(c => c.status === 'SIGNED').length;
  const pendingContracts = contracts.filter(c => 
    ['CREATED', 'APPROVED', 'SENT'].includes(c.status)
  ).length;

  // Get status counts for chart
  const statusCounts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = contracts.filter(c => c.status === status).length;
    return acc;
  }, {} as Record<ContractStatus, number>);
  statusCounts.REVOKED = contracts.filter(c => c.status === 'REVOKED').length;

  // Recent contracts (last 5)
  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const displayName = userName || 'there';
  
  return (
    <MainLayout title="Dashboard" subtitle={`Welcome back, ${displayName}! Here's an overview of your contracts.`}>
      {/* Logo and Tagline Section with Cover Photo */}
      <div className="mb-8 relative rounded-xl overflow-hidden border border-border">
        <div className="w-full h-48 overflow-hidden">
          <img 
            src="/logo.png" 
            alt="Contract Compass Cover" 
            className="w-full h-10 object-cover"
            style={{ objectPosition: 'center 5%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/30" />
        <div className="absolute inset-0 flex items-center gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-white flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt="Contract Compass Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Contract Compass</h1>
              <p className="text-sm">Contract Management Application</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid - Enhanced with gradient borders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Contracts"
          value={totalContracts}
          icon={<FileText className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          delay={0}
          onClick={() => navigate('/contracts')}
        />
        <StatsCard
          title="Active Contracts"
          value={activeContracts}
          icon={<Clock className="w-6 h-6" />}
          delay={0.1}
          onClick={() => navigate('/contracts?status=active')}
        />
        <StatsCard
          title="Signed This Month"
          value={signedContracts}
          icon={<CheckCircle className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          delay={0.2}
          onClick={() => navigate('/contracts?status=signed')}
        />
        <StatsCard
          title="Blueprints"
          value={blueprints.length}
          icon={<FolderOpen className="w-6 h-6" />}
          delay={0.3}
          onClick={() => navigate('/blueprints')}
        />
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 bg-card rounded-xl border border-border p-6 shadow-card"
        >
          <h2 className="font-semibold text-foreground mb-4">Status Overview</h2>
          <div className="space-y-3">
            {[...STATUS_ORDER, 'REVOKED' as ContractStatus].map((status) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} size="sm" />
                <span className="text-sm font-medium text-foreground">
                  {statusCounts[status]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
  
        {/* Recent Contracts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Recent Contracts</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/contracts')}>
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
  
          <div className="space-y-3">
            {recentContracts.map((contract, index) => (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/contracts/${contract.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {contract.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contract.blueprintName} • {format(new Date(contract.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <StatusBadge status={contract.status} size="sm" />
              </motion.div>
            ))}
  
            {recentContracts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contracts yet</p>
                <Button className="mt-4" onClick={() => navigate('/contracts/new')}>
                  Create Your First Contract
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
  
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Ready to create a new contract?</h2>
            <p className="text-primary-foreground/80 mt-1">
              Choose from {blueprints.length} available templates or create your own
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/blueprints/new')}
            >
              Create Blueprint
            </Button>
            <Button 
              variant="outline" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/contracts/new')}
            >
              New Contract
            </Button>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
