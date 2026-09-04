# राधे राधे --- Krishna Music Experience

## Product Requirements Document (PRD)

**Version:** 1.0 --- MVP\
**Build target:** Fully functional first version in under 1 hour\
**Primary platform:** Desktop/laptop web, responsive on mobile\
**Theme:** Cinematic Indian mythological fantasy / Radha-Krishna
devotional atmosphere

------------------------------------------------------------------------

## 1. Product Overview

Build a single-page immersive music website called:

# **राधे राधे**

The website is a visual Krishna/Radha music experience rather than a
conventional music-streaming app.

When the visitor opens the website, they should immediately see a
full-screen cinematic Krishna-themed artwork. A minimal glassmorphism
music player sits near the bottom of the screen. The player uses a
YouTube playlist as its music source.

The supplied YouTube playlist is:

`https://www.youtube.com/playlist?list=PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl`

**Playlist ID:** `PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl`

Do not download or host the music. Use the YouTube IFrame Player API.

The visual artwork should change smoothly as the playlist changes from
one song to the next.

------------------------------------------------------------------------

# 2. Product Vision

The experience should feel like:

> **Entering a cinematic, peaceful world of Radha and Krishna and
> listening to music there.**

The user should notice the artwork and atmosphere first, and the
controls second.

The music player must never dominate the page.

### Core principle

**The atmosphere is the hero. The music player is the interface.**

------------------------------------------------------------------------

# 3. Brand

## Primary display name

**राधे राधे**

Use this exact Hindi text.

Do NOT display the English version as the main logo.

Optional small subtitle:

**A Krishna Music Experience**

The subtitle should be secondary and can be omitted if the artwork looks
cleaner without it.

------------------------------------------------------------------------

# 4. Typography

The main `राधे राधे` title must use a stylish Devanagari font.

Preferred direction:

1.  **Tiro Devanagari Hindi** --- elegant, devotional, refined
2.  **Kalam** --- handwritten/artistic alternative
3.  **Noto Serif Devanagari** --- fallback
4.  **Noto Sans Devanagari** --- accessibility/fallback

Preferred implementation:

``` css
font-family: "Tiro Devanagari Hindi", "Noto Serif Devanagari", serif;
```

The title should feel integrated into the artwork, not like a generic
website heading.

### Logo styling

-   large Devanagari lettering
-   warm white / ivory
-   subtle soft shadow
-   slight glow if necessary
-   no solid rectangle behind it
-   no excessive text effects
-   elegant spacing
-   centered horizontally

Example:

``` text
              राधे राधे
```

------------------------------------------------------------------------

# 5. Reference UI Direction

The provided screenshot is the primary UI/layout reference.

The composition should follow this hierarchy:

``` text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Current Time                                  Playlist / ♫  │
│                                                              │
│                                                              │
│                                                              │
│                         राधे राधे                            │
│                                                              │
│                                                              │
│                  FULL-SCREEN ARTWORK                         │
│                                                              │
│                                                              │
│                                                              │
│                                                              │
│                  ┌───────────────────────┐                   │
│                  │ ○ Song Title       ▶ │                   │
│                  │   Artist / Channel   │                   │
│                  │ ━━━━━━━━━━━━━━━━━━━   │                   │
│                  │ 0:42 / 5:12           │                   │
│                  └───────────────────────┘                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Do not copy the screenshot's branding or unrelated UI literally. Use it
only as a composition and interaction reference.

------------------------------------------------------------------------

# 6. Full-Screen Background

The current collection contains approximately 8--9 Krishna/Radha-themed
artworks.

Use these as the visual sequence.

Requirements:

-   fill the entire viewport
-   `background-size: cover` or equivalent image-cover behavior
-   never stretch/distort artwork
-   responsive crop
-   preserve important subjects such as Krishna/Radha
-   use a subtle dark/gradient overlay behind UI when required
-   no visible image borders
-   no scrolling on desktop

The page should feel like one continuous visual canvas.

------------------------------------------------------------------------

# 7. Visual Style

All images should feel like they belong to the same universe.

Target visual language:

-   cinematic
-   Indian mythological fantasy
-   painterly realism
-   highly detailed
-   devotional
-   dreamy
-   rich natural environments
-   deep Krishna blue
-   indigo
-   emerald green
-   warm gold
-   rose/pink accents
-   moonlight and/or golden-hour lighting
-   subtle glowing particles
-   atmospheric depth
-   premium fantasy illustration

Avoid mixing radically different styles.

------------------------------------------------------------------------

# 8. Visual Playlist

Create a local visual array in JavaScript.

Example:

``` js
const visuals = [
  "/assets/krishna-01.webp",
  "/assets/krishna-02.webp",
  "/assets/krishna-03.webp",
  "/assets/krishna-04.webp",
  "/assets/krishna-05.webp",
  "/assets/krishna-06.webp",
  "/assets/krishna-07.webp",
  "/assets/krishna-08.webp",
  "/assets/krishna-09.webp"
];
```

The exact filenames may be changed to match the supplied assets.

### Visual-to-song behavior

When the current YouTube playlist item changes:

``` text
Song 1 → Visual 1
Song 2 → Visual 2
Song 3 → Visual 3
...
```

If there are more songs than images:

``` js
visualIndex = playlistIndex % visuals.length;
```

This prevents the visual system from breaking when the playlist contains
more tracks.

------------------------------------------------------------------------

# 9. Image Transition

Never hard-cut from one image to another.

Use a smooth crossfade.

Recommended:

-   fade duration: 1200--1800 ms
-   optional very subtle zoom
-   optional brightness/blur transition
-   no flashy effects

Desired behavior:

``` text
CURRENT IMAGE
      ↓
  gentle fade
      ↓
