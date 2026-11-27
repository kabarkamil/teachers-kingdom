import imgAsset1 from '../assets/images/horen_directions_station_1795365331656.jpg';
import imgAsset2 from '../assets/images/horen_shopping_market_1795365328580.jpg';
import imgAsset3 from '../assets/images/topic_family_home_1795362299499.jpg';
import imgAsset4 from '../assets/images/topic_greetings_berlin_1795362296348.jpg';
import type { ListeningScenario } from '../types';

export const GERMAN_A1_LISTENING_SCENARIOS: ListeningScenario[] = [
  {
    id: 'horen-begrussung',
    titleDe: 'Begrüßung & Kennenlernen',
    titleTr: 'Tanışma ve Selamlaşma',
    contextLabelTr: 'Almanca Kursu · Kısa Diyalog',
    subtitleTr: 'İlk gün kurs arkadaşlarıyla tanışma, memleket ve konuşulan diller',
    imageUrl: imgAsset4,
    imageAlt: 'Berlin üniversite avlusunda selamlaşarak tanışan iki öğrenci',
    lines: [
      {
        id: 'bg-l1',
        speaker: 'Lena',
        speakerGender: 'female',
        textDe: 'Guten Morgen! Bist du neu im Deutschkurs?',
        textTr: 'Günaydın! Almanca kursunda yeni misin?',
      },
      {
        id: 'bg-l2',
        speaker: 'Mert',
        speakerGender: 'male',
        textDe: 'Ja, guten Morgen! Ich heiße Mert und komme aus Izmir.',
        textTr: 'Evet, günaydın! Benim adım Mert ve İzmir’den geliyorum.',
      },
      {
        id: 'bg-l3',
        speaker: 'Lena',
        speakerGender: 'female',
        textDe: 'Freut mich, Mert! Mein Name ist Lena. Ich komme aus München.',
        textTr: 'Memnun oldum Mert! Benim adım Lena. Münih’ten geliyorum.',
      },
      {
        id: 'bg-l4',
        speaker: 'Mert',
        speakerGender: 'male',
        textDe: 'Wohnst du jetzt auch hier in Berlin?',
        textTr: 'Şimdi sen de burada Berlin’de mi yaşıyorsun?',
      },
      {
        id: 'bg-l5',
        speaker: 'Lena',
        speakerGender: 'female',
        textDe: 'Ja, ich wohne seit zwei Monaten in Berlin. Welche Sprachen sprichst du?',
        textTr: 'Evet, iki aydır Berlin’de yaşıyorum. Hangi dilleri konuşuyorsun?',
      },
      {
        id: 'bg-l6',
        speaker: 'Mert',
        speakerGender: 'male',
        textDe: 'Ich spreche Türkisch, Englisch und ein bisschen Deutsch.',
        textTr: 'Türkçe, İngilizce ve biraz Almanca konuşuyorum.',
      },
    ],
    trueFalse: [
      {
        id: 'horen-begr-tf-1',
        statementDe: 'Mert kommt aus Berlin.',
        statementTr: 'Mert Berlin’den geliyor.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Mert diyalogda İzmir’den geldiğini söylüyor: "Ich komme aus Izmir."',
      },
      {
        id: 'horen-begr-tf-2',
        statementDe: 'Lena wohnt seit zwei Monaten in Berlin.',
        statementTr: 'Lena iki aydır Berlin’de yaşıyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Lena Münih’ten gelse de iki aydır Berlin’de yaşadığını belirtiyor.',
      },
    ],
    cloze: [
      {
        id: 'horen-begr-cl-1',
        promptDe: 'Ich heiße Mert und ___ aus Izmir.',
        hintTr: 'Memleket belirtmek için kullanılan fiil ("geliyorum")',
        options: ['komme', 'wohne', 'heiße', 'trinke'],
        correctOption: 'komme',
        explanationTr:
          '"aus + şehir/ülke" yapısıyla memleket bildirirken "kommen" fiili kullanılır: "Ich komme aus Izmir."',
      },
      {
        id: 'horen-begr-cl-2',
        promptDe: 'Ich spreche Türkisch, Englisch und ein ___ Deutsch.',
        hintTr: 'Düzey belirtirken kullanılan ifade ("biraz")',
        options: ['bisschen', 'Morgen', 'Name', 'Land'],
        correctOption: 'bisschen',
        explanationTr:
          '"ein bisschen" kalıbı A1 düzeyinde "biraz" anlamına gelir: "ein bisschen Deutsch".',
      },
    ],
    multipleChoice: [
      {
        id: 'horen-begr-mc-1',
        questionTr: 'Lena aslen hangi şehirden geliyor?',
        questionDe: 'Woher kommt Lena?',
        options: ['Münih (München)', 'İzmir', 'Köln', 'Hamburg'],
        correctIndex: 0,
        explanationTr:
          'Lena kendini tanıtırken "Ich komme aus München." diyerek Münih’ten geldiğini ifade ediyor.',
      },
      {
        id: 'horen-begr-mc-2',
        questionTr: 'Mert diyalogda hangi dilleri konuştuğunu söylüyor?',
        questionDe: 'Welche Sprachen spricht Mert?',
        options: [
          'Türkçe, İngilizce ve biraz Almanca',
          'Yalnızca Türkçe ve Almanca',
          'İngilizce ve Fransızca',
          'Sadece Almanca',
        ],
        correctIndex: 0,
        explanationTr:
          'Son replikte Mert açıkça "Ich spreche Türkisch, Englisch und ein bisschen Deutsch." diyor.',
      },
    ],
  },
  {
    id: 'horen-einkaufen',
    titleDe: 'Einkaufen & Preise',
    titleTr: 'Alışveriş ve Fiyatlar',
    contextLabelTr: 'Fırın Tezgâhı · Sipariş ve Ödeme',
    subtitleTr: 'Fırında ekmek, peynirli sandviç ve meyve siparişi ile euro/sent fiyatları',
    imageUrl: imgAsset2,
    imageAlt: 'Fiyat etiketli ekmek sepetleriyle geleneksel bir Alman fırını tezgâhı',
    lines: [
      {
        id: 'ek-l1',
        speaker: 'Verkäuferin',
        speakerGender: 'female',
        textDe: 'Guten Tag! Was möchten Sie heute kaufen?',
        textTr: 'İyi günler! Bugün ne satın almak istersiniz?',
      },
      {
        id: 'ek-l2',
        speaker: 'Kunde',
        speakerGender: 'male',
        textDe: 'Guten Tag! Ich hätte gern ein frisches Brot und zwei Käsebrötchen.',
        textTr: 'İyi günler! Taze bir ekmek ve iki peynirli küçük ekmek rica ediyorum.',
      },
      {
        id: 'ek-l3',
        speaker: 'Verkäuferin',
        speakerGender: 'female',
        textDe: 'Gern! Das Brot kostet drei Euro achtzig. Möchten Sie noch etwas?',
        textTr: 'Memnuniyetle! Ekmek üç euro seksen sent. Başka bir şey ister misiniz?',
      },
      {
        id: 'ek-l4',
        speaker: 'Kunde',
        speakerGender: 'male',
        textDe: 'Ja, bitte noch vier Äpfel. Wie viel kosten die Äpfel?',
        textTr: 'Evet, lütfen dört elma daha. Elmalar ne kadar?',
      },
      {
        id: 'ek-l5',
        speaker: 'Verkäuferin',
        speakerGender: 'female',
        textDe: 'Die vier Äpfel kosten zwei Euro zwanzig. Alles zusammen macht acht Euro vierzig.',
        textTr: 'Dört elma iki euro yirmi sent. Hepsi toplam sekiz euro kırk sent tutuyor.',
      },
      {
        id: 'ek-l6',
        speaker: 'Kunde',
        speakerGender: 'male',
        textDe: 'Hier sind zehn Euro. Vielen Dank und auf Wiedersehen!',
        textTr: 'Buyurun on euro. Çok teşekkürler ve hoşça kalın!',
      },
    ],
    trueFalse: [
      {
        id: 'horen-eink-tf-1',
        statementDe: 'Der Kunde kauft ein Brot und zwei Käsebrötchen.',
        statementTr: 'Müşteri bir ekmek ve iki peynirli küçük ekmek alıyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Müşteri "Ich hätte gern ein frisches Brot und zwei Käsebrötchen." şeklinde sipariş veriyor.',
      },
      {
        id: 'horen-eink-tf-2',
        statementDe: 'Alles zusammen kostet zehn Euro.',
        statementTr: 'Alışverişin toplam tutarı on eurodur.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Toplam tutar 8,40 Euro ("acht Euro vierzig"). Müşteri ödeme için 10 Euro uzatıyor.',
      },
    ],
    cloze: [
      {
        id: 'horen-eink-cl-1',
        promptDe: 'Das Brot ___ drei Euro achtzig.',
        hintTr: 'Fiyat bildirirken kullanılan fiil ("tutuyor / fiyatı ...")',
        options: ['kostet', 'kauft', 'wohnt', 'heißt'],
        correctOption: 'kostet',
        explanationTr:
          'Tekil bir ürünün fiyatını söylerken "kosten" fiili 3. tekil şahısta "kostet" olarak çekimlenir.',
      },
      {
        id: 'horen-eink-cl-2',
        promptDe: 'Alles ___ macht acht Euro vierzig.',
        hintTr: '"Hepsi birlikte / toplamda" anlamındaki sözcük',
        options: ['zusammen', 'morgen', 'geradeaus', 'bitte'],
        correctOption: 'zusammen',
        explanationTr:
          'Kasada toplam tutarı ifade etmek için "Alles zusammen macht ..." kalıbı kullanılır.',
      },
    ],
    multipleChoice: [
      {
        id: 'horen-eink-mc-1',
        questionTr: 'Dört elmanın toplam fiyatı nedir?',
        questionDe: 'Wie viel kosten die vier Äpfel?',
        options: ['2,20 Euro', '3,80 Euro', '8,40 Euro', '1,20 Euro'],
        correctIndex: 0,
        explanationTr:
          'Satıcı "Die vier Äpfel kosten zwei Euro zwanzig." diyerek fiyatın 2,20 Euro olduğunu söylüyor.',
      },
      {
        id: 'horen-eink-mc-2',
        questionTr: 'Müşteri ödeme yapmak için satıcıya ne kadar para veriyor?',
        questionDe: 'Wie viel Geld gibt der Kunde?',
        options: ['10 Euro', '8 Euro', '5 Euro', '20 Euro'],
        correctIndex: 0,
        explanationTr:
          'Son replikte müşteri "Hier sind zehn Euro." diyerek 10 Euro uzatıyor.',
      },
    ],
  },
  {
    id: 'horen-familie',
    titleDe: 'Familie & Alltag',
    titleTr: 'Aile ve Günlük Yaşam',
    contextLabelTr: 'Günlük Sohbet · Hafta Sonu Rutini',
    subtitleTr: 'Pazar kahvaltısı saati, ev halkı ve öğleden sonra aile etkinlikleri',
    imageUrl: imgAsset3,
    imageAlt: 'Aydınlık oturma odasında masa etrafında sohbet eden aile üyeleri',
    lines: [
      {
        id: 'fa-l1',
        speaker: 'Emre',
        speakerGender: 'male',
        textDe: 'Hallo Sofia! Wie verbringt deine Familie den Sonntag?',
        textTr: 'Merhaba Sofia! Ailen pazar gününü nasıl geçiriyor?',
      },
      {
        id: 'fa-l2',
        speaker: 'Sofia',
        speakerGender: 'female',
        textDe: 'Am Sonntag frühstücken wir immer um neun Uhr zusammen.',
        textTr: 'Pazar günü her zaman saat dokuzda birlikte kahvaltı yaparız.',
      },
      {
        id: 'fa-l3',
        speaker: 'Emre',
        speakerGender: 'male',
        textDe: 'Das klingt schön! Wer wohnt alles bei euch?',
        textTr: 'Kulağa hoş geliyor! Evinizde kimler yaşıyor?',
      },
      {
        id: 'fa-l4',
        speaker: 'Sofia',
        speakerGender: 'female',
        textDe: 'Meine Eltern, mein jüngerer Bruder Tim und ich. Meine Großmutter besucht uns oft am Nachmittag.',
        textTr: 'Anne babam, küçük kardeşim Tim ve ben. Büyükannem öğleden sonra sık sık bizi ziyaret eder.',
      },
      {
        id: 'fa-l5',
        speaker: 'Emre',
        speakerGender: 'male',
        textDe: 'Was macht ihr am Nachmittag?',
        textTr: 'Öğleden sonra ne yaparsınız?',
      },
      {
        id: 'fa-l6',
        speaker: 'Sofia',
        speakerGender: 'female',
        textDe: 'Wir trinken Tee oder Kaffee im Wohnzimmer und gehen manchmal im Park spazieren.',
        textTr: 'Oturma odasında çay veya kahve içeriz ve bazen parkta yürüyüşe çıkarız.',
      },
    ],
    trueFalse: [
      {
        id: 'horen-fam-tf-1',
        statementDe: 'Sofias Familie frühstückt am Sonntag um sieben Uhr.',
        statementTr: 'Sofia’nın ailesi pazar günü saat yedide kahvaltı yapar.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Sofia kahvaltıyı saat dokuzda yaptıklarını söylüyor: "um neun Uhr".',
      },
      {
        id: 'horen-fam-tf-2',
        statementDe: 'Sofias Großmutter besucht die Familie oft am Nachmittag.',
        statementTr: 'Sofia’nın büyükannesi öğleden sonra sık sık aileyi ziyaret eder.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Sofia "Meine Großmutter besucht uns oft am Nachmittag." ifadesini kullanıyor.',
      },
    ],
    cloze: [
      {
        id: 'horen-fam-cl-1',
        promptDe: 'Am Sonntag ___ wir immer um neun Uhr zusammen.',
        hintTr: '"Kahvaltı yapmak" anlamındaki fiil',
        options: ['frühstücken', 'arbeiten', 'bezahlen', 'fragen'],
        correctOption: 'frühstücken',
        explanationTr:
          '"frühstücken" fiili "kahvaltı yapmak" demektir ve "wir" öznesiyle mastar hâlinde kullanılır.',
      },
      {
        id: 'horen-fam-cl-2',
        promptDe: 'Wir gehen manchmal im Park ___.',
        hintTr: '"Yürüyüşe çıkmak" (spazieren gehen) kalıbının parçası',
        options: ['spazieren', 'kaufen', 'heißen', 'wohnen'],
        correctOption: 'spazieren',
        explanationTr:
          '"spazieren gehen" Almancada A1 düzeyinin en sık kullanılan günlük etkinlik kalıplarındandır.',
      },
    ],
    multipleChoice: [
      {
        id: 'horen-fam-mc-1',
        questionTr: 'Sofia’nın küçük erkek kardeşinin adı nedir?',
        questionDe: 'Wie heißt Sofias jüngerer Bruder?',
        options: ['Tim', 'Emre', 'Lukas', 'Jonas'],
        correctIndex: 0,
        explanationTr:
          'Sofia evdekileri sayarken "mein jüngerer Bruder Tim" diyerek kardeşinin adını belirtiyor.',
      },
      {
        id: 'horen-fam-mc-2',
        questionTr: 'Aile öğleden sonra oturma odasında ne içiyor?',
        questionDe: 'Was trinken sie am Nachmittag im Wohnzimmer?',
        options: ['Çay veya kahve', 'Sadece soğuk süt', 'Elma suyu', 'Sıcak çorba'],
        correctIndex: 0,
        explanationTr:
          'Son replikte "Wir trinken Tee oder Kaffee im Wohnzimmer" ifadesi geçiyor.',
      },
    ],
  },
  {
    id: 'horen-wegbeschreibung',
    titleDe: 'Wegbeschreibung & Ort',
    titleTr: 'Yön, Yer ve Basit Bilgiler',
    contextLabelTr: 'Merkez Garı Önü · Yol Tarifi',
    subtitleTr: 'Trafik ışığı, dümdüz/sola/sağa yön ifadeleri ve kısa yürüme mesafesi',
    imageUrl: imgAsset1,
    imageAlt: 'Köln Merkez Garı önündeki modern yaya meydanı ve yön tabelaları',
    lines: [
      {
        id: 'wg-l1',
        speaker: 'Reisende',
        speakerGender: 'female',
        textDe: 'Entschuldigung! Können Sie mir helfen? Wo ist die Stadtbibliothek?',
        textTr: 'Affedersiniz! Bana yardımcı olabilir misiniz? Şehir kütüphanesi nerede?',
      },
      {
        id: 'wg-l2',
        speaker: 'Passant',
        speakerGender: 'male',
        textDe: 'Ja, gern! Das ist ganz einfach und nicht weit von hier.',
        textTr: 'Evet, memnuniyetle! Çok kolay ve buradan uzak değil.',
      },
      {
        id: 'wg-l3',
        speaker: 'Reisende',
        speakerGender: 'female',
        textDe: 'Kann ich zu Fuß dorthin gehen?',
        textTr: 'Oraya yürüyerek gidebilir miyim?',
      },
      {
        id: 'wg-l4',
        speaker: 'Passant',
        speakerGender: 'male',
        textDe: 'Ja, gehen Sie zuerst geradeaus bis zur Ampel. Dort biegen Sie links ab.',
        textTr: 'Evet, önce trafik ışığına kadar dümdüz gidin. Oradan sola dönün.',
      },
      {
        id: 'wg-l5',
        speaker: 'Reisende',
        speakerGender: 'female',
        textDe: 'Geradeaus bis zur Ampel und dann links. Und dann?',
        textTr: 'Trafik ışığına kadar dümdüz ve sonra sola. Peki sonra?',
      },
      {
        id: 'wg-l6',
        speaker: 'Passant',
        speakerGender: 'male',
        textDe: 'Nach etwa zweihundert Metern sehen Sie die Bibliothek rechts neben der Apotheke. Es dauert nur fünf Minuten.',
        textTr: 'Yaklaşık iki yüz metre sonra kütüphaneyi sağda, eczanenin yanında göreceksiniz. Sadece beş dakika sürer.',
      },
    ],
    trueFalse: [
      {
        id: 'horen-weg-tf-1',
        statementDe: 'Die Stadtbibliothek ist sehr weit weg.',
        statementTr: 'Şehir kütüphanesi çok uzaktadır.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Yol tarifi veren kişi yerin yakın olduğunu ("nicht weit von hier") ve yürüyerek 5 dakika sürdüğünü söylüyor.',
      },
      {
        id: 'horen-weg-tf-2',
        statementDe: 'Die Bibliothek ist rechts neben der Apotheke.',
        statementTr: 'Kütüphane sağda, eczanenin yanındadır.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Son cümlede "rechts neben der Apotheke" (sağda, eczanenin yanında) bilgisi veriliyor.',
      },
    ],
    cloze: [
      {
        id: 'horen-weg-cl-1',
        promptDe: 'Gehen Sie zuerst ___ bis zur Ampel.',
        hintTr: '"Dümdüz" anlamına gelen yön zarfı',
        options: ['geradeaus', 'zusammen', 'gestern', 'lecker'],
        correctOption: 'geradeaus',
        explanationTr:
          'Yol tariflerinde "gehen Sie geradeaus" (dümdüz gidin) temel A1 kalıbıdır.',
      },
      {
        id: 'horen-weg-cl-2',
        promptDe: 'Dort biegen Sie ___ ab.',
        hintTr: 'Trafik ışığından dönülecek yön ("sola")',
        options: ['links', 'neun', 'warm', 'groß'],
        correctOption: 'links',
        explanationTr:
          'Diyalogda trafik ışığından sola dönülmesi söyleniyor: "Dort biegen Sie links ab."',
      },
    ],
    multipleChoice: [
      {
        id: 'horen-weg-mc-1',
        questionTr: 'Yolcu hangi mekânın yerini soruyor?',
        questionDe: 'Welchen Ort sucht die Reisende?',
        options: [
          'Şehir kütüphanesi (Stadtbibliothek)',
          'Eczane (Apotheke)',
          'Fırın (Bäckerei)',
          'Otobüs durağı (Bushaltestelle)',
        ],
        correctIndex: 0,
        explanationTr:
          'İlk replikte yolcu "Wo ist die Stadtbibliothek?" diyerek şehir kütüphanesini soruyor.',
      },
      {
        id: 'horen-weg-mc-2',
        questionTr: 'Kütüphaneye yürüyerek ulaşmak yaklaşık kaç dakika sürüyor?',
        questionDe: 'Wie lange dauert der Weg zu Fuß?',
        options: ['5 dakika', '20 dakika', '15 dakika', '2 dakika'],
        correctIndex: 0,
        explanationTr:
          'Son replikte sürenin beş dakika olduğu belirtiliyor: "Es dauert nur fünf Minuten."',
      },
    ],
  },
];

export const TOTAL_LISTENING_EXERCISES: number = GERMAN_A1_LISTENING_SCENARIOS.reduce(
  (sum, scenario) =>
    sum + scenario.trueFalse.length + scenario.cloze.length + scenario.multipleChoice.length,
  0
);

export function getListeningScenarioById(id: string): ListeningScenario {
  return (
    GERMAN_A1_LISTENING_SCENARIOS.find((s) => s.id === id) ??
    GERMAN_A1_LISTENING_SCENARIOS[0]
  );
}

export function getScenarioExerciseIds(scenario: ListeningScenario): string[] {
  return [
    ...scenario.trueFalse.map((q) => q.id),
    ...scenario.cloze.map((q) => q.id),
    ...scenario.multipleChoice.map((q) => q.id),
  ];
}
