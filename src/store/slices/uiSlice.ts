import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCreateTripModalOpen: boolean;
  isLoading: boolean;
  currentFilter: string;
  searchQuery: string;
}

const initialState: UIState = {
  isCreateTripModalOpen: false,
  isLoading: false,
  currentFilter: 'all',
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCreateTripModal: (state) => {
      state.isCreateTripModalOpen = true;
    },
    closeCreateTripModal: (state) => {
      state.isCreateTripModalOpen = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.currentFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  openCreateTripModal,
  closeCreateTripModal,
  setLoading,
  setFilter,
  setSearchQuery,
} = uiSlice.actions;

export default uiSlice.reducer;
