import { Component, Input, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskService } from './task.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @Input()
  task: Task;

  firstname: string;

  tasks: Task[]

  constructor(private taskService: TaskService) { 
    this.tasks = [];
  }

  ngOnInit(): void {
    this.createNewTask();

    this.taskService.getTasks()
      .then((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks.map((task) => {
            if (!task.description) {
              task.description = ''
            }
            return task;
          });
        }
    });
  }

  createTask(task: Task){
    this.taskService.createTask(task).then((newTask: Task[]) => {
    })

    console.log(task)
    this.tasks.push(task)
  }

  createNewTask() {
    var task: Task = {
        _streamId: '',
        description: '',
        level: 0
    }
    this.task = task;
  };

  // isAdmin(){
  //   return this.userService.getUser().isAdmin();
  // }
  
}