import { configureStore } from "@reduxjs/toolkit";
import authApis from "./apis/authApis";
import userApis from "./apis/userApis";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import claimsApis from "./apis/claimsApis";
import chatApis from "./apis/chatApis";
import invoiceApis from "./apis/invoiceApis";
import notificationsApis from "./apis/notificationsApis";
import notificationsSlice from "./slices/notificationsSlice";
import paymentApis from "./apis/paymentApis";
import memberApis from "./apis/membersApis";

const store = configureStore({
  reducer: {
    // apis
    [authApis.reducerPath]: authApis.reducer,
    [userApis.reducerPath]: userApis.reducer,
    [claimsApis.reducerPath]: claimsApis.reducer,
    [chatApis.reducerPath]: chatApis.reducer,
    [notificationsApis.reducerPath]: notificationsApis.reducer,
    [memberApis.reducerPath]: memberApis.reducer,
    [invoiceApis.reducerPath]: invoiceApis.reducer,
    [paymentApis.reducerPath]: paymentApis.reducer,

    // slices
    [authSlice.name]: authSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [notificationsSlice.name]: notificationsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false })
      .concat(authApis.middleware)
      .concat(userApis.middleware)
      .concat(claimsApis.middleware)
      .concat(chatApis.middleware)
      .concat(notificationsApis.middleware)
      .concat(memberApis.middleware)
      .concat(invoiceApis.middleware)
      .concat(paymentApis.middleware);
  },
});

export default store;
