import { createSlice } from "@reduxjs/toolkit";

interface UIState{
    cartDrawerOpen: boolean;
    mobileMenuOpen: boolean;
}

const initialState: UIState = {
    cartDrawerOpen: false,
    mobileMenuOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggleCartDrawer: (state) =>{
            state.cartDrawerOpen = !state.cartDrawerOpen;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
    },
});

export const { toggleCartDrawer, toggleMobileMenu } = uiSlice.actions;

export default uiSlice.reducer;