import { Injectable } from '@angular/core';
import { Contact } from './contact';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ContactService {
  private contactsUrl = '/api/contacts';
  
  constructor(private http: HttpClient) {
    this.contactsUrl = environment.serverurl + this.contactsUrl;
   }
  
  // GET /api/contacts
  getContacts(): Promise<void | Contact[]> {
    return this.http.get(this.contactsUrl, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as Contact[])
    .catch(this.handleError);
  }
  
  // POST /api/contacts
  createContact(newContact: Contact): Promise<void | Contact[]> {
    return this.http.post(this.contactsUrl, newContact, {responseType: 'json'})
      .toPromise()
      .then(response => response as Contact[])
      .catch(this.handleError);
  }
  
  // DELETE /api/contacts/:id
  deleteContact(delContactId: String): Promise<void | String> {
    return this.http.delete(this.contactsUrl + '/' + delContactId)
                .toPromise()
                .then(response => response as String)
                .catch(this.handleError);
  }
  
  // put("/api/contacts/:id")
  updateContact(putContact: Contact): Promise<void | Contact> {
    var putUrl = this.contactsUrl + '/' + putContact._id;
    return this.http.put(putUrl, putContact, {responseType: 'json'})
                .toPromise()
                .then(response => response as Contact)
                .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}
