import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { YES_NO } from '../../constants/budget-buider.constants';

@Component({
  selector: 'app-apply-all-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apply-all-dialog.component.html',
  styleUrl: './apply-all-dialog.component.css',
})
export class ApplyAllDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { close: (status: YES_NO) => void }
  ) {}

  closeDialogAction(status: YES_NO): void {
    this.data.close(status);
  }
}
