import express from 'express';
import { sql } from '../config/db.js';
import { getTransactionsByUserID } from '../controllers/transactionsController.js';
import { createTransaction } from '../controllers/transactionsController.js';
import { deleteTransactionByID} from '../controllers/transactionsController.js';
import { getTransactionSummaryByUserID } from '../controllers/transactionsController.js';

const router = express.Router();


router.post("/",createTransaction);
router.get("/:userID",getTransactionsByUserID);
router.delete("/:id",deleteTransactionByID);
router.get("/summary/:userID",getTransactionSummaryByUserID);


export default router;