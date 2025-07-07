import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import { useMqtt } from '../contexts/MqttContext.jsx';

// Fallback function for sound effects
const playAdvancedSoundFallback = (soundType) => {
    console.log('Playing sound effect (fallback):', soundType);
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.error('Fallback sound failed:', error);
    }
};

// Try to import the advanced sound function
let playAdvancedSound = playAdvancedSoundFallback;
try {
    import('../sounds.js').then(module => {
        playAdvancedSound = module.playAdvancedSound || module.default || playAdvancedSoundFallback;
        console.log('Advanced sound function loaded successfully');
    }).catch(error => {
        console.warn('Could not load advanced sound module:', error);
    });
} catch (error) {
    console.warn('Could not import sounds module:', error);
}

// Global flag to prevent multiple TTS instances
let isSpeaking = false;

const Projector = () => {
    const { client, isConnected, lastMessage } = useMqtt();
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState(null);
    const processedMessages = useRef(new Set());
    const isMounted = useRef(false);
    const mountTimestamp = useRef(Date.now());

    useEffect(() => {
        // Mark component as mounted
        isMounted.current = true;
        mountTimestamp.current = Date.now();
        
        console.log('Projector mounted at:', mountTimestamp.current);
        
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (!lastMessage) return;

        const { topic, message, timestamp } = lastMessage;
        
        // Only process messages received after component mounted
        if (timestamp < mountTimestamp.current) {
            console.log('Skipping old message from before mount:', topic, message, timestamp, 'vs', mountTimestamp.current);
            return;
        }
        
        // Create a unique key for this message
        const messageKey = `${topic}-${message}-${timestamp}`;
        
        // Skip if we've already processed this exact message
        if (processedMessages.current.has(messageKey)) {
            console.log('Skipping duplicate message:', messageKey);
            return;
        }
        
        // Mark this message as processed
        processedMessages.current.add(messageKey);
        
        // Clean up old processed messages (keep only last 50)
        if (processedMessages.current.size > 50) {
            const messageArray = Array.from(processedMessages.current);
            processedMessages.current = new Set(messageArray.slice(-25));
        }

        console.log('Processing new message in projector:', topic, message, timestamp);

        if (topic === 'team4/images/') {
            setImageUrl(message);
        }
        else if (topic === 'team4/dialogue/') {
            const {name, line, gender, rate, pitch} = JSON.parse(message);
            
            // Update text immediately when message is received
            console.log('Updating text display:', name, line);
            const speakerElement = document.getElementById("speaker");
            const dialogueElement = document.getElementById("dialogue");
            
            if (speakerElement && dialogueElement) {
                speakerElement.innerHTML = name;
                dialogueElement.innerHTML = line;
                console.log('Text updated successfully');
            } else {
                console.error('Speaker or dialogue elements not found');
            }
            
            // Always cancel any existing speech first
            console.log('Canceling all speech synthesis');
            speechSynthesis.cancel();
            
            // Wait a moment for cancellation to complete
            setTimeout(() => {
                // Double-check if already speaking
                if (speechSynthesis.speaking) {
                    console.log('Still speaking after cancel, forcing cancel again');
                    speechSynthesis.cancel();
                    return;
                }
                
                // Check our global flag
                if (isSpeaking) {
                    console.log('Global flag shows already speaking, skipping');
                    return;
                }
                
                // Set speaking flag
                isSpeaking = true;
                
                const utterance = new SpeechSynthesisUtterance(line);
                utterance.pitch = pitch;
                utterance.rate = rate;
                
                // Reset flag when speech ends
                utterance.onend = () => {
                    isSpeaking = false;
                    console.log('Speech ended');
                };
                
                utterance.onerror = () => {
                    isSpeaking = false;
                    console.log('Speech error');
                };
                
                if (gender === "male") {
                    const maleVoice = speechSynthesis.getVoices().find(v =>
                        v.name.toLowerCase().includes('male') ||
                        v.name.toLowerCase().includes('man') ||
                        v.name.toLowerCase().includes('david') ||
                        v.name.toLowerCase().includes('alex')
                    );
                    if (maleVoice) {
                        utterance.voice = maleVoice;
                    }
                }
                
                console.log('Starting speech:', line);
                speechSynthesis.speak(utterance);
            }, 100); // Wait 100ms for cancellation to complete
        }
        else if (topic === 'team4/sound/') {
            // Try to use the global playAdvancedSound function from sounds.js
            if (typeof window.playAdvancedSound === 'function') {
                console.log('Using global playAdvancedSound for:', message);
                window.playAdvancedSound(message);
            } else {
                console.log('Global playAdvancedSound not available, using fallback for:', message);
                playAdvancedSoundFallback(message);
            }
        }
        else {
            setMessage(message);
        }
    }, [lastMessage]);

    return (
        <div>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/orchestrator">Orchestrator</NavLink>
            </nav>
            {!client || !isConnected ? (
                <div>
                    <h2>Error: MQTT client not connected.</h2>
                    <p>Please check your connection and try again.</p>
                </div>
            ) : null}
            <img src={imageUrl} alt="Project Output" style={{ 
                width: 'auto', 
                height: '40vw', 
                display: 'block',
                marginLeft: 'auto', 
                marginRight: 'auto'
            }} />
            <div className="dialogue-area">
                <h2 id="speaker"></h2>
                <p id="dialogue"></p>
            </div>
        </div>
    );
}

export default Projector;