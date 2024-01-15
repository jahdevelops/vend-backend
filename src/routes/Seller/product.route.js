const express = require("express");
const {
  createProduct,
  getSellerProducts,
  updateProduct,
  getProduct,
  deleteProduct,
} = require("../../controller/seller/Product/product.controller");
const router = express.Router();
const upload = require("../../utils/multer");

router
  .route("/")
  .post(
    upload.fields([
      { name: "main_image", maxCount: 1 },
      { name: "sub_image_1", maxCount: 1 },
      { name: "sub_image_2", maxCount: 1 },
      { name: "sub_image_3", maxCount: 1 },
      { name: "sub_image_4", maxCount: 1 },
      { name: "sub_image_5", maxCount: 1 },
    ]),
    createProduct,
  )
  .get(getSellerProducts);

router.route("/:id").put(updateProduct).get(getProduct).delete(deleteProduct);

module.exports = router;
