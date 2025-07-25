# Pokémon Coding Languages: Detailed Specifications

## Global Game Mechanics & Concepts

### Stat Stages
Buffs/debuffs are applied in "stages." Each stage increases/decreases the base stat by 50%.

- **+1 Stage:** stat × 1.5
- **+2 Stages:** stat × 2.0
- **-1 Stage:** stat × 0.66 (approx. 1 / 1.5)
- **-2 Stages:** stat × 0.5
- **Max stages:** +4 to -4

### Damage Calculation (Simplified)
```
Damage = (Ability_Base_Power * (Attacker_Attack_Stat / Defender_Defense_Stat)) * Type_Effectiveness_Multiplier
```
- Minimum damage is 1.

### Type Effectiveness
- **2.0x:** Super Effective
- **1.0x:** Normal Effectiveness
- **0.5x:** Not Very Effective (Resistance)

```js
const TYPE_EFFECTIVENESS = {
    "Script": {
        "Managed": 2.0, "Web": 2.0,
        "System": 0.5, "Concurrent": 0.5
    },
    "System": {
        "Script": 2.0, "Managed": 2.0,
        "Concurrent": 0.5, "Functional": 0.5
    },
    "Concurrent": {
        "System": 2.0, "Web": 2.0,
        "Functional": 0.5
    },
    "Functional": {
        "System": 2.0, "Concurrent": 2.0,
        "Managed": 0.5, "Web": 0.5
    },
    "Managed": {
        "Functional": 2.0,
        "Script": 0.5, "System": 0.5
    },
    "Web": {
        "Script": 0.5, "Concurrent": 0.5
    }
};
```

---

# Language Specifications

## 1. Python (The "Versatile Vypyr")
- **Primary Type:** Script
- **Secondary Type:** None

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 75    |
| SPATK  | 85    |
| DEF    | 75    |
| SPDEF  | 75    |
| SPD    | 80    |

### Abilities
- **Rapid Prototype (Passive):**
  - Starts battle with +10 bonus to Speed.
  - Any status effect applied to Python lasts 1 less turn (min 1 turn).
  - *Cooldown:* N/A (Passive)
- **Ecosystem Call (Utility / Type Change):**
  - Temporarily gains a secondary type (System, Concurrent, Functional, Managed, or Web) for 3 turns.
  - Cannot copy its own Script type.
  - AI prioritizes a type that is Super Effective (2.0x) against the opponent's primary type.
  - *Cooldown:* 5 turns
- **GIL Lock (Debuff):**
  - Prevents the target from using abilities that grant multi-core or parallel execution benefits for 2 turns.
  - *Cooldown:* 3 turns

---

## 2. Go (The "Efficient Golem")
- **Primary Type:** Concurrent
- **Secondary Type:** System

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 80    |
| SPATK  | 75    |
| DEF    | 85    |
| SPDEF  | 80    |
| SPD    | 70    |

### Abilities
- **Fast Compilation (Passive):**
  - Always takes its turn first (gains +10 Speed bonus) when battling Script or Managed types.
  - Starts battle with +5 bonus to Defense and Special Defense.
  - *Cooldown:* N/A (Passive)
- **Goroutine Swarm (Offensive):**
  - Type: Special Attack, BP: 45
  - Deals 45 BP special damage.
  - 25% chance to inflict "Concurrency Bottleneck" (target: -1 Speed, prevents stat boosts for 1 turn).
  - *Cooldown:* 2 turns
- **Strict Typing (Defensive / Utility):**
  - Cleanses all status effects from itself.
  - Gains a temporary shield for 1 turn (reduces incoming damage from type coercion abilities by 50%).
  - *Cooldown:* 3 turns

---

## 3. Rust (The "Secure Sentinel")
- **Primary Type:** System
- **Secondary Type:** Concurrent

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 85    |
| SPATK  | 75    |
| DEF    | 90    |
| SPDEF  | 85    |
| SPD    | 65    |

