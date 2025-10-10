import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface Expense {
  id: number;
  user: number;
  category: number;
  amount: number;
  description: string;
  date: string;
  expense_type: string;
  payment_method: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  recurring_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: number;
  name: string;
  type: string;
  color: string;
  budget_percentage: number;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStats {
  total_expenses: number;
  monthly_expenses: number;
  category_breakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  trend_data: Array<{
    month: string;
    amount: number;
  }>;
}

export interface ExpenseState {
  expenses: Expense[];
  categories: ExpenseCategory[];
  stats: ExpenseStats | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    startDate: string | null;
    endDate: string | null;
    category: number | null;
    minAmount: number | null;
    maxAmount: number | null;
  };
}

const initialState: ExpenseState = {
  expenses: [],
  categories: [],
  stats: null,
  isLoading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    category: null,
    minAmount: null,
    maxAmount: null,
  },
};

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/expenses/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData: {
    category: number;
    amount: number;
    description: string;
    date: string;
    expense_type: string;
    payment_method: string;
    is_recurring?: boolean;
    recurring_frequency?: string;
    recurring_end_date?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/expenses/', expenseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ id, expenseData }: { id: number; expenseData: Partial<Expense> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/expenses/${id}/`, expenseData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/expenses/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete expense');
    }
  }
);

export const fetchExpenseCategories = createAsyncThunk(
  'expense/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const createExpenseCategory = createAsyncThunk(
  'expense/createCategory',
  async (categoryData: {
    name: string;
    type: string;
    color: string;
    budget_percentage: number;
    icon?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/categories/', categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create category');
    }
  }
);

export const fetchExpenseStats = createAsyncThunk(
  'expense/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/expenses/stats/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch expense stats');
    }
  }
);

export const fetchFilteredExpenses = createAsyncThunk(
  'expense/fetchFiltered',
  async (filters: {
    start_date?: string;
    end_date?: string;
    category?: number;
    min_amount?: number;
    max_amount?: number;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/api/expenses/?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch filtered expenses');
    }
  }
);

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<ExpenseState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        category: null,
        minAmount: null,
        maxAmount: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Expense
      .addCase(createExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses.push(action.payload);
        state.error = null;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Expense
      .addCase(updateExpense.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(e => e.id !== action.payload);
      })
      
      // Fetch Categories
      .addCase(fetchExpenseCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Category
      .addCase(createExpenseCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      
      // Fetch Stats
      .addCase(fetchExpenseStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenseStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchExpenseStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Filtered Expenses
      .addCase(fetchFilteredExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFilteredExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload;
        state.error = null;
      })
      .addCase(fetchFilteredExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters } = expenseSlice.actions;
export default expenseSlice.reducer;

