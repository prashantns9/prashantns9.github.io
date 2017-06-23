import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent {

  constructor(private router: Router ){

  }
  onSubmit(){
    this.router.navigate(['/student-dashboard']);
  }

/*Author: Prashant
Authentication can be added here by using HTTP Service :) */

}
