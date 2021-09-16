import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({ name: 'timestamp' })
export class TimestampPipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(timestamp: Timestamp, format?: string): string {
        return this.datePipe.transform(timestamp.toDate(), format);
    }
}
