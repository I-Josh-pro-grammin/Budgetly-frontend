import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
  budget_percentage: number;
  icon?: string;
  group?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryGroup {
  id: number;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryStats {
  total_categories: number;
  categories_by_type: Array<{
    type: string;
    count: number;
  }>;
  budget_allocation: Array<{
    category: string;
    percentage: number;
    amount: number;
  }>;
}

export interface CategoryState {
  categories: Category[];
  groups: CategoryGroup[];
  stats: CategoryStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  groups: [],
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (categoryData: {
    name: string;
    type: string;
    color: string;
    budget_percentage: number;
    icon?: string;
    group?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/categories/', categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, categoryData }: { id: number; categoryData: Partial<Category> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/categories/${id}/`, categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/categories/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete category');
    }
  }
);

export const fetchCategoryGroups = createAsyncThunk(
  'category/fetchGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories/groups/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category groups');
    }
  }
);

export const createCategoryGroup = createAsyncThunk(
  'category/createGroup',
  async (groupData: {
    name: string;
    description?: string;
    color: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/categories/groups/', groupData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create category group');
    }
  }
);

export const fetchCategoryStats = createAsyncThunk(
  'category/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/categories/stats/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category stats');
    }
  }
);

export const bulkUpdateCategories = createAsyncThunk(
  'category/bulkUpdate',
  async (updates: Array<{ id: number; data: Partial<Category> }>, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/categories/bulk-update/', { updates });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to bulk update categories');
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Category
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories.push(action.payload);
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.categories.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c.id !== action.payload);
      })
      
      // Fetch Groups
      .addCase(fetchCategoryGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Group
      .addCase(createCategoryGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      
      // Fetch Stats
      .addCase(fetchCategoryStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Bulk Update
      .addCase(bulkUpdateCategories.fulfilled, (state, action) => {
        action.payload.forEach((updatedCategory: Category) => {
          const index = state.categories.findIndex(c => c.id === updatedCategory.id);
          if (index !== -1) {
            state.categories[index] = updatedCategory;
          }
        });
      });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer;

