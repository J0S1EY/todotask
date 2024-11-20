import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/assets/api.service';
import { v4 as uuid } from 'uuid';
import { BehaviorSubject } from 'rxjs';


interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  selected?: boolean;
}

@Component({
  selector: 'app-my-to-do',
  templateUrl: './my-to-do.component.html',
  styleUrls: ['./my-to-do.component.scss']
})


export class MyToDoComponent implements OnInit {
  TotalTask = new BehaviorSubject<number>(0);
  completedTask = new BehaviorSubject<number>(0);
  pendingTask = new BehaviorSubject<number>(0);
  canceledTask = new BehaviorSubject<number>(0);
  deletedTask = new BehaviorSubject<number>(0);

  user = ""
  sort = "pending"
  allTask: any = [];

  taskForm = this.formbuld.group({
    title: ['', [Validators.required]],
    task: ['', [Validators.required]]
  })

  constructor(private formbuld: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.user = (localStorage.getItem("username")) || "";
    this.loadTasks()
  }
  loadTasks() {
    this.api.getallTask().subscribe(
      (result: any) => {
        this.allTask = result.data || [];
        this.updateTaskCounts(result.taskCount || {});
      },
      (error: any) => {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please try again.');
      }
    );
  }

  // task count updation
  updateTaskCounts(counts: any) {
    this.TotalTask.next(counts.totalTask);
    this.completedTask.next(counts.completedTask);
    this.pendingTask.next(counts.pendingTask);
    this.canceledTask.next(counts.canceledTask);
    this.deletedTask.next(counts.deletedTask);
  }

  // adding new task
  added() {
    if (this.taskForm.valid) {
      let taskId = uuid()
      let title = this.taskForm.value.title
      let task = this.taskForm.value.task
      this.api.addnewTask(taskId, title, task).subscribe((result: any) => {
        alert(result.message)
        // window.location.reload()
        this.loadTasks();
        this.taskForm.reset();
      },
      (error: any) => {
        alert(error.message);
      })
    } else {
      alert('Fill task box')
    }
  }
  //refresh form
  clear() {
    this.taskForm.reset()
  }

  //filter in status
  sortTask(status: any) {
    //console.log(status)
    this.sort = status
  }

  // task complete
  taskComplete(objId: any) {
    // console.log(num)
    let status = "completed"
    this.api.taskStatus(objId, status).subscribe((result: any) => {
      alert(result.message)
      // window.location.reload()
      this.loadTasks();
    },
      (error: any) => {
        alert(error.message);
      }
    )
  }
  // task cancel
  taskCancel(objId: any) {
    let status = "canceled"
    this.api.taskStatus(objId, status).subscribe((result: any) => {
      alert(result.message)
      this.loadTasks();
    },
      (error: any) => {
        alert(error.message);
      })
  }
  // delete task
  deleteTask(id: any) {
    console.log(id)
    this.api.taskDelete(id).subscribe((result: any) => {
      alert(result.message)
      this.loadTasks();
    },
      (error: any) => {
        alert(error.message);
      }
    )
  }


  // multiple delete 

  deleteSelectedTasks() {
    const selectedTaskIds = this.allTask
      .filter((task: { selected: boolean }) => task.selected)
      .map((task: { taskId: any }) => task.taskId);
    console.log(selectedTaskIds)
    if (selectedTaskIds.length > 0) {
      this.api.deleteMultipleTasks(selectedTaskIds).subscribe(
        (response: any) => {
          alert('Tasks deleted successfully.');
          this.loadTasks();
        },
        (error: any) => {
          alert('Error deleting tasks: ' + error.message);
        }
      );
    } else {

      alert('Please select at least one task to delete.');
    }
  }

  logout() {
    localStorage.clear()
    this.router.navigateByUrl('')
  }

}

