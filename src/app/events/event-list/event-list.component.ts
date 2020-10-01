import { Component, OnInit } from '@angular/core';
import { Event } from '../event';
import { EventService } from '../event.service';
import { EventDetailsComponent } from '../event-details/event-details.component'

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  providers: [EventService]
})

export class EventListComponent implements OnInit {
  events: Event[]
  selectedEvent: Event

  constructor(private eventService: EventService) {
    this.events = [];
  }

  ngOnInit(): void {
    this.eventService.getEvents()
      .then((events: Event[]) => {
        if (events) {
          this.events = events.map((event) => {
            if (!event.phone) {
              event.phone = ''
            }
            return event;
          });
        }
      });
  }

  private getIndexOfEvent = (eventId: string) => {
    return this.events.findIndex((event) => {
      return event._id === eventId;
    });
  }

  selectEvent(event: Event) {
    this.selectedEvent = event;
  }

  createNewEvent() {
    var event: Event = {
      name: '',
      email: '',
      phone: '',
      date: new Date()
    };

    this.selectedEvent = event;
  }

  deleteEvent = (eventId: string) => {
    var idx = this.getIndexOfEvent(eventId);
    if (idx !== -1) {
      this.events.splice(idx, 1);
      this.selectEvent(null);
      return this.events;
    }
  }

  addEvent = (event: Event) => {
    this.events.push(event);
    this.selectEvent(event);
    return this.events;
  }

  updateEvent = (event: Event) => {
    var idx = this.getIndexOfEvent(event._id);
    if (idx !== -1) {
      this.events[idx] = event;
      this.selectEvent(event);
    }
    return this.events;
  }

}
