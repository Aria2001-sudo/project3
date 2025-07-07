function playAdvancedSound(soundType) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        switch (soundType) {
            case 'jungle':
                createJungleSound(audioContext);
                break;
            case 'thunder':
                createThunderSound(audioContext);
                break;
            case 'battle':
                createBattleSound(audioContext);
                break;
            case 'mystical':
                createMysticalSound(audioContext);
                break;
            case 'fire':
                createFireSound(audioContext);
                break;
            case 'wind':
                createWindSound(audioContext);
                break;
            case 'jaguar':
                createJaguarSound(audioContext);
                break;
            case 'temple':
                createTempleSound(audioContext);
                break;
            default:
                playSimpleSound(soundType);
        }
    } catch (error) {
        console.error('Advanced sound effect error:', error);
        playSimpleSound(soundType);
    }
}

function createJungleSound(audioContext) {
    const duration = 3;
    const volume = 0.3;
    
    // Base forest ambience
    for (let i = 0; i < 5; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.setValueAtTime(60 + Math.random() * 200, audioContext.currentTime);
        osc.type = 'sawtooth';
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400 + Math.random() * 600, audioContext.currentTime);
        
        gain.gain.setValueAtTime(volume * 0.1, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + duration);
    }
    
    // Bird calls
    setTimeout(() => {
        const birdOsc = audioContext.createOscillator();
        const birdGain = audioContext.createGain();
        birdOsc.connect(birdGain);
        birdGain.connect(audioContext.destination);
        
        birdOsc.frequency.setValueAtTime(800, audioContext.currentTime);
        birdOsc.frequency.setValueAtTime(1200, audioContext.currentTime + 0.3);
        birdOsc.frequency.setValueAtTime(600, audioContext.currentTime + 0.6);
        birdOsc.type = 'sine';
        
        birdGain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        birdGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
        
        birdOsc.start(audioContext.currentTime);
        birdOsc.stop(audioContext.currentTime + 0.8);
    }, 500);
}

function createThunderSound(audioContext) {
    const duration = 2;
    const volume = 0.6;
    
    // Deep rumble
    const rumble = audioContext.createOscillator();
    const rumbleGain = audioContext.createGain();
    rumble.connect(rumbleGain);
    rumbleGain.connect(audioContext.destination);
    
    rumble.frequency.setValueAtTime(30, audioContext.currentTime);
    rumble.frequency.exponentialRampToValueAtTime(15, audioContext.currentTime + duration);
    rumble.type = 'sawtooth';
    
    rumbleGain.gain.setValueAtTime(volume * 0.8, audioContext.currentTime);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    rumble.start(audioContext.currentTime);
    rumble.stop(audioContext.currentTime + duration);
    
    // Sharp crack
    setTimeout(() => {
        const crack = audioContext.createOscillator();
        const crackGain = audioContext.createGain();
        crack.connect(crackGain);
        crackGain.connect(audioContext.destination);
        
        crack.frequency.setValueAtTime(2000, audioContext.currentTime);
        crack.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
        crack.type = 'square';
        
        crackGain.gain.setValueAtTime(volume * 0.6, audioContext.currentTime);
        crackGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        crack.start(audioContext.currentTime);
        crack.stop(audioContext.currentTime + 0.1);
    }, 300);
}

function createBattleSound(audioContext) {
    const volume = 0.4;
    
    // Metal clashing
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const clash = audioContext.createOscillator();
            const clashGain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            clash.connect(filter);
            filter.connect(clashGain);
            clashGain.connect(audioContext.destination);
            
            clash.frequency.setValueAtTime(1500 + Math.random() * 1000, audioContext.currentTime);
            clash.type = 'square';
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            
            clashGain.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
            clashGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
            
            clash.start(audioContext.currentTime);
            clash.stop(audioContext.currentTime + 0.2);
        }, i * 300);
    }
}

