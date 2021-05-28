import { Component, OnInit } from '@angular/core';
import { UserTask, Status } from './user-task';
import { UserTaskService } from './user-task.service';

@Component({
  selector: 'app-user-tasks',
  templateUrl: './user-tasks.component.html',
  styleUrls: ['./user-tasks.component.css']
})
export class UserTasksComponent implements OnInit {
  public userTasks: UserTask[];


  constructor(private userTaskService: UserTaskService) { }

  ngOnInit(): void {
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
    this.userTaskService.getUserTasks()
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
