const express = require("express");
const Product = require("../models/product");
const authenticate = require("../authenticate");
const cors = require("./cors");

const productRouter = express.Router();

productRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Product.find()
      .populate("comments.author")
      .then((products) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(products);
      })
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Product.create(req.body)
        .then((product) => {
          console.log("Product Created ", product);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(product);
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /products");
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Product.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

productRouter
  .route("/:productId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Product.findById(req.params.productId)
      .populate("comments.author")
      .then((product) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(product);
      })
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /products/${req.params.productId}`
      );
    }
  )

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Product.findByIdAndUpdate(
        req.params.productId,
        {
          $set: req.body,
        },
        { new: true }
      )
        .then((product) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(product);
        })
        .catch((err) => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Product.findByIdAndDelete(req.params.productId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

productRouter
  .route("/:productId/comments")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Product.findById(req.params.productId)
      .populate("comments.author")
      .then((product) => {
        if (product) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(product.comments);
        } else {
          (err) => new Error(`Product ${req.params.productId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
      .then((product) => {
        if (product) {
          req.body.author = req.user._id;
          product.comments.push(req.body);
          product
            .save()
            .then(() => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(product.comments);
            })
            .catch((err) => next(err));
        } else {
          (err) => new Error(`Product ${req.params.productId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /products/${req.params.productId}/comments`
      );
    }
  )

  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Product.findById(req.params.productId)
        .then((product) => {
          if (product) {
            for (let i = product.comments.length - 1; i >= 0; i--) {
              product.comments.id(product.comments[i]._id).remove();
            }
            campsite
              .save()
              .then((product) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(product.comments);
              })
              .catch((err) => next(err));
          } else {
            (err) => new Error(`Product ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

productRouter
  .route("/:productId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Product.findById(req.params.productId)
      .populate("comments.author")
      .then((product) => {
        if (product && product.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(product.comments.id(req.params.productId));
        } else if (!product) {
          (err) => new Error(`Product ${req.params.productId} not found`);
          err.status = 404;
          return next(err);
        } else {
          (err) => new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(`POST operation not supported on /products/${req.params.productId}/comments/
    ${req.params.commentId}`);
    }
  )

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
      .then((product) => {
        if (product && product.comments.id(req.params.commentId)) {
          if (
            product.comments
              .id(req.params.commentId)
              .author._id.equals(req.user._id)
          ) {
            if (req.body.rating) {
              product.comments.id(req.params.commentId).rating =
                req.body.rating;
            }
            if (req.body.text) {
              product.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite
              .save()
              .then((product) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(product);
              })
              .catch((err) => next(err));
          } else {
            const error = new Error("Not Authorized");
            error.status = 403;
            return next();
          }
        } else if (!product) {
          err = new Error(`Product ${req.params.productId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
      .then((product) => {
        if (product && product.comments.id(req.params.commentId)) {
          if (
            product.comments
              .id(req.params.commentId)
              .author._id.equals(req.user._id)
          ) {
            product.comments.id(req.params.commentId).remove();
            campsite
              .save()
              .then((product) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(product);
              })
              .catch((err) => next(err));
          } else {
            const error = new Error("Not Authorized");
            error.status = 403;
            return next();
          }
        } else if (!product) {
          err = new Error(`Product ${req.params.productId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
//trying to figure out correct folder location
module.exports = productRouter;
