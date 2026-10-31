// EDIT ME: the whole quiz. No scores, no wrong answers: every answer has a reaction and a destination.
//
// `next` on an answer is either:
//   'q2a'                                   a question id or an outcome id
//   { by:'q1', map:{ 'q1-a':'out-x', ... }, otherwise:'out-y' }
//                                           a destination chosen by an EARLIER answer (this is the branching)
// Each ending also has `finale` (a line shown on the finale page) and `tones` (lily colors there).
// reaction.scene: lily | path | photo | capy | moon | door | stars    (photo uses reaction.memoryId)
// Run `npm run check` after editing: it validates every destination, reachability and loops.
export const quiz = {
  start: 'q1',
  questions: {
    q1: {
      prompt: 'If today were a little world of its own, what would you choose?',
      answers: [
        { id: 'q1-a', text: 'A quiet afternoon surrounded by flowers', next: 'q2a',
          reaction: { scene: 'lily', line: 'The lilies have been waiting for you. They are very polite about it.' },
          capy: 'Flowers. Excellent. Very photosynthetic of you.' },
        { id: 'q1-b', text: 'A tiny adventure with unexpected surprises', next: 'q2b',
          reaction: { scene: 'path', line: 'A little path appears. Nobody knows where it goes, which is the whole idea.' },
          capy: 'Adventure! I will supervise from here.' },
        { id: 'q1-c', text: 'A cozy corner filled with photographs', next: 'q2c',
          reaction: { scene: 'photo', memoryId: 'memory-02', line: 'A warm lamp, a soft chair, and a pile of pictures to look through.' },
          capy: 'A cozy corner. I have already claimed the cushion.' },
        { id: 'q1-d', text: 'A world where everything is slightly ridiculous', next: 'q2d',
          reaction: { scene: 'capy', line: 'Very good. The rules here are optional and the hats are mandatory.' },
          capy: 'Finally, someone with vision.' }
      ]
    },
    q2a: {
      prompt: 'The garden is yours now. What do you do first?',
      answers: [
        { id: 'q2a-a', text: 'Press one petal into a book, for later', next: 'q3',
          reaction: { scene: 'stars', line: 'Small things, kept carefully. The best way to keep things.' } },
        { id: 'q2a-b', text: 'Sit very still and watch everything sway', next: 'out-garden',
          reaction: { scene: 'lily', line: 'The whole garden leans a little closer, as if it noticed.' } },
        { id: 'q2a-c', text: 'Invite everyone over. Flowers do not mind a crowd', next: 'q3',
          reaction: { scene: 'stars', line: 'The garden fills up with chairs that did not exist a second ago.' } }
      ]
    },
    q2b: {
      prompt: 'The path forks. One way is winding, and the other has a tiny door in a tree.',
      answers: [
        { id: 'q2b-a', text: 'Follow the winding path', next: 'out-journey',
          reaction: { scene: 'path', line: 'It bends once, twice, and then you cannot see where you started. Lovely.' } },
        { id: 'q2b-b', text: 'Open the tiny door in the tree', next: 'q3',
          reaction: { scene: 'door', line: 'It was not locked. It was never locked. It was just waiting to be asked.' } },
        { id: 'q2b-c', text: 'Sit down and unpack the snacks, obviously', next: 'out-ridiculous',
          reaction: { scene: 'capy', line: 'A sensible choice. Adventures run on snacks.' },
          capy: 'Snacks. Now we are talking.' }
      ]
    },
    q2c: {
      prompt: 'A box of pictures spills open across the floor. What happens next?',
      answers: [
        { id: 'q2c-a', text: 'Pick one and keep it close', next: 'out-keepsake',
          reaction: { scene: 'photo', memoryId: 'memory-01', line: 'That one goes in the pocket. Some pictures are made to travel.' } },
        { id: 'q2c-b', text: 'Tell the story out loud, to nobody in particular', next: 'q3',
          reaction: { scene: 'stars', line: 'The room listens. Rooms are good at that.' } },
        { id: 'q2c-c', text: 'Start a brand new collage right now', next: 'out-keepsake',
          reaction: { scene: 'photo', memoryId: 'memory-03', line: 'Scissors, tape, one slightly crooked corner. Perfect.' } }
      ]
    },
    q2d: {
      prompt: 'In the ridiculous world, who is in charge?',
      answers: [
        { id: 'q2d-a', text: 'A very serious pigeon in a tiny hat', next: 'out-ridiculous',
          reaction: { scene: 'stars', line: 'The pigeon nods once. Nobody argues with the hat.' } },
        { id: 'q2d-b', text: 'The capybara, naturally', next: 'q3',
          reaction: { scene: 'capy', line: 'Capy accepts the position, then immediately takes a nap.' },
          capy: 'I accept. My first decree is: more naps.' },
        { id: 'q2d-c', text: 'Nobody. Gravity is optional today', next: 'out-journey',
          reaction: { scene: 'moon', line: 'Everything drifts up a few inches and nobody minds.' } }
      ]
    },
    q3: {
      prompt: 'The light goes soft and golden. What happens next?',
      answers: [
        { id: 'q3-a', text: 'Someone puts music on, a little too loud',
          next: { by: 'q1', map: { 'q1-a': 'out-garden', 'q1-b': 'out-journey', 'q1-c': 'out-keepsake', 'q1-d': 'out-ridiculous' }, otherwise: 'out-moon' },
          reaction: { scene: 'stars', line: 'The floor becomes a dance floor. Nobody remembers agreeing to that.' } },
        { id: 'q3-b', text: 'Candles, and nobody needs to talk', next: 'out-moon',
          reaction: { scene: 'moon', line: 'One small flame, and the whole room goes quiet in a good way.' } },
        { id: 'q3-c', text: 'A slow walk home, the long way round',
          next: { by: 'q1', map: { 'q1-a': 'out-moon', 'q1-b': 'out-journey', 'q1-c': 'out-moon', 'q1-d': 'out-journey' }, otherwise: 'out-moon' },
          reaction: { scene: 'path', line: 'The streetlights come on one at a time, just for you.' } }
      ]
    }
  },
  outcomes: {
    'out-garden': {
      finale: 'You picked the garden, so here is what I hope for you this year: slow mornings, things that bloom without being asked, and plenty of time to sit and watch them.',
      tones: ['pink', 'butter', 'lilac'],
      title: 'A world that smells like lilies',
      message: 'This little world is slow, green and full of things growing quietly. Nobody hurries here, and everything blooms on its own schedule.',
      wish: 'A birthday wish: may good things grow for you without being asked twice.',
      scene: 'lily', memoryId: 'memory-05',
      capy: 'The garden ending. I am taking a petal home for later.'
    },
    'out-journey': {
      finale: 'You picked the door in the tree, so here is what I hope for you this year: good detours, lucky accidents, and a pocket that is never quite empty.',
      tones: ['coral', 'butter', 'pink'],
      title: 'A world with a door in a tree',
      message: 'This little world has a path that bends, a door that opens, and a pocket full of small surprises. Nothing is on a map, and that is the best part.',
      wish: 'A birthday wish: may this year be full of the good kind of surprise.',
      scene: 'door', memoryId: 'memory-04',
      capy: 'A door in a tree. I am bringing snacks next time.'
    },
    'out-keepsake': {
      finale: 'You picked the world of pictures, so here is what I hope for you this year: more days worth photographing, and someone nearby to laugh about them later.',
      tones: ['butter', 'pink', 'lilac'],
      title: 'A world made of pictures',
      message: 'This little world is warm and a bit cluttered, with photographs on every surface and a story behind each one. It is the kind of place you never want to tidy.',
      wish: 'A birthday wish: may your favourite moments keep on piling up.',
      scene: 'photo', memoryId: 'memory-02',
      capy: 'A world of pictures. I will take the cushion, thanks.'
    },
    'out-ridiculous': {
      finale: 'You picked the capybara\'s world, so here is what I hope for you this year: at least one absurd afternoon, and a hat that fits.',
      tones: ['coral', 'lilac', 'butter'],
      title: 'A world run by a capybara',
      message: 'This little world has very few rules, all of them silly, and a capybara in charge of most things. Hats are optional, except when they are not.',
      wish: 'A birthday wish: may this year be at least slightly ridiculous.',
      scene: 'capy', memoryId: 'memory-03',
      capy: 'I am in charge now. Everyone gets a nap.'
    },
    'out-moon': {
      finale: 'You picked the world with one small candle, so here is what I hope for you this year: quiet that feels like company, and a glow that stays on.',
      tones: ['lilac', 'butter', 'pink'],
      title: 'A world lit by one small candle',
      message: 'This little world is quiet and golden. There is one candle, one good chair, and no need to say anything at all.',
      wish: 'A birthday wish: may you always find a quiet, glowing corner.',
      scene: 'moon', memoryId: 'memory-01',
      capy: 'One candle is plenty. It is the right amount of glow.'
    }
  }
};
