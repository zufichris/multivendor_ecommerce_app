import express from "express"
import { productControllers } from "../../controller/product"
import { authMiddleware } from "../../middleware/auth"
const router = express.Router()
router.route("/")
    .get(productControllers.queryProducts)
    .post(productControllers.createProduct)

router.route("/:slug")
    .get(productControllers.getProduct)

router.route("/:id")
    .patch(authMiddleware.requireAuth, authMiddleware.requirePermission("product", "manage_own"), productControllers.updateProductStatus)
    .delete(authMiddleware.requireAuth, authMiddleware.requirePermission("product", "manage_own"), productControllers.deleteProduct)

export default router
