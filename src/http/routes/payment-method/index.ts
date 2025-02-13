import { Router } from 'express';
import { paymentMethodControllers } from '../../controller/payment-method';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
router.route("/")
    .post(authMiddleware.requireAuth, authMiddleware.requirePermission("payment-method", "manage"), paymentMethodControllers.createPaymentMethod)
    .get(paymentMethodControllers.queryPaymentMethods);

router.route("/:paymentId")
    .get(paymentMethodControllers.getPaymentMethod)
    .put(authMiddleware.requireAuth, authMiddleware.requirePermission("payment-method", "manage"), paymentMethodControllers.updatePaymentMethod)
    .delete(authMiddleware.requirePermission("payment-method", "manage"),paymentMethodControllers.deletePaymentMethod);

export default router;