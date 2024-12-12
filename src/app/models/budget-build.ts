export interface SubTotalCategory {
  id: string;
  name: string;
  amountPerMonths: number[];
  parenId: string;
  isLabel?: boolean;
  isTotalAmount?: boolean;
}

export interface TotalAmount {
  income: SubTotalCategory;
  expenses: SubTotalCategory;
}

export interface AmountEndDate {
  profit: number[];
  open: number[];
  close: number[];
}
