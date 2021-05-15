import { Component, OnInit } from '@angular/core';
import { ProgressionService } from '../progression.service'

@Component({
  selector: 'levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  selectedLevel: Number
  toggle = false;

  constructor(private progressionService: ProgressionService) { 
    this.selectedLevel = 0;
    this.progressionService.selectedLevel(this.selectedLevel);
   }

  ngOnInit(): void {
    this.selectedLevel = 0;
  }

  selectLevel(level: Number){
    this.selectedLevel = level;
    this.toggle = !this.toggle;
    this.progressionService.selectedLevel(this.selectedLevel);
    this.progressionService.updateTasks();
  }

  counter(i: number) {
    return new Array(i+1);
  }
  
  getSelectedLevel(i: number){
    return i == this.selectedLevel;
  }

}
