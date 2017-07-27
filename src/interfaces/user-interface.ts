import { NewsItem } from './news-item-interface';
import { Offer } from './offer-interface';
import { Validator } from './validator-interface';

export interface User {
  $key: string,
  authProviders: Array<any>;
  balance: number;
  createdAt: any;
  displayName: string;
  email: string;
  firstName: string;
  greeting: string;
  lastName: string;
  log: Array<NewsItem>;
  offers: Array<Offer>;
  profilePicURL: string;
  pushID: string;
  validators: Array<Validator>;
  totalReceived: number;
  totalSent: number;
  weeklyReceived: number;
  weeklySent: number;
  trustedUsers: Array<any>;
}
