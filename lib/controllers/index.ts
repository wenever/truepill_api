import express = require('express');
const createError = require('http-errors');

const socket = require('../socket');
const db = require('../db');
const { validNameRegex } = require('../constants');

// required for tests to pass
import '../models/product';

const getProducts = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const rows: product[] = await db.getProductsQuery();

    res.status(200).json(rows);
  } catch (err) {
    console.log(err);
    return next(createError(500, err));
  }
};

const bulkUpdates = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { body } = req;
  const productUpdates: productUpdate[] = body.productUpdates;
  const forceReset: boolean | undefined = body.forceReset;

  try {
    if (!productUpdates) {
      return next(createError(400, `Invalid request`));
    }

    let updatesError = false;
    const updates = productUpdates.map((product: productUpdate) => {
      const { product_name, product_qty } = product;

      if (updatesError || !product_name || !product_qty || !Number.isInteger(Number(product_qty)) || product_qty < 0) {
        updatesError = true;
        return {};
      }
      let sql: string = '';
      if (forceReset) {
        sql = `product_manual_count=${product_qty},product_current_count=${product_qty}`;
      } else {
        sql = `product_current_count=product_current_count+${product_qty}`;
      }

      return {
        product_name,
        sql
      };
    });

    if (updatesError) {
      return next(createError(400, `Invalid request for ${JSON.stringify(productUpdates)}`));
    }

    let affectedRows = 0;
    for (let update of updates) {
      affectedRows += await db.updateProductQuery(update.product_name, update.sql);
    }

    socket.emit('products');
    res.status(200).json({ affectedRows });
  } catch (err) {
    console.log(err);
    next(createError(500, `Invalid request for ${JSON.stringify(productUpdates)}`));
  }
};

const removeStock = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    params: { name },
    body
  } = req;
  const product_qty: number = body.product_qty;

  try {
    const valid = name && name.match(validNameRegex) && Number.isInteger(product_qty) && product_qty > 0;
    if (!valid) {
      return next(createError(400, `Invalid request for ${name}`));
    }

    // check stock level
    const { product_current_count } = await db.getProductQuery(name);
    if (!product_current_count || product_current_count < product_qty) {
      return next(
        createError(
          400,
          `Insufficient Stock Levels for ${name} : ${product_current_count} to satisfy order of ${product_qty}`
        )
      );
    }

    const updateSql = `product_current_count=product_current_count-${product_qty}`;
    const affectedRows = await db.updateProductQuery(name, updateSql);

    socket.emit('products');
    res.status(200).json({ affectedRows });
  } catch (err) {
    console.log(err);
    next(createError(500, `Invalid request for ${name}`));
  }
};

module.exports = {
  getProducts,
  bulkUpdates,
  removeStock
};
