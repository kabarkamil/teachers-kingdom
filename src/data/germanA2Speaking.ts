import a2ArztImg from '../assets/images/a2_horen_arztpraxis_rezept_1795439826898.jpg';
import a2TerminImg from '../assets/images/a2_horen_termin_buero_1795439784881.jpg';
import a2WochenendeImg from '../assets/images/a2_horen_wochenende_plan_1795439768093.jpg';
import a2ReisenImg from '../assets/images/sprechen_reisen_station_1795389386947.jpg';
import type { A2SpeakingScenario } from '../types';

/**
 * Curated German CEFR A2 Speaking (Sprechen) dataset — Stage 5.
 * 4 authentic CEFR A2 scenarios covering:
 *  1) Gemeinsam ein Wochenende planen (du · Ortak Planlama & Öneri)
 *  2) Einen Termin verschieben & Arbeit (Sie · İş & Randevu Erteleme)
 *  3) Beim Arzt & Gesundheit (Sie · Sağlık & Şikâyet Açıklama)
 *  4) Im Hotel & Unterwegs (Sie · Otel, Seyahat & Deneyim Aktarımı)
 *
 * Each scenario offers 5 unique CEFR A2 speaking tasks:
 *  - 2 Repeat & Shadowing items (A2 connectors, Perfekt, Konjunktiv II)
 *  - 2 Guided Prompt / Experience items (Leitfragen, Redemittel, model answer)
 *  - 1 Multi-turn (4-turn) Interactive A2 Roleplay & Joint Planning dialogue
 * Total: 20 unique A2 speaking tasks (single-grant +10 A2 XP each).
 */
