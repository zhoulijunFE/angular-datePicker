//our root app component
import {Component, NgModule, Input, Output, EventEmitter} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import { DateUtil } from './date.util';
/**
 * @howToUse
 * ```
 *     <common-datepicker [dateInNanoSecond]="dateInNanoExp" [class]="stringExp" (selectedDate)="functionExp"></common-datepicker>
 * ```
 */

interface CalendarDateViewModel {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'common-datepicker',
  template:
  `<div class="ui-kit-calendar-container {{class}}">
    <div class="ui-kit-calendar-cal-container">
      <div class="ui-kit-calendar-cal-top">
        <i class="icon-arrow-left-b" (click)="prevMonth()"></i>
        <span></span>
        <i class="icon-arrow-right-b" (click)="nextMonth()"></i>
      </div>
      <div class="ui-kit-calendar-day-names">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>
      <div class="ui-kit-calendar-days">
        <span *ngFor="let d of days; let i = index;"
          (click)="selectDate($event, i)"
          [class.today]="d.isToday"
          [class.is-active]="d.isSelected"
          [class.is-current-month]="d.isCurrentMonth">
          {{ d.day }}
        </span>
      </div>
      <div>
        <a href="javascript:;" (click)="handleChangeDate($event, false)">Cancel</a>
        <a href="javascript:;" (click)="handleChangeDate($event, true)">Save</a>
      </div>
    </div>
  </div>`
})
export class CommonDatePicker {
  @Input() class: string;

  private _dateInNanoSecond: number = Number.NaN;
  @Input()
  set dateInNanoSecond(value: number) {
    this._dateInNanoSecond = value;
    this.date = this.dateUtil.convertTomsec(this._dateInNanoSecond);
    this.navDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    this.generateCalendar(this.date);
  }

  get dateInNanoSecond() {
    return this._dateInNanoSecond;
  }

  @Output() selectedDate = new EventEmitter();
  private date: Date;
  private navDate: Date;
  private days: CalendarDateViewModel[] = [];
  private daysInMonth = [];

  constructor(private dateUtil: DateUtil) {
    this.dateUtil = dateUtil;
  }

  private generateCalendar(date: Date) {
    this.days = [];
    let month = date.getMonth();
    let year = date.getFullYear();

    this.daysInMonth = [31, (this.dateUtil.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    this.generatePreviousMonth(year, month);

    this.generateCurrentMonth(year, month);

    this.generateNextMonth(year, month);
  }

  private generatePreviousMonth(year: number, month: number) {
    let firstWeekDay = this.dateUtil.getFirstDayInMonth(year, month);
    //NOTE(zhoulj) current month firstWeedday is sun, before add a line
    let beforeDay = firstWeekDay !== 0 ? firstWeekDay : 7;
    if (beforeDay > 0) {
      let prevDate: Date = this.dateUtil.prevMonth(new Date(year, month));
      let prevMonth = prevDate.getMonth();
      let prevYear = prevDate.getFullYear();
      for (let i = this.daysInMonth[prevMonth] - beforeDay + 1; i <= this.daysInMonth[prevMonth]; i++) {
        this.days.push({
          day: i,
          month: prevMonth + 1,
          year: prevYear,
          isCurrentMonth: false,
          isToday: this.isToday(prevYear, prevMonth, i),
          isSelected: this.isSelected(prevYear, prevMonth, i)
        });
      }
    }
  }

  private generateCurrentMonth(year: number, month: number) {
    for (let i = 1; i <= this.daysInMonth[month]; i++) {
      this.days.push({
        day: i,
        month: month + 1,
        year: year,
        isCurrentMonth: true,
        isToday: this.isToday(year, month, i),
        isSelected: this.isSelected(year, month, i)
      });
    }
  }

  private generateNextMonth(year: number, month: number) {
    let lastWeekDay: number = this.dateUtil.getLastDayInMonth(year, month, this.daysInMonth[month]);
    let afterDay = lastWeekDay === 6 ? 7 : 7 - lastWeekDay - 1;
    if (afterDay > 0) {
      let nextDate = this.dateUtil.nextMonth(new Date(year, month));
      let nextMonth = nextDate.getMonth();
      let nextYear = nextDate.getFullYear();

      for (let i = 1; i <= afterDay; i++) {
        this.days.push({
          day: i,
          month: nextMonth + 1,
          year: nextYear,
          isCurrentMonth: false,
          isToday: this.isToday(nextYear, nextMonth, i),
          isSelected: this.isSelected(nextYear, nextMonth, i)
        });
      }
    }
  }

  private isToday(year: number, month: number, day: number) {
    let today = new Date();
    let currentDate = new Date(`${month + 1}-${day}-${year}`);
    return this.dateUtil.isSameDate(today, currentDate);
  }

  private isSelected(year: number, month: number, day: number) {
    let currentDate = new Date(`${month + 1}-${day}-${year}`);
    return this.dateUtil.isSameDate(this.date, currentDate);
  }

  private selectDate(event: MouseEvent, i: number) {
    event.stopPropagation();
    let date: CalendarDateViewModel = this.days[i];
    this.date = new Date(`${date.month}-${date.day}-${date.year}`);

    this.generateCalendar(this.date);
  }

  private prevMonth() {
    this.navDate = this.dateUtil.prevMonth(this.navDate);
    this.generateCalendar(this.navDate);
  }

  private nextMonth() {
    this.navDate = this.dateUtil.nextMonth(this.navDate);
    this.generateCalendar(this.navDate);
  }

  private handleChangeDate(event: MouseEvent, save: boolean) {
    if (save) {
      this.selectedDate.emit(this.dateUtil.convertToNanosec(this.date.getTime()));
    } else {
      this.selectedDate.emit(NaN);
    }
  }

  // private toMonthFormat() {
  //   return moment(this.navDate.getTime()).format('MMMM YYYY');
  // }
}


@Component({
  selector: 'my-app',
  template: `
    <div>
      <h2>Hello {{name}}</h2>
    </div>
    <common-datepicker [dateInNanoSecond]="14699808000"></common-datepicker>
  `,
})
export class App {
  name:string;
  constructor() {
    this.name = 'Angular2'
  }
}

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ App, CommonDatePicker ],
  providers: [DateUtil]
  bootstrap: [ App ]
})
export class AppModule {}