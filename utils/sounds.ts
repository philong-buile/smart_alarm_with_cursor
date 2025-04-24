interface Sound {
  name: string;
  file: string;
}

export const ALARM_SOUNDS: Sound[] = [
  { name: 'Bell', file: '/sounds/bell.mp3' },
];

class SoundPlayer {
  private static instance: SoundPlayer;
  private currentAudio: HTMLAudioElement | null = null;

  private constructor() {}

  static getInstance(): SoundPlayer {
    if (!SoundPlayer.instance) {
      SoundPlayer.instance = new SoundPlayer();
    }
    return SoundPlayer.instance;
  }

  play(soundName: string, repeat: boolean = false, duration?: number) {
    // Stop any currently playing sound
    this.stop();

    const sound = ALARM_SOUNDS.find(s => s.name === soundName);
    if (!sound) return;

    this.currentAudio = new Audio(sound.file);
    this.currentAudio.loop = repeat;
    
    try {
      this.currentAudio.play();
      
      if (duration && !repeat) {
        setTimeout(() => {
          this.stop();
        }, duration * 1000);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
}

export const soundPlayer = SoundPlayer.getInstance(); 