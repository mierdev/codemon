#!/usr/bin/env python3
"""
Codemon Battle Simulator
Simulates battles between programming languages to analyze performance and balance.
"""

import json
import random
import statistics
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class BattleResult:
    winner: str
    loser: str
    winner_hp_remaining: float
    turns_taken: int
    winner_ability_used: str
    loser_ability_used: str
    damage_dealt: Dict[str, float]

class CodemonSimulator:
    def __init__(self, data_file: str = "codemon_battle_simulator.json"):
        """Initialize simulator with battle data."""
        with open(data_file, 'r') as f:
            self.data = json.load(f)
        
        self.languages = {lang['id']: lang for lang in self.data['languages']}
        self.metadata = self.data['metadata']
        
    def get_effective_stat(self, language: Dict, stat: str, buffs: Dict[str, int] = None) -> float:
        """Calculate effective stat considering buffs/debuffs."""
        base_stat = language['base_stats'][stat]
        if not buffs or stat not in buffs:
            return base_stat
        
        stages = buffs[stat]
        if stages > 0:
            multiplier = 1 + (stages * 0.5)  # +50% per stage
        else:
            multiplier = 1 / (1 + (abs(stages) * 0.33))  # -33% per stage
            
        return base_stat * multiplier
    
    def calculate_damage(self, attacker: Dict, defender: Dict, ability: Dict, 
                        attacker_buffs: Dict[str, int] = None, 
                        defender_buffs: Dict[str, int] = None) -> float:
        """Calculate damage using the game's damage formula."""
        if ability['type'] not in ['Physical', 'Special']:
            return ability['power']  # Non-damaging abilities
            
        # Get effective stats
        if ability['type'] == 'Physical':
            attack_stat = self.get_effective_stat(attacker, 'attack', attacker_buffs)
            defense_stat = self.get_effective_stat(defender, 'defense', defender_buffs)
        else:  # Special
            attack_stat = self.get_effective_stat(attacker, 'specialAttack', attacker_buffs)
            defense_stat = self.get_effective_stat(defender, 'specialDefense', defender_buffs)
        
        # Damage formula: (Ability_Power * (Attacker_Attack / Defender_Defense)) * Random_Factor
        base_damage = ability['power'] * (attack_stat / defense_stat)
        
        # Apply random factor (0.85 to 1.0)
        random_factor = random.uniform(0.85, 1.0)
        
        return max(1, base_damage * random_factor)
    
    def check_accuracy(self, ability: Dict) -> bool:
        """Check if ability hits based on accuracy."""
        return random.random() * 100 <= ability['accuracy']
    
    def simulate_battle(self, lang1_id: str, lang2_id: str, 
                       ability1_index: int, ability2_index: int) -> BattleResult:
        """Simulate a single battle between two languages."""
        lang1 = self.languages[lang1_id]
        lang2 = self.languages[lang2_id]
        
        # Initialize battle state
        hp1 = lang1['base_stats']['hp']
        hp2 = lang2['base_stats']['hp']
        max_hp1 = lang1['base_stats']['maxHp']
        max_hp2 = lang2['base_stats']['maxHp']
        
        buffs1 = {}
        buffs2 = {}
        turns = 0
        damage_dealt = {lang1_id: 0, lang2_id: 0}
        
        # Determine who goes first (based on speed)
        speed1 = self.get_effective_stat(lang1, 'speed', buffs1)
        speed2 = self.get_effective_stat(lang2, 'speed', buffs2)
        
        lang1_first = speed1 >= speed2
        
        while hp1 > 0 and hp2 > 0 and turns < 50:  # Max 50 turns to prevent infinite battles
            turns += 1
            
            # Determine order for this turn
            current_speed1 = self.get_effective_stat(lang1, 'speed', buffs1)
            current_speed2 = self.get_effective_stat(lang2, 'speed', buffs2)
            lang1_goes_first = current_speed1 >= current_speed2
            
            # Language 1 attacks
            if hp1 > 0:
                ability1 = lang1['abilities'][ability1_index]
                if self.check_accuracy(ability1):
                    damage = self.calculate_damage(lang1, lang2, ability1, buffs1, buffs2)
                    hp2 -= damage
                    damage_dealt[lang1_id] += damage
                    hp2 = max(0, hp2)
            
            # Language 2 attacks
            if hp2 > 0:
                ability2 = lang2['abilities'][ability2_index]
                if self.check_accuracy(ability2):
                    damage = self.calculate_damage(lang2, lang1, ability2, buffs2, buffs1)
                    hp1 -= damage
                    damage_dealt[lang2_id] += damage
                    hp1 = max(0, hp1)
        
        # Determine winner
        if hp1 > 0:
            winner_id = lang1_id
            loser_id = lang2_id
            winner_hp = hp1
            winner_ability = lang1['abilities'][ability1_index]['name']
            loser_ability = lang2['abilities'][ability2_index]['name']
        else:
            winner_id = lang2_id
            loser_id = lang1_id
            winner_hp = hp2
            winner_ability = lang2['abilities'][ability2_index]['name']
            loser_ability = lang1['abilities'][ability1_index]['name']
        
        return BattleResult(
            winner=winner_id,
            loser=loser_id,
            winner_hp_remaining=winner_hp,
            turns_taken=turns,
            winner_ability_used=winner_ability,
            loser_ability_used=loser_ability,
            damage_dealt=damage_dealt
        )
    
    def run_simulation(self, battles_per_matchup: int = 100) -> Dict[str, Any]:
        """Run full simulation across all language matchups."""
        language_ids = list(self.languages.keys())
        results = []
        
        print(f"Starting simulation with {battles_per_matchup} battles per matchup...")
        
        # Simulate battles between all language pairs
        for i, lang1_id in enumerate(language_ids):
            for j, lang2_id in enumerate(language_ids):
                if i >= j:  # Skip self-battles and duplicate matchups
                    continue
                
                print(f"Simulating {lang1_id} vs {lang2_id}...")
                
                # Run battles with different ability combinations
                for battle_num in range(battles_per_matchup):
                    # Randomly choose abilities (50-50 split between ability 0 and 1)
                    ability1_index = random.choice([0, 1])
                    ability2_index = random.choice([0, 1])
                    
                    result = self.simulate_battle(lang1_id, lang2_id, ability1_index, ability2_index)
                    results.append({
                        'battle_num': battle_num,
                        'language1': lang1_id,
                        'language2': lang2_id,
                        'ability1_index': ability1_index,
                        'ability2_index': ability2_index,
                        'winner': result.winner,
                        'loser': result.loser,
                        'winner_hp_remaining': result.winner_hp_remaining,
                        'turns_taken': result.turns_taken,
                        'winner_ability_used': result.winner_ability_used,
                        'loser_ability_used': result.loser_ability_used,
                        'damage_dealt': result.damage_dealt
                    })
        
        return self.analyze_results(results)
    
    def analyze_results(self, results: List[Dict]) -> Dict[str, Any]:
        """Analyze simulation results and generate statistics."""
        language_ids = list(self.languages.keys())
        
        # Language performance statistics
        language_stats = {}
        for lang_id in language_ids:
            wins = [r for r in results if r['winner'] == lang_id]
            losses = [r for r in results if r['loser'] == lang_id]
            total_battles = len(wins) + len(losses)
            
            if total_battles == 0:
                continue
                
            win_rate = len(wins) / total_battles
            avg_hp_remaining = statistics.mean([r['winner_hp_remaining'] for r in wins]) if wins else 0
            avg_turns_when_winning = statistics.mean([r['turns_taken'] for r in wins]) if wins else 0
            avg_damage_dealt = statistics.mean([r['damage_dealt'][lang_id] for r in results if lang_id in r['damage_dealt']])
            
            language_stats[lang_id] = {
                'total_battles': total_battles,
                'wins': len(wins),
                'losses': len(losses),
                'win_rate': win_rate,
                'avg_hp_remaining_when_winning': avg_hp_remaining,
                'avg_turns_when_winning': avg_turns_when_winning,
                'avg_damage_dealt': avg_damage_dealt,
                'language_name': self.languages[lang_id]['name']
            }
        
        # Ability performance statistics
        ability_stats = {}
        for lang_id in language_ids:
            lang = self.languages[lang_id]
            for ability_index, ability in enumerate(lang['abilities']):
                ability_name = ability['name']
                key = f"{lang_id}_{ability_index}"
                
                # Find battles where this ability was used
                battles_with_ability = [r for r in results if 
                    (r['language1'] == lang_id and r['ability1_index'] == ability_index) or
                    (r['language2'] == lang_id and r['ability2_index'] == ability_index)]
                
                wins_with_ability = [r for r in battles_with_ability if r['winner'] == lang_id]
                losses_with_ability = [r for r in battles_with_ability if r['loser'] == lang_id]
                total_with_ability = len(wins_with_ability) + len(losses_with_ability)
                
                if total_with_ability == 0:
                    continue
                
                win_rate_with_ability = len(wins_with_ability) / total_with_ability
                avg_damage_with_ability = statistics.mean([
                    r['damage_dealt'][lang_id] for r in battles_with_ability 
                    if lang_id in r['damage_dealt']
                ])
                
                ability_stats[key] = {
                    'language_id': lang_id,
                    'language_name': lang['name'],
                    'ability_name': ability_name,
                    'ability_index': ability_index,
                    'ability_type': ability['type'],
                    'ability_power': ability['power'],
                    'total_uses': total_with_ability,
                    'wins_with_ability': len(wins_with_ability),
                    'losses_with_ability': len(losses_with_ability),
                    'win_rate_with_ability': win_rate_with_ability,
                    'avg_damage_with_ability': avg_damage_with_ability
                }
        
        # Head-to-head matchup statistics
        matchup_stats = {}
        for i, lang1_id in enumerate(language_ids):
            for j, lang2_id in enumerate(language_ids):
                if i >= j:
                    continue
                
                matchup_key = f"{lang1_id}_vs_{lang2_id}"
                battles = [r for r in results if 
                    (r['language1'] == lang1_id and r['language2'] == lang2_id) or
                    (r['language1'] == lang2_id and r['language2'] == lang1_id)]
                
                lang1_wins = len([r for r in battles if r['winner'] == lang1_id])
                lang2_wins = len([r for r in battles if r['winner'] == lang2_id])
                total_matchup_battles = len(battles)
                
                if total_matchup_battles == 0:
                    continue
                
                matchup_stats[matchup_key] = {
                    'language1': lang1_id,
                    'language2': lang2_id,
                    'language1_name': self.languages[lang1_id]['name'],
                    'language2_name': self.languages[lang2_id]['name'],
                    'total_battles': total_matchup_battles,
                    'language1_wins': lang1_wins,
                    'language2_wins': lang2_wins,
                    'language1_win_rate': lang1_wins / total_matchup_battles,
                    'language2_win_rate': lang2_wins / total_matchup_battles
                }
        
        return {
            'metadata': {
                'simulation_date': datetime.now().isoformat(),
                'total_battles': len(results),
                'battles_per_matchup': 100,
                'languages_simulated': len(language_ids),
                'random_seed': None  # No fixed seed for variety
            },
            'language_performance': language_stats,
            'ability_performance': ability_stats,
            'matchup_statistics': matchup_stats,
            'raw_results': results[:100]  # Include first 100 raw results for debugging
        }

