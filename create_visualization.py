#!/usr/bin/env python3
"""
Visualization Generator for Codemon Battle Results
Creates text-based visualizations for easy analysis.
"""

import json

def create_text_visualizations():
    """Create text-based visualizations of the battle results."""
    
    with open("battle_simulation_results.json", 'r') as f:
        data = json.load(f)
    
    print("📊 Codemon Battle Visualization")
    print("=" * 50)
    
    # Language Win Rate Chart
    print("\n🏆 Language Win Rates:")
    print("-" * 40)
    
    language_stats = data['language_performance']
    sorted_languages = sorted(language_stats.items(), 
                            key=lambda x: x[1]['win_rate'], reverse=True)
    
    for lang_id, stats in sorted_languages:
        win_rate = stats['win_rate']
        bars = "█" * int(win_rate * 20)  # 20 bars max
        print(f"{stats['language_name']:20} | {bars:20} | {win_rate:.1%}")
    
    # Ability Performance Chart
    print("\n⚔️ Ability Performance (Top 10):")
    print("-" * 50)
    
    ability_stats = data['ability_performance']
    sorted_abilities = sorted(ability_stats.items(), 
                            key=lambda x: x[1]['win_rate_with_ability'], reverse=True)
    
    for i, (key, stats) in enumerate(sorted_abilities[:10]):
        win_rate = stats['win_rate_with_ability']
        bars = "█" * int(win_rate * 15)  # 15 bars max
        print(f"{i+1:2}. {stats['language_name']:15} - {stats['ability_name']:20} | {bars:15} | {win_rate:.1%}")
    
    # Damage Analysis
    print("\n💥 Average Damage by Ability:")
    print("-" * 40)
    
    for key, stats in sorted_abilities:
        avg_damage = stats['avg_damage_with_ability']
        bars = "█" * int(avg_damage / 10)  # Scale by 10
        print(f"{stats['language_name']:15} - {stats['ability_name']:20} | {bars:15} | {avg_damage:.1f}")
    
    # Matchup Matrix
    print("\n⚔️ Head-to-Head Win Rates:")
    print("-" * 50)
    
    matchup_stats = data['matchup_statistics']
    languages = list(language_stats.keys())
    language_names = [language_stats[lang]['language_name'] for lang in languages]
    
    # Print header
    print(f"{'':15}", end="")
    for name in language_names:
        print(f"{name[:8]:>8}", end="")
    print()
    
    # Print matrix
    for i, lang1 in enumerate(languages):
        print(f"{language_names[i]:15}", end="")
        for j, lang2 in enumerate(languages):
            if i == j:
                print(f"{'--':>8}", end="")
            else:
                matchup_key = f"{lang1}_vs_{lang2}"
                if matchup_key in matchup_stats:
                    win_rate = matchup_stats[matchup_key]['language1_win_rate']
                    print(f"{win_rate:>7.0%}", end="")
                else:
                    matchup_key = f"{lang2}_vs_{lang1}"
                    if matchup_key in matchup_stats:
                        win_rate = 1 - matchup_stats[matchup_key]['language1_win_rate']
                        print(f"{win_rate:>7.0%}", end="")
                    else:
                        print(f"{'--':>8}", end="")
        print()

def create_balance_summary():
    """Create a summary of balance issues."""
    
    with open("battle_simulation_results.json", 'r') as f:
        data = json.load(f)
    
    print("\n🎯 Balance Summary:")
    print("=" * 30)
    
    # Count balance issues
    language_stats = data['language_performance']
    ability_stats = data['ability_performance']
    
    overpowered_langs = sum(1 for stats in language_stats.values() if stats['win_rate'] > 0.55)
    underpowered_langs = sum(1 for stats in language_stats.values() if stats['win_rate'] < 0.45)
    balanced_langs = len(language_stats) - overpowered_langs - underpowered_langs
    
    overpowered_abilities = sum(1 for stats in ability_stats.values() if stats['win_rate_with_ability'] > 0.7)
    underpowered_abilities = sum(1 for stats in ability_stats.values() if stats['win_rate_with_ability'] < 0.3)
    balanced_abilities = len(ability_stats) - overpowered_abilities - underpowered_abilities
    
    print(f"Languages: {overpowered_langs} OP, {balanced_langs} Balanced, {underpowered_langs} UP")
    print(f"Abilities: {overpowered_abilities} OP, {balanced_abilities} Balanced, {underpowered_abilities} UP")
    
    # Overall balance score
    total_issues = overpowered_langs + underpowered_langs + overpowered_abilities + underpowered_abilities
    total_items = len(language_stats) + len(ability_stats)
    balance_score = (total_items - total_issues) / total_items
    
    print(f"\nOverall Balance Score: {balance_score:.1%}")
    
    if balance_score >= 0.8:
        print("🟢 Excellent balance!")
    elif balance_score >= 0.6:
        print("🟡 Good balance, minor issues")
    else:
        print("🔴 Significant balance issues detected")

if __name__ == "__main__":
    create_text_visualizations()
    create_balance_summary() 