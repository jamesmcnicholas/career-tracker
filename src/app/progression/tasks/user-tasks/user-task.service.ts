import { Injectable } from '@angular/core';
import { UserTask } from './user-task';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserTaskService {
  private userTasksUrl = '/api/usertasks';
  
  constructor(private http: HttpClient) {
    this.userTasksUrl = environment.serverurl + this.userTasksUrl;
   }

  // GET /api/usertasks
  getTasks(): Promise<void | UserTask[]> {
    return this.http.get(this.userTasksUrl, {observe: 'body' ,responseType: 'json'}).toPromise()
    .then(response => response as UserTask[])
    .catch(this.handleError);
  }
  
  // POST /api/usertasks
  createTask(newTask: UserTask): Promise<void | UserTask> {
    return this.http.post(this.userTasksUrl, newTask, {responseType: 'json'})
      .toPromise()
      .then(response => response as UserTask)
      .catch(this.handleError);
  }
  
  // DELETE /api/tasks/:id
  deleteTask(delTaskId: String): Promise<void | String> {
    return this.http.delete(this.userTasksUrl + '/' + delTaskId)
                .toPromise()
                .then(response => response as String)
                .catch(this.handleError);
  }
  
  // put("/api/tasks/:id")
  updateTask(putTask: UserTask): Promise<void | UserTask> {
    var putUrl = this.userTasksUrl + '/' + putTask._id;
    return this.http.put(putUrl, putTask, {responseType: 'json'})
                .toPromise()
                .then(response => response as UserTask)
                .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}
