export type FieldType = "text" | "date" | "checkbox" | "signature";

export interface BlueprintField {
  id: string;
  type: FieldType;
  label: string;
  position: { x: number; y: number };
  required?: boolean;
  width?: number;
  height?: number;
}

export interface Blueprint {
  id: string;
  name: string;
  description?: string;
  fields: BlueprintField[];
  createdAt: string;
  updatedAt?: string;
}

export type ContractStatus =
  | "CREATED"
  | "APPROVED"
  | "SENT"
  | "SIGNED"
  | "LOCKED"
  | "REVOKED";

export interface StatusTransition {
  from: ContractStatus;
  to: ContractStatus;
  timestamp: string;
  note?: string;
}

export interface Contract {
  id: string;
  name: string;
  blueprintId: string;
  blueprintName: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt?: string;
  values: Record<string, any>;
  transitions: StatusTransition[];
}

export const STATUS_LABELS: Record<ContractStatus, string> = {
  CREATED: "Created",
  APPROVED: "Approved",
  SENT: "Sent",
  SIGNED: "Signed",
  LOCKED: "Locked",
  REVOKED: "Revoked",
};

export const STATUS_ORDER: ContractStatus[] = [
  "CREATED",
  "APPROVED",
  "SENT",
  "SIGNED",
  "LOCKED",
];

export const TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  CREATED: ["APPROVED", "REVOKED"],
  APPROVED: ["SENT"],
  SENT: ["SIGNED", "REVOKED"],
  SIGNED: ["LOCKED"],
  LOCKED: [],
  REVOKED: [],
};

export function canTransition(current: ContractStatus, target: ContractStatus): boolean {
  return TRANSITIONS[current]?.includes(target) ?? false;
}

export function getNextStatus(current: ContractStatus): ContractStatus | null {
  const validTransitions = TRANSITIONS[current].filter(s => s !== "REVOKED");
  return validTransitions[0] || null;
}
