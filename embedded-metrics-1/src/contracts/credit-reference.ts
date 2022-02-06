import { ExchangeBase } from './exchange-base';

export interface CreditReferenceRequest extends ExchangeBase {
  firstName: string;
  lastName: string;
  postcode: string;
}

export enum CreditReferenceRating {
  Good = 'Good',
  Bad = 'Bad',
  Ugly = 'Ugly',
}

export interface CreditReferenceResponse extends ExchangeBase {
  reference: string;
  rating: CreditReferenceRating;
}
