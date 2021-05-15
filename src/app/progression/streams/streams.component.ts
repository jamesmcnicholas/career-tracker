import { Component, OnInit } from '@angular/core';
import { Stream } from './stream';
import { ProgressionService } from '../progression.service';
import { StreamService } from './stream.service';

@Component({
  selector: 'streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./streams.component.css']
})
export class StreamsComponent implements OnInit {
  
  selectedStream: Stream;
  streams;
  toggle = false;
  
  constructor(private streamService: StreamService, private progressionService: ProgressionService) { 
    this.progressionService.selectedStream(this.selectedStream);
  }

  ngOnInit(): void {
    // this.streams = this.streamService.getStreams();
    // this.selectedStream = this.streams[0]
  }
  
  selectStream(stream: Stream){
    this.selectedStream = stream;
    this.toggle = !this.toggle;
    this.progressionService.selectedStream(this.selectStream);
  }

}
