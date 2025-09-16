import {sql} from '../config/db.js';


export async function getTransactionsByUserID(req,res){
        try {
    
            const {userID} = req.params;
    
          const transactions =  await sql `
                SELECT * FROM transactions
                WHERE user_id = ${userID}
                ORDER BY created_at asc
            `;
    
            res.status(200).json(transactions);
        } catch (error) {
            console.log("error getting transaction",error);
            res.status(500).json({message:"Internal server error"});
        }
};


export async function createTransaction(req,res){
   // title, amount, category,user_id
    try {
          const{title,amount,category,user_id} = req.body;
          if (!title || !user_id ||!category || amount === undefined ){
            return res.status(400).json({message: "All fields are required"});
          }

          const transaction = await sql `
            INSERT INTO transactions(user_id,title,amount,category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
          `;

          console.log(transaction);
          res.status(201).json(transaction[0]); 
    } catch (error) {
        console.log("error creating the transaction",error);
        res.status(500).json({message:"Internal server error"});
    }
};


export async function deleteTransactionByID(req,res){
    
    try {
        const { id } = req.params;

        if(isNaN(parseInt(id))){
            return res.status(400).json({message: "Invalid transaction ID "})
        };

        const result = await sql `
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;

        if(result.length === 0){
            return res.status(400).json({message : " Transaction not found"})
        }

       res.status(200).json({message : " transaction deleted successfully"});

        
    } catch (error) {
        console.log("error delete transaction",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getTransactionSummaryByUserID(req,res){
     try {
        const {userID} = req.params;

        const balanceResult = await sql `
            SELECT COALESCE(SUM(amount),0) AS balance
            FROM transactions
            WHERE user_id = ${userID}
        `;

        const incomeResult = await sql `
            SELECT COALESCE(SUM(amount),0) AS income
            FROM transactions
            WHERE user_id = ${userID} AND amount > 0
        `;

        const expensesResult = await sql `
            SELECT COALESCE(SUM(amount),0) AS expenses
            FROM transactions
            WHERE user_id = ${userID} AND amount < 0
        `;

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expenses
        });

        
     } catch (error) {
        console.log("Error getting the summary balance",error);
        res.status(500).json({message:"Internal server error"});
     }
};