NEXT IMAGE
```

The transition should feel cinematic and calm.

------------------------------------------------------------------------

# 10. Optional Background Motion

V1 may include a very subtle Ken Burns effect:

``` text
scale(1.00)
   ↓
scale(1.03–1.05)
```

over approximately 20--30 seconds.

Optional subtle particles:

-   fireflies
-   tiny glowing dots
-   drifting petals

Particles are secondary.

Do not make the page look like a gaming website.

If time is limited, skip particles and prioritize the music
functionality.

------------------------------------------------------------------------

# 11. YouTube Integration

Use the **YouTube IFrame Player API**.

Official documentation:

https://developers.google.com/youtube/iframe_api_reference

The API supports:

-   playlist loading
-   play
-   pause
-   next
-   previous
-   volume
-   seeking
-   playlist index
-   playlist state events
-   loop
-   shuffle

Use the playlist ID:

``` text
PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl
```

Do not build a custom audio downloader.

Do not download YouTube videos/audio.

Do not store music files locally.

------------------------------------------------------------------------

# 12. YouTube Player Architecture

Recommended structure:

``` text
                    WEBSITE
                       │
          ┌────────────┴────────────┐
          │                         │
      Visual Engine             Player UI
          │                         │
          │                   JavaScript controls
          │                         │
          └────────────┬────────────┘
                       │
                YouTube IFrame API
                       │
                       ▼
               YouTube Playlist
```

The YouTube iframe should not visually dominate the page.

The custom player UI controls the embedded YouTube player.

The implementation must respect YouTube's embedding requirements.

------------------------------------------------------------------------

# 13. Autoplay

Do not depend on unmuted autoplay.

Browsers can block autoplay.

On first load:

``` text
Full-screen artwork
       +
राधे राधे
       +
