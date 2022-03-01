import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { StereoAudioRecorder } from 'recordrtc';

@Component({
  selector: 'app-audio-recorder',
  templateUrl: './audio-recorder.component.html',
  styleUrls: ['./audio-recorder.component.scss'],
})
export class AudioRecorderComponent {
  //Lets declare Record OBJ
  public record?: any;
  //Will use this flag for toggeling recording
  recording = false;
  //URL of Blob
  public url?: string;
  public error?: string;
  constructor(private domSanitizer: DomSanitizer) {}

  public sanitize(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  /**
   * Start recording.
   */
  public initiateRecording(): void {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  /**
   * Will be called automatically.
   */
  public successCallback(stream: MediaStream): void {
    var options = {
      mimeType: 'audio/wav',
      numberOfAudioChannels: 1,
      sampleRate: 16000,
    };
    //Start Actuall Recording
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
   * Stop recording.
   */
  public stopRecording() {
    this.recording = false;

    if (this.record) {
      this.record.stop(this.processRecording.bind(this));
    }
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  public processRecording(blob: Blob): void {
    this.url = URL.createObjectURL(blob);
    console.log('blob', blob);
    console.log('url', this.url);
  }
  /**
   * Process Error.
   */
  public errorCallback(error: string) {
    this.error = 'Can not play audio in your browser: ' + error;
  }
}
