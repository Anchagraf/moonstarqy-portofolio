// ==========================================
// 1. KONFIGURASI SUBSTACK
// Publikasi: anchagraf.substack.com
// ==========================================
const SUBSTACK_USERNAME = "anchagraf"; 

// ==========================================
// 2. DATA LINK KONTAK & SOSIAL MEDIA
// ==========================================
const socialLinks = [
  { title: "💬 WhatsApp", url: "https://wa.me/6287839476881", style: "btn-primary" },
  { title: "✉️ Email", url: "mailto:izindikbud@gmail.com", style: "btn-secondary" },
  { title: "📝 Substack", url: `https://${SUBSTACK_USERNAME}.substack.com`, style: "btn-secondary" },
  { title: "💼 LinkedIn", url: "https://linkedin.com/in/username-kamu", style: "btn-secondary" },
  { title: "📷 Instagram", url: "https://instagram.com/username-kamu", style: "btn-secondary" }
];

// ==========================================
// FUNGSI PEMBERSIH TEKS HTML DARI RSS SUBSTACK
// ==========================================
/** @param {string} htmlString */
function stripHtmlAndExcerpt(htmlString) {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = htmlString;
  let text = tmp.textContent || tmp.innerText || "";
  text = text.trim();
  return text.length > 130 ? text.substring(0, 130) + "..." : text;
}

// ==========================================
// ESEKUSI UTAMA & SLIDER RSS SUBSTACK
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  
  // Render Social Links
  const linksContainer = document.getElementById('social-links-container');
  if (linksContainer) {
    linksContainer.innerHTML = socialLinks.map(function(/** @type {any} */ item) {
      return `<a href="${item.url}" target="_blank" rel="noopener" class="btn ${item.style}">${item.title}</a>`;
    }).join('');
  }

  // --- LOGIKA SLIDER SUBSTACK MENGGUNAKAN RSS2JSON ---
  const vibeBox = document.querySelector('.vibe-box');
  const targetFeed = `https://${SUBSTACK_USERNAME}.substack.com/feed`;
  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetFeed)}`;

  try {
    const response = await fetch(rssUrl);
    const data = await response.json();

    if (data.status === 'ok' && data.items && data.items.length > 0) {
      const posts = data.items.map(function(/** @type {any} */ item) {
        return {
          title: item.title,
          excerpt: stripHtmlAndExcerpt(item.content || item.description || ""),
          link: item.link
        };
      });

      let currentIndex = 0;

      /** @param {number} index */
      const renderSlide = (index) => {
        const post = posts[index];

        vibeBox.innerHTML = `
          <div class="substack-slide fade-in">
            <span class="slide-badge">FROM MY SUBSTACK</span>
            <h4 class="slide-title">${post.title}</h4>
            <p class="slide-excerpt">"${post.excerpt}"</p>
            <a href="${post.link}" target="_blank" rel="noopener" class="slide-link">Baca Tulisan Selengkapnya →</a>
          </div>
        `;
      };

      renderSlide(currentIndex);

      // Jika artikel di Substack lebih dari 1, otomatis geser tiap 3 detik
      if (posts.length > 1) {
        setInterval(() => {
          currentIndex = (currentIndex + 1) % posts.length;
          renderSlide(currentIndex);
        }, 3000);
      }
    } else {
      vibeBox.innerHTML = `
        <div class="substack-slide">
          <span class="slide-badge">SUBSTACK</span>
          <p class="slide-excerpt">Belum ada artikel dipublikasikan di Substack.</p>
          <a href="https://${SUBSTACK_USERNAME}.substack.com" target="_blank" class="slide-link">Kunjungi Substack →</a>
        </div>
      `;
    }
  } catch (e) {
    vibeBox.innerHTML = `
      <div class="substack-slide">
        <span class="slide-badge">SUBSTACK</span>
        <p class="slide-excerpt">Gagal menyambungkan ke feed Substack.</p>
        <a href="https://${SUBSTACK_USERNAME}.substack.com" target="_blank" class="slide-link">Kunjungi Substack →</a>
      </div>
    `;
  }

});
