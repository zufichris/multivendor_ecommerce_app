import { Router } from 'express';
import { shippingControllers } from '../../controller/shipping';

const router = Router();

router.route("/")
    .post(shippingControllers.createShipping)
    .get(shippingControllers.queryShippings);
router.route("/:shippingId")
    .get(shippingControllers.getShipping)
    .put(shippingControllers.updateShipping)
    .delete(shippingControllers.deleteShipping);

export default router;