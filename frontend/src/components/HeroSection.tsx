"use client";

import { Button } from "./ui/button";
import { ArrowRight, Play, Upload, Brain, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "./ImageWithFallback";

// Componente de animação 3D do relatório melhorado
const Chart3DAnimation = () => {
  return (
    <div className="relative w-40 h-28 mx-auto">
      {/* Container 3D do relatório */}
      <motion.div
        className="relative w-full h-full perspective-1000"
        animate={{ rotateY: [0, 5, 0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Fundo do relatório */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30 backdrop-blur-sm">
          
          {/* Cabeçalho do relatório */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Ícone de documento no cabeçalho */}
            <motion.div
              className="absolute top-1 left-2 w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            />
            <motion.div
              className="absolute top-1 left-5 w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            />
            <motion.div
              className="absolute top-1 left-8 w-2 h-2 bg-white rounded-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            />
          </motion.div>

          {/* Título do relatório */}
          <motion.div
            className="absolute top-5 left-2 right-2 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />

          {/* Conteúdo do relatório - Gráfico */}
          <div className="absolute top-10 left-2 right-2 bottom-2">
            {/* Grade do gráfico */}
            <div className="absolute inset-0 opacity-20">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-full h-px bg-blue-400"
                  style={{ top: `${33 * i}%` }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 1 }}
                />
              ))}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-full w-px bg-blue-400"
                  style={{ left: `${25 * i}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 1.3 }}
                />
              ))}
            </div>

            {/* Barras do gráfico */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-sm shadow-lg"
                style={{ 
                  left: `${20 + i * 25}%`, 
                  width: '15%',
                  height: '0%'
                }}
                initial={{ height: "0%" }}
                animate={{ height: `${30 + i * 20}%` }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.5 + i * 0.3,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.3,
                  z: 50,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Efeito de brilho nas barras */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent rounded-t-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
                
                {/* Valor da barra */}
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-white font-bold"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5 + i * 0.3 }}
                >
                  {Math.floor(Math.random() * 50) + 20}%
                </motion.div>
              </motion.div>
            ))}

            {/* Linha de tendência */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
              <motion.path
                d="M 10% 80% Q 30% 60% 50% 40% T 90% 20%"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 2.2 }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Pontos na linha */}
            {[10, 30, 50, 70, 90].map((x, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full border border-white shadow-sm"
                style={{ 
                  left: `${x}%`,
                  top: `${80 - i * 15}%`
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 2.2 + i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.8 }}
              />
            ))}
          </div>

          {/* Partículas de processamento */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -15, 0],
                x: [0, Math.random() * 8 - 4, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Indicador de progresso */}
          <motion.div
            className="absolute bottom-1 left-2 right-2 h-1 bg-gray-600 rounded-full overflow-hidden"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 1 }}
            />
          </motion.div>
        </div>

        {/* Sombra 3D */}
        <motion.div
          className="absolute -bottom-2 left-2 right-2 h-2 bg-black/20 rounded-lg blur-sm"
          animate={{ 
            scaleX: [0.8, 1, 0.8],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />


      </motion.div>

             {/* Texto de status melhorado */}
       <motion.div
         className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2.5 }}
       >
         <div className="flex items-center gap-2">
           <motion.div
             className="w-2 h-2 bg-green-500 rounded-full"
             animate={{ scale: [1, 1.5, 1] }}
             transition={{ duration: 1, repeat: Infinity }}
           />
           <span className="text-xs text-green-400 font-medium">Relatório Pronto</span>
         </div>
       </motion.div>
    </div>
  );
};

export default function HeroSection() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Simples",
      description: "Arraste e solte seus dados",
      color: "from-blue-500 to-cyan-500",
      delay: 0.2
    },
    {
      icon: Brain,
      title: "IA Processa",
      description: "Análise inteligente automática",
      color: "from-purple-500 to-pink-500",
      delay: 0.4
    },
    {
      icon: FileText,
      title: "Relatório Pronto",
      description: "Insights em segundos",
      color: "from-green-500 to-emerald-500",
      delay: 0.6
    }
  ];

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-screen">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-white text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                Análise de Dados &
                <span className="block text-yellow-300">Relatórios com IA</span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Transforme dados complexos em insights valiosos. 
                Processamento inteligente e relatórios profissionais 
                automatizados pela nossa IA avançada.
              </p>
            </div>

            {/* 3D Process Steps */}
            <div className="pt-8">
              <div className="text-center lg:text-left mb-6">
                <p className="text-yellow-300 text-lg font-semibold">Processo completo em menos de 2 minutos!</p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center lg:items-start group cursor-pointer"
                    initial={{ opacity: 0, y: 20, rotateX: -15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: step.delay, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.1, 
                      rotateY: 5, 
                      rotateX: 5,
                      z: 50,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* 3D Icon Container */}
                    <motion.div 
                      className="relative w-16 h-16 mb-3 perspective-1000"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full opacity-90 shadow-2xl transform rotate-3 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 ease-out`}></div>
                      <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300">
                        <step.icon className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      {/* 3D Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full opacity-20 blur-xl scale-150 group-hover:scale-200 transition-all duration-500`}></div>
                      
                      {/* Loading Animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-transparent"
                        style={{
                          background: `conic-gradient(from 0deg, transparent 0deg, ${step.color.split(' ')[1]} 0deg, ${step.color.split(' ')[1]} 360deg)`
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: step.delay * 2
                        }}
                      />
                    </motion.div>
                    
                    <motion.div 
                      className="text-center lg:text-left"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-sm font-semibold text-yellow-300 mb-1 group-hover:text-white transition-colors duration-300">{step.title}</h3>
                      <p className="text-xs text-blue-200 group-hover:text-blue-100 transition-colors duration-300">{step.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mt-2 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${step.color} rounded-full`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ 
                            duration: 1.5, 
                            delay: step.delay + 0.5,
                            ease: "easeOut"
                          }}
                        />
                      </div>
                      
                      {/* Status Text */}
                      <motion.div
                        className="text-xs text-blue-300 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ 
                          duration: 2,
                          delay: step.delay + 0.3,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        {step.title === "Upload Simples" ? "Enviando..." : 
                         step.title === "IA Processa" ? "Processando..." : 
                         "Gerando..."}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* Animação 3D do Gráfico */}
              <motion.div 
                className="mt-8 flex justify-center items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                style={{ 
                  position: 'relative',
                  left: '40%',
                  transform: 'translateX(-50%)'
                }}
              >
                <Chart3DAnimation />
              </motion.div>
            </div>
          </div>

          {/* Right Side - Main Floating Illustration */}
          <div className="relative w-full h-[600px]">
            {/* Imagem principal - servidores e personagem */}
            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2 z-10"
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                transition: { duration: 0.4 }
              }}
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <ImageWithFallback
                  src="https://datrics.themetags.com/img/hero-single-img-5.svg"
                  alt="AutoReport Analytics Platform" 
                  className="w-full max-w-4xl h-auto drop-shadow-2xl hover:drop-shadow-3xl transition-all duration-500"
                />
              </motion.div>
            </motion.div>

            {/* Segunda imagem, posicionada adequadamente */}
            <motion.div 
              className="absolute left-32 top-1/3 -translate-y-1/2 z-0"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <ImageWithFallback
                src="https://datrics.themetags.com/img/hero-animation-01.svg"
                alt="Analytics Animation"
                className="w-35 h-35 opacity-80"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}