### Abilities
- **Borrow Checker (Passive):**
  - Takes 50% less damage from "Memory Corruption" or "Undefined Behavior" attacks.
  - Reduces recoil damage from such abilities by 50%.
  - Automatically cleanses "Memory Leak" status at end of each turn.
  - *Cooldown:* N/A (Passive)
- **Zero-Cost Abstraction (Buff):**
  - Increases own Attack and Special Attack by 1 stage each for 3 turns (cannot be copied or removed).
  - *Cooldown:* 3 turns
- **Ownership Transfer (Debuff / Control):**
  - Removes one random buff from the target, or inflicts "Rust-Bound" (prevents primary offensive ability for 1 turn) if no buffs.
  - *Cooldown:* 3 turns

---

## 4. OCaml (The "Logical Luminary")
- **Primary Type:** Functional
- **Secondary Type:** None

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 65    |
| SPATK  | 95    |
| DEF    | 70    |
| SPDEF  | 90    |
| SPD    | 75    |

### Abilities
- **Type Inference (Passive):**
  - All abilities gain +10% accuracy.
  - +15% higher critical hit chance against targets with multiple or dynamic types.
  - *Cooldown:* N/A (Passive)
- **Pattern Matching (Offensive / Control):**
  - Type: Special Attack, BP: 55
  - Deals 55 BP special damage (+25 bonus vs. "complex" languages: C++, JS/TS).
  - 35% chance to disrupt target's passive ability for 1 turn.
  - *Cooldown:* 3 turns
- **Immutability (Defensive / Recovery):**
  - Heals 35% max HP and cleanses all non-volatile status conditions.
  - *Cooldown:* 3 turns

---

## 5. C++ (The "Core Colossus")
- **Primary Type:** System
- **Secondary Type:** None

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 100   |
| SPATK  | 100   |
| DEF    | 60    |
| SPDEF  | 60    |
| SPD    | 70    |

### Abilities
- **Unsafe Block (Offensive / Risky):**
  - Type: Physical Attack, BP: 130
  - Deals 130 BP physical damage.
  - 20% chance of "Undefined Behavior" (UB): C++ takes 15% max HP as recoil and is inflicted with a random severe status ("Crash" or "Memory Leak").
  - *Cooldown:* 3 turns
- **Optimized Parallelism (Passive / Buff):**
  - Every 2 turns, Speed and Attack increase by 1 stage (max +4 each).
  - *Cooldown:* N/A (Passive)
- **Legacy Integration (Defensive / Support):**
  - Grants "Compatibility Shield" for 2 turns (reduces Script/Web damage by 45%).
  - *Cooldown:* 4 turns

---

## 6. JavaScript & TypeScript (The "Dynamic Digital Duo")
- **Primary Type:** Web
- **Secondary Type:** Script

| Stat   | Value |
|--------|-------|
| HP     | 100   |
| ATK    | 70    |
| SPATK  | 85    |
| DEF    | 70    |
| SPDEF  | 70    |
| SPD    | 90    |

### Abilities
- **Asynchronous Promise (Offensive / Utility):**
  - Type: Special Attack, Initial BP: 35, Delayed Damage: 25
  - Deals 35 BP initial special damage, then 25 fixed damage at the start of the next turn.
  - 25% chance to inflict "Callback Hell" (target's next ability has a 30% chance to fail or be delayed).
  - *Cooldown:* 2 turns
- **Framework Flux (Passive / Volatile):**
  - 40% chance each turn to gain +1 stage to a random stat; 10% chance to suffer -1 stage to a random stat.
  - *Cooldown:* N/A (Passive)
- **Transpilation (Support / Type Shift):**
  - Temporarily changes Web primary type to System, Concurrent, Functional, or Managed for 2 turns.
  - AI prioritizes a type that is Super Effective (2.0x) against the opponent's primary type.
  - *Cooldown:* 4 turns

---

This detailed breakdown provides all the necessary parameters for implementing these language Pokémon in JavaScript, allowing you to create a fun and balanced battle system.
