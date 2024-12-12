import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ApplyAllDialogComponent } from '../components/apply-all-dialog/apply-all-dialog.component';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SubTotalCategory } from '../models/budget-build';
import { NO, YES_NO } from '../constants/budget-buider.constants';

@Directive({
  selector: '[appApplyAll]',
  inputs: [{ name: 'rowItem', alias: 'appApplyAll' }],
  outputs: ['applyAllEvent', 'changeAmount'],
  standalone: true,
})
export class ApplyAllDirective {
  // Input
  rowItem: SubTotalCategory = {} as SubTotalCategory;

  // Output
  applyAllEvent: EventEmitter<SubTotalCategory> = new EventEmitter();
  changeAmount: EventEmitter<SubTotalCategory> = new EventEmitter();

  dialogRef?: MatDialogRef<any, any>;

  constructor(private dialog: MatDialog) {}

  @HostListener('contextmenu', ['$event'])
  applyAll(event: MouseEvent): void {
    event.preventDefault();

    this.dialogRef = this.dialog.open(ApplyAllDialogComponent, {
      width: '400px',
      data: {
        close: (status: YES_NO) => this.closeDialog(status),
      },
    });

    this.dialogRef.afterClosed().subscribe((status: YES_NO) => {
      if (status === NO) {
        return;
      }

      this.applyAllEvent.emit(this.rowItem);
    });
  }

  private closeDialog(status: YES_NO) {
    if (!this.dialogRef) {
      return;
    }

    this.dialogRef.close(status);
  }
}
