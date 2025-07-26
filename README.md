<img src="https://raw.githubusercontent.com/mierdev/codemon/refs/heads/main/public/assets/readme/codemon.png" alt="codemon logo">

# A pokémon inspired game with a coding theme

Our entry for the Boot.dev Hackathon 2025.

The game is live hosted! **<a href="https://cdn.bookey.app/files/publish-book/Learning%20TypeScript7136808.jpg" target="_blank">Play it in your browser</a>**

### In-game sreenshots

<img height="300px" src="https://raw.githubusercontent.com/mierdev/codemon/refs/heads/main/public/assets/readme/screenshot_1.png" alt="screenshot 1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img height="300px" src="https://raw.githubusercontent.com/mierdev/codemon/refs/heads/main/public/assets/readme/screenshot_2.png" alt="screenshot 2">
</div>

## Build by
- [Nallo](https://github.com/nallovint)
- [TokiLoshi](https://github.com/TokiLoshi)
- [Miranda](https://github.com/mierdev)

## Prerequisites

- [Node.js](https://nodejs.org/en/download)

## Installation

1. Clone the repo:
```bash
git clone git@github.com:mierdev/codemon.git
```

2. Open the project folder:
```bash
cd codemon
```

3. Install dependencies:
```bash
npm install
```

4. Install MongoDB
*On WSL2/Ubuntu (Windows)*
- Import the public key:
From a terminal, install `gnupg` and `curl` if they are not already available:
```bash
sudo apt-get install gnupg curl
```
To import the MongoDB public GPG key, run the following command:
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
  --dearmor
```

- Create the list file:
Create the list file `/etc/apt/sources.list.d/mongodb-org-8.0.list` for your version of Ubuntu (we are presuming you've installed it with Boot.dev's instructions and are using Ubuntu 22.04 Jammy, if not follow the [Installation guide](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/))
```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
```

- Reload the package database:
Issue the following command to reload the local package database:
```bash
sudo apt-get update
```

- Install MongoDB Community Server:
```bash
sudo apt-get install -y mongodb-org
```

## Usage
1. Start MongoDB
*On WSL2/Ubuntu (Windows)*
- Run this command to start MongoDBL:
```bash
sudo systemctl start mongod
```
- If you receive an error similar to the following when starting mongod:
`Failed to start mongod.service: Unit mongod.service not found.`
Run the following command first:
```bash
sudo systemctl daemon-reload
```
Then run the start command above again.

2. Start the server
- Run this command in your CLI:
```bash
npm run devStart
```

- If you are on Mac you might run into issues. When you do run this command instead:
```bash
npm run macStart
```

## Features

- A lot of cool stuff.

## Structure

A bit about our architecture.

## Attributions

### UI

- UI Pack - Pixel Adventure by [Kenney](https://www.kenney.nl/assets/ui-pack-pixel-adventure), License [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
- UI Pack - Adventure by [Kenney](https://www.kenney.nl/assets/ui-pack-adventure) License [CC0](https://creativecommons.org/publicdomain/zero/1.0/)

### Audio

- Physical Sound Effect by [floraphonic](https://pixabay.com/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=musiysical: fireball-whoosh-1-1791c&utm_content=179125) from Pixabay
- Miss: sword-slash-and-swing-185432 Sound Effect by [David Dumais](https://pixabay.com/users/daviddumaisaudio-41768500/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185432) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=185432)
- Debuff: Vinyl Stop Sound Effect from [Pixabay](https://pixabay.com/sound-effects/vinyl-stop-sound-effect-241388/)
- Passive: Sound Effect by [Virtual_Vibes](https://pixabay.com/users/virtual_vibes-51361309/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=379466) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=379466)
- Utilitiy: https://sfxr.me/
- Special: Sound Effect by <a href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=351021">Universfield</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=351021">Pixabay</a>
- Defensive: health-pickup-6860 Sound Effect by [yodguard](https://pixabay.com/users/yodguard-12455005/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=378606) from [Pixabay](https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=378606)
- Buff: chainsaw-318231 Sound Effect by [SonixFXSounds](https://pixabay.com/users/sonixfxsounds-49053354/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318231) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=318231)
- Control: Sound Effect by [jsfxr](https://sfxr.me/)
- Recover: Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6860) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=6860)
- Support: Sound Effect by [freesound_community](https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=46004) from [Pixabay](https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=46004)

More sounds:
https://sfxr.me/

## License

- CC-BY-something (attribution required) ?