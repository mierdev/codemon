<img src="https://raw.githubusercontent.com/mierdev/codemon/refs/heads/main/public/assets/readme/codemon.png" alt="codemon logo">

# A JRPG battle game with a coding theme

Compete in pokémon inspired battles to find out which is the strongest programming language. Enter one of the competitions to earn a shiny coin.

> PS if you hang around the Boot.dev Discord server, you might recognize a lot of the opponents 👀

## The game is live hosted! 

**<a href="https://codemon-rho.vercel.app/" target="_blank">Play it in your browser</a>**

## Features

- **Turn-based battles** between programming languages
- **7 unique languages** with distinct abilities and stats
- **Tournament mode** with 3, 5, or 7 match competitions
- **Dynamic dialogue system** with trainer personalities
- **Animated fire effects** and smooth transitions
- **Audio system** with background music and sound effects
- **Database integration** for persistent game data
- **Responsive UI** with modern game aesthetics

## In-game sreenshots

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

**On Mac**

Using Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community
```

Or download from the official website:
- Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- Download the macOS version
- Follow the installation instructions

**On WSL2/Ubuntu (Windows)**

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

5. Make a .env in the root folder and add the database keys
```
touch .env
code .env
```
```
MONGODB_URI=mongodb+srv://mongouser:mongoischaos@gamecluster.8wtssss.mongodb.net/?retryWrites=true&w=majority&appName=GameCluster
MONGODB_DB=codemon
```

## Usage

1. Start MongoDB:

**On Mac**

Using Homebrew:
```bash
brew services start mongodb-community
```

Or manually:
```bash
mongod --config /usr/local/etc/mongod.conf
```

**On WSL2/Ubuntu (Windows)**

- Start MongoDB:

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

2. Add data to the database:
```bash
npm run seed
```

3. Start the server:
```bash
npm run devStart
```

## Tech Stack

**Frameworks**
- Phaser.js
- Express.js

**Database**
- MongoDB

**Programming languages**
- TypeScript
- JavaScript
- HTML/CSS

## Architecture

<img src="https://raw.githubusercontent.com/mierdev/codemon/refs/heads/main/public/assets/readme/architecture.png" width="800px" alt="Codemon architecture">