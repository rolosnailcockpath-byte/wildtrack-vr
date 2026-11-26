# WILDTRACK VR — Multiplayer WebXR prototype (v0.3.1)

This is a browser-game prototype with a Node.js WebSocket room server and peer-to-peer WebRTC proximity voice.

## Run locally
1. Install Node.js 18 or newer.
2. Extract this ZIP.
3. In this folder run `npm install` and then `npm start`.
4. Open `http://localhost:8080` on your computer.

## Play on Meta Quest 3
1. Deploy the project to a public host that supports Node.js and persistent WebSocket connections, with HTTPS enabled.
2. Open the HTTPS game address directly in Meta Quest Browser while wearing the headset. Do not open it inside an embedded preview or from a downloaded `file://` page.
3. Press **ENTER VR**. The VR session request is now made immediately from that button press; microphone permission is requested only after the immersive session starts.
4. To play on desktop, press **ENTER WILDERNESS**.

WebXR and microphone access require HTTPS on a public host. `localhost` is treated as secure for local testing. The included server itself uses HTTP and should be placed behind an HTTPS reverse proxy or deployed to a host with automatic TLS.

## Controls
- Desktop: WASD / arrow keys move, mouse to look, click to shoot, G drops bait, F fishes at the lakeshore, E interacts, R reloads.
- Quest: tracked controllers drive arm-powered locomotion; trigger fires and grip interacts.
- Field Shop: buy and equip weapons.
- Change Biome: Pinewood, Snow, Lakeshore, Highlands.

## v0.3.1 fixes and visual pass
- Fixed a startup-breaking call to `buildWildlife()` that did not exist. `buildBiome()` already creates the wildlife, so the invalid extra call prevented the rest of initialization from running.
- Fixed the biome-change handler spawning wildlife twice.
- Reworked the VR entry flow: no asynchronous support check or microphone permission request runs before `navigator.xr.requestSession()`. This preserves the browser's click/user-activation requirement. Added clearer HTTPS, browser, and permission guidance.
- Added procedural surface maps with fine noise/bump detail for terrain and bark, fur-textured wildlife, and a more polished menu treatment.
- Added visible startup and unhandled-error messages rather than silently leaving the player at a broken screen.

## Honest prototype limitations
- This is a playable prototype foundation, not a finished commercial-quality game. Models and world art are still procedural; the texture pass improves their surface detail but does not replace authored high-resolution 3D assets, detailed skeletal animations, or professionally scanned environment textures.
- Player transforms synchronize through the room server and voice uses a peer-to-peer WebRTC mesh. Voice is best for small groups (roughly 2–6); a public deployment should configure TURN relay credentials for reliable voice on restrictive networks.
- Wildlife, animal damage, bait, harvest rewards, and inventory are currently local client-side simulation. They are not shared authoritatively between players. A production backend still needs server-owned wildlife state, synchronized combat/economy, persistence, and anti-cheat validation.
- This ZIP has passed JavaScript syntax checks and archive integrity checks. It has not been run on a physical Quest 3 in this environment, and public hosting / multiplayer runtime have not been verified here.

## If VR still will not start
- Confirm the game is served from an HTTPS address.
- Open the URL directly in Meta Quest Browser, not in an embedded browser or preview frame.
- Close another active VR app/session, allow the site's VR/motion permission, and press ENTER VR again.
- If you are testing on desktop, WebXR may report that no headset is available; use ENTER WILDERNESS for desktop play.