Play / Enter Experience
```

When the user clicks:

**Play**

the music starts.

If autoplay/scripted playback is blocked, the interface must remain
usable and provide an obvious Play button.

Do not show a broken player state.

------------------------------------------------------------------------

# 14. Music Player

The player should visually resemble the supplied screenshot:

-   rounded pill/card
-   translucent dark glass
-   backdrop blur
-   subtle border
-   soft shadow
-   compact width
-   centered near bottom
-   desktop-friendly
-   mobile-friendly

Recommended width:

``` text
Desktop: 420–560px
Mobile: calc(100vw - 32px)
```

Do not make it full width on desktop.

------------------------------------------------------------------------

# 15. Required Player Controls --- P0

## Play / Pause

``` text
▶ / ❚❚
```

Clicking toggles playback.

------------------------------------------------------------------------

## Previous

``` text
◀
```

Calls the YouTube previous-video functionality.

------------------------------------------------------------------------

## Next

``` text
▶
```

Calls the YouTube next-video functionality.

------------------------------------------------------------------------

## Volume

Provide:

-   mute/unmute
-   volume slider

Volume range:

``` text
0–100
```

------------------------------------------------------------------------

## Progress

Display:

``` text
0:42 / 5:12
```

Show a visual progress bar.

V1 should support:

-   progress display
-   current time
-   duration

If time allows, make the progress bar seekable.

------------------------------------------------------------------------

# 16. Current Song Information

Show:

``` text
Song title
Artist / YouTube channel
```

Example:

``` text
Achyutam Keshavam
Krishna Bhajan
```

Do not hardcode these values unless necessary.

Where possible, retrieve the current video's title/channel information
from the YouTube player/API.

If metadata is temporarily unavailable, show a graceful fallback such
as:

``` text
Now Playing
```

------------------------------------------------------------------------

# 17. Playlist

The website must use the supplied playlist as the primary music source.

Playlist:

``` text
PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl
```

The initial playback order should follow the playlist owner's order.

Do not automatically shuffle in V1.

Looping may be enabled so that the experience can continue after the
final track.

------------------------------------------------------------------------

# 18. Playlist Drawer --- P1

If time permits, add a playlist button in the top-right.

Clicking it opens a compact panel:

``` text
┌───────────────────────────────┐
│          राधे राधे             │
│                               │
│  ● Current Song               │
│    Song 2                     │
│    Song 3                     │
│    Song 4                     │
│    Song 5                     │
│                               │
└───────────────────────────────┘
```

The drawer should overlay the artwork without navigating away.

This is optional for the first-hour MVP.

------------------------------------------------------------------------

# 19. Top Bar

Keep the top bar minimal.

## Top-left

Dynamic local time:

``` text
8:50 PM
```

Update automatically.

Use the browser's local time.

------------------------------------------------------------------------

## Top-right

Playlist/music icon:

``` text
♫
```

or a minimal playlist icon.

If the playlist drawer is not implemented in V1, this can be omitted.

Do NOT show fake listener counts.

Do NOT show fake online users.

------------------------------------------------------------------------

# 20. Main Branding Position

Main title:

``` text
राधे राधे
```

Position:

-   horizontally centered
-   approximately 35--45% from top, depending on artwork
-   responsive
-   never cover Krishna/Radha faces
-   adjust with CSS/media queries if needed

Because the artworks have different compositions, the title may need a
responsive position rather than one fixed pixel location.

------------------------------------------------------------------------

# 21. UI Contrast

Some artworks are dark and some are bright.

Use adaptive readability techniques:

-   subtle text shadow
-   very light backdrop gradient
-   optional bottom gradient behind player
-   optional soft glow behind title

Do NOT put a heavy black overlay over the entire artwork.

The artwork must remain vibrant and visible.

------------------------------------------------------------------------

# 22. Desktop Layout

Desktop is the primary target.

Target:

``` text
1920 × 1080
1440 × 900
1366 × 768
```

Requirements:

-   artwork fills screen
-   no horizontal scrolling
-   no vertical scrolling
-   player remains visible
-   title remains visible
-   important artwork subjects are not cropped unnecessarily

------------------------------------------------------------------------

# 23. Laptop Layout

Target:

``` text
1366 × 768
1280 × 720
```

Player should scale down slightly.

Use viewport-relative spacing.

Avoid placing important elements too close to the bottom edge.

------------------------------------------------------------------------

# 24. Mobile Layout

The site should remain functional on mobile.

Requirements:

-   artwork fills viewport
-   title scales down
-   player becomes wider relative to viewport
-   controls remain touch-friendly
-   minimum touch target approximately 44px
-   no horizontal scrolling

Mobile player:

``` text
┌─────────────────────────────┐
│ Song Title              ▶   │
│ Artist                      │
│ ━━━━━━━━━━━━━━━━━━━━━━━     │
│ ◀       ❚❚       ▶    🔊   │
└─────────────────────────────┘
```

------------------------------------------------------------------------

# 25. Technical Stack

For V1, prefer simplicity.

Recommended:

-   HTML
-   CSS
-   vanilla JavaScript
-   YouTube IFrame Player API
-   local WebP/JPG assets

React/Vite is acceptable if the coding agent already has a preferred
starter template, but do not introduce unnecessary complexity.

No backend is required for V1.

No database is required.

No authentication is required.

------------------------------------------------------------------------

# 26. Suggested Project Structure

``` text
radhe-radhe/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── krishna-01.webp
│   ├── krishna-02.webp
│   ├── krishna-03.webp
│   ├── krishna-04.webp
│   ├── krishna-05.webp
│   ├── krishna-06.webp
│   ├── krishna-07.webp
│   ├── krishna-08.webp
│   └── krishna-09.webp
│
└── README.md
```

------------------------------------------------------------------------

# 27. Application State

Maintain a small client-side state:

``` js
const state = {
  isPlaying: false,
  currentPlaylistIndex: 0,
  currentVideoId: null,
  volume: 70
};
```

The actual YouTube player remains the source of truth for playback
state.

Listen to YouTube player state events and update the UI accordingly.

------------------------------------------------------------------------

# 28. Important YouTube Events

Implement at minimum:

``` text
onReady
onStateChange
onError
```

Use `onStateChange` to detect:

-   playing
-   paused
-   ended
-   buffering

When the playlist index changes:

1.  determine the current playlist index
2.  update song metadata
3.  update the visual
4.  trigger the crossfade

Handle `onAutoplayBlocked` if available so the UI can gracefully fall
back to manual Play.

------------------------------------------------------------------------

# 29. Visual/Track Synchronization

This is a core feature.

Pseudo-flow:

``` text
YouTube track changes
        ↓
