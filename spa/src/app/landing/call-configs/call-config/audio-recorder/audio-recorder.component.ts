import { Component, Input, OnInit } from '@angular/core';
import {
  Storage,
  percentage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';
import { StereoAudioRecorder } from 'recordrtc';
import { Observable } from 'rxjs';
import {
  CollectionReference,
  doc,
  Firestore,
  updateDoc,
} from '@angular/fire/firestore';

import { filterNullish, getCallConfigCollectionReference } from '@common';
import { getCallConfigDocument } from '@constants';
import { CallConfig } from '@models';

interface TaskWrapper {
  readonly data?: {
    readonly task: UploadTask;
    readonly percentage$: Observable<{
      readonly progress: number;
      readonly snapshot: UploadTaskSnapshot;
    }>;
  };
  readonly error?: {
    readonly message: string;
  };
}

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent implements OnInit {
  @Input() userUid?: string;
  @Input() callConfigUid?: string;
  //Lets declare Record OBJ
  public record?: any;
  //Will use this flag for toggeling recording
  public recording = false;
  //URL of Blob
  public url?: string;
  public error?: string;
  public blob?: Blob;
  private callConfigCollectionReference?: CollectionReference<CallConfig>;

  public taskWrapper?: TaskWrapper;

  constructor(
    private readonly storage: Storage,
    private readonly firestore: Firestore
  ) {}

  ngOnInit(): void {
    if (!this.userUid) {
      return;
    }

    this.callConfigCollectionReference = getCallConfigCollectionReference(
      this.firestore,
      this.userUid
    );
  }

  /**
   * Start recording.
   */
  public initiateRecording(): void {
    this.recording = true;
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then(
        (stream) => {
          this.record = new StereoAudioRecorder(stream, {
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,
          });
          this.record.record();
        },
        (error: string) => {
          this.error = 'Can not play audio in your browser: ' + error;
        }
      );
  }

  /**
   * Stop recording.
   */
  public stopRecording() {
    this.recording = false;

    if (this.record) {
      this.record.stop((blob: Blob) => {
        this.url = URL.createObjectURL(blob);
        console.log('blob', blob);
        console.log('url', this.url);
        this.blob = blob;
      });
    }
  }

  public async startUpload(): Promise<void> {
    if (
      !this.blob ||
      !this.userUid ||
      !this.callConfigUid ||
      !this.callConfigCollectionReference
    ) {
      return;
    }

    const path = `${getCallConfigDocument(
      this.userUid,
      this.callConfigUid
    )}.wav`;
    const task = uploadBytesResumable(ref(this.storage, path), this.blob);
    const percentage$ = percentage(task).pipe(filterNullish());
    const wrapper: TaskWrapper = {
      data: { task, percentage$ },
    };

    this.taskWrapper = wrapper;
    const downloadUrl = await getDownloadURL((await task).ref);
    updateDoc(doc(this.callConfigCollectionReference, this.callConfigUid), {
      soundFile: downloadUrl,
    });
  }
}
