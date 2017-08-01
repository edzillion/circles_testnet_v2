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
  greeting?: string;
  lastName: string;
  news: Array<NewsItem>;
  profilePicURL: string;
  pushID: string;
  tradeMessage?:string;
  trustedUsers: Array<any>;
  validators: Array<any>;
  wallet: {};
}
