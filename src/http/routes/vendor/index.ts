import express from "express"
import { authMiddleware } from "../../middleware/auth"
import { Role } from "../../../data/enum/user"
import { vendorControllers } from "../../controller/vendor"
const router = express.Router()

router.use(authMiddleware.requireAuth)

router.route("/")
    .get(authMiddleware.requirePermission("vendor", "manage"), vendorControllers.queryVendors)
    .post(vendorControllers.createVendor)

router.use(authMiddleware.requirePermission("vendor", "manage_own"),).route('/:vendId')
    .get(vendorControllers.getVendor)
    .patch(vendorControllers.updateVendor)
    .delete(vendorControllers.deleteVendor)

router.use(authMiddleware.requirePermission("vendor", "manage"),).route("/:vendId/verify")
    .patch(vendorControllers.verifyVendor)

export default router