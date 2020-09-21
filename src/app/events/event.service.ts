import { Injectable } from '@angular/core';
import { Event } from './event';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EventService {
  private eventsUrl = '/api/events';
  
  constructor(private http: HttpClient) { }
  
  // GET /api/events
  getEvents(): Promise<void | Event[]> {
    return this.http.get(this.eventsUrl, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as Event[])
    .catch(this.handleError);
  }
  
  // POST /api/events
  createEvent(newEvent: Event): Promise<void | Event[]> {
    return this.http.post(this.eventsUrl, newEvent, {responseType: 'json'})
      .toPromise()
      .then(response => response as Event[])
      .catch(this.handleError);
  }
  
  // DELETE /api/events/:id
  deleteEvent(delEventId: String): Promise<void | String> {
    return this.http.delete(this.eventsUrl + '/' + delEventId)
                .toPromise()
                .then(response => response as String)
                .catch(this.handleError);
  }
  
  // put("/api/events/:id")
  updateEvent(putEvent: Event): Promise<void | Event> {
    var putUrl = this.eventsUrl + '/' + putEvent._id;
    return this.http.put(putUrl, putEvent, {responseType: 'json'})
                .toPromise()
                .then(response => response as Event)
                .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}
