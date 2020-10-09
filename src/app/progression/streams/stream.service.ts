import { Injectable } from '@angular/core';
import { Stream } from './stream';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class StreamService {
  private streamsUrl = '/api/streams';
  
  constructor(private http: HttpClient) {
    this.streamsUrl = environment.serverurl + this.streamsUrl;
   }
  
  // GET /api/streams
  getStreams(): Promise<void | Stream[]> {
    return this.http.get(this.streamsUrl, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as Stream[])
    .catch(this.handleError);
  }
  
  // POST /api/streams
  createStream(newStream: Stream): Promise<void | Stream[]> {
    return this.http.post(this.streamsUrl, newStream, {responseType: 'json'})
      .toPromise()
      .then(response => response as Stream[])
      .catch(this.handleError);
  }
  
  // DELETE /api/streams/:id
  deleteStream(delStreamId: String): Promise<void | String> {
    return this.http.delete(this.streamsUrl + '/' + delStreamId)
                .toPromise()
                .then(response => response as String)
                .catch(this.handleError);
  }
  
  // put("/api/streams/:id")
  updateStream(putStream: Stream): Promise<void | Stream> {
    var putUrl = this.streamsUrl + '/' + putStream._id;
    return this.http.put(putUrl, putStream, {responseType: 'json'})
                .toPromise()
                .then(response => response as Stream)
                .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}
