import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface CategoriesState {
  categories: any[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
}

const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
  fetched: false,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success && Array.isArray(data.categories)) {
      const sorted = [...data.categories].sort((a: any, b: any) => {
        const aIsOther = String(a.slug || "").includes("other") || String(a.name || "").toLowerCase().includes("other");
        const bIsOther = String(b.slug || "").includes("other") || String(b.name || "").toLowerCase().includes("other");
        if (aIsOther && !bIsOther) return 1;
        if (!aIsOther && bIsOther) return -1;
        return 0;
      });
      return sorted;
    }
    return [];
  },
  {
    condition: (_, { getState }: any) => {
      const state = getState();
      const { fetched, loading } = state.categories || {};
      if (fetched || loading) {
        return false;
      }
      return true;
    },
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.fetched = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });
  },
});

export default categoriesSlice.reducer;
