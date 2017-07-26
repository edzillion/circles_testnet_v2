export const environment = {
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
