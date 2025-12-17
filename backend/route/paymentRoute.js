import express from 'express';
import { RazorpayOrder, VerifyPayment } from '../controller/orderController.js';


const paymentRouter = express.Router();

paymentRouter.post('/razorpay-order', RazorpayOrder);

paymentRouter.post('/verifypayment', VerifyPayment);


export default paymentRouter;