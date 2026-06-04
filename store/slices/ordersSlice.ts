import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "@/types";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
};

const ordersSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    setOrders: (
      state,
      action: PayloadAction<Order[]>
    ) => {
      state.orders = action.payload;
    },

    addOrder: (
      state,
      action: PayloadAction<Order>
    ) => {
      state.orders.unshift(action.payload);
    },

    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find(
        (o) => o.id === action.payload.orderId
      );
      if (order) {
        order.status = action.payload.status;
      }
    },

    setSelectedOrder: (
      state,
      action: PayloadAction<Order | null>
    ) => {
      state.selectedOrder = action.payload;
    },

    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },

    setOrdersLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },

    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
    },
  },
});

export const {
  setOrders,
  addOrder,
  updateOrderStatus,
  setSelectedOrder,
  clearSelectedOrder,
  setOrdersLoading,
  clearOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
