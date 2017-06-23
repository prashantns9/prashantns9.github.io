import { Component } from '@angular/core';
import {RouterModule} from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
@Component({
  
  templateUrl: './student-dashboard.component.html',
})
export class StudentDashboard {
  ngOnInit() {
      $(".button-collapse").sideNav();

       $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      onclick: true,
      gutter: 1, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      stopPropagation: false // Stops event propagation
    });
  }
}
