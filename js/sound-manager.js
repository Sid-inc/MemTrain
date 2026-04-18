// soundManager.js
export class SoundManager {
    constructor() {
        this.ctx = null;          // AudioContext
        this.sounds = new Map();  // имя -> AudioBuffer
        this.masterGain = null;
        this.enabled = false;     // станет true после разблокировки пользователем
        this.initialized = false;
    }

    // Вызвать при первом касании/клике
    async unlock() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.7; // 70% громкость
        }
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }
        this.enabled = true;
        console.log('🔊 SoundManager unlocked');
    }

    // Загрузка одного звука
    async load(name, url) {
        if (!this.ctx) {
            // отложим создание ctx до разблокировки, но буфер всё равно можно загрузить позже
            // для удобства создадим ctx принудительно (он будет suspended)
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.7;
            // не вызываем resume — пусть висит suspended до разблокировки
        }
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
        console.log(`🔊 Loaded: ${name}`);
        return audioBuffer;
    }

    // Воспроизведение (без задержки, т.к. данные уже в буфере)
    play(name, volume = 1.0) {
        if (!this.enabled) {
            // можно либо игнорировать, либо запоминать и воспроизвести после разблокировки
            console.warn(`🔇 Sound not played (locked): ${name}`);
            return;
        }
        const buffer = this.sounds.get(name);
        if (!buffer) {
            console.warn(`🔇 Sound not found: ${name}`);
            return;
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(this.masterGain);
        source.start();
        // можно вернуть source, если нужно остановить
    }

    // Мьют / громкость
    setMasterVolume(value) { // 0..1
        if (this.masterGain) this.masterGain.gain.value = value;
    }
    mute() { this.setMasterVolume(0); }
    unmute() { this.setMasterVolume(0.7); }
}
