const video = document.querySelector('.background-video');
const progress = document.getElementById('loading-progress');
const status = document.getElementById('loading-status');
const page = document.documentElement;
const landing = document.getElementById('landing');
const detailPage = document.getElementById('detail-page');
const detailKicker = document.getElementById('detail-kicker');
const detailTitle = document.getElementById('detail-title');
const detailCopy = document.getElementById('detail-copy');
const socialLinks = document.getElementById('social-links');
const favouritesContent = document.getElementById('favourites-content');
const enterButton = document.getElementById('enter-button');
const music = document.getElementById('background-music');
const musicIsland = document.querySelector('.music-island');
const musicToggle = document.getElementById('music-toggle');
const trackTitle = document.getElementById('track-title');
const musicProgress = document.getElementById('music-progress-fill');
const volumeControl = document.getElementById('volume-control');
const currentTimeLabel = document.getElementById('current-time');
const totalTimeLabel = document.getElementById('total-time');
const visitorCount = document.getElementById('visitor-count');
const newYearCountdown = document.getElementById('new-year-countdown');
const gameScreen = document.getElementById('game-screen');
const gameSplash = document.getElementById('game-splash');
const gameCanvas = document.getElementById('asteroids-canvas');
const gameScore = document.getElementById('game-score');
const gameLives = document.getElementById('game-lives');
const gameKicker = document.getElementById('game-kicker');
const gameTitle = document.getElementById('game-title');
const powerStatus = document.getElementById('power-status');
const powerTime = document.getElementById('power-time');
const themes = [
  { name: 'blue', video: 'background%20thingy/1.mp4' },
  { name: 'white', video: 'background%20thingy/2.mp4' },
  { name: 'grey', video: 'background%20thingy/3.mp4' }
];
let previousTheme = '';
try { previousTheme = localStorage.getItem('lemon-sushi-theme') || ''; } catch (_) {}
const themeOptions = themes.filter((theme) => theme.name !== previousTheme);
const selectedTheme = themeOptions[Math.floor(Math.random() * themeOptions.length)] || themes[0];
page.classList.add(`theme-${selectedTheme.name}`);
try { localStorage.setItem('lemon-sushi-theme', selectedTheme.name); } catch (_) {}
video.src = selectedTheme.video;
video.load();
let videoStarted = false;
const startVideo = () => {
  if (videoStarted) return;
  videoStarted = true;
  video.play().catch(() => {});
};
const tracks = [
  { title: 'open hearts — the weeknd', src: 'music%20player/the-weeknd-open-hearts-audio-128-ytshorts.savetube.me.mp3' },
  { title: 'nobody new — the marías', src: 'music%20player/the-marias-nobody-new-128-ytshorts.savetube.me.mp3' },
  { title: 'no one noticed — extended spanish', src: 'music%20player/no-one-noticed-extended-spanish-128-ytshorts.savetube.me.mp3' },
  { title: 'washing machine heart — mitski', src: 'music%20player/mitski-washing-machine-heart-128-ytshorts.savetube.me.mp3' }
];
let currentTrack = 0;
let activeDirection = 'down';
let targetVolume = 0.26;
let volumeFade;
let isEnding = false;
const destinations = {
  about: { direction: 'down', kicker: 'a little introduction', title: 'about myself', copy: 'My name is lemon. It is an internet alias, but it gets the job done. I like playing games—gacha games, Minecraft, and all that. I stopped Roblox; it is brainrot. I make bots for Discord servers and stuff, and low-key like doing all that. I am available on Discord, YouTube, Instagram, and Spotify. I had an X account… I think I lost it. Have a great day. cherr cherr<3' },
  socials: { direction: 'right', kicker: 'find me elsewhere', title: 'socials', copy: 'A few places you can find me.', links: [
    { label: 'discord', icon: 'icons/icons8-discord-50.png', href: 'https://discord.com/users/1371093284549693580' },
    { label: 'youtube', icon: 'icons/icons8-youtube-50.png', href: 'https://www.youtube.com/channel/UCQ6B042rQwuURLIqUs7aO1w' },
    { label: 'spotify', icon: 'icons/icons8-spotify-50.png', href: 'https://open.spotify.com/user/31zhiihcbwph7ekj6q6kw3ewofgm?si=63c24229f86d4d41' }
  ] },
  favourites: { direction: 'left', kicker: 'things i adore', title: 'favourites', copy: 'A tiny corner for games, favourites, and things worth mentioning.' }
};

