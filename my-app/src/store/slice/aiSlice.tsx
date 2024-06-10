import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatPart {
  text: string;
}

interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
}

interface AIState {
  changed: boolean;
  day: any;
  chat: ChatMessage[];
}

const initialState: AIState = {
  changed: false,
  day: null,
  chat: [],
};

interface ViewDayPayload {
  change: boolean;
  day: any;
  chat: ChatMessage[];
}

interface SetChatPayload {
  userChat: ChatMessage;
  modelAns: ChatMessage;
}

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    viewDay: (state, action: PayloadAction<ViewDayPayload>) => {
      state.changed = action.payload.change;
      state.day = action.payload.day;
      state.chat = action.payload.chat;
    },
    removeAll: (state) => {
      state.changed = false;
      state.day = null;
      state.chat = [];
    },
    setChat: (state, action: PayloadAction<any>) => {
      state.chat = [
        ...state.chat,
        action.payload.userChat,
        action.payload.modelAns,
      ];
    },
  },
});

export const { viewDay, removeAll, setChat } = aiSlice.actions;

export default aiSlice.reducer;
