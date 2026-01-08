import { createSelector } from "@reduxjs/toolkit";

export const selectSales = state => state.sales.item;

export const selectTotalAmount = createSelector(
  [selectSales],
  (sales) =>
    sales.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
);
