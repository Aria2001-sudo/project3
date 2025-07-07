import { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { useMqtt } from '../contexts/MqttContext.jsx';

const images = import.meta.glob('/src/images/*.{png,jpg,jpeg,gif,webp}', { eager: true });

// Story segments with corresponding images and suggested sound effects
const storySegments = [
    {
        id: 0,
        title: "Village Dawn",
        text: "In the misty highlands of Guatemala, where ancient Maya temples pierce the clouds and terraced fields climb toward the sky, there lived a young man named Akbal. Each dawn, he tended the sacred fire in his village, following the ways his grandfather taught him - the ways of service, humility, and connection to the land.",
        soundEffect: "fire",
        imageKeywords: ["village", "dawn", "fire", "maya", "highland"]
    },
    {
        id: 1,
        title: "The Bad News",
        text: "But one morning, everything changed. A royal messenger stumbled into their peaceful village with terrible news: the great king of Tikal had died suddenly, and his heir had been killed by a sacred jaguar. The kingdom was in chaos, with no one to rule.",
        soundEffect: "thunder",
        imageKeywords: ["messenger", "news", "chaos", "king", "death"]
    },
    {
        id: 2,
        title: "The Divine Trials",
        text: "The high priest proclaimed that the gods themselves would choose the next king through three divine trials. Any worthy man could attempt them, but most would fail - and some would not survive.",
        soundEffect: "mystical",
        imageKeywords: ["priest", "trials", "gods", "temple", "ceremony"]
    },
    {
        id: 3,
        title: "Grandfather's Blessing",
        text: "Against his father's wishes but with his grandfather's blessing, Akbal decided to try. 'Dreams are messages from the gods,' his grandfather said, placing an ancient jade amulet around Akbal's neck. 'When they call, a true man must answer.'",
        soundEffect: "mystical",
        imageKeywords: ["grandfather", "blessing", "amulet", "jade", "family"]
    },
    {
        id: 4,
        title: "Journey to Tikal",
        text: "Akbal journeyed to the great temple city of Tikal, where massive stone pyramids reached toward the heavens. There, he found dozens of other candidates - wealthy nobles dripping with gold, fierce warriors bearing obsidian weapons, powerful merchants with armies of servants.",
        soundEffect: "temple",
        imageKeywords: ["tikal", "temple", "pyramid", "city", "candidates"]
    },
    {
        id: 5,
        title: "The Priestess Itzel",
        text: "The beautiful priestess Itzel explained the trials: 'First, you must face the sacred jaguar that terrorizes the trade routes. Second, you must answer the riddle of the crystal skull in the Temple of Wisdom. Third, you must prove your worthiness through sacrifice.'",
        soundEffect: "temple",
        imageKeywords: ["priestess", "itzel", "woman", "trials", "explanation"]
    },
    {
        id: 6,
        title: "Into the Jungle",
        text: "The first trial led them into the dense rainforest. Most candidates brought hunters and set elaborate traps to kill the mighty jaguar. But when Akbal tracked the great cat to its hidden cave, he discovered the truth - this was no monster, but a mother protecting her cubs, driven to desperation by an infected wound.",
        soundEffect: "jungle",
        imageKeywords: ["jungle", "forest", "tracking", "cave", "hunt"]
    },
    {
        id: 7,
        title: "Healing the Jaguar",
        text: "While others prepared for violence, Akbal chose compassion. Using medicinal plants his grandfather had taught him to gather, he slowly, carefully healed the jaguar's infected paw. The great cat, recognizing his pure heart, became his loyal companion.",
        soundEffect: "jaguar",
        imageKeywords: ["jaguar", "healing", "compassion", "companion", "medicine"]
    },
    {
        id: 8,
        title: "The Crystal Skull",
        text: "For the second trial, the remaining candidates entered the ancient Temple of Wisdom, where a crystal skull glowed with supernatural light. One by one, it asked them: 'What makes a true king?'",
        soundEffect: "mystical",
        imageKeywords: ["skull", "crystal", "wisdom", "temple", "glow"]
    },
    {
        id: 9,
        title: "Wrong Answers",
        text: "'Gold!' cried the wealthy merchant. Thunder rumbled, and stones fell from the ceiling. 'Strength!' declared the fierce warrior. The earth shook in displeasure. 'Power!' 'Noble blood!' 'Divine right!' Each wrong answer triggered the temple's supernatural rejection.",
        soundEffect: "thunder",
        imageKeywords: ["rejection", "thunder", "stones", "failure", "candidates"]
    },
    {
        id: 10,
        title: "Akbal's Wisdom",
        text: "Finally, only Akbal remained. Approaching the skull humbly, he thought of his grandfather's wisdom about growing maize. 'A true king,' he said quietly, 'serves his people as roots serve the tree - hidden below, giving life to all above.' Golden light filled the temple. The gods had chosen their candidate.",
        soundEffect: "mystical",
        imageKeywords: ["wisdom", "golden", "light", "roots", "tree"]
    },
    {
        id: 11,
        title: "The Approaching Army",
        text: "But then came news that would test everything Akbal believed. A vast enemy army was marching toward the kingdom, led by a mysterious warlord. They would reach the defenseless villages - including Akbal's home - within hours.",
        soundEffect: "battle",
        imageKeywords: ["army", "war", "soldiers", "march", "threat"]
    },
    {
        id: 12,
        title: "The Final Choice",
        text: "The final trial was revealed: Akbal could claim the crown immediately and rule from safety, or face the army alone to buy time for the people to escape. There was no question in his heart. A true king protects his people, even if it costs him everything.",
        soundEffect: "wind",
        imageKeywords: ["choice", "sacrifice", "crown", "decision", "heroic"]
    },
    {
        id: 13,
        title: "The Shadow King Revealed",
        text: "On a hilltop overlooking his village, Akbal prepared for what seemed like certain death. But then the enemy leader revealed himself - Yaax Balam, the supposedly dead prince, who had faked his own death to let the kingdom fall into chaos before returning as a 'savior.'",
        soundEffect: "thunder",
        imageKeywords: ["villain", "prince", "shadow", "revealed", "evil"]
    },
    {
        id: 14,
        title: "The Final Confrontation",
        text: "'Join me!' the false prince offered. 'Rule through fear! Command through strength!' 'I choose service over selfishness,' Akbal replied, drawing his simple farmer's knife against impossible odds.",
        soundEffect: "battle",
        imageKeywords: ["confrontation", "battle", "knife", "courage", "final"]
    },
    {
        id: 15,
        title: "Divine Intervention",
        text: "But as the battle began, the sky darkened. Wind whipped through the valley. In the storm clouds above, a magnificent form took shape - Kukulkan, the feathered serpent god, his scales like emeralds, his feathers like rainbows.",
        soundEffect: "thunder",
        imageKeywords: ["kukulkan", "serpent", "god", "divine", "storm"]
    },
    {
        id: 16,
        title: "God's Judgment",
        text: "'Rise, true king!' the divine voice thundered. 'You chose healing over killing, wisdom over cleverness, sacrifice over safety. The earth herself recognizes your nobility!' The ground cracked and opened, swallowing the false army. The pretender prince fell to his knees, finally understanding that true power cannot be taken - only earned through love.",
        soundEffect: "thunder",
        imageKeywords: ["judgment", "earthquake", "victory", "divine", "power"]
    },
    {
        id: 17,
        title: "The Coronation",
        text: "And so Akbal was crowned king, not in a palace of gold, but surrounded by the people he had chosen to protect. The sacred jaguar sat beside his simple throne, and Itzel, the priestess who had guided his trials, became his queen.",
        soundEffect: "mystical",
        imageKeywords: ["coronation", "crown", "king", "queen", "ceremony"]
    },
    {
        id: 18,
        title: "The Humble King",
        text: "But the most remarkable thing about King Akbal was this: every morning, despite wearing the feathered crown, he still rose before dawn to tend the sacred fire, just as his grandfather had taught him. For he understood that the greatest leaders are those who never stop serving others.",
        soundEffect: "fire",
        imageKeywords: ["humble", "service", "fire", "dawn", "leadership"]
    },
    {
        id: 19,
        title: "Happily Ever After",
        text: "Under his rule, villages and cities worked together. The terraced fields expanded, trade flourished, and children grew up knowing their voices mattered. His story became legend throughout the Maya world - proof that true nobility comes not from birth or wealth, but from the choice to put others before yourself. And they all lived happily ever after.",
        soundEffect: "mystical",
        imageKeywords: ["prosperity", "peace", "children", "legend", "ending"]
    },
    {
        id: 20,
        title: "The Moral of the Story",
        text: "This is 'The Feathered Crown' - a story about a young Maya farmer who discovered that the strongest leaders are those who lead with love, not fear. In our world of power and politics, perhaps we could all learn something from Akbal's journey from humble farmer to servant king.",
        soundEffect: "mystical",
        imageKeywords: ["moral", "lesson", "wisdom", "teaching", "reflection"]
    },
    {
        id: 21,
        title: "The Greatest Crown",
        text: "The greatest crown any of us can wear is the one we earn through service to others. True nobility comes from our actions, not our birth. May we all find the courage to serve with love, just as Akbal did.",
        soundEffect: "mystical",
        imageKeywords: ["crown", "service", "nobility", "courage", "conclusion"]
    }
];

const Orchestrator = () => {
    const { client, isConnected } = useMqtt();
    const [currentSegment, setCurrentSegment] = useState(0);
    const [narratorText, setNarratorText] = useState('');
    const [isAutoMode, setIsAutoMode] = useState(false);
    const [autoDelay, setAutoDelay] = useState(8);
    const [imageAssignments, setImageAssignments] = useState({});

    // Manual assignment of images to story segments in STORY ORDER (pic4-pic25)
    useEffect(() => {
        const fileNames = Object.values(images).map(image => image.default);
        console.log('Available images:', fileNames); // Debug log

        // Sort images by filename to ensure correct order (pic4.png to pic25.png)
        const sortedImages = fileNames.sort((a, b) => {
            const getNumber = (path) => {
                const match = path.match(/pic(\d+)\.png/);
                return match ? parseInt(match[1]) : 0;
            };
            return getNumber(a) - getNumber(b);
        });

        console.log('Sorted images:', sortedImages); // Debug log

        // Map images in STORY ORDER - pic4 = story segment 0, pic5 = story segment 1, etc.
        const assignments = {};

        // Map each image to its corresponding story segment in order
        sortedImages.forEach((imagePath, index) => {
            if (index < storySegments.length) {
                assignments[index] = imagePath;
            }
        });

        console.log('Image assignments (in story order):', assignments); // Debug log
        setImageAssignments(assignments);
    }, []);

    useEffect(() => {
        let interval;
        if (isAutoMode && currentSegment < storySegments.length) {
            interval = setInterval(() => {
                sendSegment(currentSegment);
                setCurrentSegment(prev => prev + 1);
            }, autoDelay * 1000);
        }
        return () => clearInterval(interval);
    }, [isAutoMode, currentSegment, autoDelay]);

    const sendNarration = () => {
        if (!narratorText.trim()) return;

        const payload = {
            "name": "Narrator",
            "line": narratorText,
            "gender": "male",
            "rate": 0.9,
            "pitch": 0.8
        };
        client.publish("team4/dialogue/", JSON.stringify(payload));
    };

    const sendSegment = (segmentIndex) => {
        if (segmentIndex >= storySegments.length) {
            setIsAutoMode(false);
            return;
        }

        const segment = storySegments[segmentIndex];
        const payload = {
            "name": "Narrator",
            "line": segment.text,
            "gender": "male",
            "rate": 0.9,
            "pitch": 0.8
        };
        client.publish("team4/dialogue/", JSON.stringify(payload));
        setCurrentSegment(segmentIndex);
    };

    const handleImageClick = (imagePath) => {
        console.log('Image clicked:', imagePath); // Debug log

        // Find which story segment this image belongs to
        const segmentId = Object.keys(imageAssignments).find(
            id => imageAssignments[id] === imagePath
        );

        console.log('Found segment ID:', segmentId); // Debug log

        if (segmentId !== undefined) {
            const segmentIndex = parseInt(segmentId);
            console.log('Sending segment:', segmentIndex, storySegments[segmentIndex]); // Debug log

            // Send the image
            client.publish('team4/images/', imagePath);

            // Send the corresponding story segment
            sendSegment(segmentIndex);

            // Auto-play the suggested sound effect
            const segment = storySegments[segmentIndex];
            if (segment.soundEffect) {
                console.log('Playing sound:', segment.soundEffect); // Debug log
                setTimeout(() => {
                    client.publish("team4/sound/", segment.soundEffect);
                }, 500); // Delay to let the narration start first
            }
        } else {
            console.log('No story segment found, just sending image'); // Debug log
            // If no story segment assigned, just send the image
            client.publish('team4/images/', imagePath);
        }
    };

    const startAutoNarration = () => {
        setCurrentSegment(0);
        setIsAutoMode(true);
        console.log('Starting auto narration with images and sounds!'); // Debug log
    };

    const stopAutoNarration = () => {
        setIsAutoMode(false);
    };

    const resetStory = () => {
        setCurrentSegment(0);
        setIsAutoMode(false);
    };

    const sendSound = (event) => {
        client.publish("team4/sound/", event.target.id);
    };

    if (!client || !isConnected) {
        return (
            <div>
                <h2>Error: MQTT client not connected.</h2>
                <nav>
                    <NavLink to="/">Home</NavLink>
                </nav>
            </div>
        );
    }

    const fileNames = Object.values(images).map(image => image.default);

    return (
        <div>
            <h2>🎭 The Feathered Crown - Interactive Story</h2>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/projector">Projector</NavLink>
            </nav>

            {/* Story Control Panel */}
            <div className="card">
                <h3>📖 Story Control</h3>
                <div style={{ marginBottom: '20px' }}>
                    <p><strong>Progress:</strong> Segment {currentSegment + 1} of {storySegments.length}</p>
                    <div style={{
                        width: '100%',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '10px',
                        height: '10px',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: `${(currentSegment / storySegments.length) * 100}%`,
                            backgroundColor: '#3498db',
                            height: '10px',
                            borderRadius: '10px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>

                {/* Auto Mode Controls */}
                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h4>🤖 Auto Narration</h4>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="autoDelay">Delay between segments: </label>
                        <input
                            type="number"
                            id="autoDelay"
                            min="3"
                            max="30"
                            value={autoDelay}
                            onChange={(e) => setAutoDelay(parseInt(e.target.value))}
                            style={{ width: '60px', marginLeft: '10px' }}
                        /> seconds
                    </div>
                    <div>
                        {!isAutoMode ? (
                            <button onClick={startAutoNarration} style={{ marginRight: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                                ▶️ Start Auto Story
                            </button>
                        ) : (
                            <button onClick={stopAutoNarration} style={{ marginRight: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                                ⏹️ Stop Auto Story
                            </button>
                        )}
                        <button onClick={resetStory} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}>
                            🔄 Reset Story
                        </button>
                    </div>
                </div>

                {/* Current Segment Info */}
                {currentSegment < storySegments.length && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                        <h4>📄 Current: {storySegments[currentSegment].title}</h4>
                        <p style={{
                            fontStyle: 'italic',
                            border: '1px solid #ddd',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: 'white',
                            maxHeight: '100px',
                            overflowY: 'auto'
                        }}>
                            {storySegments[currentSegment].text}
                        </p>
                    </div>
                )}

                {/* Custom Narration */}
                <div style={{ padding: '15px', backgroundColor: '#f0f8f0', borderRadius: '8px' }}>
                    <h4>✏️ Custom Narration</h4>
                    <textarea
                        value={narratorText}
                        onChange={(e) => setNarratorText(e.target.value)}
                        placeholder="Enter custom narration..."
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ddd'
                        }}
                    />
                    <button
                        onClick={sendNarration}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px'
                        }}
                    >
                        🎤 Send Custom
                    </button>
                </div>
            </div>

            {/* Interactive Story Images */}
            <div className="card">
                <h3>🖼️ Interactive Story Images</h3>
                <p style={{ marginBottom: '15px', fontStyle: 'italic', color: '#666' }}>
                    Click any image to tell that part of the story! Images automatically play the corresponding narration and sound effects.
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    padding: '10px'
                }}>
                    {fileNames.map((imagePath, index) => {
                        // Find if this image is assigned to a story segment
                        const assignedSegmentId = Object.keys(imageAssignments).find(
                            id => imageAssignments[id] === imagePath
                        );
                        const assignedSegment = assignedSegmentId ? storySegments[parseInt(assignedSegmentId)] : null;

                        return (
                            <div key={index} style={{
                                border: assignedSegment ? '3px solid #28a745' : '2px solid #ddd',
                                borderRadius: '10px',
                                padding: '5px',
                                backgroundColor: assignedSegment ? '#f8fff8' : 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease'
                            }}
                                 onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                 onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                            >
                                <img
                                    onClick={() => handleImageClick(imagePath)}
                                    src={imagePath}
                                    alt={assignedSegment ? assignedSegment.title : `Image ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: '5px'
                                    }}
                                />
                                {assignedSegment && (
                                    <div style={{
                                        padding: '8px',
                                        textAlign: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#28a745'
                                    }}>
                                        {assignedSegment.title}
                                        <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                                            🔊 {assignedSegment.soundEffect}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Manual Sound Effects */}
            <div className="card">
                <h3>🔊 Manual Sound Effects</h3>
                <div className="sounds-grid">
                    <button id='jungle' onClick={sendSound} className="sound-button">🌿 Jungle</button>
                    <button id='thunder' onClick={sendSound} className="sound-button">⚡ Thunder</button>
                    <button id='battle' onClick={sendSound} className="sound-button">⚔️ Battle</button>
                    <button id='mystical' onClick={sendSound} className="sound-button">✨ Mystical</button>
                    <button id='fire' onClick={sendSound} className="sound-button">🔥 Fire</button>
                    <button id='wind' onClick={sendSound} className="sound-button">💨 Wind</button>
                    <button id='jaguar' onClick={sendSound} className="sound-button">🐆 Jaguar</button>
                    <button id='temple' onClick={sendSound} className="sound-button">🏛️ Temple</button>
                </div>
            </div>
        </div>
    );
};

export default Orchestrator;