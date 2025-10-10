import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../api';

// Types
export interface ChatMessage {
  id: number;
  session: number;
  user_message: string;
  bot_response: string;
  message_type: string;
  timestamp: string;
  is_read: boolean;
}

export interface ChatSession {
  id: number;
  user: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatbotKnowledge {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatbotState {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  knowledge: ChatbotKnowledge[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
}

const initialState: ChatbotState = {
  messages: [],
  sessions: [],
  currentSession: null,
  knowledge: [],
  isLoading: false,
  error: null,
  isTyping: false,
};

// Async thunks
export const fetchChatSessions = createAsyncThunk(
  'chatbot/fetchChatSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/chatbot/sessions/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chat sessions');
    }
  }
);

export const createChatSession = createAsyncThunk(
  'chatbot/createChatSession',
  async (sessionData: {
    title: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/chatbot/sessions/', sessionData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create chat session');
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chatbot/fetchChatMessages',
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/chatbot/sessions/${sessionId}/messages/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chat messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ sessionId, message }: {
    sessionId: number;
    message: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/chatbot/sessions/${sessionId}/messages/`, {
        user_message: message,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to send message');
    }
  }
);

export const deleteChatSession = createAsyncThunk(
  'chatbot/deleteChatSession',
  async (sessionId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/api/chatbot/sessions/${sessionId}/`);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete chat session');
    }
  }
);

export const fetchChatbotKnowledge = createAsyncThunk(
  'chatbot/fetchKnowledge',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/chatbot/knowledge/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch chatbot knowledge');
    }
  }
);

export const searchKnowledge = createAsyncThunk(
  'chatbot/searchKnowledge',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/chatbot/knowledge/search/?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to search knowledge');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'chatbot/markMessageAsRead',
  async (messageId: number, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/chatbot/messages/${messageId}/`, {
        is_read: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to mark message as read');
    }
  }
);

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSession: (state, action: PayloadAction<ChatSession | null>) => {
      state.currentSession = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chat Sessions
      .addCase(fetchChatSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        state.error = null;
      })
      .addCase(fetchChatSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Chat Session
      .addCase(createChatSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.push(action.payload);
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Chat Messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload as string;
      })
      
      // Delete Chat Session
      .addCase(deleteChatSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s.id !== action.payload);
        if (state.currentSession?.id === action.payload) {
          state.currentSession = null;
          state.messages = [];
        }
      })
      
      // Fetch Chatbot Knowledge
      .addCase(fetchChatbotKnowledge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatbotKnowledge.fulfilled, (state, action) => {
        state.isLoading = false;
        state.knowledge = action.payload;
        state.error = null;
      })
      .addCase(fetchChatbotKnowledge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Search Knowledge
      .addCase(searchKnowledge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchKnowledge.fulfilled, (state, action) => {
        state.isLoading = false;
        state.knowledge = action.payload;
        state.error = null;
      })
      .addCase(searchKnowledge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Mark Message As Read
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      });
  },
});

export const { 
  clearError, 
  setCurrentSession, 
  setIsTyping, 
  addMessage, 
  clearMessages 
} = chatbotSlice.actions;
export default chatbotSlice.reducer;

