import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    
    $(document).ready(function() {
    $('select').material_select();
  });
         
  }
  onSubmit(){
    /* Add User to the Database */
    this.router.navigate(['/student-dashboard']);
  }
}
