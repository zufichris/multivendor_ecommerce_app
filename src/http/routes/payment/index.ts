import { Router } from 'express';
import { paymentControllers } from '../../controller/payment';

const router = Router();

router.route("/")
    .post(paymentControllers.createPayment)
    .get(paymentControllers.queryPayments);
router.route("/:paymentId")
    .get(paymentControllers.getPayment)
    .put(paymentControllers.updatePayment)
    .delete(paymentControllers.deletePayment);

export default router;