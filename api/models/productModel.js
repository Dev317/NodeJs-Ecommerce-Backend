const mongoose = require('mongoose');

// create a product schema
// pair of attribute and data type
const productSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : { type : String, required : true },
    price : { type : Number, required : true },
    productImage : { type : String, required : true }
});

// construct the object itself
module.exports = mongoose.model('Product', productSchema);