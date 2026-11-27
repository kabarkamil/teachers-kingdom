import imgAsset1 from '../assets/images/a2_unit_arbeit_alltag_1795436305476.jpg';
import imgAsset2 from '../assets/images/a2_unit_reisen_medien_1795436308019.jpg';
import imgAsset3 from '../assets/images/hero_language_academy_1795362307909.jpg';
import imgAsset4 from '../assets/images/lesen_wohnung_notice_1795375249467.jpg';
import type { A2ReadingScenario } from '../types';

export const GERMAN_A2_READING_SCENARIOS: A2ReadingScenario[] = [
  {
    id: 'a2-lesen-bewerbung',
    titleDe: 'Einladung zum Vorstellungsgespräch',
    titleTr: 'İş Görüşmesine Davet E-Postası',
    contextLabelTr: 'İş Hayatı & E-Posta',
    subtitleTr:
      'Münih’teki bir ajansın gönderdiği görüşme davetinde tarih, belge, ulaşım ve erteleme koşullarını okuyun.',
    cefrFocusTr: 'Resmî e-posta (Sie) · weil / falls yan cümleleri · belge ve ulaşım ayrıntıları',
    format: 'email',
    estimatedMinutes: 6,
    imageUrl: imgAsset1,
    imageAlt: 'Münih ofis masasında dosya, ajanda ve dizüstü bilgisayar',
    document: {
      formatLabelTr: 'Resmî E-Posta',
      formatLabelDe: 'E-Mail · Bewerbung',
      metaRows: [
        {
          labelDe: 'Von:',
          valueDe: 'Sabine Hartmann <personal@isarmedia-muenchen.de>',
          valueTr: 'Gönderen: Sabine Hartmann (İnsan Kaynakları, IsarMedia Münih)',
        },
        {
          labelDe: 'An:',
          valueDe: 'Deniz Kaya <deniz.kaya@mail.de>',
          valueTr: 'Alıcı: Deniz Kaya',
        },
        {
          labelDe: 'Betreff:',
          valueDe: 'Ihre Bewerbung als Projektassistent/in — Einladung',
          valueTr: 'Konu: Proje Asistanlığı Başvurunuz — Davet',
        },
        {
          labelDe: 'Datum:',
          valueDe: 'Montag, 14. Oktober, 09:40 Uhr',
          valueTr: 'Tarih: 14 Ekim Pazartesi, 09:40',
        },
      ],
      paragraphsDe: [
        'Sehr geehrte(r) Deniz Kaya,',
        'vielen Dank für Ihre Bewerbung und das Interesse an unserer Agentur. Ihre Unterlagen und Ihre bisherige Erfahrung in der Kundenbetreuung haben uns sehr gut gefallen. Deshalb möchten wir Sie gern persönlich kennenlernen.',
        'Wir laden Sie herzlich zu einem Vorstellungsgespräch am Donnerstag, den 24. Oktober, um 11:00 Uhr in unser Büro in der Lindwurmstraße 48 ein. Das Gespräch dauert ungefähr 45 Minuten und findet zusammen mit unserem Teamleiter, Herrn Berger, statt.',
        'Bitte bringen Sie Ihren Personalausweis und eine Kopie Ihres letzten Arbeitszeugnisses mit. Unser Büro liegt nur fünf Minuten zu Fuß von der U-Bahn-Station Goetheplatz entfernt, weil es vor dem Haus leider keine Besucherparkplätze gibt.',
        'Falls Sie an diesem Tag verhindert sind, geben Sie uns bitte bis spätestens Dienstagmittag telefonisch oder per E-Mail Bescheid, damit wir einen anderen Termin vereinbaren können.',
      ],
      paragraphsTr: [
        'Sayın Deniz Kaya,',
        'Başvurunuz ve ajansımıza gösterdiğiniz ilgi için çok teşekkür ederiz. Belgeleriniz ve müşteri hizmetlerindeki önceki deneyiminiz çok hoşumuza gitti. Bu nedenle sizi şahsen tanımak isteriz.',
        'Sizi 24 Ekim Perşembe günü saat 11.00’de Lindwurmstraße 48 adresindeki ofisimizde yapılacak iş görüşmesine içtenlikle davet ediyoruz. Görüşme yaklaşık 45 dakika sürecek ve ekip liderimiz Bay Berger ile birlikte gerçekleşecektir.',
        'Lütfen kimliğinizi ve son çalışma belgenizin bir kopyasını yanınızda getirin. Binanın önünde ne yazık ki ziyaretçi otoparkı olmadığı için, ofisimiz Goetheplatz metro istasyonuna yürüyerek yalnızca beş dakika uzaklıktadır.',
        'Eğer o gün müsait değilseniz, başka bir randevu kararlaştırabilmemiz için lütfen en geç salı öğlene kadar telefonla veya e-posta ile bize haber verin.',
      ],
      footerNoteDe: 'Mit freundlichen Grüßen · Sabine Hartmann · Personalabteilung IsarMedia GmbH',
      footerNoteTr: 'Saygılarımla · Sabine Hartmann · IsarMedia GmbH İnsan Kaynakları Departmanı',
      readAloudDe:
        'Sehr geehrte Deniz Kaya, vielen Dank für Ihre Bewerbung und das Interesse an unserer Agentur. Ihre Unterlagen und Ihre bisherige Erfahrung in der Kundenbetreuung haben uns sehr gut gefallen. Deshalb möchten wir Sie gern persönlich kennenlernen. Wir laden Sie herzlich zu einem Vorstellungsgespräch am Donnerstag, den 24. Oktober, um 11 Uhr in unser Büro in der Lindwurmstraße 48 ein. Das Gespräch dauert ungefähr 45 Minuten und findet zusammen mit unserem Teamleiter, Herrn Berger, statt. Bitte bringen Sie Ihren Personalausweis und eine Kopie Ihres letzten Arbeitszeugnisses mit. Unser Büro liegt nur fünf Minuten zu Fuß von der U-Bahn-Station Goetheplatz entfernt, weil es vor dem Haus leider keine Besucherparkplätze gibt. Falls Sie an diesem Tag verhindert sind, geben Sie uns bitte bis spätestens Dienstagmittag telefonisch oder per E-Mail Bescheid, damit wir einen anderen Termin vereinbaren können. Mit freundlichen Grüßen, Sabine Hartmann.',
    },
    highlightPhrasesDe: [
      'Vorstellungsgespräch',
      'Kundenbetreuung',
      'Arbeitszeugnisses',
      'Besucherparkplätze',
      'Bescheid',
      'vereinbaren',
    ],
    glossary: [
      {
        id: 'a2r-b-g1',
        article: 'das',
        german: 'Vorstellungsgespräch',
        turkish: 'iş görüşmesi / mülakat',
        noteTr: 'Çoğulu: die Vorstellungsgespräche.',
      },
      {
        id: 'a2r-b-g2',
        article: 'die',
        german: 'Kundenbetreuung',
        turkish: 'müşteri hizmetleri / müşteri takibi',
        noteTr: '“-ung” ile bittiği için artikeli her zaman “die” olur.',
      },
      {
        id: 'a2r-b-g3',
        article: 'das',
        german: 'Arbeitszeugnis',
        turkish: 'çalışma / referans belgesi',
        noteTr: 'Metinde Genitiv hâlinde “Ihres letzten Arbeitszeugnisses” geçer.',
      },
      {
        id: 'a2r-b-g4',
        german: 'verhindert sein',
        turkish: 'müsait olmamak / gelemeyecek durumda olmak',
        noteTr: 'Resmî A2 e-postalarında sık kullanılan nazik ifade.',
      },
      {
        id: 'a2r-b-g5',
        german: 'Bescheid geben',
        turkish: 'haber vermek / bildirmek',
        noteTr: 'Dativ kişi ile kullanılır: “Geben Sie uns bitte Bescheid.”',
      },
      {
        id: 'a2r-b-g6',
        german: 'einen Termin vereinbaren',
        turkish: 'randevu kararlaştırmak / ayarlamak',
        noteTr: '“damit wir einen anderen Termin vereinbaren können.”',
      },
    ],
    verdictItems: [
      {
        id: 'a2r-b-tf1',
        statementDe: 'Das Vorstellungsgespräch findet direkt mit zwei Personen statt, darunter Herr Berger.',
        statementTr: 'İş görüşmesine Bay Berger’in de aralarında olduğu iki kişi (veya ekip lideri eşliğinde) katılıyor.',
        expectedVerdict: 'richtig',
        explanationTr:
          'Richtig (Doğru). Bayan Hartmann “Wir laden Sie ein” ve “findet zusammen mit unserem Teamleiter, Herrn Berger, statt” diyerek görüşmenin Bay Berger ile birlikte yapılacağını açıkça belirtiyor.',
      },
      {
        id: 'a2r-b-tf2',
        statementDe: 'Bewerber können ihr Auto kostenlos direkt vor dem Bürogebäude parken.',
        statementTr: 'Adaylar arabalarını ofis binasının hemen önüne ücretsiz park edebilir.',
        expectedVerdict: 'falsch',
        explanationTr:
          'Falsch (Yanlış). E-postada “weil es vor dem Haus leider keine Besucherparkplätze gibt” (binanın önünde maalesef ziyaretçi otoparkı yok) ifadesi yer alıyor.',
      },
      {
        id: 'a2r-b-tf3',
        statementDe: 'Die Agentur bezahlt den Bewerbern die Fahrtkosten für die U-Bahn.',
        statementTr: 'Ajans adayların metro ulaşım ücretini ödüyor.',
        expectedVerdict: 'nicht-im-text',
        explanationTr:
          'Nicht im Text (Metinde yok). Metro istasyonunun 5 dakika yürüme mesafesinde olduğu yazıyor ancak yol masraflarının karşılanıp karşılanmayacağına dair hiçbir bilgi verilmiyor.',
      },
    ],
    cloze: [
      {
        id: 'a2r-b-cl1',
        promptDe: 'Ihre Unterlagen haben uns sehr gut gefallen. ___ möchten wir Sie persönlich kennenlernen.',
        hintTr: '“Bu nedenle / bu yüzden” anlamında sonuç bildiren zarf (fiili 2. sıraya çeker).',
        options: ['Deshalb', 'Obwohl', 'Während', 'Trotzdem'],
        correctOption: 'Deshalb',
        explanationTr:
          '“Deshalb” (bu nedenle) önceki cümleye bağlı mantıksal sonucu bildirir ve ardından hemen çekimli fiil (möchten) gelir.',
      },
      {
        id: 'a2r-b-cl2',
        promptDe: 'Bitte ___ Sie Ihren Personalausweis und eine Kopie des Arbeitszeugnisses mit.',
        hintTr: 'Ayrılabilen “mitbringen” fiilinin resmî emir (Sie) çekimi.',
        options: ['bringen', 'nehmen', 'senden', 'bleiben'],
        correctOption: 'bringen',
        explanationTr:
          '“etwas mitbringen” (yanında getirmek) ayrılabilen fiildir: “Bitte bringen Sie ... mit.”',
      },
      {
        id: 'a2r-b-cl3',
        promptDe: 'Geben Sie uns bitte bis Dienstagmittag Bescheid, ___ wir einen neuen Termin vereinbaren können.',
        hintTr: 'Amaç bildiren yan cümle bağlacı (“...abilmemiz için”).',
        options: ['damit', 'weil', 'seit', 'aber'],
        correctOption: 'damit',
        explanationTr:
          '“damit” (olsun diye / -mesi için) farklı öznelerle amaç bildirir ve çekimli yardımcı fiili (können) sona gönderir.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2r-b-mc1',
        questionTr: 'Aday görüşmeye giderken yanına neleri almalıdır?',
        questionDe: 'Was soll Deniz Kaya zum Termin mitbringen?',
        options: [
          'Yalnızca özgeçmişini ve metro biletini',
          'Kimliğini ve son çalışma belgesinin bir kopyasını',
          'Tüm okul diplomalarının asıllarını',
          'Sürücü belgesini ve iş sözleşmesini',
        ],
        correctIndex: 1,
        explanationTr:
          'Metinde açıkça “Bitte bringen Sie Ihren Personalausweis und eine Kopie Ihres letzten Arbeitszeugnisses mit.” deniyor.',
      },
      {
        id: 'a2r-b-mc2',
        questionTr: 'Aday 24 Ekim Perşembe günü gelemezse ne yapmalıdır?',
        questionDe: 'Was muss Deniz Kaya tun, wenn der Termin am Donnerstag nicht passt?',
        options: [
          'Görüşme günü sabah saat 10.00’da aramalıdır',
          'En geç salı öğlene kadar telefon veya e-posta ile haber vermelidir',
          'Yeni bir başvuru dosyası göndermelidir',
          'Doğrudan ofise gidip Bay Berger ile görüşmelidir',
        ],
        correctIndex: 1,
        explanationTr:
          'Son paragrafta “bis spätestens Dienstagmittag telefonisch oder per E-Mail Bescheid” (en geç salı öğlene kadar telefonla veya e-postayla) bildirim isteniyor.',
      },
    ],
  },
  {
    id: 'a2-lesen-hausverwaltung',
    titleDe: 'Mitteilung der Hausverwaltung',
    titleTr: 'Bina Yönetimi Duyurusu: Bakım ve Bisiklet Deposu',
    contextLabelTr: 'Ev & Komşuluk',
    subtitleTr:
      'Apartman panosundaki resmî duyuruda kalorifer bakımı saatlerini, erişim kurallarını ve depo temizliğini kavrayın.',
    cefrFocusTr: 'Modal fiiller (müssen / dürfen / sollen) · tarih/saat aralıkları · resmî duyuru dili',
    format: 'notice',
    estimatedMinutes: 6,
    imageUrl: imgAsset4,
    imageAlt: 'Apartman giriş holünde düzenli duyuru panosu',
    document: {
      formatLabelTr: 'Apartman Duyurusu',
      formatLabelDe: 'Aushang · Hausverwaltung',
      metaRows: [
        {
          labelDe: 'Objekt:',
          valueDe: 'Gartenstraße 12, 10115 Berlin',
          valueTr: 'Bina: Gartenstraße 12, 10115 Berlin',
        },
        {
          labelDe: 'Thema:',
          valueDe: 'Jährliche Heizungswartung & Aufräumen im Fahrradkeller',
          valueTr: 'Konu: Yıllık Kalorifer Bakımı ve Bisiklet Deposu Düzenlemesi',
        },
        {
          labelDe: 'Termin Wartung:',
          valueDe: 'Mittwoch, 6. November, 08:30 – 13:00 Uhr',
          valueTr: 'Bakım Tarihi: 6 Kasım Çarşamba, 08:30 – 13:00',
        },
        {
          labelDe: 'Notdienst:',
          valueDe: '030 555 24 80 (Mo–Fr 08:00–17:00)',
          valueTr: 'Acil/Yönetim Hattı: 030 555 24 80 (Pzt–Cum 08:00–17:00)',
        },
      ],
      paragraphsDe: [
        'Liebe Hausbewohnerinnen und Hausbewohner,',
        'am Mittwoch, den 6. November, überprüft die Firma WärmeFix zwischen 08:30 und 13:00 Uhr alle Heizkörper in unserem Haus. Während dieser Zeit bleibt die Heizung ausgeschaltet, und das warme Wasser funktioniert nur eingeschränkt.',
        'Da der Techniker auch die Zähler in den Wohnungen ablesen muss, bitten wir Sie, an diesem Vormittag zu Hause zu sein. Wenn Sie nicht da sein können, geben Sie Ihren Wohnungsschlüssel bitte einer Nachbarin oder einem Nachbarn Ihres Vertrauens und hängen Sie einen kurzen Hinweis an Ihre Tür.',
        'Außerdem möchten wir am Samstag, den 16. November, den Fahrradkeller gründlich reinigen. Bitte markieren Sie Ihr Fahrrad bis zum 14. November mit Ihrem Nachnamen. Kaputte oder nicht markierte Räder werden nach diesem Datum entfernt, damit wieder genug Platz für alle Mieter entsteht.',
        'Im Treppenhaus dürfen aus Sicherheitsgründen weiterhin keine Fahrräder oder großen Kartons abgestellt werden.',
      ],
      paragraphsTr: [
        'Sevgili bina sakinleri,',
        '6 Kasım Çarşamba günü WärmeFix firması 08.30 ile 13.00 saatleri arasında binamızdaki tüm kalorifer peteklerini kontrol edecektir. Bu süre boyunca kalorifer kapalı kalacak ve sıcak su yalnızca kısıtlı çalışacaktır.',
        'Teknisyen dairelerin içindeki sayaçları da okumak zorunda olduğu için, o sabah evde bulunmanızı rica ediyoruz. Evde olamayacaksanız lütfen daire anahtarınızı güvendiğiniz bir komşunuza bırakın ve kapınıza kısa bir not asın.',
        'Ayrıca 16 Kasım Cumartesi günü bisiklet deposunu kapsamlı biçimde temizlemek istiyoruz. Lütfen 14 Kasım’a kadar bisikletinizi soyadınızla etiketleyin. Tüm kiracılar için yeniden yeterli yer açılması amacıyla, bu tarihten sonra bozuk veya etiketsiz bisikletler kaldırılacaktır.',
        'Güvenlik nedenleriyle merdiven boşluğuna bisiklet veya büyük koliler bırakılması yasak olmaya devam etmektedir.',
      ],
      footerNoteDe: 'Vielen Dank für Ihr Verständnis! · Hausverwaltung Mitte GmbH',
      footerNoteTr: 'Anlayışınız için çok teşekkür ederiz! · Mitte Bina Yönetimi GmbH',
      readAloudDe:
        'Liebe Hausbewohnerinnen und Hausbewohner, am Mittwoch, den 6. November, überprüft die Firma WärmeFix zwischen 8 Uhr 30 und 13 Uhr alle Heizkörper in unserem Haus. Während dieser Zeit bleibt die Heizung ausgeschaltet, und das warme Wasser funktioniert nur eingeschränkt. Da der Techniker auch die Zähler in den Wohnungen ablesen muss, bitten wir Sie, an diesem Vormittag zu Hause zu sein. Wenn Sie nicht da sein können, geben Sie Ihren Wohnungsschlüssel bitte einer Nachbarin oder einem Nachbarn Ihres Vertrauens und hängen Sie einen kurzen Hinweis an Ihre Tür. Außerdem möchten wir am Samstag, den 16. November, den Fahrradkeller gründlich reinigen. Bitte markieren Sie Ihr Fahrrad bis zum 14. November mit Ihrem Nachnamen. Kaputte oder nicht markierte Räder werden nach diesem Datum entfernt, damit wieder genug Platz für alle Mieter entsteht. Im Treppenhaus dürfen aus Sicherheitsgründen weiterhin keine Fahrräder oder großen Kartons abgestellt werden. Vielen Dank für Ihr Verständnis.',
    },
    highlightPhrasesDe: [
      'Heizkörper',
      'eingeschränkt',
      'Zähler',
      'Nachnamen',
      'entfernt',
      'Treppenhaus',
    ],
    glossary: [
      {
        id: 'a2r-h-g1',
        article: 'der',
        german: 'Heizkörper',
        turkish: 'kalorifer peteği / radyatör',
        noteTr: 'Çoğulu değişmez: die Heizkörper.',
      },
      {
        id: 'a2r-h-g2',
        german: 'eingeschränkt',
        turkish: 'kısıtlı / sınırlı olarak',
        noteTr: '“Das warme Wasser funktioniert nur eingeschränkt.”',
      },
      {
        id: 'a2r-h-g3',
        article: 'der',
        german: 'Zähler',
        turkish: 'sayaç (ısı / elektrik / su)',
        noteTr: '“den Zähler ablesen” = sayacı okumak.',
      },
      {
        id: 'a2r-h-g4',
        german: 'gründlich reinigen',
        turkish: 'kapsamlı / derinlemesine temizlemek',
        noteTr: '“gründlich” (titizlikle, iyice) önemli bir A2 zarfıdır.',
      },
      {
        id: 'a2r-h-g5',
        article: 'das',
        german: 'Treppenhaus',
        turkish: 'merdiven boşluğu / apartman merdiveni',
        noteTr: 'Ev kurallarında (Hausordnung) çok sık geçer.',
      },
      {
        id: 'a2r-h-g6',
        german: 'aus Sicherheitsgründen',
        turkish: 'güvenlik nedenleriyle',
        noteTr: '“dürfen ... keine Fahrräder abgestellt werden.”',
      },
    ],
    verdictItems: [
      {
        id: 'a2r-h-tf1',
        statementDe: 'Wenn man am 6. November nicht zu Hause ist, kann man den Schlüssel bei Nachbarn lassen.',
        statementTr: '6 Kasım’da evde olmayanlar anahtarı bir komşuya bırakabilir.',
        expectedVerdict: 'richtig',
        explanationTr:
          'Richtig (Doğru). Duyuruda evde olamayacak sakinlerin anahtarı güvendikleri bir komşuya bırakıp kapıya kısa bir not asması isteniyor.',
      },
      {
        id: 'a2r-h-tf2',
        statementDe: 'Während der Reinigung am 16. November darf man Fahrräder kurz im Treppenhaus abstellen.',
        statementTr: '16 Kasım’daki temizlik sırasında bisikletler kısa süreliğine merdiven boşluğuna bırakılabilir.',
        expectedVerdict: 'falsch',
        explanationTr:
          'Falsch (Yanlış). Son cümle bunu kesin biçimde yasaklıyor: “Im Treppenhaus dürfen aus Sicherheitsgründen weiterhin keine Fahrräder oder großen Kartons abgestellt werden.”',
      },
      {
        id: 'a2r-h-tf3',
        statementDe: 'Die Firma WärmeFix verlangt für die Heizungswartung 25 Euro pro Wohnung.',
        statementTr: 'WärmeFix firması kalorifer bakımı için daire başına 25 Euro ücret talep ediyor.',
        expectedVerdict: 'nicht-im-text',
        explanationTr:
          'Nicht im Text (Metinde yok). Duyuruda bakımın ücreti veya kiracılardan ek ödeme alınıp alınmayacağı konusunda herhangi bir bilgi yer almıyor.',
      },
    ],
    cloze: [
      {
        id: 'a2r-h-cl1',
        promptDe: '___ der Techniker die Zähler ablesen muss, sollten Sie am Vormittag zu Hause sein.',
        hintTr: 'Cümle başında sebep bildiren yan cümle bağlacı (“-dığı için”).',
        options: ['Da', 'Aber', 'Denn', 'Oder'],
        correctOption: 'Da',
        explanationTr:
          '“Da” (çünkü / -dığı için) cümle başında sebep bildirir ve fiili (muss) yan cümlenin sonuna gönderir. (“Denn” cümle başına gelmez ve fiili sona atmaz.)',
      },
      {
        id: 'a2r-h-cl2',
        promptDe: 'Bitte markieren Sie Ihr Fahrrad bis zum 14. November ___ Ihrem Nachnamen.',
        hintTr: '“ile” anlamında ve her zaman Dativ alan edat.',
        options: ['mit', 'für', 'ohne', 'gegen'],
        correctOption: 'mit',
        explanationTr:
          '“mit” edatı her zaman Dativ ister: “mit Ihrem Nachnamen” (soyadınızla).',
      },
      {
        id: 'a2r-h-cl3',
        promptDe: 'Im Treppenhaus ___ aus Sicherheitsgründen keine Kartons stehen.',
        hintTr: 'Yasak / izin olmama bildiren modal fiil (“dürfen” çoğul çekimi).',
        options: ['dürfen', 'wollen', 'mögen', 'fahren'],
        correctOption: 'dürfen',
        explanationTr:
          '“nicht dürfen / keine ... dürfen” Almancada kesin yasak ve apartman kuralı bildirir.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2r-h-mc1',
        questionTr: 'Bisiklet sahipleri 14 Kasım’a kadar ne yapmalıdır?',
        questionDe: 'Was müssen Fahrradbesitzer bis zum 14. November tun?',
        options: [
          'Bisikletlerini merdiven boşluğuna çıkarmalıdır',
          'Bisikletlerini soyadlarıyla etiketlemelidir',
          'Bisiklet deposunun yeni anahtarını almalıdır',
          'Yönetimi telefonla arayıp kayıt yaptırmalıdır',
        ],
        correctIndex: 1,
        explanationTr:
          'Duyuruda “Bitte markieren Sie Ihr Fahrrad bis zum 14. November mit Ihrem Nachnamen.” (Lütfen 14 Kasım’a kadar bisikletinizi soyadınızla işaretleyin) yazıyor.',
      },
      {
        id: 'a2r-h-mc2',
        questionTr: '6 Kasım Çarşamba günü 08.30–13.00 arasında binada ne bekleniyor?',
        questionDe: 'Womit müssen die Bewohner am 6. November vormittags rechnen?',
        options: [
          'Elektrikler tamamen kesilecek ve asansör kapanacaktır',
          'Kalorifer kapalı olacak ve sıcak su yalnızca kısıtlı çalışacaktır',
          'Tüm apartman kapıları boyanacağı için giriş kapalı olacaktır',
          'Bisiklet deposu aynı sabah temizlenecektir',
        ],
        correctIndex: 1,
        explanationTr:
          'İkinci paragrafta “bleibt die Heizung ausgeschaltet, und das warme Wasser funktioniert nur eingeschränkt” bilgisi açıkça veriliyor.',
      },
    ],
  },
  {
    id: 'a2-lesen-stadtfuehrung',
    titleDe: 'Mit dem Fahrrad durch Freiburg',
    titleTr: 'Şehir ve Hizmet Rehberi: Freiburg’da Bisiklet Turu',
    contextLabelTr: 'Şehir & Seyahat',
    subtitleTr:
      'Kısa bir şehir rehberinde bisiklet kiralama ücretlerini, açılış saatlerini, güzergâh önerilerini ve indirimleri inceleyin.',
    cefrFocusTr: 'Komparativ (karşılaştırma) · saat/ücret tabloları · tavsiye ve koşul (wenn)',
    format: 'guide',
    estimatedMinutes: 6,
    imageUrl: imgAsset2,
    imageAlt: 'Seyahat haritası, tren bileti ve şehir rehberi masası',
    document: {
      formatLabelTr: 'Şehir & Hizmet Rehberi',
      formatLabelDe: 'Stadtführer · Mobilität & Freizeit',
      metaRows: [
        {
          labelDe: 'Ort:',
          valueDe: 'Freiburg im Breisgau · Radstation am Hauptbahnhof',
          valueTr: 'Konum: Freiburg · Ana Tren Garı Bisiklet İstasyonu',
        },
        {
          labelDe: 'Öffnungszeiten:',
          valueDe: 'April bis Oktober: täglich 08:00 – 19:00 Uhr',
          valueTr: 'Açılış Saatleri: Nisan–Ekim arası her gün 08:00 – 19:00',
        },
        {
          labelDe: 'Tagespreis:',
          valueDe: 'Stadtrad 14 € · E-Bike 26 € (inkl. Helm & Schloss)',
          valueTr: 'Günlük Ücret: Şehir bisikleti 14 € · E-Bike 26 € (kask ve kilit dâhil)',
        },
        {
          labelDe: 'Ermäßigung:',
          valueDe: '20 % Rabatt für Studierende und Gruppen ab 4 Personen',
          valueTr: 'İndirim: Öğrenciler ve 4+ kişilik gruplar için %20 indirim',
        },
      ],
      paragraphsDe: [
        'Freiburg gehört zu den fahrradfreundlichsten Städten Deutschlands. Viele Besucher entdecken die Altstadt und die grünen Wege entlang der Dreisam lieber mit dem Rad als mit dem Bus, weil man damit schneller und flexibler unterwegs ist.',
        'Direkt neben dem Hauptbahnhof können Sie an der Radstation moderne Stadträder oder E-Bikes mieten. Für die Ausleihe brauchen Sie nur einen gültigen Ausweis; eine Kaution in bar ist nicht nötig. Kinderhelme und Fahrradkörbe erhalten Sie ohne Aufpreis.',
        'Unsere beliebteste Route beginnt am Hauptbahnhof, führt am historischen Münsterplatz vorbei und geht dann zwölf Kilometer gemütlich am Fluss entlang bis zum Seepark. Unterwegs gibt es mehrere kleine Cafés und kostenlose Trinkwasserbrunnen.',
        'Wenn es am Wochenende besonders sonnig ist, empfehlen wir eine Online-Reservierung mindestens einen Tag vorher, da besonders die E-Bikes schon am Vormittag oft ausgebucht sind.',
      ],
      paragraphsTr: [
        'Freiburg, Almanya’nın bisiklet dostu en önemli şehirlerinden biridir. Pek çok ziyaretçi tarihi merkezi ve Dreisam nehri boyunca uzanan yeşil yolları otobüs yerine bisikletle keşfetmeyi tercih eder; çünkü bisikletle daha hızlı ve daha esnek hareket edilir.',
        'Ana tren garının hemen yanındaki bisiklet istasyonundan modern şehir bisikletleri veya elektrikli bisikletler kiralayabilirsiniz. Kiralama için yalnızca geçerli bir kimlik yeterlidir; nakit depozito gerekmez. Çocuk kaskları ve bisiklet sepetleri ek ücret olmadan verilir.',
        'En sevilen rotamız ana tren garında başlar, tarihi Münsterplatz meydanından geçer ve ardından nehir boyunca 12 kilometre boyunca keyifle Seepark’a kadar uzanır. Yol boyunca birkaç küçük kafe ve ücretsiz içme suyu çeşmesi bulunur.',
        'Hafta sonu hava özellikle güneşliyse en az bir gün önceden çevrimiçi rezervasyon yapmanızı öneririz; çünkü özellikle elektrikli bisikletler daha sabah saatlerinde sık sık tükenmektedir.',
      ],
      footerNoteDe: 'Tipp: Bei starkem Regen ist eine kostenlose Stornierung bis 2 Stunden vor Start möglich.',
      footerNoteTr: 'İpucu: Şiddetli yağmur durumunda başlangıçtan 2 saat öncesine kadar ücretsiz iptal mümkündür.',
      readAloudDe:
        'Freiburg gehört zu den fahrradfreundlichsten Städten Deutschlands. Viele Besucher entdecken die Altstadt und die grünen Wege entlang der Dreisam lieber mit dem Rad als mit dem Bus, weil man damit schneller und flexibler unterwegs ist. Direkt neben dem Hauptbahnhof können Sie an der Radstation moderne Stadträder oder E-Bikes mieten. Für die Ausleihe brauchen Sie nur einen gültigen Ausweis; eine Kaution in bar ist nicht nötig. Kinderhelme und Fahrradkörbe erhalten Sie ohne Aufpreis. Unsere beliebteste Route beginnt am Hauptbahnhof, führt am historischen Münsterplatz vorbei und geht dann zwölf Kilometer gemütlich am Fluss entlang bis zum Seepark. Unterwegs gibt es mehrere kleine Cafés und kostenlose Trinkwasserbrunnen. Wenn es am Wochenende besonders sonnig ist, empfehlen wir eine Online-Reservierung mindestens einen Tag vorher, da besonders die E-Bikes schon am Vormittag oft ausgebucht sind.',
    },
    highlightPhrasesDe: [
      'lieber mit dem Rad als mit dem Bus',
      'schneller und flexibler',
      'Kaution',
      'ohne Aufpreis',
      'ausgebucht',
      'Stornierung',
    ],
    glossary: [
      {
        id: 'a2r-s-g1',
        german: 'lieber ... als ...',
        turkish: '... yerine ... tercih etmek',
        noteTr: '“gern” zarfının karşılaştırma (Komparativ) biçimi: gern → lieber → am liebsten.',
      },
      {
        id: 'a2r-s-g2',
        article: 'die',
        german: 'Ausleihe',
        turkish: 'kiralama / ödünç alma',
        noteTr: 'Fiili: ausleihen (ödünç almak / kiralamak).',
      },
      {
        id: 'a2r-s-g3',
        article: 'die',
        german: 'Kaution',
        turkish: 'depozito / güvence bedeli',
        noteTr: 'Ev kiralama ve araç/bisiklet kiralamada temel A2 sözcüğüdür.',
      },
      {
        id: 'a2r-s-g4',
        german: 'ohne Aufpreis',
        turkish: 'ek ücret olmadan / fiyata dâhil',
        noteTr: 'Hizmet rehberlerinde sık geçen kalıp ifade.',
      },
      {
        id: 'a2r-s-g5',
        german: 'ausgebucht sein',
        turkish: 'tamamen dolu olmak / tükenmiş olmak',
        noteTr: 'Otel, tren ve tur rezervasyonlarında sık kullanılır.',
      },
      {
        id: 'a2r-s-g6',
        article: 'die',
        german: 'Stornierung',
        turkish: 'iptal (rezervasyon iptali)',
        noteTr: 'Fiili: stornieren. “kostenlose Stornierung” = ücretsiz iptal.',
      },
    ],
    verdictItems: [
      {
        id: 'a2r-s-tf1',
        statementDe: 'Beim Mieten eines Fahrrads muss man eine Kaution in bar bezahlen.',
        statementTr: 'Bisiklet kiralarken nakit depozito ödenmesi gerekiyor.',
        expectedVerdict: 'falsch',
        explanationTr:
          'Falsch (Yanlış). Rehberde “eine Kaution in bar ist nicht nötig” (nakit depozito gerekli değildir) yazıyor; yalnızca geçerli bir kimlik gerekiyor.',
      },
      {
        id: 'a2r-s-tf2',
        statementDe: 'Eine Gruppe von fünf Freunden bekommt an der Radstation 20 % Rabatt.',
        statementTr: 'Beş kişilik bir arkadaş grubu bisiklet istasyonunda %20 indirim alır.',
        expectedVerdict: 'richtig',
        explanationTr:
          'Richtig (Doğru). İndirim satırında “20 % Rabatt für Studierende und Gruppen ab 4 Personen” (4 kişi ve üzeri gruplara %20 indirim) belirtiliyor; 5 kişi bu koşulu sağlar.',
      },
      {
        id: 'a2r-s-tf3',
        statementDe: 'Im Winter ist die Radstation nur am Samstag und Sonntag geöffnet.',
        statementTr: 'Kışın bisiklet istasyonu yalnızca cumartesi ve pazar günleri açıktır.',
        expectedVerdict: 'nicht-im-text',
        explanationTr:
          'Nicht im Text (Metinde yok). Sadece Nisan–Ekim dönemi açılış saatleri veriliyor; kış aylarındaki çalışma saatlerine dair metinde bilgi bulunmuyor.',
      },
    ],
    cloze: [
      {
        id: 'a2r-s-cl1',
        promptDe: 'Viele Besucher fahren lieber mit dem Fahrrad ___ mit dem Bus.',
        hintTr: 'Komparativ (karşılaştırma) yapısında “…-den daha” anlamı veren bağlaç.',
        options: ['als', 'wie', 'oder', 'denn'],
        correctOption: 'als',
        explanationTr:
          'Eşitsizlik/karşılaştırma bildiren Komparativ (lieber, schneller, größer) yapılarında her zaman “als” kullanılır (“wie” yalnızca eşitlikte kullanılır).',
      },
      {
        id: 'a2r-s-cl2',
        promptDe: 'Mit dem Fahrrad ist man in der Altstadt ___ und flexibler unterwegs.',
        hintTr: '“schnell” sıfatının karşılaştırma (Komparativ) biçimi.',
        options: ['schneller', 'schnellsten', 'schnelle', 'schnell'],
        correctOption: 'schneller',
        explanationTr:
          '“schneller und flexibler” paralel iki Komparativ sıfatıdır (“-er” eki alır).',
      },
      {
        id: 'a2r-s-cl3',
        promptDe: '___ es am Wochenende sonnig ist, sollten Sie das E-Bike vorher reservieren.',
        hintTr: 'Koşul bildiren yan cümle bağlacı (“eğer / …-dığında”).',
        options: ['Wenn', 'Weil', 'Trotzdem', 'Deshalb'],
        correctOption: 'Wenn',
        explanationTr:
          '“Wenn” (eğer / -diğinde) bir koşulu belirtir ve yan cümlenin çekimli fiilini (ist) sona gönderir.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2r-s-mc1',
        questionTr: 'Rehber özellikle güneşli hafta sonları için ne öneriyor?',
        questionDe: 'Was empfiehlt der Stadtführer für besonders sonnige Wochenenden?',
        options: [
          'Seepark’a otobüsle gitmeyi',
          'En az bir gün önceden çevrimiçi rezervasyon yapmayı',
          'Yalnızca saat 17.00’den sonra bisiklet kiralamayı',
          'Kendi kask ve sepetinizi yanınızda getirmenizi',
        ],
        correctIndex: 1,
        explanationTr:
          'Son paragrafta E-Bike’ların sabah saatlerinde hızla tükendiği için en az bir gün önceden çevrimiçi rezervasyon öneriliyor.',
      },
      {
        id: 'a2r-s-mc2',
        questionTr: 'Şiddetli yağmur yağarsa rezervasyonla ilgili hangi hak geçerlidir?',
        questionDe: 'Welche Regel gilt bei starkem Regen?',
        options: [
          'Ücretin yalnızca yarısı iade edilir',
          'Başlangıçtan 2 saat öncesine kadar ücretsiz iptal yapılabilir',
          'Rezervasyon yalnızca gelecek aya ertelenebilir',
          'Yağmurda kiralama bedeli %20 düşer',
        ],
        correctIndex: 1,
        explanationTr:
          'İpucu satırında “Bei starkem Regen ist eine kostenlose Stornierung bis 2 Stunden vor Start möglich.” ifadesi yer alıyor.',
      },
    ],
  },
  {
    id: 'a2-lesen-erfahrungsbericht',
    titleDe: 'Mein erster Monat in Köln',
    titleTr: 'Kişisel Deneyim Raporu: Köln’deki İlk Ayım',
    contextLabelTr: 'Deneyim & Planlar',
    subtitleTr:
      'Köln’de hem akşam kursuna giden hem de yarı zamanlı çalışan bir öğrencinin deneyim ve gelecek planı yazısını analiz edin.',
    cefrFocusTr: 'Perfekt & Präteritum (war/hatte) · obwohl / trotzdem · gelecek planları (vorhaben)',
    format: 'report',
    estimatedMinutes: 7,
    imageUrl: imgAsset3,
    imageAlt: 'Aydınlık çalışma masasında Almanca defterler ve sıcak içecek',
    document: {
      formatLabelTr: 'Kişisel Deneyim Yazısı',
      formatLabelDe: 'Erfahrungsbericht · Lernen & Alltag',
      metaRows: [
        {
          labelDe: 'Autorin:',
          valueDe: 'Selin Aksoy (24, Grafikdesignerin)',
          valueTr: 'Yazar: Selin Aksoy (24, Grafik Tasarımcı)',
        },
        {
          labelDe: 'Stadt:',
          valueDe: 'Köln-Ehrenfeld · Wohngemeinschaft (WG)',
          valueTr: 'Şehir: Köln-Ehrenfeld · Paylaşımlı Öğrenci/Genç Evi (WG)',
        },
        {
          labelDe: 'Kurs:',
          valueDe: 'Abendkurs Deutsch A2 (Mo, Mi, Do · 18:15 – 20:30)',
          valueTr: 'Kurs: Akşam Almanca A2 Kursu (Pzt, Çar, Per · 18:15 – 20:30)',
        },
        {
          labelDe: 'Ziel:',
          valueDe: 'A2-Prüfung im Juli, danach B1 im Herbst',
          valueTr: 'Hedef: Temmuz’da A2 sınavı, sonbaharda B1',
        },
      ],
      paragraphsDe: [
        'Vor vier Wochen bin ich für ein Praktikum nach Köln gezogen. Am Anfang war alles ziemlich aufregend, aber auch ein bisschen anstrengend, weil ich erst ein Zimmer suchen und mich beim Bürgeramt anmelden musste.',
        'Jetzt wohne ich in einer freundlichen Dreier-WG im Viertel Ehrenfeld. Meine Mitbewohner Jonas und Klara sprechen zu Hause fast nur Deutsch mit mir. Obwohl ich manchmal noch nach dem richtigen Wort suche, hilft mir das im Alltag enorm.',
        'Dreimal pro Woche besuche ich nach der Arbeit einen A2-Abendkurs an der Volkshochschule. Das Lesen und Hören fällt mir schon viel leichter als im ersten Monat in der Türkei; nur beim schnellen Sprechen bin ich noch etwas unsicher.',
        'Am Wochenende gehe ich oft mit meiner Lerngruppe in die Stadtbibliothek oder an den Rhein, um gemeinsam Dialoge zu üben. Im Juli möchte ich die A2-Prüfung bestehen, und danach habe ich vor, im Herbst direkt mit dem B1-Kurs weiterzumachen.',
      ],
      paragraphsTr: [
        'Dört hafta önce bir staj için Köln’e taşındım. Başlangıçta her şey oldukça heyecan verici ama biraz da yorucuydu; çünkü önce bir oda aramam ve belediyeye (Bürgeramt) ikamet kaydı yaptırmam gerekti.',
        'Şimdi Ehrenfeld semtinde sıcakkanlı üç kişilik bir paylaşımlı evde (WG) yaşıyorum. Ev arkadaşlarım Jonas ve Klara evde benimle neredeyse yalnızca Almanca konuşuyor. Bazen hâlâ doğru kelimeyi arıyor olsam da bu durum günlük hayatta bana muazzam yardımcı oluyor.',
        'Haftada üç kez işten sonra Halk Eğitim Merkezi’nde (Volkshochschule) bir A2 akşam kursuna katılıyorum. Okuma ve dinleme bana Türkiye’deki ilk ayımdan çok daha kolay geliyor; yalnızca hızlı konuşurken hâlâ biraz tereddütlüyüm.',
        'Hafta sonları birlikte diyalog pratiği yapmak için çalışma grubumla sık sık şehir kütüphanesine veya Ren Nehri kıyısına gidiyorum. Temmuz ayında A2 sınavını geçmek istiyorum ve ardından sonbaharda doğrudan B1 kursuyla devam etmeyi planlıyorum.',
      ],
      footerNoteDe: 'Mein Tipp für A2-Lernende: Jeden Tag 15 Minuten laut lesen macht einen großen Unterschied!',
      footerNoteTr: 'A2 öğrenenler için ipucum: Her gün 15 dakika sesli okumak büyük bir fark yaratıyor!',
      readAloudDe:
        'Vor vier Wochen bin ich für ein Praktikum nach Köln gezogen. Am Anfang war alles ziemlich aufregend, aber auch ein bisschen anstrengend, weil ich erst ein Zimmer suchen und mich beim Bürgeramt anmelden musste. Jetzt wohne ich in einer freundlichen Dreier-WG im Viertel Ehrenfeld. Meine Mitbewohner Jonas und Klara sprechen zu Hause fast nur Deutsch mit mir. Obwohl ich manchmal noch nach dem richtigen Wort suche, hilft mir das im Alltag enorm. Dreimal pro Woche besuche ich nach der Arbeit einen A2-Abendkurs an der Volkshochschule. Das Lesen und Hören fällt mir schon viel leichter als im ersten Monat in der Türkei; nur beim schnellen Sprechen bin ich noch etwas unsicher. Am Wochenende gehe ich oft mit meiner Lerngruppe in die Stadtbibliothek oder an den Rhein, um gemeinsam Dialoge zu üben. Im Juli möchte ich die A2-Prüfung bestehen, und danach habe ich vor, im Herbst direkt mit dem B1-Kurs weiterzumachen.',
    },
    highlightPhrasesDe: [
      'bin ich ... nach Köln gezogen',
      'Obwohl',
      'fällt mir schon viel leichter',
      'um gemeinsam Dialoge zu üben',
      'bestehen',
      'habe ich vor',
    ],
    glossary: [
      {
        id: 'a2r-e-g1',
        german: 'umziehen (ist umgezogen)',
        turkish: 'taşınmak (ev / şehir değiştirmek)',
        noteTr: 'Hareket/yer değişimi bildirdiği için Perfekt’te “sein” yardımcı fiiliyle çekilir.',
      },
      {
        id: 'a2r-e-g2',
        article: 'die',
        german: 'Wohngemeinschaft (WG)',
        turkish: 'paylaşımlı ev (ev arkadaşlarıyla yaşama)',
        noteTr: '“Dreier-WG” = üç kişilik paylaşımlı ev.',
      },
      {
        id: 'a2r-e-g3',
        german: 'obwohl',
        turkish: '-mesine rağmen / gerçi',
        noteTr: 'Zıtlık bildiren yan cümle bağlacıdır; çekimli fiili sona gönderir.',
      },
      {
        id: 'a2r-e-g4',
        german: 'leichtfallen',
        turkish: 'kolay gelmek (Dativ ile)',
        noteTr: '“Das Lesen fällt mir leichter.” = Okuma bana daha kolay geliyor.',
      },
      {
        id: 'a2r-e-g5',
        german: 'eine Prüfung bestehen',
        turkish: 'bir sınavı geçmek / başarmak',
        noteTr: 'Zıttı: durchfallen (sınavdan kalmak).',
      },
      {
        id: 'a2r-e-g6',
        german: 'vorhaben',
        turkish: 'planlamak / niyetinde olmak',
        noteTr: 'Ayrılabilen fiil: “Ich habe vor, ... weiterzumachen.”',
      },
    ],
    verdictItems: [
      {
        id: 'a2r-e-tf1',
        statementDe: 'Selin lebt in Köln allein in einer kleinen Einzimmerwohnung.',
        statementTr: 'Selin Köln’de tek başına küçük bir stüdyo dairede yaşıyor.',
        expectedVerdict: 'falsch',
        explanationTr:
          'Falsch (Yanlış). Metinde “Jetzt wohne ich in einer freundlichen Dreier-WG” (Jonas ve Klara ile üç kişilik paylaşımlı evde) yaşadığı açıkça yazıyor.',
      },
      {
        id: 'a2r-e-tf2',
        statementDe: 'Selin trifft sich am Wochenende häufig mit anderen Lernenden, um Dialoge zu üben.',
        statementTr: 'Selin hafta sonları diyalog pratiği yapmak için sık sık çalışma grubuyla buluşuyor.',
        expectedVerdict: 'richtig',
        explanationTr:
          'Richtig (Doğru). Dördüncü paragrafta hafta sonları çalışma grubuyla (Lerngruppe) şehir kütüphanesine veya Ren kıyısına gidip diyalog çalıştığı belirtiliyor.',
      },
      {
        id: 'a2r-e-tf3',
        statementDe: 'Selins Abendkurs an der Volkshochschule kostet 180 Euro im Monat.',
        statementTr: 'Selin’in Halk Eğitim Merkezi’ndeki akşam kursu aylık 180 Euro tutuyor.',
        expectedVerdict: 'nicht-im-text',
        explanationTr:
          'Nicht im Text (Metinde yok). Kursun günleri, saatleri ve yeri veriliyor ancak kurs ücreti hakkında hiçbir bilgi geçmiyor.',
      },
    ],
    cloze: [
      {
        id: 'a2r-e-cl1',
        promptDe: 'Vor vier Wochen ___ ich für ein Praktikum nach Köln gezogen.',
        hintTr: '“ziehen” (taşınmak) fiilinin Perfekt yapısında kullandığı yardımcı fiil (“sein”).',
        options: ['bin', 'habe', 'war', 'werde'],
        correctOption: 'bin',
        explanationTr:
          'Yer değişikliği bildiren “nach Köln ziehen” fiili Perfekt zamanında “sein” yardımcı fiiliyle çekilir: “bin ... gezogen”.',
      },
      {
        id: 'a2r-e-cl2',
        promptDe: '___ ich manchmal nach einem Wort suche, hilft mir das Deutschsprechen in der WG sehr.',
        hintTr: '“-mesine rağmen” anlamında zıtlık yan cümle bağlacı.',
        options: ['Obwohl', 'Weil', 'Damit', 'Seitdem'],
        correctOption: 'Obwohl',
        explanationTr:
          '“Obwohl” (rağmen) iki durum arasındaki zıtlığı kurar: kelime aramasına rağmen evde Almanca konuşmak çok yardımcı oluyor.',
      },
      {
        id: 'a2r-e-cl3',
        promptDe: 'Wir gehen in die Bibliothek, ___ gemeinsam Dialoge zu üben.',
        hintTr: 'Aynı özneyle amaç bildiren “um ... zu + Infinitiv” kalıbı.',
        options: ['um', 'für', 'als', 'bei'],
        correctOption: 'um',
        explanationTr:
          'Ana cümle ve yan cümle öznesi aynı olduğunda amaç “um ... zu + mastar” ile kurulur: “um gemeinsam Dialoge zu üben”.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2r-e-mc1',
        questionTr: 'Selin hangi dil becerisinde hâlâ kendini biraz güvensiz hissediyor?',
        questionDe: 'Wobei fühlt sich Selin aktuell noch etwas unsicher?',
        options: [
          'Kısa Almanca metinleri okurken',
          'Hızlı konuşurken',
          'Belediyede form doldururken',
          'Dinleme kayıtlarını takip ederken',
        ],
        correctIndex: 1,
        explanationTr:
          'Üçüncü paragrafta okuma ve dinlemenin artık çok daha kolay geldiğini, “nur beim schnellen Sprechen bin ich noch etwas unsicher” (yalnızca hızlı konuşurken biraz tereddütlü) olduğunu yazıyor.',
      },
      {
        id: 'a2r-e-mc2',
        questionTr: 'Selin Temmuz’daki A2 sınavından sonra ne yapmayı planlıyor?',
        questionDe: 'Was hat Selin nach der A2-Prüfung im Juli vor?',
        options: [
          'Sonbaharda doğrudan B1 kursuyla devam etmeyi',
          'Hemen Türkiye’ye dönüp çevrimiçi ders vermeyi',
          'Başka bir şehre taşınıp tek başına yaşamayı',
          'Kurslara bir yıl ara verip sadece çalışmayı',
        ],
        correctIndex: 0,
        explanationTr:
          'Son cümlede “und danach habe ich vor, im Herbst direkt mit dem B1-Kurs weiterzumachen” (sonbaharda doğrudan B1 kursuyla devam etmeyi planlıyorum) diyor.',
      },
    ],
  },
];

export function getA2ReadingScenarioById(id?: string): A2ReadingScenario | undefined {
  if (!id) return undefined;
  return GERMAN_A2_READING_SCENARIOS.find((scenario) => scenario.id === id);
}

export function getA2ReadingExerciseIds(scenario: A2ReadingScenario): string[] {
  return [
    ...scenario.verdictItems.map((q) => q.id),
    ...scenario.cloze.map((q) => q.id),
    ...scenario.multipleChoice.map((q) => q.id),
  ];
}

export const ALL_A2_READING_EXERCISE_IDS: string[] = GERMAN_A2_READING_SCENARIOS.flatMap((s) =>
  getA2ReadingExerciseIds(s)
);

export const TOTAL_A2_READING_EXERCISES: number = ALL_A2_READING_EXERCISE_IDS.length;
