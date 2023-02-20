import { TestBed } from '@angular/core/testing';
import { SVGAttributes } from 'src/app/enums/svg-attributes';
import { ChangeColorService } from './change-color.service';

describe('ChangeColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    expect(service).toBeTruthy();
  });

  it('#changeColor should do set Stroke and StrokeOppacity if element is Rectangle', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.StrokeOpacity, '50');
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(elementChild.getAttribute(SVGAttributes.Stroke)).toEqual('red');
    expect(elementChild.getAttribute(SVGAttributes.StrokeOpacity)).toEqual('100');
  });

  it('#changeColor should call changeTextColor if parent is Text', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Text, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Text, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.StrokeOpacity, '50');
    spyOn<any>(service, 'changeTextColor').and.callThrough();
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(service['changeTextColor']).toHaveBeenCalled();
  });

  it('#changeColor should call changeLineColor if parent is Line', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    elementParent.classList.value = SVGAttributes.Line;
    service['renderer'].setAttribute(elementChild, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.StrokeOpacity, '50');
    spyOn<any>(service, 'changeLineColor').and.callThrough();
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(service['changeLineColor']).toHaveBeenCalled();
  });

  it('#changeColor should call changePenColor if parent is Pen', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    elementParent.classList.value = SVGAttributes.Pen;
    service['renderer'].setAttribute(elementChild, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.StrokeOpacity, '50');
    spyOn<any>(service, 'changePenColor').and.callThrough();
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(service['changePenColor']).toHaveBeenCalled();
  });

  it('#changeColor should call changeAerosolColor if parent is Aerosol', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    elementParent.classList.value = SVGAttributes.Aerosol;
    service['renderer'].setAttribute(elementChild, SVGAttributes.Fill, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.FillOpacity, '50');
    spyOn<any>(service, 'changeAerosolColor').and.callThrough();
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(service['changeAerosolColor']).toHaveBeenCalled();
  });

  it('#changeColor should call changeFeatherColor if parent is Feather', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Polygon, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Polygon, SVGAttributes.SVG);
    elementParent.classList.value = SVGAttributes.Feather;
    service['renderer'].setAttribute(elementChild, SVGAttributes.Fill, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.FillOpacity, '50');
    spyOn<any>(service, 'changeFeatherColor').and.callThrough();
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(service['changeFeatherColor']).toHaveBeenCalled();
  });

  it('#changeColor should set Fill attributes if child as fill', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Fill, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.FillOpacity, '50');
    elementParent.appendChild(elementChild);
    service['changeColor'](elementChild, 'red', 100);
    expect(elementChild.getAttribute(SVGAttributes.Fill)).toEqual('red');
    expect(elementChild.getAttribute(SVGAttributes.FillOpacity)).toEqual('100');
  });

  it('#changeOutlineColor should set Stroke attributes', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const element: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(element, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(element, SVGAttributes.StrokeOpacity, '50');
    service['changeOutlineColor'](element, 'red', 100);
    expect(element.getAttribute(SVGAttributes.Stroke)).toEqual('red');
    expect(element.getAttribute(SVGAttributes.StrokeOpacity)).toEqual('100');
  });

  it('#changeTextColor should set Fill attributes', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Rect, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Fill, 'black');
    service['renderer'].setAttribute(elementChild, SVGAttributes.FillOpacity, '50');
    elementParent.appendChild(elementChild);
    service['changeTextColor'](elementParent, 'red', 100);
    expect(elementChild.getAttribute(SVGAttributes.Fill)).toEqual('red');
    expect(elementChild.getAttribute(SVGAttributes.FillOpacity)).toEqual('100');
  });

  it('#changeLineColor should set opacity and stroke when element is not circle', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Ellipse, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Stroke, 'black');
    service['renderer'].setAttribute(elementParent, SVGAttributes.Opacity, '50');
    elementParent.appendChild(elementChild);
    service['changeLineColor'](elementParent, 'red', 100);
    expect(elementChild.getAttribute(SVGAttributes.Stroke)).toEqual('red');
    expect(elementParent.getAttribute(SVGAttributes.Opacity)).toEqual('100');
  });

  it('#changeLineColor should set opacity and fill when element is circle', () => {
    const service: ChangeColorService = TestBed.get(ChangeColorService);
    const elementChild: SVGElement = service['renderer'].createElement(SVGAttributes.Circle, SVGAttributes.SVG);
    const elementParent: SVGElement = service['renderer'].createElement(SVGAttributes.Line, SVGAttributes.SVG);
    service['renderer'].setAttribute(elementChild, SVGAttributes.Fill, 'black');
    service['renderer'].setAttribute(elementParent, SVGAttributes.Opacity, '50');
    elementParent.appendChild(elementChild);
    service['changeLineColor'](elementParent, 'red', 100);
    expect(elementChild.getAttribute(SVGAttributes.Fill)).toEqual('red');
    expect(elementParent.getAttribute(SVGAttributes.Opacity)).toEqual('100');
  });
});
