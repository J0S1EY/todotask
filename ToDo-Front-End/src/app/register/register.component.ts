import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/assets/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // form validation from html 

  registerForm = this.formbuld.group({
    username: ['', [Validators.required, Validators.pattern('[a-z A-Z 0-9  ]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-z A-Z 0-9 @]*')]]
  })

  constructor(private formbuld: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
  }
  // sign up and api call
  signUp() {
    if (this.registerForm.valid) {
      let username = this.registerForm.value.username?.toUpperCase()
      let pswd = this.registerForm.value.password
      // console.log(username, pswd )
      this.api.signUp(username, pswd).subscribe((result: any) => {
        alert(result.message)
        this.router.navigateByUrl('')
      },
        (result: any) => {
          alert(result.error.message);
        })
    }
  }
}



