import React from 'react';
import '../styles/adBanner.css';

/**
 * AdBanner - Componente de integração para Google AdSense
 * Permite inserção de anúncios responsivos e mantém layout sofisticado
 * 
 * @param {string} slot - ID do slot do Google AdSense (opcional)
 * @param {string} format - "horizontal" | "rectangle" | "vertical" | "auto"
 * @param {string} className - Classes CSS extras
 */
export function AdBanner({ slot = "default-slot", format = "horizontal", className = "" }) {
  return (
    <aside className={`ad-banner-container ad-format-${format} ${className}`} aria-label="Espaço publicitário">
      <div className="ad-header">
        <span className="ad-badge">Publicidade</span>
        <span className="ad-brand">Google AdSense</span>
      </div>
      <div className="ad-content-slot">
        {/* Placeholder visual pronto para receber a tag do AdSense <ins className="adsbygoogle" ... /> */}
        <div className="ad-placeholder-inner">
          <span className="ad-placeholder-text">Espaço reservado para anúncio personalizado</span>
          <span className="ad-placeholder-subtext">Slot #{slot} • Formato: {format}</span>
        </div>
      </div>
    </aside>
  );
}

export default AdBanner;
