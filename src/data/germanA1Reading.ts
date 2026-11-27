import imgAsset1 from '../assets/images/lesen_alltag_email_1795375251949.jpg';
import imgAsset2 from '../assets/images/lesen_cafe_menu_1795375249815.jpg';
import imgAsset3 from '../assets/images/lesen_reisen_train_1795375249160.jpg';
import imgAsset4 from '../assets/images/lesen_wohnung_notice_1795375249467.jpg';
import type { ReadingScenario } from '../types';

export const GERMAN_A1_READING_SCENARIOS: ReadingScenario[] = [
  {
    id: 'lesen-alltag',
    titleDe: 'Vorstellung & Alltag',
    titleTr: 'Tanışma ve Günlük Yaşam',
    contextLabelTr: 'Kişisel E-Posta · Hamburg',
    subtitleTr: 'Lukas’ın günlük çalışma düzeni, ulaşım alışkanlığı ve akşam kursu hakkında kısa e-postası',
    format: 'email',
    estimatedMinutes: 3,
    imageUrl: imgAsset1,
    imageAlt: 'Hamburg’da sabah ışığında çalışma masası, açık defter ve kahve fincanı',
    document: {
      formatLabelTr: 'Kişisel E-Posta',
      formatLabelDe: 'E-Mail',
      metaRows: [
        { labelDe: 'Von:', valueDe: 'lukas.weber@post.de', valueTr: 'Gönderen: lukas.weber@post.de' },
        { labelDe: 'An:', valueDe: 'selin.yilmaz@post.de', valueTr: 'Alıcı: selin.yilmaz@post.de' },
        {
          labelDe: 'Betreff:',
          valueDe: 'Mein Alltag in Hamburg',
          valueTr: 'Konu: Hamburg’daki günlük yaşamım',
        },
        {
          labelDe: 'Datum:',
          valueDe: 'Montag, 14. Mai',
          valueTr: 'Tarih: Pazartesi, 14 Mayıs',
        },
      ],
      paragraphsDe: [
        'Liebe Selin,',
        'wie geht es dir? Ich wohne jetzt seit drei Monaten in Hamburg und möchte dir kurz von meinem Alltag erzählen.',
        'Jeden Morgen stehe ich um sieben Uhr auf. Zum Frühstück trinke ich keinen Kaffee, sondern eine große Tasse Tee mit Zitrone. Um acht Uhr fahre ich mit dem Fahrrad zur Arbeit. Ich arbeite in einem kleinen Büro von neun bis siebzehn Uhr.',
        'Nach der Arbeit koche ich gern zu Hause oder treffe meine Freunde im Park. Am Mittwochabend besuche ich einen Türkisch-Sprachkurs, weil ich deine Sprache sehr interessant finde. Am Wochenende schlafe ich lange und lese am liebsten ein Buch.',
      ],
      paragraphsTr: [
        'Sevgili Selin,',
        'Nasılsın? Üç aydır Hamburg’da yaşıyorum ve sana kısaca günlük yaşamımdan bahsetmek istiyorum.',
        'Her sabah saat yedide kalkıyorum. Kahvaltıda kahve değil, büyük bir fincan limonlu çay içiyorum. Saat sekizde bisikletle işe gidiyorum. Küçük bir ofiste saat dokuzdan on yediye kadar çalışıyorum.',
        'İşten sonra evde yemek yapmayı seviyorum ya da parkta arkadaşlarımla buluşuyorum. Çarşamba akşamları Türkçe dil kursuna gidiyorum çünkü dilini çok ilginç buluyorum. Hafta sonu geç saate kadar uyuyorum ve en çok kitap okumayı seviyorum.',
      ],
      footerNoteDe: 'Viele Grüße aus Hamburg, dein Lukas',
      footerNoteTr: 'Hamburg’dan sevgilerle, Lukas',
      readAloudDe:
        'Mein Alltag in Hamburg. Liebe Selin, wie geht es dir? Ich wohne jetzt seit drei Monaten in Hamburg und möchte dir kurz von meinem Alltag erzählen. Jeden Morgen stehe ich um sieben Uhr auf. Zum Frühstück trinke ich keinen Kaffee, sondern eine große Tasse Tee mit Zitrone. Um acht Uhr fahre ich mit dem Fahrrad zur Arbeit. Ich arbeite in einem kleinen Büro von neun bis siebzehn Uhr. Nach der Arbeit koche ich gern zu Hause oder treffe meine Freunde im Park. Am Mittwochabend besuche ich einen Türkisch-Sprachkurs, weil ich deine Sprache sehr interessant finde. Am Wochenende schlafe ich lange und lese am liebsten ein Buch. Viele Grüße aus Hamburg, dein Lukas.',
    },
    glossary: [
      {
        id: 'gl-al-1',
        german: 'Alltag',
        article: 'der',
        turkish: 'günlük yaşam, rutin',
        noteTr: 'Çoğunlukla tekil kullanılır.',
      },
      {
        id: 'gl-al-2',
        german: 'aufstehen',
        turkish: 'uyanmak, yataktan kalkmak',
        noteTr: 'Ayrılabilen fiil: Ich stehe um 7 Uhr auf.',
      },
      {
        id: 'gl-al-3',
        german: 'Fahrrad',
        article: 'das',
        turkish: 'bisiklet',
        noteTr: '"mit dem Fahrrad" (bisikletle) kalıbında datif alır.',
      },
      {
        id: 'gl-al-4',
        german: 'Büro',
        article: 'das',
        turkish: 'ofis, büro',
        noteTr: 'Çoğulu: die Büros.',
      },
      {
        id: 'gl-al-5',
        german: 'Sprachkurs',
        article: 'der',
        turkish: 'dil kursu',
        noteTr: 'Akuzatifte "einen Sprachkurs" olur.',
      },
      {
        id: 'gl-al-6',
        german: 'am liebsten',
        turkish: 'en çok, en severek',
        noteTr: 'Tercih bildirir: Ich lese am liebsten.',
      },
    ],
    trueFalse: [
      {
        id: 'lesen-alltag-tf-1',
        statementDe: 'Lukas trinkt zum Frühstück eine Tasse Kaffee.',
        statementTr: 'Lukas kahvaltıda bir fincan kahve içer.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). E-postada açıkça "Zum Frühstück trinke ich keinen Kaffee, sondern eine große Tasse Tee mit Zitrone." yazıyor; kahve yerine limonlu çay içiyor.',
      },
      {
        id: 'lesen-alltag-tf-2',
        statementDe: 'Lukas arbeitet von neun bis siebzehn Uhr in einem Büro.',
        statementTr: 'Lukas saat dokuzdan on yediye kadar bir ofiste çalışıyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Metinde "Ich arbeite in einem kleinen Büro von neun bis siebzehn Uhr." ifadesi yer alıyor.',
      },
    ],
    cloze: [
      {
        id: 'lesen-alltag-cl-1',
        promptDe: 'Um acht Uhr fährt Lukas mit dem ___ zur Arbeit.',
        hintTr: 'Metinde Lukas’ın işe giderken kullandığı ulaşım aracı (artikelsiz biçim)',
        options: ['Fahrrad', 'Auto', 'Bus', 'Zug'],
        correctOption: 'Fahrrad',
        explanationTr:
          'Metinde "Um acht Uhr fahre ich mit dem Fahrrad zur Arbeit." geçiyor. "mit dem" zaten datif artikel içerdiği için boşluğa artikelsiz olarak "Fahrrad" gelir.',
      },
      {
        id: 'lesen-alltag-cl-2',
        promptDe: 'Am Mittwochabend besucht Lukas ___ Türkisch-Sprachkurs.',
        hintTr: '"der Sprachkurs" ismi için akuzatif belirsiz artikel',
        options: ['einen', 'eine', 'ein', 'einem'],
        correctOption: 'einen',
        explanationTr:
          '"besuchen" fiili akuzatif (-i hâli) alır ve "der Sprachkurs" eril bir isimdir; bu yüzden belirsiz artikel "einen" olur: "einen Türkisch-Sprachkurs".',
      },
    ],
    multipleChoice: [
      {
        id: 'lesen-alltag-mc-1',
        questionTr: 'Lukas ne kadar süredir Hamburg’da yaşıyor?',
        questionDe: 'Wie lange wohnt Lukas schon in Hamburg?',
        options: ['Üç aydır', 'Üç haftadır', 'Bir yıldır', 'Altı aydır'],
        correctIndex: 0,
        explanationTr:
          'İlk paragrafta Lukas "Ich wohne jetzt seit drei Monaten in Hamburg" (üç aydır Hamburg’da yaşıyorum) bilgisini veriyor.',
      },
      {
        id: 'lesen-alltag-mc-2',
        questionTr: 'Lukas çarşamba akşamları ne yapıyor?',
        questionDe: 'Was macht Lukas am Mittwochabend?',
        options: [
          'Türkçe dil kursuna gidiyor',
          'Ofiste fazla mesai yapıyor',
          'Parkta bisiklet tamir ediyor',
          'Selin ile kahve içiyor',
        ],
        correctIndex: 0,
        explanationTr:
          'Son paragrafta "Am Mittwochabend besuche ich einen Türkisch-Sprachkurs" cümlesiyle çarşamba akşamları Türkçe kursuna gittiğini belirtiyor.',
      },
    ],
  },
  {
    id: 'lesen-speisekarte',
    titleDe: 'Einkaufen & Speisekarte',
    titleTr: 'Alışveriş ve Kafe Menüsü',
    contextLabelTr: 'Fırın & Kafe Menüsü · Fiyat Listesi',
    subtitleTr: 'Café Lindenhof’un açılış saatleri, kahvaltı/pasta fiyatları ve ödeme koşulları',
    format: 'menu',
    estimatedMinutes: 3,
    imageUrl: imgAsset2,
    imageAlt: 'Alman mahalle kafesinde ahşap masa üzerinde taze brezel, cappuccino ve elmalı pasta',
    document: {
      formatLabelTr: 'Kafe Menüsü ve Fiyat Listesi',
      formatLabelDe: 'Speisekarte · Café Lindenhof',
      metaRows: [
        {
          labelDe: 'Öffnungszeiten:',
          valueDe: 'Dienstag bis Sonntag, 07:30 – 18:00 Uhr',
          valueTr: 'Açılış Saatleri: Salı–Pazar, 07:30 – 18:00',
        },
        {
          labelDe: 'Ruhetag:',
          valueDe: 'Montag geschlossen',
          valueTr: 'Tatil Günü: Pazartesi kapalı',
        },
        {
          labelDe: 'Adresse:',
          valueDe: 'Lindenstraße 12, Bonn',
          valueTr: 'Adres: Lindenstraße 12, Bonn',
        },
      ],
      paragraphsDe: [
        'Herzlich willkommen im Café Lindenhof! Alle Backwaren kommen jeden Morgen frisch aus unserem Ofen.',
      ],
      paragraphsTr: [
        'Café Lindenhof’a hoş geldiniz! Tüm unlu mamuller her sabah fırınımızdan taze çıkar.',
      ],
      menuSections: [
        {
          headingDe: 'Frühstück & Gebäck',
          headingTr: 'Kahvaltı ve Hamur İşleri',
          items: [
            {
              nameDe: 'Frische Butterbrezel',
              detailDe: 'warm aus dem Ofen',
              price: '2,20 €',
              nameTr: 'Taze tereyağlı brezel (fırından sıcak)',
            },
            {
              nameDe: 'Käsebrötchen mit Tomate',
              detailDe: 'mit frischem Salat',
              price: '3,50 €',
              nameTr: 'Domatesli peynirli sandviç ekmeği (taze marullu)',
            },
            {
              nameDe: 'Hausgemachter Apfelkuchen',
              detailDe: 'ein Stück',
              price: '3,90 €',
              nameTr: 'Ev yapımı elmalı kek (bir dilim)',
            },
          ],
        },
        {
          headingDe: 'Getränke',
          headingTr: 'İçecekler',
          items: [
            {
              nameDe: 'Cappuccino',
              detailDe: 'auch mit Hafermilch',
              price: '3,40 €',
              nameTr: 'Cappuccino (yulaf sütü seçeneğiyle)',
            },
            {
              nameDe: 'Schwarzer Tee oder Pfefferminztee',
              detailDe: 'große Tasse',
              price: '2,60 €',
              nameTr: 'Siyah çay veya nane çayı (büyük fincan)',
            },
            {
              nameDe: 'Mineralwasser (0,5 l)',
              detailDe: 'still oder mit Kohlensäure',
              price: '2,50 €',
              nameTr: 'Maden suyu / içme suyu (0,5 l, sade veya gazlı)',
            },
          ],
        },
      ],
      footerNoteDe:
        'Hinweis: Kartenzahlung ist ab 5,00 € möglich. Mittagsangebot (12:00 – 14:30 Uhr): Tagessuppe mit Brot für 6,50 €.',
      footerNoteTr:
        'Not: 5,00 € ve üzeri alışverişlerde kartla ödeme yapılabilir. Öğle fırsatı (12:00 – 14:30): Ekmekli günün çorbası 6,50 €.',
      readAloudDe:
        'Speisekarte Café Lindenhof. Öffnungszeiten: Dienstag bis Sonntag von sieben Uhr dreißig bis achtzehn Uhr. Montag geschlossen. Herzlich willkommen im Café Lindenhof! Alle Backwaren kommen jeden Morgen frisch aus unserem Ofen. Frühstück und Gebäck: Frische Butterbrezel zwei Euro zwanzig. Käsebrötchen mit Tomate drei Euro fünfzig. Hausgemachter Apfelkuchen drei Euro neunzig. Getränke: Cappuccino drei Euro vierzig. Schwarzer Tee oder Pfefferminztee zwei Euro sechzig. Mineralwasser zwei Euro fünfzig. Hinweis: Kartenzahlung ist ab fünf Euro möglich. Mittagsangebot von zwölf Uhr bis vierzehn Uhr dreißig: Tagessuppe mit Brot für sechs Euro fünfzig.',
    },
    glossary: [
      {
        id: 'gl-sp-1',
        german: 'Öffnungszeiten',
        article: 'die',
        turkish: 'açılış saatleri (çoğul)',
        noteTr: 'Mağaza ve kafelerde sıkça görülür.',
      },
      {
        id: 'gl-sp-2',
        german: 'Ruhetag',
        article: 'der',
        turkish: 'işletmenin kapalı olduğu tatil günü',
        noteTr: 'Menüde: Montag geschlossen.',
      },
      {
        id: 'gl-sp-3',
        german: 'Apfelkuchen',
        article: 'der',
        turkish: 'elmalı kek / pasta',
        noteTr: 'Bileşik isim: der Kuchen → der Apfelkuchen.',
      },
      {
        id: 'gl-sp-4',
        german: 'Kartenzahlung',
        article: 'die',
        turkish: 'kartla ödeme',
        noteTr: '"-ung" eki aldığı için daima "die" artikelini alır.',
      },
      {
        id: 'gl-sp-5',
        german: 'Mittagsangebot',
        article: 'das',
        turkish: 'öğle menüsü / öğle fırsatı',
        noteTr: 'Belirli saatlerde geçerli indirimli menü.',
      },
      {
        id: 'gl-sp-6',
        german: 'geschlossen',
        turkish: 'kapalı',
        noteTr: 'Zıttı: geöffnet (açık).',
      },
    ],
    trueFalse: [
      {
        id: 'lesen-menu-tf-1',
        statementDe: 'Das Café Lindenhof ist am Montag geöffnet.',
        statementTr: 'Café Lindenhof pazartesi günleri açıktır.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Menü başlığında "Ruhetag: Montag geschlossen" (Pazartesi kapalı) bilgisi açıkça yazıyor.',
      },
      {
        id: 'lesen-menu-tf-2',
        statementDe: 'Man kann im Café ab fünf Euro mit Karte bezahlen.',
        statementTr: 'Kafede beş eurodan itibaren kartla ödeme yapılabilir.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Alt notta "Kartenzahlung ist ab 5,00 € möglich." (5,00 € üzerinden itibaren kartla ödeme mümkündür) yazıyor.',
      },
    ],
    cloze: [
      {
        id: 'lesen-menu-cl-1',
        promptDe: 'Am ___ ist das Café Lindenhof geschlossen.',
        hintTr: 'Kafenin kapalı olduğu gün (artikelsiz biçim)',
        options: ['Montag', 'Dienstag', 'Samstag', 'Sonntag'],
        correctOption: 'Montag',
        explanationTr:
          'Menüye göre kafe salıdan pazara açıktır, pazartesi ise kapalıdır ("Montag geschlossen"). "Am" (an + dem) zaten artikeli barındırdığı için gün adı yalın yazılır.',
      },
      {
        id: 'lesen-menu-cl-2',
        promptDe: 'Ich bestelle ___ Apfelkuchen und einen Cappuccino.',
        hintTr: '"der Apfelkuchen" ismi için akuzatif belirsiz artikel',
        options: ['einen', 'eine', 'ein', 'einem'],
        correctOption: 'einen',
        explanationTr:
          '"bestellen" (sipariş etmek) fiili akuzatif alır. "der Apfelkuchen" eril olduğundan belirsiz artikel "einen" şeklinde kullanılır.',
      },
    ],
    multipleChoice: [
      {
        id: 'lesen-menu-mc-1',
        questionTr: 'Bir dilim elmalı kek ve bir çay toplam kaç euro tutar?',
        questionDe: 'Wie viel kosten ein Apfelkuchen und eine Tasse Tee zusammen?',
        options: ['6,50 €', '5,60 €', '7,30 €', '6,10 €'],
        correctIndex: 0,
        explanationTr:
          'Menüde elmalı kek 3,90 € ve çay 2,60 € olarak listelenmiştir; 3,90 € + 2,60 € = 6,50 € eder.',
      },
      {
        id: 'lesen-menu-mc-2',
        questionTr: 'Öğle fırsatı (Mittagsangebot) hangi saatler arasında sunuluyor?',
        questionDe: 'Wann gibt es das Mittagsangebot?',
        options: [
          '12:00 – 14:30 arası',
          '07:30 – 11:00 arası',
          '14:30 – 18:00 arası',
          'Tüm gün boyunca',
        ],
        correctIndex: 0,
        explanationTr:
          'Menünün altındaki bilgi notunda "Mittagsangebot (12:00 – 14:30 Uhr): Tagessuppe mit Brot für 6,50 €" belirtilmiştir.',
      },
    ],
  },
  {
    id: 'lesen-wohnung',
    titleDe: 'Wohnung & Nachbarschaft',
    titleTr: 'Ev ve Komşuluk Duyurusu',
    contextLabelTr: 'Apartman İlan Panosu · Aushang',
    subtitleTr: 'Mozartstraße 18 apartmanındaki bisiklet alanı, sessizlik saatleri ve komşu toplantısı duyurusu',
    format: 'notice',
    estimatedMinutes: 3,
    imageUrl: imgAsset4,
    imageAlt: 'Klasik bir Alman apartman girişinde ahşap duvar panosu ve posta kutuları',
    document: {
      formatLabelTr: 'Apartman İlan Panosu Duyurusu',
      formatLabelDe: 'Aushang im Treppenhaus',
      metaRows: [
        {
          labelDe: 'Gebäude:',
          valueDe: 'Mozartstraße 18, 50674 Köln',
          valueTr: 'Bina: Mozartstraße 18, 50674 Köln',
        },
        {
          labelDe: 'Absender:',
          valueDe: 'Hausverwaltung Schneider',
          valueTr: 'Gönderen: Schneider Apartman Yönetimi',
        },
        {
          labelDe: 'Gültig ab:',
          valueDe: '1. Juni',
          valueTr: 'Geçerlilik: 1 Haziran itibarıyla',
        },
      ],
      paragraphsDe: [
        'Liebe Nachbarinnen und Nachbarn,',
        '1. Neuer Fahrradplatz: Ab dem 1. Juni gibt es im Innenhof zwölf neue Plätze für Fahrräder. Bitte stellen Sie Ihr Fahrrad nicht mehr in den Flur, sondern in den Innenhof.',
        '2. Ruhezeit im Haus: Bitte achten Sie auf unsere gemeinsame Ruhezeit. Sie beginnt jeden Abend um 22:00 Uhr und endet morgens um 07:00 Uhr.',
        '3. Nachbarschaftskaffee: Am Samstag, dem 8. Juni, treffen wir uns um 15:00 Uhr im Garten hinter dem Haus. Alle Bewohnerinnen und Bewohner sind herzlich eingeladen!',
      ],
      paragraphsTr: [
        'Değerli komşular,',
        '1. Yeni bisiklet alanı: 1 Haziran’dan itibaren iç avluda bisikletler için on iki yeni park yeri bulunuyor. Lütfen bisikletinizi artık koridora değil, iç avluya koyun.',
        '2. Binada sessizlik saatleri: Lütfen ortak sessizlik saatlerimize dikkat edin. Her akşam 22:00’de başlar ve sabah 07:00’de sona erer.',
        '3. Komşuluk kahvesi: 8 Haziran Cumartesi günü saat 15:00’te evin arkasındaki bahçede buluşuyoruz. Tüm bina sakinleri içtenlikle davetlidir!',
      ],
      footerNoteDe:
        'Fragen? Schreiben Sie an frau.schneider@haus-koeln.de oder rufen Sie montags bis freitags (09:00 – 13:00 Uhr) an.',
      footerNoteTr:
        'Sorularınız mı var? frau.schneider@haus-koeln.de adresine yazabilir veya pazartesiden cumaya (09:00 – 13:00) telefon edebilirsiniz.',
      readAloudDe:
        'Aushang im Treppenhaus, Mozartstraße achtzehn. Liebe Nachbarinnen und Nachbarn! Erstens, neuer Fahrradplatz: Ab dem ersten Juni gibt es im Innenhof zwölf neue Plätze für Fahrräder. Bitte stellen Sie Ihr Fahrrad nicht mehr in den Flur, sondern in den Innenhof. Zweitens, Ruhezeit im Haus: Bitte achten Sie auf unsere gemeinsame Ruhezeit. Sie beginnt jeden Abend um zweiundzwanzig Uhr und endet morgens um sieben Uhr. Drittens, Nachbarschaftskaffee: Am Samstag, dem achten Juni, treffen wir uns um fünfzehn Uhr im Garten hinter dem Haus. Alle Bewohnerinnen und Bewohner sind herzlich eingeladen!',
    },
    glossary: [
      {
        id: 'gl-wo-1',
        german: 'Aushang',
        article: 'der',
        turkish: 'duyuru afişi, pano ilanı',
        noteTr: 'Apartman girişlerinde sıkça kullanılır.',
      },
      {
        id: 'gl-wo-2',
        german: 'Treppenhaus',
        article: 'das',
        turkish: 'merdiven boşluğu / apartman girişi',
        noteTr: 'das Haus → das Treppenhaus.',
      },
      {
        id: 'gl-wo-3',
        german: 'Innenhof',
        article: 'der',
        turkish: 'iç avlu',
        noteTr: 'Yönelme hâlinde: in den Innenhof.',
      },
      {
        id: 'gl-wo-4',
        german: 'Flur',
        article: 'der',
        turkish: 'koridor, antre',
        noteTr: 'Apartman ya da ev içi geçiş koridoru.',
      },
      {
        id: 'gl-wo-5',
        german: 'Ruhezeit',
        article: 'die',
        turkish: 'sessizlik saati',
        noteTr: 'Almanya’da apartman kurallarının temel kavramıdır.',
      },
      {
        id: 'gl-wo-6',
        german: 'Nachbar',
        article: 'der',
        turkish: 'komşu (erkek)',
        noteTr: 'Kadın biçimi: die Nachbarin.',
      },
    ],
    trueFalse: [
      {
        id: 'lesen-wohnung-tf-1',
        statementDe: 'Die Bewohner sollen ihre Fahrräder in den Flur stellen.',
        statementTr: 'Bina sakinleri bisikletlerini koridora koymalıdır.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Duyurunun 1. maddesinde bisikletlerin artık koridora değil iç avluya konulması isteniyor: "nicht mehr in den Flur, sondern in den Innenhof."',
      },
      {
        id: 'lesen-wohnung-tf-2',
        statementDe: 'Das Nachbarschaftskaffee findet am Samstag im Garten statt.',
        statementTr: 'Komşuluk kahvesi cumartesi günü bahçede yapılıyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). 3. maddede "Am Samstag, dem 8. Juni, treffen wir uns um 15:00 Uhr im Garten hinter dem Haus." yazıyor.',
      },
    ],
    cloze: [
      {
        id: 'lesen-wohnung-cl-1',
        promptDe: 'Bitte stellen Sie Ihr Fahrrad in den ___.',
        hintTr: 'Yeni bisiklet park alanının bulunduğu yer (artikelsiz eril isim)',
        options: ['Innenhof', 'Keller', 'Flur', 'Balkon'],
        correctOption: 'Innenhof',
        explanationTr:
          '1. maddeye göre yeni bisiklet yerleri iç avludadır ("in den Innenhof"). Dört seçenek de eril isimdir; metne uygun doğru sözcük "Innenhof"tur.',
      },
      {
        id: 'lesen-wohnung-cl-2',
        promptDe: 'Die Ruhezeit ___ jeden Abend um 22:00 Uhr.',
        hintTr: '"Başlamak" fiilinin 3. tekil şahıs çekimi',
        options: ['beginnt', 'endet', 'wohnt', 'kauft'],
        correctOption: 'beginnt',
        explanationTr:
          '2. maddede "Sie beginnt jeden Abend um 22:00 Uhr" (Her akşam saat 22:00’de başlar) ifadesi geçiyor.',
      },
    ],
    multipleChoice: [
      {
        id: 'lesen-wohnung-mc-1',
        questionTr: 'İç avluda bisikletler için kaç yeni yer oluşturulmuştur?',
        questionDe: 'Wie viele neue Fahrradplätze gibt es im Innenhof?',
        options: ['12 yeni yer', '8 yeni yer', '18 yeni yer', '7 yeni yer'],
        correctIndex: 0,
        explanationTr:
          'Duyurunun 1. maddesinde "gibt es im Innenhof zwölf neue Plätze für Fahrräder" (on iki yeni yer) bilgisi verilmiştir.',
      },
      {
        id: 'lesen-wohnung-mc-2',
        questionTr: 'Apartman yönetimiyle telefonla hangi günler ve saatlerde görüşülebilir?',
        questionDe: 'Wann kann man die Hausverwaltung anrufen?',
        options: [
          'Pazartesi–Cuma, 09:00 – 13:00 arası',
          'Her gün 07:00 – 22:00 arası',
          'Sadece Cumartesi saat 15:00’te',
          'Pazar günleri 10:00 – 14:00 arası',
        ],
        correctIndex: 0,
        explanationTr:
          'Duyurunun altındaki iletişim notunda "montags bis freitags (09:00 – 13:00 Uhr)" yazmaktadır.',
      },
    ],
  },
  {
    id: 'lesen-reisen',
    titleDe: 'Freizeit & Reisen',
    titleTr: 'Boş Zaman ve Gezi Notu',
    contextLabelTr: 'Hafta Sonu Gezi Mesajı · Heidelberg',
    subtitleTr: 'Clara’nın Deniz’e gönderdiği tren saatleri, peron numarası ve Heidelberg günlük gezi planı',
    format: 'note',
    estimatedMinutes: 3,
    imageUrl: imgAsset3,
    imageAlt: 'Almanya’da bölgesel tren penceresinden yeşil tepeler ve nehir manzarası ile masa üzerinde gezi defteri',
    document: {
      formatLabelTr: 'Kısa Mesaj ve Gezi Notu',
      formatLabelDe: 'Nachricht · Wochenendplan',
      metaRows: [
        {
          labelDe: 'Nachricht von:',
          valueDe: 'Clara an Deniz',
          valueTr: 'Mesaj: Clara’dan Deniz’e',
        },
        {
          labelDe: 'Hinfahrt:',
          valueDe: 'Sonntag, 08:45 Uhr · Zug RE 10 · Gleis 4',
          valueTr: 'Gidiş: Pazar, 08:45 · RE 10 Treni · Peron 4',
        },
        {
          labelDe: 'Rückfahrt:',
          valueDe: 'Sonntag, 18:20 Uhr ab Heidelberg Hbf',
          valueTr: 'Dönüş: Pazar, 18:20 Heidelberg Merkez Garı’ndan',
        },
      ],
      paragraphsDe: [
        'Hallo Deniz! Hier ist unser Plan für den Ausflug nach Heidelberg am Sonntag:',
        'Wir treffen uns um 08:30 Uhr vor der Bäckerei im Hauptbahnhof. Unser Zug RE 10 fährt pünktlich um 08:45 Uhr von Gleis 4 ab. Die Fahrt dauert nur eine Stunde und fünfzehn Minuten.',
        'Am Vormittag gehen wir durch die Altstadt und besuchen das berühmte Schloss. Mittags essen wir in einem kleinen Restaurant am Fluss Neckar.',
        'Vergiss bitte deine Kamera nicht! Ich nehme eine Regenjacke mit, weil das Wetter am Nachmittag vielleicht wolkig wird. Ich freue mich schon sehr!',
      ],
      paragraphsTr: [
        'Merhaba Deniz! Pazar günkü Heidelberg gezimiz için planımız burada:',
        'Saat 08:30’da merkez gardaki fırının önünde buluşuyoruz. RE 10 trenimiz tam 08:45’te 4. perondan kalkıyor. Yolculuk sadece bir saat on beş dakika sürüyor.',
        'Öğleden önce eski şehirde yürüyeceğiz ve ünlü şatoyu ziyaret edeceğiz. Öğlen Neckar Nehri kıyısında küçük bir restoranda yemek yiyeceğiz.',
        'Lütfen fotoğraf makineni unutma! Öğleden sonra hava belki bulutlu olabileceği için yanıma bir yağmurluk alıyorum. Şimdiden çok heyecanlıyım!',
      ],
      footerNoteDe: 'Tipp: Das Deutschlandticket gilt für den Regionalzug RE 10.',
      footerNoteTr: 'İpucu: Deutschlandticket bileti bölgesel RE 10 treninde geçerlidir.',
      readAloudDe:
        'Wochenendplan nach Heidelberg. Hallo Deniz! Hier ist unser Plan für den Ausflug nach Heidelberg am Sonntag. Wir treffen uns um acht Uhr dreißig vor der Bäckerei im Hauptbahnhof. Unser Zug R E zehn fährt pünktlich um acht Uhr fünfundvierzig von Gleis vier ab. Die Fahrt dauert nur eine Stunde und fünfzehn Minuten. Am Vormittag gehen wir durch die Altstadt und besuchen das berühmte Schloss. Mittags essen wir in einem kleinen Restaurant am Fluss Neckar. Vergiss bitte deine Kamera nicht! Ich nehme eine Regenjacke mit, weil das Wetter am Nachmittag vielleicht wolkig wird. Ich freue mich schon sehr!',
    },
    glossary: [
      {
        id: 'gl-re-1',
        german: 'Ausflug',
        article: 'der',
        turkish: 'günübirlik gezi',
        noteTr: 'Çoğulu: die Ausflüge.',
      },
      {
        id: 'gl-re-2',
        german: 'Hauptbahnhof',
        article: 'der',
        turkish: 'merkez tren garı (Hbf)',
        noteTr: 'Tabelalarda "Hbf" şeklinde kısaltılır.',
      },
      {
        id: 'gl-re-3',
        german: 'Gleis',
        article: 'das',
        turkish: 'peron, ray hattı',
        noteTr: 'Sayıyla artikelsiz kullanılır: von Gleis 4.',
      },
      {
        id: 'gl-re-4',
        german: 'abfahren',
        turkish: 'hareket etmek, kalkmak (taşıt)',
        noteTr: 'Ayrılabilen fiil: Der Zug fährt um 08:45 Uhr ab.',
      },
      {
        id: 'gl-re-5',
        german: 'Schloss',
        article: 'das',
        turkish: 'şato, saray',
        noteTr: 'Çoğulu: die Schlösser.',
      },
      {
        id: 'gl-re-6',
        german: 'Regenjacke',
        article: 'die',
        turkish: 'yağmurluk',
        noteTr: 'Akuzatifte belirsiz artikelle: eine Regenjacke.',
      },
    ],
    trueFalse: [
      {
        id: 'lesen-reisen-tf-1',
        statementDe: 'Clara und Deniz treffen sich um 08:30 Uhr vor der Bäckerei im Hauptbahnhof.',
        statementTr: 'Clara ve Deniz saat 08:30’da merkez gardaki fırının önünde buluşuyorlar.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Mesajda "Wir treffen uns um 08:30 Uhr vor der Bäckerei im Hauptbahnhof." ifadesi yer alıyor.',
      },
      {
        id: 'lesen-reisen-tf-2',
        statementDe: 'Die Zugfahrt nach Heidelberg dauert drei Stunden.',
        statementTr: 'Heidelberg’e tren yolculuğu üç saat sürüyor.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Metinde yolculuğun sadece bir saat on beş dakika sürdüğü belirtiliyor: "Die Fahrt dauert nur eine Stunde und fünfzehn Minuten."',
      },
    ],
    cloze: [
      {
        id: 'lesen-reisen-cl-1',
        promptDe: 'Der Zug RE 10 fährt pünktlich um 08:45 Uhr von ___ 4 ab.',
        hintTr: 'Trenin kalktığı peron sözcüğü (sayıdan önce artikelsiz biçim)',
        options: ['Gleis', 'Stock', 'Platz', 'Weg'],
        correctOption: 'Gleis',
        explanationTr:
          'Tren peronları Almancada "Gleis" sözcüğüyle ve sayıdan önce artikelsiz ifade edilir: "von Gleis 4".',
      },
      {
        id: 'lesen-reisen-cl-2',
        promptDe: 'Clara nimmt ___ Regenjacke mit.',
        hintTr: '"die Regenjacke" ismi için akuzatif belirsiz artikel',
        options: ['eine', 'einen', 'ein', 'einer'],
        correctOption: 'eine',
        explanationTr:
          '"mitnehmen" fiili akuzatif alır ve "die Regenjacke" dişil bir isimdir; bu nedenle doğru belirsiz artikel "eine" olur.',
      },
    ],
    multipleChoice: [
      {
        id: 'lesen-reisen-mc-1',
        questionTr: 'Clara ve Deniz öğle yemeğini nerede yemeyi planlıyor?',
        questionDe: 'Wo möchten Clara und Deniz zu Mittag essen?',
        options: [
          'Neckar Nehri kıyısında küçük bir restoranda',
          'Merkez gardaki fırında',
          'Bölgesel RE 10 treninin içinde',
          'Heidelberg Şatosu’nun bahçesinde',
        ],
        correctIndex: 0,
        explanationTr:
          'Metinde "Mittags essen wir in einem kleinen Restaurant am Fluss Neckar." (Öğlen Neckar Nehri kıyısında küçük bir restoranda yiyoruz) bilgisi geçiyor.',
      },
      {
        id: 'lesen-reisen-mc-2',
        questionTr: 'Dönüş treni Heidelberg Merkez Garı’ndan saat kaçta kalkıyor?',
        questionDe: 'Wann fährt der Zug zurück?',
        options: ['18:20’de', '08:45’te', '15:00’te', '19:45’te'],
        correctIndex: 0,
        explanationTr:
          'Gezi notunun üst bilgisinde "Rückfahrt: Sonntag, 18:20 Uhr ab Heidelberg Hbf" olarak belirtilmiştir.',
      },
    ],
  },
];

export const TOTAL_READING_EXERCISES: number = GERMAN_A1_READING_SCENARIOS.reduce(
  (sum, scenario) =>
    sum + scenario.trueFalse.length + scenario.cloze.length + scenario.multipleChoice.length,
  0
);

export function getReadingScenarioById(id: string): ReadingScenario {
  return (
    GERMAN_A1_READING_SCENARIOS.find((s) => s.id === id) ??
    GERMAN_A1_READING_SCENARIOS[0]
  );
}

export function getReadingScenarioExerciseIds(scenario: ReadingScenario): string[] {
  return [
    ...scenario.trueFalse.map((q) => q.id),
    ...scenario.cloze.map((q) => q.id),
    ...scenario.multipleChoice.map((q) => q.id),
  ];
}
