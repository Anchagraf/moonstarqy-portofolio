// ==========================================
// 1. KONFIGURASI SUBSTACK
// ==========================================
const SUBSTACK_USERNAME = "anchagraf"; 

// ==========================================
// 2. DATA LINK KONTAK & SOSIAL MEDIA
// Tinggal ganti username/link akun kamu
// ==========================================
const socialLinks = [
  { title: "💬 WhatsApp", url: "https://wa.me/6287839476881", style: "btn-primary" },
  { title: "✉️ Email", url: "mailto:izindikbud@gmail.com", style: "btn-secondary" },
  { title: "📝 Substack", url: `https://${SUBSTACK_USERNAME}.substack.com`, style: "btn-secondary" },
  { title: "💼 LinkedIn", url: "https://linkedin.com/in/muhammadrizkyramandikha", style: "btn-secondary" },
  { title: "📷 Instagram", url: "https://instagram.com/moonstarqy", style: "btn-secondary" }
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
// ESEKUSI UTAMA
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  
  // Render Social Links
  const linksContainer = document.getElementById('social-links-container');
  if (linksContainer) {
    linksContainer.innerHTML = socialLinks.map(function(/** @type {any} */ item) {
      return `<a href="${item.url}" target="_blank" rel="noopener" class="btn ${item.style}">${item.title}</a>`;
    }).join('');
  }

  // --- LOGIKA SLIDER SUBSTACK ---
  const vibeBox = document.querySelector('.vibe-box');
  const feedUrl = `https://${SUBSTACK_USERNAME}.substack.com/feed`;
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;

  try {
    const response = await fetch(proxyUrl);
    const proxyData = await response.json();
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(proxyData.contents, "text/xml");
    const items = xmlDoc.querySelectorAll("item");

    if (items.length > 0) {
      const posts = [];
      items.forEach(function(item) {
        const title = item.querySelector("title") ? item.querySelector("title").textContent : "";
        const link = item.querySelector("link") ? item.querySelector("link").textContent : "";
        const description = item.querySelector("description") ? item.querySelector("description").textContent : "";
        
        if (title && link) {
          posts.push({
            title: title,
            excerpt: stripHtmlAndExcerpt(description),
            link: link
          });
        }
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
        <p class="slide-excerpt">"In every block of code and every cup of manual brew, there is a rhythm of patience."</p>
        <a href="https://${SUBSTACK_USERNAME}.substack.com" target="_blank" class="slide-link">Kunjungi Substack →</a>
      </div>
    `;
  }

});
