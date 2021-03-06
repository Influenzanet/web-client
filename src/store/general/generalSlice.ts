import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateObject } from '../utils';

export interface GeneralState {
  instanceId: string;
  persistState: boolean;
}

const initialState: GeneralState = {
  instanceId: process.env.REACT_APP_DEFAULT_INSTANCE ? process.env.REACT_APP_DEFAULT_INSTANCE : 'default',
  persistState: false,
};

const generalSlice = createSlice({
  name: 'general',
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
      return state;
    },
    setPersistState: (state, action: PayloadAction<boolean>) => {
      return updateObject(state, { persistState: action.payload });
    }
  },
});

export const generalActions = generalSlice.actions;

export default generalSlice;
