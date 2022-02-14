const mongoose = require('mongoose');

// for hashing
const bcrypt = require('bcrypt');

// for jwt token
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

exports.signUp = (req, res, next) => {
    const { email, password } = req.body;
    User.find({ email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(422).json({
                    message : 'Email is already in use'
                })
            } else {
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error : err });
                    } else {
                        const user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            email,
                            password : hash
                        });
                        user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message : 'User created!'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error : err
                            });
                        });
                    }
                });
            }
        })
};

exports.logIn = (req, res, next) => {
    const { email, password } = req.body;
    User.find({ email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message : 'Authentication failed'
                });
            }

            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({
                        message : 'Authentication failed'
                    });
                }

                if (result) {
                    const token = jwt.sign({ 
                        email : user[0].email,
                        userId : user[0].id
                        }, 
                        process.env.JWT_PRIVATE_KEY,
                        {
                            expiresIn : "1h"
                        }
                    );
                    return res.status(200).json({
                        message : 'Authentication success!',
                        token : token
                    })
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
};

exports.deleteUserById = (req, res, next) => {
    const { userId } = req.params;
    User.deleteOne({ _id : userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message : 'User successfully deleted!'
            });
        })
        .catch(err => {
            res.status(500).json({ error : err });
        });
};