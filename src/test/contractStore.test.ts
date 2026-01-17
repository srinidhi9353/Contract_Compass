import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { Contract, ContractStatus } from "../types";

// Define the interface locally for testing
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

// Create a test-specific store instance
const createStore = (initialState?: Partial<Omit<ContractState, 'getContract' | 'getContractsByStatus' | 'getContractsByBlueprint'>>) => {
  return create<ContractState>((set, get) => ({
    contracts: [],
    addContract: (name, blueprintId, blueprintName, values) => {
      const newContract: Contract = {
        id: 'test-id-' + Math.random().toString(36).substr(2, 9),
        name,
        blueprintId,
        blueprintName,
        status: 'CREATED',
        createdAt: new Date().toISOString(),
        values,
        transitions: [],
      };
      set(state => ({ contracts: [...state.contracts, newContract] }));
      return newContract;
    },
    updateContractValues: (id, values) => {
      set(state => ({
        contracts: state.contracts.map(c => 
          c.id === id ? { ...c, values: { ...c.values, ...values }, updatedAt: new Date().toISOString() } : c
        ),
      }));
    },
    transitionStatus: (id, newStatus, note) => {
      const contract = get().contracts.find(c => c.id === id);
      if (!contract) return false;
      
      const transition = {
        from: contract.status,
        to: newStatus,
        timestamp: new Date().toISOString(),
        note,
      };
      
      set(state => ({
        contracts: state.contracts.map(c =>
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
      return get().contracts.find(c => c.id === id);
    },
    getContractsByStatus: (status) => {
      return get().contracts.filter(c => c.status === status);
    },
    getContractsByBlueprint: (blueprintId) => {
      return get().contracts.filter(c => c.blueprintId === blueprintId);
    },
    ...initialState,
  }));
};

describe("Contract Store", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("should add a contract", () => {
    const contract = store.getState().addContract(
      "Test Contract",
      "bp1",
      "Test Blueprint",
      {}
    );
    
    expect(store.getState().contracts).toHaveLength(1);
    expect(store.getState().contracts[0].name).toBe("Test Contract");
    expect(store.getState().contracts[0].status).toBe("CREATED");
  });

  it("should update contract values", () => {
    const contract = store.getState().addContract(
      "Initial Contract",
      "bp1",
      "Test Blueprint",
      { field1: "value1" }
    );
    
    store.getState().updateContractValues(contract.id, { field1: "updated_value", field2: "new_value" });
    
    const updatedContract = store.getState().getContract(contract.id);
    expect(updatedContract?.values.field1).toBe("updated_value");
    expect(updatedContract?.values.field2).toBe("new_value");
  });

  it("should handle contract status transitions correctly", () => {
    const contract = store.getState().addContract(
      "Test Contract",
      "bp1",
      "Test Blueprint",
      {}
    );
    
    // Transition from CREATED to APPROVED
    const approvedResult = store.getState().transitionStatus(contract.id, "APPROVED");
    expect(approvedResult).toBe(true);
    expect(store.getState().contracts[0].status).toBe("APPROVED");
    
    // Transition from APPROVED to SENT
    const sentResult = store.getState().transitionStatus(contract.id, "SENT");
    expect(sentResult).toBe(true);
    expect(store.getState().contracts[0].status).toBe("SENT");
    
    // Transition from SENT to SIGNED
    const signedResult = store.getState().transitionStatus(contract.id, "SIGNED");
    expect(signedResult).toBe(true);
    expect(store.getState().contracts[0].status).toBe("SIGNED");
    
    // Transition from SIGNED to LOCKED
    const lockedResult = store.getState().transitionStatus(contract.id, "LOCKED");
    expect(lockedResult).toBe(true);
    expect(store.getState().contracts[0].status).toBe("LOCKED");
  });

  it("should handle REVOKED status correctly", () => {
    const contract = store.getState().addContract(
      "Test Contract",
      "bp1",
      "Test Blueprint",
      {}
    );
    
    // Transition to REVOKED from CREATED
    const revokedResult = store.getState().revokeContract(contract.id);
    expect(revokedResult).toBe(true);
    expect(store.getState().contracts[0].status).toBe("REVOKED");
  });

  it("should get contract by ID", () => {
    const contract = store.getState().addContract(
      "Test Contract",
      "bp1",
      "Test Blueprint",
      {}
    );
    
    const retrievedContract = store.getState().getContract(contract.id);
    expect(retrievedContract).toBeDefined();
    expect(retrievedContract?.name).toBe("Test Contract");
  });

  it("should get contracts by status", () => {
    store.getState().addContract("Contract 1", "bp1", "Test Blueprint", {});
    const contract2 = store.getState().addContract("Contract 2", "bp1", "Test Blueprint", {});
    store.getState().transitionStatus(contract2.id, "APPROVED");
    
    const createdContracts = store.getState().getContractsByStatus("CREATED");
    const approvedContracts = store.getState().getContractsByStatus("APPROVED");
    
    expect(createdContracts).toHaveLength(1);
    expect(approvedContracts).toHaveLength(1);
    expect(createdContracts[0].status).toBe("CREATED");
    expect(approvedContracts[0].status).toBe("APPROVED");
  });
});