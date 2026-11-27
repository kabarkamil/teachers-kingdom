import imgAsset1 from '../assets/images/schreiben_alltag_form_1795381151843.jpg';
import imgAsset2 from '../assets/images/schreiben_cafe_note_1795381152069.jpg';
import imgAsset3 from '../assets/images/schreiben_reisen_plan_1795381151946.jpg';
import imgAsset4 from '../assets/images/schreiben_wohnung_note_1795381152123.jpg';
import type { WritingScenario } from '../types';

const W = '[A-Za-zÄÖÜäöüß]';
const WB_START = `(?<!${W})`;
const WB_END = `(?!${W})`;

export const GERMAN_A1_WRITING_SCENARIOS: WritingScenario[] = [
  {
    id: 'schreiben-alltag',
    titleDe: 'Vorstellung & Sprachkurs',
    titleTr: 'Tanışma ve Dil Kursu Kaydı',
    contextLabelTr: 'Günlük Yaşam · Kayıt & E-Posta',
    subtitleTr: 'Dil kursu kayıt formu, yeni sınıf arkadaşına kısa tanışma mesajı ve A1 cümle kurma.',
    estimatedMinutes: 6,
    imageUrl: imgAsset1,
    imageAlt: 'Ahşap çalışma masasında dil kursu kayıt formu, defter ve dolma kalem',
    formTask: {
      id: 'schreiben-alltag-form',
      titleDe: 'Anmeldeformular — Sprachschule Nord',
      titleTr: 'Kayıt Formu — Kuzey Dil Okulu',
      situationDe:
        'Dein Freund Mert Kaya (24 Jahre alt) wohnt in Hamburg, in der Parkstraße 12. Er möchte am Montag um 18:00 Uhr den Deutschkurs A1 besuchen. Füll bitte das Formular für ihn aus.',
      situationTr:
        'Arkadaşın Mert Kaya (24 yaşında) Hamburg’da, Parkstraße 12 adresinde yaşıyor. Pazartesi günü saat 18:00’de Almanca A1 kursuna katılmak istiyor. Lütfen onun için formu doldur.',
      fields: [
        {
          id: 'alltag-f1',
          labelDe: 'Familienname',
          labelTr: 'Soyadı',
          placeholderDe: 'z. B. Weber',
          acceptedValues: ['Kaya'],
          canonicalValue: 'Kaya',
          caseSensitiveCapitalization: true,
          tipTr: 'Metindeki soyadını baş harfi büyük olacak şekilde yazın (Kaya).',
        },
        {
          id: 'alltag-f2',
          labelDe: 'Wohnort (Stadt)',
          labelTr: 'Yaşadığı Şehir',
          placeholderDe: 'z. B. München',
          acceptedValues: ['Hamburg'],
          canonicalValue: 'Hamburg',
          caseSensitiveCapitalization: true,
          tipTr: 'Şehir adını büyük harfle başlayarak yazın (Hamburg).',
        },
        {
          id: 'alltag-f3',
          labelDe: 'Kurstag',
          labelTr: 'Kurs Günü',
          placeholderDe: 'z. B. Dienstag',
          acceptedValues: ['Montag', 'am Montag'],
          canonicalValue: 'Montag',
          caseSensitiveCapitalization: true,
          tipTr: 'Almancada gün adları isimdir ve büyük harfle yazılır (Montag).',
        },
        {
          id: 'alltag-f4',
          labelDe: 'Kursniveau',
          labelTr: 'Kurs Seviyesi',
          placeholderDe: 'z. B. A2',
          acceptedValues: ['A1', 'Deutsch A1', 'Deutschkurs A1'],
          canonicalValue: 'A1',
          caseSensitiveCapitalization: false,
          tipTr: 'Metindeki seviye bilgisini yazın (A1).',
        },
      ],
    },
    messageTask: {
      id: 'schreiben-alltag-message',
      formatLabelDe: 'Kurze E-Mail · Vorstellung',
      formatLabelTr: 'Kısa Tanışma E-Postası',
      titleDe: 'Neue Kurskollegin: Anna',
      titleTr: 'Yeni Sınıf Arkadaşına Tanışma Mesajı',
      promptDe:
        'Du besuchst einen neuen Deutschkurs in Hamburg. Schreib eine kurze E-Mail (ca. 20–35 Wörter) an deine neue Kurskollegin Anna: 1) Begrüße Anna. 2) Stell dich kurz vor (Name und Wohnort/Herkunft). 3) Schreib, wann ihr euch im Kurs trefft oder wann der Kurs beginnt. 4) Schreib einen passenden Gruß am Ende.',
      promptTr:
        'Hamburg’da yeni bir Almanca kursuna katılıyorsun. Yeni sınıf arkadaşın Anna’ya kısa bir e-posta (yaklaşık 20–35 sözcük) yaz: 1) Anna’yı selamla. 2) Kendini kısaca tanıt (adın ve yaşadığın yer/memleket). 3) Kursta ne zaman buluşacağınızı veya kursun ne zaman başladığını yaz. 4) Sona uygun bir kapanış/selam ekle.',
      minWords: 18,
      bullets: [
        {
          id: 'alltag-b1',
          labelDe: 'Anrede / Begrüßung an Anna (z. B. Hallo Anna, Liebe Anna)',
          labelTr: 'Anna’ya selamlama (ör. Hallo Anna, Liebe Anna)',
          requiredSubConditions: [
            {
              id: 'alltag-b1-greeting',
              labelTr: 'Selamlama ifadesi',
              pattern: `${WB_START}(?:hallo|liebe|guten\\s+tag|hi|hey)${WB_END}`,
              missingHintTr: '"Hallo", "Liebe" veya "Guten Tag" gibi bir selamlama ekleyin.',
            },
            {
              id: 'alltag-b1-addressee',
              labelTr: 'Muhatap adı (Anna)',
              pattern: `${WB_START}anna${WB_END}`,
              missingHintTr: 'Mesajı kime yazdığınızı belirtin ("Hallo Anna,").',
            },
          ],
          hintTr: 'Mesajına "Hallo Anna," veya "Liebe Anna," ile başla.',
        },
        {
          id: 'alltag-b2',
          labelDe: 'Vorstellung: Name UND Wohnort/Herkunft',
          labelTr: 'Kendini tanıtma: ad VE şehir/ülke (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'alltag-b2-name',
              labelTr: 'Ad / kendini tanıtma',
              pattern: `${WB_START}(?:ich\\s+heiße|ich\\s+heisse|mein\\s+name\\s+ist|ich\\s+bin)\\s+${W}{2,}`,
              missingHintTr: 'Adınızı belirtin (ör. "Ich heiße Mert" veya "Mein Name ist …").',
            },
            {
              id: 'alltag-b2-location',
              labelTr: 'Yaşanan yer veya memleket',
              pattern: `${WB_START}(?:(?:ich\\s+)?(?:wohne|lebe)\\s+(?:jetzt\\s+|nun\\s+|hier\\s+)?in\\s+${W}{2,}|(?:ich\\s+)?komme\\s+aus\\s+(?:der\\s+|dem\\s+|den\\s+)?${W}{2,})`,
              missingHintTr:
                'Yaşadığınız şehri veya memleketinizi de ekleyin (ör. "Ich wohne in Hamburg" veya "Ich komme aus der Türkei").',
            },
          ],
          hintTr: 'Hem adını ("Ich heiße …") hem de yaşadığın yeri/memleketini ("Ich wohne in …" / "Ich komme aus …") birlikte yaz.',
        },
        {
          id: 'alltag-b3',
          labelDe: 'Kurs & Zeitpunkt (z. B. Kurs beginnt am Montag um 18 Uhr)',
          labelTr: 'Kurs/buluşma bağlamı VE gün/saat bilgisi',
          requiredSubConditions: [
            {
              id: 'alltag-b3-context',
              labelTr: 'Kurs veya buluşma ifadesi',
              pattern: `${WB_START}(?:kurs|deutschkurs|sprachkurs|treffen|beginnt|startet|sehen\\s+uns|unterricht)${WB_END}`,
              missingHintTr: 'Kursun başlamasından veya buluşmadan bahsedin (ör. "Der Kurs beginnt …").',
            },
            {
              id: 'alltag-b3-time',
              labelTr: 'Gün veya saat bilgisi',
              pattern: `${WB_START}(?:montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|uhr|abends|morgens)${WB_END}|\\b\\d{1,2}[:.]\\d{2}\\b`,
              missingHintTr: 'Somut bir gün veya saat ekleyin (ör. "am Montag", "um 18:00 Uhr").',
            },
          ],
          hintTr: 'Kurs veya buluşma için hem bağlamı hem de gün/saati yaz (ör. "Der Kurs beginnt am Montag um 18 Uhr.").',
        },
        {
          id: 'alltag-b4',
          labelDe: 'Abschied / Grußformel (z. B. Viele Grüße, Bis bald)',
          labelTr: 'Kapanış ve vedalaşma (ör. Viele Grüße, Bis bald)',
          requiredSubConditions: [
            {
              id: 'alltag-b4-closing',
              labelTr: 'Kapanış selamı',
              pattern: `${WB_START}(?:viele\\s+grüße|viele\\s+gruesse|liebe\\s+grüße|liebe\\s+gruesse|schöne\\s+grüße|beste\\s+grüße|mit\\s+freundlichen\\s+grüßen|bis\\s+bald|bis\\s+montag|bis\\s+morgen|tschüss|tschüß)${WB_END}`,
              missingHintTr: 'E-postanın sonuna "Viele Grüße," veya "Bis bald," ekleyin.',
            },
          ],
          hintTr: 'E-postanın sonuna "Viele Grüße," veya "Bis bald," ve adını ekle.',
        },
      ],
      nounCapitalizationTargets: [
        'Name',
        'Kurs',
        'Deutschkurs',
        'Montag',
        'Dienstag',
        'Uhr',
        'Stadt',
        'Türkei',
        'Deutschland',
        'Hamburg',
        'Berlin',
        'Grüße',
      ],
      pitfallRules: [
        {
          id: 'alltag-p1',
          pattern: `${WB_START}in\\s+(?:montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)${WB_END}`,
          messageTr: 'Günlerle "in" değil "am" edatı kullanılır: ör. "am Montag".',
        },
        {
          id: 'alltag-p2',
          pattern: `${WB_START}ein\\s+(?:deutschkurs|sprachkurs|kurs)${WB_END}`,
          messageTr:
            '"der Kurs / der Deutschkurs" eril (maskulin) olduğu için "besuchen / machen" fiilleriyle Akkusativ "einen Deutschkurs" kullanılır.',
        },
      ],
      phrases: [
        { id: 'al-r1', german: 'Hallo Anna, / Liebe Anna,', turkish: 'Merhaba Anna, / Sevgili Anna,', categoryTr: 'Selamlama' },
        { id: 'al-r2', german: 'Ich heiße … und komme aus …', turkish: 'Benim adım … ve …’den geliyorum.', categoryTr: 'Tanıtma' },
        { id: 'al-r3', german: 'Ich wohne jetzt in Hamburg.', turkish: 'Şimdi Hamburg’da yaşıyorum.', categoryTr: 'Adres / Şehir' },
        { id: 'al-r4', german: 'Der Kurs beginnt am Montag um 18 Uhr.', turkish: 'Kurs pazartesi saat 18’de başlıyor.', categoryTr: 'Zaman' },
        { id: 'al-r5', german: 'Wir sehen uns im Kurs!', turkish: 'Kursta görüşürüz!', categoryTr: 'Buluşma' },
        { id: 'al-r6', german: 'Viele Grüße, / Bis bald,', turkish: 'Çok selamlar, / Yakında görüşmek üzere,', categoryTr: 'Kapanış' },
      ],
      modelAnswerDe:
        'Hallo Anna, ich heiße Mert und ich komme aus der Türkei. Ich wohne jetzt in Hamburg und lerne Deutsch. Unser Kurs beginnt am Montag um 18:00 Uhr. Ich freue mich auf den Kurs! Viele Grüße, Mert',
      modelAnswerTr:
        'Merhaba Anna, benim adım Mert ve Türkiye’den geliyorum. Şimdi Hamburg’da yaşıyorum ve Almanca öğreniyorum. Kursumuz pazartesi saat 18:00’de başlıyor. Kurs için seviniyorum! Çok selamlar, Mert',
    },
    controlledItems: [
      {
        id: 'schreiben-alltag-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Bilde einen korrekten A1-Aussagesatz.',
        instructionTr: 'Doğru bir Almanca A1 düz cümlesi oluşturun ("Her gün Almanca öğreniyorum.").',
        tokens: ['jeden Tag', 'lerne', 'Ich', 'Deutsch', '.'],
        acceptedSentencesDe: ['Ich lerne jeden Tag Deutsch.', 'Jeden Tag lerne ich Deutsch.'],
        canonicalSentenceDe: 'Ich lerne jeden Tag Deutsch.',
        explanationTr:
          'Almanca düz cümlelerde çekimli fiil (lerne) her zaman 2. konumda yer alır: "Ich lerne jeden Tag Deutsch."',
      },
      {
        id: 'schreiben-alltag-ctrl-2',
        kind: 'satzbau',
        instructionDe: 'Ordne die Wörter zu einer höflichen Frage.',
        instructionTr: 'Sözcükleri kibar bir A1 sorusu olacak şekilde sıralayın ("Hangi ülkeden geliyorsunuz?").',
        tokens: ['Sie', 'kommen', 'Aus welchem Land', '?'],
        acceptedSentencesDe: ['Aus welchem Land kommen Sie?'],
        canonicalSentenceDe: 'Aus welchem Land kommen Sie?',
        explanationTr:
          'Soru öbeği ("Aus welchem Land") 1. konumdadır; çekimli fiil ("kommen") 2. konumda, özne ("Sie") hemen ardından gelir.',
      },
      {
        id: 'schreiben-alltag-ctrl-3',
        kind: 'cloze-typed',
        beforeBlankDe: 'Ich besuche am Montag',
        afterBlankDe: 'Deutschkurs.',
        hintTr: 'Belirsiz artikel (der Deutschkurs · Akkusativ)',
        acceptedAnswers: ['einen'],
        canonicalAnswer: 'einen',
        caseArticleHints: [
          {
            wrongValue: 'ein',
            messageTr:
              '"der Deutschkurs" eril (maskulin) bir isimdir ve "besuchen" fiiliyle Akkusativ alır: "ein" değil "einen".',
          },
          {
            wrongValue: 'eine',
            messageTr:
              '"eine" dişil (die) isimler içindir. "der Deutschkurs" eril olduğu için Akkusativ durumda "einen" gerekir.',
          },
          {
            wrongValue: 'der',
            messageTr:
              'Belirli artikel kullanılacaksa bile Akkusativ eril biçim "den" olur; belirsiz artikel hedefimiz "einen".',
          },
        ],
        explanationTr:
          '"besuchen" fiili Akkusativ nesne alır. Eril isimlerde (der Deutschkurs) belirsiz artikel "einen" olur.',
      },
    ],
  },
  {
    id: 'schreiben-speisekarte',
    titleDe: 'Einkaufen & Café',
    titleTr: 'Alışveriş ve Kafe Rezervasyonu',
    contextLabelTr: 'Yeme-İçme · Rezervasyon & Sipariş',
    subtitleTr: 'Kafe masa rezervasyon formu, kısa sipariş/rezervasyon notu ve Akkusativ artikel yazımı.',
    estimatedMinutes: 6,
    imageUrl: imgAsset2,
    imageAlt: 'Kafe masasında rezervasyon kartı, kapuçino ve elmalı turta dilimi',
    formTask: {
      id: 'schreiben-speisekarte-form',
      titleDe: 'Tischreservierung — Café Lindenhof',
      titleTr: 'Masa Rezervasyon Formu — Café Lindenhof',
      situationDe:
        'Sarah Weber möchte am Samstag um 15:00 Uhr einen Tisch für 4 Personen im Café Lindenhof reservieren. Sie bestellt gerne Kaffee und Apfelkuchen.',
      situationTr:
        'Sarah Weber cumartesi günü saat 15:00’te Café Lindenhof’ta 4 kişilik bir masa ayırtmak istiyor. Kahve ve elmalı turta sipariş etmeyi seviyor.',
      fields: [
        {
          id: 'cafe-f1',
          labelDe: 'Name',
          labelTr: 'Ad Soyad',
          placeholderDe: 'z. B. Lukas Bauer',
          acceptedValues: ['Sarah Weber', 'Weber'],
          canonicalValue: 'Sarah Weber',
          caseSensitiveCapitalization: true,
          tipTr: 'Rezervasyon sahibinin adını yazın (Sarah Weber).',
        },
        {
          id: 'cafe-f2',
          labelDe: 'Wochentag',
          labelTr: 'Haftanın Günü',
          placeholderDe: 'z. B. Sonntag',
          acceptedValues: ['Samstag', 'am Samstag'],
          canonicalValue: 'Samstag',
          caseSensitiveCapitalization: true,
          tipTr: 'Metindeki günü büyük harfle başlayarak yazın (Samstag).',
        },
        {
          id: 'cafe-f3',
          labelDe: 'Uhrzeit',
          labelTr: 'Saat',
          placeholderDe: 'z. B. 14:30',
          acceptedValues: ['15:00', '15:00 Uhr', '15 Uhr'],
          canonicalValue: '15:00 Uhr',
          caseSensitiveCapitalization: true,
          tipTr: 'Saati "15:00" veya büyük U ile "15:00 Uhr" şeklinde yazın.',
        },
        {
          id: 'cafe-f4',
          labelDe: 'Anzahl der Personen',
          labelTr: 'Kişi Sayısı',
          placeholderDe: 'z. B. 2',
          acceptedValues: ['4', '4 Personen', 'vier', 'vier Personen'],
          canonicalValue: '4',
          caseSensitiveCapitalization: true,
          tipTr: 'Kaç kişilik masa istendiğini yazın ("4" veya "4 Personen").',
        },
      ],
    },
    messageTask: {
      id: 'schreiben-speisekarte-message',
      formatLabelDe: 'Kurze Nachricht · Café-Reservierung',
      formatLabelTr: 'Kafe Rezervasyon Mesajı',
      titleDe: 'Nachricht an das Café Lindenhof',
      titleTr: 'Café Lindenhof’a Kısa Mesaj',
      promptDe:
        'Du möchtest am Samstag mit Freunden ins Café Lindenhof gehen. Schreib eine kurze Nachricht (ca. 20–35 Wörter): 1) Begrüße das Café-Team höflich. 2) Schreib, dass du einen Tisch reservieren möchtest (wie viele Personen). 3) Nenne Tag und Uhrzeit. 4) Bedanke dich und schreib einen freundlichen Gruß.',
      promptTr:
        'Cumartesi günü arkadaşlarınla Café Lindenhof’a gitmek istiyorsun. Kısa bir mesaj (yaklaşık 20–35 sözcük) yaz: 1) Kafe ekibini kibarca selamla. 2) Kaç kişilik bir masa ayırtmak istediğini yaz. 3) Gün ve saati belirt. 4) Teşekkür et ve nazik bir kapanış yaz.',
      minWords: 18,
      bullets: [
        {
          id: 'cafe-b1',
          labelDe: 'Höfliche Anrede (z. B. Guten Tag, Hallo Café-Team)',
          labelTr: 'Nazik selamlama (ör. Guten Tag, Sehr geehrte Damen und Herren)',
          requiredSubConditions: [
            {
              id: 'cafe-b1-greeting',
              labelTr: 'Nazik selamlama',
              pattern: `${WB_START}(?:guten\\s+tag|guten\\s+morgen|hallo|sehr\\s+geehrte|liebes\\s+team|liebes\\s+café)${WB_END}`,
              missingHintTr: '"Guten Tag," veya "Hallo Café-Team," ile başlayın.',
            },
          ],
          hintTr: '"Guten Tag," veya "Hallo Café-Team," ile başlayabilirsin.',
        },
        {
          id: 'cafe-b2',
          labelDe: 'Wunsch: Tisch reservieren UND Personenzahl',
          labelTr: 'Masa rezervasyon talebi VE kişi sayısı (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'cafe-b2-reservation',
              labelTr: 'Masa rezervasyon isteği',
              pattern: `${WB_START}(?:reservieren|reserviere|reservierung|tisch\\s+.*(?:frei|buchen|reservieren)|(?:einen\\s+|den\\s+)?tisch)${WB_END}`,
              missingHintTr: 'Masa ayırtmak istediğinizi açıkça yazın (ör. "einen Tisch reservieren").',
            },
            {
              id: 'cafe-b2-guests',
              labelTr: 'Kişi sayısı (ör. für 4 Personen)',
              pattern: `${WB_START}(?:für\\s+(?:[1-9]\\d*|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn)|(?:[1-9]\\d*|zwei|drei|vier|fünf|sechs|sieben|acht)\\s+(?:personen|leute|gäste)|zu\\s+(?:zweit|dritt|viert|fünft))${WB_END}`,
              missingHintTr: 'Kaç kişilik masa istediğinizi belirtin (ör. "für 4 Personen").',
            },
          ],
          hintTr: 'Hem masa rezervasyonunu hem de kişi sayısını yaz ("Ich möchte einen Tisch für 4 Personen reservieren.").',
        },
        {
          id: 'cafe-b3',
          labelDe: 'Tag UND Uhrzeit (z. B. am Samstag um 15:00 Uhr)',
          labelTr: 'Gün VE saat bilgisi (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'cafe-b3-day',
              labelTr: 'Gün bilgisi',
              pattern: `${WB_START}(?:montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|morgen|heute|wochenende)${WB_END}`,
              missingHintTr: 'Hangi gün geleceğinizi yazın (ör. "am Samstag").',
            },
            {
              id: 'cafe-b3-clock',
              labelTr: 'Saat bilgisi',
              pattern: `\\b\\d{1,2}[:.]\\d{2}\\b|${WB_START}(?:um\\s+)?(?:[1-9]|1\\d|2[0-4]|eins|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|zwanzig)\\s*uhr${WB_END}`,
              missingHintTr: 'Saati de ekleyin (ör. "um 15:00 Uhr" veya "um 15 Uhr").',
            },
          ],
          hintTr: 'Hem günü hem de saati birlikte yaz (ör. "am Samstag um 15:00 Uhr").',
        },
        {
          id: 'cafe-b4',
          labelDe: 'Dank UND Grußformel (z. B. Vielen Dank & Mit freundlichen Grüßen)',
          labelTr: 'Teşekkür VE kapanış selamı (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'cafe-b4-thanks',
              labelTr: 'Teşekkür ifadesi',
              pattern: `${WB_START}(?:danke|vielen\\s+dank|herzlichen\\s+dank|besten\\s+dank|bedanke)${WB_END}`,
              missingHintTr: 'Teşekkür ekleyin (ör. "Vielen Dank").',
            },
            {
              id: 'cafe-b4-closing',
              labelTr: 'Kapanış selamı',
              pattern: `${WB_START}(?:mit\\s+freundlichen\\s+grüßen|mit\\s+freundlichen\\s+gruessen|freundliche\\s+grüße|viele\\s+grüße|viele\\s+gruesse|liebe\\s+grüße|liebe\\s+gruesse|beste\\s+grüße|schöne\\s+grüße)${WB_END}`,
              missingHintTr: 'Nazik bir kapanış ekleyin (ör. "Mit freundlichen Grüßen," veya "Viele Grüße,").',
            },
          ],
          hintTr: 'Hem teşekkür ("Vielen Dank") hem de kapanış selamı ("Mit freundlichen Grüßen,") ekle.',
        },
      ],
      nounCapitalizationTargets: [
        'Tisch',
        'Samstag',
        'Sonntag',
        'Personen',
        'Uhr',
        'Kaffee',
        'Kuchen',
        'Apfelkuchen',
        'Dank',
        'Grüße',
        'Grüßen',
      ],
      pitfallRules: [
        {
          id: 'cafe-p1',
          pattern: `${WB_START}ein\\s+(?:tisch|kaffee|apfelkuchen|kuchen|tee)${WB_END}`,
          messageTr:
            'Eril (der) isimler "möchte / bestelle / reserviere" ile Akkusativ alır: "ein Tisch / ein Kaffee" değil, "einen Tisch / einen Kaffee".',
        },
        {
          id: 'cafe-p2',
          pattern: `${WB_START}in\\s+(?:samstag|sonntag|freitag|montag|dienstag|mittwoch|donnerstag)${WB_END}`,
          messageTr: 'Günlerle "in" değil "am" kullanılır: ör. "am Samstag".',
        },
      ],
      phrases: [
        { id: 'cf-r1', german: 'Guten Tag,', turkish: 'İyi günler,', categoryTr: 'Selamlama' },
        { id: 'cf-r2', german: 'Ich möchte gern einen Tisch für 4 Personen reservieren.', turkish: '4 kişilik bir masa ayırtmak istiyorum.', categoryTr: 'Rezervasyon' },
        { id: 'cf-r3', german: 'Wir kommen am Samstag um 15:00 Uhr.', turkish: 'Cumartesi saat 15:00’te geliyoruz.', categoryTr: 'Zaman' },
        { id: 'cf-r4', german: 'Haben Sie noch einen Tisch frei?', turkish: 'Boş masanız var mı?', categoryTr: 'Soru' },
        { id: 'cf-r5', german: 'Vielen Dank im Voraus!', turkish: 'Şimdiden çok teşekkürler!', categoryTr: 'Teşekkür' },
        { id: 'cf-r6', german: 'Mit freundlichen Grüßen,', turkish: 'Saygılarımla,', categoryTr: 'Kapanış' },
      ],
      modelAnswerDe:
        'Guten Tag, ich möchte gern einen Tisch für 4 Personen reservieren. Wir kommen am Samstag um 15:00 Uhr ins Café Lindenhof. Haben Sie noch Platz? Vielen Dank und mit freundlichen Grüßen, Sarah Weber',
      modelAnswerTr:
        'İyi günler, 4 kişilik bir masa ayırtmak istiyorum. Cumartesi günü saat 15:00’te Café Lindenhof’a geliyoruz. Hâlâ yeriniz var mı? Çok teşekkürler ve saygılarımla, Sarah Weber',
    },
    controlledItems: [
      {
        id: 'schreiben-speisekarte-ctrl-1',
        kind: 'cloze-typed',
        beforeBlankDe: 'Ich bestelle',
        afterBlankDe: 'Apfelkuchen und ein Wasser.',
        hintTr: 'Akkusativ belirsiz artikel (der Apfelkuchen)',
        acceptedAnswers: ['einen'],
        canonicalAnswer: 'einen',
        caseArticleHints: [
          {
            wrongValue: 'ein',
            messageTr:
              '"der Apfelkuchen" eril (maskulin) bir isimdir. "bestellen" fiili Akkusativ istediği için "einen" yazılmalıdır.',
          },
          {
            wrongValue: 'eine',
            messageTr:
              '"eine" yalnızca dişil (die) isimler içindir. "der Apfelkuchen" eril olduğu için "einen" gerekir.',
          },
        ],
        explanationTr:
          '"bestellen" fiili Akkusativ alır; eril isimlerde (der Apfelkuchen) belirsiz artikel "einen" olarak çekimlenir.',
      },
      {
        id: 'schreiben-speisekarte-ctrl-2',
        kind: 'cloze-typed',
        beforeBlankDe: 'Am Morgen trinke ich gern einen heißen',
        afterBlankDe: '.',
        hintTr: 'İsim: kahve (Almancada isimlerin baş harfine dikkat!)',
        acceptedAnswers: ['Kaffee'],
        canonicalAnswer: 'Kaffee',
        requiresCapitalizedNoun: true,
        disallowLeadingArticle: true,
        explanationTr:
          'Boşluktan önce "einen heißen" bulunduğu için artikel tekrarlanmaz; "Kaffee" isim olduğu için büyük K ile yazılır.',
      },
      {
        id: 'schreiben-speisekarte-ctrl-3',
        kind: 'satzbau',
        instructionDe: 'Bilde eine höfliche Frage nach dem Preis.',
        instructionTr: 'Fiyat soran kibar bir A1 cümlesi oluşturun ("Bir dilim elmalı turta ne kadar?").',
        tokens: ['kostet', 'Wie viel', 'ein Stück Apfelkuchen', '?'],
        acceptedSentencesDe: ['Wie viel kostet ein Stück Apfelkuchen?'],
        canonicalSentenceDe: 'Wie viel kostet ein Stück Apfelkuchen?',
        explanationTr:
          'Soru sözcüğü ("Wie viel") 1. konumdadır; fiil ("kostet") 2. konumda yer alır.',
      },
    ],
  },
  {
    id: 'schreiben-wohnung',
    titleDe: 'Wohnung & Nachbarschaft',
    titleTr: 'Ev ve Komşuya Kısa Not',
    contextLabelTr: 'Ev Yaşamı · Bildirim & Komşu Notu',
    subtitleTr: 'Apartman bildirim formu, komşuya paket notu yazma ve mekan/ev cümle alıştırmaları.',
    estimatedMinutes: 6,
    imageUrl: imgAsset4,
    imageAlt: 'Apartman giriş masasında el yazısı not kartı, anahtarlar ve kargo paketi',
    formTask: {
      id: 'schreiben-wohnung-form',
      titleDe: 'Hausverwaltung — Paket- & Kontaktzettel',
      titleTr: 'Bina Yönetimi — Paket ve İletişim Formu',
      situationDe:
        'Frau Demir wohnt in der Blumenstraße 8, im 2. Stock (Wohnung 6). Am Donnerstag bekommt sie ein Paket. Ihr Nachbar Herr Klein nimmt das Paket an.',
      situationTr:
        'Bayan Demir Blumenstraße 8 adresinde, 2. katta (Daire 6) oturuyor. Perşembe günü bir paketi gelecek. Komşusu Bay Klein paketi teslim alacak.',
      fields: [
        {
          id: 'wohnung-f1',
          labelDe: 'Straße und Hausnummer',
          labelTr: 'Sokak ve Bina Numarası',
          placeholderDe: 'z. B. Hauptstraße 4',
          acceptedValues: ['Blumenstraße 8', 'Blumenstrasse 8'],
          canonicalValue: 'Blumenstraße 8',
          caseSensitiveCapitalization: true,
          tipTr: 'Metindeki sokak adı ve kapı numarasını büyük harfle başlayarak yazın (Blumenstraße 8).',
        },
        {
          id: 'wohnung-f2',
          labelDe: 'Stockwerk / Etage',
          labelTr: 'Kat',
          placeholderDe: 'z. B. 1. Stock',
          acceptedValues: ['2. Stock', '2', '2.'],
          canonicalValue: '2. Stock',
          caseSensitiveCapitalization: true,
          tipTr: 'Kaçıncı kat olduğunu yazın ("2" veya büyük S ile "2. Stock").',
        },
        {
          id: 'wohnung-f3',
          labelDe: 'Liefertag',
          labelTr: 'Teslimat Günü',
          placeholderDe: 'z. B. Mittwoch',
          acceptedValues: ['Donnerstag', 'am Donnerstag'],
          canonicalValue: 'Donnerstag',
          caseSensitiveCapitalization: true,
          tipTr: 'Günü büyük harfle başlayarak yazın (Donnerstag).',
        },
        {
          id: 'wohnung-f4',
          labelDe: 'Nachbar (Annahme)',
          labelTr: 'Teslim Alan Komşu',
          placeholderDe: 'z. B. Herr Braun',
          acceptedValues: ['Herr Klein', 'Klein'],
          canonicalValue: 'Herr Klein',
          caseSensitiveCapitalization: true,
          tipTr: 'Komşunun soyadını yazın (Herr Klein).',
        },
      ],
    },
    messageTask: {
      id: 'schreiben-wohnung-message',
      formatLabelDe: 'Notiz für den Nachbarn',
      formatLabelTr: 'Komşuya Kısa Not',
      titleDe: 'Paket für Frau Demir',
      titleTr: 'Komşuya Paket Teslim Notu',
      promptDe:
        'Du hast ein Paket für deine Nachbarin Frau Demir angenommen. Schreib eine kurze Notiz (ca. 18–35 Wörter) für ihren Briefkasten: 1) Begrüße Frau Demir. 2) Schreib, dass ihr Paket bei dir ist. 3) Schreib, wann sie das Paket abholen kann (z. B. heute ab 18 Uhr). 4) Schreib einen freundlichen Gruß und deinen Namen.',
      promptTr:
        'Komşun Bayan Demir için bir kargo paketi teslim aldın. Posta kutusuna bırakmak için kısa bir not (yaklaşık 18–35 sözcük) yaz: 1) Bayan Demir’i selamla. 2) Paketinin sende olduğunu belirt. 3) Paketi ne zaman alabileceğini yaz (ör. bugün saat 18’den sonra). 4) Nazik bir kapanış ve adını ekle.',
      minWords: 18,
      bullets: [
        {
          id: 'wohnung-b1',
          labelDe: 'Anrede an Frau Demir (z. B. Hallo Frau Demir)',
          labelTr: 'Bayan Demir’e selamlama (selam + muhatap adı)',
          requiredSubConditions: [
            {
              id: 'wohnung-b1-greeting',
              labelTr: 'Selamlama ifadesi',
              pattern: `${WB_START}(?:hallo|liebe|guten\\s+tag|sehr\\s+geehrte)${WB_END}`,
              missingHintTr: '"Hallo", "Liebe" veya "Guten Tag" ile başlayın.',
            },
            {
              id: 'wohnung-b1-addressee',
              labelTr: 'Muhatap (Frau Demir)',
              pattern: `${WB_START}(?:frau\\s+demir|demir)${WB_END}`,
              missingHintTr: 'Komşunuzun adını yazın ("Frau Demir").',
            },
          ],
          hintTr: '"Hallo Frau Demir," veya "Liebe Frau Demir," ile başla.',
        },
        {
          id: 'wohnung-b2',
          labelDe: 'Paket UND Aufbewahrung (bei mir / angenommen)',
          labelTr: 'Paket bilgisi VE sende/teslim alındığı bilgisi',
          requiredSubConditions: [
            {
              id: 'wohnung-b2-parcel',
              labelTr: 'Paket sözcüğü',
              pattern: `${WB_START}(?:paket|päckchen|sendung)${WB_END}`,
              missingHintTr: 'Paketten açıkça bahsedin ("Ihr Paket" / "das Paket").',
            },
            {
              id: 'wohnung-b2-custody',
              labelTr: 'Bende / teslim aldım bilgisi',
              pattern: `${WB_START}(?:bei\\s+mir|angenommen|in\\s+meiner\\s+wohnung|habe\\s+(?:heute\\s+)?(?:ihr|das)\\s+paket)${WB_END}`,
              missingHintTr: 'Paketin sizde olduğunu veya teslim aldığınızı belirtin ("bei mir" / "angenommen").',
            },
          ],
          hintTr: 'Hem paketi hem de sizde olduğunu yaz ("Ich habe Ihr Paket angenommen. Es ist bei mir.").',
        },
        {
          id: 'wohnung-b3',
          labelDe: 'Abholzeit UND Abholen/Klingeln (z. B. heute ab 18 Uhr abholen)',
          labelTr: 'Teslim alma zamanı VE alma/zile basma bilgisi',
          requiredSubConditions: [
            {
              id: 'wohnung-b3-time',
              labelTr: 'Zaman veya saat',
              pattern: `${WB_START}(?:heute|morgen|abend|abends|nachmittag|vormittag|uhr)${WB_END}|\\b(?:ab|um)\\s+\\d{1,2}\\b|\\b\\d{1,2}[:.]\\d{2}\\b`,
              missingHintTr: 'Paketi ne zaman alabileceğini yazın (ör. "heute ab 18:00 Uhr").',
            },
            {
              id: 'wohnung-b3-action',
              labelTr: 'Teslim alma / zile basma eylemi',
              pattern: `${WB_START}(?:abholen|holen|klingeln|vorbeikommen|kommen)${WB_END}`,
              missingHintTr: 'Teslim alma eylemini belirtin (ör. "abholen" veya "klingeln").',
            },
          ],
          hintTr: 'Ne zaman ve nasıl alabileceğini birlikte yaz (ör. "Sie können es heute ab 18 Uhr abholen.").',
        },
        {
          id: 'wohnung-b4',
          labelDe: 'Grußformel UND eigener Name (z. B. Viele Grüße, Thomas)',
          labelTr: 'Kapanış selamı VE kendi adın (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'wohnung-b4-closing',
              labelTr: 'Kapanış selamı',
              pattern: `${WB_START}(?:viele\\s+grüße|viele\\s+gruesse|liebe\\s+grüße|liebe\\s+gruesse|freundliche\\s+grüße|mit\\s+freundlichen\\s+grüßen|beste\\s+grüße|bis\\s+später)${WB_END}`,
              missingHintTr: 'Sona "Viele Grüße," veya "Liebe Grüße," ekleyin.',
            },
            {
              id: 'wohnung-b4-signature',
              labelTr: 'Kapanıştan sonra ad/imza',
              pattern: `(?:Grüße|Gruesse|Grüßen|Gruessen|später)[,!.:\\s-]+(?:Ihr\\s+Nachbar\\s+|Ihre\\s+Nachbarin\\s+)?[A-ZÄÖÜ][a-zäöüß]{1,}`,
              caseSensitive: true,
              missingHintTr: 'Kapanıştan sonra büyük harfle başlayan kendi adınızı yazın (ör. "Viele Grüße, Thomas").',
            },
          ],
          hintTr: 'Sona "Viele Grüße," ve ardından kendi adını yaz.',
        },
      ],
      nounCapitalizationTargets: [
        'Paket',
        'Wohnung',
        'Uhr',
        'Stock',
        'Nachbar',
        'Nachbarin',
        'Abend',
        'Tür',
        'Grüße',
      ],
      pitfallRules: [
        {
          id: 'wohnung-p1',
          pattern: `${WB_START}ein\\s+wohnung${WB_END}`,
          messageTr: '"die Wohnung" dişil (feminin) bir isimdir: "ein Wohnung" değil, "eine Wohnung".',
        },
        {
          id: 'wohnung-p2',
          pattern: `${WB_START}Sie\\s+(?:kann|hat|ist|kommt|wohnt|holt|klingelt|möchte)${WB_END}`,
          caseSensitive: true,
          messageTr:
            'Resmi "Sie" (Siz) ile fiil çoğul çekimlenir: "Sie können / Sie haben / Sie kommen" (Sie kann değil).',
        },
      ],
      phrases: [
        { id: 'wh-r1', german: 'Hallo Frau Demir, / Liebe Frau Demir,', turkish: 'Merhaba Bayan Demir,', categoryTr: 'Selamlama' },
        { id: 'wh-r2', german: 'Ich habe heute Ihr Paket angenommen.', turkish: 'Bugün paketinizi teslim aldım.', categoryTr: 'Paket Bilgisi' },
        { id: 'wh-r3', german: 'Das Paket ist bei mir in Wohnung 5.', turkish: 'Paket bende, 5 numaralı dairede.', categoryTr: 'Konum' },
        { id: 'wh-r4', german: 'Sie können es heute ab 18:00 Uhr abholen.', turkish: 'Bugün saat 18:00’den itibaren alabilirsiniz.', categoryTr: 'Zaman' },
        { id: 'wh-r5', german: 'Klingeln Sie einfach bei Klein!', turkish: 'Sadece Klein ziline basabilirsiniz!', categoryTr: 'Yönlendirme' },
        { id: 'wh-r6', german: 'Viele Grüße, Ihr Nachbar …', turkish: 'Çok selamlar, komşunuz …', categoryTr: 'Kapanış' },
      ],
      modelAnswerDe:
        'Hallo Frau Demir, ich habe heute Ihr Paket angenommen. Es ist bei mir im 2. Stock. Sie können das Paket heute ab 18:00 Uhr abholen. Klingeln Sie einfach an meiner Tür. Viele Grüße, Thomas Klein',
      modelAnswerTr:
        'Merhaba Bayan Demir, bugün paketinizi teslim aldım. Bende, 2. katta. Paketi bugün saat 18:00’den sonra alabilirsiniz. Kapı zilime basmanız yeterli. Çok selamlar, Thomas Klein',
    },
    controlledItems: [
      {
        id: 'schreiben-wohnung-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Bilde einen korrekten A1-Satz über die Wohnung.',
        instructionTr: 'Daire hakkında doğru bir A1 cümlesi oluşturun ("Dairemde büyük bir balkon var.").',
        tokens: ['hat', 'einen großen Balkon', 'Meine Wohnung', '.'],
        acceptedSentencesDe: ['Meine Wohnung hat einen großen Balkon.'],
        canonicalSentenceDe: 'Meine Wohnung hat einen großen Balkon.',
        explanationTr:
          'Özne ("Meine Wohnung") 1. konumda, çekimli fiil ("hat") 2. konumda ve Akkusativ nesne ("einen großen Balkon") sonda yer alır.',
      },
      {
        id: 'schreiben-wohnung-ctrl-2',
        kind: 'cloze-typed',
        beforeBlankDe: 'Die Wohnung liegt im zweiten',
        afterBlankDe: '.',
        hintTr: 'İsim: kat (der Stock — artikel olmadan sadece çıplak isim)',
        acceptedAnswers: ['Stock'],
        canonicalAnswer: 'Stock',
        requiresCapitalizedNoun: true,
        disallowLeadingArticle: true,
        explanationTr:
          '"im" (= in dem) artikeli içerdiği için boşluğa yalnızca büyük harfle başlayan çıplak isim "Stock" yazılır.',
      },
      {
        id: 'schreiben-wohnung-ctrl-3',
        kind: 'satzbau',
        instructionDe: 'Ordne die Wörter zu einer höflichen Bitte.',
        instructionTr: 'Sözcükleri kibar bir cümle olacak şekilde sıralayın ("Saat 22’den sonra lütfen sessiz olun.").',
        tokens: ['Ab 22 Uhr', 'bitte', 'leise', 'seid', '.'],
        acceptedSentencesDe: ['Ab 22 Uhr seid bitte leise.', 'Seid ab 22 Uhr bitte leise.'],
        canonicalSentenceDe: 'Ab 22 Uhr seid bitte leise.',
        explanationTr:
          'Zaman ifadesi ("Ab 22 Uhr") başta olduğunda fiil ("seid") hemen 2. konuma gelir.',
      },
    ],
  },
  {
    id: 'schreiben-reisen',
    titleDe: 'Freizeit & Wochenendausflug',
    titleTr: 'Boş Zaman ve Hafta Sonu Gezisi',
    contextLabelTr: 'Seyahat · Gezi Kaydı & Davet',
    subtitleTr: 'Gezi kayıt formu, arkadaşa hafta sonu tren gezisi daveti ve ulaşım/zaman yazma pratiği.',
    estimatedMinutes: 6,
    imageUrl: imgAsset3,
    imageAlt: 'Ahşap masada açık gezi planı defteri, bölgesel tren bileti ve dolma kalem',
    formTask: {
      id: 'schreiben-reisen-form',
      titleDe: 'Ausflug-Anmeldung — Kulturverein',
      titleTr: 'Gezi Kayıt Formu — Kültür Derneği',
      situationDe:
        'Am Sonntag macht der Sprachkurs einen Tagesausflug nach Salzburg. Der Zug fährt um 09:15 Uhr ab. Leyla Yılmaz fährt mit und bringt eine Kamera mit.',
      situationTr:
        'Pazar günü dil kursu Salzburg’a günübirlik bir gezi yapıyor. Tren saat 09:15’te kalkıyor. Leyla Yılmaz da katılıyor ve yanında bir fotoğraf makinesi getiriyor.',
      fields: [
        {
          id: 'reisen-f1',
          labelDe: 'Teilnehmerin / Name',
          labelTr: 'Katılımcı Adı',
          placeholderDe: 'z. B. Anna Müller',
          acceptedValues: ['Leyla Yılmaz', 'Leyla Yilmaz'],
          canonicalValue: 'Leyla Yılmaz',
          caseSensitiveCapitalization: true,
          tipTr: 'Katılımcının adını ve soyadını baş harfleri büyük yazın (Leyla Yılmaz).',
        },
        {
          id: 'reisen-f2',
          labelDe: 'Reiseziel (Stadt)',
          labelTr: 'Gezi Hedefi (Şehir)',
          placeholderDe: 'z. B. Wien',
          acceptedValues: ['Salzburg'],
          canonicalValue: 'Salzburg',
          caseSensitiveCapitalization: true,
          tipTr: 'Gidilecek şehrin adını büyük harfle başlayarak yazın (Salzburg).',
        },
        {
          id: 'reisen-f3',
          labelDe: 'Reisetag',
          labelTr: 'Gezi Günü',
          placeholderDe: 'z. B. Samstag',
          acceptedValues: ['Sonntag', 'am Sonntag'],
          canonicalValue: 'Sonntag',
          caseSensitiveCapitalization: true,
          tipTr: 'Gezi gününü büyük harfle başlayarak yazın (Sonntag).',
        },
        {
          id: 'reisen-f4',
          labelDe: 'Abfahrtszeit',
          labelTr: 'Kalkış Saati',
          placeholderDe: 'z. B. 08:30',
          acceptedValues: ['09:15', '9:15', '09:15 Uhr', '9:15 Uhr'],
          canonicalValue: '09:15 Uhr',
          caseSensitiveCapitalization: true,
          tipTr: 'Trenin kalkış saatini yazın ("09:15" veya büyük U ile "09:15 Uhr").',
        },
      ],
    },
    messageTask: {
      id: 'schreiben-reisen-message',
      formatLabelDe: 'Kurze Einladung · Ausflug',
      formatLabelTr: 'Hafta Sonu Gezi Daveti',
      titleDe: 'Ausflug nach Salzburg mit Lukas',
      titleTr: 'Arkadaşa Hafta Sonu Gezi Mesajı',
      promptDe:
        'Du fährst am Sonntag mit dem Zug nach Salzburg. Schreib eine kurze Nachricht (ca. 20–35 Wörter) an deinen Freund Lukas: 1) Begrüße Lukas. 2) Schreib, wohin du fährst und wie (mit dem Zug). 3) Nenne Treffpunkt oder Uhrzeit (z. B. am Bahnhof um 9 Uhr). 4) Frag, ob er mitkommt, und schreib einen Gruß.',
      promptTr:
        'Pazar günü trenle Salzburg’a gidiyorsun. Arkadaşın Lukas’a kısa bir mesaj (yaklaşık 20–35 sözcük) yaz: 1) Lukas’ı selamla. 2) Nereye ve neyle (trenle) gideceğini yaz. 3) Buluşma yerini veya saatini belirt (ör. istasyonda saat 9’da). 4) Onun da gelip gelmeyeceğini sor ve kapanış selamı ekle.',
      minWords: 18,
      bullets: [
        {
          id: 'reisen-b1',
          labelDe: 'Anrede an Lukas (z. B. Hallo Lukas, Lieber Lukas)',
          labelTr: 'Lukas’a selamlama (selam + muhatap adı)',
          requiredSubConditions: [
            {
              id: 'reisen-b1-greeting',
              labelTr: 'Selamlama ifadesi',
              pattern: `${WB_START}(?:hallo|lieber|hi|hey|guten\\s+tag)${WB_END}`,
              missingHintTr: '"Hallo", "Lieber" veya "Hi" ile başlayın.',
            },
            {
              id: 'reisen-b1-addressee',
              labelTr: 'Muhatap (Lukas)',
              pattern: `${WB_START}lukas${WB_END}`,
              missingHintTr: 'Arkadaşınızın adını yazın ("Hallo Lukas,").',
            },
          ],
          hintTr: '"Hallo Lukas," veya "Lieber Lukas," ile başla.',
        },
        {
          id: 'reisen-b2',
          labelDe: 'Reiseziel (Salzburg) UND Verkehrsmittel (mit dem Zug)',
          labelTr: 'Gidilecek yer (Salzburg) VE ulaşım aracı (tren)',
          requiredSubConditions: [
            {
              id: 'reisen-b2-destination',
              labelTr: 'Gezi hedefi (Salzburg)',
              pattern: `${WB_START}salzburg${WB_END}`,
              missingHintTr: 'Nereye gideceğinizi yazın ("nach Salzburg").',
            },
            {
              id: 'reisen-b2-transport',
              labelTr: 'Ulaşım aracı (Zug / Bahn)',
              pattern: `${WB_START}(?:zug|bahn|regionalzug)${WB_END}`,
              missingHintTr: 'Neyle gideceğinizi belirtin ("mit dem Zug").',
            },
          ],
          hintTr: 'Hem hedefi (Salzburg) hem de ulaşım aracını (mit dem Zug) birlikte yaz.',
        },
        {
          id: 'reisen-b3',
          labelDe: 'Treffpunkt oder konkrete Uhrzeit (Bahnhof / Gleis / um 9 Uhr)',
          labelTr: 'Somut buluşma yeri (Bahnhof/Gleis) veya saat bilgisi (um 9 Uhr)',
          requiredSubConditions: [
            {
              id: 'reisen-b3-place-or-clock',
              labelTr: 'Buluşma yeri veya saat',
              pattern: `${WB_START}(?:bahnhof|hauptbahnhof|gleis)${WB_END}|\\b\\d{1,2}[:.]\\d{2}\\b|${WB_START}(?:um\\s+)?(?:[1-9]|1\\d|2[0-4]|acht|neun|zehn|elf|zwölf)\\s*uhr${WB_END}`,
              missingHintTr:
                'Somut bir buluşma yeri ("am Bahnhof" / "Gleis 4") veya saat ("um 9 Uhr" / "09:00") yazın.',
            },
          ],
          hintTr: 'Buluşma yerini ("am Bahnhof") veya saatini ("um 9:00 Uhr") belirt.',
        },
        {
          id: 'reisen-b4',
          labelDe: 'Einladungsfrage (Kommst du mit?) UND Grußformel',
          labelTr: 'Katılım sorusu VE kapanış selamı (her ikisi de gerekli)',
          requiredSubConditions: [
            {
              id: 'reisen-b4-question',
              labelTr: 'Davet / katılım sorusu',
              pattern: `${WB_START}(?:kommst\\s+du|fährst\\s+du|willst\\s+du\\s+mit|möchtest\\s+du\\s+mit|hast\\s+du\\s+(?:zeit|lust)|bist\\s+du\\s+dabei)${WB_END}`,
              missingHintTr: 'Onun da gelip gelmeyeceğini sorun (ör. "Kommst du mit?" veya "Hast du Zeit?").',
            },
            {
              id: 'reisen-b4-closing',
              labelTr: 'Kapanış selamı',
              pattern: `${WB_START}(?:viele\\s+grüße|viele\\s+gruesse|liebe\\s+grüße|liebe\\s+gruesse|schöne\\s+grüße|beste\\s+grüße|bis\\s+bald|bis\\s+sonntag|bis\\s+samstag|tschüss|tschüß)${WB_END}`,
              missingHintTr: 'Kapanış selamı ekleyin (ör. "Liebe Grüße," veya "Bis bald,").',
            },
          ],
          hintTr: 'Hem katılım sorusunu ("Kommst du mit?") hem de kapanış selamını ("Liebe Grüße,") ekle.',
        },
      ],
      nounCapitalizationTargets: [
        'Zug',
        'Sonntag',
        'Samstag',
        'Bahnhof',
        'Ausflug',
        'Uhr',
        'Wochenende',
        'Ticket',
        'Salzburg',
        'Grüße',
      ],
      pitfallRules: [
        {
          id: 'reisen-p1',
          pattern: `${WB_START}mit\\s+(?:der|den|das|ein)\\s+zug${WB_END}`,
          messageTr:
            '"mit" edatı Dativ ister; "der Zug" eril olduğu için "mit dem Zug" şeklinde kullanılır.',
        },
        {
          id: 'reisen-p2',
          pattern: `${WB_START}in\\s+(?:sonntag|samstag|freitag|montag)${WB_END}`,
          messageTr: 'Günlerle "in" değil "am" kullanılır: ör. "am Sonntag".',
        },
        {
          id: 'reisen-p3',
          pattern: `${WB_START}ein\\s+ausflug${WB_END}`,
          messageTr:
            '"der Ausflug" eril (maskulin) bir isimdir; "machen" fiiliyle Akkusativ "einen Ausflug" kullanılır.',
        },
      ],
      phrases: [
        { id: 'rs-r1', german: 'Hallo Lukas, / Lieber Lukas,', turkish: 'Merhaba Lukas, / Sevgili Lukas,', categoryTr: 'Selamlama' },
        { id: 'rs-r2', german: 'Am Sonntag mache ich einen Ausflug nach Salzburg.', turkish: 'Pazar günü Salzburg’a gezi yapıyorum.', categoryTr: 'Plan' },
        { id: 'rs-r3', german: 'Ich fahre mit dem Zug.', turkish: 'Trenle gidiyorum.', categoryTr: 'Ulaşım' },
        { id: 'rs-r4', german: 'Wir treffen uns um 9:00 Uhr am Bahnhof.', turkish: 'Saat 9:00’da istasyonda buluşuyoruz.', categoryTr: 'Buluşma' },
        { id: 'rs-r5', german: 'Hast du Zeit? Kommst du mit?', turkish: 'Zamanın var mı? Sen de geliyor musun?', categoryTr: 'Davet' },
        { id: 'rs-r6', german: 'Bis Sonntag! Liebe Grüße,', turkish: 'Pazar günü görüşürüz! Sevgiler,', categoryTr: 'Kapanış' },
      ],
      modelAnswerDe:
        'Hallo Lukas, am Sonntag mache ich einen Ausflug nach Salzburg. Ich fahre mit dem Zug. Wir treffen uns um 09:00 Uhr am Bahnhof. Hast du Zeit und kommst du mit? Liebe Grüße, Leyla',
      modelAnswerTr:
        'Merhaba Lukas, pazar günü Salzburg’a bir gezi yapıyorum. Trenle gidiyorum. Saat 09:00’da istasyonda buluşuyoruz. Zamanın var mı, sen de geliyor musun? Sevgiler, Leyla',
    },
    controlledItems: [
      {
        id: 'schreiben-reisen-ctrl-1',
        kind: 'cloze-typed',
        beforeBlankDe: 'Wir fahren am Sonntag mit dem',
        afterBlankDe: 'nach Salzburg.',
        hintTr: 'İsim: tren (artikel olmadan çıplak isim, baş harfi büyük)',
        acceptedAnswers: ['Zug'],
        canonicalAnswer: 'Zug',
        requiresCapitalizedNoun: true,
        disallowLeadingArticle: true,
        explanationTr:
          '"mit dem" zaten Dativ artikeli içerir; bu yüzden yalnızca büyük harfle başlayan "Zug" yazılır.',
      },
      {
        id: 'schreiben-reisen-ctrl-2',
        kind: 'cloze-typed',
        beforeBlankDe: 'Ich nehme',
        afterBlankDe: 'Regenjacke mit.',
        hintTr: 'Akkusativ belirsiz artikel (die Regenjacke)',
        acceptedAnswers: ['eine'],
        canonicalAnswer: 'eine',
        caseArticleHints: [
          {
            wrongValue: 'einen',
            messageTr:
              '"einen" eril (der) isimler içindir. "die Regenjacke" dişil olduğu için "eine" kullanılır.',
          },
          {
            wrongValue: 'ein',
            messageTr:
              '"die Regenjacke" dişil (feminin) bir isimdir; belirsiz artikel "eine" olmalıdır.',
          },
        ],
        explanationTr:
          '"die Regenjacke" dişil (die) bir isimdir; "mitnehmen" fiiliyle Akkusativ belirsiz artikel "eine" olur.',
      },
      {
        id: 'schreiben-reisen-ctrl-3',
        kind: 'satzbau',
        instructionDe: 'Bilde einen korrekten A1-Satz mit Zeitangabe.',
        instructionTr: 'Zaman bilgisi içeren doğru bir A1 cümlesi oluşturun ("Tren saat dokuzda kalkıyor.").',
        tokens: ['fährt', 'Der Zug', 'um neun Uhr', 'ab', '.'],
        acceptedSentencesDe: [
          'Der Zug fährt um neun Uhr ab.',
          'Um neun Uhr fährt der Zug ab.',
        ],
        canonicalSentenceDe: 'Der Zug fährt um neun Uhr ab.',
        explanationTr:
          '"abfahren" ayrılabilen (trennbar) bir fiildir: çekimli kök ("fährt") 2. konumda, ön ek ("ab") cümlenin en sonunda yer alır.',
      },
    ],
  },
];

export function getWritingScenarioExerciseIds(scenario: WritingScenario): string[] {
  return [
    scenario.formTask.id,
    scenario.messageTask.id,
    ...scenario.controlledItems.map((item) => item.id),
  ];
}

export const TOTAL_WRITING_TASKS = GERMAN_A1_WRITING_SCENARIOS.reduce(
  (sum, scenario) => sum + getWritingScenarioExerciseIds(scenario).length,
  0
);

export function getWritingScenarioById(id: string): WritingScenario {
  return (
    GERMAN_A1_WRITING_SCENARIOS.find((s) => s.id === id) ?? GERMAN_A1_WRITING_SCENARIOS[0]
  );
}
