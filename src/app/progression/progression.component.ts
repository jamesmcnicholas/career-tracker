import { Component, Injectable, OnInit } from '@angular/core';


@Component({
  selector: 'progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})

@Injectable()
export class ProgressionComponent implements OnInit {

  edit: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

}
