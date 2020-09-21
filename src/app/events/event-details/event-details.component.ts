import { Component, Input } from '@angular/core';
import { Event } from '../event';
import { EventService } from '../event.service'

@Component({
  selector: 'event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent {
  @Input()
  event: Event;
  
  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;
  
  constructor(private eventService: EventService) { }
  
  createEvent(event: Event) {
    this.eventService.createEvent(event).then((newEvent: Event[]) => {
      this.createHandler(newEvent);
    });
  }

  updateEvent(event: Event): void {
    this.eventService.updateEvent(event).then((updatedEvent: Event) => {
      this.updateHandler(updatedEvent);
    });
  }

  deleteEvent(eventId: String): void {
    this.eventService.deleteEvent(eventId).then((deletedEventId: String) => {
      this.deleteHandler(deletedEventId);
    });
  }
}
