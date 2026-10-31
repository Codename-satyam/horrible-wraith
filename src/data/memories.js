// EDIT ME: one record per photograph. This is the single source of truth:
//  - the 5 ids in birthday.featuredMemoryIds appear on the opening canvas
//  - ALL records appear on the pinboard (short `quote`)
//  - ALL records become photo book pages (long `story`)
// Put the image files in /public/images. Missing files show a pencil placeholder.
// Add / remove records freely. Keep every `id` and every `quote` unique.
//
// Optional fields:
//   date: '' · annotation: handwritten margin note · rotation: degrees on the pinboard
//   shape: 'portrait' | 'landscape' | 'square'
//   welcome: { x, y, w, rot, hold: 'tape'|'clip'|'pin' }   placement on the opening canvas
//   board:   { x: percent, y: px }                         manual position on the pinboard (desktop)
const img = (n) => `/images/photo-${String(n).padStart(2, '0')}.jpg`;

export const memories = [
  {
    id: 'memory-01', image: img(1), alt: 'Photograph 1: Our first milestone',
    caption: 'Where it started', featured: true, rotation: -3, shape: 'portrait',
    quote: 'The moment I knew this was something special.',
    title: 'A Beautiful Beginning', date: '',
    story: 'Looking back to the day we started talking, I can’t help but smile. It was the start of something that would change my life in the most wonderful ways. Every memory since then has been a testament to how lucky I am to have you.',
    annotation: 'one for the little book',
    welcome: { x: '3%', y: '7%', w: '19%', rot: -4, hold: 'tape' }
  },
  {
    id: 'memory-02', image: img(2), alt: 'Photograph 2: A quiet moment together',
    caption: 'Lost in time', featured: true, rotation: 2.5, shape: 'landscape',
    quote: 'Just you, me, and a perfect afternoon.',
    title: 'Quiet Magic', date: '',
    story: 'Sometimes the most ordinary days turn into the best memories. We didn’t have to do anything spectacular; just being together was more than enough.',
    annotation: 'look at this one',
    welcome: { x: '77%', y: '5%', w: '18%', rot: 3.5, hold: 'clip' }
  },
  {
    id: 'memory-03', image: img(3), alt: 'Photograph 3: A Glance of Beauty',
    caption: 'On the move', featured: true, rotation: -2, shape: 'portrait',
    quote: 'Anywhere with you is my favorite place to be.',
    title: 'Chasing Horizons', date: '',
    story: 'Even in the rush of life, there are moments that make everything else fade away. This photo captures one of those fleeting, perfect instances.',
    annotation: 'keep this one',
    welcome: { x: '7%', y: '42%', w: '17%', rot: 2, hold: 'pin' }
  },
  {
    id: 'memory-04', image: img(4), alt: 'Photograph 4: Laughing uncontrollably',
    caption: 'Pure joy', featured: true, rotation: 3, shape: 'square',
    quote: 'Your laugh is still my favorite sound in the world.',
    title: 'Endless Smiles', date: '',
    story: 'I can’t get over how infectious your laughter is. Every time I hear it, I feel like the luckiest person alive, and this photo captures that perfectly.',
    annotation: 'a good day',
    welcome: { x: '75%', y: '40%', w: '18%', rot: -3, hold: 'tape' }
  },
  {
    id: 'memory-05', image: img(5), alt: 'Photograph 5: A beautifully framed memory',
    caption: 'My favorite', featured: true, rotation: -1.5, shape: 'landscape',
    quote: 'If I could freeze time, I’d choose right here.',
    title: 'The Highlight', date: '',
    story: 'Out of all our photos, there is something about this one that just captures "us" perfectly. It holds so much warmth, and it’s a memory I’ll cherish forever.',
    annotation: 'still smiling about this',
    welcome: { x: '36%', y: '66%', w: '26%', rot: -1.5, hold: 'tape' }
  },
  {
    id: 'memory-06', image: img(6), alt: 'Photograph 6: Evening lights',
    caption: 'City glow', featured: false, rotation: 2, shape: 'portrait',
    quote: 'The world gets quiet when I’m looking at you.',
    title: 'Under the Lights', date: '',
    story: 'The lighting here was just right, but you were the one glowing. That evening felt like a scene out of a movie, written just for you.',
    annotation: 'favorite evening'
  },
  {
    id: 'memory-07', image: img(7), alt: 'Photograph 7: A cozy afternoon indoors',
    caption: 'Safe haven', featured: false, rotation: -2.5, shape: 'landscape',
    quote: 'Home isn’t a place, it’s you.',
    title: 'Comfort in Chaos', date: '',
    story: 'Curled up and completely at peace. It’s in these quiet, cozy moments that I realize how deeply intertwined our lives have become, and how grateful I am for it.',
    annotation: ''
  },
  {
    id: 'memory-08', image: img(8), alt: 'Photograph 8: Dressed up',
    caption: 'Looking sharp', featured: false, rotation: 1.5, shape: 'square',
    quote: 'You always know how to steal the room.',
    title: 'Stealing Glances', date: '',
    story: 'Your one look is enough to make my heart skip a beat, and I couldn’t keep my eyes off you. You look absolutely stunning every day, and I am lucky to be by your side.',
    annotation: 'so beautiful'
  },
  {
    id: 'memory-09', image: img(9), alt: 'Photograph 9: A candid shot',
    caption: 'Caught off guard', featured: false, rotation: -1, shape: 'portrait',
    quote: 'You didn’t know I was looking, but I always am.',
    title: 'Unfiltered You', date: '',
    story: 'It\'s Kind of depressing I never got to meet you before, but this is exactly how I see you every single day—effortlessly beautiful and completely authentic.',
    annotation: 'my favorite angle'
  },
  {
    id: 'memory-10', image: img(10), alt: 'Photograph 10: Scenic view',
    caption: 'Breath of fresh air', featured: false, rotation: 3.5, shape: 'landscape',
    quote: 'The view was great, but the company was better.',
    title: 'Top of the World', date: '',
    story: 'The journey has just started, but standing there with you will definitely make it worth it. There’s no one else I’d rather explore the world with.',
    annotation: ''
  },
  {
    id: 'memory-11', image: img(11), alt: 'Photograph 11: Being silly',
    caption: 'Never a dull moment', featured: false, rotation: -3, shape: 'square',
    quote: 'I love that we can be complete idiots together.',
    title: 'Partners in Crime', date: '',
    story: 'This picture perfectly sums up our dynamic. We never take ourselves too seriously, and those fits of laughter are the anchor that carries me forwar.',
    annotation: 'never change'
  },
  {
    id: 'memory-12', image: img(12), alt: 'Photograph 12: Golden hour',
    caption: 'Sun-kissed', featured: false, rotation: 2, shape: 'portrait',
    quote: 'Golden hour looks incredibly good on you.',
    title: 'Painted by the Sun', date: '',
    story: 'The way the sun hit your face was too perfect not to capture. It’s one of those rare moments where a photograph actually does justice to reality.',
    annotation: ''
  },
  {
    id: 'memory-13', image: img(13), alt: 'Photograph 13: The journey continues',
    caption: 'To many more', featured: false, rotation: -2, shape: 'landscape',
    quote: 'This is just a fraction of our story.',
    title: 'And One for the Road', date: '',
    story: 'If we can fit this much joy, love, and growth into these moments, I can hardly wait to see what the next chapter holds for us. Here is to everything still to come.',
    annotation: 'to be continued...'
  }
];

export const getMemory = (id) => memories.find((m) => m.id === id);