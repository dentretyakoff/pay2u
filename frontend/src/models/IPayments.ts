export interface IPayment {
  service_name: string;
  amount: number;
  cashback: number;
  cashback_status: boolean;
  date: Date;
}

export interface IExpenses {
  total_cashback: number;
  monthly_expenses: number;
}
