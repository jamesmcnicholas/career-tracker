import { Component, OnInit } from '@angular/core';
import { ProgressionService } from '../progression.service'

// Define the component properties
@Component({
  selector: 'levels', // Name of the HTML element
  templateUrl: './levels.component.html', // HTML File
  styleUrls: ['./levels.component.css'] // CSS file
})
// Define the class name and interfaces
export class LevelsComponent implements OnInit {
  // Class properties
  selectedLevel: Number
  toggle = false;

  // Constructor method instantiates instances of the object
  constructor(private progressionService: ProgressionService) { 
    this.selectedLevel = 0;
    // Set up necessary services for data transfer
    this.progressionService.selectedLevel(this.selectedLevel);
   }

  // On startup, initialise the selected level at 0
  ngOnInit(): void {
    this.selectedLevel = 0;
  }

  // When a level is chosen, update the class properties
  selectLevel(level: Number){
    this.selectedLevel = level;
    // toggle the button to active CSS state
    this.toggle = !this.toggle;
    // Update the observable selectedLevel variable to the new level
    this.progressionService.selectedLevel(this.selectedLevel);
    // Tell the tasks component to update the list with the new level
    this.progressionService.updateTasks();
  }

  // Helper method for generating the buttons
  counter(i: number) {
    return new Array(i+1);
  }
  
  // Getter to retrieve the selected level
  getSelectedLevel(i: number){
    return i == this.selectedLevel;
  }

}
