/* ═══════════════════════════════════════════════════════════════
   राधे राधे — Krishna Music Experience
   script.js
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Visual Assets ─── */
const visuals = [
  'assets/1.png',
  'assets/2.png',
  'assets/3.png',
  'assets/4.png',
  'assets/5.png',
  'assets/6.png',
  'assets/7.png',
  'assets/8.png',
  'assets/9.png',
];

/* ─── Playlist ID ─── */
const PLAYLIST_ID = 'PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl';

/* ─── App State ─── */
const state = {
  isPlaying: false,
  currentPlaylistIndex: 0,
  currentVideoId: null,
  volume: 70,
  isMuted: false,
  duration: 0,
  currentTime: 0,
  activeBg: 'A',          // 'A' or 'B'
  drawerOpen: false,
  playlistTitles: [],      // cached from API
  ytReady: false,
  progressDragging: false,
};

/* ─── Element References ─── */
const els = {
  bgA:              document.getElementById('bgA'),
  bgB:              document.getElementById('bgB'),
  clock:            document.getElementById('clockDisplay'),
  brandTitle:       document.getElementById('brandTitle'),
  songTitle:        document.getElementById('songTitle'),
  songArtist:       document.getElementById('songArtist'),
  playBtn:          document.getElementById('playBtn'),
  playIcon:         document.getElementById('playIcon'),
  pauseIcon:        document.getElementById('pauseIcon'),
  prevBtn:          document.getElementById('prevBtn'),
  nextBtn:          document.getElementById('nextBtn'),
  muteBtn:          document.getElementById('muteBtn'),
  volIcon:          document.getElementById('volIcon'),
  volSlider:        document.getElementById('volSlider'),
  progressTrack:    document.getElementById('progressTrack'),
  progressFill:     document.getElementById('progressFill'),
  progressThumb:    document.getElementById('progressThumb'),
  timeCurrent:      document.getElementById('timeCurrent'),
  timeDuration:     document.getElementById('timeDuration'),
  nowPlayingDot:    document.getElementById('nowPlayingDot'),
  playlistToggleBtn:document.getElementById('playlistToggleBtn'),
  playlistDrawer:   document.getElementById('playlistDrawer'),
  drawerCloseBtn:   document.getElementById('drawerCloseBtn'),
  drawerBackdrop:   document.getElementById('drawerBackdrop'),
  drawerList:       document.getElementById('drawerList'),
  toast:            document.getElementById('toast'),
  particleCanvas:   document.getElementById('particleCanvas'),
  dayDisplay:       document.getElementById('dayDisplay'),
  fullscreenBtn:    document.getElementById('fullscreenBtn'),
  songThumb:        document.getElementById('songThumb'),
};

/* ════════════════════════════════════════════════════════════════
   CLOCK
════════════════════════════════════════════════════════════════ */
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  els.clock.textContent = `${h}:${m} ${ampm}`;
  if (els.dayDisplay) els.dayDisplay.textContent = DAYS[now.getDay()];
}
updateClock();
setInterval(updateClock, 15000);

/* ════════════════════════════════════════════════════════════════
   BACKGROUND / CROSSFADE
════════════════════════════════════════════════════════════════ */
function preloadVisuals() {
  visuals.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

function setBackground(index, instant = false) {
  const safeIndex = ((index % visuals.length) + visuals.length) % visuals.length;
  const src = visuals[safeIndex];

  if (els.songThumb) els.songThumb.src = src;

  // Determine which layer is currently "active" (visible)
  const activeBgEl  = state.activeBg === 'A' ? els.bgA : els.bgB;
  const inactiveBgEl = state.activeBg === 'A' ? els.bgB : els.bgA;

  if (instant) {
    activeBgEl.style.backgroundImage = `url('${src}')`;
    activeBgEl.style.opacity = '1';
    activeBgEl.classList.add('active');
    inactiveBgEl.style.opacity = '0';
    inactiveBgEl.classList.remove('active');
    return;
  }

  // Preload next image then crossfade
  const img = new Image();
  img.onload = () => {
    inactiveBgEl.style.backgroundImage = `url('${src}')`;
    inactiveBgEl.style.opacity = '0';
    inactiveBgEl.classList.remove('active');

    // Small timeout so browser has painted the background
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inactiveBgEl.style.opacity = '1';
        inactiveBgEl.classList.add('active');
        activeBgEl.style.opacity = '0';
        activeBgEl.classList.remove('active');
        state.activeBg = state.activeBg === 'A' ? 'B' : 'A';
      });
    });
  };
  img.onerror = () => {
    // If image fails, just keep current background
    console.warn('Failed to load visual:', src);
  };
  img.src = src;
}

