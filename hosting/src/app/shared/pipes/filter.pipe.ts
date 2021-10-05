import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform<T>(data: T[], field: string, value: any): T[] {
        switch (typeof value) {
            case 'number':
            case 'boolean':
                return data.filter((entry) => entry[field] === value);
            case 'string':
                return data.filter((entry) => entry[field].includes(value));
            default:
                return data;
        }
    }
}
