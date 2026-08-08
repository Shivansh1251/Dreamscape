import { Router, Request, Response } from "express";
import { z } from "zod";
import { chatCompletion } from "../services/openaiClient";
import { logger } from "../logger";

const router = Router();

const ExpenseSchema = z.object({
    totalAmount: z.number().positive(),
    currency: z.string().default("INR"),
    people: z.array(z.string()).min(2),
    expenses: z.array(z.object({
        description: z.string(),
        amount: z.number().positive(),
        paidBy: z.string(),
        splitAmong: z.array(z.string()).optional() // defaults to everyone
    }))
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const parsed = ExpenseSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }

        const data = parsed.data;

        const systemPrompt = `You are a group expense splitter AI. Calculate who owes whom to settle the debts with the minimum number of transactions.
Return in JSON format:
{
  "totalSpent": number,
  "perPersonAverage": number,
  "balances": { "[PersonName]": number }, // positive means they should receive money, negative means they owe money
  "settlementTransactions": [
    { "from": string, "to": string, "amount": number }
  ],
  "summary": string
}`;

        const userPrompt = `Here are the group expenses:
Currency: ${data.currency}
People: ${data.people.join(", ")}
Expenses:
${JSON.stringify(data.expenses, null, 2)}
Calculate the optimized settlements.`;

        logger.info(`Calculating expense split for ${data.people.length} people`);
        const result = await chatCompletion(systemPrompt, userPrompt, { temperature: 0.1 });
        const json = result.replace(/^```json\s*|```\s*$/g, "").trim();
        const split = JSON.parse(json);

        return res.json({ success: true, data: split });
    } catch (err: any) {
        logger.error("Expense split failed", { error: err.message });
        return res.status(500).json({ error: "Failed to split expenses", details: err.message });
    }
});

export default router;
