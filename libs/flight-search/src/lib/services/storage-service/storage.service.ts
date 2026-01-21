import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getItem<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const item = localStorage.getItem(key);

    if (!item) {
      return null;
    }

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Ошибка получения данных по key "${key}"`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Ошибка сохранения в LocalStorage по key "${key}"`, error);
    }
  }

  removeItem(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка удаления данных по key "${key}"`, error);
    }
  }
}
