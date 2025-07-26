#!/usr/bin/env python3
"""
Teste que simula o endpoint usando pandas ExcelWriter
"""

import pandas as pd
from openpyxl.chart import BarChart, Reference
from openpyxl.chart.label import DataLabelList
from io import BytesIO

def test_pandas_excel_writer_with_chart():
    """Testa pandas ExcelWriter com gráfico"""
    
    print("🧪 Testando pandas ExcelWriter com gráfico...")
    
    # Dados de teste
    data = {
        'Region': ['West', 'Northeast', 'Southeast', 'South', 'Midwest'],
        'Total': [270000000, 186000000, 163000000, 145000000, 136000000]
    }
    
    df = pd.DataFrame(data)
    print(f"📊 DataFrame criado: {len(df)} linhas")
    
    # Criar arquivo Excel na memória
    output = BytesIO()
    
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        # Adicionar dados
        df.to_excel(writer, sheet_name='Análise Geográfica', index=False)
        print("📄 Dados adicionados ao Excel")
        
        # Tentar adicionar gráfico
        try:
            from openpyxl.chart import BarChart, Reference
            from openpyxl.chart.label import DataLabelList
            print("✅ Módulos importados")
            
            # Obter a planilha
            try:
                worksheet = writer.sheets['Análise Geográfica']
                print(f"📄 Planilha obtida via writer.sheets: {worksheet.title}")
            except:
                workbook = writer.book
                worksheet = workbook['Análise Geográfica']
                print(f"📄 Planilha obtida via workbook: {worksheet.title}")
            
            # Criar gráfico
            chart = BarChart()
            chart.title = "Análise de Total por Region"
            chart.style = 10
            chart.x_axis.title = "Region"
            chart.y_axis.title = "Total"
            print("📈 Gráfico criado")
            
            # Referências
            data = Reference(worksheet, min_col=2, min_row=1, max_row=len(df)+1, max_col=2)
            cats = Reference(worksheet, min_col=1, min_row=2, max_row=len(df)+1)
            print(f"📊 Referências criadas")
            
            chart.add_data(data, titles_from_data=True)
            chart.set_categories(cats)
            print("📊 Dados adicionados ao gráfico")
            
            # Rótulos
            chart.dataLabels = DataLabelList()
            chart.dataLabels.showVal = True
            print("🏷️ Rótulos adicionados")
            
            # Adicionar à planilha
            worksheet.add_chart(chart, "D2")
            print("✅ Gráfico adicionado à planilha!")
            
        except Exception as e:
            print(f"❌ Erro: {str(e)}")
            import traceback
            print(f"🔍 Traceback: {traceback.format_exc()}")
    
    # Salvar arquivo
    output.seek(0)
    with open('teste_pandas_writer.xlsx', 'wb') as f:
        f.write(output.getvalue())
    
    print("💾 Arquivo salvo como 'teste_pandas_writer.xlsx'")
    print("🔍 Abra o arquivo e verifique se há gráfico!")

if __name__ == "__main__":
    print("🎯 TESTE PANDAS EXCELWRITER")
    print("=" * 40)
    
    test_pandas_excel_writer_with_chart() 