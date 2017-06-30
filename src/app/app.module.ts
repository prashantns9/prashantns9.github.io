import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRouteComponent } from './app.route';
import { AppComponent } from './app.component';

import { ProfileComponent } from './studentdashboard/profile/profile.component';

import { routingComponents } from './app.route';
import { DashboardHomeComponent } from './studentdashboard/dashboard-home/dashboard-home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CoursesComponent } from './courses/courses.component';
import { PlacementComponent } from './placement/placement.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherProfileComponent } from './teacher-dashboard/teacher-profile/teacher-profile.component';
@NgModule({

  imports: [
    BrowserModule, 
    AppRouteComponent
  ],

  declarations: [
    AppComponent, routingComponents, ProfileComponent, DashboardHomeComponent, SignUpComponent, CoursesComponent, PlacementComponent, AttendanceComponent, TimeTableComponent, CalendarComponent, TeacherDashboardComponent, TeacherProfileComponent
  ],


  bootstrap: [AppComponent]
})
export class AppModule { }