// Set initial background
setBackground(0, true);
preloadVisuals();

/* ════════════════════════════════════════════════════════════════
   TIME FORMATTING
════════════════════════════════════════════════════════════════ */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

/* ════════════════════════════════════════════════════════════════
   PROGRESS BAR
════════════════════════════════════════════════════════════════ */
function updateProgressUI(currentTime, duration) {
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  els.progressFill.style.width = `${pct}%`;
  els.progressThumb.style.left = `${pct}%`;
  els.progressTrack.setAttribute('aria-valuenow', Math.round(pct));
  els.timeCurrent.textContent = formatTime(currentTime);
  els.timeDuration.textContent = formatTime(duration);
}

function getProgressClickPct(e) {
  const rect = els.progressTrack.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let pct = (clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(1, pct));
}

els.progressTrack.addEventListener('mousedown', (e) => {
  state.progressDragging = true;
  seekToPercent(getProgressClickPct(e));
});

els.progressTrack.addEventListener('touchstart', (e) => {
  state.progressDragging = true;
  seekToPercent(getProgressClickPct(e));
}, { passive: true });

document.addEventListener('mousemove', (e) => {
  if (!state.progressDragging) return;
  seekToPercent(getProgressClickPct(e));
});

document.addEventListener('mouseup', () => { state.progressDragging = false; });
document.addEventListener('touchend', () => { state.progressDragging = false; });

function seekToPercent(pct) {
  if (!ytPlayer || !state.duration) return;
  const seekTime = pct * state.duration;
  ytPlayer.seekTo(seekTime, true);
  updateProgressUI(seekTime, state.duration);
}

/* ════════════════════════════════════════════════════════════════
   VOLUME
════════════════════════════════════════════════════════════════ */
function updateVolSliderTrack(val) {
  const pct = val + '%';
  els.volSlider.style.setProperty('--vol-pct', pct);
  // For Webkit gradient track
  els.volSlider.style.background = `linear-gradient(90deg, #e8c56a 0%, #e8c56a ${pct}, rgba(255,255,255,0.15) ${pct}, rgba(255,255,255,0.15) 100%)`;
}

updateVolSliderTrack(state.volume);

els.volSlider.addEventListener('input', () => {
  const val = parseInt(els.volSlider.value, 10);
  state.volume = val;
  state.isMuted = val === 0;
  updateVolSliderTrack(val);
  if (ytPlayer) {
    ytPlayer.setVolume(val);
    if (val > 0 && ytPlayer.isMuted()) ytPlayer.unMute();
  }
  updateVolumeIcon();
});

els.muteBtn.addEventListener('click', () => {
  if (!ytPlayer) return;
  if (state.isMuted) {
    state.isMuted = false;
    ytPlayer.unMute();
    ytPlayer.setVolume(state.volume || 70);
    els.volSlider.value = state.volume || 70;
    updateVolSliderTrack(state.volume || 70);
  } else {
    state.isMuted = true;
    ytPlayer.mute();
    els.volSlider.value = 0;
    updateVolSliderTrack(0);
  }
  updateVolumeIcon();
});

function updateVolumeIcon() {
  const vol = parseInt(els.volSlider.value, 10);
  const muted = state.isMuted || vol === 0;

  if (muted) {
    els.volIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/>
      <line x1="17" y1="9" x2="23" y2="15"/>
    `;
    els.muteBtn.setAttribute('aria-label', 'Unmute');
  } else if (vol < 50) {
    els.volIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
    els.muteBtn.setAttribute('aria-label', 'Mute');
  } else {
    els.volIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    `;
    els.muteBtn.setAttribute('aria-label', 'Mute');
  }
}

/* ════════════════════════════════════════════════════════════════
   PLAY/PAUSE UI
════════════════════════════════════════════════════════════════ */
function setPlayingUI(playing) {
  state.isPlaying = playing;
  if (playing) {
    els.playIcon.classList.add('hidden');
    els.pauseIcon.classList.remove('hidden');
    els.playBtn.setAttribute('aria-label', 'Pause');
    els.nowPlayingDot.classList.remove('paused');
  } else {
    els.playIcon.classList.remove('hidden');
    els.pauseIcon.classList.add('hidden');
    els.playBtn.setAttribute('aria-label', 'Play');
    els.nowPlayingDot.classList.add('paused');
  }
}

