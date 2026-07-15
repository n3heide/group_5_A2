# Group 5 A2 — Defend the Hive

## Description

Defend the Hive is a wave based defense game where players protect a beehive from incoming bears and birds. Players earn Honey by defeating enemies and use it to purchase permanent upgrades in the shop. As rounds progress, enemies become more difficult and players must balance resource management, upgrades, and quick reactions to keep the hive alive. The game focuses on progression, strategic decision making, and defending the hive against increasingly challenging enemy attacks.

## Design Rationale

The game uses clear affordances to help players understand how to interact with the interface. Buttons such as SHOP, Pause, and Start are visually distinct and placed in locations where players expect interactive elements to appear. Enemy movement toward the hive also communicates the player's objective without requiring extensive instructions. Players quickly learn that clicking enemies protects the hive and earns rewards.

GameFlow principles are supported through clear goals, immediate feedback, and gradual progression. Players receive visual and audio feedback when damaging enemies, earning Honey, purchasing upgrades, and advancing through rounds. The increasing challenge keeps players engaged while maintaining a balance between difficulty and player skill.

The game was designed around ADHD by encouraging focus through short gameplay loops, immediate rewards, and continuous interaction. Players receive constant feedback through sounds, visual effects, Honey rewards, and upgrade purchases, helping maintain attention and engagement. The upgrade system provides frequent goals and a sense of progression, while the simple click based controls reduce cognitive load and allow players to focus on the core gameplay experience. Design decisions such as clear objectives, quick feedback, and accessible controls were intentionally chosen to create an experience that is engaging for players with ADHD.

## Setup and Interaction Instructions

To run the sketch locally, open `index.html` in Google Chrome using Live Server.

**Controls:**

- Click on bears and birds to scare them away.
- Click the **SHOP** button to purchase upgrades.
- Press **Spacebar** to start the game.
- Press **Enter** to begin the next round.
- Click the **Pause** button to pause and resume the game.

Protect your hive from bears and birds before they damage it. Earn Honey by clicking enemies and spend it in the shop on permanent upgrades to survive increasingly difficult rounds.

**Opening the Chrome Console**

- **Windows:** Press `F12` or `Ctrl + Shift + J`, then click the **Console** tab.
- **Mac:** Press `Cmd + Option + J`.

## Iteration Notes

### Post Playtest Changes

1. Improved UI readability by adjusting text visibility and adding outlines to important interface elements such as the Honey counter.

2. Refined the visual design by updating fonts and improving the overall bee themed presentation.

3. Adjusted difficulty balancing to create a smoother progression between rounds and improve the overall gameplay experience.

### Post Showcase Planned Improvements

1. Reduce the length of Level 1 and increase the pace of the early game. Multiple playtesters noted that the opening section felt too slow before the challenge increased.

2. Introduce a new gameplay mechanic, such as a boss fight or unique enemy type, to provide more variety instead of only increasing enemy speed and difficulty.

## Assets

| File                                      | Source                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `assets/images/happy_bee.png` [1]         | Chillin by the Beehive — Adobe Firefly Image Generation                                         |
| `assets/images/bear.png` [2]              | Cute Big Bear Sprite Sheet — OpenGameArt                                                        |
| `assets/images/bird.png` [3]              | Bird Sprite — NicePNG                                                                           |
| `assets/sounds/bear_growl.wav` [4]        | Sound Spark — Creatures: Beast, Grunt, Growl, Deep                                              |
| `assets/sounds/button_click.wav` [5]      | Artlist Foley — Switches and Buttons: Tiny Button, Pressing, Click                              |
| `assets/sounds/bird_squak.wav` [6]        | Sonic Bat — Birdwatching: Trichoglossus Moluccanus Parrot, Single Throaty Chirp                 |
| `assets/sounds/hive_damage.wav` [7]       | Soundtrack Creation — Knights & Weapons: Arrow Hitting Wood, Thud, Crack                        |
| `assets/sounds/bees_buzzing.wav` [8]      | Craig Carter Collection — Insects: Bees Flying Around, Background Bee Hive Buzz                 |
| `assets/sounds/turret_shot.wav` [9]       | Front Row SFX by Pole Position — Battle Rifles: Heckler & Koch G3, Gun Firing, Single Shot, Far |
| `assets/sounds/purchase.wav` [10]         | Matching Sound Effects — Coins: Dropping a Few Coins on Other Coins                             |
| `assets/sounds/decline.wav` [11]          | Krotos — Small Office: Button, Elevator, Beep, Bright                                           |
| `assets/sounds/achievement.wav` [12]      | Ni Sound — Funny Game: Rolling Tones, Positive Achievement                                      |
| `assets/sounds/background_music.mp3` [13] | Solis — Sneaky Business                                                                         |

## References

[1] Adobe Firefly. n.d. _Chillin by the Beehive_. Adobe Firefly Image Generation.

[2] OpenGameArt. n.d. _Cute Big Bear Sprite Sheet_. Retrieved July 13, 2026, from https://opengameart.org/content/cute-big-bear

[3] NicePNG. n.d. _Bird Sprite_. Retrieved July 13, 2026, from https://www.nicepng.com/maxp/u2q8q8i1q8w7r5i1/

[4] Sound Spark. n.d. _Creatures – Beast, Grunt, Growl, Deep_. Artlist.

[5] Artlist Foley. n.d. _Switches and Buttons – Tiny Button, Pressing, Click_. Artlist.

[6] Sonic Bat. n.d. _Birdwatching – Trichoglossus Moluccanus Parrot, Single Throaty Chirp_. Artlist.

[7] Soundtrack Creation. n.d. _Knights & Weapons – Arrow Hitting Wood, Thud, Crack_. Artlist.

[8] Craig Carter Collection. n.d. _Insects – Bees Flying Around, Background Bee Hive Buzz_. Artlist.

[9] Front Row SFX by Pole Position. n.d. _Battle Rifles – Heckler & Koch G3, Gun Firing, Single Shot, Far_. Artlist.

[10] Matching Sound Effects. n.d. _Coins – Dropping a Few Coins on Other Coins_. Artlist.

[11] Krotos. n.d. _Small Office – Button, Elevator, Beep, Bright_. Artlist.

[12] Ni Sound. n.d. _Funny Game – Rolling Tones, Positive Achievement_. Artlist.

[13] Solis. n.d. _Sneaky Business_. Artlist.
