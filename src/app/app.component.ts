import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild(CdkVirtualScrollViewport, {static: false}) private viewport: CdkVirtualScrollViewport;

  // has performance issues
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.innerWidth = window.innerWidth;
  // }

  public frameHeight = null;
  public windowHeight = null;
  public randomColors = Array.from({length: 100}).map((_, i) =>
    '#' + Math.random().toString(16).slice(2, 8).toUpperCase()
  );

  private destroyed$ = new Subject();

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntil(this.destroyed$))
      .subscribe((event) => this.onResize(event));
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
  }

  private onResize(event?): void {
    this.windowHeight = Math.round(event.target.innerHeight);
    this.viewport.checkViewportSize();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
