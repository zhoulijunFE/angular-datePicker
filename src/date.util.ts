import { Injectable } from '@angular/core'


const NSEC_PER_MSEC = 1000 * 1000;

@Injectable()
export class DateUtil {
  //NOTE(zhoulj) date is not NaN, conversion naNosecond to ms
  convertTomsec(nano: number) {
    if (!Number.isNaN(nano)) {
      return new Date(nano / NSEC_PER_MSEC);
    } else {
      return new Date();
    }
  }

  convertToNanosec(ms: number) {
    return ms * NSEC_PER_MSEC;
  }

  getFirstDayInMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  getLastDayInMonth(year, month, date) {
    return new Date(year, month, date).getDay();
  }

  isSameDate(d1: Date, d2: Date) {
    return d1.getFullYear === d2.getFullYear && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  isLeapYear(year: number) {
    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
      return true;
    } else {
      return false;
    }
  }

  prevMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
  }

  nextMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }
}