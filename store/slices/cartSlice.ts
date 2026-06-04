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
        addToCart: (state, action: PayloadAction<Product>) =>{
            const existingItem = state.items.find(
                item=> item.product.id === action.payload.id
            );

            if(existingItem){
                existingItem.quantity += 1;
            }else{
                state.items.push({
                    product: action.payload,
                    quantity: 1,
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
        }
    }
})

export const {addToCart, removeFromCart, updateQuantity} = cartSlice.actions;
export default cartSlice.reducer;