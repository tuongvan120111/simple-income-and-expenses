import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BudgetBuilderService } from '../../shared/budget-builder.service';
import { AmountEndDate, SubTotalCategory } from '../../models/budget-build';
import { ApplyAllDirective } from '../../directives/apply-all.directive';
import { MoveDirective } from '../../directives/move.directive';
import { TabDirective } from '../../directives/tab.directive';
import { EnterDirective } from '../../directives/enter.directive';

@Component({
  selector: 'app-budget-builder',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ApplyAllDirective,
    MoveDirective,
    TabDirective,
    EnterDirective,
  ],
  templateUrl: './budget-builder.component.html',
  styleUrl: './budget-builder.component.css',
})
export class BudgetBuilderComponent implements AfterViewChecked {
  @ViewChildren('tbody') tbody?: ElementRef;
  @ViewChild('table') table: ElementRef | undefined;

  months: string[] = [];
  startMonth: string = '2024-01'; // Default: January 2024
  endMonth: string = '2024-12'; // Default: December 2024
  incomes: SubTotalCategory[] = [];
  expenses: SubTotalCategory[] = [];
  msgErr: string = '';

  private totalAmount = {
    expenses: {} as SubTotalCategory,
    income: {} as SubTotalCategory,
  };

  private amountEndOfMonth: AmountEndDate = {
    profit: [],
    open: [],
    close: [],
  };
  private firstRenderTable = false;

  constructor(
    private service: BudgetBuilderService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    if (this.firstRenderTable) {
      // Trigger the action after the table is rendered
      this.focusOnFirstCell();
      this.firstRenderTable = false;
    }

    const { expensesField, incomField } = this.service.createTableField(
      this.incomes,
      this.expenses
    );

    this.totalAmount = {
      expenses: expensesField.find(
        (item: SubTotalCategory) => item.isTotalAmount
      ) as SubTotalCategory,
      income: incomField.find(
        (item: SubTotalCategory) => item.isTotalAmount
      ) as SubTotalCategory,
    };

    let monthIndex = 0;
    while (monthIndex < this.months.length) {
      this.amountEndOfMonth.profit.push(0);
      this.amountEndOfMonth.open.push(0);
      this.amountEndOfMonth.close.push(0);
      monthIndex++;
    }

    monthIndex = 0;
    while (monthIndex < this.months.length) {
      const { expenses, income } = this.totalAmount;
      const profit =
        (income?.amountPerMonths?.[monthIndex] ?? 0) -
        (expenses?.amountPerMonths?.[monthIndex] ?? 0);
      this.amountEndOfMonth.profit[monthIndex] = profit;
      if (monthIndex === 0) {
        this.amountEndOfMonth.close[0] = profit;
        this.amountEndOfMonth.open[1] = profit;
      } else {
        const preClose = this.amountEndOfMonth.close[monthIndex - 1];
        this.amountEndOfMonth.open[monthIndex] = preClose;
        this.amountEndOfMonth.close[monthIndex] = profit + preClose;
      }
      monthIndex++;
    }

    this.cd.detectChanges();
  }

  // Display on UI
  getAmountByMonth(monthIndex: number, categoryData: SubTotalCategory[]) {
    return this.service.getIncomeByMonth(monthIndex, categoryData);
  }

  getTotalAmountBy(type: 'category' | 'subtotal', list: any[]) {
    let amount: number;
    if (type === 'category') {
      amount = list.reduce((totalAmount: number, item: SubTotalCategory) => {
        const amountEachCategory = this.service.calTotalAmount(
          item.amountPerMonths
        );
        return (totalAmount += amountEachCategory);
      }, 0);
    } else {
      amount = this.service.calTotalAmount(list);
    }
    return amount;
  }

  getProfix(monthIndex: number) {
    return this.amountEndOfMonth.profit[monthIndex] ?? 0;
  }

  getClose(monthIndex: number) {
    return this.amountEndOfMonth.close[monthIndex] ?? 0;
  }

  getOpen(monthIndex: number) {
    return this.amountEndOfMonth.open[monthIndex] ?? 0;
  }

  getCategories(isIncome?: boolean) {
    const { expensesField, incomField } = this.service.createTableField(
      this.incomes,
      this.expenses
    );

    return isIncome ? incomField : expensesField;
  }

  // Action in UI
  appplyAllByCell(
    row: SubTotalCategory,
    cellIndex: number,
    list: SubTotalCategory[]
  ) {
    const cellAmount = row.amountPerMonths[cellIndex];
    const itemApplyAll = list.find(
      (item: SubTotalCategory) => item.id === row.id
    );
    if (itemApplyAll) {
      const newAmountPerMonth = itemApplyAll.amountPerMonths.map(
        (amount: number) => cellAmount
      );

      itemApplyAll.amountPerMonths = newAmountPerMonth;
    }
  }

  generateTable() {
    this.firstRenderTable = true;
    this.months = this.service.getMonthRange(this.startMonth, this.endMonth);
    if (!this.months.length) {
      this.msgErr = 'Please choose correct month';
      return;
    }

    this.msgErr = '';
    this.incomes = [this.service.createCategory()];
    this.expenses = [this.service.createCategory()];
  }

  generateExample() {
    this.firstRenderTable = true;
    this.startMonth = '2024-01';
    this.endMonth = '2024-02';
    this.months = this.service.getMonthRange(this.startMonth, this.endMonth);
    if (!this.months.length) {
      this.msgErr = 'Please choose correct month';
      return;
    }

    this.msgErr = '';
    const example = this.service.createExampleCategory();
    this.incomes = example.incomes;
    this.expenses = example.expenses;
  }

  removeItem(itemRm: string, isIncome?: boolean) {
    const list = isIncome ? this.incomes : this.expenses;
    if (list.length === 1) {
      this.msgErr = 'This is the last Category. Cannot remove';
      return;
    }

    this.msgErr = '';
    if (isIncome) {
      this.incomes = this.incomes.filter(
        (item: SubTotalCategory) => item.id != itemRm
      );
    } else {
      this.expenses = this.expenses.filter(
        (item: SubTotalCategory) => item.id != itemRm
      );
    }
  }

  updateAmount(
    eventChange: any,
    idChange: string,
    list: SubTotalCategory[],
    cellIndexChange: number,
    isIncome?: boolean
  ) {
    this.msgErr = '';

    const {
      target: { value: valueChanged = '' },
    } = eventChange;

    const newList = JSON.parse(JSON.stringify(list));

    newList.forEach((item: SubTotalCategory) => {
      if (item.id === idChange) {
        item.amountPerMonths[cellIndexChange] = +valueChanged;
      }
    });

    if (isIncome) {
      this.incomes = newList;
    } else {
      this.expenses = newList;
    }
  }

  changeTitleCategory(
    eventChange: any,
    idChange: string,
    list: SubTotalCategory[]
  ) {
    this.msgErr = '';

    const itemChange = list.find(
      (item: SubTotalCategory) => item.id === idChange
    );
    if (!itemChange) {
      return;
    }
    const {
      target: { value: valueChanged = '' },
    } = eventChange;
    itemChange.name = valueChanged;
  }

  addNewCategory(items: SubTotalCategory[]) {
    this.service.addCategory('', items);
  }

  addSubCategory(items: SubTotalCategory[], parenId: string, id: string) {
    this.service.addCategory(parenId || id || '', items);
  }

  private focusOnFirstCell() {
    if (this.table) {
      const firstCell = this.table.nativeElement.querySelector(
        'input'
      ) as HTMLElement;
      if (firstCell) {
        firstCell.autofocus = true;
        firstCell.focus();
      }
    }
  }
}
