export interface Gift {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  value: number;
  paymentType: "full" | "partial";
  disableOnGoalReached?: boolean;
  amountCollected?: number;
}

export interface LinkItem {
  _id: string;
  title: string;
  url: string;
  image?: string;
}
