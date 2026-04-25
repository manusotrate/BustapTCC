import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

// Native HTTP plugin is imported dynamically at runtime so the web build
// (ionic serve) doesn't fail when the package isn't installed.
@Injectable({ providedIn: 'root' })
export class NativeHttpService {
  private base = environment.backendUrl || 'https://tccback-gubca7f4f0aqb7h6.spaincentral-01.azurewebsites.net';

  private makeUrl(path: string) {
    if (!path) return this.base;
    return path.startsWith('http') ? path : `${this.base}${path}`;
  }

  private async getPlugin(): Promise<any> {
    try {
      const mod = await import('@capacitor-community/http');
      return mod.Http || mod;
    } catch (e) {
      // Plugin not available (web). Return null so callers can fall back.
      return null;
    }
  }

  async post<T>(path: string, body: any, headers: Record<string, string> = {}): Promise<T> {
    const plugin = await this.getPlugin();
    const url = this.makeUrl(path);
    if (!plugin) throw new Error('Native HTTP plugin not available');
    const options = { url, data: body, headers } as any;
    const r = await plugin.post(options);
    return r.data as T;
  }

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    const plugin = await this.getPlugin();
    const url = this.makeUrl(path);
    if (!plugin) throw new Error('Native HTTP plugin not available');
    const options = { url, headers } as any;
    const r = await plugin.get(options);
    return r.data as T;
  }
}
