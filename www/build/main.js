webpackJsonp([0],{

/***/ 151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const environment = {
    production: false,
    firebase: {
        host: 'localhost',
        apiKey: 'AIzaSyD-qk6NzF4sTQwqvgTSzl6z-tUH4Wd7PXc',
        authDomain: 'circles-testnet.firebaseapp.com',
        databaseURL: 'https://circles-testnet.firebaseio.com',
        projectId: 'circles-testnet',
        storageBucket: 'circles-testnet.appspot.com',
        messagingSenderId: '551885395202'
    },
    googleAnalytics: {
        id: 'UA-80367144-2'
    },
    cloudSettings: {
        core: {
            fcm_key: 'AAAAgH7u1QI:APA91bGwrBmTvZtLJKuzfeR_dP4x_wQm0LCMKR_IQWUwZSam3aCmqSGQ14txad1RlZaXSvly0F_Hte2pAHPSZaSOC63HMPojgQlxv1gIGUT7Z052G9IBVzmQ2Q5kFFljCY2KgdugPZ8-',
            app_id: '742b9e39'
        },
        push: {
            sender_id: '551885395202',
            app_id: 'ec89dac3-9e63-4670-97f2-b49726099286',
            pluginConfig: {
                ios: {
                    badge: true,
                    sound: true
                },
                android: {
                    iconColor: '#343434'
                }
            }
        }
    }
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;

//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 152:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_combineLatest__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_combineLatest___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_combineLatest__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_take__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









//import { PushService } from '../../providers/push-service/push-service';
let NewsService = class NewsService {
    constructor(db, notificationsService, 
        //private pushService: PushService,
        userService) {
        this.db = db;
        this.notificationsService = notificationsService;
        this.userService = userService;
        this.newsItemsReversed$ = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.newsItems$ = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.userService.initUserSubject$.subscribe(user => {
            this.user = user;
            this.setupDBQuery(user);
        }, error => console.error(error), () => console.log('news-service constructor user$ obs complete'));
    }
    setupDBQuery(user) {
        // sets up a db list binding that will initially return all messages from the last
        // two minutes and then any added to the list after that.
        this.dbNewsItems$ = this.db.list('/users/' + user.$key + '/log/');
        let twoMinsAgo = Date.now() - 120000;
        this.dbNewsItems$.$ref
            .orderByChild('timestamp')
            .startAt(twoMinsAgo)
            .on('child_added', (firebaseObj, index) => {
            let latestNewsItem = firebaseObj.val();
            //receiving from someone
            if (latestNewsItem.type == 'transaction' && latestNewsItem.to == user.$key) {
                this.userService.keyToUser$(latestNewsItem.from).subscribe((fromUser) => {
                    let msg = 'Receieved ' + latestNewsItem.amount + ' Circles from ' + fromUser.displayName;
                    this.notificationsService.create('Transaction', msg, 'info');
                });
            }
            else if (latestNewsItem.type == 'sale') {
                this.userService.keyToUser$(latestNewsItem.from).subscribe((fromUser) => {
                    let msg = fromUser.displayName + ' has just bought ' + latestNewsItem.title + ' for ' + latestNewsItem.amount + ' Circles';
                    this.notificationsService.create('Sale', msg, 'info');
                });
            }
        });
        this.dbNewsSub$ = this.dbNewsItems$.subscribe(newsitems => {
            let r = newsitems.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
            this.newsItemsReversed$.next(r);
        }, error => {
            console.log("Firebase Error: " + error);
        }, () => console.log('news-service setupDBQuery dbNewsSub$ obs complete'));
        this.dbNewsItems$.subscribe(this.newsItems$);
    }
    get allNewsItems$() {
        return this.newsItems$;
    }
    get allnewsItemsReversed$() {
        return this.newsItemsReversed$;
    }
    addTransaction(txItem) {
        //this will only be called for sending to someone else
        this.notificationsService.create('Send Success', '', 'success');
        let msg = 'Sent ' + txItem.amount + ' Circles to ' + txItem.toUser.displayName;
        this.notificationsService.create('Transaction', msg, 'info');
        let newsItem = {
            timestamp: __WEBPACK_IMPORTED_MODULE_3_firebase_app__["database"]['ServerValue']['TIMESTAMP'],
            amount: txItem.amount,
            to: txItem.to,
            type: 'transaction'
        };
        this.dbNewsItems$.push(newsItem);
        //send push notification to other user
        //msg = 'Receieved ' + txItem.amount + ' Circles from ' + this.user.displayName;
        //this.pushService.pushToUser(txItem.toUser,msg);
    }
    addPurchase(offer) {
        this.notificationsService.create('Purchase Success', '', 'success');
        let msg = 'Bought ' + offer.title + ' from ' + offer.sellerName + ' for ' + offer.price + ' Circles';
        this.notificationsService.create('Purchase', msg, 'info');
        let newsItem = {
            timestamp: __WEBPACK_IMPORTED_MODULE_3_firebase_app__["database"]['ServerValue']['TIMESTAMP'],
            title: offer.title,
            from: offer.seller,
            type: 'purchase'
        };
        this.dbNewsItems$.push(newsItem);
    }
    addOfferListed(offer) {
        this.notificationsService.create('Listing Success', '', 'success');
        let msg = 'Listed ' + offer.title + ' on market';
        this.notificationsService.create('Listing', msg, 'info');
        let newsItem = {
            timestamp: __WEBPACK_IMPORTED_MODULE_3_firebase_app__["database"]['ServerValue']['TIMESTAMP'],
            title: offer.title,
            type: 'offerListed'
        };
        this.dbNewsItems$.push(newsItem);
    }
    addGroupJoin(validator) {
        this.notificationsService.create('Join Success', '', 'success');
        let msg = 'You have joined the group: ' + validator.displayName;
        this.notificationsService.create('Join', msg, 'info');
        let newsItem = {
            timestamp: __WEBPACK_IMPORTED_MODULE_3_firebase_app__["database"]['ServerValue']['TIMESTAMP'],
            title: validator.displayName,
            type: 'groupJoin'
        };
        this.dbNewsItems$.push(newsItem);
    }
    ;
    ngOnDestroy() {
        this.dbNewsSub$.unsubscribe();
    }
};
NewsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1_angular2_notifications__["a" /* NotificationsService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_user_service_user_service__["a" /* UserService */]])
], NewsService);

//# sourceMappingURL=news-service.js.map

/***/ }),