/* ════════════════════════════════════════════════════════════════
   SONG METADATA
════════════════════════════════════════════════════════════════ */
function updateSongInfo(index) {
  try {
    if (!ytPlayer) return;
    const videoData = ytPlayer.getVideoData();
    if (videoData && videoData.title) {
      els.songTitle.textContent = videoData.title;
      els.songArtist.textContent = videoData.author || 'Krishna Music';
    } else {
      // Fallback
      if (state.playlistTitles[index]) {
        els.songTitle.textContent = state.playlistTitles[index];
        els.songArtist.textContent = 'Krishna Music';
      } else {
        els.songTitle.textContent = 'Now Playing';
        els.songArtist.textContent = 'राधे राधे';
      }
    }
  } catch (e) {
    els.songTitle.textContent = 'Now Playing';
    els.songArtist.textContent = 'राधे राधे';
  }
}

/* ════════════════════════════════════════════════════════════════
   PLAYLIST DRAWER
════════════════════════════════════════════════════════════════ */
function openDrawer() {
  state.drawerOpen = true;
  els.playlistDrawer.setAttribute('aria-hidden', 'false');
  els.drawerBackdrop.classList.add('visible');
  buildDrawerList();
}

function closeDrawer() {
  state.drawerOpen = false;
  els.playlistDrawer.setAttribute('aria-hidden', 'true');
  els.drawerBackdrop.classList.remove('visible');
}

function buildDrawerList() {
  els.drawerList.innerHTML = '';
  const titles = state.playlistTitles;
  const count = titles.length || 0;

  if (count === 0) {
    els.drawerList.innerHTML = '<div style="padding:20px;color:rgba(255,248,238,0.4);font-size:0.8rem;text-align:center;">Loading playlist…</div>';
    return;
  }

  titles.forEach((title, i) => {
    const item = document.createElement('div');
    item.className = 'drawer-item' + (i === state.currentPlaylistIndex ? ' active' : '');
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-label', title);

    const numEl = document.createElement('span');
    numEl.className = 'drawer-item-num';
    numEl.textContent = i + 1;

    const titleEl = document.createElement('span');
    titleEl.className = 'drawer-item-title';
    titleEl.textContent = title;

    item.appendChild(numEl);
    item.appendChild(titleEl);

    // EQ animation for currently playing
    if (i === state.currentPlaylistIndex && state.isPlaying) {
      const eq = document.createElement('div');
      eq.className = 'drawer-item-playing';
      eq.innerHTML = '<div class="bar"></div><div class="bar"></div><div class="bar"></div>';
      item.appendChild(eq);
    }

    item.addEventListener('click', () => {
      if (!ytPlayer) return;
      ytPlayer.playVideoAt(i);
      closeDrawer();
    });

    els.drawerList.appendChild(item);
  });
}

els.playlistToggleBtn.addEventListener('click', () => {
  state.drawerOpen ? closeDrawer() : openDrawer();
});
els.drawerCloseBtn.addEventListener('click', closeDrawer);
els.drawerBackdrop.addEventListener('click', closeDrawer);

/* ════════════════════════════════════════════════════════════════
   TOAST MESSAGES
════════════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg, duration = 3000) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), duration);
}

/* ════════════════════════════════════════════════════════════════
   PARTICLES (subtle ambient fireflies)
════════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = els.particleCanvas;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 35;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function randomParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.8 + Math.random() * 1.6,
      alpha: 0,
      targetAlpha: 0.2 + Math.random() * 0.5,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(0.06 + Math.random() * 0.16),
      life: 0,
      maxLife: 200 + Math.random() * 400,
      color: Math.random() < 0.6 ? '#e8c56a' : '#a8d8ea',
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = randomParticle();
    p.life = Math.random() * p.maxLife; // stagger
    particles.push(p);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;

      const halfLife = p.maxLife / 2;
      if (p.life < halfLife) {
        p.alpha = (p.life / halfLife) * p.targetAlpha;
      } else {
        p.alpha = ((p.maxLife - p.life) / halfLife) * p.targetAlpha;
      }

      if (p.life >= p.maxLife) {
        Object.assign(p, randomParticle());
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

/* ════════════════════════════════════════════════════════════════
   YOUTUBE IFRAME PLAYER API
════════════════════════════════════════════════════════════════ */
let ytPlayer = null;
let progressInterval = null;
let pendingPlay = false; // user pressed play before player is ready

