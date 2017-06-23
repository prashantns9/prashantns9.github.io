import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteComponent } from './app.route';
import { AppComponent } from './app.component';

import { ProfileComponent } from './studentdashboard/profile/profile.component';

import { routingComponents } from './app.route';
import { DashboardHomeComponent } from './studentdashboard/dashboard-home/dashboard-home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CoursesComponent } from './studentdashboard/courses/courses.component';
import { PlacementComponent } from './studentdashboard/placement/placement.component';
import { AttendanceComponent } from './studentdashboard/attendance/attendance.component';
import { TimeTableComponent } from './studentdashboard/time-table/time-table.component';
import { CalendarComponent } from './studentdashboard/calendar/calendar.component';
@NgModule({

  imports: [
    BrowserModule, 
    AppRouteComponent
  ],

  declarations: [
    AppComponent, routingComponents, ProfileComponent, DashboardHomeComponent, SignUpComponent, CoursesComponent, PlacementComponent, AttendanceComponent, TimeTableComponent, CalendarComponent
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
