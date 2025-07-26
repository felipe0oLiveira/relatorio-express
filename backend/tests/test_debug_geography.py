#!/usr/bin/env python3
"""
Teste para debugar a condição geography
"""

def test_geography_condition():
    """Testa a condição geography"""
    
    # Teste 1: Valores corretos
    report_type = "geography"
    region_column = "Region"
    value_column = "Total"
    
    print(f"🔍 Teste 1:")
    print(f"report_type: '{report_type}'")
    print(f"region_column: '{region_column}'")
    print(f"value_column: '{value_column}'")
    
    condition = (report_type == 'geography' and 
                region_column and 
                value_column and 
                region_column.strip() and 
                value_column.strip())
    
    print(f"Condição: {condition}")
    
    # Teste 2: Valores vazios
    report_type2 = "geography"
    region_column2 = ""
    value_column2 = "Total"
    
    print(f"\n🔍 Teste 2:")
    print(f"report_type: '{report_type2}'")
    print(f"region_column: '{region_column2}'")
    print(f"value_column: '{value_column2}'")
    
    condition2 = (report_type2 == 'geography' and 
                 region_column2 and 
                 value_column2 and 
                 region_column2.strip() and 
                 value_column2.strip())
    
    print(f"Condição: {condition2}")
    
    # Teste 3: Valores None
    report_type3 = "geography"
    region_column3 = None
    value_column3 = "Total"
    
    print(f"\n🔍 Teste 3:")
    print(f"report_type: '{report_type3}'")
    print(f"region_column: {region_column3}")
    print(f"value_column: '{value_column3}'")
    
    condition3 = (report_type3 == 'geography' and 
                 region_column3 and 
                 value_column3 and 
                 region_column3.strip() if region_column3 else False and 
                 value_column3.strip())
    
    print(f"Condição: {condition3}")

if __name__ == "__main__":
    print("🎯 TESTE DE CONDIÇÃO GEOGRAPHY")
    print("=" * 40)
    
    test_geography_condition() 