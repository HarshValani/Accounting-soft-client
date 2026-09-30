import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inrCurrency',
  standalone: true
})
export class InrCurrencyPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    showSymbol = true,
    fractionDigits = 0
  ): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return showSymbol ? '₹0' : '0';
    }

    const num = Number(value);
    const isNegative = num < 0;
    const absoluteNum = Math.abs(num);

    const formattedNumber = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(absoluteNum);

    const prefix = isNegative ? '-' : '';
    const symbol = showSymbol ? '₹' : '';

    return `${prefix}${symbol}${formattedNumber}`;
  }
}

