import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as confetti from 'canvas-confetti';
import { ConfettiService } from '../../services/confetti.service';

@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss'],
})
export class ConfettiComponent implements OnInit {
  public clicked = false;

  canvas = this.renderer2.createElement('canvas');

  constructor(
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private confettiService: ConfettiService
  ) {
    confettiService.confettiEvent.subscribe(() => {
      this.surprise();
    });
  }

  public surprise(): void {
    this.renderer2.appendChild(this.elementRef.nativeElement, this.canvas);

    const myConfetti = confetti.create(this.canvas, {
      resize: true, // will fit all screen size
      useWorker: true,
    });

    myConfetti({
      particleCount: 70,
      angle: 45,
      origin: {
        x: 0.05,
        y: 0.65,
      },
    });

    myConfetti({
      particleCount: 70,
      angle: 135,
      origin: {
        x: 0.95,
        y: 0.65,
      },
    });

    this.clicked = true;
  }

  ngOnInit(): void {}
}
