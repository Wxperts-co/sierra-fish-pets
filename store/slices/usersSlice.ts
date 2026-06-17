import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

export type AddUserPayload = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

interface UsersState {
  loading: boolean;
  error: string | null;
  success: boolean;
  addedUser: User | null;
}

const initialState: UsersState = {
  loading: false,
  error: null,
  success: false,
  addedUser: null,
};

export const addUser = createAsyncThunk<User, AddUserPayload, { rejectValue: string }>(
  "users/addUser",
  async (payload, { rejectWithValue }) => {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data?.message || "Failed to create user");
    }

    const user = data.user;

    return {
      ...user,
      id: user._id,
    } satisfies User;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetAddUserState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.addedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.success = true;
        state.addedUser = action.payload;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to create user";
      });
  },
});

export const { resetAddUserState } = usersSlice.actions;
export default usersSlice.reducer;
