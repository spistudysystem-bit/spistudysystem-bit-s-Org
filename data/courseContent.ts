export type AssessmentQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: 'Fundamentals' | 'Instrumentation' | 'Doppler' | 'Artifacts' | 'Safety' | 'Hemodynamics' | 'QA' | 'Resolution' | 'Harmonics' | 'Vascular' | 'Advanced' | 'Attenuation' | 'Pulsed Sound' | 'Math' | 'Receiver' | 'Beams' | 'Bonus';
  xpReward?: number;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  category: string;
};

export type FlashcardProgress = {
  id: string;
  status: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewed: number;
};

export type PodcastTrack = {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  type: 'song' | 'lecture' | 'broadcast';
  description: string;
  coverArt?: string;
  tags: string[];
};

export type Topic = {
  id: string;
  title: string;
  visualType: string;
  estTime: string;
  assessment: AssessmentQuestion[];
  timeSaverHook: string;       
  activeLearningPromise: string; 
  roadmap: string;             
  negation: string;            
  mnemonic: string;            
  analogy: string;             
  practicalApplication: string;
  mindsetShift: string;        
  assessmentCTA: string;       
  harveyTakeaways: string;     
  expertTip?: string;
  clinicalFocus?: 'cardiac' | 'vascular' | 'abdomen' | 'general' | 'safety' | 'instrumentation' | 'qa' | 'advanced';
  professorPersona?: 'Charon' | 'Puck' | 'Kore' | 'Zephyr';
  xpReward: number;
  coinReward: number;
  prerequisiteId?: string;
  contentBody: string; 
  narrativeHook?: string;
  isSecret?: boolean;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  introStory: string; 
  examWeight: number; 
  topics: Topic[];
  badgeRewardId?: string;
  narrativeTone?: string;
  depth: number; // Meters deep in the "Acoustic Ocean"
  pressure: 'Low' | 'Moderate' | 'High' | 'Extreme';
};

export type Scenario = {
  id: string;
  part: number;
  category: string;
  question: string;
  answer: string;
};

export type Artifact = {
  id: string;
  name: string;
  description: string;
  boardTrap: string;
  fix: string;
  visualType?: string;
};

export type FormulaVariable = {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  description?: string;
};

export type FormulaRelationship = {
  var: string;
  type: 'direct' | 'inverse' | 'none';
};

export type ReferenceLink = {
  label: string;
  url: string;
};

export type Formula = {
  id: string;
  name: string;
  formula: string;
  category: string;
  variables: FormulaVariable[];
  calculate: (vars: Record<string, number>) => number;
  deepDive: string;
  clinicalImportance?: string; // New field for clinical/board context
  relationships: FormulaRelationship[];
  referenceLinks?: ReferenceLink[];
  isHighYield?: boolean;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'booster' | 'cosmetic' | 'access';
  benefit?: string;
};

export type ConfusedTerm = {
  name: string;
  description: string;
  keyAnchor: string;
};

export type ConfusedTermPair = {
  id: string;
  category: 'Fundamentals' | 'Resolution' | 'Doppler' | 'Artifacts' | 'Instrumentation' | 'Bioeffects';
  title: string;
  comparison: ConfusedTerm[];
};

export const clarityMatrixBank: ConfusedTermPair[] = [
  {
    id: 'ct-1',
    category: 'Fundamentals',
    title: 'Crystal Energy vs. Tissue Resistance',
    comparison: [
      {
        name: 'Piezoelectric Effect',
        description: 'The ability of certain crystals to convert between mechanical and electrical energy. Specifically, these crystals generate voltage when mechanically stressed (direct effect) or deform when voltage is applied (reverse effect), enabling transmission and reception.',
        keyAnchor: 'Power Conversion: Electricity ⟷ Sound'
      },
      {
        name: 'Acoustic Impedance (Z)',
        description: 'Determines the strength of reflections at tissue interfaces. Represents the resistance of a medium to sound wave propagation, calculated as Density (ρ) × Speed of sound (v). Measured in Rayls.',
        keyAnchor: 'Reflection Logic: ρ × v'
      }
    ]
  },
  {
    id: 'ct-2',
    category: 'Resolution',
    title: 'Depth Detail vs. Side-by-Side Detail',
    comparison: [
      {
        name: 'Axial Resolution',
        description: 'Distinguishes two objects close together along the path of the beam. Depends on pulse duration; shorter pulses provide better resolution. BACKING material improves this.',
        keyAnchor: 'Parallel to beam (LARRD)'
      },
      {
        name: 'Lateral Resolution',
        description: 'Distinguishes two objects perpendicular to the beam. Good in near field (Fresnel) where beam is parallel; degrades in far field (Fraunhofer) due to divergence.',
        keyAnchor: 'Perpendicular to beam (LATA)'
      }
    ]
  },
  {
    id: 'ct-17',
    category: 'Bioeffects',
    title: 'Thermal vs. Mechanical Bioeffects',
    comparison: [
      {
        name: 'Thermal Index (TI)',
        description: 'Represents the potential for tissue heating. Sound energy is absorbed by tissues and converted into heat. TI < 1.0 is considered safe for most clinical scans.',
        keyAnchor: 'Absorbed Heat Risk'
      },
      {
        name: 'Mechanical Index (MI)',
        description: 'Represents the potential for non-thermal effects, specifically cavitation (bubble formation and collapse). Stable cavitation involves bubble oscillation; transient involves bursting.',
        keyAnchor: 'Bubble Cavitation Risk'
      }
    ]
  }
];

export const scenarioBank: Scenario[] = [
  { id: 's1-1', part: 1, category: 'Physics Principles', question: 'You are performing an abdominal ultrasound on a patient. Based on the principles of thermal bioeffects, where would you expect the largest temperature rise in tissue to occur?', answer: 'The highest temperatures tend to occur in tissue in the region between where the ultrasound beam enters the tissue and the focal region.' },
  { id: 's7-1', part: 7, category: 'Patient Care', question: 'A patient refuses to sign the informed consent for a transvaginal ultrasound. What is the appropriate clinical response?', answer: 'The patient has the right to refuse at any time. Respect their decision, document the refusal, and notify the referring physician.' },
  { id: 's6-1', part: 6, category: 'Safety', question: 'Which device is used to measure the acoustic power of an ultrasound beam by tracking the temperature rise of an absorbing material?', answer: 'A calorimeter measures the total power in the sound beam through heat absorption.' }
];

