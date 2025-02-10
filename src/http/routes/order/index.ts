import { Router } from 'express';
import { orderControllers } from '../../controller/order';

const router = Router();

router.route("/")
    .post(orderControllers.createOrder)
    .get(orderControllers.queryOrders);
router.route("/:orderId")
    .get(orderControllers.getOrder)
    .put(orderControllers.updateOrder)
    .post(orderControllers.cancelOrder);

export default router;