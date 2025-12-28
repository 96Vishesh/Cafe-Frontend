import { TestBed } from '@angular/core/testing';

import { DashoboardService } from './dashoboard.service';

describe('DashoboardService', () => {
  let service: DashoboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashoboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
