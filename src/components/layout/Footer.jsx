import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, MessageCircle, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-cb-gray-dark border-t border-cb-gold/20 mt-auto">
      <div className="container-cb py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
                <span className="text-cb-black font-poppins font-black text-xl">CB</span>
              </div>
              <h3 className="text-xl font-poppins font-bold text-gradient-gold">
                CÓDIGO BILIONÁRIO
              </h3>
            </div>
            
            <p className="text-cb-white/70 mb-4 max-w-md">
              <strong className="text-cb-gold">"Pare de enriquecer gurus!"</strong>
              <br />
              200+ cursos completos por R$ 97/mês. A vingança perfeita contra a indústria predatória de cursos online.
            </p>
            
            <div className="flex space-x-4">
              <a
                href="https://t.me/codigobilionario"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-cb-gold/10 hover:bg-cb-gold/20 rounded-lg transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-cb-gold group-hover:scale-110 transition-transform" />
              </a>
              
              <a
                href="https://instagram.com/codigobilionario"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-cb-gold/10 hover:bg-cb-gold/20 rounded-lg transition-colors group"
              >
                <Instagram className="w-5 h-5 text-cb-gold group-hover:scale-110 transition-transform" />
              </a>
              
              <a
                href="https://youtube.com/@codigobilionario"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-cb-gold/10 hover:bg-cb-gold/20 rounded-lg transition-colors group"
              >
                <Youtube className="w-5 h-5 text-cb-gold group-hover:scale-110 transition-transform" />
              </a>
              
              <a
                href="mailto:suporte@codigobilionario.com"
                className="p-2 bg-cb-gold/10 hover:bg-cb-gold/20 rounded-lg transition-colors group"
              >
                <Mail className="w-5 h-5 text-cb-gold group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-cb-white font-poppins font-semibold mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/courses" 
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Todos os Cursos
                </Link>
              </li>
              <li>
                <Link 
                  to="/subscription" 
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Planos e Preços
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Meu Perfil
                </Link>
              </li>
              <li>
                <a 
                  href="https://t.me/codigobilionario" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Comunidade VIP
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-cb-white font-poppins font-semibold mb-4">
              Suporte
            </h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:suporte@codigobilionario.com"
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Contato
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="text-cb-white/70 hover:text-cb-gold transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-cb-gold/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-cb-white/60 text-sm">
              <span>© {currentYear} Código Bilionário. Todos os direitos reservados.</span>
            </div>
            
            <div className="flex items-center space-x-2 text-cb-white/60 text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-cb-gold animate-pulse" />
              <span>para revolucionar a educação digital</span>
            </div>
          </div>
          
          {/* Anti-Guru Message */}
          <div className="mt-4 text-center">
            <p className="text-cb-gold/80 text-sm italic font-medium">
              "A vingança é um prato que se serve... LUCRATIVO!" 💰
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer