import type { Language } from "@/lib/state/dojo-store";

// ─── Types ──────────────────────────────────────────────────────────────────

interface BlockT {
  title: string;
  subtitle: string;
  simpleSubtitle: string;
  phases: string;
  simplePhases: string;
  quickStart: string;
}

interface PhaseT {
  name: string;
  instruction: string;
}

export interface T {
  common: {
    appName: string;
    back: string;
    del: string;
    cancel: string;
    never: string;
    min: string;
    on: string;
    off: string;
  };
  dashboard: {
    morning: string;
    afternoon: string;
    evening: string;
    mantra: string;
    simpleMantra: string;
    todaysPractice: string;
    yourPracticeToday: string;
    simpleModeOn: string;
    blocks: { morning: BlockT; midday: BlockT; evening: BlockT };
  };
  library: {
    header: string;
    items: Record<string, { title: string; description: string }>;
  };
  journal: {
    header: string;
    placeholder: string;
    ernHeader: string;
    prompts: string[];
    tapPrompt: string;
    today: string;
    yesterday: string;
    emptyTitle: string;
    emptyBody: string;
    del: string;
    cancel: string;
    mic: {
      start: string;
      stop: string;
      listening: string;
      notSupported: string;
    };
  };
  timer: {
    blocks: { morning: string; midday: string; evening: string };
    phaseComplete: string;
    blockComplete: string;
    finished: string;
    phases: { morning: PhaseT[]; midday: PhaseT[]; evening: PhaseT[] };
    simpleInstructions: { morning: string[]; midday: string[]; evening: string[] };
  };
  settings: {
    header: string;
    sections: {
      mode: string;
      textSize: string;
      timers: string;
      streak: string;
      stats: string;
      about: string;
      data: string;
      language: string;
    };
    simpleMode: { title: string; descOn: string; descOff: string };
    textSizeLabel: string;
    blockLabels: { morning: string; midday: string; evening: string };
    streakDays: string;
    best: string;
    lastCompleted: string;
    journalEntries: string;
    blocksCompleted: string;
    version: string;
    license: string;
    philosophy: string;
    localData: string;
    exportBtn: string;
    resetBtn: string;
    resetConfirm: string;
    languageSelector: string;
  };
  glossary: {
    title: string;
    intro: string;
    simpleModeBanner: string;
    entries: Array<{ term: string; simple: string }>;
  };
  reader: {
    notFound: string;
    simpleModeOn: string;
    simpleModeHint: string;
  };
}

// ─── English ─────────────────────────────────────────────────────────────────

const en: T = {
  common: {
    appName: "Dojo",
    back: "Back",
    del: "Delete",
    cancel: "Cancel",
    never: "Never",
    min: "min",
    on: "On",
    off: "Off",
  },
  dashboard: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    mantra: "I accept what is. I calibrate what arises. The struggle itself is the meaning.",
    simpleMantra: "Accept what is. Adjust what you can. The challenge IS the meaning.",
    todaysPractice: "Today's Practice",
    yourPracticeToday: "Your Practice Today",
    simpleModeOn: "Simple Mode is on — each block shows a Quick Start guide below",
    blocks: {
      morning: {
        title: "Morning Dojo",
        subtitle: "Breathing + Mindfulness",
        simpleSubtitle: "Start your day with breathing & calm focus",
        phases: "Breathwork · Body Scan · Meditation · Journaling",
        simplePhases: "Breathe · Sit quietly · Notice your thoughts",
        quickStart: "Sit comfortably, close your eyes, and breathe slowly. When the timer starts, just follow along.",
      },
      midday: {
        title: "Midday Reset",
        subtitle: "Yoga + Mindfulness",
        simpleSubtitle: "A quick stretch and a moment of stillness",
        phases: "Gentle Yoga · Mindful Breathing · Intention Reset",
        simplePhases: "Stretch · Breathe · Reset your focus",
        quickStart: "Stand up, do a few gentle stretches, then sit and take 5 slow breaths. That's it.",
      },
      evening: {
        title: "Evening Mastery",
        subtitle: "Tai Chi + Kata + Breathing",
        simpleSubtitle: "Wind down with movement and deep breathing",
        phases: "Tai Chi Flow · Kata Practice · Cool Down Breathwork",
        simplePhases: "Slow movement · Deep breaths · Wind down",
        quickStart: "Move slowly like you're in water. Then breathe out longer than you breathe in. Feel yourself slow down.",
      },
    },
  },
  library: {
    header: "Library",
    items: {
      acc_paper: { title: "ACC Paper", description: "The neuroscience of error detection and mental calibration" },
      ledger: { title: "V3.0 Ledger", description: "Complete daily protocol overview" },
      ptsd: { title: "PTSD & Population Mapping", description: "Applications for veterans, inmates, and space" },
      mantra: { title: "Daily Mantra", description: "Your guiding principle and its meaning" },
      manual: { title: "How + Why Manual", description: "Practical guide to the Dojo method" },
      glossary: { title: "Glossary", description: "Plain-English definitions: ACC, ERN, HOS, and more" },
    },
  },
  journal: {
    header: "Journal",
    placeholder: "What arose? Name it. Accept it.",
    ernHeader: "ERN Reflection Prompts",
    prompts: [
      "What arose? Name it. Accept it. Breathe longer on exhale.",
      "What error signal did you notice? How did you respond?",
      "What triggered your reaction? Can you observe it without judgment?",
      "Where did you feel the signal in your body?",
    ],
    tapPrompt: "Tap to see another prompt",
    today: "Today",
    yesterday: "Yesterday",
    emptyTitle: "No journal entries yet.",
    emptyBody: "Start by logging what arises.",
    del: "Delete",
    cancel: "Cancel",
    mic: {
      start: "Speak to journal",
      stop: "Stop recording",
      listening: "Listening…",
      notSupported: "Voice input is not supported in this browser.",
    },
  },
  timer: {
    blocks: { morning: "Morning Block", midday: "Midday Block", evening: "Evening Block" },
    phaseComplete: "Phase Complete",
    blockComplete: "Block Complete!",
    finished: "finished",
    phases: {
      morning: [
        { name: "Breathing Exercise", instruction: "Focus on exhale-dominant breathing. Longer exhale than inhale." },
        { name: "Mindfulness + ERN Acceptance", instruction: "What arose? Name it. Accept it. Breathe longer on exhale." },
      ],
      midday: [
        { name: "Yoga Reset", instruction: "Gentle movements to reset your body and mind." },
        { name: "Post-Lunch Mindfulness", instruction: "Settle into stillness. Observe without judgment." },
      ],
      evening: [
        { name: "Tai Chi Warm-Up", instruction: "Slow, flowing movements. Connect breath to motion." },
        { name: "Kata Practice", instruction: "Precise, deliberate forms. Embody the practice." },
        { name: "Breathing Cool-Down", instruction: "Wind down with deep, calming breaths." },
      ],
    },
    simpleInstructions: {
      morning: [
        "Breathe in slowly, then out even slower. Just focus on your breath.",
        "Notice any thoughts or feelings without judging them. Just watch them pass.",
      ],
      midday: [
        "Move gently — a few stretches are perfect. No right or wrong here.",
        "Sit quietly and take slow, easy breaths. Let your mind rest.",
      ],
      evening: [
        "Move slowly like you're under water. Feel your body.",
        "Practice your movements carefully and calmly. No rush.",
        "Breathe out longer than you breathe in. Feel yourself wind down.",
      ],
    },
  },
  settings: {
    header: "Settings",
    sections: { mode: "Mode", textSize: "Text Size", timers: "Block Timers", streak: "Streak", stats: "Stats", about: "About", data: "Data", language: "Language" },
    simpleMode: { title: "Simple Mode", descOn: "On — beginner-friendly view enabled", descOff: "Off — tap to show gentle guides & shorter text" },
    textSizeLabel: "Font Size",
    blockLabels: { morning: "Morning Dojo", midday: "Midday Reset", evening: "Evening Mastery" },
    streakDays: "day streak",
    best: "Best",
    lastCompleted: "Last completed",
    journalEntries: "Journal Entries",
    blocksCompleted: "Blocks Completed",
    version: "Version 1.0.0",
    license: "License: MIT — Open Source",
    philosophy: "No accounts. No tracking. No ads. No cloud.",
    localData: "All data stored locally on your device.",
    exportBtn: "Export Journal",
    resetBtn: "Reset All Data",
    resetConfirm: "Tap again to confirm",
    languageSelector: "App Language",
  },
  glossary: {
    title: "Glossary & Terminology",
    intro: "Plain-language definitions for every term used in Dojo. No prior knowledge needed.",
    simpleModeBanner: "Simple Mode — showing beginner-friendly definitions",
    entries: [
      { term: "ACC (Anterior Cingulate Cortex)", simple: "A part of your brain that acts like a quality-control sensor — it notices when something goes wrong and signals you to adjust." },
      { term: "ERN (Error-Related Negativity)", simple: "A tiny brain signal that fires within a tenth of a second after you make a mistake — before you even know you made one." },
      { term: "SERP (Stress–Error–Response Pattern)", simple: "The loop your brain runs when stress causes mistakes, and mistakes cause more stress — Dojo breaks this cycle." },
      { term: "Archimedes Point", simple: "A moment of clear perspective where you can see your situation from outside the chaos — like stepping back to get the full picture." },
      { term: "HOS (High-Output State)", simple: "The mental zone where focus is sharp, reactions are calm, and you perform at your best — the goal Dojo training builds toward." },
      { term: "R_ACC (Regulated Anterior Cingulate Cortex)", simple: "A well-trained version of your brain's error sensor — calm enough to work clearly, sharp enough to catch real mistakes." },
      { term: "N-Version Programming", simple: "Running multiple independent versions of the same task so that one mistake doesn't sink the whole system — applied to the brain, it means building multiple mental strategies for resilience." },
      { term: "Byzantine Fault Tolerance", simple: "The ability of a system to keep working correctly even when some of its parts are sending wrong or contradictory signals — in Dojo terms, staying functional when your emotions are unreliable." },
      { term: '"The struggle itself is the meaning"', simple: "The difficulties you face aren't getting in the way of a meaningful life — they ARE the meaningful life. The challenge is the point." },
    ],
  },
  reader: {
    notFound: "Content not found",
    simpleModeOn: "Simple Mode — showing beginner-friendly definitions",
    simpleModeHint: "Tap off Simple Mode in Settings to read the full section",
  },
};

