// Gallery section HTML generator
import type { SanitizedData } from '../types';

export function generateGallery(data: SanitizedData): string {
  if (!data.galleryImages || data.galleryImages.length === 0) {
    return '';
  }

  const imagesHtml = data.galleryImages.map((image, index) => `
    <div class="gallery-item" style="
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      aspect-ratio: 1;
      background: rgba(255,255,255,0.05);
    ">
      <img 
        src="${image.url}" 
        alt="${image.caption || `Gallery image ${index + 1}`}"
        loading="lazy"
        style="
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        "
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
      />
      ${image.caption ? `
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          color: white;
          font-size: 14px;
        ">${image.caption}</div>
      ` : ''}
    </div>
  `).join('');

  return `
    <section id="gallery" style="
      padding: 80px 20px;
      background: rgba(0,0,0,0.2);
    ">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 48px;
          background: linear-gradient(to right, var(--primary, #a855f7), var(--accent, #ec4899));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        ">Gallery</h2>
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        ">
          ${imagesHtml}
        </div>
      </div>
    </section>
  `;
}
