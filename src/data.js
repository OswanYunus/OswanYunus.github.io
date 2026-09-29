// =============================================================
//  EDIT THIS FILE to change what the site says.
// =============================================================

export const profile = {
  name: 'Oswan Baraka Yunus',
  email: 'oswanbarackyunus@gmail.com',
  github: 'https://github.com/OswanYunus',
  githubUser: 'OswanYunus',
  age: 20,
  degree: 'BSc Computer Science',
  graduation: 'November 2027 (date to be confirmed)',
  bio: [
    "I'm Oswan, a 20-year-old computer science student who builds full-stack web apps, mobile apps and 3D experiences, and who is now moving into game development.",
    'My biggest project is Cerebro, a multi-tenant WhatsApp SaaS I designed and built from scratch. It is live in production and I have also shipped work for Tukonect Digital and for Stemplore.',
    'AI speedruns my production. I use it to build and ship faster, while I stay in charge of the architecture, the review and the result. I also communicate clearly and have the drive to finish what I start.',
  ],
};

// level: 1-5. Adjust these honestly.
// tag: links a skill to projects below. learning: true shows a "learning" badge.
export const skills = [
  {
    group: 'Full-stack web',
    items: [
      { name: 'TypeScript', level: 4, tag: 'typescript' },
      { name: 'Node.js and Fastify', level: 4, tag: 'node' },
      { name: 'React and Vite', level: 4, tag: 'react' },
      { name: 'Tailwind CSS', level: 4 },
      { name: 'PostgreSQL and Prisma ORM', level: 3, tag: 'database' },
      { name: 'Zod validation', level: 4, tag: 'zod' },
      { name: 'JavaScript, HTML and CSS', level: 4, tag: 'web' },
    ],
  },
  {
    group: 'Backend and infrastructure',
    items: [
      { name: 'JWT authentication', level: 3, tag: 'saas' },
      { name: 'BullMQ and Redis queues', level: 3, tag: 'queues' },
      { name: 'WhatsApp integration (Baileys)', level: 3, tag: 'whatsapp' },
      { name: 'Docker', level: 3, tag: 'docker' },
      { name: 'ngrok', level: 3 },
      { name: 'pnpm monorepos', level: 3 },
      { name: 'Git and GitHub', level: 3 },
      { name: 'Python', level: 3 },
      { name: 'Linux command line', level: 3 },
    ],
  },
  {
    group: 'Mobile, 3D and AI',
    items: [
      { name: 'Dart and Flutter', level: 3, tag: 'flutter' },
      { name: 'three.js', level: 3, tag: 'threejs' },
      { name: 'AI-assisted development', level: 4, tag: 'ai' },
      { name: 'AI assistants and automation', level: 3, tag: 'ai' },
      { name: 'Networking and DNS security', level: 3, tag: 'security' },
    ],
  },
  {
    group: 'Game development',
    items: [
      { name: '2D simulation and game loops', level: 3, tag: 'gamedev' },
      { name: 'Godot', level: 1, learning: true },
      { name: 'C# and Unity', level: 1, learning: true },
    ],
  },
  {
    group: 'People skills',
    plain: true,
    items: [
      { name: 'Communication' },
      { name: 'Passion and drive' },
      { name: 'Explaining technical ideas' },
      { name: 'Community contribution' },
      { name: 'Self-directed learning' },
      { name: 'Teamwork' },
    ],
  },
];