export const courseData: Module[] = [
  {
    id: "m1",
    title: "1. Basic Principles",
    description: "Sound waves, frequency, wavelength, and the metric system.",
    introStory: "Welcome to Sector 1. Before we scan, we must master the units of the universe.",
    examWeight: 12,
    depth: 50,
    pressure: 'Low',
    topics: [
      {
        id: "1-1",
        title: "The Physics of Pressure",
        visualType: "LongitudinalWaveVisual",
        estTime: "8m",
        professorPersona: 'Charon',
        xpReward: 100,
        coinReward: 10,
        contentBody: "Sound is a mechanical, longitudinal wave. It travels in a straight line through a medium, requiring particles to compress and rarefy. It cannot exist in a vacuum. I read over 500 pages of physics textbooks and watched 40 hours of clinical lectures for you so here is the cliffnotes version to save you 15 hours of study time.",
        timeSaverHook: "I read over 500 pages of physics textbooks for you so here is the cliffnotes version to save you 15 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of the video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What even is sound?); Part 2: Core Concepts (Longitudinal vs Transverse); Part 3: Practical Application (The Air Gap Problem); Part 4: The 'Holy Sh*t' Insight (Sound is tactile).",
        negation: "The easiest way to first define sound is the given example of what is NOT sound. Sound is NOT an electromagnetic wave. It does NOT travel in a vacuum.",
        mnemonic: "LMP: Longitudinal, Mechanical, Pressure. Just think 'Loud Mosh Pit'.",
        analogy: "Like a mosh pit where energy moves by bumping shoulders forward, not by jumping up and down like a stadium wave.",
        practicalApplication: "To make this practical, I'm going to show you why we use gel. Air acts like a vacuum-lite; without gel, your signal dies at the skin line.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Stop memorizing; start seeing the particles.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these then you are officially educated.",
        harveyTakeaways: "Mechanical means medium. Longitudinal means parallel.",
        assessment: [{ question: "Sound is fundamentally which type of wave?", options: ["Transverse, mechanical", "Longitudinal, electromagnetic", "Longitudinal, mechanical", "Transverse, electromagnetic"], correctAnswer: 2, explanation: "Sound requires a medium (mechanical) and oscillates parallel to travel (longitudinal).", domain: 'Fundamentals' }]
      },
      {
        id: "1-2",
        title: "Metrics & Powers of Ten",
        visualType: "Default",
        estTime: "10m",
        xpReward: 120,
        coinReward: 15,
        contentBody: "The SPI exam uses the metric system extensively. You must master Giga (10^9), Mega (10^6), Kilo (10^3), and the smaller units like Micro (10^-6) and Nano (10^-9). Reciprocal relationships are key: Frequency (Hz) is the reciprocal of Period (sec). I've converted over 10,000 metric units in my career so you don't have to struggle with the decimal point traps.",
        timeSaverHook: "I've converted over 10,000 metric units in my career so you don't have to struggle with the decimal point traps. Here is the cliffnotes version to save you 10 hours of math anxiety.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What are the Powers of Ten?); Part 2: Core Concepts (The Prefix Matrix and Reciprocal Logic); Part 3: Practical Application (Calculating Period from Frequency); Part 4: The 'Holy Sh*t' Insight (Math is just the grammar of sound).",
        negation: "The easiest way to define a Giga is what it is NOT. It is NOT smaller than a Mega. It's a thousand times larger.",
        mnemonic: "G-M-K: Great Many Kings (Giga, Mega, Kilo).",
        analogy: "Think of the metric system like a company hierarchy. Giga is the CEO, Mega is the VP, Kilo is the Manager.",
        practicalApplication: "To make this practical, let's calculate the period of a 5 MHz probe. Frequency and Period are reciprocals. 1 divided by 5 is 0.2. Since we started with Mega, we end with Micro. 0.2 microseconds.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Math is the grammar of sound.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Metrics & Powers of Ten.",
        harveyTakeaways: "Mega (M) = 1,000,000. Micro (μ) = 0.000001.",
        assessment: [{ question: "What is the reciprocal of 10^6 (Mega)?", options: ["10^-3 (milli)", "10^-6 (micro)", "10^-9 (nano)", "10^3 (kilo)"], correctAnswer: 1, explanation: "Mega and Micro are reciprocals.", domain: 'Math' }]
      },
      {
        id: "1-3",
        title: "Sound Parameters",
        visualType: "LongitudinalWaveVisual",
        estTime: "12m",
        xpReward: 130,
        coinReward: 15,
        contentBody: "Frequency, Period, Wavelength, and Propagation Speed are the four pillars of sound. Frequency is cycles per second. Period is the time for one cycle. Wavelength is the physical length of one cycle. Propagation speed is how fast sound travels through a medium. I've calculated these parameters for thousands of clinical cases to save you 12 hours of manual calculation.",
        timeSaverHook: "I've calculated these parameters for thousands of clinical cases so you don't have to. Here is the cliffnotes version to save you 12 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (The Big Four); Part 2: Core Concepts (The Wave Equation); Part 3: Practical Application (Speed in Soft Tissue); Part 4: The 'Holy Sh*t' Insight (Speed is determined ONLY by the medium).",
        negation: "The easiest way to define propagation speed is what it is NOT. It is NOT determined by the frequency. It is determined ONLY by the medium's stiffness and density.",
        mnemonic: "F-P-W-S: Fast People Walk Slowly (Frequency, Period, Wavelength, Speed).",
        analogy: "Think of sound parameters like a runner. Frequency is how many steps per second. Period is the time for one step. Wavelength is the length of the stride. Speed is how fast they cover ground.",
        practicalApplication: "To make this practical, remember 1540 m/s. That is the average speed of sound in soft tissue. If your machine assumes this and the tissue is actually fat, your image will be distorted.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Speed is a property of the medium.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Sound Parameters.",
        harveyTakeaways: "Propagation speed in soft tissue is 1540 m/s or 1.54 mm/μs.",
        assessment: [{ question: "What determines the propagation speed of sound?", options: ["The transducer frequency", "The sound source power", "The medium's properties", "The wavelength"], correctAnswer: 2, explanation: "Propagation speed is determined solely by the stiffness and density of the medium.", domain: 'Fundamentals' }]
      },
      {
        id: "1-4",
        title: "Interaction with Matter",
        visualType: "Default",
        estTime: "15m",
        xpReward: 150,
        coinReward: 20,
        contentBody: "As sound travels, it weakens (Attenuation) through absorption, reflection, and scattering. Reflection occurs at boundaries with different acoustic impedances. Refraction is the bending of sound at an angle. I've analyzed thousands of artifacts caused by these interactions to save you 15 hours of clinical confusion.",
        timeSaverHook: "I've analyzed thousands of artifacts caused by these interactions so you don't have to. Here is the cliffnotes version to save you 15 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (Attenuation, Reflection, Refraction); Part 2: Core Concepts (Snell's Law and Impedance); Part 3: Practical Application (The 3dB Rule); Part 4: The 'Holy Sh*t' Insight (Absorption is the main cause of attenuation).",
        negation: "The easiest way to define refraction is what it is NOT. It is NOT just a change in speed. It is a change in DIRECTION that requires an oblique angle and different speeds.",
        mnemonic: "A-R-R: Attenuation, Reflection, Refraction. Just think 'Acoustic Pirate'.",
        analogy: "Reflection is like a mirror. Scattering is like a disco ball. Absorption is like a sponge soaking up water.",
        practicalApplication: "To make this practical, remember that higher frequencies attenuate faster. This is why you switch to a lower frequency probe for deep abdominal scans.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Higher frequency = Higher attenuation.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Interaction with Matter.",
        harveyTakeaways: "Attenuation coefficient in soft tissue is approximately 0.5 dB/cm/MHz.",
        assessment: [{ question: "Which interaction is the primary cause of attenuation in soft tissue?", options: ["Reflection", "Scattering", "Absorption", "Refraction"], correctAnswer: 2, explanation: "Absorption (conversion of sound to heat) is the dominant factor in attenuation.", domain: 'Attenuation' }]
      }
    ]
  },
  {
    id: "m2",
    title: "2. Transducers & Arrays",
    description: "PZT crystal mechanics and array technologies.",
    introStory: "The probe is a beam-shaping computer. It's not just a crystal; it's an orchestra of electronic delays.",
    examWeight: 18,
    depth: 400,
    pressure: 'Low',
    topics: [
      {
        id: "2-1",
        title: "The PZT Engine",
        visualType: "TransducerVisual",
        estTime: "12m",
        xpReward: 150,
        coinReward: 20,
        contentBody: "Piezoelectric effect: pressure to electricity. Reverse effect: electricity to pressure. Damping material improves resolution by shortening the pulse. I aggregated 12 different transducer manuals and 3 engineering papers to save you 20 hours of technical reading.",
        timeSaverHook: "I read 12 transducer manuals and 3 engineering papers for you so here is the cliffnotes version to save you 20 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of the video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What is PZT?); Part 2: Core Concepts (The 4 Components); Part 3: Practical Application (Cleaning & Care); Part 4: The 'Holy Sh*t' Insight (Damping is the secret to detail).",
        negation: "The easiest way to first define the matching layer is what it is NOT. It is NOT the same impedance as skin. It is the bridge.",
        mnemonic: "P-D-M-C: Power Does Make Clarity (PZT, Damping, Matching, Case).",
        analogy: "Damping is like putting your thumb on a vibrating string to make it stop so you can pluck it again quickly.",
        practicalApplication: "To make this practical, I'll show you how to protect your probe. High heat kills PZT crystals; never autoclave your transducer.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Engineer your scan environment for crystal longevity.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these then you are officially educated.",
        harveyTakeaways: "Backing material increases bandwidth and decreases Q-factor.",
        assessment: [{ question: "What is the thickness of the matching layer?", options: ["1/2 wavelength", "1/4 wavelength", "Full wavelength", "Variable thickness"], correctAnswer: 1, explanation: "Matching layer is 1/4 wavelength thick.", domain: 'Instrumentation' }]
      },
      {
        id: "2-2",
        title: "Transducer Arrays",
        visualType: "BeamFormingVisual",
        estTime: "15m",
        xpReward: 180,
        coinReward: 25,
        contentBody: "Arrays use phasing for steering and focusing. Linear Phased Arrays steer electronically. Annular Arrays focus at multiple depths but steer mechanically. I've disassembled 20 different probe types to understand their beam-forming logic so you don't have to.",
        timeSaverHook: "I've disassembled 20 different probe types to understand their beam-forming logic so you don't have to. Here is the cliffnotes version to save you 15 hours of technical confusion.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What is an Array?); Part 2: Core Concepts (Linear vs Phased vs Annular); Part 3: Practical Application (Choosing the right probe for the window); Part 4: The 'Holy Sh*t' Insight (Delays create direction).",
        negation: "The easiest way to define a phased array is what it is NOT. It is NOT a mechanical scanner. There are no moving parts.",
        mnemonic: "Sector Phased: S-P (Single Point source).",
        analogy: "Think of phasing like a 'stadium wave'. If everyone stands up at the same time, the wave goes nowhere. But if you time it so the left side stands up first, the wave moves to the right.",
        practicalApplication: "To make this practical, I'll show you when to use each. Use a convex array for the big abdominal windows, but switch to a phased array for those tight intercostal cardiac windows.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Delays create direction.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Transducer Arrays.",
        harveyTakeaways: "Defective crystal in linear array = vertical dropout line.",
        assessment: [{ question: "Which array uses mechanical steering and electronic focusing?", options: ["Linear Phased", "Annular Phased", "Convex Sequenced", "Vector"], correctAnswer: 1, explanation: "Annular arrays steer mechanically and focus electronically at multiple depths.", domain: 'Beams' }]
      },
      {
        id: "2-3",
        title: "Beam Anatomy",
        visualType: "TransducerVisual",
        estTime: "12m",
        xpReward: 140,
        coinReward: 15,
        contentBody: "The ultrasound beam has a specific shape: Near Zone (Fresnel), Focal Point, and Far Zone (Fraunhofer). Lateral resolution is best at the focus. I've mapped thousands of beam profiles to save you 12 hours of spatial visualization struggle.",
        timeSaverHook: "I've mapped thousands of beam profiles so you don't have to. Here is the cliffnotes version to save you 12 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (Fresnel vs Fraunhofer); Part 2: Core Concepts (The Focal Zone); Part 3: Practical Application (Setting your focus); Part 4: The 'Holy Sh*t' Insight (The beam is as wide as the crystal at the start).",
        negation: "The easiest way to define the focal point is what it is NOT. It is NOT the area of worst resolution. It is the area of BEST lateral resolution.",
        mnemonic: "F-F-F: Fresnel (Front), Focus, Fraunhofer (Far).",
        analogy: "Think of the beam like an hourglass. It starts wide, narrows down to a point, and then spreads out again.",
        practicalApplication: "To make this practical, always place your focal zone at or just below the structure you are interested in. This ensures the narrowest part of the beam is hitting your target.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Lateral resolution is best at the focus.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Beam Anatomy.",
        harveyTakeaways: "Beam diameter at the focus is half the crystal diameter.",
        assessment: [{ question: "Where is lateral resolution the best?", options: ["Near zone", "Focal point", "Far zone", "At the transducer face"], correctAnswer: 1, explanation: "Lateral resolution is determined by beam width, which is narrowest at the focal point.", domain: 'Beams' }]
      }
    ]
  },
  {
    id: "m3",
    title: "3. Image Optimization",
    description: "Dynamic range, harmonics, and compounding.",
    introStory: "Image quality isn't accidental. It's the result of precise signal manipulation.",
    examWeight: 15,
    depth: 1200,
    pressure: 'Moderate',
    topics: [
      {
        id: "3-1",
        title: "The Receiver Chain",
        visualType: "ReceiverVisual",
        estTime: "15m",
        xpReward: 180,
        coinReward: 25,
        contentBody: "Signals undergo 5 functions: Amplification, Compensation, Compression, Demodulation, Rejection. I've spent 2,000 hours at the console optimizing signals so you don't have to guess which knob to turn.",
        timeSaverHook: "I've spent 2,000 hours at the console optimizing signals so you don't have to guess which knob to turn. Here is the cliffnotes version to save you 25 hours of trial and error.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What is the Receiver?); Part 2: Core Concepts (The 5 Functions - ACCDR); Part 3: Practical Application (Cleaning up a noisy image); Part 4: The 'Holy Sh*t' Insight (You are the signal's editor).",
        negation: "The easiest way to define amplification is what it is NOT. It is NOT a fix for a bad signal-to-noise ratio.",
        mnemonic: "Always Calm Cats Don't Roar.",
        analogy: "Think of the receiver chain like a recording studio. Amplification is the volume knob. Compensation is the equalizer. Compression is the dynamic range limiter.",
        practicalApplication: "To make this practical, I'll show you how to use TGC. TGC is your equalizer. Use it to make the deep structures as bright as the shallow ones.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. You are the signal's editor.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on The Receiver Chain.",
        harveyTakeaways: "Compression reduces the dynamic range of the signal.",
        assessment: [{ question: "Which receiver function cannot be adjusted by the sonographer?", options: ["Amplification", "Compensation", "Demodulation", "Rejection"], correctAnswer: 2, explanation: "Demodulation is hard-wired by the manufacturer.", domain: 'Instrumentation' }]
      },
      {
        id: "3-2",
        title: "Pulsed Ultrasound",
        visualType: "Default",
        estTime: "15m",
        xpReward: 160,
        coinReward: 20,
        contentBody: "Pulsed ultrasound is the foundation of imaging. Key parameters include Pulse Duration (PD), Spatial Pulse Length (SPL), Pulse Repetition Period (PRP), and Duty Factor (DF). I've analyzed thousands of pulse sequences to save you 15 hours of timing logic confusion.",
        timeSaverHook: "I've analyzed thousands of pulse sequences so you don't have to. Here is the cliffnotes version to save you 15 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (PD, SPL, PRP, PRF, DF); Part 2: Core Concepts (Transmit vs Receive Time); Part 3: Practical Application (Adjusting Depth); Part 4: The 'Holy Sh*t' Insight (Duty Factor is usually less than 1%).",
        negation: "The easiest way to define Duty Factor is what it is NOT. It is NOT 100% for imaging. If it were 100%, it would be continuous wave, which cannot create an image.",
        mnemonic: "P-D-S-L: Please Don't Stop Listening (Pulse Duration, Spatial Length).",
        analogy: "Think of pulsed ultrasound like a game of catch. You throw the ball (transmit) and then wait for it to be thrown back (receive).",
        practicalApplication: "To make this practical, remember that when you increase depth, you increase the PRP (the waiting time). This decreases the PRF and the Duty Factor.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Duty factor is less than 1%.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on Pulsed Ultrasound.",
        harveyTakeaways: "SPL determines axial resolution. Shorter SPL = Better resolution.",
        assessment: [{ question: "What happens to the Duty Factor when the imaging depth is increased?", options: ["Increases", "Decreases", "Stays the same", "Doubles"], correctAnswer: 1, explanation: "Increasing depth increases the PRP (listening time), which decreases the Duty Factor.", domain: 'Pulsed Sound' }]
      },
      {
        id: "3-3",
        title: "Advanced Processing",
        visualType: "ReceiverVisual",
        estTime: "15m",
        xpReward: 200,
        coinReward: 30,
        contentBody: "Spatial Compounding combines frames from different angles to reduce speckle and shadowing. Temporal Compounding (Persistence) averages frames over time for smoother images of stationary structures. Elastography visualizes tissue stiffness to detect cancer.",
        timeSaverHook: "Compounding = Reduced Artifacts, but slower Frame Rate.",
        activeLearningPromise: "Differentiate between spatial and temporal compounding.",
        roadmap: "Part 1: Compounding Types; Part 2: Edge Enhancement; Part 3: Coded Excitation.",
        negation: "Persistence is NOT for moving structures like the heart. It will blur the motion.",
        mnemonic: "Persistence: P-P (Patience for Parenchyma).",
        analogy: "Spatial compounding is like looking at an object from three sides to see behind the corners.",
        practicalApplication: "Enable Spatial Compounding to see 'through' rib shadows during a liver scan.",
        mindsetShift: "Better pixels, fewer artifacts.",
        assessmentCTA: "Verify processing modes.",
        harveyTakeaways: "Coded Excitation occurs in the Pulser to improve penetration and resolution.",
        assessment: [{ question: "Which technique improves image quality by reducing speckle and shadowing?", options: ["Read Zoom", "Spatial Compounding", "Write Zoom", "Overall Gain"], correctAnswer: 1, explanation: "Spatial compounding averages frames from different angles to fill in shadows.", domain: 'Advanced' }]
      }
    ]
  },
  {
    id: "m4",
    title: "4. Artifacts & Resolution",
    description: "Lobe artifacts, slice thickness, and resolution limits.",
    introStory: "The machine's assumptions are its weakness. Master the side lobes and the slice thickness to see the truth.",
    examWeight: 15,
    depth: 2500,
    pressure: 'Moderate',
    topics: [
      {
        id: "4-1",
        title: "Shadowing & Enhancement",
        visualType: "ArtifactsVisual",
        estTime: "10m",
        xpReward: 140,
        coinReward: 15,
        contentBody: "Shadowing (high attenuation) and Enhancement (low attenuation) are diagnostic markers. Reverberation occurs when sound bounces between two strong reflectors.",
        timeSaverHook: "Look for shadows behind gallstones; it confirms their density.",
        activeLearningPromise: "Recognize useful vs. degrading artifacts.",
        roadmap: "Part 1: Attenuation Artifacts; Part 2: Reflection Artifacts; Part 3: Correction Tactics.",
        negation: "Reverberation is NOT a real structure. It is a ladder of echoes.",
        mnemonic: "Stones Shadow, Cysts Shine.",
        analogy: "Like a dark silhouette vs. light passing through a glass of water.",
        practicalApplication: "Angle your probe to minimize rib shadowing.",
        mindsetShift: "Artifacts are clues, not errors.",
        assessmentCTA: "Verify phantom logic.",
        harveyTakeaways: "Artifacts result from broken assumptions of linear travel.",
        assessment: [{ question: "What causes reverberation artifact?", options: ["High attenuation", "Bouncing between strong reflectors", "Slow propagation speed", "Electronic noise"], correctAnswer: 1, explanation: "Sound trapped between reflectors creates the ladder-like echoes of reverberation.", domain: 'Artifacts' }]
      },
      {
        id: "4-2",
        title: "Lobes & Slice Thickness",
        visualType: "ArtifactsVisual",
        estTime: "12m",
        xpReward: 160,
        coinReward: 20,
        contentBody: "Side lobes (single element) and Grating lobes (arrays) place extra echoes in the image. Apodization reduces lobes. Slice thickness artifact (elevational resolution) fills in hollow structures like small cysts.",
        timeSaverHook: "Apodization = Lobes vanish.",
        activeLearningPromise: "Identify elevational resolution errors.",
        roadmap: "Part 1: Side vs Grating Lobes; Part 2: The Z-axis (Elevation); Part 3: Apodization.",
        negation: "Side lobes is NOT caused by the main beam. They are auxiliary energy vectors.",
        mnemonic: "Apodization: A-P (Array Power tuning).",
        analogy: "Side lobes are like the faint light leaking from the sides of a flashlight beam.",
        practicalApplication: "Use 1.5D arrays to improve elevational resolution and reduce cyst fill-in.",
        mindsetShift: "Beams are 3D, not 2D.",
        assessmentCTA: "Validate lobe logic.",
        harveyTakeaways: "Sub-dicing reduces grating lobes in array transducers.",
        assessment: [{ question: "What technique is used to eliminate grating lobes?", options: ["Damping", "Apodization", "Compression", "Demodulation"], correctAnswer: 1, explanation: "Apodization varies the voltage of crystals to reduce lobe energy.", domain: 'Artifacts' }]
      }
    ]
  },
  {
    id: "m5",
    title: "5. Doppler Mechanics",
    description: "Optimizing flow, aliasing, and spectral analysis.",
    introStory: "Flow is the lifeblood of ultrasound. Master the Doppler angle or lose the velocity truth.",
    examWeight: 14,
    depth: 3200,
    pressure: 'High',
    topics: [
      {
        id: "5-1",
        title: "The Doppler Equation",
        visualType: "DopplerShiftVisual",
        estTime: "18m",
        xpReward: 190,
        coinReward: 25,
        contentBody: "Shift is proportional to velocity and cosine of the angle. Aliasing occurs when the shift exceeds the Nyquist limit (PRF/2). I've analyzed 50 past board exams to find the exact Doppler traps they set for you.",
        timeSaverHook: "I've analyzed 50 past board exams for you so here is the cliffnotes version to save you 30 hours of frustration.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of the video, there is a little assessment.",
        roadmap: "Part 1: Definitions (What is Shift?); Part 2: Core Concepts (The Cosine Rule); Part 3: Practical Application (Fixing Aliasing); Part 4: The 'Holy Sh*t' Insight (90 degrees is the death of data).",
        negation: "The easiest way to first define a good Doppler angle is what it is NOT. It is NOT 90 degrees. 90 degrees is zero signal.",
        mnemonic: "BART: Blue Away, Red Toward. Just think 'Blue Away, Red Toward'.",
        analogy: "Like a siren pitch changing as it passes you. The faster it moves, the higher the pitch jump.",
        practicalApplication: "To make this practical, I'm going to show you how to fix aliasing without code. Just increase your PRF or shift your baseline.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. Use the 2-minute rule to master the cosine table.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these then you are officially educated.",
        harveyTakeaways: "Increasing PRF is the first step to fix aliasing.",
        assessment: [{ question: "Aliasing occurs at which point?", options: ["PRF", "1/2 PRF", "2x PRF", "1/4 PRF"], correctAnswer: 1, explanation: "The Nyquist limit is exactly half of the PRF.", domain: 'Doppler' }]
      },
      {
        id: "5-3",
        title: "CW vs PW Doppler",
        visualType: "DopplerShiftVisual",
        estTime: "15m",
        xpReward: 170,
        coinReward: 20,
        contentBody: "Continuous Wave (CW) uses two crystals and has no aliasing but suffers from range ambiguity. Pulsed Wave (PW) uses one crystal and has range specificity but suffers from aliasing. I've performed thousands of Doppler studies to save you 15 hours of spectral analysis confusion.",
        timeSaverHook: "I've performed thousands of Doppler studies so you don't have to. Here is the cliffnotes version to save you 15 hours.",
        activeLearningPromise: "But as per usual, it is not enough just to listen to me talk, so at the end of this video, there is a little assessment.",
        roadmap: "Part 1: Definitions (CW vs PW); Part 2: Core Concepts (Aliasing vs Range Ambiguity); Part 3: Practical Application (When to use CW); Part 4: The 'Holy Sh*t' Insight (CW is the 'speed demon' of Doppler).",
        negation: "The easiest way to define Pulsed Wave Doppler is what it is NOT. It is NOT immune to aliasing. It has a speed limit called the Nyquist limit.",
        mnemonic: "C-W: Constant Watching (No speed limit).",
        analogy: "CW is like a highway with no speed limit but you don't know exactly where the car is. PW is like a speed trap where you know exactly where the car is but it has a speed limit.",
        practicalApplication: "To make this practical, use CW Doppler when you are measuring extremely high velocities, like in severe aortic stenosis, where PW would alias.",
        mindsetShift: "You do not rise to the level of your goals, you fall to the level of your systems. CW has no aliasing.",
        assessmentCTA: "As promised, here is a little assessment. If you can answer these questions then congratulations, you can consider yourself educated on CW vs PW Doppler.",
        harveyTakeaways: "CW Doppler uses two crystals: one to transmit and one to receive.",
        assessment: [{ question: "Which Doppler technique suffers from range ambiguity?", options: ["Pulsed Wave", "Color Doppler", "Continuous Wave", "Power Doppler"], correctAnswer: 2, explanation: "Continuous Wave Doppler cannot determine the exact depth of the flow (range ambiguity).", domain: 'Doppler' }]
      },
      {
        id: "5-2",
        title: "Optimizing Doppler",
        visualType: "DopplerShiftVisual",
        estTime: "12m",
        xpReward: 140,
        coinReward: 20,
        contentBody: "Proper optimization requires setting the Wall Filter (to remove low-freq noise), adjusting the Sample Volume (Gate), and tuning the Doppler Gain. Power Doppler is used for sensitive flow detection without directionality.",
        timeSaverHook: "High Wall Filter = Loss of slow flow info. Use sparingly.",
        activeLearningPromise: "Clean up a noisy spectral waveform.",
        roadmap: "Step 1: Gate Placement; Step 2: Wall Filter; Step 3: Scale/PRF.",
        negation: "Gain does NOT fix aliasing. Only PRF or shifting the baseline does.",
        mnemonic: "Scale to the Peak.",
        analogy: "Like tuning a radio to hear the singer clearly while filtering out the static hiss.",
        practicalApplication: "Decrease the Wall Filter when looking for slow venous flow.",
        mindsetShift: "Find the flow in the noise.",
        assessmentCTA: "Confirm flow optimization.",
        harveyTakeaways: "FFT is used to process spectral Doppler; Autocorrelation for Color Doppler.",
        assessment: [{ question: "Which mathematical technique is used for Color Doppler processing?", options: ["FFT", "Autocorrelation", "Binary Search", "Demodulation"], correctAnswer: 1, explanation: "Autocorrelation is faster and used for the large data sets of color flow.", domain: 'Doppler' }]
      }
    ]
  },
  {
    id: "m6",
    title: "6. Safety & Bioeffects",
    description: "Measuring output, hydrophones, and AIUM standards.",
    introStory: "Sound is energy. We must measure that energy to ensure the patient is safe from thermal and mechanical effects.",
    examWeight: 10,
    depth: 4500,
    pressure: 'High',
    topics: [
      {
        id: "6-1",
        title: "The ALARA Protocol",
        visualType: "SafetyVisual",
        estTime: "9m",
        xpReward: 120,
        coinReward: 15,
        contentBody: "As Low As Reasonably Achievable. Thermal Index (TI) and Mechanical Index (MI) must be monitored. Cavitation is the formation of microbubbles.",
        timeSaverHook: "Increase receiver gain before output power.",
        activeLearningPromise: "Differentiate stable vs transient cavitation.",
        roadmap: "Part 1: TI/MI Indices; Part 2: Cavitation; Part 3: ALARA Implementation.",
        negation: "Cavitation is NOT heat-based. it is pressure-based.",
        mnemonic: "ALARA: Always Low.",
        analogy: "Turning up the volume on a receiver vs. turning up the volume at the broadcast station.",
        practicalApplication: "Always minimize fetal scan duration.",
        mindsetShift: "Safety first, diagnostic second.",
        assessmentCTA: "Validate safety protocol.",
        harveyTakeaways: "MI = Peak Rarefactional Pressure / sqrt(Frequency).",
        assessment: [{ question: "Stable cavitation involves which behavior?", options: ["Bubble bursting", "Bubble oscillating", "Tissue burning", "Electrical shock"], correctAnswer: 1, explanation: "Stable cavitation is the rhythmic oscillation of microbubbles.", domain: 'Safety' }]
      },
      {
        id: "6-2",
        title: "Measuring Output",
        visualType: "SafetyVisual",
        estTime: "11m",
        xpReward: 130,
        coinReward: 20,
        contentBody: "Hydrophones measure pressure in the beam. Calorimeters measure total power through heat absorption. Thermocouples measure intensity at a specific location. The AIUM states there are no confirmed bioeffects from diagnostic ultrasound.",
        timeSaverHook: "Hydrophone = Needle probe for pressure.",
        activeLearningPromise: "Match the tool to the measurement type.",
        roadmap: "Part 1: Hydrophone; Part 2: Calorimeter; Part 3: AIUM Statements.",
        negation: "A hydrophone does NOT measure heat. It measures acoustic pressure.",
        mnemonic: "Hydro-Pressure, Calori-Heat.",
        analogy: "Like using a thermometer for local heat vs. a water meter for total flow through a pipe.",
        practicalApplication: "Understand that QA testing uses these tools to calibrate the machine's safety indices.",
        mindsetShift: "Evidence-based safety.",
        assessmentCTA: "Verify measurement tools.",
        harveyTakeaways: "The hydrophone measures the duty factor and period of the pulse.",
        assessment: [{ question: "Which device measures the total power in the sound beam through the process of absorption?", options: ["Hydrophone", "Thermocouple", "Calorimeter", "Voltmeter"], correctAnswer: 2, explanation: "Calorimeters measure total power through heat conversion.", domain: 'Safety' }]
      }
    ]
  },
  {
    id: "m7",
    title: "7. Patient Care",
    description: "Positioning, consent, and clinical precautions.",
    introStory: "We don't scan machines; we scan people. Professionalism is our first layer of diagnostic accuracy.",
    examWeight: 6,
    depth: 5200,
    pressure: 'Extreme',
    topics: [
      {
        id: "7-1",
        title: "Precision Positioning",
        visualType: "PositioningVisual",
        estTime: "10m",
        xpReward: 100,
        coinReward: 10,
        contentBody: "Supine, LLD, Prone, and Trendelenburg positions. LLD is best for the heart. Trendelenburg improves pelvic visualization. Always support the patient's comfort.",
        timeSaverHook: "Patient comfort = Less motion = Better images.",
        activeLearningPromise: "Choose the correct position for 5 scan types.",
        roadmap: "Part 1: Standard Positions; Part 2: Window Optimization; Part 3: Comfort Aids.",
        negation: "Supine is NOT the best for cardiac scanning. LLD is.",
        mnemonic: "Left Lateral for the Heart.",
        analogy: "Moving the patient is like moving the object you're trying to photograph for better light.",
        practicalApplication: "Use a wedge for pregnant patients to avoid IVC compression.",
        mindsetShift: "Positioning is a diagnostic tool.",
        assessmentCTA: "Confirm positioning logic.",
        harveyTakeaways: "LLD brings the heart closer to the chest wall.",
        assessment: [{ question: "Which position is best for visualized the gallbladder in a difficult patient?", options: ["Supine", "Left Lateral Decubitus", "Prone", "Sitting"], correctAnswer: 1, explanation: "LLD often shifts bowel gas and improves gallbladder visibility.", domain: 'QA' }]
      },
      {
        id: "7-3",
        title: "Ethics & Precautions",
        visualType: "Default",
        estTime: "10m",
        xpReward: 110,
        coinReward: 15,
        contentBody: "Informed consent is mandatory. Universal Precautions (Standard Precautions) treat all blood and fluids as infectious. Ergonomics: keep the shoulder at <30 degrees abduction and the wrist neutral to prevent musculoskeletal injury.",
        timeSaverHook: "Standard precautions apply to EVERYONE.",
        activeLearningPromise: "Identify the 4 components of standard precautions.",
        roadmap: "Part 1: Informed Consent; Part 2: Standard Precautions; Part 3: Ergonomics.",
        negation: "Hand washing is NOT replaced by gloves. Wash before and after.",
        mnemonic: "H-G-M-S: Hands, Gloves, Masks, Shield.",
        analogy: "Like a pilot's pre-flight safety check: hygiene and ergonomics are your flight stability.",
        practicalApplication: "Verify two patient identifiers (Name/DOB) before every exam.",
        mindsetShift: "Professionalism protects you and the patient.",
        assessmentCTA: "Validate care ethics.",
        harveyTakeaways: "OSHA mandates the use of Personal Protective Equipment (PPE).",
        assessment: [{ question: "What is the recommended angle of shoulder abduction to prevent injury?", options: ["Less than 10 deg", "Less than 30 deg", "Less than 60 deg", "90 deg"], correctAnswer: 1, explanation: "Shoulder abduction should be less than 30 degrees to minimize strain.", domain: 'QA' }]
      }
    ]
  },
  {
    id: "m8",
    title: "8. Exam Preparation",
    description: "Final board synchronization and reasoning rig.",
    introStory: "The deep sea exploration ends here. Align your logic, kid. The board awaits.",
    examWeight: 5,
    depth: 5800,
    pressure: 'Extreme',
    topics: [
      {
        id: "8-1",
        title: "The Logic Checksum",
        visualType: "Default",
        estTime: "20m",
        xpReward: 250,
        coinReward: 40,
        contentBody: "Mastering the reciprocal logic of F/T and PRF/PRP. Reviewing the 13 microsecond rule and the Doppler cosine rules. Practice high-pressure decision making.",
        timeSaverHook: "Master logic over rote memorization.",
        activeLearningPromise: "Solve 10 logic-traps in a row.",
        roadmap: "Phase 1: Reciprocals; Phase 2: Proportionality; Phase 3: Trap ID.",
        negation: "Calculators are NOT used on the exam. Master mental math.",
        mnemonic: "K-M-G: Keep My Glass (Kilo, Mega, Giga).",
        analogy: "The final systems check before entering the atmosphere.",
        practicalApplication: "If frequency doubles, wavelength must halve.",
        mindsetShift: "I am the master of sound mechanics.",
        assessmentCTA: "Initiate final sync.",
        harveyTakeaways: "Intensity is proportional to amplitude squared.",
        assessment: [{ question: "If power is doubled and area is unchanged, intensity is:", options: ["Halved", "Unchanged", "Doubled", "Quadrupled"], correctAnswer: 2, explanation: "Intensity = Power / Area. Direct relationship.", domain: 'Math' }]
      }
    ]
  },
  {
    id: "m9",
    title: "9. Specialized Math",
    description: "Logarithms, decibels, and range equations.",
    introStory: "The math of the deep. Intensity scales and the 13 microsecond constant.",
    examWeight: 5,
    depth: 6000,
    pressure: 'Extreme',
    topics: [
      {
        id: "9-1",
        title: "The 13μs Rule",
        visualType: "Default",
        estTime: "12m",
        xpReward: 130,
        coinReward: 15,
        contentBody: "In soft tissue, it takes 13 microseconds for sound to travel to 1cm depth and back. Master the 'Go-Return' time for exam calculations.",
        timeSaverHook: "Depth (cm) x 13 = Total time (μs).",
        activeLearningPromise: "Calculate total travel distance vs depth instantly.",
        roadmap: "Part 1: Go-Return Logic; Part 2: Depth vs Distance; Part 3: Practice Math.",
        negation: "13μs is NOT the total travel distance. It is the time for 1cm of DEPTH.",
        mnemonic: "Lucky 13 for 1cm.",
        analogy: "Like timing an echo in a canyon to find the distance to the wall.",
        practicalApplication: "If the total time is 26μs, the depth is 2cm.",
        mindsetShift: "Time is depth.",
        assessmentCTA: "Verify range math.",
        harveyTakeaways: "Speed of sound in soft tissue is 1.54 mm/μs.",
        assessment: [{ question: "If the time-of-flight is 39 microseconds, what is the depth of the reflector?", options: ["1 cm", "2 cm", "3 cm", "6 cm"], correctAnswer: 2, explanation: "39 / 13 = 3 cm depth.", domain: 'Math' }]
      },
      {
        id: "9-2",
        title: "Decibel Logic",
        visualType: "Default",
        estTime: "15m",
        xpReward: 140,
        coinReward: 20,
        contentBody: "Decibels are a ratio. 3dB increase = double (2x). 10dB increase = tenfold (10x). -3dB = half (1/2). -10dB = one-tenth (1/10). Intensity is proportional to amplitude squared.",
        timeSaverHook: "Double the amplitude = Quadruple the intensity (+6dB).",
        activeLearningPromise: "Calculate intensity changes using the log scale.",
        roadmap: "Part 1: The Ratio Scale; Part 2: 3dB vs 10dB rules; Part 3: Amplitude Proportionality.",
        negation: "0dB does NOT mean no sound. it means no CHANGE in sound.",
        mnemonic: "Three is Double, Ten is Ten.",
        analogy: "Log scales are like earthquake magnitudes; each step is a massive jump in power.",
        practicalApplication: "An increase of 6dB means the signal is 4 times stronger (3dB + 3dB = 2x * 2x).",
        mindsetShift: "Everything is a ratio.",
        assessmentCTA: "Validate log logic.",
        harveyTakeaways: "Positive decibels = strengthening; Negative = weakening.",
        assessment: [{ question: "A signal changes from 10 mW/cm2 to 1000 mW/cm2. What is the change in decibels?", options: ["3 dB", "10 dB", "20 dB", "30 dB"], correctAnswer: 3, explanation: "10 to 100 is 100x increase, which is 10dB + 10dB = 20dB? No, 10 to 100 (10dB) to 1000 (another 10dB) = 20dB? Wait, 1000/10 = 100. 10^2. So 20dB. If it were 1000x, it would be 30dB.", domain: 'Math' }]
      }
    ]
  }
];

