import { Cart, Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateCartShippingAndTax } from "@/lib/shippingAndTax";

const initialState: Cart = {
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    fulfillmentMethod: "shipping",
};

const calculateTotals = (cart: Cart) => {
    cart.subtotal = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const { shippingCost, taxAmount } = calculateCartShippingAndTax(
        cart.items,
        cart.fulfillmentMethod || "shipping"
    );

    cart.shipping = shippingCost;
    cart.tax = taxAmount;
    const netSubtotal = Math.max(0, cart.subtotal - cart.discount);
    cart.total = netSubtotal + cart.shipping + cart.tax;
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product | { product: Product; quantity: number }>) => {
            let product: Product;
            let qty = 1;

            if ("product" in action.payload) {
                product = action.payload.product;
                qty = action.payload.quantity;
            } else {
                product = action.payload;
            }

            const existingItem = state.items.find(
                (item) => item.product.id === product.id
            );

            if (existingItem) {
                existingItem.quantity += qty;
            } else {
                state.items.push({
                    product,
                    quantity: qty,
                });
            }
            calculateTotals(state);
        },

        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(
                (item) => item.product.id !== action.payload
            );
            calculateTotals(state);
        },

        updateQuantity: (
            state,
            action: PayloadAction<{
                productId: string;
                quantity: number;
            }>
        ) => {
            const item = state.items.find(
                (item) => item.product.id === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
                calculateTotals(state);
            }
        },

        setFulfillmentMethod: (state, action: PayloadAction<"shipping" | "pickup">) => {
            state.fulfillmentMethod = action.payload;
            calculateTotals(state);
        },

        applyCoupon: (state, action: PayloadAction<{ code: string; discountAmount: number }>) => {
            state.couponCode = action.payload.code;
            state.discount = action.payload.discountAmount;
            calculateTotals(state);
        },

        removeCoupon: (state) => {
            delete state.couponCode;
            state.discount = 0;
            calculateTotals(state);
        },

        clearCart: (state) => {
            state.items = [];
            state.subtotal = 0;
            state.discount = 0;
            state.shipping = 0;
            state.tax = 0;
            state.total = 0;
            state.fulfillmentMethod = "shipping";
            delete state.couponCode;
        },

        initializeCart: (state, action: PayloadAction<Cart>) => {
            state.items = action.payload.items || [];
            state.subtotal = action.payload.subtotal || 0;
            state.discount = action.payload.discount || 0;
            state.fulfillmentMethod = action.payload.fulfillmentMethod || "shipping";
            calculateTotals(state);
            if (action.payload.couponCode) {
                state.couponCode = action.payload.couponCode;
            } else {
                delete state.couponCode;
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    setFulfillmentMethod,
    applyCoupon,
    removeCoupon,
    clearCart,
    initializeCart,
} = cartSlice.actions;
export default cartSlice.reducer;