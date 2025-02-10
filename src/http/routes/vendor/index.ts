import express from "express"
import { authMiddleWare } from "../../middleware/auth"
import { Role } from "../../../data/enum/user"
import { vendorControllers } from "../../controller/vendor"
const router = express.Router()

router.use(authMiddleWare.requireAuth).use((req, res, next) => authMiddleWare.authorize([Role.Vendor, Role.Admin], req, res, next))

router.route("/")
    .get(vendorControllers.queryVendors)
    .post(vendorControllers.createVendor)

router.route('/:vendId')
    .get(vendorControllers.getVendor)
    .patch(vendorControllers.updateVendor)
    .delete(vendorControllers.deleteVendor)

router.route("/:vendId/verify",)
    .patch(vendorControllers.verifyVendor)

export default router