const testDb = require('./test-db.json');
import '../../lib/models/product';

const truncateProducts = async () => {
  await connection.promise().query('TRUNCATE TABLE product');
};

// POINT TO TEST DATABASE
process.env.PORT = '4242';
process.env.DB_NAME = process.env.TEST_DB_NAME || process.env.DB_NAME;

// RESET TEST DATABASE
const { connection } = require('../../lib/db');
truncateProducts();

const insert = async (row: product) => {
  const result = await connection
    .promise()
    .query(
      `INSERT INTO product (product_name, product_current_count, product_manual_count) VALUES ('${row.product_name}',${
        row.product_current_count
      },${row.product_manual_count});`
    );
};

for (let row of testDb) {
  insert(row);
}