// ─── Spanish ─────────────────────────────────────────────────────────────────

const es: T = {
  common: { appName: "Dojo", back: "Volver", del: "Eliminar", cancel: "Cancelar", never: "Nunca", min: "min", on: "Activado", off: "Desactivado" },
  dashboard: {
    morning: "Buenos días",
    afternoon: "Buenas tardes",
    evening: "Buenas noches",
    mantra: "Acepto lo que es. Calibro lo que surge. La lucha en sí misma es el significado.",
    simpleMantra: "Acepta lo que es. Ajusta lo que puedas. El desafío ES el significado.",
    todaysPractice: "Práctica de Hoy",
    yourPracticeToday: "Tu Práctica Hoy",
    simpleModeOn: "Modo Simple activado — cada bloque muestra una guía de inicio rápido",
    blocks: {
      morning: { title: "Dojo Matinal", subtitle: "Respiración + Atención Plena", simpleSubtitle: "Comienza tu día con respiración y calma", phases: "Respiración · Escaneo Corporal · Meditación · Diario", simplePhases: "Respira · Siéntate tranquilo · Observa tus pensamientos", quickStart: "Siéntate cómodamente, cierra los ojos y respira lentamente. Cuando empiece el temporizador, solo sigue el ritmo." },
      midday: { title: "Reinicio del Mediodía", subtitle: "Yoga + Atención Plena", simpleSubtitle: "Un estiramiento rápido y un momento de quietud", phases: "Yoga Suave · Respiración Consciente · Reinicio de Intención", simplePhases: "Estira · Respira · Reinicia tu enfoque", quickStart: "Levántate, haz unos estiramientos suaves, luego siéntate y toma 5 respiraciones lentas. Eso es todo." },
      evening: { title: "Maestría Nocturna", subtitle: "Tai Chi + Kata + Respiración", simpleSubtitle: "Relájate con movimiento y respiración profunda", phases: "Flujo de Tai Chi · Práctica de Kata · Respiración de Enfriamiento", simplePhases: "Movimiento lento · Respiraciones profundas · Relájate", quickStart: "Muévete lentamente como si estuvieras en el agua. Luego exhala más tiempo del que inhales. Siéntete desacelerar." },
    },
  },
  library: {
    header: "Biblioteca",
    items: {
      acc_paper: { title: "Artículo ACC", description: "La neurociencia de la detección de errores y la calibración mental" },
      ledger: { title: "Registro V3.0", description: "Descripción completa del protocolo diario" },
      ptsd: { title: "PTSD y Mapeo de Población", description: "Aplicaciones para veteranos, reclusos y el espacio" },
      mantra: { title: "Mantra Diario", description: "Tu principio guía y su significado" },
      manual: { title: "Manual Cómo + Por Qué", description: "Guía práctica del método Dojo" },
      glossary: { title: "Glosario", description: "Definiciones en lenguaje sencillo: ACC, ERN, HOS y más" },
    },
  },
  journal: {
    header: "Diario",
    placeholder: "¿Qué surgió? Nómbralo. Acéptalo.",
    ernHeader: "Indicaciones de Reflexión ERN",
    prompts: [
      "¿Qué surgió? Nómbralo. Acéptalo. Exhala más lento.",
      "¿Qué señal de error notaste? ¿Cómo respondiste?",
      "¿Qué desencadenó tu reacción? ¿Puedes observarlo sin juzgar?",
      "¿Dónde sentiste la señal en tu cuerpo?",
    ],
    tapPrompt: "Toca para ver otra indicación",
    today: "Hoy",
    yesterday: "Ayer",
    emptyTitle: "Aún no hay entradas en el diario.",
    emptyBody: "Empieza registrando lo que surge.",
    del: "Eliminar",
    cancel: "Cancelar",
    mic: { start: "Habla para escribir", stop: "Detener grabación", listening: "Escuchando…", notSupported: "La entrada de voz no es compatible con este navegador." },
  },
  timer: {
    blocks: { morning: "Bloque Matinal", midday: "Bloque del Mediodía", evening: "Bloque Nocturno" },
    phaseComplete: "Fase Completa",
    blockComplete: "¡Bloque Completado!",
    finished: "terminado",
    phases: {
      morning: [
        { name: "Ejercicio de Respiración", instruction: "Concéntrate en la respiración con exhalación predominante. Exhala más de lo que inhala." },
        { name: "Atención Plena + Aceptación ERN", instruction: "¿Qué surgió? Nómbralo. Acéptalo. Exhala más lentamente." },
      ],
      midday: [
        { name: "Reinicio de Yoga", instruction: "Movimientos suaves para restablecer tu cuerpo y mente." },
        { name: "Atención Plena Post-Almuerzo", instruction: "Acomódate en la quietud. Observa sin juzgar." },
      ],
      evening: [
        { name: "Calentamiento de Tai Chi", instruction: "Movimientos lentos y fluidos. Conecta la respiración con el movimiento." },
        { name: "Práctica de Kata", instruction: "Formas precisas y deliberadas. Encarna la práctica." },
        { name: "Enfriamiento Respiratorio", instruction: "Relájate con respiraciones profundas y calmantes." },
      ],
    },
    simpleInstructions: {
      morning: ["Inhala lentamente, luego exhala aún más despacio. Solo enfócate en tu respiración.", "Observa cualquier pensamiento o sentimiento sin juzgarlos. Solo déjalos pasar."],
      midday: ["Muévete suavemente — unos pocos estiramientos son perfectos. Sin reglas.", "Siéntate tranquilo y toma respiraciones lentas y fáciles. Deja que tu mente descanse."],
      evening: ["Muévete lentamente como si estuvieras bajo el agua. Siente tu cuerpo.", "Practica tus movimientos con calma y cuidado. Sin prisa.", "Exhala más tiempo del que inhales. Siéntete desacelerar."],
    },
  },
  settings: {
    header: "Ajustes",
    sections: { mode: "Modo", textSize: "Tamaño de Texto", timers: "Temporizadores", streak: "Racha", stats: "Estadísticas", about: "Acerca de", data: "Datos", language: "Idioma" },
    simpleMode: { title: "Modo Simple", descOn: "Activado — vista amigable para principiantes", descOff: "Desactivado — toca para mostrar guías y texto más corto" },
    textSizeLabel: "Tamaño de Fuente",
    blockLabels: { morning: "Dojo Matinal", midday: "Reinicio del Mediodía", evening: "Maestría Nocturna" },
    streakDays: "días de racha",
    best: "Mejor",
    lastCompleted: "Última vez completado",
    journalEntries: "Entradas del Diario",
    blocksCompleted: "Bloques Completados",
    version: "Versión 1.0.0",
    license: "Licencia: MIT — Código Abierto",
    philosophy: "Sin cuentas. Sin seguimiento. Sin anuncios. Sin nube.",
    localData: "Todos los datos se guardan localmente en tu dispositivo.",
    exportBtn: "Exportar Diario",
    resetBtn: "Restablecer Datos",
    resetConfirm: "Toca de nuevo para confirmar",
    languageSelector: "Idioma de la App",
  },
  glossary: {
    title: "Glosario y Terminología",
    intro: "Definiciones en lenguaje sencillo para cada término usado en Dojo. Sin conocimiento previo necesario.",
    simpleModeBanner: "Modo Simple — mostrando definiciones para principiantes",
    entries: [
      { term: "ACC (Corteza Cingulada Anterior)", simple: "Una parte de tu cerebro que actúa como un sensor de control de calidad — nota cuando algo va mal y te señala que te ajustes." },
      { term: "ERN (Negatividad Relacionada con Errores)", simple: "Una pequeña señal cerebral que se activa en una décima de segundo después de cometer un error — antes de que lo notes conscientemente." },
      { term: "SERP (Patrón Estrés–Error–Respuesta)", simple: "El bucle que ejecuta tu cerebro cuando el estrés causa errores, y los errores causan más estrés — Dojo rompe este ciclo." },
      { term: "Punto de Arquímedes", simple: "Un momento de perspectiva clara donde puedes ver tu situación desde fuera del caos — como dar un paso atrás para ver el panorama completo." },
      { term: "HOS (Estado de Alto Rendimiento)", simple: "La zona mental donde el enfoque es agudo, las reacciones son calmadas y rindes al máximo — el objetivo hacia el que apunta el entrenamiento Dojo." },
      { term: "R_ACC (Corteza Cingulada Anterior Regulada)", simple: "Una versión bien entrenada del sensor de errores de tu cerebro — suficientemente calmada para funcionar con claridad, lo suficientemente aguda para detectar errores reales." },
      { term: "Programación N-Version", simple: "Ejecutar múltiples versiones independientes de la misma tarea para que un error no hunda el sistema — aplicado al cerebro, significa construir múltiples estrategias mentales para la resiliencia." },
      { term: "Tolerancia a Fallos Bizantinos", simple: "La capacidad de un sistema para seguir funcionando correctamente incluso cuando algunas de sus partes envían señales incorrectas — en términos de Dojo, mantenerse funcional cuando tus emociones son poco fiables." },
      { term: '"La lucha en sí misma es el significado"', simple: "Las dificultades que enfrentas no están obstaculizando una vida significativa — ELLAS SON la vida significativa. El desafío es el punto." },
    ],
  },
  reader: { notFound: "Contenido no encontrado", simpleModeOn: "Modo Simple — mostrando definiciones para principiantes", simpleModeHint: "Desactiva el Modo Simple en Ajustes para leer la sección completa" },
};

// ─── French ──────────────────────────────────────────────────────────────────

const fr: T = {
  common: { appName: "Dojo", back: "Retour", del: "Supprimer", cancel: "Annuler", never: "Jamais", min: "min", on: "Activé", off: "Désactivé" },
  dashboard: {
    morning: "Bonjour",
    afternoon: "Bon après-midi",
    evening: "Bonsoir",
    mantra: "J'accepte ce qui est. Je calibre ce qui surgit. La lutte elle-même est le sens.",
    simpleMantra: "Acceptez ce qui est. Ajustez ce que vous pouvez. Le défi EST le sens.",
    todaysPractice: "Pratique du Jour",
    yourPracticeToday: "Votre Pratique Aujourd'hui",
    simpleModeOn: "Mode Simple activé — chaque bloc affiche un guide de démarrage rapide",
    blocks: {
      morning: { title: "Dojo du Matin", subtitle: "Respiration + Pleine Conscience", simpleSubtitle: "Commencez votre journée avec respiration et calme", phases: "Respiration · Scan Corporel · Méditation · Journal", simplePhases: "Respirez · Asseyez-vous tranquillement · Observez vos pensées", quickStart: "Asseyez-vous confortablement, fermez les yeux et respirez lentement. Quand le minuteur démarre, suivez simplement." },
      midday: { title: "Réinitialisation de Midi", subtitle: "Yoga + Pleine Conscience", simpleSubtitle: "Un étirement rapide et un moment de calme", phases: "Yoga Doux · Respiration Consciente · Réinitialisation d'Intention", simplePhases: "Étirez · Respirez · Réinitialisez votre focus", quickStart: "Levez-vous, faites quelques étirements doux, puis asseyez-vous et prenez 5 respirations lentes. C'est tout." },
      evening: { title: "Maîtrise du Soir", subtitle: "Tai Chi + Kata + Respiration", simpleSubtitle: "Décompressez avec mouvement et respiration profonde", phases: "Flux de Tai Chi · Pratique de Kata · Respiration de Récupération", simplePhases: "Mouvement lent · Respirations profondes · Décompressez", quickStart: "Bougez lentement comme si vous étiez dans l'eau. Expirez plus longtemps que vous n'inspirez. Sentez-vous ralentir." },
    },
  },
  library: {
    header: "Bibliothèque",
    items: {
      acc_paper: { title: "Article ACC", description: "La neuroscience de la détection d'erreurs et de la calibration mentale" },
      ledger: { title: "Registre V3.0", description: "Présentation complète du protocole quotidien" },
      ptsd: { title: "TSPT et Cartographie des Populations", description: "Applications pour les vétérans, détenus et l'espace" },
      mantra: { title: "Mantra Quotidien", description: "Votre principe directeur et sa signification" },
      manual: { title: "Manuel Comment + Pourquoi", description: "Guide pratique de la méthode Dojo" },
      glossary: { title: "Glossaire", description: "Définitions en langage clair : ACC, ERN, HOS et plus" },
    },
  },
  journal: {
    header: "Journal",
    placeholder: "Qu'est-il survenu ? Nommez-le. Acceptez-le.",
    ernHeader: "Invites de Réflexion ERN",
    prompts: [
      "Qu'est-il survenu ? Nommez-le. Acceptez-le. Expirez plus longuement.",
      "Quel signal d'erreur avez-vous remarqué ? Comment avez-vous répondu ?",
      "Qu'est-ce qui a déclenché votre réaction ? Pouvez-vous l'observer sans jugement ?",
      "Où avez-vous ressenti le signal dans votre corps ?",
    ],
    tapPrompt: "Tapez pour voir une autre invite",
    today: "Aujourd'hui",
    yesterday: "Hier",
    emptyTitle: "Pas encore d'entrées de journal.",
    emptyBody: "Commencez par noter ce qui surgit.",
    del: "Supprimer",
    cancel: "Annuler",
    mic: { start: "Parler pour écrire", stop: "Arrêter l'enregistrement", listening: "En écoute…", notSupported: "La saisie vocale n'est pas prise en charge dans ce navigateur." },
  },
  timer: {
    blocks: { morning: "Bloc du Matin", midday: "Bloc de Midi", evening: "Bloc du Soir" },
    phaseComplete: "Phase Terminée",
    blockComplete: "Bloc Terminé !",
    finished: "terminé",
    phases: {
      morning: [
        { name: "Exercice de Respiration", instruction: "Concentrez-vous sur la respiration à expiration dominante. Expirez plus longtemps qu'inspirez." },
        { name: "Pleine Conscience + Acceptation ERN", instruction: "Qu'est-il survenu ? Nommez-le. Acceptez-le. Expirez plus longuement." },
      ],
      midday: [
        { name: "Réinitialisation Yoga", instruction: "Mouvements doux pour réinitialiser votre corps et votre esprit." },
        { name: "Pleine Conscience Post-Déjeuner", instruction: "Installez-vous dans le calme. Observez sans jugement." },
      ],
      evening: [
        { name: "Échauffement Tai Chi", instruction: "Mouvements lents et fluides. Connectez la respiration au mouvement." },
        { name: "Pratique de Kata", instruction: "Formes précises et délibérées. Incarnez la pratique." },
        { name: "Respiration de Récupération", instruction: "Décompressez avec des respirations profondes et apaisantes." },
      ],
    },
    simpleInstructions: {
      morning: ["Inspirez lentement, puis expirez encore plus lentement. Concentrez-vous juste sur votre souffle.", "Observez les pensées ou sentiments sans les juger. Laissez-les simplement passer."],
      midday: ["Bougez doucement — quelques étirements sont parfaits. Pas de bonne ou mauvaise façon.", "Asseyez-vous tranquillement et prenez des respirations lentes et faciles. Laissez votre esprit se reposer."],
      evening: ["Bougez lentement comme si vous étiez sous l'eau. Sentez votre corps.", "Pratiquez vos mouvements soigneusement et calmement. Sans hâte.", "Expirez plus longtemps que vous n'inspirez. Sentez-vous ralentir."],
    },
  },
  settings: {
    header: "Paramètres",
    sections: { mode: "Mode", textSize: "Taille du Texte", timers: "Minuteries", streak: "Série", stats: "Statistiques", about: "À Propos", data: "Données", language: "Langue" },
    simpleMode: { title: "Mode Simple", descOn: "Activé — vue conviviale pour débutants", descOff: "Désactivé — appuyez pour afficher des guides doux" },
    textSizeLabel: "Taille de la Police",
    blockLabels: { morning: "Dojo du Matin", midday: "Réinitialisation de Midi", evening: "Maîtrise du Soir" },
    streakDays: "jours de série",
    best: "Meilleur",
    lastCompleted: "Dernière complétion",
    journalEntries: "Entrées du Journal",
    blocksCompleted: "Blocs Terminés",
    version: "Version 1.0.0",
    license: "Licence : MIT — Open Source",
    philosophy: "Pas de comptes. Pas de suivi. Pas de pubs. Pas de cloud.",
    localData: "Toutes les données sont stockées localement sur votre appareil.",
    exportBtn: "Exporter le Journal",
    resetBtn: "Réinitialiser les Données",
    resetConfirm: "Appuyez encore pour confirmer",
    languageSelector: "Langue de l'App",
  },
  glossary: {
    title: "Glossaire et Terminologie",
    intro: "Définitions en langage clair pour chaque terme utilisé dans Dojo. Aucune connaissance préalable nécessaire.",
    simpleModeBanner: "Mode Simple — définitions pour débutants affichées",
    entries: [
      { term: "ACC (Cortex Cingulaire Antérieur)", simple: "Une partie de votre cerveau qui agit comme un capteur de contrôle qualité — il détecte quand quelque chose va mal et vous signale de vous ajuster." },
      { term: "ERN (Négativité Liée aux Erreurs)", simple: "Un minuscule signal cérébral qui se déclenche en un dixième de seconde après une erreur — avant même que vous en ayez conscience." },
      { term: "SERP (Modèle Stress–Erreur–Réponse)", simple: "La boucle que fait votre cerveau quand le stress cause des erreurs, et les erreurs causent plus de stress — Dojo brise ce cycle." },
      { term: "Point d'Archimède", simple: "Un moment de perspective claire où vous pouvez voir votre situation de l'extérieur du chaos — comme reculer pour avoir une vue d'ensemble." },
      { term: "HOS (État de Haute Performance)", simple: "La zone mentale où la concentration est aiguisée, les réactions sont calmes et vous performez au mieux — l'objectif vers lequel l'entraînement Dojo vous mène." },
      { term: "R_ACC (Cortex Cingulaire Antérieur Régulé)", simple: "Une version bien entraînée du capteur d'erreurs de votre cerveau — assez calme pour fonctionner clairement, assez précis pour détecter les vraies erreurs." },
      { term: "Programmation N-Version", simple: "Exécuter plusieurs versions indépendantes de la même tâche pour qu'une erreur ne coule pas tout le système — appliqué au cerveau, cela signifie construire plusieurs stratégies mentales pour la résilience." },
      { term: "Tolérance aux Pannes Byzantines", simple: "La capacité d'un système à continuer de fonctionner correctement même quand certaines parties envoient des signaux erronés — en termes Dojo, rester fonctionnel quand vos émotions sont peu fiables." },
      { term: '"La lutte elle-même est le sens"', simple: "Les difficultés que vous rencontrez n'empêchent pas une vie significative — ELLES SONT la vie significative. Le défi est le but." },
    ],
  },
  reader: { notFound: "Contenu introuvable", simpleModeOn: "Mode Simple — définitions pour débutants affichées", simpleModeHint: "Désactivez le Mode Simple dans Paramètres pour lire la section complète" },
};

