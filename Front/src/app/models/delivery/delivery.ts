import {DeliveryItem} from "./delivery-item";

export interface Delivery {
  id: number;
  saleDateTime: string;
  details: DeliveryItem[];
  total: number;

  name: string;
  phone: string;
  direction: string;

  deliveryDateTime: string;
  saleState: string;

  dealer: string;
  dealerId: number;
}
