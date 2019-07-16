import { productConstants } from '../constants/product';

export function product (state = { selectedProduct: 0, products: [] }, action) {
  switch (action.type) {
    case productConstants.PRODUCT_SELECT_SUCCESS:
      return {
        selectedProduct: action.index,
        products: state.products
      };
    case productConstants.PRODUCT_SELECT_FAILURE:
      return state;
    case productConstants.PRODUCT_GET_PRODUCTS_SUCCESS:
      return {
        selectedProduct: state.selectedProduct,
        products: action.products
      };
    case productConstants.PRODUCT_GET_PRODUCTS_FAILURE:
      return state;
    default:
      return state;
  }
}