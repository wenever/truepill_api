CREATE DATABASE truepill;

USE truepill;

CREATE TABLE product (
  product_name VARCHAR(32) ,
  product_current_count INT,
  product_manual_count INT,
  PRIMARY KEY(product_name)
);
