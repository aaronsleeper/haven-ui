import { TestBed } from '@angular/core/testing';
import {
  GetDietaryPreferencesData,
  GetProfileData,
} from '@dataconnect/generated';
import { PatientDataService, ProfilePageData } from '../services/patient-data.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let mockService: jasmine.SpyObj<PatientDataService>;

  beforeEach(() => {
    const profile: GetProfileData = {
      patientProfiles: [
        {
          uid: 'u1',
          firstName: 'Test',
          lastName: 'Patient',
          dateOfBirth: '1990-01-01',
          email: 'test@example.com',
          status: 'active',
        } as any,
      ],
      patientContacts: [],
    };
    const prefs: GetDietaryPreferencesData = {
      patientDietaryPreferences: [
        {
          id: 'p1',
          preferenceType: 'low-sodium',
          preferencesData: null,
          notes: 'salt sensitivity',
          updatedAt: '2026-05-01T00:00:00Z',
        } as any,
      ],
    };
    const composite: ProfilePageData = { profile, dietaryPreferences: prefs };

    mockService = jasmine.createSpyObj('PatientDataService', [
      'loadProfileData',
      'updatePreferences',
      'updateDeliveryNote',
    ]);
    mockService.loadProfileData.and.returnValue(Promise.resolve(composite));
    mockService.updatePreferences.and.returnValue(Promise.resolve());
    mockService.updateDeliveryNote.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [{ provide: PatientDataService, useValue: mockService }],
    });
  });

  it('loads profile + preferences on init via composite service call', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockService.loadProfileData).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.fullName()).toBe('Test Patient');
    expect(fixture.componentInstance.preferenceTypes()).toEqual(['low-sodium']);
  });

  it('saves preferences via updatePreferences mutation', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.preferenceNotesDraft = 'new notes';
    await fixture.componentInstance.onSavePreferences();

    expect(mockService.updatePreferences).toHaveBeenCalledWith({ notes: 'new notes' });
    expect(fixture.componentInstance.savingPreferences()).toBe(false);
  });

  it('saves delivery note via updateDeliveryNote mutation', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.deliveryNotesDraft = 'gate code 4421';
    await fixture.componentInstance.onSaveDeliveryNote();

    expect(mockService.updateDeliveryNote).toHaveBeenCalledWith('gate code 4421');
  });

  // Regression test for skeptic Finding 1: textarea input must actually update
  // the bound field (would have failed when drafts were WritableSignals + [(ngModel)]).
  it('preferenceNotesDraft updates when textarea input event fires (template binding live, not bypassed)', async () => {
    const fixture = TestBed.createComponent(ProfileComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    // Drain pattern per structural-skeptic Finding 4 — under zoneless, the @if
    // gate (`!loading() && profile()`) doesn't render the textarea until a
    // second CD pass after the ngOnInit promise resolves.
    fixture.detectChanges();
    await fixture.whenStable();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('#pref-notes');
    expect(textarea).toBeTruthy();

    textarea.value = 'typed-in-textarea';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.preferenceNotesDraft).toBe('typed-in-textarea');
  });
});
