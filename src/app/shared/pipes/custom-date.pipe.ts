import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  private readonly months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    try {
      const date = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(date.getTime())) {
        return typeof value === 'string' ? value : '';
      }

      const day = date.getDate();
      const month = this.months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch {
      return typeof value === 'string' ? value : '';
    }
  }
}

