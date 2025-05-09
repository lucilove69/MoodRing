import { Howl } from 'howler';

export type SoundEffect = 
  | 'loading'
  | 'loaded'
  | 'button_click'
  | 'title_theme'
  | 'error'
  | 'friend_request'
  | 'friend_request_sent'
  | 'notification'
  | 'message_received'
  | 'message_sent'
  | 'open_chat'
  | 'close_chat'
  | 'startup';

class SoundManager {
  private sounds: Map<SoundEffect, Howl> = new Map();
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private titleTheme: Howl | null = null;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    const soundFiles: Record<SoundEffect, string> = {
      loading: '/sounds/loading.ogg',
      loaded: '/sounds/loaded.ogg',
      button_click: '/sounds/button_click.ogg',
      title_theme: '/sounds/title_theme.ogg',
      error: '/sounds/error.ogg',
      friend_request: '/sounds/friend_request.ogg',
      friend_request_sent: '/sounds/friend_request_sent.ogg',
      notification: '/sounds/notification.ogg',
      message_received: '/sounds/message_received.ogg',
      message_sent: '/sounds/message_sent.ogg',
      open_chat: '/sounds/open_chat.ogg',
      close_chat: '/sounds/close_chat.ogg',
      startup: '/sounds/startup.ogg'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const sound = new Howl({
        src: [path],
        loop: key === 'loading' || key === 'title_theme',
        volume: this.volume,
        preload: true
      });

      this.sounds.set(key as SoundEffect, sound);
    });

    this.titleTheme = this.sounds.get('title_theme') || null;
  }

  play(sound: SoundEffect) {
    if (this.isMuted) return;
    
    const soundEffect = this.sounds.get(sound);
    if (soundEffect) {
      soundEffect.play();
    }
  }

  stop(sound: SoundEffect) {
    const soundEffect = this.sounds.get(sound);
    if (soundEffect) {
      soundEffect.stop();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => sound.volume(this.volume));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.sounds.forEach(sound => sound.stop());
    }
    return this.isMuted;
  }

  playTitleTheme() {
    if (this.titleTheme && !this.isMuted) {
      this.titleTheme.play();
    }
  }

  stopTitleTheme() {
    if (this.titleTheme) {
      this.titleTheme.stop();
    }
  }
}

export const soundManager = new SoundManager(); 