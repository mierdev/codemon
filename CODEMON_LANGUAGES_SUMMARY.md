# Codemon Languages & Abilities Summary

## Overview
This document summarizes all programming languages currently implemented in the Codemon battle game, including their stats, types, and abilities.

## Languages

### 1. Python
- **Type:** Script
- **Stats:** HP: 100, Attack: 75, Sp.Atk: 85, Defense: 75, Sp.Def: 75, Speed: 80
- **Abilities:**
  - **Rapid Prototype** (Passive): Starts battle with +10 Speed bonus. Status effects last 1 less turn.
  - **Ecosystem Call** (Utility): Temporarily gains a secondary type for 3 turns.

### 2. Go
- **Type:** Concurrent/System
- **Stats:** HP: 100, Attack: 80, Sp.Atk: 75, Defense: 85, Sp.Def: 80, Speed: 70
- **Abilities:**
  - **Fast Compilation** (Passive): Takes turn first vs Script/Managed types. +5 Defense/SpDefense.
  - **Goroutine Swarm** (Special): Deals special damage. 25% chance to inflict Concurrency Bottleneck. (NERFED: 45 → 35 power)

### 3. Rust
- **Type:** System/Concurrent
- **Stats:** HP: 100, Attack: 85, Sp.Atk: 75, Defense: 90, Sp.Def: 85, Speed: 65
- **Abilities:**
  - **Borrow Checker** (Passive): Takes 50% less damage from memory corruption attacks. (BUFFED: 10 → 25 power)
  - **Zero-Cost Abstraction** (Buff): Increases Attack and Special Attack by 1 stage for 3 turns.

### 4. OCaml
- **Type:** Functional
- **Stats:** HP: 100, Attack: 65, Sp.Atk: 95, Defense: 70, Sp.Def: 90, Speed: 75
- **Abilities:**
  - **Type Inference** (Passive): All abilities gain +10% accuracy. +15% crit vs multi-type targets. (BUFFED: 10 → 25 power)
  - **Pattern Matching** (Special): Deals special damage. +25 bonus vs C++ and JS/TS. (NERFED: 80 → 60 power)

### 5. C#
- **Type:** Managed/Enterprise
- **Stats:** HP: 100, Attack: 85, Sp.Atk: 90, Defense: 80, Sp.Def: 85, Speed: 75
- **Abilities:**
  - **Garbage Collection** (Recovery): Heals 30% max HP and removes one debuff. 25% chance to gain +1 Defense.
  - **LINQ Query** (Special): Deals special damage. 30% chance to inflict 'Data Binding Error'. (NERFED: 70 → 50 power)

### 6. JavaScript & TypeScript
- **Type:** Web/Script
- **Stats:** HP: 100, Attack: 70, Sp.Atk: 85, Defense: 70, Sp.Def: 70, Speed: 90
- **Abilities:**
  - **Asynchronous Promise** (Special): Deals initial damage + 25 delayed damage. 25% chance of Callback Hell. (NERFED: 60 → 45 power)
  - **Framework Flux** (Passive): 40% chance each turn to gain +1 random stat. 10% chance to lose -1. (BUFFED: 10 → 30 power)

## Ability Types

- **Passive:** Always active abilities with no cooldown
- **Physical:** Direct damage abilities
- **Special:** Special damage abilities
- **Utility:** Support abilities that provide benefits
- **Debuff:** Abilities that weaken opponents
- **Buff:** Abilities that strengthen the user
- **Control:** Abilities that manipulate battle state
- **Recovery:** Healing abilities
- **Defensive:** Protective abilities
- **Support:** Team support abilities

## Stat Ranges

- **HP:** All languages have 100 base HP
- **Attack:** 65-85 (Rust highest, OCaml lowest)
- **Special Attack:** 75-95 (OCaml highest, Go lowest)
- **Defense:** 60-90 (Rust highest, C# lowest)
- **Special Defense:** 60-90 (OCaml highest, C# lowest)
- **Speed:** 65-90 (JavaScript highest, Rust lowest)

## Type Categories

- **Script:** Python, JavaScript & TypeScript
- **System:** Rust
- **Managed/Enterprise:** C#
- **Concurrent:** Go, Rust
- **Functional:** OCaml
- **Web:** JavaScript & TypeScript

## CSV File

The complete data is also available in `codemon_languages.csv` for easy import into spreadsheet applications or databases. 