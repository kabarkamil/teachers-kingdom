import type {
  ArenaItem,
  CharadeItem,
  ExamQuestionItem,
  KaraokeTrack,
  QuizQuestionItem,
} from '../types';

/**
 * Curated German CEFR A2 Activities & Exam Bank dataset — Stage 6.
 * Grounded in CEFR A2 vocabulary, Nebensätze (weil, dass, wenn, obwohl),
 * Konnektoren (deshalb, trotzdem, außerdem), Perfekt / Präteritum / Modalverben,
 * and everyday A2 communication (du / Sie).
 */

/**
 * 1. KARAOKE STÜDYOSU (A2) — 3 rhythmic CEFR A2 tracks (6 lines each = 18 lines)
 * Single-grant +15 A2 XP per track; excluded from scored accuracy percentages.
 */
export const GERMAN_A2_KARAOKE_TRACKS: KaraokeTrack[] = [
  {
    id: 'a2-act-karaoke-alltag',
    titleDe: 'Ein neuer Tag im Büro',
    titleTr: 'Ofiste Yeni Bir Gün',
    themeTr: 'İş Hayatı, Randevu Erteleme ve weil / deshalb Bağlaçları',
    tempoLabelTr: '6 Satır · A2 Bağlaç Ritmi',
    lines: [
      {
        id: 'a2-kar-a-1',
        lineNumber: 1,
        textDe: 'Ich stehe früh auf, weil mein Meeting heute um neun beginnt.',
        textTr: 'Toplantım bugün dokuzda başladığı için erken kalkıyorum.',
        rhythmCueDe: 'Ich ste-he FRÜH auf · weil mein MEE-ting um NEUN be-ginnt',
        focusWords: ['weil + fiil sonda', 'das Meeting'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-a-2',
        lineNumber: 2,
        textDe: 'Die S-Bahn hat Verspätung, deshalb nehme ich heute das Fahrrad.',
        textTr: 'S-Bahn gecikti, bu yüzden bugün bisikleti alıyorum.',
        rhythmCueDe: 'Die S-Bahn hat Ver-SPÄ-tung · DES-halb neh-me ich das FAHR-rad',
        focusWords: ['die Verspätung', 'deshalb + fiil 2. sırada'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-a-3',
        lineNumber: 3,
        textDe: 'Könnten wir den Termin bitte auf Donnerstag um elf verschieben?',
        textTr: 'Randevuyu lütfen perşembe saat on bire erteleyebilir miyiz?',
        rhythmCueDe: 'KÖNN-ten wir den Ter-MIN · auf DON-ners-tag ver-SCHIE-ben?',
        focusWords: ['könnten (Konjunktiv II)', 'den Termin verschieben'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-a-4',
        lineNumber: 4,
        textDe: 'Ich finde es toll, dass unsere Kollegen immer hilfsbereit sind.',
        textTr: 'Meslektaşlarımızın her zaman yardımsever olmasını harika buluyorum.',
        rhythmCueDe: 'Ich fin-de es TOLL · dass un-se-re Kol-LE-gen HILFS-be-reit sind',
        focusWords: ['dass + fiil sonda', 'der Kollege'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-a-5',
        lineNumber: 5,
        textDe: 'Wenn ich alle Aufgaben erledige, mache ich pünktlich Feierabend.',
        textTr: 'Tüm görevleri tamamlarsam tam vaktinde paydos ediyorum.',
        rhythmCueDe: 'Wenn ich al-le AUF-ga-ben er-LE-di-ge · ma-che ich FEI-er-a-bend',
        focusWords: ['wenn + fiil sonda', 'die Aufgabe'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-a-6',
        lineNumber: 6,
        textDe: 'Am Abend schalte ich das Handy aus, damit ich mich gut erhole.',
        textTr: 'Akşam iyi dinlenebilmek için cep telefonunu kapatıyorum.',
        rhythmCueDe: 'Am A-bend schal-te ich das HAN-dy aus · da-mit ich mich er-HO-le',
        focusWords: ['ausschalten', 'sich erholen'],
        speakerGender: 'male',
      },
    ],
  },
  {
    id: 'a2-act-karaoke-perfekt',
    titleDe: 'Was ich am Wochenende gemacht habe',
    titleTr: 'Hafta Sonu Neler Yaptım',
    themeTr: 'Perfekt (haben / sein), Boş Zaman ve Deneyim Aktarımı',
    tempoLabelTr: '6 Satır · Perfekt Akış Ritmi',
    lines: [
      {
        id: 'a2-kar-p-1',
        lineNumber: 1,
        textDe: 'Am Samstagmorgen bin ich mit dem Regionalzug an den See gefahren.',
        textTr: 'Cumartesi sabahı bölgesel trenle göle gittim.',
        rhythmCueDe: 'Am SAMS-tag-mor-gen bin ich · an den SEE ge-FAH-ren',
        focusWords: ['bin gefahren (sein)', 'der Ausflug'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-p-2',
        lineNumber: 2,
        textDe: 'Dort habe ich zwei alte Freunde aus dem Sprachkurs getroffen.',
        textTr: 'Orada dil kursundan iki eski arkadaşımla buluştum.',
        rhythmCueDe: 'Dort ha-be ich zwei al-te FREUN-de · ge-TROF-fen',
        focusWords: ['habe getroffen', 'der Sprachkurs'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-p-3',
        lineNumber: 3,
        textDe: 'Wir sind lange spazieren gegangen und haben viele Fotos gemacht.',
        textTr: 'Uzun yürüyüşe çıktık ve çok fotoğraf çektik.',
        rhythmCueDe: 'Wir sind lan-ge spa-ZIE-ren ge-GAN-gen · und ha-ben FO-tos ge-MACHT',
        focusWords: ['sind gegangen', 'haben gemacht'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-p-4',
        lineNumber: 4,
        textDe: 'Obwohl es kurz geregnet hat, war die Stimmung wunderbar.',
        textTr: 'Kısa süreli yağmur yağmasına rağmen ortam harikaydı.',
        rhythmCueDe: 'Ob-WOHL es kurz ge-REG-net hat · war die STIM-mung wun-der-BAR',
        focusWords: ['obwohl + fiil sonda', 'war (Präteritum)'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-p-5',
        lineNumber: 5,
        textDe: 'Am Sonntag konnte ich endlich ausschlafen und ein Buch lesen.',
        textTr: 'Pazar günü nihayet uykumu alabildim ve bir kitap okuyabildim.',
        rhythmCueDe: 'Am SONN-tag KONN-te ich · END-lich aus-SCHLA-fen',
        focusWords: ['konnte (Modal Präteritum)', 'ausschlafen'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-p-6',
        lineNumber: 6,
        textDe: 'Das Wochenende hat mir gut gefallen, weil ich keinen Stress hatte.',
        textTr: 'Hiç stresim olmadığı için hafta sonu çok hoşuma gitti.',
        rhythmCueDe: 'Das WO-chen-en-de hat mir ge-FAL-len · weil ich kei-nen STRESS hat-te',
        focusWords: ['hat mir gefallen', 'hatte (Präteritum)'],
        speakerGender: 'female',
      },
    ],
  },
  {
    id: 'a2-act-karaoke-reise',
    titleDe: 'Unterwegs: Hotel, Arzt und Stadt',
    titleTr: 'Yolda: Otel, Doktor ve Şehir',
    themeTr: 'Seyahat, Sağlık, Kibar İstekler ve Günlük Çözümler (Sie)',
    tempoLabelTr: '6 Satır · Kibar İletişim Ritmi',
    lines: [
      {
        id: 'a2-kar-r-1',
        lineNumber: 1,
        textDe: 'Entschuldigung, die Heizung in meinem Zimmer funktioniert leider nicht.',
        textTr: 'Affedersiniz, odamdaki kalorifer maalesef çalışmıyor.',
        rhythmCueDe: 'Die HEI-zung in mei-nem ZIM-mer · funk-tio-NIERT lei-der NICHT',
        focusWords: ['die Heizung', 'funktionieren'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-r-2',
        lineNumber: 2,
        textDe: 'Wäre es möglich, dass ich heute ein ruhigeres Zimmer bekomme?',
        textTr: 'Bugün daha sakin bir oda almam mümkün müdür acaba?',
        rhythmCueDe: 'WÄ-re es MÖG-lich · dass ich ein RU-hi-ge-res ZIM-mer be-KOM-me?',
        focusWords: ['wäre es möglich', 'Komparativ: ruhiger'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-r-3',
        lineNumber: 3,
        textDe: 'Seit drei Tagen habe ich Halsschmerzen und leichtes Fieber.',
        textTr: 'Üç gündür boğaz ağrım ve hafif ateşim var.',
        rhythmCueDe: 'Seit drei TA-gen ha-be ich · HALS-schmer-zen und FIE-ber',
        focusWords: ['seit + Dativ', 'die Halsschmerzen'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-r-4',
        lineNumber: 4,
        textDe: 'Die Ärztin hat mir ein Rezept gegeben und Ruhe empfohlen.',
        textTr: 'Doktor hanım bana bir reçete verdi ve dinlenmemi tavsiye etti.',
        rhythmCueDe: 'Die ÄRZ-tin hat mir ein Re-ZEPT ge-GE-ben · und RU-he emp-FOH-len',
        focusWords: ['das Rezept', 'empfohlen'],
        speakerGender: 'male',
      },
      {
        id: 'a2-kar-r-5',
        lineNumber: 5,
        textDe: 'Am Hauptbahnhof mussten wir schnell umsteigen, weil Gleis vier voll war.',
        textTr: 'Ana istasyonda 4. peron dolu olduğu için hızlıca aktarma yapmak zorunda kaldık.',
        rhythmCueDe: 'Am HAUPT-bahn-hof MUSS-ten wir · SCHNELL um-STEI-gen',
        focusWords: ['mussten', 'umsteigen'],
        speakerGender: 'female',
      },
      {
        id: 'a2-kar-r-6',
        lineNumber: 6,
        textDe: 'Vielen Dank für Ihre Hilfe, das war wirklich sehr freundlich von Ihnen!',
        textTr: 'Yardımınız için çok teşekkürler, bu gerçekten çok nazikçe oldu!',
        rhythmCueDe: 'Vie-len DANK für Ih-re HIL-fe · sehr FREUND-lich von IH-nen!',
        focusWords: ['für Ihre Hilfe', 'freundlich'],
        speakerGender: 'male',
      },
    ],
  },
];

/**
 * 2. SESSİZ SİNEMA / SCHARADE (A2) — 8 everyday CEFR A2 actions & situations
 */
export const GERMAN_A2_CHARADES: CharadeItem[] = [
  {
    id: 'a2-act-char-1',
    categoryTr: 'İş & Planlama (A2)',
    targetDe: 'den Termin verschieben',
    targetTr: 'randevuyu ertelemek',
    mimeCueTr:
      'Telefonu kulağına götür, duvardaki takvime bak, bir günü elinle çarpılayıp iki gün ileriye doğru kaydırarak işaret et.',
    germanClueDe: 'Ich habe am Dienstag keine Zeit, deshalb möchte ich das Treffen auf Donnerstag legen.',
    grammarHintTr:
      'Ayrılmayan önekli fiil “ver-schieben” (Partizip II: verschoben) + Akkusativ nesne (“den Termin”).',
    options: [
      'den Termin verschieben',
      'die Rechnung bezahlen',
      'das Zimmer aufräumen',
      'den Koffer packen',
    ],
    correctIndex: 0,
    explanationTr:
      '“den Termin verschieben” randevuyu başka bir tarih/saate ertelemek anlamına gelir ve A2 iş/doktor iletişiminde çok sık geçer.',
  },
  {
    id: 'a2-act-char-2',
    categoryTr: 'Kariyer & Ofis (A2)',
    targetDe: 'eine Bewerbung schreiben',
    targetTr: 'iş başvurusu yazmak',
    mimeCueTr:
      'Bilgisayar başında ciddiyetle klavyede yazı yaz, özgeçmişini kontrol eder gibi yap ve “Gönder” tuşuna basıp derin nefes al.',
    germanClueDe: 'Ich suche eine neue Stelle und schicke meinen Lebenslauf per E-Mail an die Firma.',
    grammarHintTr:
      '“-ung” ile biten “die Bewerbung” (iş başvurusu) dişil isimdir; Akkusativ biçimi “eine Bewerbung” olur.',
    options: [
      'ein Rezept abholen',
      'eine Bewerbung schreiben',
      'einen Ausflug buchen',
      'eine Fahrkarte kaufen',
    ],
    correctIndex: 1,
    explanationTr:
      '“eine Bewerbung schreiben / abschicken” iş başvurusu hazırlamak ve göndermek anlamında temel A2 kariyer kalıbıdır.',
  },
  {
    id: 'a2-act-char-3',
    categoryTr: 'Sağlık & İş (A2)',
    targetDe: 'sich krankmelden',
    targetTr: 'hasta olduğunu bildirmek (rapor/izin almak)',
    mimeCueTr:
      'Alnına dokunup ateşin varmış gibi yüzünü buruştur, boğazını tut ve iş yerini arayıp bugün gelemeyeceğini mimikle anlat.',
    germanClueDe: 'Ich habe seit gestern Fieber und rufe morgens im Büro an, weil ich nicht arbeiten kann.',
    grammarHintTr:
      'Ayrılabilen dönüşlü fiil: “Ich melde mich heute krank.” (Partizip II: sich krankgemeldet).',
    options: [
      'sich verlaufen',
      'sich beschweren',
      'sich krankmelden',
      'sich anmelden',
    ],
    correctIndex: 2,
    explanationTr:
      '“sich krankmelden” okula veya iş yerine hastalık nedeniyle gelemeyeceğini bildirmek demektir.',
  },
  {
    id: 'a2-act-char-4',
    categoryTr: 'Seyahat & Ulaşım (A2)',
    targetDe: 'den Zug verpassen',
    targetTr: 'treni kaçırmak',
    mimeCueTr:
      'Bavulunla koşarak perona gel, kol saatine panikle bak, giden trenin arkasından el salla ve omuzlarını düşür.',
    germanClueDe: 'Wir sind zu spät am Bahnhof angekommen und müssen jetzt eine Stunde auf den nächsten warten.',
    grammarHintTr:
      '“verpassen” ayrılmayan fiildir; Perfekt hali “Ich habe den Zug verpasst.” biçimindedir.',
    options: [
      'den Zug verpassen',
      'das Ticket stornieren',
      'im Hotel einchecken',
      'das Fahrrad reparieren',
    ],
    correctIndex: 0,
    explanationTr:
      '“den Zug / den Bus verpassen” treni veya otobüsü kaçırmak demektir (“verpassen” → “verpasst”).',
  },
  {
    id: 'a2-act-char-5',
    categoryTr: 'Otel & Hizmet (A2)',
    targetDe: 'sich über das Zimmer beschweren',
    targetTr: 'oda hakkında şikâyette bulunmak',
    mimeCueTr:
      'Resepsiyon ziline bas, titreyerek kaloriferin soğuk olduğunu göster, sonra kulaklarını tıkayıp gürültüyü işaret et.',
    germanClueDe: 'An der Rezeption sage ich höflich, dass die Heizung kaputt ist und das Zimmer zu laut ist.',
    grammarHintTr:
      'Dönüşlü fiil + sabit edat: “sich beschweren über + Akkusativ” (bir konu hakkında şikâyet etmek).',
    options: [
      'sich für das Geschenk bedanken',
      'sich über das Zimmer beschweren',
      'sich auf den Urlaub freuen',
      'sich mit Freunden treffen',
    ],
    correctIndex: 1,
    explanationTr:
      '“sich beschweren über + Akk.” A2 hizmet, otel ve alışveriş şikâyet senaryolarının ana fiil kalıbıdır.',
  },
  {
    id: 'a2-act-char-6',
    categoryTr: 'Boş Zaman & Planlama (A2)',
    targetDe: 'einen Ausflug planen',
    targetTr: 'günübirlik gezi planlamak',
    mimeCueTr:
      'Büyük bir haritayı masaya aç, iki nokta arasında parmağınla rota çiz, sırt çantanı işaret edip arkadaşına başparmakla onay sor.',
    germanClueDe: 'Am Samstag wollen wir zusammen an den See fahren, deshalb suchen wir eine gute Zugverbindung.',
    grammarHintTr:
      '“der Ausflug” eril isimdir (çoğulu: die Ausflüge); Akkusativ: “einen Ausflug planen / machen”.',
    options: [
      'einen Vertrag kündigen',
      'einen Kurs bestehen',
      'einen Ausflug planen',
      'einen Arzt anrufen',
    ],
    correctIndex: 2,
    explanationTr:
      '“einen Ausflug planen” (bir gezi planlamak) ortak plan yapma (gemeinsam etwas planen) A2 konuşma görevlerinde sık geçer.',
  },
  {
    id: 'a2-act-char-7',
    categoryTr: 'Konut & Şehir (A2)',
    targetDe: 'eine Wohnung besichtigen',
    targetTr: 'bir daireyi gezip incelemek',
    mimeCueTr:
      'Kapıdan içeri gir, tavanlara ve pencerelere bak, odanın genişliğini adımlayarak ölç ve balkondan dışarıyı izle.',
    germanClueDe: 'Wir möchten bald umziehen und schauen uns heute Nachmittag eine helle Dreizimmerwohnung an.',
    grammarHintTr:
      '“besichtigen” ayrılmayan fiildir (Partizip II: besichtigt) ve daima Akkusativ nesne alır.',
    options: [
      'die Miete überweisen',
      'den Schlüssel verlieren',
      'die Nachbarn einladen',
      'eine Wohnung besichtigen',
    ],
    correctIndex: 3,
    explanationTr:
      '“eine Wohnung besichtigen” kiralık veya satılık bir daireyi görmek/incelemek demektir.',
  },
  {
    id: 'a2-act-char-8',
    categoryTr: 'İletişim & Uzlaşma (A2)',
    targetDe: 'einen Vorschlag machen',
    targetTr: 'bir öneride bulunmak',
    mimeCueTr:
      'Düşünür gibi çeneni tut, aniden parmağını kaldırıp aklına harika bir fikir gelmiş gibi iki seçeneği ellerinle göster.',
    germanClueDe: 'Wenn es am Wochenende regnet, können wir ins Museum gehen — was hältst du von dieser Idee?',
    grammarHintTr:
      '“der Vorschlag” eril isimdir (çoğulu: die Vorschläge); kalıp: “einen Vorschlag machen”.',
    options: [
      'einen Vorschlag machen',
      'einen Fehler korrigieren',
      'einen Brief abholen',
      'einen Mantel anprobieren',
    ],
    correctIndex: 0,
    explanationTr:
      '“einen Vorschlag machen” (öneride bulunmak) A2 sözlü ve yazılı diyaloglarda alternatif sunmak için kullanılır.',
  },
];

/**
 * 3. ARENA (A2) — 12 fast CEFR A2 practice items (Streak & 60s speed round)
 */
export const GERMAN_A2_ARENA_ITEMS: ArenaItem[] = [
  {
    id: 'a2-act-arena-1',
    category: 'artikel',
    categoryLabelTr: 'A2 Artikel & Çoğul',
    promptDe: '___ Bewerbung / die ___',
    promptSubTr: '“Bewerbung” (iş başvurusu) için doğru artikel ve çoğul hangisidir?',
    audioTextDe: 'die Bewerbung, die Bewerbungen',
    options: [
      'die Bewerbung · die Bewerbungen',
      'der Bewerbung · die Bewerbunge',
      'das Bewerbung · die Bewerbungs',
    ],
    correctIndex: 0,
    explanationTr:
      '“-ung” ekiyle biten tüm Almanca isimler daima “die” artikeli alır ve çoğulları “-en” ekiyle kurulur: die Bewerbungen.',
  },
  {
    id: 'a2-act-arena-2',
    category: 'ifade',
    categoryLabelTr: 'Yan Cümle (weil)',
    promptDe: 'Ich bleibe heute zu Hause, weil ich starkes Fieber ___.',
    promptSubTr: '“weil” bağlacından sonra fiil doğru biçimde nereye gelir?',
    audioTextDe: 'Ich bleibe heute zu Hause, weil ich starkes Fieber habe.',
    options: ['habe', 'bin', 'hatte gestern'],
    correctIndex: 0,
    explanationTr:
      '“weil” yan cümle bağlacıdır; çekimli fiil (“habe”) cümlenin en sonuna gider.',
  },
  {
    id: 'a2-act-arena-3',
    category: 'ifade',
    categoryLabelTr: 'Bağlaç (deshalb)',
    promptDe: 'Der Zug hat Verspätung, deshalb ___ wir zu spät.',
    promptSubTr: '“deshalb” sonrası doğru fiil sırası hangisidir?',
    audioTextDe: 'Der Zug hat Verspätung, deshalb kommen wir zu spät.',
    options: ['kommen', 'wir kommen', 'gekommen'],
    correctIndex: 0,
    explanationTr:
      '“deshalb” 1. pozisyonda yer alır ve hemen ardından 2. pozisyonda çekimli fiil gelir: “deshalb kommen wir…”.',
  },
  {
    id: 'a2-act-arena-4',
    category: 'anlam',
    categoryLabelTr: 'Perfekt (sein / haben)',
    promptDe: 'Am Samstag ___ wir mit dem Fahrrad an den See gefahren.',
    promptSubTr: 'Hareket bildiren “fahren” fiilinin Perfekt yardımcı fiili hangisidir?',
    audioTextDe: 'Am Samstag sind wir mit dem Fahrrad an den See gefahren.',
    options: ['sind', 'haben', 'waren'],
    correctIndex: 0,
    explanationTr:
      'Yer değiştirme/hareket bildiren “fahren” fiili Perfekt zamanda “sein” yardımcı fiiliyle kurulur: wir sind gefahren.',
  },
  {
    id: 'a2-act-arena-5',
    category: 'artikel',
    categoryLabelTr: 'A2 Artikel & Çoğul',
    promptDe: '___ Rezept / die ___',
    promptSubTr: '“Rezept” (reçete / yemek tarifi) için doğru artikel ve çoğul hangisidir?',
    audioTextDe: 'das Rezept, die Rezepte',
    options: [
      'der Rezept · die Rezepten',
      'das Rezept · die Rezepte',
      'die Rezept · die Rezepts',
    ],
    correctIndex: 1,
    explanationTr:
      '“das Rezept” nötr isimdir ve çoğulu “-e” ekiyle “die Rezepte” olarak yapılır.',
  },
  {
    id: 'a2-act-arena-6',
    category: 'ifade',
    categoryLabelTr: 'Modal Fiil (Präteritum)',
    promptDe: 'Gestern ___ ich leider nicht kommen, weil ich arbeiten musste.',
    promptSubTr: '“können” fiilinin geçmiş (Präteritum) çekimi hangisidir?',
    audioTextDe: 'Gestern konnte ich leider nicht kommen, weil ich arbeiten musste.',
    options: ['kann', 'konnte', 'gekonnt'],
    correctIndex: 1,
    explanationTr:
      'A2 düzeyinde modal fiiller geçmiş zamanda genellikle Präteritum ile kullanılır: ich konnte, ich musste, ich wollte.',
  },
  {
    id: 'a2-act-arena-7',
    category: 'anlam',
    categoryLabelTr: 'Edat + Hal (seit)',
    promptDe: 'Ich wohne seit ___ Jahr in Hamburg.',
    promptSubTr: '“seit” edatı hangi ismi halini ister? (das Jahr)',
    audioTextDe: 'Ich wohne seit einem Jahr in Hamburg.',
    options: ['ein', 'einen', 'einem'],
    correctIndex: 2,
    explanationTr:
      '“seit” edatı daima Dativ ister. “das Jahr” Dativ’de “einem Jahr” biçimine dönüşür.',
  },
  {
    id: 'a2-act-arena-8',
    category: 'ifade',
    categoryLabelTr: 'Kibar İstek (Konjunktiv II)',
    promptDe: '___ Sie mir bitte eine neue Terminbestätigung schicken?',
    promptSubTr: 'Resmî (Sie) iletişimde en kibar A2 rica kalıbı hangisidir?',
    audioTextDe: 'Könnten Sie mir bitte eine neue Terminbestätigung schicken?',
    options: ['Müssen', 'Könnten', 'Schicken'],
    correctIndex: 1,
    explanationTr:
      '“Könnten Sie mir bitte …?” (Bana lütfen … yapabilir misiniz?) A2 resmî yazışma ve telefon görüşmelerinin temel kibarlık kalıbıdır.',
  },
  {
    id: 'a2-act-arena-9',
    category: 'anlam',
    categoryLabelTr: 'A2 Kelime Anlamı',
    promptDe: 'die Überstunde',
    promptSubTr: 'Bu A2 iş hayatı sözcüğünün Türkçe karşılığı nedir?',
    audioTextDe: 'die Überstunde, die Überstunden',
    options: ['fazla mesai', 'yıllık izin', 'maaş zammı', 'öğle molası'],
    correctIndex: 0,
    explanationTr:
      '“die Überstunde” (çoğul: die Überstunden) fazla mesai saati anlamına gelir: “Überstunden machen”.',
  },
  {
    id: 'a2-act-arena-10',
    category: 'ifade',
    categoryLabelTr: 'Koşul (wenn)',
    promptDe: 'Wenn es morgen regnet, ___ wir ins Museum.',
    promptSubTr: 'Yan cümle başta olduğunda ana cümle hangi öğeyle başlar?',
    audioTextDe: 'Wenn es morgen regnet, gehen wir ins Museum.',
    options: ['gehen', 'wir gehen', 'gegangen'],
    correctIndex: 0,
    explanationTr:
      '“Wenn-cümlesi” 1. pozisyonu doldurduğu için ana cümle doğrudan fiille (Verb-Verb kuralı) başlar: “… regnet, gehen wir…”.',
  },
  {
    id: 'a2-act-arena-11',
    category: 'artikel',
    categoryLabelTr: 'A2 Artikel & Çoğul',
    promptDe: '___ Vorschlag / die ___',
    promptSubTr: '“Vorschlag” (öneri) sözcüğünün doğru artikel ve çoğulu hangisidir?',
    audioTextDe: 'der Vorschlag, die Vorschläge',
    options: [
      'der Vorschlag · die Vorschläge',
      'das Vorschlag · die Vorschlage',
      'die Vorschlag · die Vorschlägen',
    ],
    correctIndex: 0,
    explanationTr:
      '“der Vorschlag” eril isimdir ve çoğulda umlaut + “-e” alır: die Vorschläge.',
  },
  {
    id: 'a2-act-arena-12',
    category: 'anlam',
    categoryLabelTr: 'Karşılaştırma (Komparativ)',
    promptDe: 'Der Zug ist ___ als das Auto, aber das Fahrrad ist am ___.',
    promptSubTr: '“schnell” sıfatının karşılaştırma ve üstünlük biçimleri hangisidir?',
    audioTextDe: 'Der Zug ist schneller als das Auto, aber das Flugzeug ist am schnellsten.',
    options: [
      'schnell · schnellste',
      'schneller · schnellsten',
      'mehr schnell · am meisten schnell',
    ],
    correctIndex: 1,
    explanationTr:
      'Almanca’da Komparativ “-er + als” (schneller als), Superlativ ise “am …-sten” (am schnellsten) ile kurulur.',
  },
];

/**
 * 4. QUIZ MERKEZİ (A2) — 12 topic-filtered CEFR A2 questions (3 per topic filter)
 */
export const GERMAN_A2_QUIZ_QUESTIONS: QuizQuestionItem[] = [
  // Topic 1: artikel (Nomen & Artikel — 3 Qs)
  {
    id: 'a2-act-quiz-1',
    topic: 'artikel',
    topicLabelTr: 'Nomen & Artikel',
    questionTr: 'Aşağıdaki cümlede “der Vermieter” (ev sahibi) doğru Akkusativ veya Dativ biçimiyle nasıl kullanılır?',
    promptDe: 'Ich habe gestern mit ___ Vermieter über die Heizung gesprochen.',
    audioTextDe: 'Ich habe gestern mit dem Vermieter über die Heizung gesprochen.',
    options: ['der', 'den', 'dem', 'des'],
    correctIndex: 2,
    explanationTr:
      '“mit” edatı her zaman Dativ ister. Eril “der Vermieter” Dativ’de “dem Vermieter” olur.',
  },
  {
    id: 'a2-act-quiz-2',
    topic: 'artikel',
    topicLabelTr: 'Nomen & Artikel',
    questionTr: '“die Erfahrung” (deneyim) ve “die Verspätung” (gecikme) isimlerinin ortak dilbilgisi kuralı nedir?',
    promptDe: 'die Erfahrung / die Verspätung',
    audioTextDe: 'die Erfahrung, die Erfahrungen; die Verspätung, die Verspätungen',
    options: [
      'İkisi de “-ung” ile biter, artikeli “die” ve çoğulu “-en” olur.',
      'İkisi de “das” artikeli alır ve çoğulda değişmez.',
      'İkisi de “der” artikeli alır ve çoğulu umlautlu “-e” olur.',
      'İkisi de yalnızca tekil kullanılır, çoğul biçimi yoktur.',
    ],
    correctIndex: 0,
    explanationTr:
      '“-ung” ekiyle türeyen tüm Almanca isimler istisnasız dişil (“die”) olur ve çoğulları “-en” ile yapılır.',
  },
  {
    id: 'a2-act-quiz-3',
    topic: 'artikel',
    topicLabelTr: 'Nomen & Artikel',
    questionTr: 'Boşluğa doğru iyelik zamiri ve ismin halini seçin (das Gespräch — görüşme):',
    promptDe: 'Nach ___ Gespräch mit der Chefin habe ich den Vertrag unterschrieben.',
    audioTextDe: 'Nach dem Gespräch mit der Chefin habe ich den Vertrag unterschrieben.',
    options: ['der', 'das', 'den', 'dem'],
    correctIndex: 3,
    explanationTr:
      '“nach” edatı Dativ ister; nötr “das Gespräch” Dativ’de “dem Gespräch” biçimine girer.',
  },

  // Topic 2: grammatik (Grammatik & Nebensätze — 3 Qs)
  {
    id: 'a2-act-quiz-4',
    topic: 'grammatik',
    topicLabelTr: 'Grammatik & Nebensätze',
    questionTr: '“dass” yan cümlesinde doğru sözcük dizilimi hangisidir?',
    promptDe: 'Ich hoffe, dass ___.',
    audioTextDe: 'Ich hoffe, dass du bald wieder gesund wirst.',
    options: [
      'du wirst bald wieder gesund',
      'wirst du bald wieder gesund',
      'du bald wieder gesund wirst',
      'bald wirst du wieder gesund',
    ],
    correctIndex: 2,
    explanationTr:
      '“dass” bir yan cümle bağlacıdır; özne hemen ardından gelir ve çekimli fiil (“wirst”) cümlenin en sonunda yer alır.',
  },
  {
    id: 'a2-act-quiz-5',
    topic: 'grammatik',
    topicLabelTr: 'Grammatik & Nebensätze',
    questionTr: '“weil” ile “deshalb” arasındaki söz dizimi farkını doğru gösteren cümle hangisidir?',
    promptDe: 'Neden: Ich bin müde. Sonuç: Ich gehe früh ins Bett.',
    audioTextDe: 'Ich bin müde, deshalb gehe ich früh ins Bett.',
    options: [
      'Ich bin müde, deshalb ich gehe früh ins Bett.',
      'Ich bin müde, deshalb gehe ich früh ins Bett.',
      'Ich gehe früh ins Bett, weil ich bin müde.',
      'Weil ich bin müde, ich gehe früh ins Bett.',
    ],
    correctIndex: 1,
    explanationTr:
      '“deshalb” bağlacından hemen sonra fiil 2. sıraya gelir (“deshalb gehe ich…”); “weil” kullanıldığında ise fiil sona gider (“weil ich müde bin”).',
  },
  {
    id: 'a2-act-quiz-6',
    topic: 'grammatik',
    topicLabelTr: 'Grammatik & Nebensätze',
    questionTr: 'Ayrılabilen fiil “einladen” (davet etmek) Perfekt zamanda nasıl çekilir?',
    promptDe: 'Wir ___ unsere Nachbarn zum Abendessen ___.',
    audioTextDe: 'Wir haben unsere Nachbarn zum Abendessen eingeladen.',
    options: [
      'sind … eingeladen',
      'haben … geeinladen',
      'haben … eingeladen',
      'sind … geladet',
    ],
    correctIndex: 2,
    explanationTr:
      'Ayrılabilen fiillerde “-ge-” önekle kök arasına girer: ein + ge + laden → “eingeladen”; yardımcı fiil “haben”dir.',
  },

  // Topic 3: alltag (Alltag & Kommunikation — 3 Qs)
  {
    id: 'a2-act-quiz-7',
    topic: 'alltag',
    topicLabelTr: 'Alltag & Kommunikation',
    questionTr: 'Bir arkadaşın hafta sonu davetini kibarca reddedip yeni tarih önermek için en doğal A2 yanıtı hangisidir?',
    promptDe: 'Arkadaşın soruyor: „Hast du am Samstag Zeit für das Konzert?“',
    audioTextDe: 'Tut mir leid, am Samstag kann ich leider nicht, weil meine Eltern zu Besuch kommen. Geht es bei dir am Sonntag?',
    options: [
      'Sehr geehrte Damen und Herren, ich storniere das Konzert.',
      'Tut mir leid, am Samstag kann ich leider nicht, weil meine Eltern kommen. Geht es am Sonntag?',
      'Nein, ich mag keine Termine mit Ihnen.',
      'Mit freundlichen Grüßen, am Samstag ist geschlossen.',
    ],
    correctIndex: 1,
    explanationTr:
      'Arkadaşla iletişimde samimi “du” hitabı, kısa özür + “weil” gerekçesi ve somut alternatif gün önerisi A2 standardına tam uyar.',
  },
  {
    id: 'a2-act-quiz-8',
    topic: 'alltag',
    topicLabelTr: 'Alltag & Kommunikation',
    questionTr: 'Otel resepsiyonunda odadaki Wi-Fi sorununu resmî ve kibar biçimde nasıl bildirirsiniz?',
    promptDe: 'Resepsiyonda (Sie hitabı):',
    audioTextDe: 'Entschuldigung, das WLAN in Zimmer 304 funktioniert leider nicht. Könnten Sie bitte nachsehen?',
    options: [
      'Hey, dein Internet ist kaputt, mach das sofort!',
      'Entschuldigung, das WLAN in Zimmer 304 funktioniert leider nicht. Könnten Sie bitte nachsehen?',
      'Ich habe ein WLAN gekauft, deshalb schlafe ich hier.',
      'Tschüss, das Zimmer hat keinen Bahnhof.',
    ],
    correctIndex: 1,
    explanationTr:
      '“Entschuldigung, … funktioniert leider nicht. Könnten Sie bitte …?” otel ve hizmet durumlarında en uygun A2 “Sie” kalıbıdır.',
  },
  {
    id: 'a2-act-quiz-9',
    topic: 'alltag',
    topicLabelTr: 'Alltag & Kommunikation',
    questionTr: 'Doktor muayenesinde “Üç gündür sırtım ağrıyor” cümlesinin doğru A2 karşılığı hangisidir?',
    promptDe: 'Doktor soruyor: „Seit wann haben Sie die Beschwerden?“',
    audioTextDe: 'Ich habe seit drei Tagen Rückenschmerzen.',
    options: [
      'Ich habe vor drei Tagen Rückenschmerzen gehabt und bin gesund.',
      'Ich habe seit drei Tagen Rückenschmerzen.',
      'Ich habe für drei Tage ein Rezept gekauft.',
      'Mein Rücken arbeitet seit drei Tagen im Büro.',
    ],
    correctIndex: 1,
    explanationTr:
      'Geçmişte başlayıp hâlâ süren durumlar Almanca’da şimdiki zaman (Präsens) + “seit + Dativ” ile anlatılır: “seit drei Tagen”.',
  },

  // Topic 4: verstehen (Hören & Lesen — 3 Qs)
  {
    id: 'a2-act-quiz-10',
    topic: 'verstehen',
    topicLabelTr: 'Hören & Lesen',
    questionTr: 'Kısa apartman duyurusunu okuyun / dinleyin: Çarşamba sabahı ne olacak?',
    promptDe: '„Achtung! Am Mittwoch von 8 bis 11 Uhr wird das Wasser im ganzen Haus abgestellt, weil eine Leitung repariert wird.“',
    audioTextDe: 'Achtung! Am Mittwoch von 8 bis 11 Uhr wird das Wasser im ganzen Haus abgestellt, weil eine Leitung repariert wird.',
    options: [
      'Saat 8 ile 11 arasında tüm binada sular kesilecek.',
      'Çarşamba akşamı apartman toplantısı yapılacak.',
      'Binadaki tüm asansörler yenilenecek.',
      'Su yalnızca zemin katta saat 11’den sonra açılacak.',
    ],
    correctIndex: 0,
    explanationTr:
      '“das Wasser wird abgestellt” suyun kesileceğini, “von 8 bis 11 Uhr” zaman aralığını, “weil eine Leitung repariert wird” ise tamir nedenini belirtir.',
  },
  {
    id: 'a2-act-quiz-11',
    topic: 'verstehen',
    topicLabelTr: 'Hören & Lesen',
    questionTr: 'Kısa istasyon anonsunu dinleyin / okuyun: Yolcular ne yapmalı?',
    promptDe: '„Wichtige Durchsage: Der ICE nach München fährt heute nicht von Gleis 6, sondern von Gleis 9 ab. Bitte beachten Sie die geänderte Abfahrtszeit: 14:25 Uhr.“',
    audioTextDe: 'Wichtige Durchsage: Der ICE nach München fährt heute nicht von Gleis 6, sondern von Gleis 9 ab. Bitte beachten Sie die geänderte Abfahrtszeit: 14 Uhr 25.',
    options: [
      '6. peronda saat 14:00’e kadar beklemeliler.',
      '9. perona geçip saat 14:25 kalkışına dikkat etmeliler.',
      'Münih treni tamamen iptal edildiği için otobüse binmeliler.',
      'Biletlerini gişede ücretsiz yeniletmeliler.',
    ],
    correctIndex: 1,
    explanationTr:
      '“nicht von Gleis 6, sondern von Gleis 9” peron değişikliğini, “geänderte Abfahrtszeit: 14:25 Uhr” ise yeni kalkış saatini bildirir.',
  },
  {
    id: 'a2-act-quiz-12',
    topic: 'verstehen',
    topicLabelTr: 'Hören & Lesen',
    questionTr: 'Aşağıdaki kısa e-postaya göre Frau Weber neden toplantıya katılamıyor?',
    promptDe: '„Liebe Kollegen, ich muss mich für das Teamtreffen heute Nachmittag entschuldigen, weil mein Zug aus Köln eine Stunde Verspätung hat. Ich sende meine Notizen per E-Mail.“',
    audioTextDe: 'Liebe Kollegen, ich muss mich für das Teamtreffen heute Nachmittag entschuldigen, weil mein Zug aus Köln eine Stunde Verspätung hat.',
    options: [
      'Hasta olduğu için doktor randevusuna gidiyor.',
      'Köln’den gelen treni bir saat geciktiği için katılamıyor.',
      'Yıllık izne çıktığı için şehir dışında.',
      'Toplantı yarın sabaha ertelendiği için ofise gelmedi.',
    ],
    correctIndex: 1,
    explanationTr:
      '“weil mein Zug aus Köln eine Stunde Verspätung hat” cümlesi gecikme nedenini doğrudan açıklar.',
  },
];

/**
 * 5. SINAV MODU / SINAV BANKASI (A2) — 16 structured CEFR A2 mock exam questions (4 sections × 4 Qs)
 * Sections: Wortschatz (4), Grammatik (4), Lesen (4), Kommunikation (4)
 */
export const GERMAN_A2_EXAM_QUESTIONS: ExamQuestionItem[] = [
  // SECTION 1: WORTSCHATZ & ARTIKEL (4 Qs)
  {
    id: 'a2-act-exam-1',
    section: 'wortschatz',
    sectionLabelTr: 'Kelime & Artikel',
    sectionLabelDe: 'Wortschatz & Artikel',
    questionTr: 'Bağlama en uygun A2 fiilini seçin:',
    promptDe: 'Ich muss meinen Zahnarzttermin leider ___, weil ich am Dienstag eine Dienstreise habe.',
    audioTextDe: 'Ich muss meinen Zahnarzttermin leider verschieben, weil ich am Dienstag eine Dienstreise habe.',
    options: ['verschieben', 'besichtigen', 'einkaufen', 'verlieren'],
    correctIndex: 0,
    explanationTr:
      '“einen Termin verschieben” randevuyu başka bir zamana ertelemek demektir.',
  },
  {
    id: 'a2-act-exam-2',
    section: 'wortschatz',
    sectionLabelTr: 'Kelime & Artikel',
    sectionLabelDe: 'Wortschatz & Artikel',
    questionTr: 'Doğru isim + çoğul eşleşmesini seçin:',
    promptDe: 'In der großen Stadt gibt es viele interessante ___. (das Angebot)',
    audioTextDe: 'In der großen Stadt gibt es viele interessante Angebote.',
    options: ['Angeboten', 'Angebote', 'Angebots', 'Angeböte'],
    correctIndex: 1,
    explanationTr:
      '“das Angebot” (teklif/fırsat) çoğulda “-e” eki alır: die Angebote (Nominativ/Akkusativ).',
  },
  {
    id: 'a2-act-exam-3',
    section: 'wortschatz',
    sectionLabelTr: 'Kelime & Artikel',
    sectionLabelDe: 'Wortschatz & Artikel',
    questionTr: 'Sağlık bağlamında boşluğa en uygun A2 sözcüğü hangisidir?',
    promptDe: 'Mit diesem ___ können Sie das Medikament in der Apotheke abholen.',
    audioTextDe: 'Mit diesem Rezept können Sie das Medikament in der Apotheke abholen.',
    options: ['Gehalt', 'Rezept', 'Vorschlag', 'Gepäck'],
    correctIndex: 1,
    explanationTr:
      'Eczaneden ilaç almak için doktorun yazdığı belge “das Rezept”tir (Dativ: mit diesem Rezept).',
  },
  {
    id: 'a2-act-exam-4',
    section: 'wortschatz',
    sectionLabelTr: 'Kelime & Artikel',
    sectionLabelDe: 'Wortschatz & Artikel',
    questionTr: 'Cümle anlamına uygun A2 sıfatını seçin:',
    promptDe: 'Unsere neue Wohnung liegt nicht an der Hauptstraße, deshalb ist sie sehr ___.',
    audioTextDe: 'Unsere neue Wohnung liegt nicht an der Hauptstraße, deshalb ist sie sehr ruhig.',
    options: ['pünktlich', 'ruhig', 'krank', 'verspätet'],
    correctIndex: 1,
    explanationTr:
      'Ana cadde üzerinde olmayan bir dairenin “sakin/sessiz” olması “ruhig” sıfatıyla ifade edilir.',
  },

  // SECTION 2: GRAMMATIK & NEBENSÄTZE (4 Qs)
  {
    id: 'a2-act-exam-5',
    section: 'grammatik',
    sectionLabelTr: 'Dilbilgisi & Yan Cümleler',
    sectionLabelDe: 'Grammatik & Nebensätze',
    questionTr: 'Yan cümle kurallarına göre doğru tamamlamayı seçin:',
    promptDe: 'Lukas lernt jeden Abend Deutsch, weil er in Berlin ___.',
    audioTextDe: 'Lukas lernt jeden Abend Deutsch, weil er in Berlin studieren möchte.',
    options: [
      'möchte studieren',
      'studieren möchte',
      'studiert möchte',
      'möchte zu studieren',
    ],
    correctIndex: 1,
    explanationTr:
      '“weil” yan cümlesinde çekimli modal fiil (“möchte”) en sona, mastar fiil (“studieren”) onun hemen önüne gelir: “… studieren möchte”.',
  },
  {
    id: 'a2-act-exam-6',
    section: 'grammatik',
    sectionLabelTr: 'Dilbilgisi & Yan Cümleler',
    sectionLabelDe: 'Grammatik & Nebensätze',
    questionTr: 'Doğru bağlacı seçin (beklenenin aksine / karşıtlık):',
    promptDe: '___ es stark geregnet hat, sind wir spazieren gegangen.',
    audioTextDe: 'Obwohl es stark geregnet hat, sind wir spazieren gegangen.',
    options: ['Deshalb', 'Obwohl', 'Denn', 'Oder'],
    correctIndex: 1,
    explanationTr:
      '“Obwohl” (-e rağmen) karşıtlık bildiren yan cümle bağlacıdır ve fiili cümlenin sonuna gönderir (“geregnet hat”).',
  },
  {
    id: 'a2-act-exam-7',
    section: 'grammatik',
    sectionLabelTr: 'Dilbilgisi & Yan Cümleler',
    sectionLabelDe: 'Grammatik & Nebensätze',
    questionTr: 'Geçmiş zaman (Perfekt) yardımcı fiil ve Partizip II uyumunu seçin:',
    promptDe: 'Letzten Sommer ___ meine Familie nach Wien ___.',
    audioTextDe: 'Letzten Sommer ist meine Familie nach Wien gereist.',
    options: [
      'hat … gereist',
      'ist … gereist',
      'hat … reisen',
      'sind … gereist',
    ],
    correctIndex: 1,
    explanationTr:
      '“meine Familie” tekil öznedir (3. tekil şahıs → “ist”) ve “reisen” hareket fiili olduğu için “sein” ile çekilir: ist gereist.',
  },
  {
    id: 'a2-act-exam-8',
    section: 'grammatik',
    sectionLabelTr: 'Dilbilgisi & Yan Cümleler',
    sectionLabelDe: 'Grammatik & Nebensätze',
    questionTr: 'Dönüşlü fiil + Dativ/Akkusativ bağlamına göre doğru seçeneği bulun:',
    promptDe: 'Ich freue mich schon sehr ___ unseren gemeinsamen Urlaub.',
    audioTextDe: 'Ich freue mich schon sehr auf unseren gemeinsamen Urlaub.',
    options: ['auf', 'mit', 'seit', 'bei'],
    correctIndex: 0,
    explanationTr:
      'Gelecekteki bir olay için heyecanlanmak/sevinmek “sich freuen auf + Akkusativ” kalıbıyla kurulur.',
  },

  // SECTION 3: LESEVERSTEHEN (4 Qs with authentic short A2 context texts)
  {
    id: 'a2-act-exam-9',
    section: 'lesen',
    sectionLabelTr: 'Okuduğunu Anlama',
    sectionLabelDe: 'Leseverstehen',
    contextBoxDe:
      'E-Mail von der Volkshochschule: „Sehr geehrte Kursteilnehmer, der Deutschkurs A2.2 findet ab nächster Woche nicht mehr in Raum 204, sondern in Raum 310 statt. Die Unterrichtszeit (Dienstag und Donnerstag, 18:00–20:15 Uhr) bleibt gleich.“',
    questionTr: 'Halk eğitim merkezinden gelen e-postaya göre gelecek hafta ne değişiyor?',
    promptDe: 'Was ändert sich ab nächster Woche?',
    audioTextDe:
      'Der Deutschkurs A2.2 findet ab nächster Woche nicht mehr in Raum 204, sondern in Raum 310 statt. Die Unterrichtszeit bleibt gleich.',
    options: [
      'Ders günleri Pazartesi ve Çarşamba’ya alınıyor.',
      'Derslik değişiyor (310 numaralı oda), ancak gün ve saat aynı kalıyor.',
      'Kurs saat 18:00 yerine 20:15’te başlayacak.',
      'A2.2 kursu iki haftalığına iptal edildi.',
    ],
    correctIndex: 1,
    explanationTr:
      'Metin yalnızca oda numarasının 204’ten 310’a değiştiğini, ders saatlerinin ise aynı kaldığını (“bleibt gleich”) belirtir.',
  },
  {
    id: 'a2-act-exam-10',
    section: 'lesen',
    sectionLabelTr: 'Okuduğunu Anlama',
    sectionLabelDe: 'Leseverstehen',
    contextBoxDe:
      'Aushang im Fitnessstudio: „Liebe Mitglieder, wegen Renovierungsarbeiten ist die Sauna vom 12. bis 15. Mai geschlossen. Alle Kursräume und Fitnessgeräte können Sie wie gewohnt von 7:00 bis 22:00 Uhr nutzen.“',
    questionTr: 'Spor salonu duyurusuna göre hangi ifade doğrudur?',
    promptDe: 'Welche Aussage ist richtig?',
    audioTextDe:
      'Wegen Renovierungsarbeiten ist die Sauna vom 12. bis 15. Mai geschlossen. Alle Kursräume und Fitnessgeräte können Sie wie gewohnt nutzen.',
    options: [
      '12–15 Mayıs tarihleri arasında tüm spor salonu kapalıdır.',
      'Sauna tadilat nedeniyle kapalı, ancak spor aletleri ve ders salonları açık.',
      'Spor salonu yalnızca sabah 7:00–12:00 arasında hizmet veriyor.',
      'Üyeler sauna için ekstra ücret ödemelidir.',
    ],
    correctIndex: 1,
    explanationTr:
      'Sadece sauna (“die Sauna”) 12–15 Mayıs’ta kapalıdır; diğer tüm alanlar (“wie gewohnt”) normal saatlerinde açıktır.',
  },
  {
    id: 'a2-act-exam-11',
    section: 'lesen',
    sectionLabelTr: 'Okuduğunu Anlama',
    sectionLabelDe: 'Leseverstehen',
    contextBoxDe:
      'Nachricht von Hanna: „Hi! Ich bin gestern mit dem Nachtzug aus Prag zurückgekommen. Die Stadt war wunderschön, aber das Hotel lag direkt an einer lauten Straße, deshalb habe ich schlecht geschlafen. Wollen wir am Freitag Kaffee trinken? Dann zeige ich dir die Fotos!“',
    questionTr: 'Hanna’nın mesajına göre Prag gezisinde onu rahatsız eden neydi?',
    promptDe: 'Warum hat Hanna im Urlaub schlecht geschlafen?',
    audioTextDe:
      'Das Hotel lag direkt an einer lauten Straße, deshalb habe ich schlecht geschlafen.',
    options: [
      'Gece treni çok geç saatte kalktı.',
      'Otel gürültülü bir caddenin hemen üzerinde olduğu için kötü uyudu.',
      'Prag’da hava sürekli yağmurlu ve soğuktu.',
      'Fotoğraf makinesini otelde unuttu.',
    ],
    correctIndex: 1,
    explanationTr:
      '“das Hotel lag direkt an einer lauten Straße, deshalb habe ich schlecht geschlafen” cümlesi nedeni açıkça verir.',
  },
  {
    id: 'a2-act-exam-12',
    section: 'lesen',
    sectionLabelTr: 'Okuduğunu Anlama',
    sectionLabelDe: 'Leseverstehen',
    contextBoxDe:
      'Stadtbibliothek Hinweis: „Sie können Bücher vier Wochen lang ausleihen. Wenn Sie ein Buch länger brauchen, können Sie die Leihfrist zweimal online verlängern — aber nur, wenn niemand das Buch reserviert hat.“',
    questionTr: 'Şehir kütüphanesi kuralına göre bir kitabın ödünç süresi ne zaman çevrimiçi uzatılamaz?',
    promptDe: 'Wann kann man ein Buch NICHT online verlängern?',
    audioTextDe:
      'Sie können die Leihfrist zweimal online verlängern, aber nur, wenn niemand das Buch reserviert hat.',
    options: [
      'Kitap iki haftadan uzun süredir ödünç alındıysa.',
      'Başka bir okuyucu o kitabı rezerve ettiyse.',
      'Okuyucu ilk kez uzatma başvurusu yapıyorsa.',
      'Kitap Almanca dışında bir dildeyse.',
    ],
    correctIndex: 1,
    explanationTr:
      '“aber nur, wenn niemand das Buch reserviert hat” koşulu, başka biri kitabı rezerve ettiyse sürenin uzatılamayacağını gösterir.',
  },

  // SECTION 4: ALLTAG & KOMMUNIKATION (4 Qs)
  {
    id: 'a2-act-exam-13',
    section: 'kommunikation',
    sectionLabelTr: 'Günlük İletişim',
    sectionLabelDe: 'Alltag & Kommunikation',
    questionTr: 'Ev sahibinize (Herr Klein) kalorifer arızası için yazacağınız resmî e-postanın en uygun açılış ve kapanışı hangisidir?',
    promptDe: 'Resmî A2 e-posta (Sie hitabı):',
    audioTextDe: 'Sehr geehrter Herr Klein, ... Mit freundlichen Grüßen',
    options: [
      'Hallo Klein! … Bis bald!',
      'Sehr geehrter Herr Klein, … Mit freundlichen Grüßen',
      'Liebe Frau Klein, … Viele Grüße',
      'Guten Abend du, … Tschüss!',
    ],
    correctIndex: 1,
    explanationTr:
      'Erkek bir muhataba (“Herr Klein”) resmî hitap “Sehr geehrter Herr Klein,” ve resmî kapanış “Mit freundlichen Grüßen” ile yazılır.',
  },
  {
    id: 'a2-act-exam-14',
    section: 'kommunikation',
    sectionLabelTr: 'Günlük İletişim',
    sectionLabelDe: 'Alltag & Kommunikation',
    questionTr: 'Arkadaşın „Sollen wir am Sonntag ins Kino oder lieber ins Theater gehen?“ diye soruyor. Uzlaşmacı ve gerekçeli en iyi A2 yanıtı hangisidir?',
    promptDe: 'Ortak planlama diyaloğu (du):',
    audioTextDe: 'Ich gehe lieber ins Kino, weil dort gerade ein spannender neuer Film läuft. Passt dir 19 Uhr?',
    options: [
      'Ich gehe lieber ins Kino, weil dort gerade ein spannender neuer Film läuft. Passt dir 19 Uhr?',
      'Sehr geehrte Dame, das Theater hat Verspätung.',
      'Ich bin gestern ins Kino gefahren, deshalb hast du kein Ticket.',
      'Ja, ich brauche ein Rezept für Sonntag.',
    ],
    correctIndex: 0,
    explanationTr:
      'Tercih (“lieber”), “weil” gerekçesi ve karşı tarafa saat önerisi (“Passt dir 19 Uhr?”) A2 ortak planlama hedeflerini eksiksiz karşılar.',
  },
  {
    id: 'a2-act-exam-15',
    section: 'kommunikation',
    sectionLabelTr: 'Günlük İletişim',
    sectionLabelDe: 'Alltag & Kommunikation',
    questionTr: 'Bir mağazada aldığınız ceket küçük geldi; değiştirmek için en kibar A2 ifadesi hangisidir?',
    promptDe: 'Mağazada değişim talebi (Sie):',
    audioTextDe: 'Guten Tag, ich habe gestern diese Jacke gekauft, aber sie ist leider zu klein. Kann ich sie gegen Größe L umtauschen?',
    options: [
      'Diese Jacke ist schlecht, gib mir sofort mein Geld!',
      'Guten Tag, ich habe gestern diese Jacke gekauft, aber sie ist leider zu klein. Kann ich sie gegen Größe L umtauschen?',
      'Ich möchte die Jacke heute verschieben, weil sie ruhig ist.',
      'Hast du diese Jacke in der Apotheke gefunden?',
    ],
    correctIndex: 1,
    explanationTr:
      '“umtauschen” (değiştirmek) fiili ve durumu açıklayan kibar soru biçimi A2 alışveriş iletişimine tam uygundur.',
  },
  {
    id: 'a2-act-exam-16',
    section: 'kommunikation',
    sectionLabelTr: 'Günlük İletişim',
    sectionLabelDe: 'Alltag & Kommunikation',
    questionTr: 'İş görüşmesine geç kalacağınızı haber vermek için telefon açtığınızda en doğru A2 cümlesi hangisidir?',
    promptDe: 'Telefonda gecikme bildirimi (Sie):',
    audioTextDe: 'Guten Tag, hier spricht Deniz Kaya. Es tut mir sehr leid, aber meine S-Bahn hat Verspätung. Ich komme etwa 15 Minuten später.',
    options: [
      'Hallo, ich komme einfach morgen oder nächste Woche.',
      'Guten Tag, hier spricht Deniz Kaya. Es tut mir sehr leid, aber meine S-Bahn hat Verspätung. Ich komme etwa 15 Minuten später.',
      'Tschüss, der Zug fährt nicht, deshalb kündige ich.',
      'Könnten Sie mir bitte einen Ausflug planen?',
    ],
    correctIndex: 1,
    explanationTr:
      'Kendini tanıtma (“hier spricht …”), özür (“Es tut mir sehr leid”), gerekçe ve tahmini varış süresi bildirmek A2 resmî telefon görgüsünün temelidir.',
  },
];

export const A2_KARAOKE_IDS = GERMAN_A2_KARAOKE_TRACKS.map((t) => t.id);
export const A2_CHARADE_IDS = GERMAN_A2_CHARADES.map((c) => c.id);
export const A2_ARENA_IDS = GERMAN_A2_ARENA_ITEMS.map((a) => a.id);
export const A2_QUIZ_IDS = GERMAN_A2_QUIZ_QUESTIONS.map((q) => q.id);
export const A2_EXAM_IDS = GERMAN_A2_EXAM_QUESTIONS.map((e) => e.id);

export const ALL_A2_ACTIVITY_IDS: string[] = [
  ...A2_KARAOKE_IDS,
  ...A2_CHARADE_IDS,
  ...A2_ARENA_IDS,
  ...A2_QUIZ_IDS,
  ...A2_EXAM_IDS,
];

export const TOTAL_A2_ACTIVITY_ITEMS = ALL_A2_ACTIVITY_IDS.length; // 3 + 8 + 12 + 12 + 16 = 51
