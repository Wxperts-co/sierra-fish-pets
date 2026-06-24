import { Cart, Product } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Cart = {
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
};

const calculateTotals = (cart: Cart) => {
    cart.subtotal = cart.items.reduce(
        (sum,item) => sum + item.product.price*item.quantity,0
    );

    cart.total = cart.subtotal - cart.discount + cart.shipping;
};

const cartSlice= createSlice({
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
                item=> item.product.id === product.id
            );

            if(existingItem){
                existingItem.quantity += qty;
            }else{
                state.items.push({
                    product,
                    quantity: qty,
                });
            }
            calculateTotals(state);
        },

        removeFromCart: (state, action: PayloadAction<string>) =>{
            state.items = state.items.filter(
                item=> item.product.id !== action.payload
            );
            calculateTotals(state);
        },

        updateQuantity : (state, action: PayloadAction<{
            productId: string;
            quantity: number;
        }>) =>{
            const item = state.items.find(
                item => item.product.id === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
                calculateTotals(state);
            }
        },

        clearCart: (state) => {
            state.items = [];
            state.subtotal = 0;
            state.discount = 0;
            state.shipping = 0;
            state.total = 0;
            delete state.couponCode;
        },

        initializeCart: (state, action: PayloadAction<Cart>) => {
            state.items = action.payload.items || [];
            state.subtotal = action.payload.subtotal || 0;
            state.discount = action.payload.discount || 0;
            state.shipping = action.payload.shipping || 0;
            state.total = action.payload.total || 0;
            if (action.payload.couponCode) {
                state.couponCode = action.payload.couponCode;
            } else {
                delete state.couponCode;
            }
        }
    }
})

export const {addToCart, removeFromCart, updateQuantity, clearCart, initializeCart} = cartSlice.actions;
export default cartSlice.reducer;