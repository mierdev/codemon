# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-07-26

### 🎮 **Major Features Added**

#### **Battle System Enhancements**
- **Random Language Selection**: Each battle now randomly selects 2 different programming languages
- **Round-Based Cooldown System**: OCaml's "Immutability" ability limited to once per round
- **Enhanced Damage Mechanics**: Proper buff/debuff system with stat stage calculations
- **Battle Log**: Real-time log of last 5 attack events displayed in bottom right corner

#### **UI/UX Improvements**
- **Status Effects Display**: Professional-looking status effects boxes with frames and backgrounds
- **Ability Message Boxes**: Pop-up messages above characters when abilities are used
- **Button Text Wrapping**: Ability names now wrap properly within buttons
- **Sharp Rendering**: Added pixel-perfect rendering with `roundPixels`, `pixelArt`, and `antialias: false`

#### **Audio System**
- **Sound Effects**: Added comprehensive audio system with different sounds for ability types
- **Audio Manager**: Dedicated AudioManager class for handling game audio
- **Ability-Based Sounds**: Different sound effects for Physical, Special, Buff, Debuff, etc.

### 🔧 **Technical Improvements**

#### **File Organization**
- **Managers Folder**: Moved GameManager and AudioManager to dedicated `/managers` folder
- **Better Structure**: Separated game managers from Express data models
- **Static File Serving**: Updated server to serve files from managers folder

#### **Code Quality**
- **TypeScript Support**: Added proper TypeScript file handling
- **Error Handling**: Improved error handling for invalid Pokemon IDs
- **Console Logging**: Enhanced debugging with detailed console output
- **Code Formatting**: Consistent code style and formatting

### 🎯 **Game Balance Changes**

#### **Ability Balancing**
- **Unsafe Block Nerf**: Reduced power from 130 to 65 (50% reduction)
- **OCaml Immutability**: Limited to once per round instead of unlimited use
- **Damage Calculation**: Improved damage formula with proper stat stage multipliers

#### **Language Updates**
- **Fixed TypeScript Issue**: Removed duplicate "typescript" from language selection
- **Valid Language IDs**: Ensured all selected languages exist in GameManager

### 🎨 **Visual Enhancements**

#### **UI Layout**
- **Message Boxes**: Positioned at Y=80 (higher up for better visibility)
- **Status Effects**: Positioned at Y=400 (further down with proper spacing)
- **Turn Label**: Moved up 40 pixels for better positioning
- **Battle Log**: Positioned above status bar with clean black background

#### **Styling**
- **Professional Frames**: Black semi-transparent boxes with white borders
- **Color Coding**: Green for buffs, red for debuffs
- **Text Formatting**: Proper word wrapping and text sizing
- **Consistent Design**: Unified styling across all UI elements

### 🐛 **Bug Fixes**

#### **File Loading Issues**
- **MIME Type Errors**: Fixed TypeScript file serving with proper JavaScript compilation
- **404 Errors**: Resolved missing file references after reorganization
- **Import Paths**: Updated all HTML files to reference correct file locations

#### **Game Logic**
- **Restart Functionality**: Fixed game restart with proper language selection
- **Ability Cooldowns**: Implemented proper round-based cooldown system
- **Damage Calculation**: Fixed stat stage multipliers and damage formulas

### 📁 **File Structure Changes**

```
codemon/
├── managers/           ← New dedicated folder
│   ├── AudioManager.ts
│   ├── AudioManager.js
│   └── GameManager.ts
├── models/            ← Now only contains Express data models
│   └── modelAbilities.js
├── public/js/         ← Game-specific JS files
│   ├── battleScene.js
│   ├── bootScene.js
│   └── main.js
└── views/
    └── index.ejs
```

### 🚀 **Performance Improvements**

- **Sharp Rendering**: Optimized for pixel-perfect graphics
- **Audio Context**: Proper audio initialization and management
- **Memory Management**: Improved cleanup of audio and UI elements
- **Efficient Updates**: Real-time UI updates without performance impact

### 📝 **Documentation**

- **Code Comments**: Added comprehensive JSDoc comments
- **Console Logging**: Detailed logging for debugging and monitoring
- **README Updates**: Project structure and setup instructions

---

## [0.1.0] - Initial Release

### 🎮 **Core Features**
- Basic Pokemon-style battle system
- Programming language characters
- Simple ability system
- Basic UI with HP bars and ability buttons
- Express server with EJS templating
- Phaser.js game framework integration

---

## Version History

- **0.2.0**: Major feature update with battle system enhancements, UI improvements, and audio system
- **0.1.0**: Initial release with basic battle functionality 