def main():
    """Run the simulation and save results."""
    print("🎮 Codemon Battle Simulator")
    print("=" * 40)
    
    simulator = CodemonSimulator()
    results = simulator.run_simulation(battles_per_matchup=100)
    
    # Save results
    output_file = "battle_simulation_results.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Simulation complete!")
    print(f"📊 Results saved to: {output_file}")
    print(f"🎯 Total battles simulated: {results['metadata']['total_battles']}")
    
    # Print summary
    print("\n🏆 Language Performance Summary:")
    print("-" * 50)
    for lang_id, stats in sorted(results['language_performance'].items(), 
                                key=lambda x: x[1]['win_rate'], reverse=True):
        print(f"{stats['language_name']:20} | Win Rate: {stats['win_rate']:.1%} | "
              f"Battles: {stats['total_battles']} | Avg HP Remaining: {stats['avg_hp_remaining_when_winning']:.1f}")
    
    print("\n⚔️ Top Performing Abilities:")
    print("-" * 50)
    for key, stats in sorted(results['ability_performance'].items(), 
                           key=lambda x: x[1]['win_rate_with_ability'], reverse=True)[:10]:
        print(f"{stats['language_name']:15} - {stats['ability_name']:20} | "
              f"Win Rate: {stats['win_rate_with_ability']:.1%} | "
              f"Avg Damage: {stats['avg_damage_with_ability']:.1f}")

if __name__ == "__main__":
    main() 