// featured: true makes a project full-width at the top.
// live: link to the running site. repo: GitHub link (null hides the button).
export const projects = [
  {
    featured: true,
    title: 'Cerebro WhatsApp SaaS',
    status: 'Live in production',
    blurb:
      'A multi-tenant WhatsApp messaging platform for businesses, designed and built from scratch. Companies connect their WhatsApp, manage contacts, run campaigns and schedule messages, while admins control billing packages and access. Developers can plug in their own systems through a documented Developer API.',
    features: [
      'Customer accounts and workspaces',
      'WhatsApp instance connection',
      'Contacts, campaigns and scheduled messages',
      'Billing packages and admin controls',
      'Developer API for external integrations',
    ],
    tags: ['saas', 'typescript', 'node', 'react', 'database', 'zod', 'queues', 'whatsapp', 'docker', 'web'],
    stack: [
      'Node.js',
      'TypeScript',
      'Fastify',
      'PostgreSQL',
      'Prisma',
      'JWT',
      'Zod',
      'BullMQ',
      'Redis',
      'Baileys',
      'React',
      'Vite',
      'Tailwind CSS',
      'pnpm workspaces',
      'Docker',
    ],
    live: 'https://wa.tukonectdigital.co.ke',
    repo: null, // paste your Cerebro GitHub repo URL here
  },
  {
    title: 'Tukonect Digital',
    status: 'Company website',
    blurb: 'I took part in building the Tukonect Digital website, which is hosted on cPanel and live for the company.',
    tags: ['web'],
    stack: ['Web', 'cPanel'],
    live: 'https://tukonectdigital.co.ke',
    repo: null,
  },
  {
    title: 'Stemplore',
    status: 'Open contribution',
    blurb:
      'I contributed my time to Stemplore, helping build a Flutter app for their web-based learning platform, which helps students learn through online tutorials. Repository: stemplore_react.',
    tags: ['flutter'],
    stack: ['Dart', 'Flutter'],
    live: null,
    repo: null, // paste the stemplore_react repo URL here
  },
  {
    title: 'Jarvis',
    status: 'AI assistant',
    blurb:
      'An AI companion I built to act as my assistant while I use my computer, automating everyday tasks so I can stay focused on the work.',
    tags: ['ai'],
    stack: ['AI', 'Automation'],
    live: null,
    repo: null, // paste the Jarvis repo URL here
  },
  {
    title: 'Musis Collection',
    status: 'Client website',
    blurb:
      "A website I built for a friend's shoe brand to showcase its collection, with interactive 3D touches.",
    tags: ['threejs', 'javascript', 'web'],
    stack: ['JavaScript', 'three.js'],
    live: null,
    repo: 'https://github.com/OswanYunus/musiscollection',
  },
  {
    title: 'Project 101',
    status: 'Mobile app',
    blurb: 'A mobile app built with Flutter.',
    tags: ['flutter'],
    stack: ['Dart', 'Flutter'],
    live: null,
    repo: 'https://github.com/OswanYunus/project101',
  },
  {
    title: '2D Simulator',
    status: 'School project',
    blurb: 'A 2D simulator built from scratch as a school project, and my first step into game-style programming.',
    tags: ['gamedev'],
    stack: ['From scratch'],
    live: null,
    repo: 'https://github.com/OswanYunus/2D-simulator',
  },
  {
    title: 'DNS Spoofing Tutorials',
    status: 'Security awareness',
    blurb:
      'Tutorials showing how a site can be spoofed and the steps a company or firm can take to prevent it.',
    tags: ['security'],
    stack: ['Networking', 'Security'],
    live: null,
    repo: 'https://github.com/OswanYunus/Dns-spoofing-tutorials',
  },
  {
    title: 'Crystalline Aquatics',
    status: 'Web project',
    blurb: 'A JavaScript web project. Open the repo to see how it is put together.',
    tags: ['javascript', 'web'],
    stack: ['JavaScript'],
    live: null,
    repo: 'https://github.com/OswanYunus/crystalline-aquatics',
  },
];

export const timeline = [
  {
    when: 'Now',
    title: 'BSc Computer Science',
    body: 'Studying computer science, with graduation expected in November 2027 (date to be confirmed).',
    kind: 'study',
  },
  {
    when: 'Live in production',
    title: 'Cerebro WhatsApp SaaS',
    body: 'Designed and built a multi-tenant WhatsApp platform from scratch: React dashboard, Fastify API, queues, billing and a Developer API.',
    kind: 'work',
  },
  {
    when: 'Company work',
    title: 'Tukonect Digital',
    body: 'Took part in building the company website and the platform behind wa.tukonectdigital.co.ke.',
    kind: 'work',
  },
  {
    when: 'Open contribution',
    title: 'Stemplore',
    body: 'Contributed free work building a Flutter app for their web-based learning platform.',
    kind: 'community',
  },
  {
    when: 'Ongoing',
    title: 'Tech forum contributor',
    body: 'Sharing knowledge and asking good questions in online tech communities.',
    kind: 'community',
  },
  {
    when: 'Next',
    title: 'First role',
    body: 'Looking for an internship or junior role in full-stack development or games.',
    kind: 'next',
  },
];

export const hobbies = [
  {
    title: 'Movies',
    front: 'Watching movies',
    back: 'Into the Spider-Verse is the visual reference for this whole site: halftone dots, colour offsets, hand-lettered sound effects.',
  },
  {
    title: 'Comics',
    front: 'Reading comics',
    back: 'Comics taught me that a good layout tells you where to look. That thinking went straight into the page design.',
  },
  {
    title: 'Music',
    front: 'Loving music',
    back: 'Music is a big part of my life, and it is always somewhere in the background of how I create.',
  },
  {
    title: 'Tech forums',
    front: 'Online tech forums',
    back: 'Helping in forums is the fastest way to find out what I really understand, and to meet people who know more.',
  },
  {
    title: 'Football',
    front: 'Manchester City',
    back: 'Sky blue is a whole dimension on this site. Try the City button in the top bar. Then play the keepy-uppy game below.',
  },
];

export const roadmap = [
  { id: 'mini', title: 'Make a first mini-game', body: 'Keepy-uppy, playable on this page.', done: true },
  { id: 'engine', title: 'Pick an engine', body: 'Spend a weekend each on Godot and Unity, then choose one to go deep on.' },
  { id: 'sim', title: 'Grow the 2D simulator', body: 'Turn the school project into something playable, with a demo and a readme.' },
  { id: 'week', title: 'Ship a tiny game in a week', body: 'Pong or a small platformer. Small, finished, public.' },
  { id: 'jam', title: 'Join a game jam', body: 'A deadline and a theme force you to finish. itch.io lists jams all year.' },
  { id: '3d', title: 'Bring in 3D', body: 'Use the three.js skills from this site to make a small 3D game.' },
];