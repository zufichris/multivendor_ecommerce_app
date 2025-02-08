import express from "express"
import { productControllers } from "../../controller/product"
const router = express.Router()
router.route("/")
    .get(productControllers.queryProducts)
    .post(productControllers.createProduct)

router.route("/:slug")
    .get(productControllers.getProduct)

router.route("/:id")
    .patch(productControllers.updateProductStatus)
    .delete(productControllers.deleteProduct)

export default router