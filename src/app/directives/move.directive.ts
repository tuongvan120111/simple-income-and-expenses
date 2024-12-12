import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';
import { KEYBOARD_KEY } from '../constants/budget-buider.constants';

@Directive({
  selector: '[appMove]',
  standalone: true,
})
export class MoveDirective {
  @Input() appMove: string = '';
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const keys: { [eventKey: string]: string } = {
      ArrowRight: KEYBOARD_KEY.ARROW_RIGHT,
      ArrowLeft: KEYBOARD_KEY.ARROW_LEFT,
      ArrowDown: KEYBOARD_KEY.ARROW_DOWN,
      ArrowUp: KEYBOARD_KEY.ARROW_UP,
    };
    const keyFocus = keys[event.key];
    if (!keyFocus) {
      return;
    }
    event.preventDefault();
    this.moveFocus(keyFocus);
  }

  private moveFocus(direction: string): void {
    const nextElement = this.getSiblingElement(direction);

    if (nextElement) {
      const input = nextElement.children[0] as HTMLElement;
      input?.focus();
    }
  }

  private getSiblingElement(direction: string): HTMLElement | null {
    const currentElement = this.el.nativeElement;
    let sibling: HTMLElement | null = null;
    const currentCell = currentElement.parentElement;

    const cells = Array.from(
      currentCell.parentElement.children
    ) as HTMLTableCellElement[];

    let currentIndex = cells.indexOf(currentCell);

    switch (direction) {
      case KEYBOARD_KEY.ARROW_RIGHT:
        sibling = currentCell?.nextElementSibling as HTMLElement;
        break;

      case KEYBOARD_KEY.ARROW_LEFT:
        sibling = currentCell?.previousElementSibling as HTMLElement;
        break;

      case KEYBOARD_KEY.ARROW_DOWN:
        const nextRow =
          currentCell?.parentElement?.nextElementSibling?.children?.[
            currentIndex
          ];

        sibling = nextRow as HTMLElement;
        break;

      case KEYBOARD_KEY.ARROW_UP:
        const previousRow =
          currentCell?.parentElement?.previousElementSibling?.children?.[
            currentIndex
          ];

        sibling = previousRow as HTMLElement;
        break;

      default:
        break;
    }

    return sibling;
  }
}
