import { DoctorStore, createDoctorStore } from "@/stores/DoctorStore";

import { create } from "zustand";

export type AppState = DoctorStore;

export const useProjectStore = create<AppState>((set, get, store) => ({
  ...createDoctorStore(set, get, store),
}));
