import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import opportunitiesReducer from './slices/opportunitiesSlice';
import applicationsReducer from './slices/applicationsSlice';

// Configure persistence for auth slice (to keep user logged in)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['currentUser', 'userType'], // only persist user data, not loading or error states
};

// Root reducer with persistence
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  opportunities: opportunitiesReducer,
  applications: applicationsReducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types since they might contain non-serializable values
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persisted store
export const persistor = persistStore(store);