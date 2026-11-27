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
      'german.backToModules': 'Modüllere Dön',
      'german.returnMain': 'Ana Sayfa Akışına Dön',
      'german.eyebrow': 'Etkileşimli Modül Stüdyosu',
      'german.title': 'Almanca A1 & A2 Modülleri',
      'german.subtitle':
        'Seviyeni ve becerini seç, telaffuzları dinle, mini alıştırmaları çöz ve XP kazanarak ilerlemeni kaydet.',
      'german.totalXp': 'Toplam XP',
      'german.savedLocal': 'Tarayıcıda kayıtlı',
      'german.levelA1': 'Başlangıç',
      'german.levelA2': 'Temel',
      'german.skill.vocab': 'Kelime (Wortschatz)',
      'german.skill.reading': 'Okuma & Dinleme (Lesen & Hören)',
      'german.skill.grammar': 'Yazma & Dil Bilgisi (Grammatik & Schreiben)',
      'german.skill.speaking': 'Konuşma & Pratik (Sprechen)',
      'german.skill.exam': 'Mini Sınav / XP',
      'german.resetProgress': 'İlerlemeyi Sıfırla',
      'german.resetConfirm': 'Emin misiniz? Tekrar tıklayın',
      'german.phrasesTitle': 'Örnek Almanca İfadeler',
      'german.phrasesSub': 'Doğru telaffuz için Dinle butonunu kullanın (de-DE).',
      'german.exercisesTitle': 'Etkileşimli Mini Alıştırmalar',
      'german.exercisesSub': 'Her doğru yanıt tek seferlik XP kazandırır.',
      'german.examOverviewTitle': 'Seviye İlerlemesi & XP Özeti',
      'german.examOverviewSub': 'A1 ve A2 ilerlemeniz tarayıcınızda otomatik saklanır.',
      'german.examQuestionsTitle': 'Mini Sınav Soruları',
      'german.examQuestionsSub': 'Her doğru sınav sorusu +20 XP değerindedir.',
      'german.listen': 'Dinle',
      'german.speakingNow': 'Okunuyor...',
      'german.typeChoice': 'Çoktan Seçmeli',
      'german.typeFill': 'Boşluk Doldurma',
      'german.checkAnswer': 'Kontrol Et',
      'german.inputPlaceholder': 'Almanca cevabı yazın...',
      'german.umlautHelper': 'Özel harfler:',
      'german.completedBadge': 'Tamamlandı',
      'german.progressLabel': 'alıştırma tamamlandı',
      'german.correctNewXp': 'Harika! Doğru yanıt — +{xp} XP hesabına eklendi.',
      'german.correctAlready': 'Doğru! Bu alıştırmanın XP puanı daha önce eklendi.',
      'german.wrongHint': 'Henüz değil — You can do it! İpucu:',
      'german.emptyInput': 'Lütfen kontrol etmeden önce bir yanıt yazın.',
      'german.speechUnsupported':
        'Tarayıcınız sesli okumayı (speechSynthesis) desteklemiyor. Almanca ifadeleri yazılı ipuçlarıyla pratik edebilirsiniz.',
      'german.speechNoVoice':
        'Cihazınızda yüklü Almanca (de-DE) ses paketi bulunamadı; tarayıcı varsayılan seslendirme ile devam ediyor.',
      'german.speechError':
        'Sesli okuma şu anda başlatılamadı. Lütfen tekrar deneyin veya tarayıcı ses ayarlarınızı kontrol edin.',
      'german.rank1': 'Yeni Kaşif',
      'german.rank2': 'Dil Yolcusu',
      'german.rank3': 'Krallık Elçisi',
      'german.rank4': 'Almanca Ustası',
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
      'german.backToModules': 'Back to Modules',
      'german.returnMain': 'Return to Main Page',
      'german.eyebrow': 'Interactive Module Studio',
      'german.title': 'German A1 & A2 Modules',
      'german.subtitle':
        'Choose your level and skill, listen to German pronunciation, solve interactive exercises, and save your XP progress.',
      'german.totalXp': 'Total XP',
      'german.savedLocal': 'Saved in browser',
      'german.levelA1': 'Beginner',
      'german.levelA2': 'Elementary',
      'german.skill.vocab': 'Vocabulary (Wortschatz)',
      'german.skill.reading': 'Reading & Listening (Lesen & Hören)',
      'german.skill.grammar': 'Writing & Grammar (Grammatik & Schreiben)',
      'german.skill.speaking': 'Speaking & Practice (Sprechen)',
      'german.skill.exam': 'Mini Exam / XP',
      'german.resetProgress': 'Reset Progress',
      'german.resetConfirm': 'Are you sure? Click again',
      'german.phrasesTitle': 'Sample German Expressions',
      'german.phrasesSub': 'Use the Listen button for German pronunciation (de-DE).',
      'german.exercisesTitle': 'Interactive Mini Exercises',
      'german.exercisesSub': 'Each correct answer awards one-time XP.',
      'german.examOverviewTitle': 'Level Progress & XP Overview',
      'german.examOverviewSub': 'Your A1 and A2 progress is saved locally in your browser.',
      'german.examQuestionsTitle': 'Mini Exam Questions',
      'german.examQuestionsSub': 'Each correct exam question awards +20 XP.',
      'german.listen': 'Listen',
      'german.speakingNow': 'Speaking...',
      'german.typeChoice': 'Multiple Choice',
      'german.typeFill': 'Fill in the Blank',
      'german.checkAnswer': 'Check',
      'german.inputPlaceholder': 'Type the German answer...',
      'german.umlautHelper': 'Special letters:',
      'german.completedBadge': 'Completed',
      'german.progressLabel': 'exercises completed',
      'german.correctNewXp': 'Great job! Correct answer — +{xp} XP awarded.',
      'german.correctAlready': 'Correct! XP for this exercise was already awarded.',
      'german.wrongHint': 'Not quite yet — You can do it! Hint:',
      'german.emptyInput': 'Please type an answer before checking.',
      'german.speechUnsupported':
        'Your browser does not support speech synthesis. You can still practice with the written tips and exercises.',
      'german.speechNoVoice':
        'No German (de-DE) voice pack was detected on this device; attempting playback with the default browser voice.',
      'german.speechError':
        'Audio playback could not start right now. Please try again or check your browser audio settings.',
      'german.rank1': 'New Explorer',
      'german.rank2': 'Language Traveler',
      'german.rank3': 'Kingdom Envoy',
      'german.rank4': 'German Master',
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

  /* ==========================================================================
     German A1 & A2 Curriculum Data
     ========================================================================== */
  const germanCurriculum = {
    A1: {
      vocab: {
        phrases: [
          {
            de: 'Guten Morgen! Wie geht es dir?',
            tr: 'Günaydın! Nasılsın?',
            en: 'Good morning! How are you?',
            tipTr: 'Samimi selamlaşma; resmi kullanımda "Wie geht es Ihnen?" denir.',
            tipEn: 'Informal greeting; formally say "Wie geht es Ihnen?".',
          },
          {
            de: 'Ich heiße Kamil und komme aus der Türkei.',
            tr: 'Adım Kamil ve Türkiye’den geliyorum.',
            en: 'My name is Kamil and I come from Turkey.',
            tipTr: '"heißen" fiili "ich" ile "heiße" şeklinde çekimlenir.',
            tipEn: 'The verb "heißen" conjugates as "heiße" with "ich".',
          },
          {
            de: 'Entschuldigung, können Sie das bitte wiederholen?',
            tr: 'Affedersiniz, bunu lütfen tekrar edebilir misiniz?',
            en: 'Excuse me, could you please repeat that?',
            tipTr: 'Sınıf içi ve günlük konuşmada çok işe yarayan nazik ifade.',
            tipEn: 'A polite phrase ideal for classroom and daily conversations.',
          },
          {
            de: 'Ich trinke morgens gern Kaffee mit Milch.',
            tr: 'Sabahları sütlü kahve içmeyi severim.',
            en: 'I like drinking coffee with milk in the morning.',
            tipTr: '"gern" kelimesi bir eylemi severek yaptığınızı belirtir.',
            tipEn: '"gern" expresses enjoying an activity.',
          },
        ],
        exercises: [
          {
            id: 'a1-vocab-1',
            type: 'choice',
            xp: 10,
            promptTr: '“Teşekkür ederim, çok naziksiniz” anlamını veren en uygun başlangıç ifadesi hangisidir?',
            promptEn: 'Which phrase best starts "Thank you very much"?',
            options: ['Vielen Dank!', 'Gute Nacht!', 'Bis morgen!', 'Kein Problem!'],
            answer: 'Vielen Dank!',
            hintTr: 'Teşekkür için "Danke" veya "Vielen Dank" kullanılır.',
            hintEn: 'Use "Danke" or "Vielen Dank" to say thank you.',
          },
          {
            id: 'a1-vocab-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Boşluğu tamamlayın: "Ich ___ aus der Türkei." (geliyorum)',
            promptEn: 'Fill in the blank: "Ich ___ aus der Türkei." (come)',
            answers: ['komme'],
            hintTr: '"kommen" fiilinin "ich" öznesine göre çekimi "-e" ile biter.',
            hintEn: 'Conjugate "kommen" for "ich" (ends in -e).',
          },
        ],
      },
      reading: {
        phrases: [
          {
            de: 'Am Montag habe ich um neun Uhr Deutschkurs.',
            tr: 'Pazartesi günü saat dokuzda Almanca kursum var.',
            en: 'On Monday I have German class at nine o’clock.',
            tipTr: 'Günler için "am", saatler için "um" edatı kullanılır.',
            tipEn: 'Use "am" for days and "um" for clock times.',
          },
          {
            de: 'Ich möchte bitte ein Wasser und ein Brötchen.',
            tr: 'Lütfen bir su ve bir sandviç ekmeği istiyorum.',
            en: 'I would like a water and a bread roll, please.',
            tipTr: 'Kafede ve fırında kibar sipariş kalıbı: "Ich möchte bitte..."',
            tipEn: 'Polite ordering pattern at cafés and bakeries.',
          },
          {
            de: 'Der Bahnhof ist links neben dem Supermarkt.',
            tr: 'Tren istasyonu süpermarketin sol yanında.',
            en: 'The train station is to the left next to the supermarket.',
            tipTr: '"links" (solda), "rechts" (sağda), "neben" (yanında).',
            tipEn: '"links" (left), "rechts" (right), "neben" (next to).',
          },
          {
            de: 'Am Wochenende besuche ich meine Familie.',
            tr: 'Hafta sonu ailemi ziyaret ediyorum.',
            en: 'On the weekend I visit my family.',
            tipTr: 'Zaman ifadesi başta olunca fiil yine 2. sıradadır (besuche).',
            tipEn: 'When time comes first, the conjugated verb stays in position 2.',
          },
        ],
        exercises: [
          {
            id: 'a1-reading-1',
            type: 'choice',
            xp: 10,
            promptTr: 'Metne göre: "Am Montag habe ich um neun Uhr Deutschkurs." — Almanca kursu saat kaçta?',
            promptEn: 'According to "Am Montag habe ich um neun Uhr Deutschkurs.", what time is German class?',
            options: ['08:00', '09:00', '10:00', '19:00'],
            answer: '09:00',
            hintTr: '"neun Uhr" Almancada saat 9 anlamına gelir.',
            hintEn: '"neun Uhr" means nine o’clock.',
          },
          {
            id: 'a1-reading-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Boşluğu saat edatı ile doldurun: "Der Kurs beginnt ___ zehn Uhr."',
            promptEn: 'Fill in the time preposition: "Der Kurs beginnt ___ zehn Uhr."',
            answers: ['um'],
            hintTr: 'Tam saatlerden önce iki harfli "um" edatı gelir.',
            hintEn: 'Clock times take the two-letter preposition "um".',
          },
        ],
      },
      grammar: {
        phrases: [
          {
            de: 'Ich wohne in Antalya und lerne Deutsch.',
            tr: 'Antalya’da yaşıyorum ve Almanca öğreniyorum.',
            en: 'I live in Antalya and learn German.',
            tipTr: 'Düzenli fiillerde "ich" çekimi köke "-e" eklenerek yapılır.',
            tipEn: 'Regular verbs take "-e" for the first-person singular "ich".',
          },
          {
            de: 'Das ist mein Buch, und das ist eine Tasche.',
            tr: 'Bu benim kitabım, şu da bir çanta.',
            en: 'This is my book, and that is a bag.',
            tipTr: '"das Buch" (nötr → mein), "die Tasche" (dişil → eine).',
            tipEn: '"das Buch" (neuter → mein), "die Tasche" (feminine → eine).',
          },
          {
            de: 'Hast du heute Nachmittag Zeit?',
            tr: 'Bugün öğleden sonra vaktin var mı?',
            en: 'Do you have time this afternoon?',
            tipTr: 'Evet/Hayır sorularında çekimli fiil 1. sıraya gelir.',
            tipEn: 'In Yes/No questions, the conjugated verb moves to position 1.',
          },
          {
            de: 'Wir fahren am Samstag mit dem Zug nach Berlin.',
            tr: 'Cumartesi günü trenle Berlin’e gidiyoruz.',
            en: 'We are going to Berlin by train on Saturday.',
            tipTr: '"mit" edatı daima Dativ ister: der Zug → mit dem Zug.',
            tipEn: '"mit" always takes the dative case: der Zug → mit dem Zug.',
          },
        ],
        exercises: [
          {
            id: 'a1-grammar-1',
            type: 'choice',
            xp: 10,
            promptTr: 'Doğru artikel hangisidir? "Ich brauche ___ Stift." (der Stift, Akkusativ)',
            promptEn: 'Choose the right article: "Ich brauche ___ Stift." (der Stift, accusative)',
            options: ['ein', 'eine', 'einen', 'einem'],
            answer: 'einen',
            hintTr: 'Eril (der) isimler Akkusativ durumda "einen" alır.',
            hintEn: 'Masculine (der) nouns take "einen" in the accusative case.',
          },
          {
            id: 'a1-grammar-2',
            type: 'fill',
            xp: 10,
            promptTr: '"haben" fiilini "du" öznesine göre çekimleyin: "___ du ein Wörterbuch?"',
            promptEn: 'Conjugate "haben" for "du": "___ du ein Wörterbuch?"',
            answers: ['hast'],
            hintTr: '"du" ile "haben" düzensizdir: "b" düşer → "hast".',
            hintEn: 'With "du", "haben" drops the "b" → "hast".',
          },
        ],
      },
      speaking: {
        phrases: [
          {
            de: 'Wie spät ist es jetzt? — Es ist halb vier.',
            tr: 'Şu an saat kaç? — Saat üç buçuk.',
            en: 'What time is it now? — It is half past three.',
            tipTr: 'Dikkat: "halb vier" dörde yarım saat var yani 03:30 demektir!',
            tipEn: 'Watch out: "halb vier" means halfway to four (3:30)!',
          },
          {
            de: 'Was machst du in deiner Freizeit? — Ich höre gern Musik.',
            tr: 'Boş zamanında ne yaparsın? — Müzik dinlemeyi severim.',
            en: 'What do you do in your free time? — I like listening to music.',
            tipTr: 'A1 sözlü sınavında (Sprechen) en sık sorulan tanışma sorusu.',
            tipEn: 'A classic A1 speaking exam question about hobbies.',
          },
          {
            de: 'Woher kommst du? — Ich komme aus Antalya.',
            tr: 'Nerelisin? — Antalya’dan geliyorum.',
            en: 'Where are you from? — I come from Antalya.',
            tipTr: '"Woher" (nereden) sorusuna "aus + şehir/ülke" ile yanıt verilir.',
            tipEn: 'Answer "Woher" (where from) using "aus + city/country".',
          },
          {
            de: 'Können wir bitte zusammen üben? — Ja, sehr gern!',
            tr: 'Birlikte pratik yapabilir miyiz? — Evet, memnuniyetle!',
            en: 'Can we practice together, please? — Yes, gladly!',
            tipTr: '"sehr gern" nazik ve enerjik bir onay ifadesidir.',
            tipEn: '"sehr gern" is a warm, enthusiastic way to say yes.',
          },
        ],
        exercises: [
          {
            id: 'a1-speaking-1',
            type: 'choice',
            xp: 10,
            promptTr: 'Birisi size "Wie heißt du?" diye sorarsa en doğal cevap hangisidir?',
            promptEn: 'If someone asks "Wie heißt du?", what is the most natural reply?',
            options: [
              'Ich heiße Deniz.',
              'Ich bin zwanzig Uhr.',
              'Ich wohne Danke.',
              'Es ist halb drei.',
            ],
            answer: 'Ich heiße Deniz.',
            hintTr: 'İsim sorusuna "Ich heiße..." veya "Ich bin..." ile cevap verilir.',
            hintEn: 'Answer a name question with "Ich heiße..." or "Ich bin...".',
          },
          {
            id: 'a1-speaking-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Boşluğu tamamlayın: "Ja, sehr ___!" (memnuniyetle)',
            promptEn: 'Complete the reply: "Ja, sehr ___!" (gladly)',
            answers: ['gern', 'gerne'],
            hintTr: 'Almancada "seve seve / memnuniyetle" anlamındaki 4 harfli kelime: g _ _ n.',
            hintEn: 'A 4-letter German word meaning "gladly": g _ _ n.',
          },
        ],
      },
      exam: {
        exercises: [
          {
            id: 'a1-exam-1',
            type: 'choice',
            xp: 20,
            promptTr: 'A1 Sınav Sorusu 1: "Wir ___ Schüler in der Teachers Kingdom." ("sein" fiili)',
            promptEn: 'A1 Exam Q1: "Wir ___ Schüler in der Teachers Kingdom." (verb "sein")',
            options: ['bin', 'bist', 'sind', 'seid'],
            answer: 'sind',
            hintTr: '"wir" öznesiyle "sein" fiili "sind" olur.',
            hintEn: 'With "wir", the verb "sein" is conjugated as "sind".',
          },
          {
            id: 'a1-exam-2',
            type: 'fill',
            xp: 20,
            promptTr: 'A1 Sınav Sorusu 2: "Ich möchte bitte ___ Kaffee." (der Kaffee, Akkusativ)',
            promptEn: 'A1 Exam Q2: "Ich möchte bitte ___ Kaffee." (der Kaffee, accusative)',
            answers: ['einen'],
            hintTr: '"der Kaffee" eril bir isimdir ve Akkusativ halde "einen" alır.',
            hintEn: '"der Kaffee" is masculine and takes "einen" in the accusative.',
          },
          {
            id: 'a1-exam-3',
            type: 'choice',
            xp: 20,
            promptTr: 'A1 Sınav Sorusu 3: "Es ist halb vier." saat kaçtır?',
            promptEn: 'A1 Exam Q3: What time is "Es ist halb vier."?',
            options: ['04:30', '03:30', '04:15', '03:45'],
            answer: '03:30',
            hintTr: 'Almancada "halb + saat" bir önceki saatin buçuğunu gösterir.',
            hintEn: 'In German, "halb + hour" means 30 minutes before that hour.',
          },
        ],
      },
    },
    A2: {
      vocab: {
        phrases: [
          {
            de: 'Ich muss morgen früh einen wichtigen Termin vereinbaren.',
            tr: 'Yarın sabah erken önemli bir randevu ayarlamalıyım.',
            en: 'I have to schedule an important appointment early tomorrow.',
            tipTr: '"einen Termin vereinbaren" (randevu ayarlamak) temel A2 kalıbıdır.',
            tipEn: '"einen Termin vereinbaren" (to make an appointment) is a key A2 collocation.',
          },
          {
            de: 'Die Reise nach München war wirklich unvergesslich.',
            tr: 'Münih gezisi gerçekten unutulmazdı.',
            en: 'The trip to Munich was truly unforgettable.',
            tipTr: '"war", "sein" fiilinin geçmiş (Präteritum) halidir.',
            tipEn: '"war" is the simple past (Präteritum) of "sein".',
          },
          {
            de: 'Kannst du mir eine gute App zum Lernen empfehlen?',
            tr: 'Bana öğrenmek için iyi bir uygulama önerebilir misin?',
            en: 'Can you recommend a good app for learning to me?',
            tipTr: '"empfehlen" fiili kime sorusu için Dativ (mir) alır.',
            tipEn: '"empfehlen" takes a dative recipient ("mir").',
          },
          {
            de: 'Gesunde Ernährung und Sport geben mir neue Energie.',
            tr: 'Sağlıklı beslenme ve spor bana yeni enerji veriyor.',
            en: 'Healthy nutrition and sports give me new energy.',
            tipTr: '"die Ernährung" (beslenme) A2 sağlık ünitesinin kilit kelimesidir.',
            tipEn: '"die Ernährung" (nutrition) is key vocabulary in A2 health topics.',
          },
        ],
        exercises: [
          {
            id: 'a2-vocab-1',
            type: 'choice',
            xp: 10,
            promptTr: '“Randevu ayarlamak” anlamındaki doğru Almanca kalıp hangisidir?',
            promptEn: 'Which German collocation means "to make an appointment"?',
            options: [
              'einen Termin vereinbaren',
              'einen Kaffee vergessen',
              'eine Reise schließen',
              'ein Buch kochen',
            ],
            answer: 'einen Termin vereinbaren',
            hintTr: 'Randevu = der Termin; kararlaştırmak/ayarlamak = vereinbaren.',
            hintEn: 'Appointment = der Termin; arrange/agree = vereinbaren.',
          },
          {
            id: 'a2-vocab-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Boşluğu tamamlayın: "Kannst du mir ein Buch ___?" (önermek / tavsiye etmek)',
            promptEn: 'Fill in the blank: "Kannst du mir ein Buch ___?" (recommend)',
            answers: ['empfehlen'],
            hintTr: 'Tavsiye etmek anlamındaki fiil "emp..." ile başlar.',
            hintEn: 'The German verb for "recommend" starts with "emp...".',
          },
        ],
      },
      reading: {
        phrases: [
          {
            de: 'Gestern bin ich zu spät gekommen, weil der Bus Verspätung hatte.',
            tr: 'Dün geç kaldım çünkü otobüs rötar yapmıştı.',
            en: 'Yesterday I arrived late because the bus was delayed.',
            tipTr: '"weil" yan cümlesinde çekimli fiil (hatte) en sona gider.',
            tipEn: 'In a "weil" clause, the conjugated verb (hatte) moves to the end.',
          },
          {
            de: 'Im neuen Kurs sprechen wir fast nur auf Deutsch.',
            tr: 'Yeni kursta neredeyse sadece Almanca konuşuyoruz.',
            en: 'In the new course we speak almost exclusively in German.',
            tipTr: '"auf Deutsch" (Almanca olarak / Almanca dilinde).',
            tipEn: '"auf Deutsch" means "in German".',
          },
          {
            de: 'Wenn das Wetter schön ist, gehen wir am Strand spazieren.',
            tr: 'Hava güzel olursa sahilde yürüyüşe çıkarız.',
            en: 'If the weather is nice, we go for a walk on the beach.',
            tipTr: '"Wenn" ile başlayan yan cümleden sonra ana cümle fiille (gehen) başlar.',
            tipEn: 'After a leading "Wenn" clause, the main clause starts with the verb.',
          },
          {
            de: 'Ich habe meine Unterlagen schon per E-Mail geschickt.',
            tr: 'Belgelerimi e-posta ile çoktan gönderdim.',
            en: 'I have already sent my documents by email.',
            tipTr: 'Perfekt zaman: haben + Partizip II (geschickt).',
            tipEn: 'Present perfect (Perfekt): haben + past participle (geschickt).',
          },
        ],
        exercises: [
          {
            id: 'a2-reading-1',
            type: 'choice',
            xp: 10,
            promptTr: '"Gestern bin ich zu spät gekommen, weil der Bus Verspätung hatte." — Kişi neden geç kalmış?',
            promptEn: 'Why was the speaker late in "Gestern bin ich zu spät gekommen, weil der Bus Verspätung hatte."?',
            options: [
              'Otobüs geciktiği için / The bus was delayed',
              'Saat bozulduğu için / The clock broke',
              'Yağmur yağdığı için / It rained',
              'Yol kapalı olduğu için / The road was closed',
            ],
            answer: 'Otobüs geciktiği için / The bus was delayed',
            hintTr: '"Verspätung haben" rötar/gecikme yaşamak demektir.',
            hintEn: '"Verspätung haben" means to be delayed.',
          },
          {
            id: 'a2-reading-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Koşul bağlacını yazın: "___ das Wetter schön ist, gehen wir spazieren." (Eğer / -dığında)',
            promptEn: 'Fill in the conjunction: "___ das Wetter schön ist, gehen wir spazieren." (If / When)',
            answers: ['wenn'],
            hintTr: 'Koşul bildiren 4 harfli bağlaç: w _ _ n.',
            hintEn: 'A 4-letter conjunction for "if / when": w _ _ n.',
          },
        ],
      },
      grammar: {
        phrases: [
          {
            de: 'Ich habe gestern einen interessanten Film gesehen.',
            tr: 'Dün ilginç bir film izledim.',
            en: 'Yesterday I watched an interesting movie.',
            tipTr: '"sehen" fiilinin Partizip II hali "gesehen" şeklindedir.',
            tipEn: 'The past participle of "sehen" is "gesehen".',
          },
          {
            de: 'Er lernt jeden Tag, weil er in Deutschland arbeiten möchte.',
            tr: 'Her gün çalışıyor çünkü Almanya’da çalışmak istiyor.',
            en: 'He studies every day because he wants to work in Germany.',
            tipTr: '"weil" yan cümlesinde modal fiil (möchte) en sonda yer alır.',
            tipEn: 'In a "weil" clause, the modal verb (möchte) goes to the very end.',
          },
          {
            de: 'Ich glaube, dass regelmäßiges Üben sehr wichtig ist.',
            tr: 'Düzenli pratik yapmanın çok önemli olduğuna inanıyorum.',
            en: 'I believe that regular practice is very important.',
            tipTr: '"dass" bağlacı da yan cümle kurar ve fiili (ist) sona atar.',
            tipEn: '"dass" introduces a subordinate clause with verb-final order.',
          },
          {
            de: 'Früher konnte ich kein Deutsch sprechen, aber jetzt geht es gut.',
            tr: 'Eskiden hiç Almanca konuşamıyordum ama şimdi gayet iyi gidiyor.',
            en: 'Previously I couldn’t speak German, but now it’s going well.',
            tipTr: '"konnte" = "können" fiilinin geçmiş zamanı (Präteritum).',
            tipEn: '"konnte" is the simple past of "können".',
          },
        ],
        exercises: [
          {
            id: 'a2-grammar-1',
            type: 'choice',
            xp: 10,
            promptTr: 'Hangi "weil" cümlesinin söz dizimi doğrudur?',
            promptEn: 'Which "weil" sentence has the correct German word order?',
            options: [
              'Ich lerne Deutsch, weil ich in Berlin studieren möchte.',
              'Ich lerne Deutsch, weil möchte ich in Berlin studieren.',
              'Ich lerne Deutsch, weil ich möchte studieren in Berlin.',
              'Ich lerne Deutsch, weil studieren ich in Berlin möchte.',
            ],
            answer: 'Ich lerne Deutsch, weil ich in Berlin studieren möchte.',
            hintTr: '"weil" cümlesinde çekimli modal fiil (möchte) en sona gelir.',
            hintEn: 'In a "weil" clause, the conjugated modal verb (möchte) comes last.',
          },
          {
            id: 'a2-grammar-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Perfekt cümleyi tamamlayın: "Ich habe gestern einen Film ___." (sehen → Partizip II)',
            promptEn: 'Complete the Perfekt sentence: "Ich habe gestern einen Film ___." (past participle of sehen)',
            answers: ['gesehen'],
            hintTr: '"sehen" fiilinin başına "ge-" gelir: ge + sehen.',
            hintEn: 'Add "ge-" to "sehen": ge + sehen.',
          },
        ],
      },
      speaking: {
        phrases: [
          {
            de: 'Meiner Meinung nach ist tägliches Hören am effektivsten.',
            tr: 'Bence günlük dinleme pratiği en etkili yöntemdir.',
            en: 'In my opinion, daily listening is the most effective.',
            tipTr: 'Fikir bildirirken A2 düzeyinde harika başlangıç: "Meiner Meinung nach..."',
            tipEn: 'A strong A2 opinion starter: "Meiner Meinung nach...".',
          },
          {
            de: 'Hättest du am Freitag Lust, ins Kino zu gehen?',
            tr: 'Cuma günü sinemaya gitmeye ne dersin?',
            en: 'Would you feel like going to the cinema on Friday?',
            tipTr: 'Kibar davet kalıbı: "Hättest du Lust, ... zu + mastar?"',
            tipEn: 'Polite invitation pattern: "Hättest du Lust, ... zu + infinitive?".',
          },
          {
            de: 'Könnten Sie mir bitte sagen, wie ich zum Museum komme?',
            tr: 'Müzeye nasıl gideceğimi bana lütfen söyleyebilir misiniz?',
            en: 'Could you please tell me how to get to the museum?',
            tipTr: 'Dolaylı soruda (wie...) fiil (komme) cümle sonuna gider.',
            tipEn: 'In indirect questions (wie...), the verb (komme) goes to the end.',
          },
          {
            de: 'Ich finde, dass man durch Spiele viel schneller lernt.',
            tr: 'Oyunlarla çok daha hızlı öğrenildiğini düşünüyorum.',
            en: 'I think that people learn much faster through games.',
            tipTr: '"Ich finde, dass..." görüş belirtmenin en pratik yoludur.',
            tipEn: '"Ich finde, dass..." is an essential structure for giving opinions.',
          },
        ],
        exercises: [
          {
            id: 'a2-speaking-1',
            type: 'choice',
            xp: 10,
            promptTr: 'Kibar bir öneri / davet için hangi cümle en uygundur?',
            promptEn: 'Which sentence is best for a polite invitation?',
            options: [
              'Hättest du am Samstag Lust, Kaffee zu trinken?',
              'Du trinkst am Samstag Kaffee sofort.',
              'Kaffee trinken Samstag du musst.',
              'Woher bist du am Samstag Kaffee?',
            ],
            answer: 'Hättest du am Samstag Lust, Kaffee zu trinken?',
            hintTr: '"Hättest du Lust, ...?" kibar davet yaparken kullanılır.',
            hintEn: '"Hättest du Lust, ...?" is used for polite invitations.',
          },
          {
            id: 'a2-speaking-2',
            type: 'fill',
            xp: 10,
            promptTr: 'Görüş bildirme kalıbını tamamlayın: "Ich finde, ___ Musik beim Lernen hilft."',
            promptEn: 'Complete the opinion clause: "Ich finde, ___ Musik beim Lernen hilft." (that)',
            answers: ['dass'],
            hintTr: 'Türkçedeki "-dığını / ki" anlamını veren 4 harfli bağlaç: d _ s s.',
            hintEn: 'The 4-letter conjunction meaning "that": d _ s s.',
          },
        ],
      },
      exam: {
        exercises: [
          {
            id: 'a2-exam-1',
            type: 'choice',
            xp: 20,
            promptTr: 'A2 Sınav Sorusu 1: "Gestern ___ ich mit dem Zug nach Izmir gefahren."',
            promptEn: 'A2 Exam Q1: "Gestern ___ ich mit dem Zug nach Izmir gefahren."',
            options: ['habe', 'bin', 'war', 'werde'],
            answer: 'bin',
            hintTr: 'Hareket/yer değiştirme fiilleri (fahren) Perfekt’te "sein" (bin) ile kurulur.',
            hintEn: 'Verbs of motion like "fahren" take "sein" ("bin") in Perfekt.',
          },
          {
            id: 'a2-exam-2',
            type: 'fill',
            xp: 20,
            promptTr: 'A2 Sınav Sorusu 2: "Früher ___ ich nicht gut Deutsch sprechen." ("können" — Präteritum)',
            promptEn: 'A2 Exam Q2: "Früher ___ ich nicht gut Deutsch sprechen." (past tense of "können")',
            answers: ['konnte'],
            hintTr: '"können" fiilinin geçmiş hali umlautsuz yazılır: k o n n t e.',
            hintEn: 'The simple past of "können" drops the umlaut: k o n n t e.',
          },
          {
            id: 'a2-exam-3',
            type: 'choice',
            xp: 20,
            promptTr: 'A2 Sınav Sorusu 3: "Ich bleibe zu Hause, ___ ich erkältet bin." (çünkü)',
            promptEn: 'A2 Exam Q3: "Ich bleibe zu Hause, ___ ich erkältet bin." (because)',
            options: ['weil', 'aber', 'oder', 'denn'],
            answer: 'weil',
            hintTr: 'Fiil ("bin") cümle sonunda olduğu için yan cümle bağlacı "weil" gerekir.',
            hintEn: 'Because the verb ("bin") is at the end, you need "weil" (not "denn").',
          },
        ],
      },
    },
  };

  /* ==========================================================================
     DOM References & State
     ========================================================================== */
  const STORAGE_LANG_KEY = 'tk-lang';
  const STORAGE_GERMAN_KEY = 'tk-german-progress-v1';

  const navbar = document.getElementById('navbar');
  const langToggle = document.getElementById('lang-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  const germanModuleCard = document.getElementById('german-module-card');
  const openGermanLink = document.getElementById('open-german-module');
  const cardGermanXp = document.getElementById('card-german-xp');
  const germanStudio = document.getElementById('german-studio');
  const germanStudioTitle = document.getElementById('german-studio-title');
  const germanStudioContent = document.getElementById('german-studio-content');
  const closeGermanBtn = document.getElementById('close-german-studio');
  const bottomBackBtn = document.getElementById('bottom-back-to-modules');
  const resetProgressBtn = document.getElementById('reset-german-progress');
  const speechNotice = document.getElementById('speech-notice');

  const studioTotalXpEl = document.getElementById('studio-total-xp');
  const studioRankEl = document.getElementById('studio-rank');
  const studioLevelPillEl = document.getElementById('studio-level-pill');
  const studioProgressBarEl = document.getElementById('studio-progress-bar');
  const studioProgressFillEl = document.getElementById('studio-progress-fill');
  const studioProgressTextEl = document.getElementById('studio-progress-text');

  const levelTabButtons = document.querySelectorAll('.level-tab[data-level]');
  const skillTabButtons = document.querySelectorAll('.skill-tab[data-skill]');

  let currentLang = 'tr';
  try {
    const savedLang = localStorage.getItem(STORAGE_LANG_KEY);
    if (savedLang === 'en' || savedLang === 'tr') {
      currentLang = savedLang;
    }
  } catch {
    // Ignore storage access errors in restricted browsing modes
  }

  let progressState = loadGermanProgress();
  let activeLevel = progressState.lastLevel === 'A2' ? 'A2' : 'A1';
  let activeSkill = ['vocab', 'reading', 'grammar', 'speaking', 'exam'].includes(
    progressState.lastSkill
  )
    ? progressState.lastSkill
    : 'vocab';
  let resetConfirmPending = false;
  let resetConfirmTimer = null;
  let cachedVoices = [];

  function loadGermanProgress() {
    const fallback = { completedIds: [], xp: 0, lastLevel: 'A1', lastSkill: 'vocab' };
    try {
      const raw = localStorage.getItem(STORAGE_GERMAN_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : [],
        xp: typeof parsed.xp === 'number' && parsed.xp >= 0 ? parsed.xp : 0,
        lastLevel: parsed.lastLevel === 'A2' ? 'A2' : 'A1',
        lastSkill: typeof parsed.lastSkill === 'string' ? parsed.lastSkill : 'vocab',
      };
    } catch {
      return fallback;
    }
  }

  function saveGermanProgress() {
    progressState.lastLevel = activeLevel;
    progressState.lastSkill = activeSkill;
    try {
      localStorage.setItem(STORAGE_GERMAN_KEY, JSON.stringify(progressState));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }

  function t(key) {
    const dict = translations[currentLang] || translations.tr;
    return dict[key] || translations.tr[key] || key;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getLevelExercises(level) {
    const skills = germanCurriculum[level];
    return Object.keys(skills).reduce((all, skillKey) => {
      return all.concat(skills[skillKey].exercises || []);
    }, []);
  }

  function getLevelStats(level) {
    const exercises = getLevelExercises(level);
    const totalCount = exercises.length;
    const maxXp = exercises.reduce((sum, ex) => sum + ex.xp, 0);
    let completedCount = 0;
    let earnedXp = 0;

    exercises.forEach((ex) => {
      if (progressState.completedIds.includes(ex.id)) {
        completedCount += 1;
        earnedXp += ex.xp;
      }
    });

    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return { completedCount, totalCount, earnedXp, maxXp, percent };
  }

  function getRankTitle(totalXp) {
    if (totalXp >= 220) return t('german.rank4');
    if (totalXp >= 120) return t('german.rank3');
    if (totalXp >= 40) return t('german.rank2');
    return t('german.rank1');
  }

  /* ==========================================================================
     Speech Synthesis (de-DE)
     ========================================================================== */
  function refreshVoices() {
    if (!('speechSynthesis' in window)) return;
    try {
      cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch {
      cachedVoices = [];
    }
  }

  if ('speechSynthesis' in window) {
    refreshVoices();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
  }

  function showSpeechNotice(message) {
    if (!speechNotice) return;
    speechNotice.textContent = message;
    speechNotice.hidden = false;
  }

  function hideSpeechNotice() {
    if (!speechNotice) return;
    speechNotice.hidden = true;
    speechNotice.textContent = '';
  }

  function speakGerman(text, buttonEl) {
    if (
      !('speechSynthesis' in window) ||
      typeof window.SpeechSynthesisUtterance === 'undefined'
    ) {
      showSpeechNotice(t('german.speechUnsupported'));
      return;
    }

    hideSpeechNotice();
    refreshVoices();

    const voices = cachedVoices;
    const germanVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase() === 'de-de') ||
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('de'));

    if (voices.length > 0 && !germanVoice) {
      showSpeechNotice(t('german.speechNoVoice'));
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.92;
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      document.querySelectorAll('.speak-btn.is-speaking').forEach((btn) => {
        btn.classList.remove('is-speaking');
        const label = btn.querySelector('.speak-label');
        if (label) label.textContent = t('german.listen');
      });

      const labelEl = buttonEl ? buttonEl.querySelector('.speak-label') : null;
      if (buttonEl) {
        buttonEl.classList.add('is-speaking');
        if (labelEl) labelEl.textContent = t('german.speakingNow');
      }

      const resetButton = () => {
        if (buttonEl) {
          buttonEl.classList.remove('is-speaking');
          if (labelEl) labelEl.textContent = t('german.listen');
        }
      };

      utterance.onend = resetButton;
      utterance.onerror = () => {
        resetButton();
        showSpeechNotice(t('german.speechError'));
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      showSpeechNotice(t('german.speechError'));
    }
  }

  /* ==========================================================================
     German Studio Rendering & Interaction
     ========================================================================== */
  function updateXpIndicators() {
    const levelStats = getLevelStats(activeLevel);
    const totalXp = progressState.xp;

    if (studioTotalXpEl) studioTotalXpEl.textContent = `${totalXp} XP`;
    if (studioRankEl) studioRankEl.textContent = getRankTitle(totalXp);
    if (studioLevelPillEl) {
      studioLevelPillEl.textContent =
        currentLang === 'tr'
          ? `${activeLevel} · %${levelStats.percent}`
          : `${activeLevel} · ${levelStats.percent}%`;
    }
    if (studioProgressBarEl) {
      studioProgressBarEl.setAttribute('aria-valuenow', String(levelStats.percent));
    }
    if (studioProgressFillEl) {
      studioProgressFillEl.style.width = `${levelStats.percent}%`;
    }
    if (studioProgressTextEl) {
      studioProgressTextEl.textContent = `${levelStats.completedCount} / ${levelStats.totalCount} ${t('german.progressLabel')}`;
    }

    if (cardGermanXp) {
      if (totalXp > 0) {
        cardGermanXp.textContent = `${totalXp} XP`;
        cardGermanXp.hidden = false;
      } else {
        cardGermanXp.hidden = true;
      }
    }
  }

  function syncTabStates() {
    levelTabButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-level') === activeLevel;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    skillTabButtons.forEach((btn) => {
      const isSelected = btn.getAttribute('data-skill') === activeSkill;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });
  }

  function renderExerciseCard(ex) {
    const isSolved = progressState.completedIds.includes(ex.id);
    const prompt = currentLang === 'en' ? ex.promptEn : ex.promptTr;
    const typeLabel =
      ex.type === 'choice' ? t('german.typeChoice') : t('german.typeFill');
    const xpBadgeText = isSolved
      ? `✓ ${t('german.completedBadge')} (+${ex.xp} XP)`
      : `+${ex.xp} XP`;

    let bodyHtml = '';
    if (ex.type === 'choice') {
      const optionsHtml = ex.options
        .map((opt) => {
          const solvedClass = isSolved && opt === ex.answer ? ' is-correct' : '';
          return `<button type="button" class="option-btn${solvedClass}" data-option="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`;
        })
        .join('');
      bodyHtml = `<div class="exercise-options">${optionsHtml}</div>`;
    } else {
      const prefill = isSolved ? ex.answers[0] : '';
      const umlauts = ['ä', 'ö', 'ü', 'ß']
        .map(
          (ch) =>
            `<button type="button" class="umlaut-btn" data-char="${ch}" aria-label="${ch}">${ch}</button>`
        )
        .join('');
      bodyHtml = `
        <form class="fill-form" data-fill-form>
          <div class="fill-row">
            <input
              type="text"
              class="fill-input"
              value="${escapeHtml(prefill)}"
              placeholder="${escapeHtml(t('german.inputPlaceholder'))}"
              autocomplete="off"
              spellcheck="false"
            />
            <button type="submit" class="fill-submit-btn">${escapeHtml(t('german.checkAnswer'))}</button>
          </div>
          <div class="umlaut-bar">
            <span class="umlaut-label">${escapeHtml(t('german.umlautHelper'))}</span>
            ${umlauts}
          </div>
        </form>
      `;
    }

    return `
      <article class="exercise-card${isSolved ? ' is-solved' : ''}" data-exercise-id="${escapeHtml(ex.id)}">
        <div class="exercise-top">
          <span class="exercise-type">${escapeHtml(typeLabel)}</span>
          <span class="exercise-xp-pill${isSolved ? ' is-done' : ''}" data-xp-pill>${escapeHtml(xpBadgeText)}</span>
        </div>
        <h4 class="exercise-prompt">${escapeHtml(prompt)}</h4>
        ${bodyHtml}
        <div class="exercise-feedback" data-feedback hidden role="status" aria-live="polite"></div>
      </article>
    `;
  }

  function renderGermanStudio() {
    if (!germanStudioContent) return;

    syncTabStates();
    updateXpIndicators();

    const levelData = germanCurriculum[activeLevel];
    const skillData = levelData[activeSkill];
    if (!skillData) return;

    let html = '';

    if (activeSkill === 'exam') {
      const a1Stats = getLevelStats('A1');
      const a2Stats = getLevelStats('A2');

      html += `
        <div class="workspace-block">
          <div class="workspace-block-head">
            <div>
              <h3 class="workspace-block-title">${escapeHtml(t('german.examOverviewTitle'))}</h3>
              <p class="workspace-block-sub">${escapeHtml(t('german.examOverviewSub'))}</p>
            </div>
          </div>
          <div class="xp-overview-grid">
            <div class="xp-overview-card">
              <div class="xp-overview-head">
                <span>A1 · ${escapeHtml(t('german.levelA1'))}</span>
                <span class="xp-overview-score">${a1Stats.earnedXp} / ${a1Stats.maxXp} XP</span>
              </div>
              <div class="xp-progress-track">
                <div class="xp-progress-fill" style="width: ${a1Stats.percent}%"></div>
              </div>
              <div class="xp-progress-meta">
                <span>${a1Stats.completedCount} / ${a1Stats.totalCount} ${escapeHtml(t('german.progressLabel'))}</span>
                <span>${a1Stats.percent}%</span>
              </div>
            </div>

            <div class="xp-overview-card">
              <div class="xp-overview-head">
                <span>A2 · ${escapeHtml(t('german.levelA2'))}</span>
                <span class="xp-overview-score">${a2Stats.earnedXp} / ${a2Stats.maxXp} XP</span>
              </div>
              <div class="xp-progress-track">
                <div class="xp-progress-fill" style="width: ${a2Stats.percent}%"></div>
              </div>
              <div class="xp-progress-meta">
                <span>${a2Stats.completedCount} / ${a2Stats.totalCount} ${escapeHtml(t('german.progressLabel'))}</span>
                <span>${a2Stats.percent}%</span>
              </div>
            </div>
          </div>
        </div>
      `;

      const examCards = skillData.exercises.map(renderExerciseCard).join('');
      html += `
        <div class="workspace-block">
          <div class="workspace-block-head">
            <div>
              <h3 class="workspace-block-title">${escapeHtml(activeLevel)} ${escapeHtml(t('german.examQuestionsTitle'))}</h3>
              <p class="workspace-block-sub">${escapeHtml(t('german.examQuestionsSub'))}</p>
            </div>
          </div>
          <div class="exercise-list exercise-list-exam">${examCards}</div>
        </div>
      `;
    } else {
      const phrasesHtml = skillData.phrases
        .map((item) => {
          const meaning = currentLang === 'en' ? item.en : item.tr;
          const tip = currentLang === 'en' ? item.tipEn : item.tipTr;
          return `
            <article class="phrase-card">
              <div>
                <p class="phrase-de">${escapeHtml(item.de)}</p>
                <p class="phrase-meaning">${escapeHtml(meaning)}</p>
                <p class="phrase-tip">${escapeHtml(tip)}</p>
              </div>
              <div class="phrase-actions">
                <span class="phrase-lang-tag">${escapeHtml(activeLevel)} · DE</span>
                <button type="button" class="speak-btn" data-speak="${escapeHtml(item.de)}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                  <span class="speak-label">${escapeHtml(t('german.listen'))}</span>
                </button>
              </div>
            </article>
          `;
        })
        .join('');

      const exercisesHtml = skillData.exercises.map(renderExerciseCard).join('');

      html = `
        <div class="workspace-block">
          <div class="workspace-block-head">
            <div>
              <h3 class="workspace-block-title">${escapeHtml(t('german.phrasesTitle'))}</h3>
              <p class="workspace-block-sub">${escapeHtml(t('german.phrasesSub'))}</p>
            </div>
          </div>
          <div class="phrase-grid">${phrasesHtml}</div>
        </div>

        <div class="workspace-block">
          <div class="workspace-block-head">
            <div>
              <h3 class="workspace-block-title">${escapeHtml(t('german.exercisesTitle'))}</h3>
              <p class="workspace-block-sub">${escapeHtml(t('german.exercisesSub'))}</p>
            </div>
          </div>
          <div class="exercise-list">${exercisesHtml}</div>
        </div>
      `;
    }

    germanStudioContent.innerHTML = html;
  }

  function findExerciseById(id) {
    const all = getLevelExercises(activeLevel);
    return all.find((ex) => ex.id === id) || null;
  }

  function normalizeGermanAnswer(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?]+$/, '');
  }

  function handleExerciseEvaluation(cardEl, exercise, isCorrect) {
    const feedbackEl = cardEl.querySelector('[data-feedback]');
    const xpPillEl = cardEl.querySelector('[data-xp-pill]');
    if (!feedbackEl) return;

    if (isCorrect) {
      const alreadyCompleted = progressState.completedIds.includes(exercise.id);
      if (!alreadyCompleted) {
        progressState.completedIds.push(exercise.id);
        progressState.xp += exercise.xp;
        saveGermanProgress();
        updateXpIndicators();
      }

      cardEl.classList.add('is-solved');
      if (xpPillEl) {
        xpPillEl.classList.add('is-done');
        xpPillEl.textContent = `✓ ${t('german.completedBadge')} (+${exercise.xp} XP)`;
      }

      feedbackEl.className = 'exercise-feedback is-success';
      feedbackEl.textContent = alreadyCompleted
        ? t('german.correctAlready')
        : t('german.correctNewXp').replace('{xp}', String(exercise.xp));
      feedbackEl.hidden = false;

      if (activeSkill === 'exam' && !alreadyCompleted) {
        // Refresh the A1/A2 overview progress bars on the exam dashboard
        const a1Stats = getLevelStats('A1');
        const a2Stats = getLevelStats('A2');
        const overviewCards = germanStudioContent.querySelectorAll('.xp-overview-card');
        if (overviewCards[0]) {
          const scoreEl = overviewCards[0].querySelector('.xp-overview-score');
          const fillEl = overviewCards[0].querySelector('.xp-progress-fill');
          const metaSpans = overviewCards[0].querySelectorAll('.xp-progress-meta span');
          if (scoreEl) scoreEl.textContent = `${a1Stats.earnedXp} / ${a1Stats.maxXp} XP`;
          if (fillEl) fillEl.style.width = `${a1Stats.percent}%`;
          if (metaSpans[0]) {
            metaSpans[0].textContent = `${a1Stats.completedCount} / ${a1Stats.totalCount} ${t('german.progressLabel')}`;
          }
          if (metaSpans[1]) metaSpans[1].textContent = `${a1Stats.percent}%`;
        }
        if (overviewCards[1]) {
          const scoreEl = overviewCards[1].querySelector('.xp-overview-score');
          const fillEl = overviewCards[1].querySelector('.xp-progress-fill');
          const metaSpans = overviewCards[1].querySelectorAll('.xp-progress-meta span');
          if (scoreEl) scoreEl.textContent = `${a2Stats.earnedXp} / ${a2Stats.maxXp} XP`;
          if (fillEl) fillEl.style.width = `${a2Stats.percent}%`;
          if (metaSpans[0]) {
            metaSpans[0].textContent = `${a2Stats.completedCount} / ${a2Stats.totalCount} ${t('german.progressLabel')}`;
          }
          if (metaSpans[1]) metaSpans[1].textContent = `${a2Stats.percent}%`;
        }
      }
    } else {
      const hint = currentLang === 'en' ? exercise.hintEn : exercise.hintTr;
      feedbackEl.className = 'exercise-feedback is-error';
      feedbackEl.textContent = `${t('german.wrongHint')} ${hint}`;
      feedbackEl.hidden = false;
    }
  }

  function openGermanStudio(shouldScroll = true) {
    if (!germanStudio) return;
    germanStudio.hidden = false;
    germanStudio.classList.add('is-open');
    if (openGermanLink) {
      openGermanLink.setAttribute('aria-expanded', 'true');
    }
    renderGermanStudio();

    if (shouldScroll) {
      germanStudio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (germanStudioTitle) {
        window.setTimeout(() => {
          germanStudioTitle.focus({ preventScroll: true });
        }, 350);
      }
    }
  }

  function closeGermanStudio() {
    if (!germanStudio) return;
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore cancel errors
      }
    }
    germanStudio.hidden = true;
    germanStudio.classList.remove('is-open');
    if (openGermanLink) {
      openGermanLink.setAttribute('aria-expanded', 'false');
    }

    const modulesSection = document.getElementById('modules');
    if (modulesSection) {
      modulesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.location.hash === '#german-studio') {
      try {
        history.replaceState(null, '', '#modules');
      } catch {
        // Ignore history errors
      }
    }
  }

  if (germanModuleCard) {
    germanModuleCard.addEventListener('click', (event) => {
      event.preventDefault();
      openGermanStudio(true);
    });
  }

  if (openGermanLink) {
    openGermanLink.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openGermanStudio(true);
    });
  }

  if (closeGermanBtn) {
    closeGermanBtn.addEventListener('click', closeGermanStudio);
  }

  if (bottomBackBtn) {
    bottomBackBtn.addEventListener('click', closeGermanStudio);
  }

  levelTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextLevel = btn.getAttribute('data-level');
      if (nextLevel && nextLevel !== activeLevel) {
        activeLevel = nextLevel;
        saveGermanProgress();
        hideSpeechNotice();
        renderGermanStudio();
      }
    });
  });

  skillTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextSkill = btn.getAttribute('data-skill');
      if (nextSkill && nextSkill !== activeSkill) {
        activeSkill = nextSkill;
        saveGermanProgress();
        hideSpeechNotice();
        renderGermanStudio();
      }
    });
  });

  if (germanStudioContent) {
    germanStudioContent.addEventListener('click', (event) => {
      const speakBtn = event.target.closest('.speak-btn');
      if (speakBtn) {
        const text = speakBtn.getAttribute('data-speak');
        if (text) speakGerman(text, speakBtn);
        return;
      }

      const umlautBtn = event.target.closest('.umlaut-btn');
      if (umlautBtn) {
        const ch = umlautBtn.getAttribute('data-char') || '';
        const card = umlautBtn.closest('.exercise-card');
        const input = card ? card.querySelector('.fill-input') : null;
        if (input) {
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? input.value.length;
          input.value =
            input.value.slice(0, start) + ch + input.value.slice(end);
          input.focus();
          input.setSelectionRange(start + ch.length, start + ch.length);
        }
        return;
      }

      const optionBtn = event.target.closest('.option-btn');
      if (optionBtn) {
        const card = optionBtn.closest('.exercise-card');
        if (!card) return;
        const exId = card.getAttribute('data-exercise-id');
        const exercise = findExerciseById(exId);
        if (!exercise) return;

        const chosen = optionBtn.getAttribute('data-option');
        const isCorrect = chosen === exercise.answer;

        card.querySelectorAll('.option-btn').forEach((btn) => {
          btn.classList.remove('is-correct', 'is-wrong');
        });
        optionBtn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
        handleExerciseEvaluation(card, exercise, isCorrect);
      }
    });

    germanStudioContent.addEventListener('submit', (event) => {
      const form = event.target.closest('[data-fill-form]');
      if (!form) return;
      event.preventDefault();

      const card = form.closest('.exercise-card');
      const input = form.querySelector('.fill-input');
      const feedbackEl = card ? card.querySelector('[data-feedback]') : null;
      if (!card || !input) return;

      const exId = card.getAttribute('data-exercise-id');
      const exercise = findExerciseById(exId);
      if (!exercise) return;

      const userVal = normalizeGermanAnswer(input.value);
      if (!userVal) {
        if (feedbackEl) {
          feedbackEl.className = 'exercise-feedback is-error';
          feedbackEl.textContent = t('german.emptyInput');
          feedbackEl.hidden = false;
        }
        input.focus();
        return;
      }

      const accepted = (exercise.answers || []).map(normalizeGermanAnswer);
      const isCorrect = accepted.includes(userVal);
      handleExerciseEvaluation(card, exercise, isCorrect);
    });
  }

  if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', () => {
      if (!resetConfirmPending) {
        resetConfirmPending = true;
        resetProgressBtn.classList.add('is-confirming');
        resetProgressBtn.textContent = t('german.resetConfirm');
        window.clearTimeout(resetConfirmTimer);
        resetConfirmTimer = window.setTimeout(() => {
          resetConfirmPending = false;
          resetProgressBtn.classList.remove('is-confirming');
          resetProgressBtn.textContent = t('german.resetProgress');
        }, 4000);
        return;
      }

      window.clearTimeout(resetConfirmTimer);
      resetConfirmPending = false;
      resetProgressBtn.classList.remove('is-confirming');
      resetProgressBtn.textContent = t('german.resetProgress');

      progressState = {
        completedIds: [],
        xp: 0,
        lastLevel: activeLevel,
        lastSkill: activeSkill,
      };
      saveGermanProgress();
      renderGermanStudio();
    });
  }

  /* ==========================================================================
     Language Switcher & Global UI
     ========================================================================== */
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

    if (resetProgressBtn && resetConfirmPending) {
      resetProgressBtn.textContent = t('german.resetConfirm');
    }

    updateXpIndicators();
    if (germanStudio && !germanStudio.hidden) {
      renderGermanStudio();
    }

    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
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
          const highlightId = activeId === 'german-studio' ? 'modules' : activeId;
          navLinks.forEach((link) => {
            const matches = link.getAttribute('href') === `#${highlightId}`;
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

  if (window.location.hash === '#german-studio') {
    openGermanStudio(false);
  }
})();