// ─── German ───────────────────────────────────────────────────────────────────

const de: T = {
  common: { appName: "Dojo", back: "Zurück", del: "Löschen", cancel: "Abbrechen", never: "Nie", min: "Min", on: "Ein", off: "Aus" },
  dashboard: {
    morning: "Guten Morgen",
    afternoon: "Guten Tag",
    evening: "Guten Abend",
    mantra: "Ich akzeptiere, was ist. Ich kalibriere, was entsteht. Der Kampf selbst ist der Sinn.",
    simpleMantra: "Akzeptiere was ist. Passe an, was du kannst. Die Herausforderung IST der Sinn.",
    todaysPractice: "Heutige Praxis",
    yourPracticeToday: "Deine Praxis Heute",
    simpleModeOn: "Einfachmodus aktiv — jeder Block zeigt eine Schnellstart-Anleitung",
    blocks: {
      morning: { title: "Morgen-Dojo", subtitle: "Atemübungen + Achtsamkeit", simpleSubtitle: "Starte deinen Tag mit Atmung und Ruhe", phases: "Atemarbeit · Körperscan · Meditation · Tagebuch", simplePhases: "Atmen · Ruhig sitzen · Gedanken beobachten", quickStart: "Setz dich bequem hin, schließe die Augen und atme langsam. Wenn der Timer startet, folge einfach mit." },
      midday: { title: "Mittags-Reset", subtitle: "Yoga + Achtsamkeit", simpleSubtitle: "Eine kurze Dehnung und ein Moment der Stille", phases: "Sanftes Yoga · Achtsames Atmen · Intentions-Reset", simplePhases: "Dehnen · Atmen · Fokus zurücksetzen", quickStart: "Steh auf, mache ein paar sanfte Dehnungen, dann setz dich und nimm 5 langsame Atemzüge. Das ist alles." },
      evening: { title: "Abend-Meisterschaft", subtitle: "Tai Chi + Kata + Atmung", simpleSubtitle: "Entspanne mit Bewegung und tiefem Atmen", phases: "Tai Chi Fluss · Kata-Übung · Abkühlungs-Atmung", simplePhases: "Langsame Bewegung · Tiefe Atemzüge · Entspannen", quickStart: "Bewege dich langsam wie im Wasser. Atme dann länger aus als ein. Spüre, wie du langsamer wirst." },
    },
  },
  library: {
    header: "Bibliothek",
    items: {
      acc_paper: { title: "ACC-Artikel", description: "Die Neurowissenschaft der Fehlererkennung und mentalen Kalibrierung" },
      ledger: { title: "Protokoll V3.0", description: "Vollständige Übersicht des täglichen Protokolls" },
      ptsd: { title: "PTSD & Bevölkerungsanalyse", description: "Anwendungen für Veteranen, Gefangene und den Weltraum" },
      mantra: { title: "Tägliches Mantra", description: "Dein Leitprinzip und seine Bedeutung" },
      manual: { title: "Wie + Warum Handbuch", description: "Praktischer Leitfaden zur Dojo-Methode" },
      glossary: { title: "Glossar", description: "Klare Definitionen: ACC, ERN, HOS und mehr" },
    },
  },
  journal: {
    header: "Tagebuch",
    placeholder: "Was ist aufgetaucht? Benenne es. Akzeptiere es.",
    ernHeader: "ERN-Reflexionsimpulse",
    prompts: [
      "Was ist aufgetaucht? Benenne es. Akzeptiere es. Atme länger aus.",
      "Welches Fehlersignal hast du bemerkt? Wie hast du reagiert?",
      "Was hat deine Reaktion ausgelöst? Kannst du es ohne Urteil beobachten?",
      "Wo hast du das Signal in deinem Körper gespürt?",
    ],
    tapPrompt: "Tippe für einen anderen Impuls",
    today: "Heute",
    yesterday: "Gestern",
    emptyTitle: "Noch keine Tagebucheinträge.",
    emptyBody: "Beginne damit, aufzuzeichnen, was auftaucht.",
    del: "Löschen",
    cancel: "Abbrechen",
    mic: { start: "Sprechen zum Schreiben", stop: "Aufnahme stoppen", listening: "Höre zu…", notSupported: "Spracheingabe wird in diesem Browser nicht unterstützt." },
  },
  timer: {
    blocks: { morning: "Morgen-Block", midday: "Mittags-Block", evening: "Abend-Block" },
    phaseComplete: "Phase Abgeschlossen",
    blockComplete: "Block Abgeschlossen!",
    finished: "abgeschlossen",
    phases: {
      morning: [
        { name: "Atemübung", instruction: "Konzentriere dich auf ausatmungsdominantes Atmen. Längere Ausatmung als Einatmung." },
        { name: "Achtsamkeit + ERN-Akzeptanz", instruction: "Was ist aufgetaucht? Benenne es. Akzeptiere es. Atme länger aus." },
      ],
      midday: [
        { name: "Yoga-Reset", instruction: "Sanfte Bewegungen, um Körper und Geist zurückzusetzen." },
        { name: "Mittagsachtsamkeit", instruction: "Lass dich in der Stille nieder. Beobachte ohne Urteil." },
      ],
      evening: [
        { name: "Tai Chi Aufwärmen", instruction: "Langsame, fließende Bewegungen. Verbinde Atem und Bewegung." },
        { name: "Kata-Übung", instruction: "Präzise, bewusste Formen. Verkörpere die Praxis." },
        { name: "Abkühlungs-Atmung", instruction: "Entspanne mit tiefen, beruhigenden Atemzügen." },
      ],
    },
    simpleInstructions: {
      morning: ["Atme langsam ein, dann noch langsamer aus. Konzentriere dich nur auf deinen Atem.", "Beobachte Gedanken oder Gefühle ohne sie zu beurteilen. Lass sie einfach vorbeiziehen."],
      midday: ["Bewege dich sanft — ein paar Dehnungen sind perfekt. Kein Richtig oder Falsch.", "Sitz ruhig da und nimm langsame, leichte Atemzüge. Lass deinen Geist ruhen."],
      evening: ["Bewege dich langsam wie unter Wasser. Spüre deinen Körper.", "Übe deine Bewegungen sorgfältig und ruhig. Kein Eile.", "Atme länger aus als ein. Spüre, wie du langsamer wirst."],
    },
  },
  settings: {
    header: "Einstellungen",
    sections: { mode: "Modus", textSize: "Textgröße", timers: "Block-Timer", streak: "Serie", stats: "Statistiken", about: "Über", data: "Daten", language: "Sprache" },
    simpleMode: { title: "Einfachmodus", descOn: "Ein — anfängerfreundliche Ansicht aktiv", descOff: "Aus — tippe für sanfte Anleitungen & kürzeren Text" },
    textSizeLabel: "Schriftgröße",
    blockLabels: { morning: "Morgen-Dojo", midday: "Mittags-Reset", evening: "Abend-Meisterschaft" },
    streakDays: "Tage Serie",
    best: "Beste",
    lastCompleted: "Zuletzt abgeschlossen",
    journalEntries: "Tagebucheinträge",
    blocksCompleted: "Abgeschlossene Blöcke",
    version: "Version 1.0.0",
    license: "Lizenz: MIT — Open Source",
    philosophy: "Keine Konten. Kein Tracking. Keine Werbung. Keine Cloud.",
    localData: "Alle Daten werden lokal auf deinem Gerät gespeichert.",
    exportBtn: "Tagebuch Exportieren",
    resetBtn: "Alle Daten Zurücksetzen",
    resetConfirm: "Erneut tippen zur Bestätigung",
    languageSelector: "App-Sprache",
  },
  glossary: {
    title: "Glossar & Terminologie",
    intro: "Klare Definitionen für jeden in Dojo verwendeten Begriff. Kein Vorwissen nötig.",
    simpleModeBanner: "Einfachmodus — anfängerfreundliche Definitionen werden angezeigt",
    entries: [
      { term: "ACC (Anteriorer Zingulärer Kortex)", simple: "Ein Teil deines Gehirns, der wie ein Qualitätskontrollsensor wirkt — er bemerkt, wenn etwas schiefgeht, und signalisiert dir, dich anzupassen." },
      { term: "ERN (Fehlernegativity)", simple: "Ein winziges Gehirnsignal, das innerhalb einer Zehntelsekunde nach einem Fehler ausgelöst wird — bevor du es bewusst bemerkst." },
      { term: "SERP (Stress–Fehler–Reaktionsmuster)", simple: "Die Schleife, die dein Gehirn ausführt, wenn Stress Fehler verursacht und Fehler mehr Stress erzeugen — Dojo durchbricht diesen Zyklus." },
      { term: "Archimedes-Punkt", simple: "Ein Moment klarer Perspektive, von dem aus du deine Situation außerhalb des Chaos sehen kannst — wie einen Schritt zurücktreten, um das große Ganze zu sehen." },
      { term: "HOS (Hochleistungszustand)", simple: "Die mentale Zone, in der die Konzentration scharf ist, Reaktionen ruhig sind und du deine beste Leistung bringst — das Ziel, auf das das Dojo-Training hinarbeitet." },
      { term: "R_ACC (Regulierter Anteriorer Zingulärer Kortex)", simple: "Eine gut trainierte Version des Fehlersensors deines Gehirns — ruhig genug für klares Arbeiten, präzise genug für echte Fehler." },
      { term: "N-Versions-Programmierung", simple: "Mehrere unabhängige Versionen derselben Aufgabe ausführen, damit ein Fehler das System nicht zum Absturz bringt — auf das Gehirn angewandt bedeutet es, mehrere mentale Strategien für Resilienz aufzubauen." },
      { term: "Byzantinische Fehlertoleranz", simple: "Die Fähigkeit eines Systems, korrekt zu funktionieren, selbst wenn einige Teile falsche Signale senden — in Dojo-Begriffen: funktionsfähig bleiben, wenn die eigenen Emotionen unzuverlässig sind." },
      { term: '"Der Kampf selbst ist der Sinn"', simple: "Die Schwierigkeiten, mit denen du konfrontiert bist, stehen einem bedeutungsvollen Leben nicht im Weg — SIE SIND das bedeutungsvolle Leben. Die Herausforderung ist der Punkt." },
    ],
  },
  reader: { notFound: "Inhalt nicht gefunden", simpleModeOn: "Einfachmodus — anfängerfreundliche Definitionen", simpleModeHint: "Schalte den Einfachmodus in den Einstellungen aus, um den vollständigen Abschnitt zu lesen" },
};

