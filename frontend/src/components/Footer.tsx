import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-lg px-3 py-2">
                <span className="text-lg">AutoReport</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Transforme seus dados em insights valiosos com análise automatizada por IA. 
              Relatórios profissionais em minutos, não horas.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">contato@autoreport.com.br</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300">São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-lg mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Recursos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Preços</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Demonstração</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrações</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Carreiras</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Parceiros</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Imprensa</a></li>
            </ul>
          </div>
        </div>

        {/* Resources Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="text-lg mb-4">Suporte</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Status da Plataforma</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg mb-4">Casos de Uso</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Relatórios Financeiros</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Análise de Marketing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Relatórios de RH</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Business Intelligence</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg mb-4">Recursos</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">eBooks Gratuitos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Webinars</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Templates</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Calculadora ROI</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">LGPD</a>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <span className="text-gray-400">© 2025 AutoReport. Todos os direitos reservados.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}