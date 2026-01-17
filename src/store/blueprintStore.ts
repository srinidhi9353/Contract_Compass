import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Blueprint, BlueprintField } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface BlueprintState {
  blueprints: Blueprint[];
  addBlueprint: (name: string, description?: string) => Blueprint;
  updateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
  deleteBlueprint: (id: string) => void;
  addField: (blueprintId: string, field: Omit<BlueprintField, 'id'>) => void;
  updateField: (blueprintId: string, fieldId: string, updates: Partial<BlueprintField>) => void;
  removeField: (blueprintId: string, fieldId: string) => void;
  getBlueprint: (id: string) => Blueprint | undefined;
}

const initialBlueprints: Blueprint[] = [
  {
    id: 'bp-1',
    name: 'Service Agreement',
    description: 'Standard service agreement template for client engagements',
    createdAt: '2026-01-10T10:00:00Z',
    fields: [
      { id: 'f1', type: 'text', label: 'Client Name', position: { x: 50, y: 80 }, required: true, width: 200 },
      { id: 'f2', type: 'text', label: 'Company Name', position: { x: 50, y: 140 }, required: true, width: 200 },
      { id: 'f3', type: 'date', label: 'Start Date', position: { x: 50, y: 200 }, required: true, width: 150 },
      { id: 'f4', type: 'date', label: 'End Date', position: { x: 220, y: 200 }, required: true, width: 150 },
      { id: 'f5', type: 'checkbox', label: 'Accept Terms', position: { x: 50, y: 700 }, required: true },
      { id: 'f6', type: 'signature', label: 'Client Signature', position: { x: 50, y: 750 }, required: true, width: 200, height: 60 },
    ],
  },
  {
    id: 'bp-2',
    name: 'Non-Disclosure Agreement',
    description: 'NDA template for confidential information protection',
    createdAt: '2026-01-08T14:30:00Z',
    fields: [
      { id: 'f1', type: 'text', label: 'Disclosing Party', position: { x: 50, y: 80 }, required: true, width: 200 },
      { id: 'f2', type: 'text', label: 'Receiving Party', position: { x: 300, y: 80 }, required: true, width: 200 },
      { id: 'f3', type: 'date', label: 'Effective Date', position: { x: 50, y: 140 }, required: true, width: 150 },
      { id: 'f4', type: 'checkbox', label: 'Mutual NDA', position: { x: 50, y: 200 } },
      { id: 'f5', type: 'signature', label: 'Signature', position: { x: 50, y: 750 }, required: true, width: 200, height: 60 },
    ],
  },
  {
    id: 'bp-3',
    name: 'Employment Contract',
    description: 'Standard employment agreement for new hires',
    createdAt: '2026-01-05T09:00:00Z',
    fields: [
      { id: 'f1', type: 'text', label: 'Employee Name', position: { x: 50, y: 80 }, required: true, width: 200 },
      { id: 'f2', type: 'text', label: 'Position', position: { x: 300, y: 80 }, required: true, width: 200 },
      { id: 'f3', type: 'text', label: 'Department', position: { x: 50, y: 140 }, required: true, width: 150 },
      { id: 'f4', type: 'date', label: 'Start Date', position: { x: 250, y: 140 }, required: true, width: 150 },
      { id: 'f5', type: 'text', label: 'Salary', position: { x: 50, y: 200 }, required: true, width: 150 },
      { id: 'f6', type: 'checkbox', label: 'Accept Terms', position: { x: 50, y: 700 }, required: true },
      { id: 'f7', type: 'signature', label: 'Employee Signature', position: { x: 50, y: 750 }, required: true, width: 200, height: 60 },
    ],
  },
];

export const useBlueprintStore = create<BlueprintState>()(
  persist(
    (set, get) => ({
      blueprints: initialBlueprints,

      addBlueprint: (name, description) => {
        const newBlueprint: Blueprint = {
          id: uuidv4(),
          name,
          description,
          fields: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          blueprints: [...state.blueprints, newBlueprint],
        }));
        return newBlueprint;
      },

      updateBlueprint: (id, updates) => {
        set((state) => ({
          blueprints: state.blueprints.map((bp) =>
            bp.id === id ? { ...bp, ...updates, updatedAt: new Date().toISOString() } : bp
          ),
        }));
      },

      deleteBlueprint: (id) => {
        set((state) => ({
          blueprints: state.blueprints.filter((bp) => bp.id !== id),
        }));
      },

      addField: (blueprintId, field) => {
        const newField: BlueprintField = {
          ...field,
          id: uuidv4(),
        };
        set((state) => ({
          blueprints: state.blueprints.map((bp) =>
            bp.id === blueprintId
              ? { ...bp, fields: [...bp.fields, newField], updatedAt: new Date().toISOString() }
              : bp
          ),
        }));
      },

      updateField: (blueprintId, fieldId, updates) => {
        set((state) => ({
          blueprints: state.blueprints.map((bp) =>
            bp.id === blueprintId
              ? {
                  ...bp,
                  fields: bp.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f)),
                  updatedAt: new Date().toISOString(),
                }
              : bp
          ),
        }));
      },

      removeField: (blueprintId, fieldId) => {
        set((state) => ({
          blueprints: state.blueprints.map((bp) =>
            bp.id === blueprintId
              ? {
                  ...bp,
                  fields: bp.fields.filter((f) => f.id !== fieldId),
                  updatedAt: new Date().toISOString(),
                }
              : bp
          ),
        }));
      },

      getBlueprint: (id) => {
        return get().blueprints.find((bp) => bp.id === id);
      },
    }),
    {
      name: 'blueprint-storage',
    }
  )
);
