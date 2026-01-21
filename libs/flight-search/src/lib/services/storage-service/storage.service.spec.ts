import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  const MOCK_KEY = 'test_key';
  const MOCK_DATA = { id: 1, name: 'Test' };

  describe('Browser Platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          StorageService,
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      service = TestBed.inject(StorageService);

      jest.spyOn(console, 'error').mockImplementation(() => {
        // remove console tresh logs
      });
    });

    afterEach(() => {
      localStorage.clear();
      jest.restoreAllMocks();
    });

    it('should save data to localStorage via setItem', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      service.setItem(MOCK_KEY, MOCK_DATA);

      expect(setItemSpy).toHaveBeenCalledWith(
        MOCK_KEY,
        JSON.stringify(MOCK_DATA),
      );
      expect(console.error).not.toHaveBeenCalled();
    });

    it('should handle errors when saving data (e.g. QuotaExceeded)', () => {
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      service.setItem(MOCK_KEY, MOCK_DATA);

      expect(console.error).toHaveBeenCalled();
    });

    it('should retrieve and parse data from localStorage via getItem', () => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue(JSON.stringify(MOCK_DATA));

      const result = service.getItem<{ id: number; name: string }>(MOCK_KEY);

      expect(localStorage.getItem).toHaveBeenCalledWith(MOCK_KEY);
      expect(result).toEqual(MOCK_DATA);
    });

    it('should return null if key does not exist', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const result = service.getItem(MOCK_KEY);

      expect(result).toBeNull();
    });

    it('should return null and log error if JSON parsing fails', () => {
      jest
        .spyOn(Storage.prototype, 'getItem')
        .mockReturnValue('{ invalid json }');

      const result = service.getItem(MOCK_KEY);

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
    });

    it('should remove data from localStorage via removeItem', () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

      service.removeItem(MOCK_KEY);

      expect(removeItemSpy).toHaveBeenCalledWith(MOCK_KEY);
    });
  });

  describe('Server Platform (SSR)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          StorageService,
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(StorageService);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should NOT call localStorage.setItem', () => {
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

      service.setItem(MOCK_KEY, MOCK_DATA);

      expect(setItemSpy).not.toHaveBeenCalled();
    });

    it('should return null and NOT call localStorage.getItem', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

      const result = service.getItem(MOCK_KEY);

      expect(result).toBeNull();
      expect(getItemSpy).not.toHaveBeenCalled();
    });

    it('should NOT call localStorage.removeItem', () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

      service.removeItem(MOCK_KEY);

      expect(removeItemSpy).not.toHaveBeenCalled();
    });
  });
});