Get playlist index
        ↓
index % numberOfVisuals
        ↓
Select visual
        ↓
Crossfade background
        ↓
Update song title
```

Do not change the image based on a timer.

The visual should primarily change **with the song**.

------------------------------------------------------------------------

# 30. Initial Load

On first load:

1.  load page
2.  show first visual
3.  show `राधे राधे`
4.  initialize YouTube player
5.  load supplied playlist
6.  do not force unmuted autoplay
7.  show Play button
8.  when user presses Play, begin playback
9.  keep player state synchronized

The first visual should be visible immediately without waiting for music
playback.

------------------------------------------------------------------------

# 31. Error Handling

If YouTube fails to load:

Show a subtle message:

``` text
Music is taking a moment to load.
Please try again.
```

Do not show raw JavaScript errors.

If an individual video is unavailable:

-   allow the playlist to continue where possible
-   keep the visual experience working
-   do not crash the application

If an image fails to load:

-   retain the previous image or use a fallback image
-   do not show a broken-image icon

------------------------------------------------------------------------

# 32. Performance Requirements

Optimize the supplied artwork.

Prefer:

``` text
WebP
```

over unnecessarily large PNG/JPEG files.

Suggested image target:

-   approximately 1--3 MB maximum per large image where practical
-   use responsive sizing if necessary

Do not load unnecessary libraries.

Do not create a heavy animation engine.

The initial page should feel immediate.

------------------------------------------------------------------------

# 33. Accessibility

All controls must have accessible labels.

Examples:

``` html
aria-label="Play"
aria-label="Pause"
aria-label="Next song"
aria-label="Previous song"
aria-label="Mute"
aria-label="Volume"
aria-label="Playlist"
```

Keyboard support is desirable:

``` text
Space → Play/Pause
Arrow Right → Next
Arrow Left → Previous
```

Keyboard shortcuts are P1 and can be omitted if time is tight.

------------------------------------------------------------------------

# 34. Security / Embedding

Use the official YouTube IFrame Player API.

If directly constructing an iframe, provide the appropriate `origin`
parameter for the deployed site where applicable.

Do not attempt to bypass YouTube restrictions.

Do not scrape or download protected media.

------------------------------------------------------------------------

# 35. P0 --- Must Have for First Version

The website is NOT complete until all of these work:

-   [ ] Full-screen artwork
-   [ ] 8--9 supplied visual assets
-   [ ] `राधे राधे` branding
-   [ ] Stylish Devanagari font
-   [ ] Supplied YouTube playlist connected
-   [ ] Play
-   [ ] Pause
-   [ ] Next
-   [ ] Previous
-   [ ] Volume
-   [ ] Mute/unmute
-   [ ] Current song title
-   [ ] Current time/duration
-   [ ] Progress indicator
-   [ ] Image changes with track
-   [ ] Smooth crossfade
-   [ ] Desktop responsive layout
-   [ ] Mobile responsive layout
-   [ ] Autoplay-block fallback
-   [ ] No console-breaking errors

------------------------------------------------------------------------

# 36. P1 --- Add Only If Time Allows

-   [ ] Seekable progress bar
-   [ ] Playlist drawer
-   [ ] Shuffle
-   [ ] Repeat/loop toggle
-   [ ] Dynamic clock
-   [ ] Subtle Ken Burns animation
-   [ ] Subtle particles
-   [ ] Keyboard shortcuts
-   [ ] Better track metadata
-   [ ] Fullscreen button

------------------------------------------------------------------------

# 37. P2 --- Future Versions

Do NOT implement these in the first hour.

Possible future features:

### Mood modes

-   🌙 Peaceful
-   🪷 Bhakti
-   💙 Radha Krishna
-   🦚 Gokul
-   🪔 Janmashtami
-   ⚔️ Mahabharata / Gita

### Additional features

-   lyrics
-   synchronized lyrics
-   multiple playlists
-   visual themes
-   day/night mode
-   animated Krishna flute ambience
-   particle systems
-   shareable scenes
-   "send this experience" link
-   festival countdown
-   user-selected artwork
-   visualizer synchronized with music

------------------------------------------------------------------------

# 38. UX Acceptance Criteria

## Opening

**Given:** A user opens the website.

**Then:**

-   artwork fills the screen
-   `राधे राधे` is visible
-   no login is requested
-   no navigation is required
-   player is visible or easily discoverable

------------------------------------------------------------------------

## Play

**Given:** The player is ready.

**When:** User clicks Play.

**Then:**

-   YouTube music begins
-   Play icon changes to Pause
-   current song information appears
-   visual remains synchronized

------------------------------------------------------------------------

## Next

**When:** User clicks Next.

**Then:**

-   YouTube advances to next track
-   song metadata updates
-   artwork crossfades to next visual

------------------------------------------------------------------------

## Previous

**When:** User clicks Previous.

**Then:**

-   previous playlist item loads
-   metadata updates
-   artwork updates

------------------------------------------------------------------------

## Volume

**When:** User changes volume.

**Then:**

-   YouTube player volume changes
-   UI reflects mute/unmute state

------------------------------------------------------------------------

## Track completion

**When:** A song finishes.

**Then:**

-   next playlist song starts according to playlist behavior
-   visual changes
-   metadata changes

------------------------------------------------------------------------

# 39. Visual Quality Acceptance Criteria

The final website should NOT look like:

-   a generic HTML music player
-   Spotify clone
-   YouTube clone
-   a dashboard
-   a template landing page

It SHOULD look like:

> **A cinematic digital Krishna/Radha experience with a music player
> embedded into the scene.**

The artwork should remain the dominant visual element.

------------------------------------------------------------------------

# 40. Build Order for the Agent

Build in this exact order to maximize the chance of completing V1
quickly.

### Phase 1 --- Shell

1.  Create project
2.  Add full-screen background
3.  Add `राधे राधे`
4.  Add font
5.  Add responsive structure

### Phase 2 --- Player

6.  Load YouTube IFrame API
7.  Load playlist ID
8.  Add Play/Pause
9.  Add Next/Previous
10. Add volume
11. Add progress/time

### Phase 3 --- Synchronization

12. Detect playlist index
13. Map playlist index → visual index
14. Implement crossfade
15. Update current song information

### Phase 4 --- Polish

16. Glassmorphism player
17. Gradients/shadows
18. Mobile layout
19. Subtle image animation
20. Error handling

### Phase 5 --- Test

21. Test first song
22. Test next
23. Test previous
24. Test volume
25. Test song completion
26. Test autoplay block
27. Test mobile
28. Test refresh
29. Deploy

------------------------------------------------------------------------

# 41. Definition of Done

V1 is complete when a user can:

1.  open the website
2.  see a beautiful Krishna/Radha scene
3.  see `राधे राधे`
4.  press Play
5.  hear the supplied YouTube playlist
6.  pause
7.  change volume
8.  skip to next
9.  go back to previous
10. see the current song
11. see the progress
12. watch the artwork smoothly change with the music
13. use the website on a laptop and mobile

No additional feature is required for V1.

------------------------------------------------------------------------

# 42. Final Agent Instruction

Build this as a **polished, minimal, cinematic experience**, not as a
feature-heavy music application.

Use the supplied artwork as the hero.

Use the exact brand:

# **राधे राधे**

Use a stylish Devanagari typeface.

Use this exact YouTube playlist:

``` text
PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl
```

Use the YouTube IFrame Player API.

The player should be custom-styled and visually integrated into the
artwork.

The background artwork should change whenever the active playlist track
changes.

The final result should feel calm, devotional, premium, cinematic, and
modern.

**Prioritize working playback and visual synchronization over extra
features.**

If a feature conflicts with the one-hour build target, omit the feature
and preserve the core experience.

------------------------------------------------------------------------

## 43. Reference

### YouTube Playlist

`https://www.youtube.com/playlist?list=PLWdGqtkoX2CHhhMu6YS6xl6LsmUMW1IYl`

### YouTube IFrame Player API

`https://developers.google.com/youtube/iframe_api_reference`

### Primary brand

**राधे राधे**

### Product description

**A cinematic Krishna music experience.**
