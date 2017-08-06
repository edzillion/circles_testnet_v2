import { Injectable } from '@angular/core';
import { Toast, ToastController } from 'ionic-angular';

import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';


export class Upload {
  $key: string;
  createdAt: Date = new Date();
  name: string;
  owner: string;
  progress: number;
  size:number;
  url: string;
}

export class UploadImage extends Upload {
  base64String: string;
  constructor(base64String: string) {
    super();
    this.base64String = base64String;
  }
}

export class UploadFile extends Upload {
  file: File;
  constructor(file: File) {
    super();
    this.file = file;
  }
}

@Injectable()
export class StorageService {

  private profilePicRef: any;

  private toast: Toast;

  private uploads: FirebaseListObservable<Upload[]>;

  private progressSubject$: Subject<number> = new Subject(); //3 should add smoothing?!?
  public progress$: Observable<number>;
  public loading$: Observer<any>;

  constructor(
    private db: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {
    this.profilePicRef = firebase.storage().ref('/profilepics');
    this.progress$ = this.progressSubject$.asObservable();

    this.uploads = this.db.list('/uploads');
  }

  resizeAndUploadProfilePic(upload: UploadImage): Promise<any> {
    return this.resizeProfilePic(upload, 800, 600).then(
      uploadResized => {
        return this.uploadFile(uploadResized);
      }
    )
  }

  public async resizeProfilePic(upload: UploadImage, height:number, width:number): Promise<Upload>{
    return new Promise<Upload>((resolve, reject) => {

      let img = new Image;
      img.src = upload.base64String;

      img.onload = (() => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // We set the dimensions at the wanted size.
        canvas.width = height;
        canvas.height = width;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(img, 0, 0, width, height);

        let resize = canvas.toDataURL('image/jpeg', 0.8);
        upload.base64String = resize.substring(23);
        resolve(upload);
      });

      img.onerror = ((error) => {
        let err = {details:error,message:'Error loading as image'};
        reject(err);
      });
    });
  }

  public async uploadFile(upload: Upload){

    let uploadTask;
    if (upload instanceof UploadImage) {
      let c = this.profilePicRef.child(upload.owner);
      uploadTask = c.putString(upload.base64String, 'base64', { contentType: 'image/jpg' });
    }
    else if (upload instanceof UploadFile) {
      let c = this.profilePicRef.child(upload.owner);
      uploadTask = c.put(upload.file);
    }

    return new Promise ((resolve,reject) => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + upload.progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          let err = {details:error,message:'Error uploading image'};
          reject(err);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          console.log('Upload Complete');
          upload.progress = 100;
          upload.url = uploadTask.snapshot.downloadURL;
          upload.name = uploadTask.snapshot.metadata.name;
          upload.size = uploadTask.snapshot.metadata.size;
          this.saveFileData(upload);
          resolve(upload.url);
        }
      );
    });
  }


  public isUploadSupported(): boolean {
    if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
      return false;
    }
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.uploads.push(upload);
  }

}
