import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(allTask: any[], filter: String, taskStatus: String): any[] {
    const sortData: any = []
    if (!allTask || filter == "" || taskStatus == "") {
      return allTask
    }
    allTask.forEach((taskFilter: any) => {
      if (taskFilter.taskStatus.toLowerCase().includes(filter.toLowerCase())) {
        sortData.push(taskFilter)
      }
      console.log("filter ",sortData)
    })
    return sortData
    
  }

}