function initYouTubePlayer() {
  if (ytPlayer) return;
  
  let playerOrigin = window.location.origin;
  if (!playerOrigin || playerOrigin === 'null' || window.location.protocol === 'file:') {
    playerOrigin = undefined;
  }

  const pVars = {
    listType:       'playlist',
    list:           PLAYLIST_ID,
    autoplay:       0,
    controls:       0,
    modestbranding: 1,
    rel:            0,
    enablejsapi:    1,
    playsinline:    1,
  };
  if (playerOrigin) pVars.origin = playerOrigin;

  try {
    ytPlayer = new YT.Player('ytPlayer', {
      height: '200',
      width: '200',
      playerVars: pVars,
      events: {
        onReady:       onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError:       onPlayerError,
        onApiChange:   onApiChange,
      },
    });
  } catch (e) {
    console.warn('Failed to init YT.Player:', e);
  }
}

// Called by YouTube API when script loads
window.onYouTubeIframeAPIReady = initYouTubePlayer;

// Fallback if API already loaded before script executed
if (window.YT && window.YT.Player) {
  initYouTubePlayer();
}

function onPlayerReady(event) {
  state.ytReady = true;
  if (ytPlayer && ytPlayer.setVolume) {
    ytPlayer.setVolume(state.volume);
  }

  // Try to get playlist titles
  loadPlaylistTitles();

  // Update initial visual/song
  syncWithPlayerState();

  if (pendingPlay) {
    pendingPlay = false;
    try {
      if (ytPlayer.unMute) ytPlayer.unMute();
      ytPlayer.playVideo();
    } catch (e) {}
  }
}

function onPlayerStateChange(event) {
  const YTState = YT.PlayerState;

  switch (event.data) {
    case YTState.PLAYING:
      setPlayingUI(true);
      startProgressTracking();
      syncWithPlayerState();
      break;

    case YTState.PAUSED:
      setPlayingUI(false);
      stopProgressTracking();
      break;

    case YTState.ENDED:
      setPlayingUI(false);
      stopProgressTracking();
      break;

    case YTState.BUFFERING:
      // Keep current UI, player is buffering
      break;

    case YTState.CUED:
      syncWithPlayerState();
      break;

    default:
      break;
  }
}

function onPlayerError(event) {
  console.warn('YouTube error code:', event.data);
  if (event.data === 101 || event.data === 150 || event.data === 100 || event.data === 2) {
    showToast('Skipping unavailable track…', 2000);
    if (ytPlayer && typeof ytPlayer.nextVideo === 'function') {
      setTimeout(() => {
        try { ytPlayer.nextVideo(); } catch (e) {}
      }, 600);
    }
  } else {
    showToast('Music player ready. Click play to listen.', 4000);
  }
  setPlayingUI(false);
}

function onApiChange() {
  // Module availability changed — no action needed
}

/* ─── Sync UI with player state ─── */
function syncWithPlayerState() {
  if (!ytPlayer) return;

  try {
    const idx = ytPlayer.getPlaylistIndex();
    if (idx >= 0 && idx !== state.currentPlaylistIndex) {
      state.currentPlaylistIndex = idx;
      setBackground(idx);
      if (state.drawerOpen) buildDrawerList();
    }

    const dur = ytPlayer.getDuration();
    state.duration = dur || 0;

    updateSongInfo(state.currentPlaylistIndex);
  } catch (e) {
    // Player might not be fully ready
  }
}

/* ─── Progress Tracking ─── */
function startProgressTracking() {
  stopProgressTracking();
  progressInterval = setInterval(() => {
    if (!ytPlayer || state.progressDragging) return;
    try {
      const cur = ytPlayer.getCurrentTime() || 0;
      const dur = ytPlayer.getDuration() || 0;
      state.currentTime = cur;
      state.duration = dur;
      updateProgressUI(cur, dur);
    } catch (e) {}
  }, 800);
}

function stopProgressTracking() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

/* ─── Load Playlist Titles via oEmbed/data API trick ─── */
// We can't easily get all titles without a backend. We'll capture titles
// from getVideoData() each time a new video starts playing.
function loadPlaylistTitles() {
  // We'll build the list reactively as user navigates
  // or we can populate during drawer open
  // For now, try to get the playlist's video list length
  try {
    const list = ytPlayer.getPlaylist();
    if (list && list.length) {
      // Initialize blank titles array
      if (state.playlistTitles.length === 0) {
        state.playlistTitles = new Array(list.length).fill('Krishna Bhajan');
      }
    }
  } catch (e) {}
}

