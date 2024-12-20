import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenAddress',
})
export class ShortenAddressPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const start = value.substring(0, 6);
    const end = value.substring(value.length - 4);
    return `${start}....${end}`;
  }
}
