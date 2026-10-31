// EDIT ME: every piece of wording in the experience lives in the data files.
// {name} in any string becomes recipientName.
export const birthday = {
  recipientName: 'RITUU',

  // Act I: welcome canvas
  welcomeLabel: 'A LITTLE SOMETHING, MADE JUST FOR YOU',
  welcomeTitle: 'Happy Birthday!',
  welcomeSubtitle: 'Some memories, a few little surprises, and a whole lot of love, drawn just for you.',
  welcomeButton: "LET'S OPEN THIS LITTLE WORLD",
  welcomeNote: 'Please handle with a little bit of happiness.',
  welcomeAfterButton: 'Turn the page',

  // Exactly these five (ids from memories.js) appear on the opening canvas.
  featuredMemoryIds: ['memory-01', 'memory-02', 'memory-03', 'memory-04', 'memory-05'],

  // Navigation tabs (order matters)
  nav: [
    { id: 'welcome', label: 'The cover' },
    { id: 'pinboard', label: 'Pinboard' },
    { id: 'book', label: 'Photo book' },
    { id: 'quiz', label: 'Little quiz' },
    { id: 'cake', label: 'The cake' },
    { id: 'finale', label: 'Finale' }
  ],

  // Act III
  pinboardTitle: 'The Memory Wall',
  pinboardHint: 'Tap a photograph to read the note pinned to it.',
  bookTitle: 'A Little Book of Memories',
  bookOpenButton: 'Open the book',

  // Act IV
  quizTitle: 'A little quiz with no wrong answers',
  quizIntro: 'Every answer is a good one. Each one opens a different corner of this world, so pick whatever feels right.',

  // Act V
  candleCount: 5, // 1 - 12
  cakeWishPrompt: 'Close your eyes. Make a little wish.',
  wishButton: 'MAKE A WISH',
  wishMessage: 'May this year be gentle with you, and a little bit magical.',
  blowButton: 'BLOW OUT THE CANDLES',
  finalMessage: 'May your world always have a little more color, wonder, and happiness.',
  closingLine: 'Made with love.',

  // Act V: the wish. She can type it; it stays on her device and floats away as a paper plane.
  wishPlaceholder: 'Type your wish here, or keep it in your head...',
  wishNote: 'Optional. It is never sent anywhere.',
  wishSent: 'Your wish is on its way.',

  // Finale page
  // A voice message from you. Drop an mp3 at public/audio/voice-note.mp3 (20-40 seconds is perfect).
  // If the file is missing, the player simply does not appear.
  voiceNote: {
    src: '/audio/voice-note.mp3',
    title: 'One more thing, out loud',
    caption: 'Press play. It is short, I promise.',
    transcript: 'Just wanted to say happy birthday out loud. I hope today is exactly as beautiful as you are.' 
  },

  finale: {
    heading: 'Happy Birthday, {name}!',
    paragraphs: [
      'Watching you find your way through life, chasing your dreams, and being the beautiful soul you are is one of my greatest privileges. You have this magical way of making my world warmer, my days brighter, and my heart a little fuller just by being you. And sometimes, I wish I could show you how beautiful you look through my eyes, how much happiness you bring into my life, and how even the smallest things about you have found a home in my heart. So, I wanted to create a little corner of the internet just for you—a place where the world can pause for a moment and everything can be about *you*, the girl who unknowingly makes my world feel so much more like home. ❤️',
      'I hope this year is as beautiful to you as you make my world feel. I hope it brings you a thousand reasons to smile, dreams that come true, and little moments that remind you how deeply loved you are. Keep shining, my love, and never forget that no matter where life takes you, you\'ll always have me cheering for you, holding your hand through the difficult days, and celebrating every little victory. You deserve all the happiness this world has to offer, and if I can be even a tiny part of that happiness, I\'ll consider myself the luckiest person alive. ❤️'
    ],
    signature: 'Love, Satyam',
    keptWishTitle: 'Your wish, folded small',
    keptWishOpen: 'Unfold it',
    keptWishClose: 'Fold it back up',
    noWorldLine: 'There is a little world here with your name on it.',
    noWorldButton: 'Find it with the quiz'
  }
};