/***/ 153:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_transaction_service_transaction_service__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__send_send__ = __webpack_require__(303);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let UserDetailPage = class UserDetailPage {
    constructor(navCtrl, navParams, userService, transactionService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.transactionService = transactionService;
        this.directTrust = false;
        this.validatorTrust = false;
        this.trusted = false;
        this.viewUser = navParams.data;
        console.log(navParams.data);
    }
    revokeTrust() {
        this.userService.removeTrustedUser(this.viewUser.$key);
        this.directTrust = false;
        this.trusted = false;
    }
    affordTrust() {
        this.userService.addTrustedUser(this.viewUser.$key);
        this.directTrust = true;
        this.trusted = true;
    }
    sendCircles() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__send_send__["a" /* SendPage */], this.viewUser);
    }
    ionViewDidLoad() {
        this.userSub$ = this.userService.initUserSubject$.subscribe(user => {
            this.user = user;
            let dTrust = this.user.trustedUsers.some(tUserKey => {
                return tUserKey == this.viewUser.$key;
            });
            if (dTrust) {
                this.directTrust = true;
                this.trusted = true;
            }
            else if (this.user.validators) {
                for (var validator of this.user.validators) {
                    for (var tUserKey of validator.trustedUsers) {
                        if (tUserKey == this.viewUser.$key)
                            this.validatorTrust = true;
                        this.validatedBy = validator;
                        this.trusted = true;
                    }
                }
            }
        });
    }
};
UserDetailPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-user-detail',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/user-detail/user-detail.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title></ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n  <ion-card>\n     <img src="{{viewUser.profilePicURL}}">\n     <ion-card-content>\n      <ion-card-title>\n       <h1>{{viewUser.displayName}}</h1>\n       <p *ngIf="directTrust == true">Connection: {{user.displayName}} - {{viewUser.displayName}}\n       <p *ngIf="validatorTrust == true">Connection: {{user.displayName}} - {{this.validatedBy.displayName}} - {{viewUser.displayName}} </p>\n\n      </ion-card-title>\n       <ion-list no-lines>\n         <ion-item>\n           <ion-icon name="mail" item-left></ion-icon>\n           <p>{{viewUser.email}}</p>\n         </ion-item>\n\n         <ion-item *ngIf="trusted" (click)="revokeTrust()">\n            Revoke Trust\n           <ion-icon name="unlock" color="green" item-right>\n           </ion-icon>\n         </ion-item>\n         <ion-item *ngIf="!trusted" (click)="affordTrust()">\n            Afford Trust\n           <ion-icon name="lock" color="red" item-right>\n           </ion-icon>\n         </ion-item>\n         <ion-item *ngIf="trusted"  (click)="sendCircles()">\n            Send Circles\n           <ion-icon name="send" item-right>\n         </ion-icon>\n         </ion-item>\n         <ion-item>\n         <ion-icon name="phone-portrait" item-left></ion-icon>\n         + 49 1023893933\n         </ion-item>\n       </ion-list>\n     </ion-card-content>\n   </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/user-detail/user-detail.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_user_service_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_transaction_service_transaction_service__["a" /* TransactionService */]])
], UserDetailPage);

//# sourceMappingURL=user-detail.js.map

/***/ }),

/***/ 154:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TransactionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_news_service_news_service__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







let TransactionService = class TransactionService {
    constructor(db, newsService, userService) {
        this.db = db;
        this.newsService = newsService;
        this.userService = userService;
        this.transact = new __WEBPACK_IMPORTED_MODULE_3_rxjs_Subject__["Subject"]();
        this.userSub$ = this.userService.user$.subscribe(user => this.user = user, error => console.error(error), () => console.log('transaction-service constructor userSub$ obs complete'));
        this.transactionLog$ = this.db.list('/transactions/');
    }
    transfer(toUser, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            amount = Number(amount);
            let sentCoins = [];
            let trusted = this.getTrustIntersection(this.user, toUser);
            if (trusted.balance < amount) {
                //we don't have enough trusted coins
                return false;
            }
            for (let coin of trusted.trustedCoins) {
                if (amount > coin.amount) {
                    let c = Object.assign({}, coin);
                    ;
                    c.priority = sentCoins[coin.owner].priority;
                    sentCoins[coin.owner] = c;
                    coin.amount = 0;
                }
                else {
                    let c = Object.assign({}, coin);
                    c.priority = Object.keys(toUser.wallet).length;
                    c.amount = amount;
                    sentCoins[coin.owner] = c;
                    coin.amount -= amount;
                }
            }
            this.user.balance -= amount;
            //now we need to update the other wallet
            toUser.balance += amount;
            for (let key in sentCoins) {
                if (toUser.wallet[key]) {
                    toUser.wallet[key].amount += sentCoins[key].amount;
                }
                else {
                    toUser.wallet[key] = sentCoins[key];
                }
            }
            try {
                let a = yield this.db.object('/users/' + this.user.$key).update({
                    wallet: this.user.wallet,
                    balance: this.user.balance
                });
                let b = yield this.db.object('/users/' + toUser.$key).update({
                    wallet: toUser.wallet,
                    balance: toUser.balance
                });
            }
            catch (error) {
                console.error(error);
                throw new Error("Purchase fail");
            }
            return true;
        });
    }
    logTransfer(toUser, offer, type, message) {
        let logItem = {
            "from": this.user.$key,
            "to": toUser.$key,
            "timestamp": __WEBPACK_IMPORTED_MODULE_2_firebase_app__["database"]['ServerValue']['TIMESTAMP'],
            "amount": offer.price,
            "message": message || '',
            "title": offer.title,
            "type": type
        };
        //add to the main transaction log
        this.transactionLog$.push(logItem);
        //add to other user's log
        logItem.to = '';
        if (logItem.type == 'purchase')
            logItem.type = 'sale';
        this.toUserLog$ = this.db.list('/users/' + toUser.$key + '/log/');
        this.toUserLog$.push(logItem);
    }
    createPurchaseIntent(sellerUserId, offer) {
        let p = new Promise((resolve, reject) => {
            this.userService.keyToUser$(sellerUserId).take(1).subscribe((sellerUser) => {
                if (this.transfer(sellerUser, offer.price)) {
                    this.logTransfer(sellerUser, offer, 'purchase');
                    this.newsService.addPurchase(offer);
                    resolve(true);
                }
                else
                    reject(new Error("Purchase Failed"));
            });
        });
        return p;
    }
    createTransactionIntent(toUserId, amount, message) {
        let p = new Promise((resolve, reject) => {
            this.userService.keyToUser$(toUserId).take(1).subscribe((toUser) => {
                if (this.transfer(toUser, amount)) {
                    let offerObj = {
                        amount: amount,
                        price: amount,
                        title: 'Transaction',
                        to: toUserId,
                        toUser: toUser
                    };
                    this.logTransfer(toUser, offerObj, 'transfer', message);
                    this.newsService.addTransaction(offerObj);
                    resolve(true);
                }
                else
                    reject(new Error("Purchase Failed"));
            });
        });
        return p;
    }
    //which of the receivingUser's trusted coins does the sendingUser have?
    getTrustIntersection(sendingUser, receivingUser) {
        let ret = [];
        let sum = 0;
        for (let u of receivingUser.trustedUsers) {
            if (this.user.wallet[u]) {
                sum += this.user.wallet[u].amount;
                let p = this.user.wallet[u].priority;
                ret[p] = this.user.wallet[u];
            }
        }
        return { trustedCoins: ret, balance: sum };
    }
    ngOnDestroy() {
        this.userSub$.unsubscribe();
        this.toUserLog$.subscribe().unsubscribe();
    }
};
TransactionService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_5__providers_news_service_news_service__["a" /* NewsService */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__["a" /* UserService */]])
], TransactionService);

//# sourceMappingURL=transaction-service.js.map

/***/ }),

/***/ 163:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 163;

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__ = __webpack_require__(288);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_ReplaySubject__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_ReplaySubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_ReplaySubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_find__ = __webpack_require__(430);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_find___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_operator_find__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__validator_service_validator_service__ = __webpack_require__(460);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};









