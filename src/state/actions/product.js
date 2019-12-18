import { productConstants } from '../constants/product';
import { productService } from '../services/product';
import { alertActions } from './alert';

export const productActions = {
  selectProduct,
  selectProductRecalibration,
  getProducts
};

// Set's the selected product index
function selectProduct (index) {
  return dispatch => {
    productService.selectProduct(index)
      .then(
        index => {
          dispatch(success(index));
          location.reload();
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success (index) { return { type: productConstants.PRODUCT_SELECT_SUCCESS, index }; }
  function failure (error) { return { type: productConstants.PRODUCT_SELECT_FAILURE, error }; }
}

// Set's the selected product index (used for recalibration. Not really sure if i actually use it lol)
function selectProductRecalibration (index) {
  return dispatch => {
    productService.selectProductRecalibration(index)
      .then(
        index => {
          dispatch(success(index));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success (index) { return { type: productConstants.PRODUCT_SELECT_RECALIBRATION_SUCCESS, index }; }
  function failure (error) { return { type: productConstants.PRODUCT_SELECT_RECALIBRATION_FAILURE, error }; }
}

// Gets the products from the store
function getProducts (products) {
  return dispatch => {
    productService.getProducts(products)
      .then(
        index => {
          dispatch(success(products));
        },
        error => {
          dispatch(failure(error));
          dispatch(alertActions.error(error));
        }
      );
  };

  function success (products) { return { type: productConstants.PRODUCT_GET_PRODUCTS_SUCCESS, products }; }
  function failure (error) { return { type: productConstants.PRODUCT_GET_PRODUCTS_FAILURE, error }; }
}
