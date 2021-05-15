import { Component, Input, OnInit } from '@angular/core';
import { ProgressionService } from '../progression.service';
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

  description: string;

  tasks: Task[]
  public selectedLevel = "";
  public selectedStream = "";

  constructor(private taskService: TaskService, private progressionService: ProgressionService) {
    this.tasks = [];

    this.progressionService.selectedLevel$.subscribe((level) => {
      this.selectedLevel = level;
      taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks.map((task) => {
            if (!task.description) {
              task.description = ''
            }
            return task;
          });
        }
      });
      console.log(level + " tasks arrived");

    })
  }

  ngOnInit(): void {
    this.task = {
      _streamId: '',
      description: '',
      level: 0,
    }

    this.taskService.getTasks(this.selectedStream, this.selectedLevel)
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

  createTask(task: Task) {
    this.taskService.createTask(task).then((newTask: Task) => {
      const tempTask = {
        ...newTask
      }
      this.tasks.push(tempTask);
      this.task = newTask;
      
    })


  }

  createNewTask(description) {
    var task: Task = {
      _streamId: '',
      description: description,
      level: parseInt(this.selectedLevel)
    }
    console.log(task)
    this.task = task;
    this.createTask(task);
  };

  private findTaskIndex(id) {
    this.tasks.findIndex((task) => {
      return task._id === id;
    });
  }

  deleteTask(id) {
    this.taskService.deleteTask(id);
    setTimeout(() => {  this.refreshTasks(); }, 10);
  }
  
  // Temp workaround to update removed tasks
  refreshTasks(){
    this.taskService.getTasks(this.selectedStream, this.selectedLevel)
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

}