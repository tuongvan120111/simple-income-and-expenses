import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { KEYBOARD_KEY } from '../constants/budget-buider.constants';

@Directive({
  selector: '[appTab]',
  standalone: true,
})
export class TabDirective {
  @Output() newSubTitle: EventEmitter<any> = new EventEmitter();
  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === KEYBOARD_KEY.TAB) {
      event.preventDefault();
      this.newSubTitle.emit(true);
    }
  }
}
