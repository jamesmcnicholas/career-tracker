import { Component, OnInit } from '@angular/core';
import { Document, Header, ImageRun, Media, Packer, PageOrientation, Paragraph, TextRun, IMediaData, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType } from "docx";
import * as fs from 'file-saver'
import { Stream } from '../streams/stream';
import { ProgressionService } from '../progression.service';
import { StreamService } from '../streams/stream.service';
import { Task } from '../tasks/task';
import { TaskService } from '../tasks/task.service';
import { Status, UserTask } from '../tasks/user-tasks/user-task';
import { UserTaskService } from '../tasks/user-tasks/user-task.service';
import { AuthGuard } from 'src/app/common/guards/auth.guard';
// import Letterhead from '../../../assets/img/PDP_Header.png';

@Component({
  selector: 'pdp',
  templateUrl: './pdp.component.html',
  styleUrls: ['./pdp.component.css']
})
export class PdpComponent implements OnInit {

  progressionService;
  userTaskService;
  taskService;
  selectedLevel = 0;
  selectedStream;
  tasks: Task[];
  selectedTasks: Task[];
  streamService: StreamService;
  username: string;

  constructor(progressionService: ProgressionService, userTaskService: UserTaskService, taskService: TaskService, streamService: StreamService, authGuard: AuthGuard){ 
    this.progressionService = progressionService; 
    this.userTaskService = userTaskService; 
    this.taskService = taskService;
    this.streamService = streamService;
    this.username = authGuard.username;
    
  }

