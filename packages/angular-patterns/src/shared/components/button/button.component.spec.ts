import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ZardButtonComponent } from './button.component';

describe('ZardButtonComponent', () => {
  let fixture: ComponentFixture<ZardButtonComponent>;
  let component: ZardButtonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZardButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instantiates', () => {
    expect(component).toBeTruthy();
  });

  it('applies default variants when no inputs are provided', () => {
    expect(component.zType()).toBe('default');
    expect(component.zSize()).toBe('default');
    expect(component.zShape()).toBe('default');
    expect(component.zFull()).toBe(false);
    expect(component.zLoading()).toBe(false);
    expect(component.zDisabled()).toBe(false);
  });

  it('renders the loading icon when zLoading is true', () => {
    fixture.componentRef.setInput('zLoading', true);
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('ng-icon');
    expect(icon).toBeTruthy();
  });

  it('reports iconOnly() false when neither icon nor text is present initially', () => {
    expect(component.iconOnly()).toBe(false);
  });
});
