#!/usr/bin/env python3
"""
Balance Analysis for Codemon Battle Simulator
Analyzes simulation results and suggests balance improvements.
"""

import json
from typing import Dict, List, Tuple

def analyze_balance(results_file: str = "battle_simulation_results.json"):
    """Analyze balance issues and suggest improvements."""
    
    with open(results_file, 'r') as f:
        data = json.load(f)
    
    print("🎯 Codemon Balance Analysis")
    print("=" * 50)
    
    # Language balance analysis
    print("\n🏆 Language Performance Analysis:")
    print("-" * 40)
    
    language_stats = data['language_performance']
    sorted_languages = sorted(language_stats.items(), 
                            key=lambda x: x[1]['win_rate'], reverse=True)
    
    for lang_id, stats in sorted_languages:
        win_rate = stats['win_rate']
        status = "🟢 BALANCED" if 0.45 <= win_rate <= 0.55 else \
                "🔴 OVERPOWERED" if win_rate > 0.55 else "🔵 UNDERPOWERED"
        
        print(f"{stats['language_name']:20} | Win Rate: {win_rate:.1%} | {status}")
    
    # Ability balance analysis
    print("\n⚔️ Ability Performance Analysis:")
    print("-" * 40)
    
    ability_stats = data['ability_performance']
    sorted_abilities = sorted(ability_stats.items(), 
                            key=lambda x: x[1]['win_rate_with_ability'], reverse=True)
    
    print("Top 5 Overpowered Abilities:")
    for i, (key, stats) in enumerate(sorted_abilities[:5]):
        win_rate = stats['win_rate_with_ability']
        print(f"{i+1}. {stats['language_name']:15} - {stats['ability_name']:20} | "
              f"Win Rate: {win_rate:.1%} | Power: {stats['ability_power']}")
    
    print("\nBottom 5 Underpowered Abilities:")
    for i, (key, stats) in enumerate(sorted_abilities[-5:]):
        win_rate = stats['win_rate_with_ability']
        print(f"{i+1}. {stats['language_name']:15} - {stats['ability_name']:20} | "
              f"Win Rate: {win_rate:.1%} | Power: {stats['ability_power']}")
    
    # Balance recommendations
    print("\n💡 Balance Recommendations:")
    print("-" * 40)
    
    # Find most overpowered ability
    most_op = sorted_abilities[0]
    most_op_stats = most_op[1]
    
    # Find most underpowered ability
    most_up = sorted_abilities[-1]
    most_up_stats = most_up[1]
    
    print(f"🔴 Most Overpowered: {most_op_stats['language_name']} - {most_op_stats['ability_name']}")
    print(f"   Current Win Rate: {most_op_stats['win_rate_with_ability']:.1%}")
    print(f"   Suggested: Reduce power from {most_op_stats['ability_power']} to {max(1, most_op_stats['ability_power'] - 20)}")
    
    print(f"\n🔵 Most Underpowered: {most_up_stats['language_name']} - {most_up_stats['ability_name']}")
    print(f"   Current Win Rate: {most_up_stats['win_rate_with_ability']:.1%}")
    print(f"   Suggested: Increase power from {most_up_stats['ability_power']} to {most_up_stats['ability_power'] + 20}")
    
    # Language-specific recommendations
    print(f"\n🎯 Language-Specific Recommendations:")
    print("-" * 40)
    
    for lang_id, stats in sorted_languages:
        if stats['win_rate'] > 0.55:
            print(f"🔴 {stats['language_name']}: Consider nerfing abilities")
        elif stats['win_rate'] < 0.45:
            print(f"🔵 {stats['language_name']}: Consider buffing abilities")
        else:
            print(f"🟢 {stats['language_name']}: Well balanced")
    
    # Matchup analysis
    print(f"\n⚔️ Notable Matchups:")
    print("-" * 40)
    
    matchup_stats = data['matchup_statistics']
    for matchup_key, matchup in matchup_stats.items():
        lang1_win_rate = matchup['language1_win_rate']
        if lang1_win_rate > 0.7 or lang1_win_rate < 0.3:
            status = "🔴" if lang1_win_rate > 0.7 else "🔵"
            print(f"{status} {matchup['language1_name']} vs {matchup['language2_name']}: "
                  f"{lang1_win_rate:.1%} win rate")

def generate_balance_report():
    """Generate a comprehensive balance report."""
    
    with open("battle_simulation_results.json", 'r') as f:
        data = json.load(f)
    
    report = {
        "summary": {
            "total_battles": data['metadata']['total_battles'],
            "languages_tested": len(data['language_performance']),
            "abilities_tested": len(data['ability_performance'])
        },
        "balance_issues": {
            "overpowered_languages": [],
            "underpowered_languages": [],
            "overpowered_abilities": [],
            "underpowered_abilities": []
        },
        "recommendations": []
    }
    
    # Analyze languages
    for lang_id, stats in data['language_performance'].items():
        if stats['win_rate'] > 0.55:
            report['balance_issues']['overpowered_languages'].append({
                'language': stats['language_name'],
                'win_rate': stats['win_rate'],
                'suggestion': 'Consider nerfing abilities or reducing base stats'
            })
        elif stats['win_rate'] < 0.45:
            report['balance_issues']['underpowered_languages'].append({
                'language': stats['language_name'],
                'win_rate': stats['win_rate'],
                'suggestion': 'Consider buffing abilities or increasing base stats'
            })
    
    # Analyze abilities
    for key, stats in data['ability_performance'].items():
        if stats['win_rate_with_ability'] > 0.7:
            report['balance_issues']['overpowered_abilities'].append({
                'language': stats['language_name'],
                'ability': stats['ability_name'],
                'win_rate': stats['win_rate_with_ability'],
                'power': stats['ability_power'],
                'suggestion': f'Reduce power from {stats["ability_power"]} to {max(1, stats["ability_power"] - 20)}'
            })
        elif stats['win_rate_with_ability'] < 0.3:
            report['balance_issues']['underpowered_abilities'].append({
                'language': stats['language_name'],
                'ability': stats['ability_name'],
                'win_rate': stats['win_rate_with_ability'],
                'power': stats['ability_power'],
                'suggestion': f'Increase power from {stats["ability_power"]} to {stats["ability_power"] + 20}'
            })
    
    # Save report
    with open("balance_report.json", 'w') as f:
        json.dump(report, f, indent=2)
    
    print("📊 Balance report saved to: balance_report.json")

if __name__ == "__main__":
    analyze_balance()
    generate_balance_report() 