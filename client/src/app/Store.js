import { configureStore } from "@reduxjs/toolkit";
import sliderReducer from "../features/sliderSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userApi } from "../features/userSlice";
import { productApi } from "../features/productSlice";
import cartReducer from "../features/cartSlice";
export const Store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    slider: sliderReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(Store.dispatch);
export default Store;