function createMysticalSound(audioContext) {
    const duration = 3;
    const volume = 0.3;
    
    // Shimmering magical tones
    for (let i = 0; i < 5; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        const freq = 440 * Math.pow(2, i * 0.25);
        osc.frequency.setValueAtTime(freq, audioContext.currentTime);
        osc.frequency.setValueAtTime(freq * 1.5, audioContext.currentTime + duration/2);
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + duration);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(volume * 0.2, audioContext.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + duration);
    }
}

function createFireSound(audioContext) {
    const duration = 2.5;
    const volume = 0.3;
    
    // Crackling fire simulation
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.setValueAtTime(100 + Math.random() * 400, audioContext.currentTime);
            osc.type = 'sawtooth';
            
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(200 + Math.random() * 300, audioContext.currentTime);
            
            gain.gain.setValueAtTime(volume * 0.2, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1 + Math.random() * 0.2);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.3);
        }, Math.random() * duration * 1000);
    }
}

function createWindSound(audioContext) {
    const duration = 3;
    const volume = 0.4;
    
    const wind = audioContext.createOscillator();
    const windGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    wind.connect(filter);
    filter.connect(windGain);
    windGain.connect(audioContext.destination);
    
    wind.frequency.setValueAtTime(120, audioContext.currentTime);
    wind.frequency.setValueAtTime(200, audioContext.currentTime + duration/3);
    wind.frequency.setValueAtTime(80, audioContext.currentTime + 2*duration/3);
    wind.frequency.setValueAtTime(150, audioContext.currentTime + duration);
    wind.type = 'sawtooth';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioContext.currentTime);
    
    windGain.gain.setValueAtTime(volume * 0.4, audioContext.currentTime);
    windGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    wind.start(audioContext.currentTime);
    wind.stop(audioContext.currentTime + duration);
}

function createJaguarSound(audioContext) {
    const duration = 2;
    const volume = 0.5;
    
    const growl = audioContext.createOscillator();
    const growlGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    growl.connect(filter);
    filter.connect(growlGain);
    growlGain.connect(audioContext.destination);
    
    growl.frequency.setValueAtTime(80, audioContext.currentTime);
    growl.frequency.setValueAtTime(120, audioContext.currentTime + 0.3);
    growl.frequency.setValueAtTime(200, audioContext.currentTime + 0.8);
    growl.frequency.setValueAtTime(60, audioContext.currentTime + duration);
    growl.type = 'sawtooth';
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, audioContext.currentTime);
    
    growlGain.gain.setValueAtTime(volume * 0.6, audioContext.currentTime);
    growlGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    growl.start(audioContext.currentTime);
    growl.stop(audioContext.currentTime + duration);
}

function createTempleSound(audioContext) {
    const duration = 4;
    const volume = 0.4;
    
    // Deep temple ambience
    const base = audioContext.createOscillator();
    const baseGain = audioContext.createGain();
    base.connect(baseGain);
    baseGain.connect(audioContext.destination);
    
    base.frequency.setValueAtTime(55, audioContext.currentTime);
    base.type = 'sine';
    
    baseGain.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
    baseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    base.start(audioContext.currentTime);
    base.stop(audioContext.currentTime + duration);
    
    // Harmonic overtones
    [110, 165, 220].forEach((freq, index) => {
        setTimeout(() => {
            const harmonic = audioContext.createOscillator();
            const harmonicGain = audioContext.createGain();
            harmonic.connect(harmonicGain);
            harmonicGain.connect(audioContext.destination);
            
            harmonic.frequency.setValueAtTime(freq, audioContext.currentTime);
            harmonic.type = 'sine';
            
            harmonicGain.gain.setValueAtTime(0, audioContext.currentTime);
            harmonicGain.gain.linearRampToValueAtTime(volume * 0.15, audioContext.currentTime + 0.5);
            harmonicGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
            
            harmonic.start(audioContext.currentTime);
            harmonic.stop(audioContext.currentTime + 2);
        }, index * 500);
    });
}

// Simple sound fallback
function playSimpleSound(soundType) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        oscillator.type = 'triangle';
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
        console.error('Simple sound error:', error);
    }
}

// Make playAdvancedSound available globally
window.playAdvancedSound = playAdvancedSound;
window.playSimpleSound = playSimpleSound;