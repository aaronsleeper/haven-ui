import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZardButtonComponent } from '@cena/catalog-ui';

@Component({
  selector: 'app-compose-bar',
  standalone: true,
  imports: [FormsModule, ZardButtonComponent],
  templateUrl: './compose-bar.component.html',
  styleUrl: './compose-bar.component.scss',
})
export class ComposeBarComponent {
  readonly sent = output<string>();
  readonly sending = signal(false);
  text = '';

  handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    this.send();
  }

  send(): void {
    const body = this.text.trim();
    if (!body) return;
    this.sent.emit(body);
    this.text = '';
  }
}
