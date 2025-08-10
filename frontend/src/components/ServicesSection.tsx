import { Building2 } from "lucide-react";
import { Button } from "./ui/button";

export default function ServicesSection() {
  const useCases = [
    {
      icon: Building2,
      title: "Relatórios Financeiros",
      description: "Análise automática de performance financeira, fluxo de caixa e projeções.",
      features: ["Análise de Vendas", "Controle de Gastos", "Projeções Futuras", "KPIs Financeiros"]
    }
  ];

  console.log('🔍 Renderizando ServicesSection com', useCases.length, 'cards:', useCases.map(card => card.title));

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use Cases Section */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
              Casos de Uso
            </h2>
            <p className="text-xl text-gray-600">
              O AutoReport se adapta a diferentes necessidades de negócio, 
              fornecendo insights personalizados para cada área da sua empresa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-gray-600 mb-4">{useCase.description}</p>
                    <ul className="space-y-2">
                      {useCase.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}