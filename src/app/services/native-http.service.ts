import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Capacitor } from '@capacitor/core';

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
      // Temporary: force fallback to Angular HttpClient on Android emulator/dev builds
      // if the native plugin is misbehaving. This avoids the "Http.then() is not
      // implemented on android" runtime error while debugging. Remove this
      // condition when the native plugin is confirmed working on your device.
      if (Capacitor.getPlatform && Capacitor.getPlatform() === 'android') {
        return null;
      }

      const mod = await import('@capacitor-community/http');
      // Handle several possible module shapes (named export, default export, etc.)
      return mod.Http || (mod.default && (mod.default.Http || mod.default)) || mod;
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
    try {
      if (typeof plugin.post !== 'function') {
        throw new Error('Native HTTP plugin does not implement post()');
      }
      // Some plugin builds may return non-Promise objects; wrap with Promise.resolve
      const res: any = await Promise.resolve(plugin.post(options));
      return (res && res.data) ? res.data as T : res as T;
    } catch (err) {
      console.error('NativeHttpService.post error', err, { plugin, options });
      throw err;
    }
  }

  async get<T>(path: string, headers: Record<string, string> = {}): Promise<T> {
    const plugin = await this.getPlugin();
    const url = this.makeUrl(path);
    if (!plugin) throw new Error('Native HTTP plugin not available');
    const options = { url, headers } as any;
    try {
      if (typeof plugin.get !== 'function') {
        throw new Error('Native HTTP plugin does not implement get()');
      }
      const res: any = await Promise.resolve(plugin.get(options));
      return (res && res.data) ? res.data as T : res as T;
    } catch (err) {
      console.error('NativeHttpService.get error', err, { plugin, options });
      throw err;
    }
  }
}
