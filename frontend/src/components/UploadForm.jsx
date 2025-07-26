import React, { useState } from 'react';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setStep(2);
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('question', question);

      const response = await fetch('http://localhost:8000/reports/analyze/custom', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data);
      setStep(3);
    } catch (error) {
      console.error('Erro na análise:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "Qual a média de vendas?",
    "Quanto foi o total de vendas?",
    "Qual o produto mais vendido?",
    "Compare vendas por região",
    "Mostre a tendência de vendas",
    "Quem são os melhores vendedores?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🤖 AutoReport AI
          </h1>
          <p className="text-xl text-gray-600">
            Faça perguntas sobre seus dados em linguagem natural
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Pergunta</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Resultado</span>
            </div>
          </div>
        </div>

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Faça upload dos seus dados
              </h2>
              <p className="text-gray-600 mb-8">
                Suporte para arquivos CSV e Excel (máximo 5MB)
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      ou arraste e solte aqui
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Question Input */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Faça sua pergunta
              </h2>
              <p className="text-gray-600">
                Digite sua pergunta em linguagem natural sobre os dados
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Qual a média de vendas por região?"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                rows={4}
              />
            </div>

            {/* Suggested Questions */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                💡 Perguntas sugeridas:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(suggestion)}
                    className="p-3 text-left bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={handleQuestionSubmit}
                disabled={!question.trim() || loading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analisando...
                  </div>
                ) : (
                  '🔍 Analisar'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && analysis && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                📊 Resultado da Análise
              </h2>
              <p className="text-gray-600">
                Pergunta: "{question}"
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🎯 Resposta:
              </h3>
              <div className="text-blue-900">
                {analysis.message || JSON.stringify(analysis, null, 2)}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setStep(2);
                  setQuestion('');
                  setAnalysis(null);
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Nova Pergunta
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setQuestion('');
                  setAnalysis(null);
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📁 Novo Arquivo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm; 