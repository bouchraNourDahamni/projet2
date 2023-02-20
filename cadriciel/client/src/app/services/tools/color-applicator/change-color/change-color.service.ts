import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SVGAttributes } from '../../../../enums/svg-attributes';

@Injectable({
  providedIn: 'root',
})
export class ChangeColorService {

  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public changeColor(target: SVGElement, color: string, opacity: number): void {
    const parent = target.parentElement as any as SVGElement;
    if (parent.tagName === SVGAttributes.Text) {
      this.changeTextColor(parent, color, opacity);
      return;
    } else if (parent.classList.value === SVGAttributes.Line) {
      this.changeLineColor(parent, color, opacity);
    } else if (parent.classList.value === SVGAttributes.Pen) {
      this.changePenColor(parent, color, opacity);
    } else if (parent.classList.value === SVGAttributes.Aerosol) {
      this.changeAerosolColor(parent, color, opacity);
    } else if (parent.classList.value === SVGAttributes.Feather) {
      this.changeFeatherColor(parent, color, opacity);
    } else if (target.getAttribute(SVGAttributes.Fill)) {
      this.renderer.setAttribute(target, SVGAttributes.Fill, color);
      this.renderer.setAttribute(target, SVGAttributes.FillOpacity, opacity.toString());
    } else {
      this.renderer.setAttribute(target, SVGAttributes.Stroke, color);
      this.renderer.setAttribute(target, SVGAttributes.StrokeOpacity, opacity.toString());
    }
  }

  public changeOutlineColor(target: SVGElement, color: string, opacity: number): void {
    this.renderer.setAttribute(target, SVGAttributes.Stroke, color);
    this.renderer.setAttribute(target, SVGAttributes.StrokeOpacity, opacity.toString());
  }

  private changeTextColor(textContainer: SVGElement, color: string, opacity: number): void {
    const textSpans = Array.from(textContainer.children) as SVGElement[];
    for (const textSpan of textSpans) {
      this.renderer.setAttribute(textSpan, SVGAttributes.Fill, color);
      this.renderer.setAttribute(textSpan, SVGAttributes.FillOpacity, opacity.toString());
    }
  }

  private changeLineColor(lineContainer: SVGElement, color: string, opacity: number): void {
    const lineParts = Array.from(lineContainer.children) as SVGElement[];
    for (const linePart of lineParts) {
      const attribute = (linePart.tagName === SVGAttributes.Circle) ? SVGAttributes.Fill : SVGAttributes.Stroke;
      this.renderer.setAttribute(linePart, attribute, color);
      this.renderer.setAttribute(lineContainer, SVGAttributes.Opacity, opacity.toString());
    }
  }

  private changePenColor(penContainer: SVGElement, color: string, opacity: number): void {
    const penParts = Array.from(penContainer.children) as SVGElement[];
    for (const penPart of penParts) {
      this.renderer.setAttribute(penPart, SVGAttributes.Stroke, color);
    }
    this.renderer.setAttribute(penContainer, SVGAttributes.Opacity, opacity.toString());
  }

  private changeAerosolColor(aerosolContainer: SVGElement, color: string, opacity: number): void {
    const aerosolParts = Array.from(aerosolContainer.children) as SVGElement[];
    for (const aerosolPart of aerosolParts) {
      this.renderer.setAttribute(aerosolPart, SVGAttributes.Fill, color);
    }
    this.renderer.setAttribute(aerosolContainer, SVGAttributes.Opacity, opacity.toString());
  }

  private changeFeatherColor(featherContainer: SVGElement, color: string, opacity: number): void {
    const featherParts = Array.from(featherContainer.children) as SVGElement[];
    for (const featherPart of featherParts) {
      this.renderer.setAttribute(featherPart, SVGAttributes.Fill, color);
      this.renderer.setAttribute(featherPart, SVGAttributes.Stroke, color);
    }
    this.renderer.setAttribute(featherContainer, SVGAttributes.Opacity, opacity.toString());
  }
}
