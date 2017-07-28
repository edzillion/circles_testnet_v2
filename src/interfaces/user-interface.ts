import { NewsItem } from './news-item-interface';
import { Offer } from './offer-interface';
import { Validator } from './validator-interface';

import { Coin } from './coin-interface';

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
  totalReceived: number;
  totalSent: number;
  trustedUsers: Array<any>;
  validators: Array<Validator>;
  wallet: Array<Coin>;
  weeklyReceived: number;
  weeklySent: number;
}
