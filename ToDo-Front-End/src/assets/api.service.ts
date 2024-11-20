import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {



  constructor(private http: HttpClient) { }

  // REGISTER API 
  signUp(username: any, password: any) {
    const signupData = {
      username,
      password,
    }
    return this.http.post('http://localhost:3000/signup', signupData)
  }

  // login
  logIn(user: any, pswd: any) {
    //console.log(user, pswd)
    const loginData = {
      user,
      pswd,

    }
    return this.http.post('http://localhost:3000/login', loginData)
  }

  // token append function
  options = {
    headers: new HttpHeaders
  }

  addToken() {
    const token = localStorage.getItem("token")
    let headers = new HttpHeaders()
    if (token) {
      headers = headers.append('todojwt', token)
      this.options.headers = headers
    }
    return this.options
  }
  // add new task
  addnewTask(taskId: any, title: any, task: any) {
    //console.log(title,task)
    const newTask = {
      taskId,
      title,
      task
    }
    console.log(taskId)
    return this.http.post('http://localhost:3000/newtask', newTask, this.addToken())
  }
  // get all task 
  getallTask() {
    return this.http.get('http://localhost:3000/get-task', this.addToken())
  }
  // task completed
  taskStatus(objId: any, status: any) {
    console.log(objId, status)
    const id = {
      objId,
      status
    }
    return this.http.put('http://localhost:3000/task-status', id, this.addToken())
  }

  taskDelete(id: any) {
    //console.log(id)
    return this.http.delete('http://localhost:3000/task-delete/' + id, this.addToken())
  }

 deleteMultipleTasks(taskIds: any[]): Observable<any> {
    const options = {
        headers: this.addToken().headers,
        body: { ids: taskIds },
        observe: 'body' as const  // Ensure the observe option is correctly typed
    };

    return this.http.delete<any>('http://localhost:3000/task-multiple-delete', options);
}



}