const express = require('express');

// for creating id
const mongoose = require('mongoose');

// create a router to register different routes
const router = express.Router();

// import multer to parse formData
const multer = require('multer');

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, './uploads/');
    },

    filename : (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (eq, file, cb) => {
    
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// create an upload middleware, configuring storage
const upload = multer({ storage,
    limits : {
        fieldSize : 1024 * 1024 * 5
    },
    fileFilter
});

const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/productController');

router.get("/", ProductController.getAllProducts );

router.post("/", checkAuth, upload.single('productImage'), ProductController.createProduct);

// :/productId for dynamic productId
router.get("/:productId", ProductController.getProductById);

router.patch("/:productId", checkAuth, ProductController.updateProductById);

router.delete("/:productId", ProductController.deleteProductById);

// export configured router
module.exports = router;