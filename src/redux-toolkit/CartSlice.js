
// cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cart")) || [],

  },
  reducers: {
    fetchCartProducts: (state, action) => {
      state.items = (action.payload);
    },

    addItem: (state, action) => {
      const ItemIndex = state.items.findIndex(
        (item) => item.productCode === action.payload.productCode
      );

      if (ItemIndex >= 0) {
        if (action.payload?.quantity > state.items[ItemIndex].unit) {

          state.items[ItemIndex].unit += 1;

        } else {
          notification.warning({
            placement: "topRight",
            message: "User Selected  Qty. not available! ",
          });
        }

      }
    },

    // Remove item quantity from cart
    removeCartItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.productCode === action.payload.productCode
      );
      const lastIndex = state.items.length - 1;
      const allExceptLastZero = state.items.slice(0, lastIndex).every(item => item.unit === 0);
      const lastItemUnitOne = state.items[lastIndex].unit === 1;

      // Ensure no notification when all items have unit === 0
      console.log("dfsfsfsffsdf hpahakddf",state.items);
      const allZero = state.items.every(item => console.log("sachin pathak",item));

      if (allExceptLastZero && lastItemUnitOne && !allZero) {
        notification.warning({
          placement: "topRight",
          message: "Partial Return Not Allowed, Cancel This Order!",
        });
      }

      else if (itemIndex >= 0 && state.items[itemIndex].unit > 0) {
        // Decrease quantity if unit is greater than 0
        state.items[itemIndex].unit -= 1;

      } else if (state.items[itemIndex].unit === 0) {
        state.items = state.items.filter(
          (item) => item.productCode !== action.payload.productCode
        );
      }
    },

    //cleaer item from cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeCartItem, clearCart, fetchCartProducts } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;


export default cartSlice.reducer;