let UserService = class UserService {
    constructor(afAuth, db, validatorService) {
        this.afAuth = afAuth;
        this.db = db;
        this.validatorService = validatorService;
        this.initUserSubject$ = new __WEBPACK_IMPORTED_MODULE_5_rxjs_ReplaySubject__["ReplaySubject"](1);
        this.usersSubject$ = new __WEBPACK_IMPORTED_MODULE_5_rxjs_ReplaySubject__["ReplaySubject"](1);
        this.users$ = this.usersSubject$.asObservable();
        //private createdAt: number;
        this.weeklyGrant = 100;
        this.myCoins = {};
        this.user = {};
        this.user.createdAt = 0;
        this.authState$ = this.afAuth.authState;
        this.authSub$ = this.afAuth.authState.subscribe(auth => {
            if (auth) {
                let userObs = this.db.object('/users/' + auth.uid);
                let userSub = userObs.subscribe(user => {
                    if (!user.$exists()) {
                        //user doesn't exist, create user entry on db
                        this.user.createdAt = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["database"]['ServerValue']['TIMESTAMP'];
                        this.user.authProviders = ["email"];
                        this.setInitialWallet(auth.uid);
                        this.user.totalReceived = 0;
                        this.user.totalSent = 0;
                        this.user.weeklyReceived = 0;
                        this.user.weeklySent = 0;
                        userObs.set(this.user);
                    }
                    else {
                        this.userSubject$ = new __WEBPACK_IMPORTED_MODULE_4_rxjs_BehaviorSubject__["BehaviorSubject"](user);
                        this.user$ = this.userSubject$.asObservable();
                        // this.userSubject$ is our app wide current user Subscription
                        this.userFirebaseObj$ = this.db.object('/users/' + auth.uid);
                        this.userSub$ = this.userFirebaseObj$.subscribe(user => {
                            this.user = user;
                            if (this.user.validators) {
                                this.validatorService.setUserValidators(this.user);
                            }
                            this.initUserSubject$.next(user);
                            this.userSubject$.next(user);
                        }, error => console.log('Could not load current user record.'));
                        this.usersSub$ = this.db.list('/users/').subscribe(users => {
                            this.users = users;
                            //clone the users array so that we don't change a user accidentally
                            //Object.assign(this.dataStore.users, users);
                            this.usersSubject$.next(users);
                        }, error => console.log('Could not load users.'));
                        userSub.unsubscribe();
                    }
                }, error => console.error(error), () => { });
            }
            else {
                //wipe on logout
                this.user = {};
            }
        }, error => console.error(error), () => { });
    }
    keyToUser$(key) {
        return this.users$.map(users => users.find(user => user.$key === key));
    }
    keyToUserName$(key) {
        return this.users$.map(users => {
            let u = users.find(user => user.$key === key);
            return u.displayName;
        });
    }
    filterUsers$(searchTerm) {
        //if (!searchTerm)
        //  return Observable.empty(); //todo: should this return an observable(false) or something?
        return this.users$.map((users) => {
            return users.filter((user) => {
                if (!user.displayName || user.$key == 'undefined' || (user.$key == this.user.$key))
                    return false;
                let s = searchTerm.toLowerCase();
                let d = user.displayName.toLowerCase();
                return d.indexOf(s) > -1;
            });
        });
    }
    filterValidators$(searchTerm) {
        //if (!searchTerm)
        //  return Observable.empty(); //todo: should this return an observable(false) or something?
        return this.validators$.map((valis) => {
            return valis.filter((vali) => {
                if (!vali.displayName || vali.$key == 'undefined')
                    return false;
                let s = searchTerm.toLowerCase();
                let d = vali.displayName.toLowerCase();
                return d.indexOf(s) > -1;
            });
        });
    }
    update(updateObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.userFirebaseObj$.update(updateObject);
                console.log(result);
            }
            catch (error) {
                console.error(error);
                throw new Error("userService update fail");
            }
        });
    }
    signInEmail(email, password) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }
    signInRedirect(provider) {
        return this.afAuth.auth.signInWithRedirect(provider);
    }
    createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let u = yield this.afAuth.auth.createUserWithEmailAndPassword(email, password);
            this.user.email = u.email;
        });
    }
    addTrustedUser(userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user.trustedUsers.push(userKey);
            let userObs = this.db.object('/users/' + this.user.$key);
            userObs.update({ trustedUsers: this.user.trustedUsers });
        });
    }
    removeTrustedUser(userKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let arr = this.user.trustedUsers.filter(user => user != userKey);
            let userObs = this.db.object('/users/' + this.user.$key);
            yield userObs.update({ trustedUsers: arr });
        });
    }
    setInitialWallet(userKey) {
        let now = new Date();
        let day = now.getDay();
        let diff = (7 - 5 + day) % 7;
        let b = this.weeklyGrant - ((this.weeklyGrant / 7) * (diff));
        this.myCoins.amount = Math.round(b);
        this.myCoins.owner = userKey;
        this.myCoins.title = (this.user.firstName) ? this.user.firstName + 'Coin' : 'CircleCoin';
        //my coins are always the highest priority
        this.myCoins.priority = 0;
        this.allCoins = {
            [userKey]: this.myCoins,
        };
        this.user.wallet = this.allCoins;
        this.setBalance();
    }
    setBalance() {
        let total = 0;
        for (let i in this.user.wallet) {
            total += this.user.wallet[i].amount;
        }
        this.user.balance = total;
    }
    signOut() {
        return this.afAuth.auth.signOut();
    }
    ngOnDestroy() {
        this.authSub$.unsubscribe();
        this.userSub$.unsubscribe();
        this.usersSub$.unsubscribe();
    }
};
UserService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_8__validator_service_validator_service__["a" /* ValidatorService */]])
], UserService);

//# sourceMappingURL=user-service.js.map

/***/ }),

/***/ 204:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 204;

/***/ }),

/***/ 290:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_analytics_service_analytics_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_email_login_email__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_signup_email_signup_email__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







