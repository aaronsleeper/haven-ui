import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ZardBadgeComponent,
  ZardButtonComponent,
  ZardCardComponent,
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent,
  ZardInputDirective,
} from '@cena/catalog-ui';
import { GetDietaryPreferencesData, GetProfileData } from '@dataconnect/generated';
import { PatientDataService, ProfilePageData } from '../services/patient-data.service';

type Profile = NonNullable<GetProfileData['patientProfiles']>[number];
type DietaryPreference = NonNullable<GetDietaryPreferencesData['patientDietaryPreferences']>[number];

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ZardCardComponent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardBadgeComponent,
    ZardFormFieldComponent,
    ZardFormControlComponent,
    ZardFormLabelComponent,
    ZardFormMessageComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly patientData = inject(PatientDataService);

  readonly loading = signal(true);
  readonly profile = signal<Profile | null>(null);
  readonly preferences = signal<DietaryPreference[]>([]);
  readonly preferenceNotesDraft = signal('');
  readonly deliveryNotesDraft = signal('');
  readonly savingPreferences = signal(false);
  readonly savingDeliveryNote = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly fullName = computed(() => {
    const p = this.profile();
    return p ? `${p.firstName} ${p.lastName}` : '';
  });

  readonly preferenceTypes = computed(() =>
    this.preferences().map((pref) => pref.preferenceType)
  );

  async ngOnInit(): Promise<void> {
    try {
      const data: ProfilePageData = await this.patientData.loadProfileData();
      this.profile.set(data.profile.patientProfiles[0] ?? null);
      this.preferences.set(data.dietaryPreferences.patientDietaryPreferences ?? []);
      this.preferenceNotesDraft.set(this.firstPreferenceNotes(data.dietaryPreferences));
    } finally {
      this.loading.set(false);
    }
  }

  async onSavePreferences(): Promise<void> {
    const snapshot = this.preferences();
    const draft = this.preferenceNotesDraft();
    this.savingPreferences.set(true);
    this.errorMessage.set(null);

    this.preferences.update((list) =>
      list.length > 0 ? [{ ...list[0], notes: draft }, ...list.slice(1)] : list
    );

    try {
      await this.patientData.updatePreferences({ notes: draft });
    } catch {
      this.preferences.set(snapshot);
      this.errorMessage.set('Could not save preferences. Try again.');
    } finally {
      this.savingPreferences.set(false);
    }
  }

  async onSaveDeliveryNote(): Promise<void> {
    const note = this.deliveryNotesDraft();
    this.savingDeliveryNote.set(true);
    this.errorMessage.set(null);

    try {
      await this.patientData.updateDeliveryNote(note);
    } catch {
      this.errorMessage.set('Could not save delivery note. Try again.');
    } finally {
      this.savingDeliveryNote.set(false);
    }
  }

  private firstPreferenceNotes(data: GetDietaryPreferencesData): string {
    const first = data.patientDietaryPreferences?.[0];
    return first?.notes ?? '';
  }
}
