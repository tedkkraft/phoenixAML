import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { PhoenixapiService } from './phoenixapi.service';

describe('PhoenixapiService', () => {
  let service: PhoenixapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [PhoenixapiService]
    })
    service = TestBed.inject(PhoenixapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
