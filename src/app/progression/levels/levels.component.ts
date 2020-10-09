import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {

  selectedLevel: Number
  toggle = false;

  constructor() { this.selectedLevel = 0; }

  ngOnInit(): void {
  }

  selectLevel(level: Number){
    this.selectedLevel = level;
    this.toggle = !this.toggle;
    console.log(this.selectedLevel)
  }

  counter(i: number) {
    return new Array(i+1);
  }
  
  getSelectedLevel(i: number){
    return i == this.selectedLevel;
  }

}