let LoginPage = class LoginPage {
    constructor(analytics, loadingCtrl, navCtrl, userService) {
        this.analytics = analytics;
        this.loadingCtrl = loadingCtrl;
        this.navCtrl = navCtrl;
        this.userService = userService;
    }
    loginFB() {
        this.loading = this.loadingCtrl.create({
            content: 'Logging in ...',
            dismissOnPageChange: true,
        });
        this.loading.present();
        var provider = new __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].FacebookAuthProvider();
        provider.addScope('public_profile');
        provider.addScope('email');
        this.userService.signInRedirect(provider);
    }
    loginGoogle() {
        this.loading = this.loadingCtrl.create({
            content: 'Logging in ...',
            dismissOnPageChange: true
        });
        var provider = new __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].GoogleAuthProvider();
        this.userService.signInRedirect(provider);
    }
    loginEmail() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_login_email_login_email__["a" /* LoginEmailPage */]);
    }
    goSignup() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__pages_signup_email_signup_email__["a" /* SignupEmailPage */]);
    }
    ionViewDidLoad() {
        this.analytics.trackPageView('Login Page');
    }
};
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-login',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/login/login.html"*/'<!--<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>\n      Circles\n    </ion-title>\n  </ion-navbar>\n</ion-header>-->\n<ion-content >\n<div id="login-page" class="gradient-bg">\n\n  <div text-center id="title">\n    <!--<ion-icon name="lock" style="zoom:12.0;">\n    </ion-icon>-->\n    <img src="assets/logos/circles-logo.svg" alt="Circles">\n    Circles\n  </div>\n\n  <span class="error" *ngIf="error">{{ error }}</span>\n\n  <button (click)="loginFB()"><span icon="facebook"></span>Login With Facebook</button>\n  <button (click)="loginGoogle()"><span icon="google"></span>Login With Google</button>\n  <button (click)="loginEmail()"><span icon="mail"></span>Login With Email</button>\n\n  <a (click)="goSignup()" class="signupEmailPageLink">No account? <strong>Create one here</strong></a>\n\n</div>\n\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/login/login.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_analytics_service_analytics_service__["a" /* AnalyticsService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__["a" /* UserService */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginEmailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_analytics_service_analytics_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let LoginEmailPage = class LoginEmailPage {
    constructor(analytics, formBuilder, loadingCtrl, toastCtrl, userService) {
        this.analytics = analytics;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.userService = userService;
        this.loginForm = formBuilder.group({
            email: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].email])],
            password: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required]
        });
    }
    onSubmit(formData, formValid) {
        if (!formValid)
            return;
        this.loading = this.loadingCtrl.create({
            content: 'Logging In ...',
        });
        this.loading.present();
        this.userService.signInEmail(formData.email, formData.password).then(success => {
            console.log('email auth success');
            this.loading.dismiss();
        }).catch(error => {
            this.toast = this.toastCtrl.create({
                message: error.toString(),
                duration: 3000,
                position: 'middle'
            });
            console.error(error);
            this.loading.dismiss();
            this.toast.present();
        });
    }
    ionViewDidLoad() {
        this.analytics.trackPageView('Login Email Page');
    }
};
LoginEmailPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-login-email',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/login-email/login-email.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>Email Login</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n  <ion-row>\n    <ion-col col-8 offset-2>\n      <div icon="unlock">\n        Log In\n      </div>\n    </ion-col>\n  </ion-row>\n  <ion-row>\n    <ion-col>\n      <form [formGroup]="loginForm" (ngSubmit)="onSubmit(loginForm.value, loginForm.valid)">\n        <ion-list>\n          <ion-list-header>\n            Enter your credentials below\n          </ion-list-header>\n\n          <span class="error" *ngIf="error">{{ error }}</span>\n\n            <ion-item>\n              <ion-label>Email</ion-label>\n              <ion-input formControlName="email" type="email"></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-label>Password</ion-label>\n              <ion-input formControlName="password" type="password"></ion-input>\n            </ion-item>\n\n            <ion-item-divider>\n              <button ion-button [disabled]="!loginForm.valid" type="submit">Log In</button>\n            </ion-item-divider>\n\n          </ion-list>\n      </form>\n    </ion-col>\n  </ion-row>\n\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/login-email/login-email.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_analytics_service_analytics_service__["a" /* AnalyticsService */],
        __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_service_user_service__["a" /* UserService */]])
], LoginEmailPage);

//# sourceMappingURL=login-email.js.map

/***/ }),

/***/ 293:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupEmailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_analytics_service_analytics_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let SignupEmailPage = class SignupEmailPage {
    constructor(analytics, formBuilder, loadingCtrl, toastCtrl, userService) {
        this.analytics = analytics;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.userService = userService;
        this.createUserForm = formBuilder.group({
            email: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].email])],
            password1: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required],
            password2: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required],
        }, { validator: this.passwordsAreEqual.bind(this) });
    }
    onSubmit(formData, formValid) {
        if (!formValid)
            return;
        // this.loading = this.loadingCtrl.create({
        //   content: 'Saving User ...',
        //   //dismissOnPageChange: true
        // });
        //
        // this.loading.present();
        this.userService.createUser(formData.email, formData.password1);
        // .then(
        //   user => {
        //     this.loading.dismiss();
        //     console.log("Email auth success: " + JSON.stringify(user));
        //   }).catch(
        //   error => {
        //     console.log("Email auth failure: " + JSON.stringify(error));
        //     this.toast = this.toastCtrl.create({
        //       message: 'Email auth failure: ' + error,
        //       duration: 3000,
        //       position: 'middle'
        //     });
        //     this.loading.dismiss();
        //     this.toast.present();
        //   });
    }
    passwordsAreEqual(ctrl) {
        if (this.createUserForm && this.createUserForm.controls.password1.value) {
            let valid = this.createUserForm.controls.password1.value == this.createUserForm.controls.password2.value;
            return valid ? null : { 'passwordsAreEqual': true };
        }
    }
    ionViewDidLoad() {
        this.analytics.trackPageView('Signup Email Page');
    }
};
SignupEmailPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-signup-email',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/signup-email/signup-email.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <ion-title>Email Signup</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n  <ion-row>\n    <ion-col col-8 offset-2>\n      <div icon="unlock">\n        Join Now\n      </div>\n    </ion-col>\n  </ion-row>\n  <ion-row>\n    <ion-col>\n      <form [formGroup]="createUserForm" (ngSubmit)="onSubmit(createUserForm.value, createUserForm.valid)">\n        <ion-list>\n          <ion-list-header>\n            Enter your details below\n          </ion-list-header>\n\n          <span class="error" *ngIf="error">{{ error }}</span>\n\n            <ion-item>\n              <ion-label>Email</ion-label>\n              <ion-input formControlName="email" type="email"></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-label>Password</ion-label>\n              <ion-input formControlName="password1" type="password"></ion-input>\n            </ion-item>\n\n            <ion-item>\n              <ion-label>Password Repeat</ion-label>\n              <ion-input formControlName="password2" type="password"></ion-input>\n            </ion-item>\n\n            <ion-item-divider>\n              <button ion-button [disabled]="!createUserForm.valid" type="submit">Create my account</button>\n            </ion-item-divider>\n\n          </ion-list>\n      </form>\n    </ion-col>\n  </ion-row>\n\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/signup-email/signup-email.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_analytics_service_analytics_service__["a" /* AnalyticsService */],
        __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_service_user_service__["a" /* UserService */]])
], SignupEmailPage);

//# sourceMappingURL=signup-email.js.map

/***/ }),

/***/ 294:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angular2_notifications__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_news_service_news_service__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__search_search__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__user_detail_user_detail__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__validator_detail_validator_detail__ = __webpack_require__(459);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











