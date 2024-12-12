import { Injectable } from '@angular/core';
import { SubTotalCategory } from '../models/budget-build';
import * as uuid from 'uuid';
import { LABEL } from '../constants/budget-buider.constants';

@Injectable({
  providedIn: 'root',
})
export class BudgetBuilderService {
  private months: string[] = [];

  constructor() {}

  getIncomeByMonth(index: number, categoryData: SubTotalCategory[]) {
    return categoryData.reduce(
      (total: number, item: SubTotalCategory) =>
        (total += item.amountPerMonths[index]),
      0
    );
  }

  getMonthRange(startDate: string, endDate: string) {
    const months: string[] = [];
    let currentMonth = new Date(startDate);
    const endMonth = new Date(endDate);
    while (currentMonth <= endMonth) {
      months.push(
        currentMonth.toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        })
      );
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    this.months = months;
    return months;
  }

  calTotalAmount(amounts: number[]) {
    return amounts.reduce(
      (totalAmount: number, amountPerMonth: number) =>
        (totalAmount += amountPerMonth),
      0
    );
  }

  createCategory(parenId?: string) {
    const initAmount = this.months.map((item: string) => 0);
    return {
      id: uuid.v4(),
      name: 'Unknow',
      amountPerMonths: initAmount,
      parenId: parenId ?? '',
      isLabel: false,
    };
  }

  createExampleCategory() {
    const parenIdOpe = uuid.v4();
    const parenIdSalaries = uuid.v4();
    const parenIdGeneral = uuid.v4();
    return {
      incomes: [
        {
          id: parenIdGeneral,
          name: 'General Income',
          amountPerMonths: [100, 120],
          parenId: '',
        },
        {
          id: uuid.v4(),
          name: 'Sales',
          amountPerMonths: [100, 120],
          parenId: parenIdGeneral,
        },
      ],
      expenses: [
        {
          id: parenIdOpe,
          name: 'Operational Expenses',
          amountPerMonths: [50, 100],
          parenId: '',
        },
        {
          id: uuid.v4(),
          name: 'Management Fees',
          amountPerMonths: [100, 200],
          parenId: parenIdOpe,
        },
        {
          id: uuid.v4(),
          name: 'Cloud Hosting',
          amountPerMonths: [200, 400],
          parenId: parenIdOpe,
        },
        {
          id: parenIdSalaries,
          name: 'Salaries & Wages',
          amountPerMonths: [0, 0],
          parenId: '',
        },
        {
          id: uuid.v4(),
          name: 'Full Time Dev Salaries',
          amountPerMonths: [100, 120],
          parenId: parenIdSalaries,
        },
        {
          id: uuid.v4(),
          name: 'Part Time Dev Salaries',
          amountPerMonths: [80, 80],
          parenId: parenIdSalaries,
        },
        {
          id: uuid.v4(),
          name: 'Remote Salaries',
          amountPerMonths: [20, 0],
          parenId: parenIdSalaries,
        },
      ],
    };
  }

  createTableField(incomes: SubTotalCategory[], expenses: SubTotalCategory[]) {
    const incomField = this.createTableIncomeFieldByType(
      incomes,
      'Income Total'
    );
    const expensesField = this.createTableIncomeFieldByType(
      expenses,
      'Total Expenses'
    );

    return {
      incomField,
      expensesField,
    };
  }

  addCategory(id: string, items: SubTotalCategory[]) {
    const newCategory: SubTotalCategory = {
      id: uuid.v4(),
      name: LABEL.EMPTY,
      amountPerMonths: this.months.map(() => 0),
      parenId: id,
      isLabel: false,
    };

    items.push(newCategory);
  }

  private createField(items: SubTotalCategory[]) {
    let expenseItems: SubTotalCategory[] = [];
    const categories = items.filter((el: SubTotalCategory) => !el.parenId);

    categories.forEach((el: SubTotalCategory) => {
      const subtotalItem = items.filter(
        (subIttem: SubTotalCategory) => subIttem.parenId === el.id
      );

      const subtotalAmount = el.amountPerMonths.reduce(
        (amounts: number[], amountCat: number, index: number) => {
          const subTotalAmount = subtotalItem.reduce(
            (amountSubs: number, sub: SubTotalCategory) =>
              (amountSubs += sub.amountPerMonths[index]),
            0
          );

          amounts.push(subTotalAmount + amountCat);
          return amounts;
        },
        []
      );

      const subTotal = {
        id: uuid.v4(),
        name: LABEL.SUB_TOTALS,
        amountPerMonths: subtotalAmount,
        parenId: el.id,
        isLabel: true,
      };

      const emptyRow = {
        id: uuid.v4(),
        name: '',
        amountPerMonths: subtotalAmount.map(() => 0),
        parenId: el.id,
        isLabel: true,
      };

      expenseItems = expenseItems.concat(el, subtotalItem, subTotal, emptyRow);
    });

    return expenseItems;
  }

  private createTableIncomeFieldByType(
    items: SubTotalCategory[],
    title: string
  ) {
    let itemsFinale: SubTotalCategory[] = [];
    const itemFields = this.createField(items);
    const totalCategory = itemFields
      .filter((item: SubTotalCategory) => item.name === LABEL.SUB_TOTALS)
      .map((item: SubTotalCategory) => item.amountPerMonths);
    const totalAmount = this.calAmountByMonth(totalCategory);
    const totalItems = {
      id: uuid.v4(),
      name: title,
      amountPerMonths: totalAmount || [],
      parenId: '',
      isLabel: true,
      isTotalAmount: true,
    };
    itemFields.push(totalItems);

    itemsFinale = itemsFinale.concat(itemFields);

    return itemsFinale;
  }

  private calAmountByMonth(matrixAmount: number[][]) {
    const firstRow = matrixAmount[0];
    if (!firstRow) {
      return;
    }
    let columnSums = new Array(firstRow.length).fill(0);

    for (let row = 0; row < matrixAmount.length; row++) {
      for (let col = 0; col < matrixAmount[row].length; col++) {
        columnSums[col] += matrixAmount[row][col];
      }
    }

    return columnSums;
  }
}
