This is a starter template for [Ionic](http://ionicframework.com/docs/) projects.

## easy setup
1. if you don't already have ionic installed run `sudo npm install -g ionic cordova`
2. `sudo npm install` to install other packages
3. `ionic serve` to compile and run the app on a webserver.

## to run on ios / android:
1. to install deployment tool: `npm install -g ios-deploy`
2. if that fails try:
`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo npm install -g ios-deploy --unsafe-perm=true --allow-root`
https://github.com/npm/npm/issues/10055
3. `sudo ionic cordova run ios`

## How to use this template

*This template does not work on its own*. The shared files for each starter are found in the [ionic2-app-base repo](https://github.com/ionic-team/ionic2-app-base).

To use this template, either create a new ionic project using the ionic node.js utility, or copy the files from this repository into the [Starter App Base](https://github.com/ionic-team/ionic2-app-base).

### With the Ionic CLI:

Take the name after `ionic2-starter-`, and that is the name of the template to be used when using the `ionic start` command below:

```bash
$ sudo npm install -g ionic cordova
$ ionic start myTabs tabs
```

Then, to run it, cd into `myTabs` and run:

```bash
$ ionic cordova platform add ios
$ ionic cordova run ios
```

Substitute ios for android if not on a Mac.