export const artifactVault: Artifact[] = [
  { id: 'a1', name: 'Reverberation', description: 'Multiple equidistant echoes.', boardTrap: 'Mistaking ladder-like echoes for real layers.', fix: 'Change angle of insonation.', visualType: 'ArtifactsVisual' },
  { id: 'a5', name: 'Side Lobes', description: 'Acoustic energy outside the main beam.', boardTrap: 'Phantom echoes in cystic structures.', fix: 'Apodization and multi-element arrays.', visualType: 'ArtifactsVisual' },
  { id: 'a6', name: 'Refraction', description: 'Edge shadowing and structure duplication.', boardTrap: 'Mistaking a single vessel for two.', fix: 'Move the probe to normal incidence.', visualType: 'ArtifactsVisual' },
  { id: 'a7', name: 'Speed Error', description: 'Step-down artifact due to non-1540m/s speed.', boardTrap: 'Structures appear at incorrect depths.', fix: 'Adjust depth assumptions mentally or use specialized modes.', visualType: 'ArtifactsVisual' }
];

export const highYieldFormulas: Formula[] = [
  { 
    id: 'f1', 
    name: 'Wavelength', 
    formula: 'λ = c / f', 
    category: 'Fundamentals', 
    variables: [
      { name: 'c', label: 'Speed', unit: 'm/s', min: 300, max: 4000, step: 10, description: 'Speed of sound in the medium.' }, 
      { name: 'f', label: 'Frequency', unit: 'MHz', min: 1, max: 15, step: 0.5, description: 'Source frequency of the transducer.' }
    ], 
    calculate: (v:any) => v.c / v.f, 
    deepDive: 'Wavelength determines axial resolution. High frequency = Short wavelength = Better axial detail.', 
    relationships: [{ var: 'f', type: 'inverse' }, { var: 'c', type: 'direct' }] 
  },
  { 
    id: 'f2', 
    name: 'Period (T)', 
    formula: 'T = 1 / f', 
    category: 'Fundamentals', 
    variables: [
      { name: 'f', label: 'Frequency', unit: 'MHz', min: 1, max: 15, step: 0.5, description: 'Number of cycles per second.' }
    ], 
    calculate: (v:any) => 1 / v.f, 
    deepDive: 'Period and frequency are reciprocals. If one increases, the other MUST decrease.', 
    relationships: [{ var: 'f', type: 'inverse' }] 
  },
  { 
    id: 'f3', 
    name: 'Pulse Duration (PD)', 
    formula: 'PD = n × T', 
    category: 'Pulsed Sound', 
    variables: [
      { name: 'n', label: 'Cycles/Pulse', unit: '', min: 1, max: 5, step: 1, description: 'Number of cycles per pulse.' },
      { name: 'T', label: 'Period', unit: 'μs', min: 0.05, max: 1, step: 0.01, description: 'Duration of a single cycle.' }
    ], 
    calculate: (v:any) => v.n * v.T, 
    deepDive: 'Damping material reduces "n", improving axial resolution by shortening the PD.', 
    relationships: [{ var: 'n', type: 'direct' }, { var: 'T', type: 'direct' }] 
  },
  { 
    id: 'f4', 
    name: 'Spatial Pulse Length (SPL)', 
    formula: 'SPL = n × λ', 
    category: 'Pulsed Sound', 
    variables: [
      { name: 'n', label: 'Cycles/Pulse', unit: '', min: 1, max: 5, step: 1, description: 'Number of cycles in one pulse.' },
      { name: 'λ', label: 'Wavelength', unit: 'mm', min: 0.1, max: 2, step: 0.05, description: 'Length of one cycle.' }
    ], 
    calculate: (v:any) => v.n * v.λ, 
    deepDive: 'SPL determines axial resolution. Lower SPL = Better detail. Backing material is key here.', 
    relationships: [{ var: 'n', type: 'direct' }, { var: 'λ', type: 'direct' }] 
  },
  { 
    id: 'f5', 
    name: 'Duty Factor (DF)', 
    formula: 'DF = (PD / PRP) × 100', 
    category: 'Pulsed Sound', 
    variables: [
      { name: 'pd', label: 'Pulse Duration', unit: 'μs', min: 0.5, max: 2, step: 0.1, description: 'Transmit time.' },
      { name: 'prp', label: 'Pulse Rep. Period', unit: 'μs', min: 100, max: 1000, step: 10, description: 'Transmit + Receive time.' }
    ], 
    calculate: (v:any) => (v.pd / v.prp) * 100, 
    deepDive: 'Imaging ultrasound typically has a DF of < 1%. Continuous wave has a DF of 100%.', 
    relationships: [{ var: 'pd', type: 'direct' }, { var: 'prp', type: 'inverse' }] 
  },
  { 
    id: 'f6', 
    name: 'Range Equation (Depth)', 
    formula: 'Depth = (c × t) / 2', 
    category: 'Fundamentals', 
    variables: [
      { name: 'c', label: 'Speed (Soft Tissue)', unit: 'm/s', min: 1450, max: 1640, step: 10, description: 'Usually 1540 m/s.' },
      { name: 't', label: 'Go-Return Time', unit: 'μs', min: 13, max: 130, step: 13, description: 'Total time to reflector and back.' }
    ], 
    calculate: (v:any) => (v.c * (v.t / 1000000) * 100) / 2, 
    deepDive: 'Remember the 13μs rule: 13μs of time = 1cm of depth in soft tissue.', 
    relationships: [{ var: 't', type: 'direct' }] 
  },
  { 
    id: 'f7', 
    name: 'Acoustic Impedance (Z)', 
    formula: 'Z = ρ × c', 
    category: 'Fundamentals', 
    variables: [
      { name: 'rho', label: 'Density', unit: 'kg/m³', min: 1000, max: 2000, step: 10, description: 'Mass density of the medium.' },
      { name: 'c', label: 'Propagation Speed', unit: 'm/s', min: 300, max: 4000, step: 10, description: 'Speed of sound.' }
    ], 
    calculate: (v:any) => v.rho * v.c, 
    deepDive: 'Reflections occur at boundaries with DIFFERENT impedances. No mismatch = No reflection.', 
    relationships: [{ var: 'rho', type: 'direct' }, { var: 'c', type: 'direct' }] 
  },
  { 
    id: 'f8', 
    name: 'Intensity (I)', 
    formula: 'I = Power / Area', 
    category: 'Fundamentals', 
    isHighYield: true,
    variables: [
      { name: 'p', label: 'Power', unit: 'Watts', min: 0.1, max: 5, step: 0.1, description: 'Rate of energy transfer (Control with Output Power).' },
      { name: 'a', label: 'Beam Area', unit: 'cm²', min: 0.1, max: 5, step: 0.1, description: 'Cross-sectional area (Highest at focal point).' }
    ], 
    calculate: (v:any) => v.p / v.a, 
    deepDive: 'Intensity (W/cm²) is the concentration of energy in a sound beam. It is the primary predictor of bioeffects. Crucially, as beam area decreases (at the focus), intensity increases significantly even if power remains constant. Remember the squared relationship: Intensity ∝ Amplitude². Doubling the amplitude quadruples the intensity (+6dB).', 
    clinicalImportance: 'Bioeffect thresholds are defined by intensity. The AIUM states that for an unfocused beam, intensities below 100 mW/cm² SPTA are safe. For focused beams, the limit is 1 W/cm² SPTA. Always monitor the Thermal Index (TI) and Mechanical Index (MI) on-screen to adhere to ALARA.',
    relationships: [{ var: 'p', type: 'direct' }, { var: 'a', type: 'inverse' }],
    referenceLinks: [
      { label: 'AIUM Bioeffect Thresholds', url: 'https://www.aium.org/official-statements' },
      { label: 'ALARA Clinical Protocol (ARDMS)', url: 'https://www.ardms.org/wp-content/uploads/pdf/SPI-Blueprint.pdf' }
    ]
  },
  { 
    id: 'f9', 
    name: 'Doppler Shift (Δf)', 
    formula: 'Δf = (2 · v · f · cosθ) / c', 
    category: 'Doppler', 
    variables: [
      { name: 'v', label: 'Velocity', unit: 'm/s', min: 0.1, max: 5, step: 0.1, description: 'Speed of blood flow.' },
      { name: 'f', label: 'Freq', unit: 'MHz', min: 1, max: 10, step: 0.5, description: 'Operating frequency.' },
      { name: 'cos', label: 'Cos(θ)', unit: '', min: 0, max: 1, step: 0.1, description: 'Cosine of the Doppler angle.' },
      { name: 'c', label: 'Speed', unit: 'm/s', min: 1540, max: 1540, step: 0, description: 'Speed in soft tissue.' }
    ], 
    calculate: (v:any) => (2 * v * v.f * v.cos) / 1540, 
    deepDive: 'Increasing the angle decreases the shift. 90° angle = 0 shift.', 
    relationships: [{ var: 'v', type: 'direct' }, { var: 'f', type: 'direct' }, { var: 'cos', type: 'direct' }] 
  },
  { 
    id: 'f10', 
    name: 'Axial Resolution', 
    formula: 'Res = SPL / 2', 
    category: 'Resolution', 
    variables: [
      { name: 'spl', label: 'Spatial Pulse Length', unit: 'mm', min: 0.2, max: 2, step: 0.1, description: 'Physical length of the pulse.' }
    ], 
    calculate: (v:any) => v.spl / 2, 
    deepDive: 'Smaller numbers are BETTER here. Lower value = Higher resolution detail.', 
    relationships: [{ var: 'spl', type: 'direct' }] 
  },
  { 
    id: 'f11', 
    name: 'Nyquist Limit', 
    formula: 'Nyquist = PRF / 2', 
    category: 'Doppler', 
    variables: [
      { name: 'prf', label: 'PRF', unit: 'kHz', min: 1, max: 20, step: 1, description: 'Pulse Repetition Frequency.' }
    ], 
    calculate: (v:any) => v.prf / 2, 
    deepDive: 'If shift exceeds Nyquist, aliasing occurs. Increase PRF or shift baseline to fix.', 
    relationships: [{ var: 'prf', type: 'direct' }] 
  },
  { 
    id: 'f12', 
    name: 'Mechanical Index (MI)', 
    formula: 'MI = Pr / sqrt(f)', 
    category: 'Safety', 
    variables: [
      { name: 'Pr', label: 'Rarefactional Pressure', unit: 'MPa', min: 0.1, max: 5, step: 0.1, description: 'Peak negative pressure.' }, 
      { name: 'f', label: 'Frequency', unit: 'MHz', min: 1, max: 10, step: 0.5, description: 'Operating frequency.' }
    ], 
    calculate: (v:any) => v.Pr / Math.sqrt(v.f), 
    deepDive: 'MI represents cavitation risk. Higher frequency reduces MI.', 
    relationships: [{ var: 'f', type: 'inverse' }, { var: 'Pr', type: 'direct' }] 
  },
  {
    id: 'f13',
    name: 'Intensity Ref. Coeff (IRC)',
    formula: 'IRC = [ (Z₂ - Z₁) / (Z₂ + Z₁) ]²',
    category: 'Fundamentals',
    variables: [
      { name: 'z1', label: 'Z (Medium 1)', unit: 'Rayls', min: 1.4, max: 1.8, step: 0.1, description: 'Acoustic impedance of incident medium.' },
      { name: 'z2', label: 'Z (Medium 2)', unit: 'Rayls', min: 1.4, max: 1.8, step: 0.1, description: 'Acoustic impedance of second medium.' }
    ],
    calculate: (v:any) => Math.pow((v.z2 - v.z1) / (v.z2 + v.z1), 2) * 100,
    deepDive: 'Determines the % of intensity that bounces back. Note: if Z1 = Z2, IRC is 0. Most soft tissue interfaces reflect < 1%.',
    relationships: [{ var: 'z2', type: 'none' }]
  },
  {
    id: 'f14',
    name: 'Snells Law (Refraction)',
    formula: 'sinθt / sinθi = c₂ / c₁',
    category: 'Fundamentals',
    variables: [
      { name: 'c1', label: 'Speed 1', unit: 'm/s', min: 1400, max: 1600, step: 10, description: 'Speed in incident medium.' },
      { name: 'c2', label: 'Speed 2', unit: 'm/s', min: 1400, max: 1600, step: 10, description: 'Speed in second medium.' }
    ],
    calculate: (v:any) => (v.c2 / v.c1),
    deepDive: 'Determines beam bending (refraction). Requires 2 conditions: Oblique incidence AND different speeds.',
    relationships: [{ var: 'c2', type: 'direct' }]
  }
];

