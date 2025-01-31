import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'count' })
export class CountPipe implements PipeTransform {
    transform(data: any[]): number {
        return data.length;
    }
}
