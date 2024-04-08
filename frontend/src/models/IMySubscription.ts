export interface IMySubscription {
  id: number;
  service_name: string;
  service_color: string;
  service_image: string;
  subscription_name: string;
  subscription_price: number;
  subscription_months: number;
  start_date: Date;
  end_date: Date;
  status: boolean;
  renewal_status: boolean;
  user: number;
  subscription: number;
}