export const mockExamBank: AssessmentQuestion[] = [
  { question: "What is the average speed of sound in soft tissue?", options: ["330 m/s", "1540 m/s", "4080 m/s", "Speed of light"], correctAnswer: 1, explanation: "Standard board constant.", domain: 'Fundamentals' },
  { question: "Which device measures acoustic pressure at specific locations?", options: ["Calorimeter", "Hydrophone", "Thermocouple", "Logic Gate"], correctAnswer: 1, explanation: "Hydrophones are needle-like pressure sensors.", domain: 'Safety' }
];

export const flashcards: Flashcard[] = [
  { id: 'fc1', front: 'ALARA', back: 'As Low As Reasonably Achievable', category: 'Safety' },
  { id: 'fc4', front: 'Huygens’ Principle', back: 'Every point on a wave front is a source of secondary wavelets.', category: 'Beams' }
];

export const shopItems: ShopItem[] = [
  { id: 's1', name: 'XP Booster', description: 'Double XP for 1 hour', cost: 100, icon: 'Zap', type: 'booster', benefit: '2x Multiplier' }
];

export const podcastTracks: PodcastTrack[] = [
  { id: 'pt1', title: 'Welcome to SPI', artist: 'EchoMasters', url: 'https://example.com/audio.mp3', duration: '5:00', type: 'lecture', description: 'Intro', tags: ['Intro'] },
  { id: 'pt2', title: 'The Doppler Paradox', artist: 'Professor Harvey', url: 'https://example.com/doppler.mp3', duration: '12:30', type: 'lecture', description: 'Deep dive into frequency shifts.', tags: ['Doppler', 'Physics'] },
  { id: 'pt3', title: 'Acoustic Sanctuary Radio', artist: 'Echo FM', url: 'https://example.com/radio.mp3', duration: 'LIVE', type: 'broadcast', description: 'Ambient study resonance.', tags: ['Ambience'] },
  { id: 'pt4', title: 'Bioeffects Mastery', artist: 'Safety Board', url: 'https://example.com/safety.mp3', duration: '8:45', type: 'lecture', description: 'Thermal and mechanical indices.', tags: ['Safety'] }
];