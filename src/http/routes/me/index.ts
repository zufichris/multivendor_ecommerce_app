import express from "express"
import { authMiddleWare } from "../../middleware/auth"
import { userControllers } from "../../controller/user"
const router = express.Router()
router.use(authMiddleWare.requireAuth,)
router.use(authMiddleWare.requireAuth)

router.route('/')
    .get(userControllers.getMe)
    .patch(userControllers.updateUser)

router.route('/address')
    .get(userControllers.getMeAddress)
    .post(userControllers.addMeAddress)
    .patch(userControllers.updateMeAddress)
router.route('/stats')
    .get(userControllers.getMeStats)

export default router