const Product = require('../models/productModel');
const mongoose = require('mongoose');

exports.getAllProducts = (req, res, next) => {
    // .exec() to make it a promise
    Product.find()
        .select('_id name price productImage')
        .exec()
        .then(docs => {
            const response = {
                count : docs.length,
                products : docs.map(doc => {
                    return {
                        name : doc.name,
                        price : doc.price,
                        productImage : doc.productImage,
                        _id : doc._id,
                        request : {
                            type : 'GET',
                            url : `http://localhost:${process.env.PORT}/products/${doc._id}`
                        }
                    }
                })
            }

            // if (docs.length >= 0) {
            //     res.status(200).json(docs);
            // } else {
            //     res.status(404).json({ message : "No entries found!"});
            // }

            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error : err});
        });
};

exports.createProduct = (req, res, next) => {
    // create new instance of product
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : req.file.path
    });

    // store object into database
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message : "Product created successfully",
                createdProduct : {
                    _id : result._id,
                    name : result.name,
                    price : result.price,
                    productImage : result.productImage,
                    request : {
                        type : 'GET',
                        url : `http://localhost:${process.env.PORT}/products/${result._id}`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error : err });
        });
};

exports.getProductById = (req, res, next) => {

    const { productId } = req.params;

    Product.findById(productId)
        .select('_id name price productImage')
        .exec()
        .then(doc => {
            console.log("From Mongo: ", doc);

            if (doc) {
                res.status(200).json({
                    product : doc,
                    request : {
                        type : 'GET',
                        description : 'Get all products',
                        url : `http://localhost:${process.env.PORT}/products`
                    } 
                });
            } else {
                res.status(404).json({ message : 'No product found for such productId' });
            } 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error : err });
        });
};

exports.updateProductById =  (req, res, next) => {
    const { productId } = req.params;
    const { name, price } = req.body;
    Product.updateOne({ _id : productId}, { $set : { name, price }})
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Product updated successfully!',
                request : {
                    type : 'GET',
                    url : `http://localhost:${process.env.PORT}/products/${productId}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error : err });
        });
};

exports.deleteProductById =  (req, res, next) => {
    const { productId } = req.params;
    Product.remove({ _id : productId })
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Product deleted successfully!',
                request : {
                    type : 'POST',
                    url : `http://localhost:${proces.env.PORT}/products`,
                    body : { name : 'String', price : 'Number'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error : err });
        });
};