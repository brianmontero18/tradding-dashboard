import { TestBed, inject } from '@angular/core/testing';

import { StocksService } from './logros.service';

describe('LogrosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StocksService]
    });
  });

  it('should be created', inject([StocksService], (service: StocksService) => {
    expect(service).toBeTruthy();
  }));
});
