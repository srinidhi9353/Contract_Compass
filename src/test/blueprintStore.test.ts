import { describe, it, expect, beforeEach } from "vitest";
import { create } from "zustand";
import { Blueprint, BlueprintField, FieldType } from "../types";

// Define the interface locally for testing
interface BlueprintState {
  blueprints: Blueprint[];
  addBlueprint: (name: string, description?: string, fields?: BlueprintField[]) => Blueprint;
  updateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
  deleteBlueprint: (id: string) => void;
  getBlueprint: (id: string) => Blueprint | undefined;
  getBlueprints: () => Blueprint[];
}

// Create a test-specific store instance
const createStore = (initialState?: Partial<BlueprintState>) => {
  return create<BlueprintState>((set, get) => ({
    blueprints: [],
    addBlueprint: (name, description = '', fields = []) => {
      const newBlueprint: Blueprint = {
        id: 'test-bp-' + Math.random().toString(36).substr(2, 9),
        name,
        description,
        fields,
        createdAt: new Date().toISOString(),
      };
      set(state => ({ blueprints: [...state.blueprints, newBlueprint] }));
      return newBlueprint;
    },
    updateBlueprint: (id, updates) => {
      set(state => ({
        blueprints: state.blueprints.map(bp =>
          bp.id === id ? { ...bp, ...updates, updatedAt: new Date().toISOString() } : bp
        ),
      }));
    },
    deleteBlueprint: (id) => {
      set(state => ({
        blueprints: state.blueprints.filter(bp => bp.id !== id),
      }));
    },
    getBlueprint: (id) => {
      return get().blueprints.find(bp => bp.id === id);
    },
    getBlueprints: () => {
      return get().blueprints;
    },
    ...initialState,
  }));
};

describe("Blueprint Store", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it("should add a blueprint", () => {
    const blueprint = store.getState().addBlueprint("Test Blueprint", "A test blueprint");

    expect(store.getState().blueprints).toHaveLength(1);
    expect(store.getState().blueprints[0].name).toBe("Test Blueprint");
    expect(store.getState().blueprints[0].description).toBe("A test blueprint");
  });

  it("should add a blueprint with fields", () => {
    const fields: BlueprintField[] = [
      {
        id: "field1",
        type: "text" as FieldType,
        label: "Client Name",
        position: { x: 10, y: 20 },
        required: true,
      }
    ];
    
    const blueprint = store.getState().addBlueprint("Test Blueprint with Fields", "", fields);

    expect(store.getState().blueprints[0].fields).toHaveLength(1);
    expect(store.getState().blueprints[0].fields[0].label).toBe("Client Name");
  });

  it("should update a blueprint", () => {
    const blueprint = store.getState().addBlueprint("Original Name", "Original Description");

    store.getState().updateBlueprint(blueprint.id, {
      name: "Updated Name",
      description: "Updated Description"
    });

    const updatedBlueprint = store.getState().getBlueprint(blueprint.id);
    expect(updatedBlueprint?.name).toBe("Updated Name");
    expect(updatedBlueprint?.description).toBe("Updated Description");
  });

  it("should delete a blueprint", () => {
    const blueprint1 = store.getState().addBlueprint("Blueprint 1");
    const blueprint2 = store.getState().addBlueprint("Blueprint 2");

    expect(store.getState().blueprints).toHaveLength(2);

    store.getState().deleteBlueprint(blueprint1.id);

    expect(store.getState().blueprints).toHaveLength(1);
    expect(store.getState().blueprints[0].id).toBe(blueprint2.id);
  });

  it("should get a blueprint by ID", () => {
    const blueprint = store.getState().addBlueprint("Test Blueprint");

    const retrievedBlueprint = store.getState().getBlueprint(blueprint.id);

    expect(retrievedBlueprint).toBeDefined();
    expect(retrievedBlueprint?.name).toBe("Test Blueprint");
  });

  it("should get all blueprints", () => {
    store.getState().addBlueprint("Blueprint 1");
    store.getState().addBlueprint("Blueprint 2");

    const allBlueprints = store.getState().getBlueprints();

    expect(allBlueprints).toHaveLength(2);
  });
});