document.getElementById('year').textContent = new Date().getFullYear();

const updateCountdown = () => {
  const remaining = Math.max(0, new Date(2027, 0, 1).getTime() - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining / 3600000) % 24);
  const minutes = Math.floor((remaining / 60000) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);
  newYearCountdown.textContent = remaining
    ? `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
    : 'happy 2027!';
};

const updateVisitorCounter = async () => {
  // CounterAPI keeps one shared counter for every visitor to the deployed site.
  // Change the namespace/key if this site is copied to a new URL.
  const counterUrl = 'https://api.counterapi.dev/v1/lemon-sushi-site/visits/up';
  try {
    const response = await fetch(counterUrl);
    if (!response.ok) throw new Error('Counter unavailable');
    const { count } = await response.json();
    visitorCount.textContent = Number(count).toLocaleString();
  } catch (_) {
    visitorCount.textContent = '—';
  }
};

updateCountdown();
window.setInterval(updateCountdown, 1000);
updateVisitorCounter();

const loadTrack = (index) => {
  currentTrack = index % tracks.length;
  music.src = tracks[currentTrack].src;
  trackTitle.textContent = tracks[currentTrack].title;
  musicProgress.style.width = '0%';
  currentTimeLabel.textContent = '0:00';
  totalTimeLabel.textContent = '0:00';
};
const fadeVolume = (to, duration, callback) => {
  window.clearInterval(volumeFade);
  const from = music.volume;
  const startedAt = performance.now();
  volumeFade = window.setInterval(() => {
    const amount = Math.min((performance.now() - startedAt) / duration, 1);
    music.volume = from + (to - from) * amount;
    if (amount === 1) {
      window.clearInterval(volumeFade);
      callback?.();
    }
  }, 30);
};
const playMusic = () => {
  if (music.paused) music.volume = 0;
  return music.play().then(() => {
    musicIsland.classList.add('is-playing');
    musicToggle.setAttribute('aria-label', 'Pause background music');
    fadeVolume(targetVolume, 900);
  }).catch(() => {});
};
const pauseMusic = () => {
  musicIsland.classList.remove('is-playing');
  musicToggle.setAttribute('aria-label', 'Play background music');
  fadeVolume(0, 420, () => music.pause());
};
let previousTrack = -1;
try { previousTrack = Number(localStorage.getItem('lemon-sushi-track')); } catch (_) {}
const trackOptions = tracks.map((_, index) => index).filter((index) => index !== previousTrack);
const selectedTrack = trackOptions[Math.floor(Math.random() * trackOptions.length)] ?? 0;
loadTrack(selectedTrack);
try { localStorage.setItem('lemon-sushi-track', String(selectedTrack)); } catch (_) {}
music.autoplay = true;
music.volume = 0;
musicToggle.addEventListener('click', () => music.paused ? playMusic() : pauseMusic());
volumeControl.addEventListener('input', () => {
  targetVolume = Number(volumeControl.value) / 100;
  if (!music.paused) fadeVolume(targetVolume, 160);
});
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};
music.addEventListener('loadedmetadata', () => { totalTimeLabel.textContent = formatTime(music.duration); });
music.addEventListener('timeupdate', () => {
  musicProgress.style.width = `${(music.currentTime / music.duration || 0) * 100}%`;
  currentTimeLabel.textContent = formatTime(music.currentTime);
  if (music.duration && music.duration - music.currentTime < 1.15 && !isEnding) {
    isEnding = true;
    fadeVolume(0, 900);
  }
});
music.addEventListener('ended', () => { isEnding = false; loadTrack(currentTrack + 1); music.volume = 0; playMusic(); });

let currentProgress = 8;
let hasFinished = false;
const setProgress = (value) => {
  currentProgress = Math.max(currentProgress, value);
  progress.style.width = `${currentProgress}%`;
  document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', currentProgress);
};
const finishLoading = () => {
  if (hasFinished) return;
  hasFinished = true;
  setProgress(100);
  status.textContent = 'welcome in';
  window.setTimeout(() => page.classList.add('is-ready-to-enter'), 380);
};

setProgress(18);
window.addEventListener('load', () => { setProgress(88); window.setTimeout(finishLoading, 250); }, { once: true });
window.setTimeout(finishLoading, 1200);

enterButton.addEventListener('click', () => {
  if (page.classList.contains('is-loaded')) return;
  page.classList.add('is-loaded');
  // Avoid competing video/audio decoding while the entry overlay is fading out.
  window.setTimeout(() => { startVideo(); playMusic(); }, 700);
});

const renderFavourites = () => {
  favouritesContent.hidden = false;
  favouritesContent.innerHTML = `
    <article class="arcade-card">
      <div class="asteroids-preview" aria-hidden="true"><i></i><i></i><i></i><span>✦</span><b>△</b></div>
      <div class="arcade-copy"><p>lemon arcade / 01</p><h3>asteroids</h3><span>an old-school trip through deep space.</span></div>
      <button class="play-game" id="play-game" type="button">play game <span>↗</span></button>
    </article>
    <article class="arcade-card pacman-card">
      <div class="pacman-preview" aria-hidden="true"><b>●</b><i></i><i></i><i></i><span>●　●　●　●　●</span></div>
      <div class="arcade-copy"><p>lemon arcade / 02</p><h3>pac-man</h3><span>clear the maze before the ghosts catch you.</span></div>
      <div class="map-picker" role="group" aria-label="Choose Pac-Man map"><button class="map-choice is-selected" data-map="0" type="button">maze I</button><button class="map-choice" data-map="1" type="button">maze II</button><button class="map-choice" data-map="2" type="button">maze III</button></div>
      <button class="play-game" id="play-pacman" type="button">play game <span>↗</span></button>
    </article>
    <section class="honourable-mentions"><p class="mentions-label">honourable mentions</p><ul><li>Moeko — my best friend / brother</li><li>Frieren-sama — my best friend</li><li>minecraft — always a classic</li><li>gacha games &amp; collecting little guys</li><li>late-night music and pretty internet corners</li><li>discord bots that somehow become projects</li></ul></section>`;
  document.getElementById('play-game').addEventListener('click', () => startGame('asteroids'));
  let selectedMap = 0;
  document.querySelectorAll('.map-choice').forEach((button) => button.addEventListener('click', () => { selectedMap = Number(button.dataset.map); document.querySelectorAll('.map-choice').forEach((item) => item.classList.toggle('is-selected', item === button)); }));
  document.getElementById('play-pacman').addEventListener('click', () => startGame('pacman', selectedMap));
};

let animationFrame;
let gameActive = false;
let gameState;
let gameMode = 'asteroids';
let pacmanState;
const pressedKeys = new Set();
const gameContext = gameCanvas.getContext('2d');
const random = (min, max) => Math.random() * (max - min) + min;

const playDeathSound = () => {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(210, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(45, context.currentTime + .42);
    gain.gain.setValueAtTime(.13, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .45);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + .45);
    oscillator.addEventListener('ended', () => context.close());
  } catch (_) {}
};
const playMilestoneSound = () => {
  try {
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.setValueAtTime(.075, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .34);
    gain.connect(context.destination);
    [660, 990].forEach((frequency, index) => { const oscillator = context.createOscillator(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * .09); oscillator.connect(gain); oscillator.start(context.currentTime + index * .09); oscillator.stop(context.currentTime + .34); });
    window.setTimeout(() => context.close(), 450);
  } catch (_) {}
};
const resizeGame = () => {
  gameCanvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
  gameCanvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
  gameCanvas.style.width = `${window.innerWidth}px`;
  gameCanvas.style.height = `${window.innerHeight}px`;
  gameContext.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
};
const makeAsteroid = (size = 44) => ({ x: random(0, innerWidth), y: random(0, innerHeight), vx: random(-1.15, 1.15), vy: random(-1.15, 1.15), size, angle: random(0, Math.PI), spin: random(-.02, .02), points: Array.from({ length: 9 }, () => random(.72, 1.18)) });
const drawAsteroid = (rock) => {
  gameContext.save(); gameContext.translate(rock.x, rock.y); gameContext.rotate(rock.angle); gameContext.beginPath();
  rock.points.forEach((point, index) => { const angle = index / rock.points.length * Math.PI * 2; const radius = rock.size * point; const x = Math.cos(angle) * radius; const y = Math.sin(angle) * radius; index ? gameContext.lineTo(x, y) : gameContext.moveTo(x, y); });
  gameContext.closePath(); gameContext.stroke(); gameContext.restore();
};
const wrap = (thing) => { if (thing.x < -50) thing.x = innerWidth + 50; if (thing.x > innerWidth + 50) thing.x = -50; if (thing.y < -50) thing.y = innerHeight + 50; if (thing.y > innerHeight + 50) thing.y = -50; };
const resetShip = () => { gameState.ship = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, vy: 0, angle: -Math.PI / 2, invincible: 30 }; };
const resetGame = () => { gameState = { score: 0, lives: 3, bullets: [], particles: [], rocks: [makeAsteroid(54), makeAsteroid(46), makeAsteroid(42)], stars: Array.from({ length: 55 }, () => ({ x: random(0, innerWidth), y: random(0, innerHeight), size: random(.35, 1.35), phase: random(0, Math.PI * 2) })) }; resetShip(); gameScore.textContent = '000000'; gameLives.textContent = '3'; };
const spawnDeathParticles = (x, y) => { for (let index = 0; index < 26; index++) { const angle = random(0, Math.PI * 2); const speed = random(1.2, 5); gameState.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: random(25, 50), maxLife: 50 }); } };
const spawnAsteroidParticles = (x, y) => { for (let index = 0; index < 14; index++) { const angle = random(0, Math.PI * 2); const speed = random(.7, 3.7); gameState.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: random(15, 35), maxLife: 35, asteroid: true }); } };
const destroyShip = () => { if (gameState.ship.invincible > 0 || !gameActive) return; spawnDeathParticles(gameState.ship.x, gameState.ship.y); playDeathSound(); gameState.lives -= 1; gameLives.textContent = gameState.lives; if (gameState.lives < 1) { window.setTimeout(resetGame, 550); resetShip(); return; } resetShip(); };
const gameLoop = () => {
  if (!gameActive) return;
  const { ship, rocks, bullets } = gameState;
  gameContext.fillStyle = '#050508'; gameContext.fillRect(0, 0, innerWidth, innerHeight);
  gameState.stars.forEach((star) => { const glow = .16 + (Math.sin(performance.now() / 850 + star.phase) + 1) * .16; gameContext.fillStyle = `rgba(255,248,231,${glow})`; gameContext.fillRect(star.x, star.y, star.size, star.size); });
  gameState.particles.forEach((particle) => { particle.x += particle.vx; particle.y += particle.vy; particle.vx *= .96; particle.vy *= .96; particle.life--; const colour = particle.asteroid ? `rgba(225,166,115,${Math.max(0, particle.life / particle.maxLife)})` : `rgba(255,${Math.round(130 + particle.life * 2)},90,${Math.max(0, particle.life / particle.maxLife)})`; gameContext.fillStyle = colour; gameContext.fillRect(particle.x, particle.y, particle.asteroid ? 2 : 2.5, particle.asteroid ? 2 : 2.5); });
  gameState.particles = gameState.particles.filter((particle) => particle.life > 0);
  gameContext.strokeStyle = '#e1a673'; gameContext.lineWidth = 1.5;
  if (pressedKeys.has('ArrowLeft')) ship.angle -= .075;
  if (pressedKeys.has('ArrowRight')) ship.angle += .075;
  if (pressedKeys.has('ArrowUp')) { ship.vx += Math.cos(ship.angle) * .08; ship.vy += Math.sin(ship.angle) * .08; }
  ship.x += ship.vx; ship.y += ship.vy; ship.vx *= .99; ship.vy *= .99; ship.invincible = Math.max(0, ship.invincible - 1); wrap(ship);
  const speedMultiplier = 1 + Math.min(gameState.score / 4200, 1.25);
  rocks.forEach((rock) => { rock.x += rock.vx * speedMultiplier; rock.y += rock.vy * speedMultiplier; rock.angle += rock.spin * speedMultiplier; wrap(rock); drawAsteroid(rock); if (Math.hypot(ship.x - rock.x, ship.y - rock.y) < rock.size + 20) destroyShip(); });
  bullets.forEach((bullet) => { bullet.x += bullet.vx; bullet.y += bullet.vy; bullet.life--; wrap(bullet); gameContext.fillStyle = '#fff8e7'; gameContext.fillRect(bullet.x - 1, bullet.y - 1, 3, 3); });
  gameState.bullets = bullets.filter((bullet) => bullet.life > 0);
  for (let b = gameState.bullets.length - 1; b >= 0; b--) for (let r = rocks.length - 1; r >= 0; r--) if (Math.hypot(gameState.bullets[b].x - rocks[r].x, gameState.bullets[b].y - rocks[r].y) < rocks[r].size) { const rock = rocks[r]; spawnAsteroidParticles(rock.x, rock.y); rocks.splice(r, 1); gameState.bullets.splice(b, 1); gameState.score += 100; gameScore.textContent = String(gameState.score).padStart(6, '0'); if (gameState.score % 500 === 0) { gameScore.classList.remove('score-pop'); void gameScore.offsetWidth; gameScore.classList.add('score-pop'); playMilestoneSound(); } const targetRocks = 3 + Math.min(Math.floor(gameState.score / 500), 8); while (rocks.length < targetRocks) rocks.push(makeAsteroid(random(28, 52))); break; }
  gameContext.save(); gameContext.translate(ship.x, ship.y); gameContext.rotate(ship.angle); if (ship.invincible % 12 < 7) { gameContext.beginPath(); gameContext.moveTo(15, 0); gameContext.lineTo(-10, -9); gameContext.lineTo(-5, 0); gameContext.lineTo(-10, 9); gameContext.closePath(); gameContext.stroke(); } gameContext.restore();
  animationFrame = requestAnimationFrame(gameLoop);
};
const fireBullet = () => { if (!gameActive || !gameState || gameState.bullets.length > 5) return; const ship = gameState.ship; gameState.bullets.push({ x: ship.x + Math.cos(ship.angle) * 16, y: ship.y + Math.sin(ship.angle) * 16, vx: ship.vx + Math.cos(ship.angle) * 7, vy: ship.vy + Math.sin(ship.angle) * 7, life: 55 }); };
const pacMazes = [
  ['#####################','#.........#.........#','#.###.###.#.###.###.#','#m#.....#...#.....#m#','#.###.#.#####.#.###.#','#.....#...#...#.....#','#####.###.#.###.#####','#.....#...#...#.....#','#.###.#.#####.#.###.#','#m#.....#...#.....#m#','#.###.###.#.###.###.#','#.........#.........#','#####################'],
  ['#####################','#.........#.........#','#.#####.#.#.#.#####.#','#.....#.#...#.#.....#','###.#.#.#####.#.#.###','#m..#...#.....#...#m#','#.#####.#.###.#.#####','#.....#.#...#.#.....#','#.###.#.#####.#.###.#','#...#...#.....#...#.#','#.#.###.#.###.###.#.#','#.................#.#','#####################'],
  ['#####################','#.........#.........#','#.###.###.#.###.###.#','#...#.....#.....#...#','###.#.###.###.###.#.#','#m..#.#.....#.....#m#','#.###.#.###.#.###.###','#.....#.#...#.#.....#','#.#####.#.###.#.#####','#...#...#.....#...#.#','#.#.#.###.###.#.#.#.#','#.................#.#','#####################']
];
const pacDirections = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
let selectedPacMap = 0;
const resetPacman = () => { const ghostStarts = [[{ x: 19, y: 11 }, { x: 18, y: 1 }, { x: 10, y: 3 }], [{ x: 19, y: 11 }, { x: 18, y: 1 }, { x: 10, y: 3 }], [{ x: 19, y: 11 }, { x: 18, y: 1 }, { x: 9, y: 3 }]][selectedPacMap]; const colours = ['#d76669', '#79b6e8', '#e98bc1']; pacmanState = { maze: pacMazes[selectedPacMap].map((row) => row.split('')), player: { x: 1, y: 1, displayX: 1, displayY: 1, direction: 'ArrowRight', next: 'ArrowRight' }, ghosts: ghostStarts.map((ghost, index) => ({ ...ghost, colour: colours[index], displayX: ghost.x, displayY: ghost.y, direction: 'ArrowLeft', homeX: ghost.x, homeY: ghost.y, respawnAt: 0 })), score: 0, lives: 3, lastMove: 0, powerUntil: 0 }; gameScore.textContent = '000000'; gameLives.textContent = '3'; powerStatus.hidden = true; };
const isPacWall = (x, y) => pacmanState.maze[y]?.[x] === '#';
const movePacEntity = (entity, direction) => { const [x, y] = pacDirections[direction]; if (!isPacWall(entity.x + x, entity.y + y)) { entity.x += x; entity.y += y; return true; } return false; };
const nextGhostDirection = (ghost, target) => { const directions = Object.keys(pacDirections); const queue = [{ x: ghost.x, y: ghost.y, first: null }]; const visited = new Set([`${ghost.x},${ghost.y}`]); while (queue.length) { const current = queue.shift(); if (current.x === target.x && current.y === target.y) return current.first || ghost.direction; for (const direction of directions) { const [dx, dy] = pacDirections[direction]; const x = current.x + dx; const y = current.y + dy; const key = `${x},${y}`; if (!visited.has(key) && !isPacWall(x, y)) { visited.add(key); queue.push({ x, y, first: current.first || direction }); } } } return directions.find((direction) => !isPacWall(ghost.x + pacDirections[direction][0], ghost.y + pacDirections[direction][1])) || ghost.direction; };
const drawPacman = () => {
  const maze = pacmanState.maze; const tile = Math.min((innerWidth - 30) / maze[0].length, (innerHeight - 115) / maze.length, 42); const offsetX = (innerWidth - maze[0].length * tile) / 2; const offsetY = (innerHeight - maze.length * tile) / 2;
  gameContext.fillStyle = '#050508'; gameContext.fillRect(0, 0, innerWidth, innerHeight);
  maze.forEach((row, y) => row.forEach((cell, x) => { const px = offsetX + x * tile; const py = offsetY + y * tile; if (cell === '#') { gameContext.fillStyle = 'rgba(225,166,115,.42)'; gameContext.fillRect(px + 2, py + 2, tile - 4, tile - 4); } if (cell === '.') { gameContext.fillStyle = '#fff8e7'; gameContext.beginPath(); gameContext.arc(px + tile / 2, py + tile / 2, Math.max(2, tile * .06), 0, Math.PI * 2); gameContext.fill(); } if (cell === 'm') { gameContext.fillStyle = '#df655d'; gameContext.beginPath(); gameContext.arc(px + tile / 2, py + tile * .56, tile * .2, Math.PI, 0); gameContext.fill(); gameContext.fillStyle = '#fff8e7'; gameContext.fillRect(px + tile * .46, py + tile * .56, tile * .08, tile * .2); } }));
  const player = pacmanState.player; player.displayX += (player.x - player.displayX) * .24; player.displayY += (player.y - player.displayY) * .24; const pcx = offsetX + (player.displayX + .5) * tile; const pcy = offsetY + (player.displayY + .5) * tile; const angle = player.direction === 'ArrowLeft' ? Math.PI : player.direction === 'ArrowUp' ? -Math.PI / 2 : player.direction === 'ArrowDown' ? Math.PI / 2 : 0; const mouth = .17 + (Math.sin(performance.now() / 85) + 1) * .13; gameContext.fillStyle = '#f6c64b'; gameContext.beginPath(); gameContext.moveTo(pcx, pcy); gameContext.arc(pcx, pcy, tile * .34, angle + mouth, angle + Math.PI * 2 - mouth); gameContext.fill();
  pacmanState.ghosts.forEach((ghost) => { if (ghost.respawnAt > performance.now()) return; ghost.displayX += (ghost.x - ghost.displayX) * .2; ghost.displayY += (ghost.y - ghost.displayY) * .2; const cx = offsetX + (ghost.displayX + .5) * tile; const cy = offsetY + (ghost.displayY + .5) * tile; const powered = performance.now() < pacmanState.powerUntil; gameContext.fillStyle = powered ? '#5f7cd7' : ghost.colour; gameContext.beginPath(); gameContext.arc(cx, cy - tile * .03, tile * .3, Math.PI, 0); gameContext.lineTo(cx + tile * .3, cy + tile * .29); gameContext.lineTo(cx + tile * .1, cy + tile * .21); gameContext.lineTo(cx, cy + tile * .29); gameContext.lineTo(cx - tile * .1, cy + tile * .21); gameContext.lineTo(cx - tile * .3, cy + tile * .29); gameContext.closePath(); gameContext.fill(); gameContext.fillStyle = '#fff'; [-.11, .11].forEach((offset) => { gameContext.beginPath(); gameContext.arc(cx + tile * offset, cy - tile * .03, tile * .09, 0, Math.PI * 2); gameContext.fill(); }); gameContext.fillStyle = '#151522'; [-.11, .11].forEach((offset) => { gameContext.beginPath(); gameContext.arc(cx + tile * offset + (ghost.direction === 'ArrowRight' ? 2 : ghost.direction === 'ArrowLeft' ? -2 : 0), cy - tile * .03, tile * .04, 0, Math.PI * 2); gameContext.fill(); }); });
};
const pacmanLoop = (time) => {
  if (!gameActive || gameMode !== 'pacman') return;
  const powered = time < pacmanState.powerUntil; powerStatus.hidden = !powered; if (powered) powerTime.textContent = ((pacmanState.powerUntil - time) / 1000).toFixed(1);
  if (time - pacmanState.lastMove > 205) { pacmanState.lastMove = time; const { player } = pacmanState; if (!movePacEntity(player, player.next)) movePacEntity(player, player.direction); else player.direction = player.next; pacmanState.ghosts.forEach((ghost, index) => { if (ghost.respawnAt > time) return; if (ghost.respawnAt) { ghost.x = ghost.homeX; ghost.y = ghost.homeY; ghost.displayX = ghost.x; ghost.displayY = ghost.y; ghost.respawnAt = 0; } const lead = index === 1 ? 2 : index === 2 ? -2 : 0; const target = powered ? { x: ghost.homeX, y: ghost.homeY } : { x: player.x + pacDirections[player.direction][0] * lead, y: player.y + pacDirections[player.direction][1] * lead }; ghost.direction = nextGhostDirection(ghost, target); movePacEntity(ghost, ghost.direction); }); const cell = pacmanState.maze[player.y][player.x]; if (cell === '.' || cell === 'm') { pacmanState.maze[player.y][player.x] = ' '; pacmanState.score += cell === 'm' ? 50 : 10; if (cell === 'm') pacmanState.powerUntil = time + 5000; gameScore.textContent = String(pacmanState.score).padStart(6, '0'); } pacmanState.ghosts.forEach((ghost) => { if (ghost.respawnAt <= time && player.x === ghost.x && player.y === ghost.y) { if (powered) { pacmanState.score += 200; gameScore.textContent = String(pacmanState.score).padStart(6, '0'); ghost.respawnAt = time + 1200; } else { playDeathSound(); pacmanState.lives--; gameLives.textContent = pacmanState.lives; player.x = player.displayX = 1; player.y = player.displayY = 1; if (!pacmanState.lives) resetPacman(); } } }); if (!pacmanState.maze.some((row) => row.includes('.') || row.includes('m'))) resetPacman(); }
  drawPacman(); animationFrame = requestAnimationFrame(pacmanLoop);
};
function startGame(mode = 'asteroids', mapIndex = 0) {
  gameMode = mode;
  pauseMusic(); resizeGame(); resetGame(); gameScreen.hidden = false; gameScreen.setAttribute('aria-hidden', 'false'); gameActive = true;
  if (mode === 'pacman') { selectedPacMap = mapIndex; resetPacman(); gameTitle.textContent = 'pac-man'; gameKicker.textContent = `lemon arcade / maze ${mapIndex + 1}`; } else { powerStatus.hidden = true; gameTitle.textContent = 'asteroids'; gameKicker.textContent = 'lemon arcade / 01'; }
  requestAnimationFrame(() => { gameScreen.classList.add('is-open'); window.setTimeout(() => gameSplash.classList.add('is-hidden'), 850); if (mode === 'pacman') pacmanLoop(performance.now()); else gameLoop(); });
}
const stopGame = () => { gameActive = false; cancelAnimationFrame(animationFrame); gameScreen.classList.remove('is-open'); gameScreen.setAttribute('aria-hidden', 'true'); gameSplash.classList.remove('is-hidden'); window.setTimeout(() => { gameScreen.hidden = true; }, 450); };
document.getElementById('exit-game').addEventListener('click', stopGame);
window.addEventListener('resize', () => { if (gameActive) resizeGame(); });
window.addEventListener('keydown', (event) => { if (!gameActive) return; if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) event.preventDefault(); if (gameMode === 'pacman' && pacDirections[event.key]) { pacmanState.player.next = event.key; return; } pressedKeys.add(event.key); if (event.key === ' ') fireBullet(); });
window.addEventListener('keyup', (event) => pressedKeys.delete(event.key));
document.querySelectorAll('.touch-controls button').forEach((button) => {
  const key = button.dataset.key;
  const release = () => pressedKeys.delete(key);
  button.addEventListener('pointerdown', (event) => { event.preventDefault(); if (gameMode === 'pacman' && pacDirections[key]) { pacmanState.player.next = key; return; } if (key === 'fire') fireBullet(); else pressedKeys.add(key); });
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('pointerleave', release);
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const key = link.getAttribute('href').slice(1);
    const destination = destinations[key];
    activeDirection = destination.direction;
    detailKicker.textContent = destination.kicker;
    detailTitle.textContent = destination.title;
    detailCopy.textContent = destination.copy;
    favouritesContent.hidden = key !== 'favourites';
    if (key === 'favourites') renderFavourites();
    socialLinks.replaceChildren();
    destination.links?.forEach(({ label, icon, href }) => {
      const linkItem = document.createElement('a');
      linkItem.href = href;
      linkItem.target = '_blank';
      linkItem.rel = 'noopener noreferrer';
      const iconImage = document.createElement('img');
      iconImage.src = icon;
      iconImage.alt = '';
      const labelText = document.createElement('span');
      labelText.textContent = label;
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      linkItem.append(iconImage, labelText, arrow);
      socialLinks.append(linkItem);
    });
    landing.classList.add('is-leaving', `direction-${destination.direction}`);
    window.setTimeout(() => {
      landing.hidden = true;
      detailPage.classList.add('is-open');
      detailPage.setAttribute('aria-hidden', 'false');
    }, 570);
  });
});

document.getElementById('back-button').addEventListener('click', () => {
  detailPage.classList.remove('is-open');
  detailPage.classList.add('is-closing');
  window.setTimeout(() => {
    detailPage.classList.remove('is-closing');
    detailPage.setAttribute('aria-hidden', 'true');
    landing.hidden = false;
    landing.classList.remove('is-leaving', 'direction-left', 'direction-right', 'direction-down');
    landing.classList.add('is-returning', `direction-${activeDirection}`);
    window.setTimeout(() => landing.classList.remove('is-returning', `direction-${activeDirection}`), 630);
  }, 470);
});
