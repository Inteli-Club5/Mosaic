import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Mosaic</h4>
            <p>Conectando pessoas com a inteligência artificial do futuro</p>
          </div>
          <div className="footer-section">
            <h4>Produtos</h4>
            <ul>
              <li><a href="/agents">Buscar Agentes</a></li>
              <li><a href="/agents/create">Cadastrar Agente</a></li>
              <li><a href="/marketplace">Marketplace</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Recursos</h4>
            <ul>
              <li><a href="/documentacao">Documentação</a></li>
              <li><a href="/api">API</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Suporte</h4>
            <ul>
              <li><a href="/help">Central de Ajuda</a></li>
              <li><a href="/contact">Contato</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Mosaic. Todos os direitos reservados.</p>
          <div className="footer-links">
            <a href="/privacy">Política de Privacidade</a>
            <a href="/terms">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 