// ─── Portuguese ───────────────────────────────────────────────────────────────

const pt: T = {
  common: { appName: "Dojo", back: "Voltar", del: "Excluir", cancel: "Cancelar", never: "Nunca", min: "min", on: "Ativado", off: "Desativado" },
  dashboard: {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    mantra: "Aceito o que é. Calibro o que surge. A luta em si mesma é o significado.",
    simpleMantra: "Aceite o que é. Ajuste o que puder. O desafio É o significado.",
    todaysPractice: "Prática de Hoje",
    yourPracticeToday: "Sua Prática Hoje",
    simpleModeOn: "Modo Simples ativado — cada bloco mostra um guia de início rápido",
    blocks: {
      morning: { title: "Dojo Matinal", subtitle: "Respiração + Atenção Plena", simpleSubtitle: "Comece seu dia com respiração e foco calmo", phases: "Respiração · Escaneamento Corporal · Meditação · Diário", simplePhases: "Respire · Sente-se tranquilo · Observe seus pensamentos", quickStart: "Sente-se confortavelmente, feche os olhos e respire lentamente. Quando o temporizador começar, apenas acompanhe." },
      midday: { title: "Reinicialização do Meio-dia", subtitle: "Yoga + Atenção Plena", simpleSubtitle: "Um rápido alongamento e um momento de quietude", phases: "Yoga Suave · Respiração Consciente · Reinicialização de Intenção", simplePhases: "Alongue · Respire · Redefina seu foco", quickStart: "Levante-se, faça alguns alongamentos suaves, depois sente-se e faça 5 respirações lentas. É só isso." },
      evening: { title: "Maestria Noturna", subtitle: "Tai Chi + Kata + Respiração", simpleSubtitle: "Relaxe com movimento e respiração profunda", phases: "Fluxo de Tai Chi · Prática de Kata · Respiração de Resfriamento", simplePhases: "Movimento lento · Respirações profundas · Relaxe", quickStart: "Mova-se lentamente como se estivesse na água. Em seguida, expire mais do que inspira. Sinta-se desacelerar." },
    },
  },
  library: {
    header: "Biblioteca",
    items: {
      acc_paper: { title: "Artigo ACC", description: "A neurociência da detecção de erros e calibração mental" },
      ledger: { title: "Registro V3.0", description: "Visão geral completa do protocolo diário" },
      ptsd: { title: "TEPT e Mapeamento Populacional", description: "Aplicações para veteranos, detentos e o espaço" },
      mantra: { title: "Mantra Diário", description: "Seu princípio orientador e seu significado" },
      manual: { title: "Manual Como + Por Quê", description: "Guia prático do método Dojo" },
      glossary: { title: "Glossário", description: "Definições em linguagem simples: ACC, ERN, HOS e mais" },
    },
  },
  journal: {
    header: "Diário",
    placeholder: "O que surgiu? Nomeie. Aceite.",
    ernHeader: "Prompts de Reflexão ERN",
    prompts: [
      "O que surgiu? Nomeie. Aceite. Expire mais devagar.",
      "Que sinal de erro você notou? Como você respondeu?",
      "O que desencadeou sua reação? Você pode observá-lo sem julgamento?",
      "Onde você sentiu o sinal no seu corpo?",
    ],
    tapPrompt: "Toque para ver outro prompt",
    today: "Hoje",
    yesterday: "Ontem",
    emptyTitle: "Ainda não há entradas no diário.",
    emptyBody: "Comece registrando o que surge.",
    del: "Excluir",
    cancel: "Cancelar",
    mic: { start: "Falar para escrever", stop: "Parar gravação", listening: "Ouvindo…", notSupported: "Entrada de voz não é suportada neste navegador." },
  },
  timer: {
    blocks: { morning: "Bloco Matinal", midday: "Bloco do Meio-dia", evening: "Bloco Noturno" },
    phaseComplete: "Fase Concluída",
    blockComplete: "Bloco Concluído!",
    finished: "concluído",
    phases: {
      morning: [
        { name: "Exercício de Respiração", instruction: "Concentre-se na respiração com expiração dominante. Expire mais do que inspira." },
        { name: "Atenção Plena + Aceitação ERN", instruction: "O que surgiu? Nomeie. Aceite. Expire mais lentamente." },
      ],
      midday: [
        { name: "Reinicialização de Yoga", instruction: "Movimentos suaves para redefinir seu corpo e mente." },
        { name: "Atenção Plena Pós-Almoço", instruction: "Instale-se na quietude. Observe sem julgamento." },
      ],
      evening: [
        { name: "Aquecimento Tai Chi", instruction: "Movimentos lentos e fluidos. Conecte a respiração ao movimento." },
        { name: "Prática de Kata", instruction: "Formas precisas e deliberadas. Incorpore a prática." },
        { name: "Respiração de Resfriamento", instruction: "Relaxe com respirações profundas e calmantes." },
      ],
    },
    simpleInstructions: {
      morning: ["Inspire lentamente, depois expire ainda mais devagar. Apenas foque na sua respiração.", "Observe qualquer pensamento ou sentimento sem julgá-los. Apenas deixe-os passar."],
      midday: ["Mova-se suavemente — alguns alongamentos são perfeitos. Sem certo ou errado.", "Sente-se tranquilamente e faça respirações lentas e fáceis. Deixe sua mente descansar."],
      evening: ["Mova-se lentamente como se estivesse debaixo d'água. Sinta seu corpo.", "Pratique seus movimentos com cuidado e calma. Sem pressa.", "Expire mais do que inspira. Sinta-se desacelerar."],
    },
  },
  settings: {
    header: "Configurações",
    sections: { mode: "Modo", textSize: "Tamanho do Texto", timers: "Temporizadores", streak: "Sequência", stats: "Estatísticas", about: "Sobre", data: "Dados", language: "Idioma" },
    simpleMode: { title: "Modo Simples", descOn: "Ativado — visualização amigável para iniciantes", descOff: "Desativado — toque para mostrar guias suaves e texto mais curto" },
    textSizeLabel: "Tamanho da Fonte",
    blockLabels: { morning: "Dojo Matinal", midday: "Reinicialização do Meio-dia", evening: "Maestria Noturna" },
    streakDays: "dias de sequência",
    best: "Melhor",
    lastCompleted: "Última conclusão",
    journalEntries: "Entradas do Diário",
    blocksCompleted: "Blocos Concluídos",
    version: "Versão 1.0.0",
    license: "Licença: MIT — Código Aberto",
    philosophy: "Sem contas. Sem rastreamento. Sem anúncios. Sem nuvem.",
    localData: "Todos os dados são armazenados localmente no seu dispositivo.",
    exportBtn: "Exportar Diário",
    resetBtn: "Redefinir Todos os Dados",
    resetConfirm: "Toque novamente para confirmar",
    languageSelector: "Idioma do App",
  },
  glossary: {
    title: "Glossário e Terminologia",
    intro: "Definições em linguagem simples para cada termo usado no Dojo. Nenhum conhecimento prévio necessário.",
    simpleModeBanner: "Modo Simples — definições para iniciantes sendo exibidas",
    entries: [
      { term: "ACC (Córtex Cingulado Anterior)", simple: "Uma parte do seu cérebro que age como um sensor de controle de qualidade — percebe quando algo dá errado e sinaliza você para se ajustar." },
      { term: "ERN (Negatividade Relacionada a Erros)", simple: "Um minúsculo sinal cerebral que dispara dentro de um décimo de segundo após um erro — antes mesmo de você perceber conscientemente." },
      { term: "SERP (Padrão Estresse–Erro–Resposta)", simple: "O loop que seu cérebro executa quando o estresse causa erros, e os erros causam mais estresse — o Dojo quebra esse ciclo." },
      { term: "Ponto de Arquimedes", simple: "Um momento de perspectiva clara onde você pode ver sua situação de fora do caos — como dar um passo atrás para ter a visão completa." },
      { term: "HOS (Estado de Alta Performance)", simple: "A zona mental onde o foco é aguçado, as reações são calmas e você performa no seu melhor — o objetivo para o qual o treinamento Dojo leva." },
      { term: "R_ACC (Córtex Cingulado Anterior Regulado)", simple: "Uma versão bem treinada do sensor de erros do seu cérebro — calmo o suficiente para funcionar claramente, preciso o suficiente para detectar erros reais." },
      { term: "Programação N-Versão", simple: "Executar múltiplas versões independentes da mesma tarefa para que um erro não afunde o sistema — aplicado ao cérebro, significa construir múltiplas estratégias mentais para resiliência." },
      { term: "Tolerância a Falhas Bizantinas", simple: "A capacidade de um sistema de continuar funcionando corretamente mesmo quando algumas partes enviam sinais errados — em termos Dojo, permanecer funcional quando suas emoções são não confiáveis." },
      { term: '"A luta em si mesma é o significado"', simple: "As dificuldades que você enfrenta não estão impedindo uma vida significativa — ELAS SÃO a vida significativa. O desafio é o ponto." },
    ],
  },
  reader: { notFound: "Conteúdo não encontrado", simpleModeOn: "Modo Simples — definições para iniciantes", simpleModeHint: "Desative o Modo Simples nas Configurações para ler a seção completa" },
};