let ProfilePage = class ProfilePage {
    constructor(navCtrl, navParams, notificationsService, camera, db, ds, toastCtrl, userService, newsService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.notificationsService = notificationsService;
        this.camera = camera;
        this.db = db;
        this.ds = ds;
        this.toastCtrl = toastCtrl;
        this.userService = userService;
        this.newsService = newsService;
        this.profilePicURL = "https://firebasestorage.googleapis.com/v0/b/circles-testnet.appspot.com/o/profilepics%2Fgeneric-profile-pic.png?alt=media&token=d151cdb8-115f-483c-b701-e227d52399ef";
        this.selectedView = 'network';
        this.view = 'network';
        this.networkList = [];
        this.historyList = [];
        this.validatorList = [];
    }
    openSearch() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__search_search__["a" /* SearchPage */]);
    }
    goToUserDetail(user) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__user_detail_user_detail__["a" /* UserDetailPage */], user);
    }
    goToValidatorDetail(validator) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__validator_detail_validator_detail__["a" /* ValidatorDetailPage */], validator);
    }
    selectNetwork() {
        this.selectedView = 'network';
    }
    selectHistory() {
        this.selectedView = 'history';
    }
    selectValidators() {
        this.selectedView = 'validators';
    }
    selectFromGallery() {
        var options = {
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL
        };
        this.camera.getPicture(options).then(imageData => {
            // imageData is a base64 encoded string
            this.base64ImageData = imageData;
            this.profilePicURL = "data:image/jpeg;base64," + imageData;
        }, error => {
            this.toast = this.toastCtrl.create({
                message: 'Error selecting from gallery: ' + error,
                duration: 3000,
                position: 'middle'
            });
            console.error(error);
            this.toast.present();
        });
    }
    openCamera() {
        var options = {
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL
        };
        this.camera.getPicture(options).then(imageData => {
            // imageData is a base64 encoded string
            this.base64ImageData = imageData;
            this.profilePicURL = "data:image/jpeg;base64," + imageData;
        }, error => {
            this.toast = this.toastCtrl.create({
                message: 'Error opening camera: ' + error,
                duration: 3000,
                position: 'middle'
            });
            console.error(error);
            this.toast.present();
        });
    }
    ionViewDidLoad() {
        this.userSub$ = this.userService.initUserSubject$.subscribe(user => {
            this.user = user;
            if (user.trustedUsers) {
                user.trustedUsers.map(key => {
                    this.userService.keyToUser$(key).subscribe(trustedUser => { this.networkList.push(trustedUser); });
                });
            }
            if (this.user.validators) {
                for (let i in this.user.validators) {
                    this.validatorList.push(this.user.validators[i]);
                }
            }
        });
    }
};
ProfilePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-profile',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/profile/profile.html"*/'<ion-header>\n  <ion-navbar color="secondary">\n    <ion-title></ion-title>\n    <ion-buttons left>\n      <a menuToggle icon-only>\n        <ion-icon name="menu"></ion-icon>\n      </a>\n    </ion-buttons>\n    <ion-buttons right>\n      <a icon-only (click)="openSearch()">\n        <ion-icon name="search"></ion-icon>\n      </a>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding id="profile-content">\n  <ion-list>\n  <!--\n    <ion-item>\n      Validators:\n      <div *ngFor="let val of user?.validators" class="profileItem">\n        <img class="profile-item" src="{{val.profilePicURL}}">\n      </div>\n    </ion-item>-->\n\n    <div class="profile-pic">\n      <div class="circle-crop"\n        [ngStyle]="{\'background-image\': \'url(\' + profilePicURL + \')\'}">\n        <!--<img src="{{profilePicURL}}">-->\n      </div>\n      <button ion-button (click)="openCamera()">Open camera</button>\n      <button ion-button (click)="selectFromGallery()">Select from gallery</button>\n\n       <div class="user-name">\n        {{user?.displayName}}\n      </div>\n\n      <div class="balance">\n        {{user?.balance}} css\n      </div>\n\n    </div>\n\n    <!--<ion-item>Greeting: {{user?.greeting}}</ion-item>-->\n\n    <ion-item>\n      <ion-segment [(ngModel)]="view" color="primary">\n        <ion-segment-button class="offer-segment-button" value="network" (ionSelect)="selectNetwork()">\n          Network\n        </ion-segment-button>\n        <ion-segment-button class="offer-segment-button" value="wants" (ionSelect)="selectHistory()">\n          History\n        </ion-segment-button>\n        <ion-segment-button class="offer-segment-button" value="validators" (ionSelect)="selectValidators()">\n          Validators\n        </ion-segment-button>\n      </ion-segment>\n    </ion-item>\n\n    <ion-item>\n      Total received : {{user?.totalReceived}} | Total sent: {{user?.totalSent}}\n    </ion-item>\n\n    <span *ngIf="selectedView == \'network\' && user?.trustedUsers">\n      <ion-item *ngFor="let networkUser of networkList" (click)="goToUserDetail(networkUser)">\n        <ion-avatar style="width:48px;height:48px" item-left>\n          <img src="{{networkUser.profilePicURL}}">\n        </ion-avatar>\n        <h2>{{networkUser.displayName}}</h2>\n        <p>{{networkUser.greeting}}</p>\n      </ion-item>\n    </span>\n    <span *ngIf="selectedView == \'history\'">\n      <ion-item *ngFor="let newsItem of newsService.allnewsItemsReversed$ | async" (click)="goToNewsItem(newsItem)">\n        <ion-avatar style="width:48px;height:48px" item-left>\n          <img src="{{user.profilePicURL}}">\n        </ion-avatar>\n        <h2>{{newsItem.title}}</h2>\n        <p>{{newsItem.newsItem}} Cirlces from {{userService.keyToUserName$(newsItem.from)}} to {{userService.keyToUserName$(newsItem.to)}}</p>\n      </ion-item>\n    </span>\n\n    <span *ngIf="selectedView == \'validators\'">\n      <ion-item *ngFor="let validator of validatorList" (click)="goToValidatorDetail(validator)">\n        <ion-avatar style="width:48px;height:48px" item-left>\n          <img src="{{validator?.profilePicURL}}">\n        </ion-avatar>\n        <h2>{{validator?.displayName}}</h2>\n        <p>{{validator?.description}}</p>\n      </ion-item>\n    </span>\n\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/profile/profile.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_angular2_notifications__["a" /* NotificationsService */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser__["c" /* DomSanitizer */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_7__providers_news_service_news_service__["a" /* NewsService */]])
], ProfilePage);

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 302:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge__ = __webpack_require__(438);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_merge__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_combineLatest__ = __webpack_require__(439);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_combineLatest___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_combineLatest__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_first__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_first___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_operator_first__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty__ = __webpack_require__(444);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_observable_empty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__validator_detail_validator_detail__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__user_detail_user_detail__ = __webpack_require__(153);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












