import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { UserTask, Status } from './user-task';
import { UserTaskService } from './user-task.service';

@Component({
  selector: 'user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.css']
})
export class UserTasksComponent implements OnInit {
  public userTasks: UserTask[];

  userId: string

  constructor(private userTaskService: UserTaskService, protected readonly keycloak: KeycloakService) { }

  ngOnInit(): void {
    // this.getUsername();  
  }

  async getUsername(): Promise<string> {
    this.userId = await this.keycloak.getUsername();
    console.log("Username: " + this.userId)
    return this.userId
  }

  createUserTask(userTask: UserTask){
    this.userTaskService.createUserTask(userTask).then((createdUserTask: UserTask)=> {
      const tempUserTask = {
        ...createdUserTask
      }
      this.userTasks.push(tempUserTask);
    })
  }

  updateUserTask(userTask: UserTask){
    this.userTaskService.updateUserTask(userTask);
  }

  refreshUserTasks(){
    this.userTaskService.getUserTasks(this.userId)
      .then((userTasks: UserTask[]) => {
        if (userTasks) {
          this.userTasks = userTasks.map((userTask) => {
            if (!userTask.status) {
              userTask.status = Status.Red
            }
            return userTask;
          });
        }
      });
  }

}