export const GERMAN_A2_SPEAKING_SCENARIOS: A2SpeakingScenario[] = [
  {
    id: 'a2-sprechen-wochenende',
    titleDe: 'Gemeinsam ein Wochenende planen',
    titleTr: 'Ortak Hafta Sonu ve Gezi Planı',
    contextLabelTr: 'Günlük Yaşam · Ortak Planlama (du)',
    subtitleTr:
      'Bir arkadaşla hafta sonu gezisi planlama, öneri sunma, gerekçe bildirme (weil / deshalb) ve uzlaşma kalıpları.',
    cefrFocusTr: 'Öneri & Uzlaşma · weil / deshalb · Perfekt ile geçmiş hafta sonu',
    register: 'du',
    registerLabelTr: 'Samimi Hitap (du)',
    estimatedMinutes: 8,
    imageUrl: a2WochenendeImg,
    imageAlt: 'Hafta sonu gezisi ve ortak planlama yapan iki arkadaş',
    repeatItems: [
      {
        id: 'a2-spr-woch-rep-1',
        phraseDe: 'Wollen wir am Samstag an den See fahren, weil das Wetter sonnig wird?',
        phraseTr: 'Hava güneşli olacağı için cumartesi göle gidelim mi?',
        pronunciationFocusDe: 'weil + fiil sonda (sonnig wird)',
        pronunciationTipTr:
          '“weil” bağlacından sonra çekimli fiil (“wird”) cümlenin en sonuna gider; soru tonlamasını cümlenin sonunda hafifçe yükseltin.',
        speakerGender: 'female',
        selfCheckCriteria: [
          'Model sesi dinleyip cümleyi tek nefeste akıcı biçimde tekrarladım.',
          '“weil ... sonnig wird” yan cümlesinde fiili doğru sırada ve net telaffuz ettim.',
          '“Samstag” ve “Wetter” sözcüklerindeki vurguyu doğru verdim.',
        ],
      },
      {
        id: 'a2-spr-woch-rep-2',
        phraseDe: 'Am Sonntag habe ich leider keine Zeit, deshalb passt mir der Samstag besser.',
        phraseTr: 'Pazar günü maalesef vaktim yok, bu yüzden cumartesi bana daha uygun.',
        pronunciationFocusDe: 'deshalb + fiil 2. sırada (passt mir)',
        pronunciationTipTr:
          '“deshalb” sonrası fiil hemen ikinci sırada gelir (“deshalb passt mir…”); “ch” (ich) ve “s/ss” (passt, besser) seslerini temiz ayırın.',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“habe ich leider keine Zeit” bölümünü doğal ritimle söyledim.',
          '“deshalb passt mir” devrik fiil sırasını takılmadan okudum.',
          'Cümleyi normal (1.0×) hızda kendim de kurabildim.',
        ],
      },
    ],
    promptItems: [
      {
        id: 'a2-spr-woch-prm-1',
        questionDe: 'Was hast du letztes Wochenende gemacht und wie hat es dir gefallen?',
        questionTr: 'Geçen hafta sonu ne yaptın ve nasıl geçti?',
        cuesDe: [
          'Am Samstag bin ich ... gefahren / gegangen',
          'Ich habe ... besucht / getroffen',
          'Es hat mir gut gefallen, weil ...',
        ],
        cuesTr: [
          'Cumartesi günü ... gittim (sein + Partizip II)',
          '... ziyaret ettim / buluştum (haben + Partizip II)',
          'Hoşuma gitti çünkü ... (weil + fiil sonda)',
        ],
        phrases: [
          {
            de: 'Letztes Wochenende bin ich mit Freunden in die Berge gefahren.',
            tr: 'Geçen hafta sonu arkadaşlarla dağa gittim.',
          },
          {
            de: 'Wir haben zusammen gekocht und sind lange spazieren gegangen.',
            tr: 'Birlikte yemek pişirdik ve uzun yürüyüşe çıktık.',
          },
          {
            de: 'Es war sehr entspannend, weil das Wetter wunderbar war.',
            tr: 'Hava harika olduğu için çok dinlendiriciydi.',
          },
        ],
        modelAnswerDe:
          'Letztes Wochenende bin ich mit zwei Freunden an den See gefahren. Wir haben dort gepicknickt und sind am Nachmittag spazieren gegangen. Es hat mir sehr gut gefallen, weil es ruhig und sonnig war.',
        modelAnswerTr:
          'Geçen hafta sonu iki arkadaşımla göle gittim. Orada piknik yaptık ve öğleden sonra yürüyüşe çıktık. Sakin ve güneşli olduğu için çok hoşuma gitti.',
        speakerGender: 'female',
        selfCheckCriteria: [
          'Geçmiş zaman (Perfekt: bin gefahren / habe gemacht) kullanarak en az 2 cümle kurdum.',
          '“weil” veya “deshalb” ile kısa bir gerekçe veya duygu ekledim.',
          'Yanıtımı sesli olarak söyledim ve model yanıtla karşılaştırdım.',
        ],
      },
      {
        id: 'a2-spr-woch-prm-2',
        questionDe: 'Welchen Vorschlag machst du für einen gemeinsamen Ausflug bei Regen?',
        questionTr: 'Yağmurlu havada ortak bir gezi için ne önerirsin?',
        cuesDe: [
          'Wenn es regnet, können wir ...',
          'Ich schlage vor, dass wir ...',
          'Was hältst du davon?',
        ],
        cuesTr: [
          'Yağmur yağarsa ... yapabiliriz (wenn + fiil sonda)',
          '... yapmamızı öneriyorum (dass + fiil sonda)',
          'Bu konuda ne düşünüyorsun?',
        ],
        phrases: [
          {
            de: 'Wenn es regnet, können wir ins Museum oder ins Kino gehen.',
            tr: 'Yağmur yağarsa müzeye veya sinemaya gidebiliriz.',
          },
          {
            de: 'Ich finde die Idee gut, aber ein Café danach wäre noch besser.',
            tr: 'Fikri iyi buluyorum ama sonrasında bir kafe daha da iyi olur.',
          },
          {
            de: 'Was hältst du von meinem Vorschlag?',
            tr: 'Önerim hakkında ne düşünüyorsun?',
          },
        ],
        modelAnswerDe:
          'Wenn es am Samstag regnet, schlage ich vor, dass wir zuerst ins Stadtmuseum gehen. Danach können wir in einem gemütlichen Café Kuchen essen. Was hältst du davon?',
        modelAnswerTr:
          'Cumartesi yağmur yağarsa önce şehir müzesine gitmemizi öneriyorum. Sonrasında rahat bir kafede pasta yiyebiliriz. Ne dersin?',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“wenn” veya “dass” yan cümlesiyle bir alternatif öneri sundum.',
          'En az iki etkinlik önerisi ve karşı tarafa soru (“Was hältst du davon?”) ekledim.',
          'Cümleleri duraksamadan sesli olarak ifade ettim.',
        ],
      },
    ],
    roleplay: {
      id: 'a2-spr-woch-role-1',
      titleDe: 'Ausflug planen: Zug, Uhrzeit und Essen',
      titleTr: 'Gezi Planı: Tren, Saat ve Yiyecek Paylaşımı',
      situationTr:
        'Arkadaşın Lukas ile cumartesi günü Potsdam’a günübirlik bir gezi planlıyorsunuz. Buluşma saatini, ulaşımı ve kimin ne getireceğini ortak kararlaştırın (du hitabı).',
      partnerRoleDe: 'Lukas (Freund)',
      learnerRoleTr: 'Sen (Arkadaş · du)',
      phrases: [
        { de: 'Gute Idee! Wann wollen wir uns treffen?', tr: 'İyi fikir! Ne zaman buluşalım?' },
        { de: 'Um 9 Uhr ist mir zu früh, weil ...', tr: 'Saat 9 benim için çok erken çünkü ...' },
        { de: 'Sollen wir mit dem Zug fahren?', tr: 'Trenle mi gidelim?' },
        { de: 'Ich kann Getränke und Obst mitbringen.', tr: 'İçecek ve meyve getirebilirim.' },
      ],
      turns: [
        {
          id: 'a2-spr-woch-role-1-t1',
          partnerNameDe: 'Lukas',
          partnerGender: 'male',
          partnerLineDe:
            'Hey! Hast du Lust, am Samstag zusammen einen Ausflug nach Potsdam zu machen? Wir könnten schon um 8 Uhr losfahren.',
          partnerLineTr:
            'Selam! Cumartesi birlikte Potsdam’a geziye gitmek ister misin? Sabah 8’de yola çıkabiliriz.',
          learnerCueTr:
            'Fikri beğendiğini söyle; ancak 8’in biraz erken olduğunu “weil” ile gerekçelendirip 10:00 öner.',
          sampleResponseDe:
            'Ja, super Idee! Aber 8 Uhr ist mir ein bisschen zu früh, weil ich am Freitag lange arbeiten muss. Passt dir 10 Uhr am Hauptbahnhof?',
          sampleResponseTr:
            'Evet, harika fikir! Ama 8 benim için biraz erken çünkü cuma geç saate kadar çalışmam gerekiyor. Ana istasyonda saat 10 sana uyar mı?',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-woch-role-1-t2',
          partnerNameDe: 'Lukas',
          partnerGender: 'male',
          partnerLineDe:
            '10 Uhr passt mir prima! Sollen wir mit dem Auto oder lieber mit der S-Bahn fahren?',
          partnerLineTr:
            'Saat 10 bana süper uyar! Arabayla mı yoksa S-Bahn ile mi gitsek?',
          learnerCueTr:
            'Toplu taşımayı (S-Bahn / Zug) tercih ettiğini söyle ve nedenini belirt (park yeri / daha rahat / bilet).',
          sampleResponseDe:
            'Ich fahre lieber mit der S-Bahn, weil man in Potsdam schwer einen Parkplatz findet. Außerdem habe ich schon ein Ticket.',
          sampleResponseTr:
            'S-Bahn ile gitmeyi tercih ederim çünkü Potsdam’da park yeri bulmak zor. Ayrıca zaten biletim var.',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-woch-role-1-t3',
          partnerNameDe: 'Lukas',
          partnerGender: 'male',
          partnerLineDe:
            'Stimmt, die S-Bahn ist viel entspannter. Wollen wir dort im Restaurant essen oder etwas für ein Picknick mitnehmen?',
          partnerLineTr:
            'Doğru, S-Bahn çok daha rahat. Orada restoranda mı yiyelim yoksa piknik için bir şeyler mi götürelim?',
          learnerCueTr:
            'Piknik fikrini seç ve ne getirebileceğini söyle; Lukas’tan da bir şey getirmesini iste.',
          sampleResponseDe:
            'Ein Picknick im Park finde ich toll! Ich kann Sandwiches und Wasser mitbringen. Kannst du vielleicht Obst und eine Decke mitnehmen?',
          sampleResponseTr:
            'Parkta piknik harika olur! Sandviç ve su getirebilirim. Sen de belki meyve ve bir örtü getirebilir misin?',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-woch-role-1-t4',
          partnerNameDe: 'Lukas',
          partnerGender: 'male',
          partnerLineDe:
            'Klar, mache ich gern! Dann treffen wir uns am Samstag um 10 Uhr vor dem Haupteingang. Bis Samstag!',
          partnerLineTr:
            'Tabii, memnuniyetle yaparım! O zaman cumartesi saat 10’da ana girişin önünde buluşuyoruz. Cumartesi görüşürüz!',
          learnerCueTr:
            'Planı onayla, hava durumuna göre küçük bir not ekle ve samimi biçimde vedalaş.',
          sampleResponseDe:
            'Perfekt, abgemacht! Ich freue mich schon darauf. Falls es regnet, schreiben wir uns am Morgen kurz. Bis Samstag!',
          sampleResponseTr:
            'Mükemmel, anlaştık! Şimdiden sabırsızlanıyorum. Yağmur yağarsa sabah kısaca yazışırız. Cumartesi görüşürüz!',
          sampleGender: 'female',
        },
      ],
      selfCheckCriteria: [
        '4 turun tamamında arkadaş rolüne uygun “du” hitabıyla sesli yanıt verdim.',
        'Saat önerisi, ulaşım gerekçesi (“weil”) ve görev paylaşımını eksiksiz dile getirdim.',
        'Partner repliklerini dinleyip doğal diyalog akışıyla karşılık verdim.',
      ],
    },
  },
  {
    id: 'a2-sprechen-termin',
    titleDe: 'Einen Termin verschieben & Arbeit',
    titleTr: 'İş Hayatı ve Randevu Erteleme',
    contextLabelTr: 'İş & Büro · Resmî İletişim (Sie)',
    subtitleTr:
      'Resmî bir görüşme veya kurs randevusunu kibarca erteleme (Konjunktiv II: könnte / würde), gerekçe sunma ve yeni tarih önerme.',
    cefrFocusTr: 'Resmî Hitap (Sie) · könnte / würde · weil / leider · Yeni Tarih',
    register: 'Sie',
    registerLabelTr: 'Resmî Hitap (Sie)',
    estimatedMinutes: 8,
    imageUrl: a2TerminImg,
    imageAlt: 'Ofis masasında takvim ve randevu planlaması',
    repeatItems: [
      {
        id: 'a2-spr-term-rep-1',
        phraseDe: 'Könnten wir unseren Termin am Donnerstag auf nächste Woche verschieben?',
        phraseTr: 'Perşembe günkü randevumuzu gelecek haftaya erteleyebilir miyiz?',
        pronunciationFocusDe: 'Könnten wir ... verschieben? (Kibar rica)',
        pronunciationTipTr:
          '“Könnten” sözcüğündeki “ö” sesini dudakları yuvarlayarak kısa söyleyin; mastar fiil “verschieben” cümlenin sonunda net duyulsun.',
        speakerGender: 'female',
        selfCheckCriteria: [
          '“Könnten wir” kibar başlangıcını doğru “ö” sesiyle söyledim.',
          '“auf nächste Woche verschieben” yapısını tek akışta okudum.',
          'Resmî ve kibar soru tonlaması kullandım.',
        ],
      },
      {
        id: 'a2-spr-term-rep-2',
        phraseDe: 'Es tut mir leid, aber ich muss dringend eine Dienstreise machen.',
        phraseTr: 'Üzgünüm ama acilen bir iş seyahatine çıkmam gerekiyor.',
        pronunciationFocusDe: 'Es tut mir leid · müssen + Infinitiv',
        pronunciationTipTr:
          '“leider / leid” sözcüğündeki “ei” ikili ünlüsünü “ay” gibi, “Dienstreise” içindeki “ie” sesini ise uzun “i” olarak telaffuz edin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          'Özür kalıbını (“Es tut mir leid”) doğal tonda söyledim.',
          '“ie” (Dienst) ve “ei” (Reise) farkını doğru telaffuz ettim.',
          'Model sesi dinledikten sonra akıcı şekilde tekrarladım.',
        ],
      },
    ],
    promptItems: [
      {
        id: 'a2-spr-term-prm-1',
        questionDe: 'Wie sieht ein typischer Arbeits- oder Kurstag bei Ihnen aus?',
        questionTr: 'Tipik bir iş veya kurs gününüz nasıl geçiyor?',
        cuesDe: [
          'Morgens fange ich um ... Uhr an',
          'Ich arbeite / lerne ..., weil ...',
          'Am Abend entspanne ich mich, indem / danach ...',
        ],
        cuesTr: [
          'Sabah saat ...’te başlıyorum (ayrılabilir fiil: anfangen)',
          '... çalışıyorum / öğreniyorum çünkü ...',
          'Akşam ... yaparak dinleniyorum',
        ],
        phrases: [
          {
            de: 'Mein Arbeitstag fängt meistens um halb neun an.',
            tr: 'İş günüm genellikle sekiz buçukta başlıyor.',
          },
          {
            de: 'Zuerst beantworte ich E-Mails, danach habe ich Besprechungen.',
            tr: 'Önce e-postaları yanıtlıyorum, ardından toplantılarım oluyor.',
          },
          {
            de: 'Nach der Arbeit mache ich Sport, weil ich den ganzen Tag sitze.',
            tr: 'Bütün gün oturduğum için işten sonra spor yapıyorum.',
          },
        ],
        modelAnswerDe:
          'Mein Tag fängt um acht Uhr an. Vormittags arbeite ich im Büro oder besuche meinen Deutschkurs. Nachmittags erledige ich meine Aufgaben und abends gehe ich spazieren, weil ich nach der Arbeit frische Luft brauche.',
        modelAnswerTr:
          'Günüm saat sekizde başlıyor. Öğleden önce ofiste çalışıyor veya Almanca kursuma gidiyorum. Öğleden sonra görevlerimi tamamlıyorum ve akşam yürüyüşe çıkıyorum çünkü işten sonra temiz havaya ihtiyacım oluyor.',
        speakerGender: 'female',
        selfCheckCriteria: [
          'Zaman zarfları (“morgens”, “vormittags”, “danach”, “abends”) kullanarak günlük akışımı anlattım.',
          'En az bir ayrılabilir fiil (“anfangen” / “aufstehen”) veya “weil” cümlesi kullandım.',
          'Konuşmamı sesli tamamladım ve model yanıtla kıyasladım.',
        ],
      },
      {
        id: 'a2-spr-term-prm-2',
        questionDe: 'Sie können nicht zu einer wichtigen Besprechung kommen. Wie entschuldigen Sie sich höflich?',
        questionTr: 'Önemli bir toplantıya katılamıyorsunuz. Kibarca nasıl özür dileyip çözüm önerirsiniz?',
        cuesDe: [
          'Es tut mir sehr leid, dass ...',
          'Leider kann ich nicht teilnehmen, weil ...',
          'Ich würde vorschlagen, dass wir ...',
        ],
        cuesTr: [
          '... olduğu için çok üzgünüm (dass + fiil sonda)',
          'Maalesef katılamıyorum çünkü ...',
          '... yapmamızı öneririm (Konjunktiv II)',
        ],
        phrases: [
          {
            de: 'Es tut mir sehr leid, dass ich morgen nicht kommen kann.',
            tr: 'Yarın gelemeyeceğim için çok üzgünüm.',
          },
          {
            de: 'Wäre es möglich, das Gespräch am Freitag nachzuholen?',
            tr: 'Görüşmeyi cuma günü telafi etmemiz mümkün olur mu?',
          },
          {
            de: 'Vielen Dank für Ihr Verständnis.',
            tr: 'Anlayışınız için çok teşekkür ederim.',
          },
        ],
        modelAnswerDe:
          'Es tut mir sehr leid, dass ich morgen nicht an der Besprechung teilnehmen kann, weil ich einen wichtigen Arzttermin habe. Wäre es möglich, das Gespräch am Freitagvormittag nachzuholen? Vielen Dank für Ihr Verständnis.',
        modelAnswerTr:
          'Önemli bir doktor randevum olduğu için yarınki toplantıya katılamayacağım için çok üzgünüm. Görüşmeyi cuma sabahı telafi etmemiz mümkün olur mu? Anlayışınız için çok teşekkür ederim.',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“Sie” resmî hitabını koruyarak özür + gerekçe + alternatif öneri sundum.',
          '“dass” veya “weil” bağlacında fiili cümle sonunda kullandım.',
          'Kibar kapanış ifadesi (“Vielen Dank für Ihr Verständnis”) ekledim.',
        ],
      },
    ],
    roleplay: {
      id: 'a2-spr-term-role-1',
      titleDe: 'Telefonat: Beratungstermin verschieben',
      titleTr: 'Telefon Görüşmesi: Danışmanlık Randevusunu Erteleme',
      situationTr:
        'Dil okulu sekreterliğini arıyorsunuz. Yarın saat 14:00’teki A2 seviye belirleme ve danışmanlık randevunuzu iş yoğunluğu nedeniyle ertelemeniz gerekiyor (Sie hitabı).',
      partnerRoleDe: 'Frau Weber (Sekretariat)',
      learnerRoleTr: 'Siz (Kursiyer · Sie)',
      phrases: [
        { de: 'Guten Tag, mein Name ist ...', tr: 'İyi günler, benim adım ...' },
        { de: 'Ich rufe an, weil ich meinen Termin verschieben muss.', tr: 'Randevumu ertelemem gerektiği için arıyorum.' },
        { de: 'Hätten Sie am ... noch etwas frei?', tr: '... günü boş vaktiniz olur mu?' },
        { de: 'Vielen Dank für Ihre Hilfe!', tr: 'Yardımınız için çok teşekkürler!' },
      ],
      turns: [
        {
          id: 'a2-spr-term-role-1-t1',
          partnerNameDe: 'Frau Weber',
          partnerGender: 'female',
          partnerLineDe:
            'Sprachschule Zentrum, Weber am Apparat. Guten Tag, was kann ich für Sie tun?',
          partnerLineTr:
            'Zentrum Dil Okulu, Weber hatta. İyi günler, size nasıl yardımcı olabilirim?',
          learnerCueTr:
            'Kibarca selamla, adını söyle ve yarın saat 14:00’teki randevunu ertelemek istediğini “weil” ile açıkla.',
          sampleResponseDe:
            'Guten Tag, Frau Weber. Ich rufe an, weil ich meinen Beratungstermin morgen um 14 Uhr leider verschieben muss. Ich habe kurzfristig eine wichtige Aufgabe bei der Arbeit bekommen.',
          sampleResponseTr:
            'İyi günler Bayan Weber. Yarın saat 14:00’teki danışmanlık randevumu maalesef ertelemem gerektiği için arıyorum. İşte son anda önemli bir görev aldım.',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-term-role-1-t2',
          partnerNameDe: 'Frau Weber',
          partnerGender: 'female',
          partnerLineDe:
            'Kein Problem, das kann passieren. Wann passt es Ihnen denn in dieser oder nächster Woche besser?',
          partnerLineTr:
            'Sorun değil, olabilir. Bu hafta veya gelecek hafta ne zaman size daha uygun olur?',
          learnerCueTr:
            'Perşembe öğleden sonra veya cuma sabahı müsait olup olmadığını kibarca (“Hätten Sie…” / “Könnten wir…”) sor.',
          sampleResponseDe:
            'Hätten Sie vielleicht am Donnerstag ab 16 Uhr oder am Freitagvormittag noch einen Termin frei?',
          sampleResponseTr:
            'Acaba perşembe saat 16:00’dan sonra veya cuma sabahı boş bir randevunuz olur mu?',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-term-role-1-t3',
          partnerNameDe: 'Frau Weber',
          partnerGender: 'female',
          partnerLineDe:
            'Am Donnerstag ist leider schon alles voll, aber am Freitag um 10:30 Uhr habe ich noch etwas frei. Geht das bei Ihnen?',
          partnerLineTr:
            'Perşembe maalesef tamamen dolu ama cuma saat 10:30’da boş yerim var. Size uygun mu?',
          learnerCueTr:
            'Cuma 10:30’u onayla ve yanında getirmen gereken bir belge olup olmadığını sor.',
          sampleResponseDe:
            'Ja, Freitag um 10:30 Uhr passt mir sehr gut! Muss ich für das Gespräch bestimmte Unterlagen oder meinen Ausweis mitbringen?',
          sampleResponseTr:
            'Evet, cuma saat 10:30 bana çok uygun! Görüşme için belirli belgeler veya kimliğimi getirmem gerekiyor mu?',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-term-role-1-t4',
          partnerNameDe: 'Frau Weber',
          partnerGender: 'female',
          partnerLineDe:
            'Bitte bringen Sie Ihren Ausweis und das Ergebnis Ihres A1-Tests mit. Dann trage ich Sie für Freitag, 10:30 Uhr ein.',
          partnerLineTr:
            'Lütfen kimliğinizi ve A1 testinizin sonucunu getirin. O zaman sizi cuma 10:30 için kaydediyorum.',
          learnerCueTr:
            'Bilgi ve yardım için teşekkür et, cuma günü görüşeceğinizi belirtip resmî vedalaş.',
          sampleResponseDe:
            'Wunderbar, ich bringe alles mit. Vielen Dank für Ihre freundliche Hilfe und bis Freitag! Auf Wiederhören.',
          sampleResponseTr:
            'Harika, hepsini getireceğim. Nazik yardımınız için çok teşekkürler, cuma görüşmek üzere! İyi günler (telefonda).',
          sampleGender: 'male',
        },
      ],
      selfCheckCriteria: [
        'Telefon görüşmesinde baştan sona “Sie” resmî hitabını ve kibar kalıpları kullandım.',
        'Gerekçe bildirme, alternatif saat sorma ve gerekli belgeleri teyit etme adımlarını tamamladım.',
        'Telefonda kapanış için “Auf Wiederhören” kalıbını doğru kullandım.',
      ],
    },
  },
  {
    id: 'a2-sprechen-arzt',
    titleDe: 'Beim Arzt & Gesundheit',
    titleTr: 'Doktorda ve Sağlık Görüşmesi',
    contextLabelTr: 'Sağlık · Şikâyet & Tavsiye (Sie)',
    subtitleTr:
      'Şikâyet süresini “seit + Dativ” ile anlatma, ilaç/reçete ve rapor (Krankschreibung) sorma ile doktor tavsiyelerini anlama.',
    cefrFocusTr: 'seit + Dativ · modal fiiller (sollen / dürfen) · Sağlık Redemittel',
    register: 'Sie',
    registerLabelTr: 'Resmî Hitap (Sie)',
    estimatedMinutes: 8,
    imageUrl: a2ArztImg,
    imageAlt: 'Doktor muayenehanesi ve sağlık danışma masası',
    repeatItems: [
      {
        id: 'a2-spr-arzt-rep-1',
        phraseDe: 'Seit drei Tagen habe ich starke Halsschmerzen und leichtes Fieber.',
        phraseTr: 'Üç gündür şiddetli boğaz ağrım ve hafif ateşim var.',
        pronunciationFocusDe: 'seit + Dativ Plural (seit drei Tagen)',
        pronunciationTipTr:
          '“seit” edatından sonra çoğul isim Dativ “-n” eki alır (“Tagen”); şimdiki zaman (“habe”) hâlâ süren durumlar için kullanılır.',
        speakerGender: 'female',
        selfCheckCriteria: [
          '“Seit drei Tagen” yapısını (Dativ -n ekiyle) net telaffuz ettim.',
          '“Halsschmerzen” ve “Fieber” bileşik/uzun ünlü sözcüklerini doğru okudum.',
          'Cümleyi 0.8× ve 1.0× hızda akıcı tekrarladım.',
        ],
      },
      {
        id: 'a2-spr-arzt-rep-2',
        phraseDe: 'Wie oft am Tag soll ich die Tabletten einnehmen?',
        phraseTr: 'Hapları günde kaç kez almam gerekiyor?',
        pronunciationFocusDe: 'sollen + ayrılabilir fiil mastarı (einnehmen)',
        pronunciationTipTr:
          '“soll ich” modal fiil sorusunda “einnehmen” ayrılmadan cümle sonunda kalır; “ein-” önekine hafif vurgu yapın.',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“Wie oft am Tag” soru başlangıcını doğru ritimle söyledim.',
          '“soll ich ... einnehmen” cümle çerçevesini bozmadan tekrarladım.',
          'Soru cümlesi tonlamasını net verdim.',
        ],
      },
    ],
    promptItems: [
      {
        id: 'a2-spr-arzt-prm-1',
        questionDe: 'Was machen Sie, um im Alltag gesund und fit zu bleiben?',
        questionTr: 'Günlük yaşamda sağlıklı ve zinde kalmak için neler yapıyorsunuz?',
        cuesDe: [
          'Um gesund zu bleiben, ...',
          'Ich achte darauf, dass ich ...',
          'Obwohl ich viel arbeite, ...',
        ],
        cuesTr: [
          'Sağlıklı kalmak için ... (um ... zu)',
          '... yapmaya dikkat ediyorum (dass + fiil sonda)',
          'Çok çalışmama rağmen ... (obwohl + fiil sonda)',
        ],
        phrases: [
          {
            de: 'Ich trinke viel Wasser und koche meistens frisch.',
            tr: 'Bol su içiyorum ve genellikle taze yemek pişiriyorum.',
          },
          {
            de: 'Obwohl ich wenig Zeit habe, gehe ich dreimal pro Woche spazieren.',
            tr: 'Az vaktim olmasına rağmen haftada üç kez yürüyüşe çıkıyorum.',
          },
          {
            de: 'Außerdem versuche ich, genug zu schlafen.',
            tr: 'Ayrıca yeterince uyumaya çalışıyorum.',
          },
        ],
        modelAnswerDe:
          'Um gesund zu bleiben, gehe ich dreimal pro Woche joggen oder spazieren. Ich achte darauf, dass ich viel Gemüse esse und genug Wasser trinke. Obwohl mein Alltag oft stressig ist, versuche ich, mindestens sieben Stunden zu schlafen.',
        modelAnswerTr:
          'Sağlıklı kalmak için haftada üç kez koşuya veya yürüyüşe çıkıyorum. Bol sebze yemeye ve yeterince su içmeye dikkat ediyorum. Günlük yaşamım sık sık stresli olmasına rağmen en az yedi saat uyumaya çalışıyorum.',
        speakerGender: 'female',
        selfCheckCriteria: [
          'Beslenme, hareket veya uyku hakkında en az 2 A2 cümlesi kurdum.',
          '“weil”, “dass” veya “obwohl” bağlacından en az birini doğru fiil sırasıyla kullandım.',
          'Yanıtımı sesli söyledim ve model yanıtla karşılaştırdım.',
        ],
      },
      {
        id: 'a2-spr-arzt-prm-2',
        questionDe: 'Eine Freundin hat sich erkältet. Welche Tipps geben Sie ihr?',
        questionTr: 'Bir arkadaşınız üşütmüş. Ona hangi tavsiyeleri verirsiniz?',
        cuesDe: [
          'Du solltest ...',
          'Es ist wichtig, dass du ...',
          'Wenn es nicht besser wird, ...',
        ],
        cuesTr: [
          '... yapmalısın (solltest + Infinitiv)',
          '... yapman önemli (dass + fiil sonda)',
          'Daha iyi olmazsa ... (wenn + fiil sonda)',
        ],
        phrases: [
          {
            de: 'Du solltest im Bett bleiben und warmen Kräutertee trinken.',
            tr: 'Yatakta kalmalı ve sıcak bitki çayı içmelisin.',
          },
          {
            de: 'Es ist wichtig, dass du dich gut ausruhst.',
            tr: 'İyice dinlenmen önemli.',
          },
          {
            de: 'Gute Besserung! Wenn du Hilfe beim Einkaufen brauchst, sag Bescheid.',
            tr: 'Geçmiş olsun! Alışverişte yardıma ihtiyacın olursa haber ver.',
          },
        ],
        modelAnswerDe:
          'Gute Besserung! Du solltest viel warmen Tee mit Honig trinken und ein paar Tage zu Hause bleiben. Es ist wichtig, dass du dich ausruhst. Wenn das Fieber morgen nicht weg ist, solltest du unbedingt zum Arzt gehen.',
        modelAnswerTr:
          'Geçmiş olsun! Bol ballı sıcak çay içmeli ve birkaç gün evde kalmalısın. Dinlenmen çok önemli. Yarın ateşin düşmezse mutlaka doktora gitmelisin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“solltest” veya “es ist wichtig, dass…” kalıbıyla en az iki tavsiye verdim.',
          'Koşul cümlesi (“Wenn…”) ve geçmiş olsun dileği (“Gute Besserung”) ekledim.',
          'Cümleleri sesli olarak akıcı biçimde ifade ettim.',
        ],
      },
    ],
    roleplay: {
      id: 'a2-spr-arzt-role-1',
      titleDe: 'In der Arztpraxis: Symptome & Rezept',
      titleTr: 'Muayenehanede: Şikâyetler ve Reçete',
      situationTr:
        'Aile hekiminize geldiniz. Üç gündür süren soğuk algınlığı şikâyetlerinizi anlatın, ilaç kullanımını ve iş yeri için sağlık raporunu (Krankschreibung) sorun (Sie hitabı).',
      partnerRoleDe: 'Dr. Lindner (Arzt)',
      learnerRoleTr: 'Siz (Hasta · Sie)',
      phrases: [
        { de: 'Seit drei Tagen habe ich Husten und Kopfschmerzen.', tr: 'Üç gündür öksürüğüm ve baş ağrım var.' },
        { de: 'Ich fühle mich sehr müde und kann schlecht schlafen.', tr: 'Kendimi çok yorgun hissediyorum ve zor uyuyorum.' },
        { de: 'Wie soll ich das Medikament einnehmen?', tr: 'İlacı nasıl kullanmalıyım?' },
        { de: 'Könnten Sie mir bitte eine Krankschreibung geben?', tr: 'Bana bir sağlık raporu verebilir misiniz?' },
      ],
      turns: [
        {
          id: 'a2-spr-arzt-role-1-t1',
          partnerNameDe: 'Dr. Lindner',
          partnerGender: 'male',
          partnerLineDe:
            'Guten Tag! Nehmen Sie bitte Platz. Was fehlt Ihnen denn und seit wann haben Sie die Beschwerden?',
          partnerLineTr:
            'İyi günler! Lütfen oturun. Neyiniz var ve şikâyetleriniz ne zamandan beri sürüyor?',
          learnerCueTr:
            'Doktoru selamla, şikâyetlerini (boğaz ağrısı/öksürük/yorgunluk) ve süresini (“seit drei Tagen”) anlat.',
          sampleResponseDe:
            'Guten Tag, Herr Doktor. Seit drei Tagen habe ich starke Halsschmerzen, Husten und ein bisschen Fieber. Außerdem bin ich sehr müde.',
          sampleResponseTr:
            'İyi günler doktor bey. Üç gündür şiddetli boğaz ağrım, öksürüğüm ve biraz ateşim var. Ayrıca çok yorgunum.',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-arzt-role-1-t2',
          partnerNameDe: 'Dr. Lindner',
          partnerGender: 'male',
          partnerLineDe:
            'Ich sehe, Ihr Hals ist ziemlich rot. Haben Sie schon Medikamente genommen oder haben Sie Allergien?',
          partnerLineTr:
            'Görüyorum, boğazınız oldukça kızarık. Şimdiye kadar ilaç aldınız mı veya alerjiniz var mı?',
          learnerCueTr:
            'Sadece bitki çayı içtiğini, henüz ilaç almadığını ve bilinen bir alerjin olmadığını söyle (Perfekt: habe getrunken / genommen).',
          sampleResponseDe:
            'Bis jetzt habe ich nur warmen Tee getrunken und noch keine Medikamente genommen. Allergien habe ich zum Glück keine.',
          sampleResponseTr:
            'Şimdiye kadar sadece sıcak çay içtim ve henüz ilaç almadım. Neyse ki alerjim yok.',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-arzt-role-1-t3',
          partnerNameDe: 'Dr. Lindner',
          partnerGender: 'male',
          partnerLineDe:
            'Gut. Es ist eine starke Erkältung. Ich schreibe Ihnen ein Rezept für Halstabletten und Hustensaft auf.',
          partnerLineTr:
            'Güzel. Ağır bir soğuk algınlığı. Size boğaz pastili ve öksürük şurubu için reçete yazıyorum.',
          learnerCueTr:
            'İlaçları günde kaç kez ve yemekten önce mi sonra mı alman gerektiğini sor; ayrıca iş için sağlık raporu iste.',
          sampleResponseDe:
            'Vielen Dank. Wie oft am Tag soll ich die Tabletten einnehmen — vor oder nach dem Essen? Und könnten Sie mir bitte eine Krankschreibung für meinen Arbeitgeber ausstellen?',
          sampleResponseTr:
            'Çok teşekkürler. Hapları günde kaç kez almalıyım — yemekten önce mi sonra mı? Bir de işverenim için bana sağlık raporu düzenleyebilir misiniz?',
          sampleGender: 'female',
        },
        {
          id: 'a2-spr-arzt-role-1-t4',
          partnerNameDe: 'Dr. Lindner',
          partnerGender: 'male',
          partnerLineDe:
            'Nehmen Sie die Tabletten dreimal täglich nach dem Essen. Ich schreibe Sie bis Freitag krank. Ruhen Sie sich gut aus und gute Besserung!',
          partnerLineTr:
            'Hapları günde üç kez yemekten sonra alın. Sizi cumaya kadar raporlu yazıyorum. İyice dinlenin ve geçmiş olsun!',
          learnerCueTr:
            'Teşekkür et, tavsiyelere uyacağını söyle ve resmî biçimde vedalaş.',
          sampleResponseDe:
            'Herzlichen Dank, Herr Doktor! Ich ruhe mich zu Hause gut aus. Auf Wiedersehen!',
          sampleResponseTr:
            'Çok teşekkür ederim doktor bey! Evde iyice dinleneceğim. Hoşça kalın!',
          sampleGender: 'female',
        },
      ],
      selfCheckCriteria: [
        'Şikâyet süresini “seit + Dativ” ve geçmişte yapılanları Perfekt ile doğru ifade ettim.',
        'İlaç kullanımını (“soll ich…”) ve sağlık raporunu (“Könnten Sie…”) kibarca sordum.',
        '4 turun tamamında doktorla resmî “Sie” iletişimini korudum.',
      ],
    },
  },
  {
    id: 'a2-sprechen-hotel-reise',
    titleDe: 'Im Hotel & Unterwegs',
    titleTr: 'Otelde ve Seyahatte Sorun Çözme',
    contextLabelTr: 'Seyahat & Hizmet · Resepsiyon (Sie)',
    subtitleTr:
      'Otel resepsiyonunda oda/Wi-Fi sorununu kibarca bildirme, seyahat planı ve geçmiş tatil deneyimini A2 kalıplarıyla aktarma.',
    cefrFocusTr: 'Kibar Şikâyet (Konjunktiv II) · obwohl · Perfekt Seyahat Anlatımı',
    register: 'Sie',
    registerLabelTr: 'Resmî Hitap (Sie)',
    estimatedMinutes: 8,
    imageUrl: a2ReisenImg,
    imageAlt: 'Seyahat ve otel resepsiyonu iletişimi',
    repeatItems: [
      {
        id: 'a2-spr-hot-rep-1',
        phraseDe: 'Entschuldigung, die Heizung in meinem Zimmer funktioniert leider nicht.',
        phraseTr: 'Affedersiniz, odamdaki kalorifer maalesef çalışmıyor.',
        pronunciationFocusDe: 'Entschuldigung · funktioniert nicht',
        pronunciationTipTr:
          '“Entschuldigung” sözcüğünde vurgu “-schul-” hecesindedir; “funktioniert” içindeki “-iert” sonunu uzun “i” ile net söyleyin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          '“Entschuldigung” ve “funktioniert” sözcüklerini doğru vurguyla telaffuz ettim.',
          '“in meinem Zimmer” Dativ yapısını takılmadan söyledim.',
          'Kibar ama net bir sorun bildirimi tonlaması kullandım.',
        ],
      },
      {
        id: 'a2-spr-hot-rep-2',
        phraseDe: 'Obwohl der Zug Verspätung hatte, sind wir rechtzeitig im Hotel angekommen.',
        phraseTr: 'Tren gecikmesine rağmen otele vaktinde ulaştık.',
        pronunciationFocusDe: 'obwohl + yan cümle, fiil + özne (sind wir angekommen)',
        pronunciationTipTr:
          '“Obwohl” yan cümlesi başa geldiğinde ana cümle hemen fiille başlar (“..., sind wir ... angekommen”).',
        speakerGender: 'female',
        selfCheckCriteria: [
          '“Obwohl der Zug Verspätung hatte” yan cümlesinde “hatte” fiilini sonda tuttum.',
          'Virgülden hemen sonra “sind wir” devrik fiil sırasını akıcı söyledim.',
          '“angekommen” Perfekt ortağını doğru telaffuz ettim.',
        ],
      },
    ],
    promptItems: [
      {
        id: 'a2-spr-hot-prm-1',
        questionDe: 'Erzählen Sie von einer Reise, die Ihnen besonders gut gefallen hat.',
        questionTr: 'Özellikle hoşunuza giden bir seyahati anlatın.',
        cuesDe: [
          'Letztes Jahr bin ich nach ... gereist / geflogen',
          'Ich habe dort ... besichtigt / gegessen',
          'Besonders schön fand ich ..., weil ...',
        ],
        cuesTr: [
          'Geçen yıl ...’ya seyahat ettim / uçtum (sein + Partizip II)',
          'Orada ... gezdim / yedim (haben + Partizip II)',
          'Özellikle ... çok güzel buldum çünkü ...',
        ],
        phrases: [
          {
            de: 'Letzten Sommer bin ich für fünf Tage nach Wien gefahren.',
            tr: 'Geçen yaz beş günlüğüne Viyana’ya gittim.',
          },
          {
            de: 'Wir haben viele historische Gebäude gesehen und im Kaffeehaus gesessen.',
            tr: 'Birçok tarihî bina gördük ve kahvehanede oturduk.',
          },
          {
            de: 'Die Reise hat mir sehr gefallen, weil die Stadt so lebendig war.',
            tr: 'Şehir çok canlı olduğu için seyahat çok hoşuma gitti.',
          },
        ],
        modelAnswerDe:
          'Letzten Sommer bin ich mit meiner Familie für vier Tage nach Wien gefahren. Wir haben das Schloss Schönbrunn besichtigt und viele gemütliche Cafés besucht. Besonders schön fand ich die Musik auf der Straße, weil die Atmosphäre wunderbar war.',
        modelAnswerTr:
          'Geçen yaz ailemle dört günlüğüne Viyana’ya gittim. Schönbrunn Sarayı’nı gezdik ve birçok rahat kafeye uğradık. Atmosfer harika olduğu için sokaktaki müziği özellikle çok güzel buldum.',
        speakerGender: 'female',
        selfCheckCriteria: [
          'Seyahati Perfekt (bin gefahren / habe besichtigt) kullanarak anlattım.',
          'Neden hoşuma gittiğini “weil” veya “deshalb” ile gerekçelendirdim.',
          'Sesli olarak en az 3 akıcı A2 cümlesi kurdum.',
        ],
      },
      {
        id: 'a2-spr-hot-prm-2',
        questionDe: 'Was ist Ihnen bei einem Hotel wichtig — ruhige Lage, Frühstück oder schnelles WLAN?',
        questionTr: 'Bir otelde sizin için ne önemlidir — sakin konum, kahvaltı mı yoksa hızlı Wi-Fi mı?',
        cuesDe: [
          'Mir ist besonders wichtig, dass ...',
          'Außerdem finde ich ... sehr praktisch, weil ...',
          'Wenn ich geschäftlich reise, brauche ich ...',
        ],
        cuesTr: [
          'Benim için özellikle ... olması önemli (dass + fiil sonda)',
          'Ayrıca ... çok pratik buluyorum çünkü ...',
          'İş için seyahat edersem ... ihtiyacım olur (wenn + fiil sonda)',
        ],
        phrases: [
          {
            de: 'Mir ist am wichtigsten, dass das Zimmer sauber und ruhig ist.',
            tr: 'Benim için en önemlisi odanın temiz ve sessiz olmasıdır.',
          },
          {
            de: 'Ein gutes Frühstück spart morgens viel Zeit.',
            tr: 'İyi bir kahvaltı sabahları çok zaman kazandırır.',
          },
          {
            de: 'Schnelles WLAN ist wichtig, weil ich manchmal abends arbeiten muss.',
            tr: 'Bazen akşamları çalışmam gerektiği için hızlı Wi-Fi önemlidir.',
          },
        ],
        modelAnswerDe:
          'Mir ist besonders wichtig, dass das Zimmer ruhig und sauber ist, weil ich gut schlafen möchte. Wenn ich für die Arbeit unterwegs bin, brauche ich außerdem schnelles WLAN. Ein frisches Frühstück finde ich auch sehr angenehm.',
        modelAnswerTr:
          'İyi uyumak istediğim için odanın sessiz ve temiz olması benim için özellikle önemlidir. İş için yoldaysam ayrıca hızlı Wi-Fi’ye ihtiyacım olur. Taze bir kahvaltıyı da çok hoş bulurum.',
        speakerGender: 'male',
        selfCheckCriteria: [
          'Kendi önceliğimi “Mir ist wichtig, dass…” yapısıyla ifade ettim.',
          '“weil” veya “wenn” bağlacıyla tercihimi açıkladım.',
          'Yanıtımı sesli söyledim ve model yanıtla karşılaştırdım.',
        ],
      },
    ],
    roleplay: {
      id: 'a2-spr-hot-role-1',
      titleDe: 'An der Hotelrezeption: Zimmerproblem & Frühstück',
      titleTr: 'Otel Resepsiyonunda: Oda Sorunu ve Kahvaltı Bilgisi',
      situationTr:
        'Münih’teki otelinize yeni giriş yaptınız. Odanızın (304) sokağa baktığı için çok gürültülü olduğunu ve Wi-Fi şifresinin çalışmadığını resepsiyona kibarca iletip çözüm isteyin (Sie hitabı).',
      partnerRoleDe: 'Frau König (Rezeption)',
      learnerRoleTr: 'Siz (Otel Misafiri · Sie)',
      phrases: [
        { de: 'Entschuldigung, ich habe ein Problem mit Zimmer 304.', tr: 'Affedersiniz, 304 numaralı odayla ilgili bir sorunum var.' },
        { de: 'Es ist leider sehr laut, weil das Fenster zur Straße liegt.', tr: 'Pencere sokağa baktığı için maalesef çok gürültülü.' },
        { de: 'Könnte ich vielleicht ein ruhigeres Zimmer bekommen?', tr: 'Acaba daha sakin bir oda alabilir miyim?' },
        { de: 'Ab wie viel Uhr gibt es morgen Frühstück?', tr: 'Yarın kahvaltı saat kaçtan itibaren var?' },
      ],
      turns: [
        {
          id: 'a2-spr-hot-role-1-t1',
          partnerNameDe: 'Frau König',
          partnerGender: 'female',
          partnerLineDe:
            'Guten Abend! Willkommen im Hotel Stadtpark. Wie kann ich Ihnen helfen?',
          partnerLineTr:
            'İyi akşamlar! Stadtpark Oteli’ne hoş geldiniz. Size nasıl yardımcı olabilirim?',
          learnerCueTr:
            'İyi akşamlar de, 304 numaralı odada kaldığını belirt ve pencere sokağa baktığı için çok gürültülü olduğunu kibarca anlat.',
          sampleResponseDe:
            'Guten Abend! Ich bin in Zimmer 304, aber es ist leider sehr laut, weil das Fenster direkt zur Hauptstraße liegt. Außerdem funktioniert das WLAN bei mir nicht.',
          sampleResponseTr:
            'İyi akşamlar! 304 numaralı odadayım ama pencere doğrudan ana caddeye baktığı için maalesef çok gürültülü. Ayrıca bende Wi-Fi çalışmıyor.',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-hot-role-1-t2',
          partnerNameDe: 'Frau König',
          partnerGender: 'female',
          partnerLineDe:
            'Das tut mir sehr leid! Ich schaue sofort nach. Wir haben im vierten Stock noch Zimmer 412 zum Innenhof frei. Möchten Sie umziehen?',
          partnerLineTr:
            'Çok üzgünüm! Hemen bakıyorum. Dördüncü katta iç avluya bakan 412 numaralı oda hâlâ boş. Taşınmak ister misiniz?',
          learnerCueTr:
            'Teklifi memnuniyetle kabul et ve yeni odada Wi-Fi için yeni bir şifre gerekip gerekmediğini sor.',
          sampleResponseDe:
            'Ja, sehr gern, ein Zimmer zum Innenhof wäre wunderbar! Brauche ich dort ein neues Passwort für das WLAN?',
          sampleResponseTr:
            'Evet, memnuniyetle, iç avluya bakan bir oda harika olur! Orada Wi-Fi için yeni bir şifreye ihtiyacım var mı?',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-hot-role-1-t3',
          partnerNameDe: 'Frau König',
          partnerGender: 'female',
          partnerLineDe:
            'Hier ist die neue Zimmerkarte und das aktuelle WLAN-Passwort steht auf der Rückseite. Kann ich sonst noch etwas für Sie tun?',
          partnerLineTr:
            'İşte yeni oda kartınız, güncel Wi-Fi şifresi de arka yüzünde yazıyor. Sizin için başka bir şey yapabilir miyim?',
          learnerCueTr:
            'Yarın kahvaltının saat kaçta başladığını ve çıkış (Check-out) saatini sor.',
          sampleResponseDe:
            'Ja, noch eine kurze Frage: Von wann bis wann gibt es morgen Frühstück und bis wie viel Uhr muss ich am Sonntag auschecken?',
          sampleResponseTr:
            'Evet, kısa bir soru daha: Yarın kahvaltı saat kaçtan kaça kadar var ve pazar günü saat kaça kadar çıkış yapmam gerekiyor?',
          sampleGender: 'male',
        },
        {
          id: 'a2-spr-hot-role-1-t4',
          partnerNameDe: 'Frau König',
          partnerGender: 'female',
          partnerLineDe:
            'Das Frühstück ist von 7 bis 10 Uhr im Erdgeschoss, und Check-out ist bis 11 Uhr. Ich wünsche Ihnen eine ruhige Nacht!',
          partnerLineTr:
            'Kahvaltı zemin katta saat 7’den 10’a kadar, çıkış ise saat 11’e kadardır. Size huzurlu bir gece dilerim!',
          learnerCueTr:
            'Hızlı çözüm için teşekkür et ve iyi akşamlar dileyerek sohbeti bitir.',
          sampleResponseDe:
            'Vielen Dank für die schnelle Hilfe! Ich wünsche Ihnen auch noch einen schönen Abend.',
          sampleResponseTr:
            'Hızlı yardımınız için çok teşekkürler! Size de iyi akşamlar dilerim.',
          sampleGender: 'male',
        },
      ],
      selfCheckCriteria: [
        'Oda gürültüsü ve Wi-Fi sorununu kibar A2 kalıplarıyla (“leider”, “weil”, “außerdem”) aktardım.',
        'Oda değişimini onaylayıp kahvaltı ve çıkış saatini doğru soru yapılarıyla sordum.',
        'Resepsiyon görüşmesinde baştan sona “Sie” hitabını korudum.',
      ],
    },
  },
];

export function getA2SpeakingScenarioById(id?: string): A2SpeakingScenario {
  return (
    GERMAN_A2_SPEAKING_SCENARIOS.find((scenario) => scenario.id === id) ??
    GERMAN_A2_SPEAKING_SCENARIOS[0]
  );
}

export function getA2SpeakingScenarioTaskIds(scenario: A2SpeakingScenario): string[] {
  return [
    ...scenario.repeatItems.map((item) => item.id),
    ...scenario.promptItems.map((item) => item.id),
    scenario.roleplay.id,
  ];
}

export const ALL_A2_SPEAKING_TASK_IDS: string[] = GERMAN_A2_SPEAKING_SCENARIOS.flatMap(
  getA2SpeakingScenarioTaskIds
);

export const TOTAL_A2_SPEAKING_TASKS = ALL_A2_SPEAKING_TASK_IDS.length;
