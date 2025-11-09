import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import budgetReducer from './slices/budgetSlice';
import expenseReducer from './slices/expenseSlice';
import categoryReducer from './slices/categorySlice';
import templateReducer from './slices/templateSlice';
import chatbotReducer from './slices/chatbotSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // budget: budgetReducer,
    expense: expenseReducer,
    category: categoryReducer,
    template: templateReducer,
    chatbot: chatbotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

