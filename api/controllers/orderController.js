const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name') // get only the name and id of product
        .exec()
        .then(docs => {
            res.status(200).json({
                count : docs.length,
                orders : docs.map(doc => {
                    return {
                        _id : doc._id,
                        product : doc.product,
                        quantity : doc.quantity,
                        request : {
                            type : 'GET',
                            url : `http://localhost:${process.env.PORT}/products/${doc._id}`
                        }
                    }
                }),
                
            });
        })
        .catch(err => {
            res.status(500).json({ error : err });
        });
}

exports.createOrder = (req, res, next) => {
    const { productId, quantity } = req.body;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message : 'Product not found!'
                })
            }

            const order = new Order({
                _id : new mongoose.Types.ObjectId(),
                product : productId,
                quantity : quantity
            });
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message : "Order created successfully!",
                order : {
                    _id : result._id,
                    product : result.product,
                    quantity : result.quantity
                },
                request : {
                    type : 'GET',
                    url : `http://localhost:${process.env.PORT}/orders/${result._id}`
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        });
};

exports.getOrderById = (req, res, next) => {
    const { orderId } = req.params;
    Order.findById(orderId)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json({
                order,
                request : {
                    type : 'GET',
                    url : `http://localhost:${process.env.PORT}/orders`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })
};

exports.deleteOrderById = (req, res, next) => {
    const { orderId } = req.params;
    Order.deleteOne({ _id : orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'Order deleted',
                request : {
                    type : 'POST',
                    url : `http://localhost:${process.env.PORT}/orders`,
                    body : {
                        product : '_id',
                        quantity : 'Number'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error : err
            })
        })
};