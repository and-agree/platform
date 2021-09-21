import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform<T>(data: T[], field: string, value: any): T[] {
        return data.filter((entry) => entry[field] === value);
    }
}
