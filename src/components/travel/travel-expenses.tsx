import type { TravelExpense } from "@/lib/travel";

type TravelExpensesProps = {
  expenses?: TravelExpense[];
};

export function TravelExpenses({
  expenses,
}: TravelExpensesProps) {
  if (!expenses?.length) {
    return null;
  }

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const currency = expenses[0]?.currency ?? "INR";

  return (
    <section className="travel-expenses">
      <div className="section-label-row">
        <span className="section-label-accent"> खर्च</span>
        <span className="section-label-line" />
        <span className="section-label-text">
          Optional expenses
        </span>
      </div>

      <div className="travel-expenses-list">
        {expenses.map((expense) => (
          <div
            key={expense.label}
            className="travel-expense-row"
          >
            <span>{expense.label}</span>

            <span>
              {expense.currency}{" "}
              {expense.amount.toLocaleString("en-IN")}
            </span>
          </div>
        ))}

        <div className="travel-expense-total">
          <span>Total</span>

          <strong>
            {currency} {total.toLocaleString("en-IN")}
          </strong>
        </div>
      </div>
    </section>
  );
}