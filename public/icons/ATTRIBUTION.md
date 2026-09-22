# Icon attribution

World of Warcraft and all related icons, crests, and artwork are © Blizzard Entertainment.

These files are official Blizzard UI icons, sourced from the Wowhead CDN for fan use and **vendored locally** so production does not hotlink at runtime.

- Large icon CDN: `https://wow.zamimg.com/images/wow/icons/large/<name>.jpg`
- Interface LFG sheet: `https://wow.zamimg.com/images/wow/lfgframe/ui-lfg-icon-roles.png`

## Vendored files (`public/icons/wow/`)

| Kind | Wowhead name | File |
| --- | --- | --- |
| Alliance crest | `ui_allianceicon` | `ui_allianceicon.jpg` |
| Horde crest | `ui_hordeicon` | `ui_hordeicon.jpg` |
| Classes | `class_warrior` … `class_druid` | `class_<class>.jpg` |
| Races | `race_<race>_male` (Undead = `race_scourge_male`, Night Elf = `race_nightelf_male`) | `race_*.jpg` |
| Roles | Interface `UI-LFG-ICON-ROLES` | `role_tank.png`, `role_healer.png`, `role_dps.png` |

`role_tank.jpg` / `role_healer.jpg` / `role_dps.jpg` return HTTP 404 on the large-icon CDN. Role art is cropped from the Wowhead-hosted Interface sprite `ui-lfg-icon-roles.png` (classic LFG shield / plus / sword). The full sheet is kept as the source file.

## Skyborne

Skyborne is a WoW: Forever-only race. There is no official Blizzard race icon yet. The UI shows the **Skyborne** label with no race crest. Do not invent, redraw, or AI-generate one.
