"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export default function FinalCTASection() {
  const benefits = [
    "Relatórios profissionais em minutos",
    "Análise automática com IA avançada",
    "Suporte especializado 24/7",
    "Integração com múltiplas fontes de dados"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Transforme Seus Dados Hoje
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
              Junte-se a centenas de empresas que já estão economizando tempo e tomando decisões mais inteligentes com o AutoReport
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <p className="text-white font-medium">{benefit}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
              Começar Gratuitamente
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Agendar Demonstração
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-blue-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm">4.9/5 avaliações</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold">+500</span> empresas confiam
            </div>
            <div className="text-sm">
              <span className="font-semibold">99.9%</span> uptime garantido
            </div>
          </motion.div>

          {/* Final Message */}
          <motion.div
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-100 text-lg">
              <span className="font-semibold text-white">Não perca mais tempo</span> com relatórios manuais. 
              Deixe nossa IA fazer o trabalho pesado enquanto você foca no que realmente importa: 
              <span className="font-semibold text-white"> seu negócio</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 