  ngOnInit(){
    this.selectedTasks = []
    this.tasks = []

    this.streamService.getStreams().then((streams: Stream[]) => {this.selectedStream = streams[0]}).then(selectedStream => {
      this.taskService.getTasks(this.selectedStream, this.selectedLevel)
      .then((tasks: Task[]) => {
        if (tasks) {
          this.tasks = tasks.map((task) => {
            return task;
          });
        }
      });
    })


      this.progressionService.selectedLevel$.subscribe((level) => {
        this.selectedLevel = level;
          this.taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
          if (tasks) {
            this.tasks = tasks.map((task) => {
              return task;
            });
          }
        }).then(this.selectedTasks = [])
      })

      this.progressionService.selectedStream$.subscribe((stream) => {
        this.selectedStream = stream;
          this.taskService.getTasks(this.selectedStream, this.selectedLevel).then((tasks: Task[]) => {
          if (tasks) {
            this.tasks = tasks.map((task) => {
              return task;
            });
          }
        }).then(this.selectedTasks = [])
      })
  }

  toggleTask(taskId){
    var task = this.tasks.find(task => task._id == taskId);
    if (this.selectedTasks.includes(task)){
      var index = this.selectedTasks.indexOf(task);
      this.selectedTasks.splice(index, 1)
    } else {
      this.selectedTasks.push(task)
    }
  }
    
  generate() {
    var image 
    var blob = null;
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", './../../../assets/img/PDP_Header.png'); 
    xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
    xhr.onload = function() 
    {
      blob = xhr.response;//xhr.response is now a blob object
      console.log("Blob: " + blob)
      var file = new File([blob], 'PDP_Header.png', {type: 'image/png', lastModified: Date.now()});
      console.log(file);   

      var reader = new FileReader() 
      reader.readAsDataURL(file);

      console.log(reader.result)
      image = new ImageRun({
      data: reader.result,
        transformation: {
            width: 100,
            height: 100,
        },
      });
  
    } 
    xhr.send()
    

    // var image = new ImageRun({data: btoa("/../../../assets/img/PDP_Header.png"), transformation:  {width: 20, height: 20}});



    const date = new Date();
    var formattedDate = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear()
    
  
    const table = new Table({
      columnWidths: [3505, 5505],
      rows: [
          new TableRow({
              children: [
                  new TableCell({
                      width: {size: 25,type: WidthType.PERCENTAGE},
                      shading: {fill: "e31937",val: ShadingType.CLEAR,color: "auto"},
                      children: [new Paragraph({text: "Developmental Need", style: "tableHeader", alignment: AlignmentType.CENTER})],
                  }),
                  new TableCell({ 
                      width: {size: 25,type: WidthType.PERCENTAGE},
                      shading: {fill: "991f3d",val: ShadingType.CLEAR,color: "auto",},
                      children: [new Paragraph({text: "Learn and Develop Through Experience (70%)", style: "tableHeader", alignment: AlignmentType.CENTER})],
                  }),
                  new TableCell({
                      width: {size: 25,type: WidthType.PERCENTAGE},
                      shading: {fill: "ff6a00",val: ShadingType.CLEAR,color: "auto",},
                      children: [new Paragraph({text: "Learn and Develop Through Others (20%)", style: "tableHeader", alignment: AlignmentType.CENTER})],
                  }),
                  new TableCell({
                      width: {size: 25,type: WidthType.PERCENTAGE,},
                      shading: {fill: "f2a200",val: ShadingType.CLEAR, color: "auto",},
                      children: [new Paragraph({text: "Learn and Develop Through Training (10%)",style: "tableHeader", alignment: AlignmentType.CENTER})]
                  })
              ]
            }),
        ],
  });

  this.selectedTasks.forEach(task => {table.addChildElement(new TableRow({
    children:[
      new TableCell({children: [new Paragraph(task.description)]}),
      new TableCell({children: [new Paragraph("")]}),
      new TableCell({children: [new Paragraph("")]}),
      new TableCell({children: [new Paragraph("")]})
    ]
  }));
  table.addChildElement(new TableRow({children: [
    new TableCell({children:[new Paragraph("Timescale/duration: ")]}),
    new TableCell({children:[new Paragraph("")]}),
    new TableCell({children:[new Paragraph("")]}),
    new TableCell({children:[new Paragraph("")]}),
  ]}))
});



    const doc = new Document({
      styles: {
        paragraphStyles: [
            {
                id: "textFields",
                name: "Red Text Style",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { color: "991f3d", bold: true, font: "Arial", size: 20 },
                paragraph: {spacing: {line: 350,}},
            },
            {
              id: "tableHeader",
              name: "Table Header",
              basedOn: "Normal",
              quickFormat: true,
                run: { color: "ffffff", bold: true, font: "Arial", size: 20, },
                paragraph: {spacing: {line: 276,}},
            },
            {
              id: "logo",
              name: "CGI Header",
              basedOn: "Normal",
              quickFormat: true,
                run: { color: "e11937", bold: true, font: "Arial", size: 70, },
                paragraph: {spacing: {line: 276,}},
            }

    ]},
      sections: [
        {
          headers: {
            default: new Header({
                children: [new Paragraph({text: "CGI", style: "logo"}), new Paragraph({text: "Personal Development Plan", style: "textFields"}), image],
        }),
      },
        properties: {page: {size: {orientation: PageOrientation.LANDSCAPE}}},
        children: [
          new Paragraph({text:"Name: " + this.username, style: "textFields"}),
          new Paragraph({text:"Latest Update: " + formattedDate, style: "textFields"}),
          new Paragraph({text:"Career Aspirations: ", style: "textFields"}),
          new Paragraph({text:"Strengths: ", style: "textFields"}),
          new Paragraph({text:"Areas to Develop: ", style: "textFields"}),
          new Paragraph({text:"Focus Areas: ", style: "textFields"}),
          new Paragraph({text:"People Manager: ", style: "textFields"}),
          new Paragraph({text:"People Manager Comments: ", style: "textFields"}),
          new Paragraph(""),
          table
        ]
      }
    ]
});
  
    Packer.toBlob(doc).then((blob) => {
      console.log(blob);
      fs.saveAs(blob, "example.docx");
      console.log("Document created successfully");
    });
  }
}