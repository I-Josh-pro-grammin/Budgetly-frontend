import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface BudgetTemplate {
  id: number;
  name: string;
  description: string;
  template_type: string;
  period: string;
  total_amount: number;
  rating: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateCategory {
  id: number;
  template: number;
  category: number;
  allocated_percentage: number;
  allocated_amount: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateReview {
  id: number;
  template: number;
  user: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateState {
  templates: BudgetTemplate[];
  templateCategories: TemplateCategory[];
  reviews: TemplateReview[];
  currentTemplate: BudgetTemplate | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  templateCategories: [],
  reviews: [],
  currentTemplate: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'template/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/templates/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch templates');
    }
  }
);

export const fetchTemplateById = createAsyncThunk(
  'template/fetchTemplateById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/templates/${id}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch template');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'template/createTemplate',
  async (templateData: {
    name: string;
    description: string;
    template_type: string;
    period: string;
    total_amount: number;
    categories: Array<{
      category: number;
      allocated_percentage: number;
    }>;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/templates/', templateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create template');
    }
  }
);

export const updateTemplate = createAsyncThunk(
  'template/updateTemplate',
  async ({ id, templateData }: { id: number; templateData: Partial<BudgetTemplate> }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/templates/${id}/`, templateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update template');
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  'template/deleteTemplate',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/templates/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete template');
    }
  }
);

export const fetchTemplateCategories = createAsyncThunk(
  'template/fetchTemplateCategories',
  async (templateId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/templates/${templateId}/categories/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch template categories');
    }
  }
);

export const fetchTemplateReviews = createAsyncThunk(
  'template/fetchTemplateReviews',
  async (templateId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/templates/${templateId}/reviews/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch template reviews');
    }
  }
);

export const createTemplateReview = createAsyncThunk(
  'template/createTemplateReview',
  async ({ templateId, reviewData }: {
    templateId: number;
    reviewData: {
      rating: number;
      comment: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/templates/${templateId}/reviews/`, reviewData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create template review');
    }
  }
);

export const searchTemplates = createAsyncThunk(
  'template/searchTemplates',
  async (searchParams: {
    query?: string;
    template_type?: string;
    period?: string;
    min_rating?: number;
    max_amount?: number;
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await api.get(`/api/templates/search/?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to search templates');
    }
  }
);

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTemplate: (state, action: PayloadAction<BudgetTemplate | null>) => {
      state.currentTemplate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Template By ID
      .addCase(fetchTemplateById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTemplate = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Template
      .addCase(createTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates.push(action.payload);
        state.error = null;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.currentTemplate?.id === action.payload.id) {
          state.currentTemplate = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Template
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
        if (state.currentTemplate?.id === action.payload) {
          state.currentTemplate = null;
        }
      })
      
      // Fetch Template Categories
      .addCase(fetchTemplateCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templateCategories = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplateCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Template Reviews
      .addCase(fetchTemplateReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTemplateReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
        state.error = null;
      })
      .addCase(fetchTemplateReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Template Review
      .addCase(createTemplateReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      
      // Search Templates
      .addCase(searchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(searchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentTemplate } = templateSlice.actions;
export default templateSlice.reducer;

