export interface Gift {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  value: number;
  paymentType: "full" | "partial";
  amountCollected?: number;
}

export interface LinkItem {
  _id: string;
  title: string;
  url: string;
  image?: string;
}

export type GuestStatus = "pending" | "confirmed" | "declined";

export type ObjectIdString = string;

export interface Invite {
  _id: ObjectIdString;
  identifier: string;
  email?: string | null;
  phone?: string | null;
  pin: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Guest {
  _id: ObjectIdString;
  inviteId: ObjectIdString;
  name: string;
  tags?: string[];
  isAdult: boolean;
  status: GuestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface InviteWithGuests extends Invite {
  guests: Guest[];
}