let SearchPage = class SearchPage {
    constructor(navCtrl, formBuilder, userService) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.searchTerm = '';
        this.searchSubject$ = new __WEBPACK_IMPORTED_MODULE_4_rxjs_Subject__["Subject"]();
        this.search$ = this.searchSubject$;
    }
    setFilteredItems() {
        if (this.searchTerm == '') {
            this.searchSubject$.next([]);
            return;
        }
        let uObs = this.userService.filterUsers$(this.searchTerm);
        let vObs = this.userService.filterValidators$(this.searchTerm);
        __WEBPACK_IMPORTED_MODULE_3_rxjs_Observable__["Observable"].combineLatest(uObs, vObs).first().subscribe(combined => {
            let oneArray = [...combined[0], ...combined[1]];
            this.searchSubject$.next(oneArray);
        });
    }
    goToDetail(userOrVali) {
        if (userOrVali.requirements) {
            //validator
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__validator_detail_validator_detail__["a" /* ValidatorDetailPage */], userOrVali);
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__user_detail_user_detail__["a" /* UserDetailPage */], userOrVali);
        }
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad SearchPage');
    }
};
SearchPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-search',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/search/search.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title></ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-row>\n    <div *ngIf="searchUsers" class="search-list-backdrop"></div>\n    <ion-searchbar [(ngModel)]="searchTerm" (ionInput)="setFilteredItems()"></ion-searchbar>\n  </ion-row>\n  <!-- <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="Pull to refresh" refreshingSpinner="circles" refreshingText="Refreshing...">\n    </ion-refresher-content>\n  </ion-refresher> -->\n  <ion-list>\n    <ion-item *ngFor="let userOrVali of searchSubject$ | async" (click)="goToDetail(userOrVali)">\n      <ion-avatar style="width:48px;height:48px" item-left>\n        <img src="{{userOrVali.profilePicURL}}">\n      </ion-avatar>\n      <h2>{{userOrVali.displayName}}</h2>\n      <p>{{userOrVali.greeting}}</p>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/search/search.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_9__providers_user_service_user_service__["a" /* UserService */]])
], SearchPage);

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SendPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_notifications__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_debounceTime__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_debounceTime___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_debounceTime__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_transaction_service_transaction_service__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_analytics_service_analytics_service__ = __webpack_require__(66);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let SendPage = class SendPage {
    constructor(analytics, formBuilder, loadingCtrl, notificationsService, toastCtrl, transactionService, userService, navCtrl, navParams) {
        this.analytics = analytics;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.notificationsService = notificationsService;
        this.toastCtrl = toastCtrl;
        this.transactionService = transactionService;
        this.userService = userService;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.searchTerm = '';
        this.toUser = navParams.data;
        this.searchControl = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* FormControl */]();
        this.sendForm = formBuilder.group({
            toUserKey: [this.toUser.$key, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required],
            amount: [null, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["g" /* Validators */].required],
            message: [null]
        });
    }
    onSubmit(formData, formValid) {
        if (!formValid)
            return;
        this.loading = this.loadingCtrl.create({
            content: 'Sending ...'
        });
        this.loading.present();
        if (this.user.balance < formData.amount) {
            this.notificationsService.create('Send Fail', '', 'error');
            let msg = "You don't have enough Circles!";
            this.notificationsService.create('Balance', msg, 'warn');
            this.loading.dismiss();
            return;
        }
        if (this.transactionService.createTransactionIntent(formData.toUserKey, formData.amount, formData.message)) {
            //reset the recipient field
            this.toUser = null;
            this.sendForm.reset();
            this.loading.dismiss();
            this.navCtrl.pop();
            return;
        }
        else {
            this.loading.dismiss();
            return;
        }
    }
    ionViewDidLoad() {
        this.analytics.trackPageView('Send Page');
        this.userSub$ = this.userService.user$.subscribe(user => this.user = user, error => {
            this.toast = this.toastCtrl.create({
                message: 'Error getting user: ' + error,
                duration: 3000,
                position: 'middle'
            });
            console.error(error);
            this.toast.present();
        }, () => console.log('send ionViewDidLoad userSub$ obs complete'));
    }
    ionViewWillUnload() {
        this.userSub$.unsubscribe();
        if (this.searchUsers$ && typeof this.searchUsers$ !== "boolean")
            this.searchUsers$.subscribe().unsubscribe();
    }
};
SendPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-send',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/send/send.html"*/'<ion-header>\n\n  <ion-navbar>\n    <ion-title></ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n  <ion-row>\n    <ion-col col-8 offset-2>\n      Send Circles to another user\n    </ion-col>\n  </ion-row>\n\n\n  <form [formGroup]="sendForm" (ngSubmit)="onSubmit(sendForm.value, sendForm.valid)">\n    <ion-row>\n      <ion-col>\n        <ion-item>\n          <ion-label>Recipient</ion-label>\n          <ion-input hidden formControlName="toUserKey" type="text"></ion-input>\n          <div item-content>{{ toUser?.displayName }}</div>\n        </ion-item>\n        <ion-item>\n          <ion-label>Amount?</ion-label>\n          <ion-input formControlName="amount" type="number"></ion-input>\n        </ion-item>\n        <ion-item>\n          <ion-label>Message</ion-label>\n          <ion-input formControlName="message" type="text"></ion-input>\n        </ion-item>\n      </ion-col>\n    </ion-row>\n    <ion-row>\n\n    </ion-row>\n    <ion-row>\n      <ion-col>\n        <ion-item-divider>\n          <!-- <button ion-button full (click)="onDebugClick()">List Offer</button> -->\n          <button ion-button full type="submit" [disabled]="!sendForm.valid">Send Circles</button>\n        </ion-item-divider>\n      </ion-col>\n    </ion-row>\n  </form>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/send/send.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__providers_analytics_service_analytics_service__["a" /* AnalyticsService */],
        __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_3_angular2_notifications__["a" /* NotificationsService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_transaction_service_transaction_service__["a" /* TransactionService */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */]])
], SendPage);

//# sourceMappingURL=send.js.map

/***/ }),

/***/ 305:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WalletPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




let WalletPage = class WalletPage {
    constructor(db, navCtrl, navParams, userService, toastCtrl) {
        this.db = db;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.toastCtrl = toastCtrl;
    }
    priorityUp(coin) {
        coin.priority--;
        let c1 = this.displayWallet[coin.priority];
        c1.priority++;
        this.displayWallet[coin.priority] = coin;
        this.displayWallet[c1.priority] = c1;
    }
    priorityDown(coin) {
        coin.priority++;
        let c1 = this.displayWallet[coin.priority];
        c1.priority--;
        this.displayWallet[coin.priority] = coin;
        this.displayWallet[c1.priority] = c1;
    }
    orderByPriority() {
        this.displayWallet.sort((a, b) => {
            if (a.priority > b.priority) {
                return 1;
            }
            if (a.priority < b.priority) {
                return -1;
            }
            return 0;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let c of this.displayWallet) {
                this.user.wallet[c.owner] = c;
            }
            try {
                let a = yield this.db.object('/users/' + this.user.$key).update({
                    wallet: this.user.wallet
                });
            }
            catch (error) {
                console.error(error);
                throw new Error("Purchase fail");
            }
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad WalletPage');
        this.userSub$ = this.userService.user$.subscribe(user => {
            this.user = user;
            this.displayWallet = [];
            for (let i in this.user.wallet) {
                this.displayWallet.push(this.user.wallet[i]);
            }
            this.orderByPriority();
        }, error => {
            this.toast = this.toastCtrl.create({
                message: 'Error getting user: ' + error,
                duration: 3000,
                position: 'middle'
            });
            console.error(error);
            this.toast.present();
        }, () => console.log('send ionViewDidLoad userSub$ obs complete'));
    }
};
WalletPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-wallet',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/wallet/wallet.html"*/'<!--\n  Generated template for the WalletPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>WalletPage</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n  <ion-grid>\n		<ion-row>\n			<ion-col col-3>\n				Coin\n			</ion-col>\n			<ion-col col-4>\n				Owner\n			</ion-col>\n      <ion-col col-3>\n				Amount\n			</ion-col>\n      <ion-col col-2>\n        Priority\n      </ion-col>\n		</ion-row>\n		<ion-row *ngFor="let coin of displayWallet">\n			<ion-col col-3>\n				{{coin.title}}\n			</ion-col>\n			<ion-col col-4>\n				{{coin.owner}}\n			</ion-col>\n			<ion-col col-2>\n				{{coin.amount}}\n			</ion-col>\n      <ion-col col-3>\n        <button [disabled]="coin.priority < 1" class="pButton" (click)="priorityUp(coin)">\n          &uarr;\n        </button>\n        {{coin.priority}}\n        <button [disabled]="coin.priority >= displayWallet.length-1" class="pButton" (click)="priorityDown(coin)">\n          &darr;\n        </button>\n      </ion-col>\n		</ion-row>\n	</ion-grid>\n  <button ion-button full (click)="save()">SAVE</button>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/wallet/wallet.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3__providers_user_service_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */]])
], WalletPage);

