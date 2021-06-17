import { Component, Input, OnInit } from '@angular/core';
import { Stream } from './stream';
import { ProgressionService } from '../progression.service';
import { StreamService } from './stream.service';
import { ProgressionComponent } from '../progression.component';

@Component({
  selector: 'streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {
  @Input()
  stream: Stream;

  @Input()
  newStream: Stream;

  selectedStream: Stream;

  streams: Stream[];
  toggle = false;
  
  constructor(private streamService: StreamService, private progressionService: ProgressionService, public progressionComponent: ProgressionComponent) { 
    this.streamService.getStreams().then((streams: Stream[]) => {
      if (streams) {
        this.streams = streams.map((stream) => {
          if (!stream.name) {
            stream.name = 'Nameless Stream'
          }
          return stream;
        });
      }
    }).then(streams => {this.selectStream(this.streams[0])});
    this.progressionService.selectedStream(this.selectedStream);
    this.newStream = {
      name: ""
    }
  }

  ngOnInit(): void {
    // this.streams = this.streamService.getStreams();
    // this.selectedStream = this.streams[0]
  }
  
  selectStream(stream: Stream){
    this.selectedStream = stream;
    this.toggle = !this.toggle;
    this.progressionService.selectedStream(this.selectedStream);
    console.log("Selected stream: " + stream.name + " ID: " + stream._id)
  }

  counter(i: number) {
    return new Array(i+1);
  }
  
  getSelectedStream(stream: Stream){
    return stream == this.selectedStream;
  }

  createStream(stream: Stream) {
      this.streamService.createStream(stream).then((createdStream: Stream) => {
        const tempStream = {
          ...createdStream
        }
        this.streams.push(tempStream);
        this.selectedStream = createdStream;
        
      })
  }

  deleteStream(id) {
    this.streamService.deleteStream(id);
    setTimeout(() => {  this.refreshStreams(); }, 10);
  }

  refreshStreams(){
    this.streamService.getStreams()
      .then((streams: Stream[]) => {
        if (streams) {
          this.streams = streams.map((stream) => {
            if (!stream.name) {
              stream.name = ''
            }
            return stream;
          });
        }
      });
  }


}
