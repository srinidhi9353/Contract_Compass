import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { ContractTable } from '@/components/contract/ContractTable';
import { useContractStore } from '@/store/contractStore';
import { ContractStatus, STATUS_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type FilterType = 'all' | 'active' | 'pending' | 'completed' | 'revoked';

const filterConfig: Record<FilterType, { label: string; statuses: ContractStatus[] | null }> = {
  all: { label: 'All', statuses: null },
  active: { label: 'Active', statuses: ['CREATED', 'APPROVED', 'SENT', 'SIGNED'] },
  pending: { label: 'Pending', statuses: ['CREATED', 'APPROVED', 'SENT'] },
  completed: { label: 'Completed', statuses: ['SIGNED', 'LOCKED'] },
  revoked: { label: 'Revoked', statuses: ['REVOKED'] },
};

export default function ContractsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const contracts = useContractStore((state) => state.contracts);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [searchParams]);
  
  // Update URL when search query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', encodeURIComponent(searchQuery));
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  }, [searchQuery, setSearchParams, searchParams]);

  const filteredContracts = contracts
    .filter((contract) => {
      // Status filter
      const statusFilter = filterConfig[filter].statuses;
      if (statusFilter && !statusFilter.includes(contract.status)) {
        return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          contract.name.toLowerCase().includes(query) ||
          contract.blueprintName.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <MainLayout title="Contracts" subtitle={`${contracts.length} total contracts`}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contracts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/contracts/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Contract
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="mb-6">
        <TabsList>
          {Object.entries(filterConfig).map(([key, { label }]) => (
            <TabsTrigger key={key} value={key}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Contracts Table */}
      <ContractTable contracts={filteredContracts} />
    </MainLayout>
  );
}
