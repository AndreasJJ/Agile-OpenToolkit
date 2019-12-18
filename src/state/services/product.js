export const productService = {
  selectProduct,
  selectProductRecalibration,
  getProducts
};

// Set's the selected product index
async function selectProduct (index) {
  return index;
}

// Set's the selected product index (used for recalibration. Not really sure if i actually use it lol)
async function selectProductRecalibration (index) {
  return index;
}

// Gets the products from the store
async function getProducts (products) {
  return products;
}
