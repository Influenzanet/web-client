import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, ContactPreferences } from '../../types/user';
import { TokenResponse } from '../../types/auth-api';
import { updateObject } from '../utils';

export interface UserState {
  currentUser: User,
  selectedProfileId: string,
}

const initialState: UserState = {
  currentUser: {
    id: '',
    account: {
      type: '',
      accountId: '',
      accountConfirmedAt: 0,
      preferredLanguage: 'en',
    },
    roles: [],
    timestamps: {
      createdAt: 0,
      updatedAt: 0,
      lastLogin: 0,
      lastTokenRefresh: 0,
    },
    profiles: [],
    contactPreferences: {
      subscribedToNewsletter: false,
      sendNewsletterTo: [],
    } as ContactPreferences,
    contactInfos: [],
  } as User,
  selectedProfileId: "",
} as UserState;

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
      return state;
    },
    initializeLanguage: (state, action: PayloadAction<string>) => {
      if (state.currentUser.account.preferredLanguage === '') {
        state.currentUser.account.preferredLanguage = action.payload;
        return state;
      } else {
        return state;
      }
    },
    setState: (state, action: PayloadAction<UserState>) => {
      return updateObject(state, action.payload as UserState);
    },
    setFromTokenResponse: (state, action: PayloadAction<TokenResponse>) => {
      state.currentUser.profiles = action.payload.profiles;
      state.currentUser.account.preferredLanguage = action.payload.preferredLanguage;
      state.selectedProfileId = action.payload.selectedProfileId;
      return state;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      return state;
    },
    setUserID: (state, action: PayloadAction<string>) => {
      state.currentUser.account.accountId = action.payload;
      return state;
    },
    setPreferredLanguage: (state, action: PayloadAction<string>) => {
      state.currentUser.account.preferredLanguage = action.payload;
      return state;
    },
    setSelectedProfileID: (state, action: PayloadAction<string>) => {
      state.selectedProfileId = action.payload;
      return state;
    }
  },
});

export const userActions = userSlice.actions;

export default userSlice;
