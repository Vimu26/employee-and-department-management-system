import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClick]',
})
export class ClickDirective {
  constructor(private element: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClicked() {
    this.renderer.setStyle(
      this.element.nativeElement,
      'border',
      '2px solid #FF355E'
    );
  }

  @HostListener('document:click', ['$event.target']) onClickedOutside(
    targetElement: any
  ) {
    const clickedInside = this.element.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.renderer.setStyle(this.element.nativeElement, 'border', 'none');
    }
  }
}
