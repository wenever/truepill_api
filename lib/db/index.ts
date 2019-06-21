import connection = require('./connection');
const { getProductsQuery, getProductQuery, updateProductQuery } = require('./queries');

module.exports = {
  connection,
  getProductsQuery,
  getProductQuery,
  updateProductQuery
};
