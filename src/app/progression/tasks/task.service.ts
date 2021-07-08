import { Injectable } from '@angular/core';
import { Task } from './task';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Stream } from '../streams/stream';

@Injectable()
export class TaskService {
  private tasksUrl = '/api/tasks';
  
  constructor(private http: HttpClient) {
    this.tasksUrl = environment.serverurl + this.tasksUrl;
   }

  // GET /api/tasks
  getAllTasks(): Promise<void | Task[]> {
    return this.http.get(this.tasksUrl, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as Task[])
    .catch(this.handleError);
  }

  // GET /api/tasks/<level>/<streamId>
  getTasks(stream: Stream, level: string): Promise<void | Task[]> {
    // Build the URL from the given parameters
    var url = this.tasksUrl + '/' + level + "&" + stream._id;
    // Send the HTTP request and await the response
    return this.http.get(url, {observe: 'body' ,responseType: 'json'}).toPromise()
    // Convert the response to a list of tasks
    .then(response => response as Task[])
    // Handle any returned error (e.g. stream not found)
    .catch(this.handleError);
  }
  
  // POST /api/tasks
  createTask(newTask: Task): Promise<void | Task> {
    return this.http.post(this.tasksUrl, newTask, {responseType: 'json'})
      .toPromise()
      .then(response => response as Task)
      .catch(this.handleError);
  }
  
  // DELETE /api/tasks/:id
  deleteTask(delTaskId: String): Promise<void | String> {
    return this.http.delete(this.tasksUrl + '/' + delTaskId)
                .toPromise()
                .then(response => response as String)
                .catch(this.handleError);
  }
  
  // put("/api/tasks/:id")
  updateTask(putTask: Task): Promise<void | Task> {
    var putUrl = this.tasksUrl + '/' + putTask._id;
    return this.http.put(putUrl, putTask, {responseType: 'json'})
                .toPromise()
                .then(response => response as Task)
                .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}
