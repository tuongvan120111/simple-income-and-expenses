import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import { KEYBOARD_KEY } from '../constants/budget-buider.constants';

@Directive({
  selector: '[appEnter]',
  standalone: true,
})
export class EnterDirective {
  @Output() newCategory: EventEmitter<any> = new EventEmitter();
  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === KEYBOARD_KEY.ENTER) {
      event.preventDefault();
      this.newCategory.emit(true);
    }
  }
}
