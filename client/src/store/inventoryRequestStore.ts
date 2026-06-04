import create from 'zustand';
import type { User } from '../types';

/**
 * Inventory restock request structure.
 * Matches the shape used in the WorkerInventory component.
 */
interface InventoryRequest {
  id: string;
  requester: {
    id: string;
    name: string;
    role: string;
    phone?: string;
  };
  items: string; // comma‑separated list for persistence
  notes?: string; // optional urgency notes from the worker
  agency?: {
    id: string;
    name: string;
    contact: string;
  };
  status: 'pending' | 'fulfilled';
  fulfilledById?: string;
  fulfilledByName?: string;
}

interface InventoryRequestStore {
  requests: InventoryRequest[];
  /**
   * Add a new restock request.
   * The component passes an object containing `requester`, `items` (array), optional `notes` and optional `agency`.
   */
  addRequest: (payload: {
    requester: { id: string; name: string; role: string; phone?: string };
    items: string[];
    notes?: string;
    agency?: { id: string; name: string; contact: string };
  }) => void;
  fulfillRequest: (id: string, admin: User) => void;
}

export const useInventoryRequestStore = create<InventoryRequestStore>((set) => ({
  requests: [],
  addRequest: ({ requester, items, notes, agency }) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          id: `req-${Date.now()}`,
          requester,
          items: items.join(', '),
          notes,
          agency,
          status: 'pending',
        },
      ],
    })),
  fulfillRequest: (id, admin) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === id
          ? { ...r, status: 'fulfilled', fulfilledById: admin._id, fulfilledByName: admin.name }
          : r
      ),
    })),
}));
