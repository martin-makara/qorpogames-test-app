import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appHoverEffect]',
})
export class HoverEffectDirective {
  @Input() hoverColor: string = 'yellow';
  @Input() hoverEffectType: string = 'background';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.applyHoverEffect(this.hoverColor, this.hoverEffectType);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.removeHoverEffect(this.hoverEffectType);
  }

  private applyHoverEffect(color: string, effectType: string) {
    if (effectType === 'background') {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
    } else if (effectType === 'border') {
      this.renderer.setStyle(this.el.nativeElement, 'borderColor', color);
      this.renderer.setStyle(this.el.nativeElement, 'borderWidth', '2px');
      this.renderer.setStyle(this.el.nativeElement, 'borderStyle', 'solid');
    }
  }

  private removeHoverEffect(effectType: string) {
    if (effectType === 'background') {
      this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    } else if (effectType === 'border') {
      this.renderer.removeStyle(this.el.nativeElement, 'borderColor');
      this.renderer.removeStyle(this.el.nativeElement, 'borderWidth');
      this.renderer.removeStyle(this.el.nativeElement, 'borderStyle');
    }
  }
}
