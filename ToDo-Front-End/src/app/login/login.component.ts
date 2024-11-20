import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/assets/api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errMsg = ''
  loginForm = this.formbuld.group({
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9  ]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]

  })

  constructor(private formbuld: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }
  login() {
    if (this.loginForm.valid) {
      let user = this.loginForm.value.username?.toLocaleUpperCase()
      let pswd = this.loginForm.value.password
      // console.log (user, pswd)
      this.api.logIn(user, pswd).subscribe((result: any) => {
        //console.log(result)
        localStorage.setItem("username", result.username)
        localStorage.setItem("token", result.token)

        setTimeout(() => {
          this.router.navigateByUrl('todo-dashboard')
        }, 1500)
      },
        (result: any) => {
          console.log(result.error.message)
          this.errMsg = result.error.message
        })
    }
  }
} 