//# sourceMappingURL=wallet.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(325);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 325:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__ = __webpack_require__(447);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__ = __webpack_require__(301);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_google_analytics__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_angular2_notifications__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_search_search__ = __webpack_require__(302);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_user_detail_user_detail__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_validator_detail_validator_detail__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_log_log__ = __webpack_require__(449);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_login_login__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_login_email_login_email__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_signup_email_signup_email__ = __webpack_require__(293);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_send_send__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_wallet_wallet__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_analytics_service_analytics_service__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_angularfire2_auth__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_angularfire2__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__providers_transaction_service_transaction_service__ = __webpack_require__(154);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__providers_news_service_news_service__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__providers_push_service_push_service__ = __webpack_require__(451);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_status_bar__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_splash_screen__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_ionic2_super_tabs__ = __webpack_require__(455);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__environments_environment__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__pipes_key_object_key_object__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_validator_service_validator_service__ = __webpack_require__(460);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


















//services










//vendor


//configs



let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_14__pages_login_email_login_email__["a" /* LoginEmailPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_log_log__["a" /* LogPage */],
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_search_search__["a" /* SearchPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_user_detail_user_detail__["a" /* UserDetailPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_signup_email_signup_email__["a" /* SignupEmailPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_send_send__["a" /* SendPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_wallet_wallet__["a" /* WalletPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_validator_detail_validator_detail__["a" /* ValidatorDetailPage */],
            __WEBPACK_IMPORTED_MODULE_30__pipes_key_object_key_object__["a" /* Keyobject */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_19_angularfire2_auth__["b" /* AngularFireAuthModule */],
            __WEBPACK_IMPORTED_MODULE_20_angularfire2_database__["b" /* AngularFireDatabaseModule */],
            __WEBPACK_IMPORTED_MODULE_21_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_29__environments_environment__["a" /* environment */].firebase),
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_7_angular2_notifications__["b" /* SimpleNotificationsModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_28_ionic2_super_tabs__["a" /* SuperTabsModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], { mode: 'ios' }) //this will force 'ios' style on all platforms
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_14__pages_login_email_login_email__["a" /* LoginEmailPage */],
            __WEBPACK_IMPORTED_MODULE_13__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_12__pages_log_log__["a" /* LogPage */],
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__["a" /* ProfilePage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_search_search__["a" /* SearchPage */],
            __WEBPACK_IMPORTED_MODULE_10__pages_user_detail_user_detail__["a" /* UserDetailPage */],
            __WEBPACK_IMPORTED_MODULE_15__pages_signup_email_signup_email__["a" /* SignupEmailPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_send_send__["a" /* SendPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_wallet_wallet__["a" /* WalletPage */],
            __WEBPACK_IMPORTED_MODULE_11__pages_validator_detail_validator_detail__["a" /* ValidatorDetailPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_18__providers_analytics_service_analytics_service__["a" /* AnalyticsService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_google_analytics__["a" /* GoogleAnalytics */],
            __WEBPACK_IMPORTED_MODULE_24__providers_news_service_news_service__["a" /* NewsService */],
            __WEBPACK_IMPORTED_MODULE_25__providers_push_service_push_service__["a" /* PushService */],
            __WEBPACK_IMPORTED_MODULE_27__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_26__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_23__providers_transaction_service_transaction_service__["a" /* TransactionService */],
            __WEBPACK_IMPORTED_MODULE_22__providers_user_service_user_service__["a" /* UserService */],
            // PushService,
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_31__providers_validator_service_validator_service__["a" /* ValidatorService */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(244);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_login_login__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__ = __webpack_require__(294);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_wallet_wallet__ = __webpack_require__(305);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










let MyApp = class MyApp {
    constructor(alertController, userService, events, afAuth, db, platform, statusBar, splashScreen, 
        //aprivate analytics: AnalyticsService,
        loadingCtrl) {
        this.alertController = alertController;
        this.userService = userService;
        this.events = events;
        this.afAuth = afAuth;
        this.db = db;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.loadingCtrl = loadingCtrl;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */];
        platform.ready().then(() => {
            if (this.platform.is('cordova')) {
            }
            statusBar.styleDefault();
            this.userService.authState$.subscribe(auth => {
                if (auth)
                    this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_8__pages_profile_profile__["a" /* ProfilePage */], { nav: this.nav });
                else { }
                //todo: error here
            }, error => console.error(error), () => { });
        });
    }
    goToWallet() {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_9__pages_wallet_wallet__["a" /* WalletPage */]);
    }
    logout() {
        //close subscriptions?? close services??
        this.userService.signOut().then((user) => {
            console.log('logout success');
            this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_login_login__["a" /* LoginPage */]);
        }, function (error) {
            console.log('logout fail:', error);
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* ViewChild */])('content'),
    __metadata("design:type", Object)
], MyApp.prototype, "nav", void 0);
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/app/app.html"*/'<ion-menu [content]="content">\n  <ion-header>\n    <ion-toolbar>\n      <ion-title>Menu</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n\n    <button menuClose ion-item >\n      <ion-icon name="cog" item-left></ion-icon>\n      Settings\n    </button>\n\n    <button menuClose ion-item >\n      <ion-icon name="information" item-left></ion-icon>\n      About\n    </button>\n\n    <button menuClose ion-item (click)="goToWallet()">\n      <ion-icon name="cash" item-left></ion-icon>\n      Wallet\n    </button>\n\n    <button menuClose ion-item (click)="logout()">\n      <ion-icon name="log-out" item-left></ion-icon>\n      Logout\n    </button>\n\n  </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<simple-notifications></simple-notifications>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_service_user_service__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* Events */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_5_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* LoadingController */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 449:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the LogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
let LogPage = class LogPage {
    constructor(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LogPage');
    }
};
LogPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-log',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/log/log.html"*/'<!--\n  Generated template for the LogPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>LogPage</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/log/log.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */]])
], LogPage);

//# sourceMappingURL=log.js.map

/***/ }),

/***/ 451:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PushService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__ = __webpack_require__(452);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






