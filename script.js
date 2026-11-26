(() => {
  'use strict';

  const translations = {
    tr: {
      pageTitle: 'Teachers Kingdom — Öğren. Öğret. Üret.',
      pageDesc:
        'Teachers Kingdom — İngilizce ve Almanca odaklı, CEFR uyumlu (A1–A2), oyunlaştırılmış ve yapay zeka destekli yeni nesil dijital dil eğitim platformu.',
      skipToContent: 'İçeriğe geç',
      'nav.modules': 'Modüller',
      'nav.features': 'Özellikler',
      'nav.about': 'Hakkında',
      'nav.contact': 'İletişim',
      'hero.motto': 'Öğren. Öğret. Üret.',
      'hero.titleStart': 'Dil Öğrenmenin Yeni Nesil',
      'hero.titleHighlight': 'Dijital Krallığı',
      'hero.subtitle':
        'İngilizce ve Almanca odaklı, CEFR uyumlu (A1–A2), oyunlaştırılmış ve yapay zeka destekli eğitim platformu.',
      'hero.slogan': 'You can do it',
      'hero.ctaExplore': 'Keşfet',
      'hero.ctaContact': 'İletişime Geç',
      'hero.metric1': 'Yapılandırılmış Seviye',
      'hero.metric2': 'Çift Dil Odaklı',
      'hero.metric3': 'Yıllık Eğitim Deneyimi',
      'hero.metric4': 'Oyunlaştırılmış Pratik',
      'modules.eyebrow': 'Eğitim Ekosistemi',
      'modules.title': 'Eğitim Modülleri',
      'modules.subtitle':
        'Hedef odaklı derslerden etkileşimli stüdyo ve oyunlara kadar her adımda akıcı ilerleme.',
      'modules.german.title': 'Almanca A1 & A2 Modülleri',
      'modules.german.desc':
        'CEFR uyumlu, adım adım yapılandırılmış dersler. Temel dilbilgisinden günlük iletişime kadar sistematik ilerleme sunar.',
      'modules.german.meta': 'Adım Adım Müfredat',
      'modules.english.tag': '8–18 & Yetişkin',
      'modules.english.title': 'İngilizce Eğitimi',
      'modules.english.desc':
        '8–18 yaş ve yetişkinler için modern dil eğitimi. Konuşma özgüvenini artıran güncel, gerçek hayat odaklı içerikler.',
      'modules.english.meta': 'Her Yaşa Uygun Yaklaşım',
      'modules.karaoke.title': 'Karaoke Studio & AI Şarkılar',
      'modules.karaoke.desc':
        'Yapay zeka destekli özel dil öğrenme şarkılarıyla ritmik pratik. Telaffuz ve kelime hafızasını müzikle pekiştirin.',
      'modules.games.tag': 'Oyunlaştırma',
      'modules.games.title': 'Charades & Oyunlar',
      'modules.games.desc':
        'Etkileşimli kelime ve konuşma oyunları. Sınıf içi ve bireysel pratikte öğrenmeyi eğlenceli bir alışkanlığa dönüştürür.',
      'modules.exam.tag': 'Değerlendirme',
      'modules.exam.title': 'Exam Bank',
      'modules.exam.desc':
        'Seviye tespit ve pratik sınav havuzu. Anlık değerlendirme ve hedefe yönelik tekrarlarla sınavlara güvenle hazırlanın.',
      'features.eyebrow': 'Neden Teachers Kingdom?',
      'features.title': 'Öne Çıkan Özellikler',
      'features.subtitle':
        'Sade tasarım, güçlü pedagoji ve yapay zeka teknolojisinin birleşimi.',
      'features.item1.title': 'CEFR Standartları',
      'features.item1.desc':
        'Avrupa Ortak Dil Çerçevesi (A1–A2) ile uyumlu, ölçülebilir hedefler ve net kazanımlar.',
      'features.item2.title': 'Yapay Zeka Destekli İçerik',
      'features.item2.desc':
        'Özel AI şarkılar ve etkileşimli alıştırmalarla dinleme, telaffuz ve üretim becerilerinde hız kazanın.',
      'features.item3.title': 'Oyunlaştırılmış Akış',
      'features.item3.desc':
        'Sıkıcı ezber yöntemleri yerine aktif katılımı ve merakı canlı tutan modern oyun mekanikleri.',
      'features.item4.title': 'Her Cihazda Hızlı Erişim',
      'features.item4.desc':
        'Mobil, tablet ve masaüstünde kesintisiz, dikkat dağıtmayan minimalist öğrenme deneyimi.',
      'about.eyebrow': 'Hakkında',
      'about.title': 'Kamil Teacher Vizyonu',
      'about.lead':
        '18+ yıllık dil eğitimi deneyimiyle kurulan Teachers Kingdom, geleneksel kalıpları yıkarak teknolojiyle dil öğrenmeyi kalıcı ve keyifli hale getirir.',
      'about.body':
        'Her öğrencinin kendi hızında ve yüksek motivasyonla ilerleyebileceği bir dijital ekosistem inşa ediyoruz. Pedagojik disiplin ile yapay zeka, müzik ve oyunlaştırmayı bir araya getirerek İngilizce ve Almanca yolculuğunu ilham verici bir deneyime dönüştürüyoruz.',
      'about.role': 'Kurucu & Dil Eğitimcisi',
      'about.stat1': 'Yıllık Eğitim Tecrübesi',
      'about.stat2': 'İngilizce & Almanca',
      'about.stat3': 'Gençler ve Yetişkinler',
      'about.stat4': 'CEFR Uyumlu Modüller',
      'contact.eyebrow': 'İletişim',
      'contact.title': 'Yolculuğa Birlikte Başlayalım',
      'contact.subtitle':
        'Eğitim modülleri, bireysel programlar veya iş birlikleri için doğrudan ulaşabilirsiniz.',
      'contact.email': 'E-posta',
      'footer.copy':
        '© 2026 Teachers Kingdom — Öğren. Öğret. Üret. | You can do it',
    },
    en: {
      pageTitle: 'Teachers Kingdom — Learn. Teach. Create.',
      pageDesc:
        'Teachers Kingdom — Next-generation English and German digital language learning platform aligned with CEFR (A1–A2), powered by gamification and AI.',
      skipToContent: 'Skip to content',
      'nav.modules': 'Modules',
      'nav.features': 'Features',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'hero.motto': 'Learn. Teach. Create.',
      'hero.titleStart': 'The Next-Generation',
      'hero.titleHighlight': 'Digital Kingdom of Language Learning',
      'hero.subtitle':
        'An English and German focused, CEFR-aligned (A1–A2), gamified and AI-powered modern education platform.',
      'hero.slogan': 'You can do it',
      'hero.ctaExplore': 'Explore',
      'hero.ctaContact': 'Get in Touch',
      'hero.metric1': 'Structured Levels',
      'hero.metric2': 'Dual-Language Focus',
      'hero.metric3': 'Years of Teaching',
      'hero.metric4': 'Gamified Practice',
      'modules.eyebrow': 'Learning Ecosystem',
      'modules.title': 'Education Modules',
      'modules.subtitle':
        'Seamless progress at every step, from structured lessons to interactive studios and games.',
      'modules.german.title': 'German A1 & A2 Modules',
      'modules.german.desc':
        'CEFR-aligned, step-by-step structured lessons designed for steady progress from core grammar to everyday communication.',
      'modules.german.meta': 'Step-by-Step Curriculum',
      'modules.english.tag': 'Ages 8–18 & Adults',
      'modules.english.title': 'English Education',
      'modules.english.desc':
        'Modern language training for ages 8–18 and adults, built around real-world communication and speaking confidence.',
      'modules.english.meta': 'Tailored for Every Age',
      'modules.karaoke.title': 'Karaoke Studio & AI Songs',
      'modules.karaoke.desc':
        'Rhythmic language practice with custom AI-generated learning songs that strengthen pronunciation and vocabulary retention.',
      'modules.games.tag': 'Gamification',
      'modules.games.title': 'Charades & Games',
      'modules.games.desc':
        'Interactive vocabulary and speaking games that turn classroom and solo practice into an engaging daily habit.',
      'modules.exam.tag': 'Assessment',
      'modules.exam.title': 'Exam Bank',
      'modules.exam.desc':
        'Placement and practice exam pool with targeted review so learners prepare for assessments with clarity and confidence.',
      'features.eyebrow': 'Why Teachers Kingdom?',
      'features.title': 'Key Features',
      'features.subtitle':
        'Where minimalist design meets proven pedagogy and modern AI tools.',
      'features.item1.title': 'CEFR Standards',
      'features.item1.desc':
        'Aligned with the Common European Framework (A1–A2) for measurable milestones and clear outcomes.',
      'features.item2.title': 'AI-Powered Content',
      'features.item2.desc':
        'Accelerate listening, pronunciation, and speaking fluency with custom AI songs and interactive drills.',
      'features.item3.title': 'Gamified Flow',
      'features.item3.desc':
        'Replace rote memorization with active participation and playful mechanics that sustain curiosity.',
      'features.item4.title': 'Fast on Every Device',
      'features.item4.desc':
        'A clean, distraction-free learning experience optimized for mobile, tablet, and desktop.',
      'about.eyebrow': 'About',
      'about.title': 'The Kamil Teacher Vision',
      'about.lead':
        'Founded on 18+ years of language teaching experience, Teachers Kingdom breaks traditional molds and makes learning enjoyable through technology.',
      'about.body':
        'We build a digital ecosystem where every learner advances at their own pace with high motivation. By combining pedagogical craft with AI, music, and gamification, we transform English and German learning into an inspiring journey.',
      'about.role': 'Founder & Language Educator',
      'about.stat1': 'Years of Experience',
      'about.stat2': 'English & German',
      'about.stat3': 'Youth & Adult Learners',
      'about.stat4': 'CEFR-Aligned Modules',
      'contact.eyebrow': 'Contact',
      'contact.title': 'Start the Journey Together',
      'contact.subtitle':
        'Reach out directly for learning modules, tailored programs, or educational collaborations.',
      'contact.email': 'Email',
      'footer.copy':
        '© 2026 Teachers Kingdom — Learn. Teach. Create. | You can do it',
    },
  };

  const navbar = document.getElementById('navbar');
  const langToggle = document.getElementById('lang-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  let currentLang = 'tr';
  try {
    const savedLang = localStorage.getItem('tk-lang');
    if (savedLang === 'en' || savedLang === 'tr') {
      currentLang = savedLang;
    }
  } catch {
    // Ignore storage access errors in restricted browsing modes
  }

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.tr;
    currentLang = lang;
    document.documentElement.lang = lang;
    document.title = dict.pageTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', dict.pageDesc);
    }

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (langToggle) {
      langToggle.querySelectorAll('.lang-option').forEach((opt) => {
        opt.classList.toggle('is-active', opt.getAttribute('data-lang') === lang);
      });
      langToggle.setAttribute(
        'aria-label',
        lang === 'tr' ? 'İngilizceye geç' : 'Switch to Turkish'
      );
    }

    try {
      localStorage.setItem('tk-lang', lang);
    } catch {
      // Ignore storage access errors
    }
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(currentLang === 'tr' ? 'en' : 'tr');
    });
  }

  // Mobile Menu Controls
  function setMobileMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute(
      'aria-label',
      open
        ? currentLang === 'tr'
          ? 'Menüyü kapat'
          : 'Close menu'
        : currentLang === 'tr'
          ? 'Menüyü aç'
          : 'Open menu'
    );
    mobileMenu.hidden = !open;
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMobileMenu(!isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMobileMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMobileMenu(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) {
        setMobileMenu(false);
      }
    });
  }

  // Sticky Navbar Elevation
  function handleScroll() {
    if (!navbar) return;
    navbar.classList.toggle('is-scrolled', window.scrollY > 16);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active Section Highlighting
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('is-active', matches);
          });
        });
      },
      { rootMargin: '-40% 0px -52% 0px', threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  // Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  applyLanguage(currentLang);
})();
