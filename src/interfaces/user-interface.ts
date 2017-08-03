import { NewsItem } from './news-item-interface';
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
  profilePicURL: string;
  pushID: string;
  tradeMessage?:string;
  trustedUsers: Array<any>;
  uid: string;
  validators: Array<any>;
  wallet: {};
}