let PushService = class PushService {
    constructor(oneSignal, userService) {
        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        this.oneSignal = oneSignal;
        this.userService = userService;
        this.oneSignal.startInit(__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].cloudSettings.push.app_id, __WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].cloudSettings.push.sender_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
            console.log('handleNotificationReceived()');
        });
        this.oneSignal.handleNotificationOpened().subscribe(() => {
            console.log('handleNotificationOpened()');
        });
        this.oneSignal.endInit();
    }
    initialise() {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = yield this.userService.user$.take(1).toPromise();
            if (this.user.pushID)
                return;
            let ids = yield this.oneSignal.getIds();
            let updateObject = { pushID: ids.userId };
            return yield this.userService.update(updateObject);
        });
    }
    pushToUser(toUser, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let notificationObj = {
                contents: { en: message },
                headings: { en: 'Circles Incoming!' },
                include_player_ids: [toUser.pushID]
            };
            return yield this.oneSignal.postNotification(notificationObj);
        });
    }
    ngOnDestroy() {
        //this.dbNewsSub$.unsubscribe();
    }
};
PushService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_5__providers_user_service_user_service__["a" /* UserService */]])
], PushService);

//# sourceMappingURL=push-service.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Keyobject; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let Keyobject = class Keyobject {
    transform(value, args) {
        let keys = [];
        for (let key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    }
};
Keyobject = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["W" /* Pipe */])({
        name: 'keyobject'
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])()
], Keyobject);

//# sourceMappingURL=key-object.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValidatorDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_service_user_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ValidatorDetailPage = class ValidatorDetailPage {
    constructor(navCtrl, navParams, userService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.trusted = false;
        this.validator = navParams.data;
    }
    revokeTrust() {
        this.validator.trustedUsers.filter(user => user !== this.user.$key);
        this.trusted = false;
    }
    affordTrust() {
        //this.userService.addTrustedUser(this.viewUser.$key);
        if (this.validator.trustedUsers)
            this.validator.trustedUsers.push(this.user.$key);
        else
            this.validator.trustedUsers = [this.user.$key];
        this.trusted = true;
    }
    ionViewDidLoad() {
        this.userSub$ = this.userService.initUserSubject$.subscribe(user => {
            this.user = user;
            if (this.user.validators) {
                for (var validator of this.user.validators) {
                    for (var tUserKey of validator.trustedUsers) {
                        let u = this.userService.users[tUserKey];
                        this.trustedUsers.push(u);
                        if (tUserKey == this.validator.$key)
                            this.trusted = true;
                    }
                }
            }
        });
    }
};
ValidatorDetailPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-validator-detail',template:/*ion-inline-start:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/validator-detail/validator-detail.html"*/'validator\n<ion-header>\n\n  <ion-navbar>\n    <ion-title></ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n  <ion-card>\n    <img src="{{validator.profilePicURL}}">\n    <ion-card-content>\n      <ion-card-title>\n        <h1>{{validator.displayName}}</h1>\n        <p *ngIf="trusted == true">Connection: {{user.displayName}} - {{validator.displayName}}</p>\n      </ion-card-title>\n      <ion-list no-lines>\n        <ion-item>\n          <ion-icon name="mail" item-left></ion-icon>\n          <p>{{validator.email}}</p>\n        </ion-item>\n        <ion-item *ngIf="trusted" (click)="revokeTrust()">\n          Revoke Trust Validation\n          <ion-icon name="unlock" color="green" item-right>\n          </ion-icon>\n        </ion-item>\n        <ion-item *ngIf="!trusted" (click)="affordTrust()">\n          Apply For Trust Validation\n          <ion-icon name="lock" color="red" item-right>\n          </ion-icon>\n        </ion-item>\n        <ion-item *ngIf="trusted">\n          <ion-badge>Trusted</ion-badge>\n          <ion-icon name="send" item-right>\n          </ion-icon>\n        </ion-item>\n        <ion-item>\n          <ion-icon name="information" item-left></ion-icon>\n          <p>{{validator.description}}</p>\n        </ion-item>\n        <ion-item>\n          <ion-icon name="people" item-left></ion-icon>\n          <ion-grid>\n        		<ion-row>\n        			<ion-col *ngFor="let vali of trustedUsers | async">\n                <ion-avatar style="width:48px;height:48px">\n                  <img src="{{vali.profilePicURL}}">\n                </ion-avatar>\n              </ion-col>\n            </ion-row>\n          </ion-grid>\n        </ion-item>\n      </ion-list>\n    </ion-card-content>\n  </ion-card>\n</ion-content>\n'/*ion-inline-end:"/Volumes/HDD/work/Client Work/TheRules/Circles/circles_testnet_v2/src/pages/validator-detail/validator-detail.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_user_service_user_service__["a" /* UserService */]])
], ValidatorDetailPage);

//# sourceMappingURL=validator-detail.js.map

/***/ }),

/***/ 460:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValidatorService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ValidatorService = class ValidatorService {
    constructor(db) {
        this.db = db;
        this.validators$ = this.db.list('/validators/');
        this.validators = [];
        this.validators$.subscribe(valis => {
            for (let v of valis)
                this.validators[v.$key] = v;
        });
    }
    setUserValidators(user) {
        let vals = [...user.validators];
        user.validators = [];
        for (let i in vals) {
            let key = vals[i];
            user.validators[key] = this.validators[key];
        }
    }
};
ValidatorService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */]])
], ValidatorService);

//# sourceMappingURL=validator-service.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AnalyticsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_google_analytics__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_ReplaySubject__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_ReplaySubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_ReplaySubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(151);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let AnalyticsService = class AnalyticsService {
    constructor(platform, gaCordova) {
        this.platform = platform;
        this.gaCordova = gaCordova;
        this.platform.ready().then(() => {
            if (this.platform.is("ios") || this.platform.is("android")) {
                this.gaCordova.startTrackerWithId(__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].googleAnalytics.id).then(res => {
                    console.log("startTrackerWithId res", res);
                    this.trackPageView('Circles Bootup');
                    // now that we are sure the tracker has started lets connect our ReplaySubject
                    // so that it can send any previous pageviews.
                    this.pageViewsSub$ = this.pageViewsSubject$.subscribe(pageName => {
                        if (this.platform.is("ios") || this.platform.is("android")) {
                            this.gaCordova.trackView(pageName).then(success => {
                                console.log("GoogleAnalytics: Tracked view for mobile: " + pageName);
                            }).catch(error => {
                                console.log("GoogleAnalytics error tracking view: " + error);
                            });
                        }
                        else {
                            ga('set', 'page', pageName);
                            ga('send', 'pageview');
                            console.log("GoogleAnalytics: Tracked pageview for web: " + pageName);
                        }
                    }, error => {
                        console.log("GoogleAnalytics: pageView Subject fail: " + error);
                    }, () => console.log('analytics-service constructor pageViewsSub$ obs complete'));
                }, error => console.log("startTrackerWithId error", error));
            }
        });
        this.pageViewsSubject$ = new __WEBPACK_IMPORTED_MODULE_3_rxjs_ReplaySubject__["ReplaySubject"](10);
    }
    trackPageView(pageName) {
        this.pageViewsSubject$.next(pageName);
    }
    ngOnDestroy() {
        this.pageViewsSub$.unsubscribe();
    }
};
AnalyticsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* Platform */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_google_analytics__["a" /* GoogleAnalytics */]])
], AnalyticsService);

//# sourceMappingURL=analytics-service.js.map

/***/ })

},[311]);
//# sourceMappingURL=main.js.map