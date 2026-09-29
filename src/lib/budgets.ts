export const BUDGETS = [
  { value: "unsure", label: "Not sure yet" },
  { value: "5-25k", label: "$5k – $25k" },
  { value: "25-50k", label: "$25k – $50k" },
  { value: "50-100k", label: "$50k – $100k" },
  { value: "100k+", label: "$100k+" },
] as const;

export type BudgetValue = (typeof BUDGETS)[number]["value"];

export function budgetLabel(value: string): string {
  return BUDGETS.find((b) => b.value === value)?.label ?? "Not sure yet";
}
