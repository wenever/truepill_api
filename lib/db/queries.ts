import connection = require('./connection');

const getProductsQuery = async () => {
  const response = await connection.promise().query(`SELECT * FROM product`);

  return response[0];
};

const getProductQuery = async (name: string) => {
  const response = await connection.promise().query(`SELECT * FROM product WHERE product_name='${name}'`);

  return response[0][0];
};

const updateProductQuery = async (name: string, update: string) => {
  const response = await connection.promise().query(`UPDATE product SET ${update} WHERE product_name='${name}'`);

  return response[0].affectedRows;
};

module.exports = {
  getProductsQuery,
  getProductQuery,
  updateProductQuery
};
