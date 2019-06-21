import express = require('express');
const createError = require('http-errors');

const { getProducts, removeStock, bulkUpdates } = require('../controllers');

const apiRouter = express.Router();

apiRouter
  .route('/products')
  .get(getProducts)
  .patch(bulkUpdates);

apiRouter.route('/products/:name').patch(removeStock);

apiRouter.route('*').all([
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Unknown ', req.protocol + '://' + req.get('host') + req.originalUrl);
    next(createError(404, 'Unknown API'));
  }
]);

module.exports = apiRouter;
