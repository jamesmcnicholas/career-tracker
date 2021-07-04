import { Component, Input, OnInit } from '@angular/core';
import { ProgressionService } from '../progression.service';
import { Task } from './task';
import { TaskService } from './task.service';
import { ProgressionComponent } from '../progression.component'
import { Stream } from '../streams/stream';
import { Status, UserTask } from './user-tasks/user-task';
import { UserTaskService } from './user-tasks/user-task.service';
import { AuthGuard } from '../../common/guards/auth.guard'
import { StreamService } from '../streams/stream.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @Input()
  task: Task;

  description: string;

  tasks: Task[];
  userTasks: UserTask[];
  username: string;
  progressPct;

  public selectedLevel = "0";
  public selectedStream: Stream = { name: "Not selected", _id: "Not selected" }

  constructor(
    private taskService: TaskService,
    private progressionService: ProgressionService, 
    public progressionComponent: ProgressionComponent,
    private userTaskService: UserTaskService,
    private streamService: StreamService,
    authGuard: AuthGuard){

    this.username = authGuard.username
    this.tasks = [];
  }

  ngOnInit(): void {
    this.task = {
      _streamId: '',
      description: '',
      level: 0,
    }

    this.streamService.getStreams().then((streams: Stream[]) => {this.selectedStream = streams[0]}).then(selectedStream => {
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
    }).then(tasks => {
      this.userTaskService.getUserTasks(this.username).then((userTasks: UserTask[]) => {
        if (userTasks) {
          this.userTasks = userTasks.map((userTask) => {
            return userTask;
          });
        }
      }).then(userTasks => this.updateProgressBar());
    })

    

      // Subscribe to the currently selected variable Observable
      this.progressionService.selectedLevel$.subscribe((level) => {
        // When it changes, update the local variable
        this.selectedLevel = level;
        // Grab the tasks pertaining to the selected Stream and Level from the server
        this.taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
          // THEN populate the local tasks list
          if (tasks) {
            this.tasks = tasks.map((task) => {
              return task;
            });
          }
          // THEN, only once the list of Tasks is received, grab the UserTasks
        }).then(tasks => {this.userTaskService.getUserTasks(this.username).then((userTasks: UserTask[]) => {
          if (userTasks) {
            this.userTasks = userTasks.map((userTask) => {
              return userTask;
            });
          }
          // FINALLY, once both Tasks and UserTasks are populated, update the progress bar
        }).then(userTasks => this.updateProgressBar());});
      });
  
      this.progressionService.selectedStream$.subscribe((stream) => {
        this.selectedStream = stream;
          this.taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
          if (tasks) {
            this.tasks = tasks.map((task) => {
              return task;
            });
          }
        }).then(tasks => {this.userTaskService.getUserTasks(this.username).then((userTasks: UserTask[]) => {
          if (userTasks) {
            this.userTasks = userTasks.map((userTask) => {
              return userTask;
            });
          }
        }).then(userTasks => this.updateProgressBar());});
        
      })
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
      _streamId: this.selectedStream._id,
      description: description,
      level: parseInt(this.selectedLevel)
    }
    this.task = task;
    this.createTask(task);
  };

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

  updateStatus(value, taskId){
    var found: boolean = false
    var userTask: UserTask = {status: value, notes: "test", _userId: this.username, _taskId: taskId}

    this.userTasks.forEach(element => {
        if(element._taskId == taskId) {
          found = true;
          userTask._id = element._id;
          element.status = value;
          userTask.notes = element.notes;
        }
    });

    if(found) {
      this.userTaskService.updateUserTask(userTask);
    } else {
      this.userTaskService.createUserTask(userTask);
      this.userTasks.push(userTask)
    }

    this.updateProgressBar()
  }

  getUserTaskStatus(taskId){
    if (!this.userTasks){
      return -1;
    } else {
      var foundUserTask = this.userTasks.find(userTask => {return userTask._taskId == taskId});
      if (foundUserTask){
        return foundUserTask.status;
      }
      return -1
    }
  }
  
  updateNotes(value, taskId){
    console.log("FIRED!" + value + ", " + taskId)
    var found: boolean = false
    var userTask: UserTask = {status: Status.Red, notes: value, _userId: this.username, _taskId: taskId}

    this.userTasks.forEach(element => {
        if(element._taskId == taskId) {
          found = true;
          userTask._id = element._id;
          userTask.status = element.status;
        }
    });

    if(found) {
      this.userTaskService.updateUserTask(userTask);
    } else {
      this.userTaskService.createUserTask(userTask);
      this.userTasks.push(userTask)
    }
  }

  getUserTaskNotes(taskId){
    if (!this.userTasks){
      return "";
    } else {
      var foundUserTask = this.userTasks.find(userTask => {return userTask._taskId == taskId});
      if (foundUserTask){
        return foundUserTask.notes;
      }
      return ""
    }
  }


  /*
    Calculates progress bar percentage
    Each task is assigned a score
    Red = 0, Yellow = 1, Green = 2
    Max score = # of tasks * 2
  */
  updateProgressBar(){
    var total = 0
    var max = 0

    if(this.tasks.length > 0){
      this.tasks.forEach(task => {
        max = max + 2
        // Loop through each task and find its usertask
        this.userTasks.forEach(userTask => {
          if(userTask._taskId == task._id) {
            // Add the usertask value to the total
            total = total + userTask.status.valueOf();
          }
        }); 
      });

      if (max==0){
        console.log("No UserTasks, cannot update percentage")
        console.log(this.tasks)
      } else {
        this.progressPct = (100 * (total/max)).toFixed(2)
      }

    } else { 
      console.log("No Tasks, cannot update percentage")
      this.progressPct = 0
    }
    
  }

}