import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contract, ContractStatus, canTransition, StatusTransition } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ContractState {
  contracts: Contract[];
  addContract: (name: string, blueprintId: string, blueprintName: string, values: Record<string, any>) => Contract;
  updateContractValues: (id: string, values: Record<string, any>) => void;
  transitionStatus: (id: string, newStatus: ContractStatus, note?: string) => boolean;
  revokeContract: (id: string, note?: string) => boolean;
  getContract: (id: string) => Contract | undefined;
  getContractsByStatus: (status: ContractStatus) => Contract[];
  getContractsByBlueprint: (blueprintId: string) => Contract[];
}

const initialContracts: Contract[] = [
  {
    id: 'c-1',
    name: 'Service Agreement - Acme Corp',
    blueprintId: 'bp-1',
    blueprintName: 'Service Agreement',
    status: 'SIGNED',
    createdAt: '2026-01-12T10:00:00Z',
    values: {
      'Client Name': 'John Smith',
      'Company Name': 'Acme Corporation',
      'Start Date': '2026-02-01',
      'End Date': '2027-02-01',
      'Accept Terms': true,
    },
    transitions: [
      { from: 'CREATED' as ContractStatus, to: 'APPROVED' as ContractStatus, timestamp: '2026-01-12T11:00:00Z' },
      { from: 'APPROVED' as ContractStatus, to: 'SENT' as ContractStatus, timestamp: '2026-01-12T14:00:00Z' },
      { from: 'SENT' as ContractStatus, to: 'SIGNED' as ContractStatus, timestamp: '2026-01-14T09:00:00Z' },
    ],
  },
  {
    id: 'c-2',
    name: 'NDA - TechStart Inc',
    blueprintId: 'bp-2',
    blueprintName: 'Non-Disclosure Agreement',
    status: 'SENT',
    createdAt: '2026-01-14T09:00:00Z',
    values: {
      'Disclosing Party': 'Our Company',
      'Receiving Party': 'TechStart Inc',
      'Effective Date': '2026-01-20',
      'Mutual NDA': true,
    },
    transitions: [
      { from: 'CREATED' as ContractStatus, to: 'APPROVED' as ContractStatus, timestamp: '2026-01-14T10:00:00Z' },
      { from: 'APPROVED' as ContractStatus, to: 'SENT' as ContractStatus, timestamp: '2026-01-14T14:00:00Z' },
    ],
  },
  {
    id: 'c-3',
    name: 'Employment - Sarah Johnson',
    blueprintId: 'bp-3',
    blueprintName: 'Employment Contract',
    status: 'APPROVED',
    createdAt: '2026-01-15T11:00:00Z',
    values: {
      'Employee Name': 'Sarah Johnson',
      'Position': 'Senior Developer',
      'Department': 'Engineering',
      'Start Date': '2026-02-15',
      'Salary': '$120,000',
    },
    transitions: [
      { from: 'CREATED' as ContractStatus, to: 'APPROVED' as ContractStatus, timestamp: '2026-01-15T15:00:00Z' },
    ],
  },
  {
    id: 'c-4',
    name: 'Service Agreement - Beta LLC',
    blueprintId: 'bp-1',
    blueprintName: 'Service Agreement',
    status: 'CREATED',
    createdAt: '2026-01-16T08:00:00Z',
    values: {
      'Client Name': 'Mike Wilson',
      'Company Name': 'Beta LLC',
      'Start Date': '2026-03-01',
      'End Date': '2027-03-01',
    },
    transitions: [],
  },
  {
    id: 'c-5',
    name: 'NDA - OldPartner Co',
    blueprintId: 'bp-2',
    blueprintName: 'Non-Disclosure Agreement',
    status: 'REVOKED',
    createdAt: '2026-01-05T10:00:00Z',
    values: {
      'Disclosing Party': 'Our Company',
      'Receiving Party': 'OldPartner Co',
      'Effective Date': '2026-01-10',
    },
    transitions: [
      { from: 'CREATED' as ContractStatus, to: 'APPROVED' as ContractStatus, timestamp: '2026-01-05T12:00:00Z' },
      { from: 'APPROVED' as ContractStatus, to: 'SENT' as ContractStatus, timestamp: '2026-01-06T09:00:00Z' },
      { from: 'SENT' as ContractStatus, to: 'REVOKED' as ContractStatus, timestamp: '2026-01-08T14:00:00Z', note: 'Partnership cancelled' },
    ],
  },
  {
    id: 'c-6',
    name: 'Service Agreement - Locked Client',
    blueprintId: 'bp-1',
    blueprintName: 'Service Agreement',
    status: 'LOCKED',
    createdAt: '2025-12-01T10:00:00Z',
    values: {
      'Client Name': 'Alice Brown',
      'Company Name': 'Locked Corp',
      'Start Date': '2026-01-01',
      'End Date': '2026-12-31',
      'Accept Terms': true,
    },
    transitions: [
      { from: 'CREATED' as ContractStatus, to: 'APPROVED' as ContractStatus, timestamp: '2025-12-01T12:00:00Z' },
      { from: 'APPROVED' as ContractStatus, to: 'SENT' as ContractStatus, timestamp: '2025-12-02T09:00:00Z' },
      { from: 'SENT' as ContractStatus, to: 'SIGNED' as ContractStatus, timestamp: '2025-12-05T14:00:00Z' },
      { from: 'SIGNED' as ContractStatus, to: 'LOCKED' as ContractStatus, timestamp: '2025-12-10T10:00:00Z' },
    ],
  },
];

export const useContractStore = create<ContractState>()(
  persist(
    (set, get) => ({
      contracts: initialContracts,

      addContract: (name, blueprintId, blueprintName, values) => {
        const newContract: Contract = {
          id: uuidv4(),
          name,
          blueprintId,
          blueprintName,
          status: 'CREATED',
          createdAt: new Date().toISOString(),
          values,
          transitions: [],
        };
        set((state) => ({
          contracts: [...state.contracts, newContract],
        }));
        return newContract;
      },

      updateContractValues: (id, values) => {
        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id ? { ...c, values: { ...c.values, ...values }, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      transitionStatus: (id, newStatus, note) => {
        const contract = get().contracts.find((c) => c.id === id);
        if (!contract || !canTransition(contract.status, newStatus)) {
          return false;
        }

        const transition: StatusTransition = {
          from: contract.status,
          to: newStatus,
          timestamp: new Date().toISOString(),
          note,
        };

        set((state) => ({
          contracts: state.contracts.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: newStatus,
                  transitions: [...c.transitions, transition],
                  updatedAt: new Date().toISOString(),
                }
              : c
          ),
        }));
        return true;
      },

      revokeContract: (id, note) => {
        return get().transitionStatus(id, 'REVOKED', note);
      },

      getContract: (id) => {
        return get().contracts.find((c) => c.id === id);
      },

      getContractsByStatus: (status) => {
        return get().contracts.filter((c) => c.status === status);
      },

      getContractsByBlueprint: (blueprintId) => {
        return get().contracts.filter((c) => c.blueprintId === blueprintId);
      },
    }),
    {
      name: 'contract-storage',
    }
  )
);
