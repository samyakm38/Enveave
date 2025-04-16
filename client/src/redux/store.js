import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import opportunitiesReducer from './slices/opportunitiesSlice';
import applicationsReducer from './slices/applicationsSlice';
import providerProfileReducer from './slices/providerProfileSlice';
import chatbotReducer from './slices/chatbotSlice';
import adminReducer from './slices/adminSlice';
import volunteerReducer from './slices/volunteerSlice';

// Configure persistence for auth slice (to keep user logged in)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['currentUser', 'userType', 'token'], // Now also persisting token
};

// Root reducer with persistence
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  opportunities: opportunitiesReducer,
  applications: applicationsReducer,
  providerProfile: providerProfileReducer,
  chatbot: chatbotReducer,
  admin: adminReducer,
  volunteer: volunteerReducer,
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