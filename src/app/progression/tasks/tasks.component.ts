import { Component, Input, OnInit } from '@angular/core';
import { ProgressionService } from '../progression.service';
import { Task } from './task';
import { TaskService } from './task.service';
import { ProgressionComponent } from '../progression.component'
import { Stream } from '../streams/stream';

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
  public selectedLevel = "0";
  public selectedStream: Stream = { name: "Not selected", _id: "Not selected" }

  constructor(
    private taskService: TaskService,
    private progressionService: ProgressionService, 
    public progressionComponent: ProgressionComponent){

    this.tasks = [];

    this.progressionService.selectedLevel$.subscribe((level) => {
      this.selectedLevel = level;
      taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks.map((task) => {
            return task;
          });
        }
      });
    })

    this.progressionService.selectedStream$.subscribe((stream) => {
      this.selectedStream = stream;
      taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks.map((task) => {
            return task;
          });
        }
      });
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
    console.log("STREAM ID: " + this.selectedStream._id)
    var task: Task = {
      _streamId: this.selectedStream._id,
      description: description,
      level: parseInt(this.selectedLevel)
    }
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

  updateStatus(value){
    console.log(value)
  }

}