# Group 5 A2 — Protect the Hive

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

**Controls:**

- Move: WASD
- Shoot: Spacebar (shoots in the direction you last moved)
- B: Skip to boss fight (testing only)
- Restart: R (after win or game over)

Explore the world, survive enemy waves as you move north, then enter the glowing boss zone to fight the giant orange blob. Watch the minimap to track enemies off screen.

**Adding Your Own Sounds**

1. Add your sound files to `assets/sounds/`
2. In `preload()`, uncomment the `loadSound()` lines and update the file paths
3. Uncomment the `play()` or `loop()` calls in the relevant functions — there are hooks for the boss music transition too

**Editing the Waves and Boss**
Open `data/enemies.json` to change when waves spawn, how many enemies appear, their speed, and the boss stats. Each wave has a `spawnAt` world Y value — lower values trigger later since the player starts at the bottom of the world.

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab
- **Mac:** Press `Cmd + Option + J`

## Assets

| File                                    | Source                                            |
| --------------------------------------- | ------------------------------------------------- |
| `assets/images/werewolf.png` [1]        | Karan Vadakhiya, vecteezy.com: werewolf           |
| `assets/images/background_image.jpg`[2] | Ovsco, store.steampowered.com: The Cave Diver     |
| `assets/sounds/background_tunes.mp3`[3] | Kashido, artlist.io: Swan Lake Theme              |
| `assets/sounds/impact.wav`[4]           | CB Sounddesign, artlist.io: Shoot - Bullet impact |
| `assets/sounds/shoot.wav`[5]            | OG SoundFX, artlist.io: Distorted Hits            |

## References

[1] Karan Vadakhiya. n.d. _Werewolf_. Vecteezy. Retrieved June 17, 2026, from Vecteezy

[2] Ovsco. n.d. _The Cave Diver_. Steam Store. Retrieved June 17, 2026, from Steam Store

[3] Kashido. n.d. _Swan Lake Theme_. Artlist. Retrieved June 17, 2026, from Artlist

[4] CB Sounddesign. n.d. _Shoot – Bullet Impact_. Artlist. Retrieved June 17, 2026, from Artlist

[5] OG SoundFX. n.d. _Distorted Hits_. Artlist. Retrieved June 17, 2026, from Artlist
