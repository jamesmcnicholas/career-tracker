import { Component, Input } from '@angular/core';
import { Stream } from './stream';
import { ProgressionService } from '../progression.service';
import { StreamService } from './stream.service';
import { ProgressionComponent } from '../progression.component';

@Component({
  selector: 'streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent {
  @Input()
  stream: Stream;

  @Input()
  newStream: Stream;

  selectedStream: Stream;

  streams: Stream[];
  toggle = false;
  
  // Create a stream object
  constructor(private streamService: StreamService, private progressionService: ProgressionService, public progressionComponent: ProgressionComponent) { 
    // Grab existing streams from the database and map them to the list of streams
    this.streamService.getStreams().then((streams: Stream[]) => {
      // Make sure at least one stream exists
      if (streams) {
        this.streams = streams.map((stream) => {
          // If a stream has no name, assign it some placeholder text
          if (!stream.name) {
            stream.name = 'Nameless Stream'
          }
          return stream;
        });
      }
    // Once streams are retrieved, select the first one
    }).then(streams => {this.selectStream(this.streams[0])});
    // Update the observable selected stream
    this.progressionService.selectedStream(this.selectedStream);

    // Set up the new stream object with placeholder text
    this.newStream = {
      name: ""
    }
  }
  
  selectStream(stream: Stream){
    this.selectedStream = stream;
    // Toggles the button to active state
    this.toggle = !this.toggle;
    // Update observable selected stream
    this.progressionService.selectedStream(this.selectedStream);
  }

  // Helper method for generating stream buttons
  counter(i: number) {
    return new Array(i+1);
  }
  
  getSelectedStream(stream: Stream){
    return stream == this.selectedStream;
  }

  createStream(stream: Stream) {
    // Invoke the stream service to create a new stream and save to db
      this.streamService.createStream(stream).then((createdStream: Stream) => {
        const tempStream = {
          ...createdStream
        }
        /// add the new stream to the list of streams
        this.streams.push(tempStream);
        // select the newly created stream
        this.selectStream(createdStream);
        
      })
  }

  deleteStream(id) {
    this.streamService.deleteStream(id);
    setTimeout(() => {  this.refreshStreams(); }, 10);
  }

  // Update the list of streams
  refreshStreams(){
    this.streamService.getStreams()
      .then((streams: Stream[]) => {
        if (streams) {
          this.streams = streams.map((stream) => {
            if (!stream.name) {
              stream.name = 'Nameless Stream'
            }
            return stream;
          });
        }
      });
  }


}