// ─── Arabic ───────────────────────────────────────────────────────────────────

const ar: T = {
  common: { appName: "دوجو", back: "رجوع", del: "حذف", cancel: "إلغاء", never: "أبدًا", min: "د", on: "مفعّل", off: "معطّل" },
  dashboard: {
    morning: "صباح الخير",
    afternoon: "مساء الخير",
    evening: "مساء النور",
    mantra: "أقبل ما هو. أعدّل ما يطرأ. الكفاح ذاته هو المعنى.",
    simpleMantra: "اقبل ما هو. اضبط ما تستطيع. التحدي ذاته هو المعنى.",
    todaysPractice: "ممارسة اليوم",
    yourPracticeToday: "ممارستك اليوم",
    simpleModeOn: "الوضع البسيط مفعّل — كل بلوك يعرض دليل البدء السريع",
    blocks: {
      morning: { title: "دوجو الصباح", subtitle: "التنفس + اليقظة الذهنية", simpleSubtitle: "ابدأ يومك بالتنفس والتركيز الهادئ", phases: "تمارين التنفس · مسح الجسم · التأمل · اليوميات", simplePhases: "تنفس · اجلس بهدوء · الاحظ أفكارك", quickStart: "اجلس بشكل مريح، أغمض عينيك، وتنفس ببطء. عندما يبدأ المؤقت، اتبع فقط." },
      midday: { title: "إعادة ضبط منتصف النهار", subtitle: "اليوغا + اليقظة الذهنية", simpleSubtitle: "تمدد سريع ولحظة من الهدوء", phases: "يوغا لطيفة · تنفس واعٍ · إعادة تعيين النية", simplePhases: "تمدد · تنفس · أعد ضبط تركيزك", quickStart: "قف، افعل بعض الإطالات اللطيفة، ثم اجلس وخذ 5 أنفاس بطيئة. هذا كل شيء." },
      evening: { title: "إتقان المساء", subtitle: "تاي تشي + كاتا + التنفس", simpleSubtitle: "استرخِ مع الحركة والتنفس العميق", phases: "تدفق تاي تشي · ممارسة الكاتا · التنفس التبريدي", simplePhases: "حركة بطيئة · أنفاس عميقة · استرخِ", quickStart: "تحرك ببطء كأنك في الماء. ثم ازفر لفترة أطول مما تشهق. اشعر بأنك تتباطأ." },
    },
  },
  library: {
    header: "المكتبة",
    items: {
      acc_paper: { title: "ورقة ACC", description: "علم الأعصاب في كشف الأخطاء والمعايرة الذهنية" },
      ledger: { title: "سجل V3.0", description: "نظرة عامة كاملة على البروتوكول اليومي" },
      ptsd: { title: "اضطراب ما بعد الصدمة ورسم الخرائط السكانية", description: "التطبيقات للمحاربين القدامى والسجناء والفضاء" },
      mantra: { title: "المانترا اليومية", description: "مبدأك التوجيهي ومعناه" },
      manual: { title: "دليل كيف + لماذا", description: "دليل عملي لطريقة الدوجو" },
      glossary: { title: "المسرد", description: "تعريفات بلغة بسيطة: ACC، ERN، HOS والمزيد" },
    },
  },
  journal: {
    header: "اليوميات",
    placeholder: "ماذا طرأ؟ سمِّه. اقبله.",
    ernHeader: "مطالبات تأمل ERN",
    prompts: [
      "ماذا طرأ؟ سمِّه. اقبله. ازفر ببطء أكبر.",
      "ما إشارة الخطأ التي لاحظتها؟ كيف استجبت؟",
      "ما الذي أثار ردة فعلك؟ هل يمكنك ملاحظته دون حكم؟",
      "أين شعرت بالإشارة في جسدك؟",
    ],
    tapPrompt: "اضغط لرؤية مطالبة أخرى",
    today: "اليوم",
    yesterday: "الأمس",
    emptyTitle: "لا توجد مدخلات في اليوميات بعد.",
    emptyBody: "ابدأ بتسجيل ما يطرأ.",
    del: "حذف",
    cancel: "إلغاء",
    mic: { start: "تحدث للكتابة", stop: "إيقاف التسجيل", listening: "جارٍ الاستماع…", notSupported: "إدخال الصوت غير مدعوم في هذا المتصفح." },
  },
  timer: {
    blocks: { morning: "بلوك الصباح", midday: "بلوك منتصف النهار", evening: "بلوك المساء" },
    phaseComplete: "اكتملت المرحلة",
    blockComplete: "اكتمل البلوك!",
    finished: "مكتمل",
    phases: {
      morning: [
        { name: "تمرين التنفس", instruction: "ركز على التنفس مع الزفير المهيمن. الزفير أطول من الشهيق." },
        { name: "اليقظة + قبول ERN", instruction: "ماذا طرأ؟ سمِّه. اقبله. ازفر ببطء أكبر." },
      ],
      midday: [
        { name: "إعادة تعيين اليوغا", instruction: "حركات لطيفة لإعادة تعيين جسمك وعقلك." },
        { name: "يقظة ما بعد الغداء", instruction: "استقر في الهدوء. راقب دون حكم." },
      ],
      evening: [
        { name: "إحماء تاي تشي", instruction: "حركات بطيئة وسلسة. اربط التنفس بالحركة." },
        { name: "ممارسة الكاتا", instruction: "أشكال دقيقة ومتعمدة. جسّد الممارسة." },
        { name: "تنفس التبريد", instruction: "استرخِ مع أنفاس عميقة ومهدئة." },
      ],
    },
    simpleInstructions: {
      morning: ["خذ نفسًا ببطء، ثم ازفر ببطء أكبر. ركز فقط على تنفسك.", "الاحظ أي أفكار أو مشاعر دون الحكم عليها. فقط دعها تمر."],
      midday: ["تحرك بلطف — بعض الإطالات مثالية. لا صواب ولا خطأ.", "اجلس بهدوء وخذ أنفاسًا بطيئة وسهلة. دع عقلك يرتاح."],
      evening: ["تحرك ببطء كأنك تحت الماء. اشعر بجسدك.", "مارس حركاتك بعناية وهدوء. لا استعجال.", "ازفر لفترة أطول مما تشهق. اشعر بأنك تتباطأ."],
    },
  },
  settings: {
    header: "الإعدادات",
    sections: { mode: "الوضع", textSize: "حجم النص", timers: "مؤقتات البلوك", streak: "السلسلة", stats: "الإحصائيات", about: "حول", data: "البيانات", language: "اللغة" },
    simpleMode: { title: "الوضع البسيط", descOn: "مفعّل — عرض مناسب للمبتدئين", descOff: "معطّل — اضغط لإظهار الأدلة اللطيفة والنصوص المختصرة" },
    textSizeLabel: "حجم الخط",
    blockLabels: { morning: "دوجو الصباح", midday: "إعادة ضبط منتصف النهار", evening: "إتقان المساء" },
    streakDays: "أيام متتالية",
    best: "الأفضل",
    lastCompleted: "آخر اكتمال",
    journalEntries: "مدخلات اليوميات",
    blocksCompleted: "البلوكات المكتملة",
    version: "الإصدار 1.0.0",
    license: "الرخصة: MIT — مفتوح المصدر",
    philosophy: "بلا حسابات. بلا تتبع. بلا إعلانات. بلا سحابة.",
    localData: "جميع البيانات مخزنة محليًا على جهازك.",
    exportBtn: "تصدير اليوميات",
    resetBtn: "إعادة تعيين جميع البيانات",
    resetConfirm: "اضغط مرة أخرى للتأكيد",
    languageSelector: "لغة التطبيق",
  },
  glossary: {
    title: "المسرد والمصطلحات",
    intro: "تعريفات بلغة بسيطة لكل مصطلح مستخدم في الدوجو. لا يلزم معرفة مسبقة.",
    simpleModeBanner: "الوضع البسيط — يتم عرض تعريفات مناسبة للمبتدئين",
    entries: [
      { term: "ACC (القشرة الحزامية الأمامية)", simple: "جزء من دماغك يعمل كمستشعر لضبط الجودة — يلاحظ عند حدوث خطأ ما ويشير إليك بالتعديل." },
      { term: "ERN (السلبية المرتبطة بالخطأ)", simple: "إشارة دماغية صغيرة تُطلق في عشر ثانية بعد الخطأ — قبل أن تدركه بوعي." },
      { term: "SERP (نمط الإجهاد-الخطأ-الاستجابة)", simple: "الحلقة التي يدير فيها دماغك عندما يتسبب الإجهاد في أخطاء، والأخطاء تسبب المزيد من الإجهاد — الدوجو يكسر هذه الحلقة." },
      { term: "نقطة أرخميدس", simple: "لحظة من المنظور الواضح حيث يمكنك رؤية وضعك من خارج الفوضى — مثل الخطوة إلى الوراء للحصول على الصورة الكاملة." },
      { term: "HOS (حالة الأداء العالي)", simple: "المنطقة الذهنية حيث يكون التركيز حادًا والردود هادئة وتؤدي بأفضل ما لديك — الهدف الذي يبني نحوه تدريب الدوجو." },
      { term: "R_ACC (القشرة الحزامية الأمامية المنظمة)", simple: "نسخة مُدرَّبة جيدًا من مستشعر الأخطاء في دماغك — هادئة بما يكفي للعمل بوضوح، دقيقة بما يكفي لاكتشاف الأخطاء الحقيقية." },
      { term: "برمجة N-Version", simple: "تشغيل نسخ مستقلة متعددة من نفس المهمة حتى لا يغرق خطأ واحد النظام بأكمله — مطبق على الدماغ، يعني بناء استراتيجيات ذهنية متعددة للمرونة." },
      { term: "تحمل الأعطال البيزنطية", simple: "قدرة النظام على الاستمرار في العمل بشكل صحيح حتى عندما ترسل بعض أجزائه إشارات خاطئة — بمصطلحات الدوجو، البقاء وظيفيًا عندما تكون عواطفك غير موثوقة." },
      { term: '"الكفاح ذاته هو المعنى"', simple: "الصعوبات التي تواجهها ليست عائقًا أمام حياة ذات معنى — بل هي الحياة ذات المعنى. التحدي هو النقطة الجوهرية." },
    ],
  },
  reader: { notFound: "المحتوى غير موجود", simpleModeOn: "الوضع البسيط — تعريفات للمبتدئين", simpleModeHint: "أوقف تشغيل الوضع البسيط في الإعدادات لقراءة القسم الكامل" },
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const translations: Record<Language, T> = { en, es, fr, de, pt, ar };

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ar: "العربية",
};

export const LANGUAGE_SPEECH_CODE: Record<Language, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
  ar: "ar-SA",
};
