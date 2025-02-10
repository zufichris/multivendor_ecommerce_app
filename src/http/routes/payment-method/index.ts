import { Router } from 'express';
import { paymentMethodControllers } from '../../controller/payment-method';

const router = Router();

router.route("/")
    .post(paymentMethodControllers.createPaymentMethod)
    .get(paymentMethodControllers.queryPaymentMethods);

router.route("/:paymentId")
    .get(paymentMethodControllers.getPaymentMethod)
    .put(paymentMethodControllers.updatePaymentMethod)
    .delete(paymentMethodControllers.deletePaymentMethod);

export default router;