#!/usr/bin/env python3
"""
Compare Before/After Balance Results
Shows the impact of balance changes on language and ability performance.
"""

import json
from typing import Dict, Any

def load_results(filename: str) -> Dict[str, Any]:
    """Load simulation results from JSON file."""
    with open(filename, 'r') as f:
        return json.load(f)

def compare_results():
    """Compare before and after balance results."""
    
    print("🎮 Codemon Balance Changes Comparison")
    print("=" * 50)
    
    # Load both result sets
    before = load_results("battle_simulation_results_BEFORE_BALANCE.json")
    after = load_results("battle_simulation_results.json")
    
    print(f"\n📊 Simulation Overview:")
    print(f"Before: {before['metadata']['total_battles']} battles")
    print(f"After:  {after['metadata']['total_battles']} battles")
    
    # Language performance comparison
    print(f"\n🏆 Language Performance Changes:")
    print("-" * 60)
    print(f"{'Language':<20} {'Before':<10} {'After':<10} {'Change':<10} {'Status':<15}")
    print("-" * 60)
    
    before_langs = before['language_performance']
    after_langs = after['language_performance']
    
    for lang_id in before_langs.keys():
        if lang_id in after_langs:
            before_rate = before_langs[lang_id]['win_rate']
            after_rate = after_langs[lang_id]['win_rate']
            change = after_rate - before_rate
            change_str = f"{change:+.1%}"
            
            # Determine status
            if after_rate > 0.55:
                status = "🔴 OVERPOWERED"
            elif after_rate < 0.45:
                status = "🔵 UNDERPOWERED"
            else:
                status = "🟢 BALANCED"
            
            print(f"{after_langs[lang_id]['language_name']:<20} {before_rate:<9.1%} {after_rate:<9.1%} {change_str:<10} {status}")
    
    # Ability performance comparison
    print(f"\n⚔️ Top 5 Ability Performance Changes:")
    print("-" * 60)
    print(f"{'Language':<15} {'Ability':<20} {'Before':<10} {'After':<10} {'Change':<10}")
    print("-" * 60)
    
    before_abilities = before['ability_performance']
    after_abilities = after['ability_performance']
    
    # Get top 5 abilities from after results
    sorted_after = sorted(after_abilities.items(), 
                         key=lambda x: x[1]['win_rate_with_ability'], reverse=True)
    
    for i, (key, after_stats) in enumerate(sorted_after[:5]):
        lang_name = after_stats['language_name']
        ability_name = after_stats['ability_name']
        
        # Find corresponding before stats
        before_rate = 0
        for before_key, before_stats in before_abilities.items():
            if (before_stats['language_name'] == lang_name and 
                before_stats['ability_name'] == ability_name):
                before_rate = before_stats['win_rate_with_ability']
                break
        
        after_rate = after_stats['win_rate_with_ability']
        change = after_rate - before_rate
        change_str = f"{change:+.1%}"
        
        print(f"{lang_name:<15} {ability_name:<20} {before_rate:<9.1%} {after_rate:<9.1%} {change_str}")
    
    # Overall balance improvement
    print(f"\n📈 Overall Balance Analysis:")
    print("-" * 40)
    
    # Count balance issues before and after
    def count_balance_issues(data):
        langs = data['language_performance']
        abilities = data['ability_performance']
        
        op_langs = sum(1 for stats in langs.values() if stats['win_rate'] > 0.55)
        up_langs = sum(1 for stats in langs.values() if stats['win_rate'] < 0.45)
        op_abilities = sum(1 for stats in abilities.values() if stats['win_rate_with_ability'] > 0.7)
        up_abilities = sum(1 for stats in abilities.values() if stats['win_rate_with_ability'] < 0.3)
        
        return op_langs, up_langs, op_abilities, up_abilities
    
    before_issues = count_balance_issues(before)
    after_issues = count_balance_issues(after)
    
    print(f"Before Balance Issues:")
    print(f"  Overpowered Languages: {before_issues[0]}")
    print(f"  Underpowered Languages: {before_issues[1]}")
    print(f"  Overpowered Abilities: {before_issues[2]}")
    print(f"  Underpowered Abilities: {before_issues[3]}")
    
    print(f"\nAfter Balance Issues:")
    print(f"  Overpowered Languages: {after_issues[0]}")
    print(f"  Underpowered Languages: {after_issues[1]}")
    print(f"  Overpowered Abilities: {after_issues[2]}")
    print(f"  Underpowered Abilities: {after_issues[3]}")
    
    # Calculate improvement
    total_before = sum(before_issues)
    total_after = sum(after_issues)
    improvement = total_before - total_after
    
    print(f"\n🎯 Balance Improvement: {improvement} issues resolved")
    
    if improvement > 0:
        print("✅ Balance changes were beneficial!")
    elif improvement < 0:
        print("❌ Balance changes made things worse!")
    else:
        print("⚠️  Balance changes had no net effect")
    
    # Specific changes that worked
    print(f"\n💡 Key Changes That Worked:")
    print("-" * 40)
    
    # Find abilities that improved significantly
    improved_abilities = []
    for key, after_stats in after_abilities.items():
        lang_name = after_stats['language_name']
        ability_name = after_stats['ability_name']
        
        # Find before stats
        for before_key, before_stats in before_abilities.items():
            if (before_stats['language_name'] == lang_name and 
                before_stats['ability_name'] == ability_name):
                before_rate = before_stats['win_rate_with_ability']
                after_rate = after_stats['win_rate_with_ability']
                
                if after_rate > before_rate + 0.1:  # 10% improvement
                    improved_abilities.append((lang_name, ability_name, before_rate, after_rate))
                break
    
    for lang_name, ability_name, before_rate, after_rate in improved_abilities[:5]:
        improvement = after_rate - before_rate
        print(f"✅ {lang_name} - {ability_name}: {before_rate:.1%} → {after_rate:.1%} (+{improvement:.1%})")
    
    # Changes that didn't work
    print(f"\n❌ Changes That Backfired:")
    print("-" * 40)
    
    worsened_abilities = []
    for key, after_stats in after_abilities.items():
        lang_name = after_stats['language_name']
        ability_name = after_stats['ability_name']
        
        # Find before stats
        for before_key, before_stats in before_abilities.items():
            if (before_stats['language_name'] == lang_name and 
                before_stats['ability_name'] == ability_name):
                before_rate = before_stats['win_rate_with_ability']
                after_rate = after_stats['win_rate_with_ability']
                
                if after_rate < before_rate - 0.1:  # 10% decline
                    worsened_abilities.append((lang_name, ability_name, before_rate, after_rate))
                break
    
    for lang_name, ability_name, before_rate, after_rate in worsened_abilities[:5]:
        decline = after_rate - before_rate
        print(f"❌ {lang_name} - {ability_name}: {before_rate:.1%} → {after_rate:.1%} ({decline:.1%})")

if __name__ == "__main__":
    compare_results() 