function captureCurrentTitle() {
  try {
    const data = ytPlayer.getVideoData();
    if (data && data.title) {
      const idx = ytPlayer.getPlaylistIndex();
      if (idx >= 0) {
        // Ensure array is big enough
        while (state.playlistTitles.length <= idx) {
          state.playlistTitles.push('Krishna Bhajan');
        }
        state.playlistTitles[idx] = data.title;
      }
    }
  } catch (e) {}
}

/* ════════════════════════════════════════════════════════════════
   CONTROL BUTTONS
════════════════════════════════════════════════════════════════ */
els.playBtn.addEventListener('click', () => {
  if (!ytPlayer || !state.ytReady) {
    pendingPlay = true;
    showToast('Initializing music player…');
    if (window.YT && window.YT.Player && !ytPlayer) {
      initYouTubePlayer();
    }
    return;
  }

  try {
    if (ytPlayer.isMuted && ytPlayer.isMuted()) {
      ytPlayer.unMute();
      ytPlayer.setVolume(state.volume || 70);
    }

    const playerState = ytPlayer.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  } catch (e) {
    console.warn('Error toggling play:', e);
    try { ytPlayer.playVideo(); } catch (err) {}
  }
});

els.nextBtn.addEventListener('click', () => {
  if (!ytPlayer) return;
  ytPlayer.nextVideo();
  // Brief delay then sync (gives YT time to update index)
  setTimeout(syncWithPlayerState, 600);
});

els.prevBtn.addEventListener('click', () => {
  if (!ytPlayer) return;
  // If more than 3 seconds in, restart current; else go prev
  try {
    const cur = ytPlayer.getCurrentTime() || 0;
    if (cur > 3) {
      ytPlayer.seekTo(0, true);
    } else {
      ytPlayer.previousVideo();
      setTimeout(syncWithPlayerState, 600);
    }
  } catch (e) {
    ytPlayer.previousVideo();
  }
});

/* ════════════════════════════════════════════════════════════════
   FULLSCREEN
════════════════════════════════════════════════════════════════ */
const FS_ICON_EXPAND = `<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>`;
const FS_ICON_COMPRESS = `<path d="M8 3v5H3"/><path d="M21 8h-5V3"/><path d="M3 16h5v5"/><path d="M16 21v-5h5"/>`;

function updateFsIcon() {
  if (!els.fullscreenBtn) return;
  const svg = els.fullscreenBtn.querySelector('svg');
  svg.innerHTML = document.fullscreenElement ? FS_ICON_COMPRESS : FS_ICON_EXPAND;
  els.fullscreenBtn.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen');
}

if (els.fullscreenBtn) {
  els.fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => showToast('Fullscreen not available'));
    } else {
      document.exitFullscreen();
    }
  });
  document.addEventListener('fullscreenchange', updateFsIcon);
}

/* ════════════════════════════════════════════════════════════════
   KEYBOARD SHORTCUTS (P1)
════════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Don't fire if user is typing somewhere
  if (e.target.tagName === 'INPUT') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      els.playBtn.click();
      break;
    case 'ArrowRight':
      e.preventDefault();
      els.nextBtn.click();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      els.prevBtn.click();
      break;
    case 'KeyM':
      els.muteBtn.click();
      break;
  }
});

/* ════════════════════════════════════════════════════════════════
   POLL FOR INDEX CHANGES
   YouTube onStateChange doesn't fire on playlist index change
   in all browsers, so we poll the index.
════════════════════════════════════════════════════════════════ */
setInterval(() => {
  if (!ytPlayer || !state.ytReady) return;
  try {
    const idx = ytPlayer.getPlaylistIndex();
    if (idx >= 0 && idx !== state.currentPlaylistIndex) {
      state.currentPlaylistIndex = idx;
      setBackground(idx);
      updateSongInfo(idx);
      captureCurrentTitle();
      if (state.drawerOpen) buildDrawerList();
    }
    // Also capture the current title if we haven't yet
    if (state.isPlaying) captureCurrentTitle();
  } catch (e) {}
}, 1000);

/* ════════════════════════════════════════════════════════════════
   HANDLE YOUTUBE API NOT LOADING (fallback)
════════════════════════════════════════════════════════════════ */
setTimeout(() => {
  if (!state.ytReady && !ytPlayer) {
    showToast('Music is taking a moment to load. Please check your connection.', 6000);
  }
}, 8000);

/* ════════════════════════════════════════════════════════════════
   WINDOW RESIZE: update backgrounds
════════════════════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  // backgrounds auto-resize via CSS cover — nothing to do here
});

/* ════════════════════════════════════════════════════════════════
   INITIAL VISUAL POLISH: fade in
════════════════════════════════════════════════════════════════ */
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 1.2s ease';
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
