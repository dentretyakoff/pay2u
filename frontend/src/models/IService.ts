interface ISubscription {
  id: number;
  name: string;
  description: string;
  price: number;
  months: number;
  cashback: number;
  service: number;
}

export interface IService {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  created: string;
  rating: number;
  category: number;
  is_favorited?: boolean;
  cashback: number;
  subscriptions?: ISubscription[];
}
