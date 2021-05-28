import { Injectable } from '@angular/core';
import { Task } from './task';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getTasks(stream: Stream, level: string): Promise<void | Task[]> {
    let params = new HttpParams().set('level', level);
    params = params.append('streamId', stream._id)

    var url = this.tasksUrl + '/' + level + "&" + stream._id;
    return this.http.get(url, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as Task[])
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
