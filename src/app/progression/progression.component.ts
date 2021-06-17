import { Component, Injectable, OnInit } from '@angular/core';
import { AuthGuard } from '../common/guards/auth.guard';


@Component({
  selector: 'progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})

@Injectable()
export class ProgressionComponent implements OnInit {

  edit: boolean = false;
  username: string

  constructor(authGuard: AuthGuard) {
      this.username = authGuard.username;
   }

  ngOnInit(): void {

  }

}
