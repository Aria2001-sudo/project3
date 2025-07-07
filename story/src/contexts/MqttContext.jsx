import { createContext, useContext, useEffect, useState } from 'react';
import mqtt from 'mqtt';

const MqttContext = createContext();

export const useMqtt = () => {
    const context = useContext(MqttContext);
    if (!context) {
        throw new Error('useMqtt must be used within a MqttProvider');
    }
    return context;
};

export const MqttProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        const mqttClient = mqtt.connect('wss://mqtt.uvucs.org:8443', {
            username: import.meta.env.VITE_USERNAME,
            password: import.meta.env.VITE_PASSWORD,
        });

        mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker');
            setIsConnected(true);
            mqttClient.subscribe('team4/images/');
            mqttClient.subscribe('team4/dialogue/');
            mqttClient.subscribe('team4/sound/');
        });

        mqttClient.on('message', (topic, message) => {
            console.log('Global MQTT message received:', topic, message.toString());
            setLastMessage({ topic, message: message.toString(), timestamp: Date.now() });
        });

        mqttClient.on('disconnect', () => {
            setIsConnected(false);
        });

        setClient(mqttClient);

        return () => {
            mqttClient.end();
        };
    }, []);

    return (
        <MqttContext.Provider value={{ client, isConnected, lastMessage }}>
            {children}
        </MqttContext.Provider>
    );
};
