import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MyToDoComponent } from './my-to-do/my-to-do.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path:'', component:LoginComponent
  },
  {
    path:'register', component:RegisterComponent 
  },
  {
    path:'todo-dashboard',component:MyToDoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
