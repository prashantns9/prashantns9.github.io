import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentDashboard } from './studentdashboard/student-dashboard.component'
import {DashboardHomeComponent} from './studentdashboard/dashboard-home/dashboard-home.component';
import { ProfileComponent } from './studentdashboard/profile/profile.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CoursesComponent } from './courses/courses.component';
import { TimeTableComponent } from './time-table/time-table.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { TeacherProfileComponent } from './teacher-dashboard/teacher-profile/teacher-profile.component';

const routes: Routes = [
    {path:"", component: LoginComponent},
    {path:"signup", component: SignUpComponent},
    {path:"student-dashboard", component: StudentDashboard,
    
        children: [
            { path: '', component: DashboardHomeComponent },
            { path: 'home', component: DashboardHomeComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'attendance', component: AttendanceComponent },
            { path: 'courses', component: CoursesComponent },
            { path: 'timetable', component: TimeTableComponent },
            { path: 'calendar', component: CalendarComponent }

        ]

    },


    {path:"student-dashboard", component: TeacherDashboardComponent,
    
        children: [
           
            { path: 'profile', component: TeacherProfileComponent },

        ]

    }
    
];

@NgModule({
    imports:[
        RouterModule.forRoot(routes)
    ]
    ,
    exports:[
        RouterModule
    ]
}
)

export class AppRouteComponent{

}

export const routingComponents = [ LoginComponent , StudentDashboard ]