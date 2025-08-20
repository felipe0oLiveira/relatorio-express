# Tipos de Gráficos - AutoReport

## 📊 Os 8 Tipos Mais Utilizados para Análises

O sistema agora oferece **8 tipos de gráficos** cuidadosamente selecionados para cobrir as principais necessidades de análise de dados:

### 1. 📊 Gráfico de Barras (`bar`)
**Melhor para:** Comparação entre categorias
- Comparar valores entre diferentes grupos
- Análise de vendas por região
- Performance de produtos
- **Exemplo:** Vendas por varejista, lucro por categoria

### 2. 📈 Gráfico de Linha (`line`)
**Melhor para:** Tendências temporais
- Evolução ao longo do tempo
- Análise de séries temporais
- Tendências de crescimento
- **Exemplo:** Vendas mensais, crescimento de receita

### 3. 🥧 Gráfico de Pizza (`pie`)
**Melhor para:** Proporções e percentuais
- Distribuição de partes de um todo
- Composição percentual
- Market share
- **Exemplo:** Distribuição de vendas por produto, composição de receita

### 4. 🔍 Gráfico de Dispersão (`scatter`)
**Melhor para:** Correlações entre variáveis
- Relacionamento entre duas variáveis
- Identificação de padrões
- Detecção de outliers
- **Exemplo:** Preço vs. Quantidade vendida, Idade vs. Renda

### 5. 📊 Histograma (`histogram`)
**Melhor para:** Distribuição de dados
- Frequência de valores
- Distribuição estatística
- Análise de concentração
- **Exemplo:** Distribuição de preços, frequência de vendas

### 6. 📊 Gráfico de Área (`area`)
**Melhor para:** Volume ao longo do tempo
- Acúmulo de valores
- Volume de dados
- Comparação de volumes
- **Exemplo:** Volume de vendas acumulado, estoque ao longo do tempo

### 7. 📊 Gráfico de Colunas (`column`)
**Melhor para:** Dados categóricos
- Similar ao gráfico de barras
- Melhor para categorias com nomes longos
- **Exemplo:** Vendas por mês, performance por departamento

### 8. 🔥 Mapa de Calor (`heatmap`)
**Melhor para:** Correlações múltiplas
- Matriz de correlações
- Padrões em dados multidimensionais
- Análise de intensidade
- **Exemplo:** Correlação entre variáveis, intensidade de vendas por região/mês

## 🎯 Como Escolher o Gráfico Correto

### Para Comparações:
- **Barras** ou **Colunas** - Melhor para comparar valores entre categorias

### Para Tendências:
- **Linha** - Mostra evolução ao longo do tempo
- **Área** - Mostra volume acumulado

### Para Proporções:
- **Pizza** - Mostra partes de um todo

### Para Relacionamentos:
- **Dispersão** - Mostra correlação entre duas variáveis
- **Mapa de Calor** - Mostra correlações múltiplas

### Para Distribuições:
- **Histograma** - Mostra frequência de valores

## ✨ Funcionalidades Implementadas

### Interatividade:
- ✅ **Clique nos gráficos** - Detecta cliques em elementos
- ✅ **Tooltips** - Informações ao passar o mouse
- ✅ **Responsivo** - Adapta-se a diferentes tamanhos de tela
- ✅ **Alta resolução** - Gráficos nítidos em qualquer dispositivo

### Personalização:
- ✅ **Cores customizáveis** - 8 cores padrão + cores personalizadas
- ✅ **Títulos e labels** - Configuração de títulos e rótulos dos eixos
- ✅ **Grade opcional** - Linhas de grade para melhor leitura
- ✅ **Legenda** - Exibição de legendas

### Qualidade Visual:
- ✅ **Bordas e sombras** - Elementos bem definidos
- ✅ **Tipografia** - Textos legíveis e bem posicionados
- ✅ **Animações** - Transições suaves
- ✅ **Estados hover** - Feedback visual ao interagir

## 🔧 Como Usar

```tsx
import ChartComponent from './ChartComponent';
import ChartSelector, { ChartType } from './ChartSelector';

// No seu componente:
const [selectedChartType, setSelectedChartType] = useState<ChartType>('bar');

// Dados de exemplo para gráfico de barras
const barData = {
  bars: [
    { label: 'Amazon', value: 90951 },
    { label: 'New Balance', value: 45678 },
    { label: 'H&M', value: 34567 }
  ]
};

// Renderizar
<ChartSelector
  selectedType={selectedChartType}
  onTypeChange={setSelectedChartType}
/>

<ChartComponent
  type={selectedChartType}
  data={barData}
  options={{
    title: 'Vendas por Varejista',
    showGrid: true,
    showLegend: true
  }}
  height={400}
  onChartClick={(data) => console.log('Clicou:', data)}
/>
```

## 🎨 Paleta de Cores Padrão

O sistema usa uma paleta de 8 cores harmoniosa:
- 🔵 **Azul** (#3B82F6) - Primária
- 🟢 **Verde** (#10B981) - Sucesso
- 🟡 **Amarelo** (#F59E0B) - Aviso
- 🔴 **Vermelho** (#EF4444) - Erro
- 🟣 **Roxo** (#8B5CF6) - Destaque
- 🔵 **Ciano** (#06B6D4) - Informação
- 🟠 **Laranja** (#F97316) - Ação
- 🟢 **Lima** (#84CC16) - Sucesso secundário

## 🚀 Próximas Melhorias

- [ ] **Zoom e pan** - Navegação em gráficos grandes
- [ ] **Exportação** - Salvar gráficos como imagem
- [ ] **Animações** - Transições entre tipos de gráfico
- [ ] **Templates** - Configurações pré-definidas
- [ ] **Dados em tempo real** - Atualização automática





