import { expect } from 'chai';
const supertest = require('supertest');

const testDb = require('../test-db.json');
import '../common';
const app = require('../../../lib/app');

describe('GET / - a simple api endpoint', () => {
  let logError: any;

  beforeEach(() => {
    logError = console.error;
    console.error = () => {};
  });

  afterEach(() => {
    console.error = logError;
  });

  it('API Available Request', async () => {
    const agent = supertest.agent(app);
    const result = await agent.get('/');

    expect(result.text).to.equal('API Is Available');
    expect(result.statusCode).to.equal(200);
  });
});

describe('API requests', () => {
  describe('GET requests', () => {
    it('GET products should return test database array', async () => {
      const agent = supertest.agent(app);
      const result = await agent.get('/api/products');

      expect(result.body).to.deep.equal(testDb);
      expect(result.statusCode).to.equal(200);
    });
  });

  describe('bulkupdate', () => {
    describe('successfully update 2 records', () => {
      const product1Qty = 5;
      const product2Qty = 3;

      it('incrementing should respond with 200 and report 2 affected rows', async () => {
        const agent = supertest.agent(app);
        const result = await agent.patch('/api/products').send({
          productUpdates: [
            {
              product_name: 'product1',
              product_qty: product1Qty
            },
            {
              product_name: 'product2',
              product_qty: product2Qty
            }
          ]
        });

        expect(result.statusCode).to.equal(200);
        expect(result.body.affectedRows).to.equal(2);
      });

      it('incrementing should have incremented stock levels in the database', async () => {
        const agent = supertest.agent(app);
        const { body } = await agent.get('/api/products');

        const expectedProduct1Qty = testDb[0].product_current_count + product1Qty;
        const expectedProduct2Qty = testDb[1].product_current_count + product2Qty;

        expect(body[0].product_current_count).to.equal(expectedProduct1Qty);
        expect(body[1].product_current_count).to.equal(expectedProduct2Qty);
      });

      it('resetting should respond with 200 and report 2 affected rows', async () => {
        const agent = supertest.agent(app);
        const result = await agent.patch('/api/products').send({
          productUpdates: [
            {
              product_name: 'product1',
              product_qty: product1Qty
            },
            {
              product_name: 'product2',
              product_qty: product2Qty
            }
          ],
          forceReset: true
        });

        expect(result.statusCode).to.equal(200);
        expect(result.body.affectedRows).to.equal(2);
      });

      it('resetting should reset current & manual counts for both products', async () => {
        const agent = supertest.agent(app);
        const { body } = await agent.get('/api/products');

        const expectedProduct1Qty = product1Qty;
        const expectedProduct2Qty = product2Qty;

        expect(body[0].product_current_count).to.equal(expectedProduct1Qty);
        expect(body[0].product_manual_count).to.equal(expectedProduct1Qty);
        expect(body[1].product_current_count).to.equal(expectedProduct2Qty);
        expect(body[1].product_manual_count).to.equal(expectedProduct2Qty);
      });
    });
  });

  describe('removeStock', () => {
    describe('successfully decrements current count', () => {
      const decrementQty = 5;

      it('decrementing individual product should respond with 200 and report 1 affected row', async () => {
        const agent = supertest.agent(app);
        const result = await agent.patch('/api/products/product3').send({
          product_qty: decrementQty
        });

        expect(result.statusCode).to.equal(200);
        expect(result.body.affectedRows).to.equal(1);
      });

      it('decrementing should have decremented stock levels in the database', async () => {
        const agent = supertest.agent(app);
        const { body } = await agent.get('/api/products');

        const expectedProduct1Qty = testDb[2].product_current_count - decrementQty;

        expect(body[2].product_current_count).to.equal(expectedProduct1Qty);
      });
    });
  });
});
