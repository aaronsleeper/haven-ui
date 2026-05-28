import { TestBed } from '@angular/core/testing';
import { GetMessagesData } from '@dataconnect/generated';
import { PatientDataService } from '../../services/patient-data.service';
import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  let mockService: jasmine.SpyObj<PatientDataService>;

  beforeEach(() => {
    const empty: GetMessagesData = { patientMessages: [] };
    mockService = jasmine.createSpyObj('PatientDataService', ['getMessages', 'sendMessage']);
    mockService.getMessages.and.returnValue(Promise.resolve(empty));
    mockService.sendMessage.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [MessagesComponent],
      providers: [{ provide: PatientDataService, useValue: mockService }],
    });
  });

  it('loads messages on init via PatientDataService', async () => {
    const fixture = TestBed.createComponent(MessagesComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockService.getMessages).toHaveBeenCalledWith({ limit: 50 });
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('optimistically appends on send + reconciles via refresh', async () => {
    const fixture = TestBed.createComponent(MessagesComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const sentBody = 'hello';
    await fixture.componentInstance.onSend(sentBody);

    expect(mockService.sendMessage).toHaveBeenCalledWith(sentBody);
    expect(mockService.getMessages).toHaveBeenCalledTimes(2);
  });

  it('rolls back optimistic message on send failure', async () => {
    const fixture = TestBed.createComponent(MessagesComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    mockService.sendMessage.and.returnValue(Promise.reject(new Error('network')));
    await fixture.componentInstance.onSend('fail');

    expect(fixture.componentInstance.messages()).toEqual([]);
  });
});
