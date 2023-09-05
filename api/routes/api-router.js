import express from 'express';
import { getItems, getItem, addItem, updateItem, updateItemQuantityEP, deleteItem } from '../controllers/items-api-controller.js';
import { getCarts, getCart, addCart, updateCart, deleteCart } from '../controllers/carts-api-controller.js';
import { getCheckouts, addCheckout, updateCheckout, deleteCheckout, signIn, getCheckout, getCartCheckouts } from '../controllers/checkout-api-controller.js';
import { getLocations, addLocation } from '../controllers/locations-api-controller.js';
import { addCourse, deleteCourse, getCourse, getCourses, updateCourse } from '../controllers/courses-api-controller.js';
import { getLab, addLab, deleteLab, deleteLabs, getLabs } from '../controllers/labs-api-controller.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.route('/items')
    .get(getItems)
    .post(verifyAdmin, addItem);

router.route('/items/:item')
    .get(getItem) // used only for testing purposes (for now at least)
    .patch(verifyAdmin, updateItem)
    .delete(verifyAdmin, deleteItem);

router.route('/items/:id/quantity')
    .get(getItem) // used only for testing purposes (for now at least)
    .patch(verifyAdmin, updateItemQuantityEP);

router.route('/locations')
    .get(getLocations)
    .post(verifyAdmin, addLocation);

router.route('/carts')
    .get(verifyAdmin, getCarts)
    .post(verifyAdmin, addCart);

router.route('/carts/:id')
    .get(verifyAdmin, getCart)
    .patch(verifyAdmin, updateCart)
    .delete(verifyAdmin, deleteCart);

router.route('/checkouts')
    .get(verifyAdmin, getCheckouts)
    .post(verifyAdmin, addCheckout);

router.route('/checkouts/carts')
    .get(verifyAdmin, getCartCheckouts);

router.route('/checkouts/:id')
    .get(verifyAdmin, getCheckout) // (probably will be used only for testing purposes)
    .patch(verifyAdmin, updateCheckout)
    .delete(verifyAdmin, deleteCheckout); // (probably will be used only for testing purposes)

router.route('/checkouts/:id/signIn')
    .patch(verifyAdmin, signIn);

router.route('/courses')
    .get(verifyAdmin, getCourses)
    .post(verifyAdmin, addCourse);

router.route('/courses/:id')
    .get(verifyAdmin, getCourse)
    .patch(verifyAdmin, updateCourse)
    .delete(verifyAdmin, deleteCourse);

router.route('/labs')
    .get(verifyAdmin, getLabs)
    .post(verifyAdmin, addLab);

router.route('/labs/:id')
    .get(verifyAdmin, getLab)
    .delete(verifyAdmin, deleteLab);
// delete labs by its FK_course
router.route('/labs/course/:id')
    .delete(verifyAdmin, deleteLabs);


export default router;