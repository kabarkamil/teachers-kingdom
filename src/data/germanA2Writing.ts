import imgEinladung from '../assets/images/schreiben_cafe_note_1795381152069.jpg';
import imgReklamation from '../assets/images/schreiben_wohnung_note_1795381152123.jpg';
import imgWochenende from '../assets/images/schreiben_reisen_plan_1795381151946.jpg';
import imgMeinung from '../assets/images/schreiben_alltag_form_1795381151843.jpg';
import type { A2WritingScenario } from '../types';

export const GERMAN_A2_WRITING_SCENARIOS: A2WritingScenario[] = [
  {
    id: 'a2-schreiben-einladung',
    titleDe: 'Einladung absagen & verschieben',
    titleTr: 'Daveti Nazikçe Reddetme & Erteleme',
    contextLabelTr: 'Samimi Mesaj · du',
    subtitleTr: 'Bir arkadaşın doğum günü davetine teşekkür etme, neden belirtme ve yeni tarih önerme',
    cefrFocusTr: 'weil / deshalb ile gerekçe + nazik erteleme (du)',
    register: 'du',
    estimatedMinutes: 8,
    imageUrl: imgEinladung,
    imageAlt: 'Kafede defter ve kalemle yazılmış samimi Almanca davet notu',
    messageTask: {
      id: 'a2-write-einladung-msg',
      formatLabelDe: 'Informelle E-Mail / Nachricht',
      formatLabelTr: 'Samimi E-Posta / Mesaj',
      titleDe: 'Geburtstagseinladung von Lukas',
      titleTr: 'Lukas’ın Doğum Günü Davetine Yanıt',
      register: 'du',
      registerLabelTr: 'Samimi Hitap (du)',
      promptDe:
        'Ihr Freund Lukas hat Sie am Freitagabend zum Geburtstagsessen eingeladen. Sie können aber leider nicht kommen. Schreiben Sie ihm eine Nachricht (mindestens 35 Wörter) zu allen drei Leitpunkten.',
      promptTr:
        'Arkadaşınız Lukas sizi Cuma akşamı doğum günü yemeğine davet etti. Ancak maalesef katılamıyorsunuz. Kendisine 3 zorunlu görev maddesini de kapsayan samimi (du) bir mesaj yazın (en az 35 kelime).',
      minWords: 35,
      minSentences: 4,
      bullets: [
        {
          id: 'einladung-b1',
          labelDe: '1. Für die Einladung danken UND höflich absagen',
          labelTr: '1. Davet için teşekkür edin VE katılamayacağınızı nazikçe bildirin',
          requiredSubConditions: [
            {
              id: 'einladung-b1-thank',
              labelTr: 'Davet için teşekkür ifadesi (danken / Einladung)',
              pattern:
                '(vielen\\s+dank|danke\\s+(dir|sehr|schön)|ich\\s+danke\\s+dir).{0,45}einladung|einladung.{0,35}(danke|dank)',
              missingHintTr:
                'Davet için açıkça teşekkür edin: ör. “Vielen Dank für deine Einladung zum Geburtstag!”',
            },
            {
              id: 'einladung-b1-decline',
              labelTr: 'Katılamama / iptal ifadesi (kann leider nicht kommen / absagen)',
              pattern:
                '(kann|könnte)\\s+[^.!?]{0,25}(leider\\s+nicht|nicht\\s+leider|nicht)\\s+[^.!?]{0,20}(kommen|teilnehmen|mitkommen|dabei\\s+sein)|leider\\s+absagen|muss\\s+leider\\s+absagen|habe\\s+leider\\s+keine\\s+zeit',
              missingHintTr:
                'Katılamayacağınızı açıkça yazın: ör. “Ich kann leider nicht kommen” veya “Ich muss leider absagen”.',
            },
          ],
          hintTr: 'Örnek: “Vielen Dank für deine Einladung! Ich kann am Freitag leider nicht kommen.”',
        },
        {
          id: 'einladung-b2',
          labelDe: '2. Den Grund mit einem Nebensatz oder Konnektor erklären',
          labelTr: '2. Nedenini bir A2 bağlacıyla (weil / da / deshalb) açıklayın',
          requiredSubConditions: [
            {
              id: 'einladung-b2-connector',
              labelTr: 'Neden-sonuç bağlacı (weil / da / deshalb / denn)',
              pattern: '\\b(weil|deshalb|deswegen|darum|denn|da)\\b',
              missingHintTr:
                'Gerekçenizi bir A2 bağlacıyla bağlayın: ör. “..., weil ich ... habe.” veya “... Deshalb kann ich nicht ...”',
            },
            {
              id: 'einladung-b2-reason',
              labelTr: 'Somut bir mazeret (iş, randevu, hastalık, sınav, aile vb.)',
              pattern:
                '\\b(arbeit|arbeiten|termin|krank|arzt|prüfung|familie|eltern|besuch|dienstreise|überstunden|büro|projekt|kurs|verreist|müde)\\b',
              missingHintTr:
                'Somut bir sebep ekleyin: ör. “einen wichtigen Termin bei der Arbeit”, “krank”, “Besuch von meiner Familie”.',
            },
          ],
          hintTr:
            'Örnek: “..., weil ich am Freitagabend noch einen wichtigen Termin bei der Arbeit habe.”',
        },
        {
          id: 'einladung-b3',
          labelDe: '3. Einen neuen Termin vorschlagen UND ein Treffen anbieten',
          labelTr: '3. Yeni bir gün/zaman önerin VE buluşma teklif edin',
          requiredSubConditions: [
            {
              id: 'einladung-b3-time',
              labelTr: 'Yeni gün veya zaman önerisi (Samstag, nächste Woche, Wochenende vb.)',
              pattern:
                '\\b(montag|dienstag|mittwoch|donnerstag|samstag|sonntag|wochenende|nächste\\s+woche|nächsten\\s+(samstag|sonntag|freitag|montag|dienstag|mittwoch|donnerstag)|übermorgen|am\\s+abend)\\b',
              missingHintTr:
                'Alternatif bir gün veya zaman yazın: ör. “am nächsten Samstag” veya “nächste Woche”.',
            },
            {
              id: 'einladung-b3-suggest',
              labelTr: 'Buluşma / telafi önerisi (treffen, nachholen, essen gehen, vorschlagen)',
              pattern:
                '\\b(treffen|nachholen|vorschlagen|einladen|kaffee\\s+trinken|essen\\s+gehen|feiern|zusammen\\s+essen|sehen\\s+wir\\s+uns)\\b',
              missingHintTr:
                'Buluşma veya telafi teklifi ekleyin: ör. “Können wir uns am Samstag treffen und das Essen nachholen?”',
            },
          ],
          hintTr:
            'Örnek: “Können wir uns am nächsten Samstag treffen und dein Geburtstagsessen zusammen nachholen?”',
        },
      ],
      structureRequirements: [
        {
          id: 'einladung-struct-causal',
          labelTr: 'Neden-sonuç bağlacı (weil / deshalb / da)',
          pattern: '\\b(weil|deshalb|deswegen|darum|da)\\b',
          exampleDe: '..., weil ich am Freitag noch arbeiten muss.',
          missingHintTr:
            'A2 düzeyinde gerekçe kurmak için “weil”, “da” veya “deshalb” bağlaçlarından en az birini kullanın.',
        },
      ],
      nounCapitalizationTargets: [
        'Einladung',
        'Geburtstag',
        'Freitag',
        'Samstag',
        'Sonntag',
        'Termin',
        'Arbeit',
        'Woche',
        'Wochenende',
        'Grüße',
      ],
      pitfallRules: [
        {
          id: 'a2-pitfall-weil-v2',
          pattern:
            '\\bweil\\s+(ich|du|er|sie|es|wir|ihr)\\s+(bin|bist|ist|sind|habe|hast|hat|haben|kann|muss|will|gehe|komme|arbeite)\\b',
          messageTr:
            'A2 söz dizimi uyarısı: “weil” yan cümlesinde çekimli fiil sona gider (“weil ich arbeiten muss”, “weil ich habe” değil).',
        },
        {
          id: 'a2-pitfall-ich-inf',
          pattern: '\\bich\\s+(kommen|haben|sein|arbeiten|treffen)\\b',
          messageTr:
            'Fiil çekimi uyarısı: “ich” öznesinden sonra mastar değil çekimli fiil kullanın (ör. “ich komme / ich habe”).',
        },
      ],
      phrases: [
        {
          id: 'ein-p1',
          german: 'Vielen Dank für deine Einladung zum Geburtstag!',
          turkish: 'Doğum günü davetin için çok teşekkürler!',
          categoryTr: 'Teşekkür',
        },
        {
          id: 'ein-p2',
          german: 'Ich kann am Freitag leider nicht kommen, weil ich noch arbeiten muss.',
          turkish: 'Cuma günü maalesef gelemiyorum çünkü hâlâ çalışmam gerekiyor.',
          categoryTr: 'Red & Gerekçe',
        },
        {
          id: 'ein-p3',
          german: 'Das tut mir wirklich leid.',
          turkish: 'Bunun için gerçekten üzgünüm.',
          categoryTr: 'Özür',
        },
        {
          id: 'ein-p4',
          german: 'Können wir uns am nächsten Samstag treffen und das Essen nachholen?',
          turkish: 'Gelecek Cumartesi buluşup yemeği telafi edebilir miyiz?',
          categoryTr: 'Alternatif Öneri',
        },
      ],
      draftingStepsTr: [
        '1. Samimi hitapla başlayın: “Hallo Lukas,”',
        '2. Davete teşekkür edip gelemediğinizi yazın (“Vielen Dank für deine Einladung... Ich kann leider nicht kommen”).',
        '3. “weil” (fiil sonda) veya “deshalb” (fiil 2. sırada) ile somut nedeninizi açıklayın.',
        '4. Yeni bir gün/saat ve buluşma önerisi ekleyip “Liebe Grüße + Adınız” ile bitirin.',
      ],
      modelAnswerDe:
        'Hallo Lukas,\nvielen Dank für deine Einladung zu deinem Geburtstag am Freitag! Ich kann leider nicht kommen, weil ich am Freitagabend noch einen wichtigen Termin bei der Arbeit habe. Das tut mir wirklich leid. Können wir uns am nächsten Samstag treffen und dein Geburtstagsessen zusammen nachholen?\nLiebe Grüße\nDeniz',
      modelAnswerTr:
        'Merhaba Lukas,\nCuma günkü doğum gününe davetin için çok teşekkürler! Maalesef gelemiyorum çünkü Cuma akşamı iş yerinde hâlâ önemli bir randevum var. Bunun için gerçekten üzgünüm. Gelecek Cumartesi buluşup doğum günü yemeğini birlikte telafi edebilir miyiz?\nSevgiler\nDeniz',
    },
    controlledItems: [
      {
        id: 'a2-write-einladung-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Verbinden Sie den Grund korrekt mit „weil“ (Verb am Ende).',
        instructionTr: '“weil” yan cümlesinde fiili sona yerleştirerek cümleyi kurun.',
        tokens: ['Ich', 'komme', 'nicht,', 'weil', 'ich', 'lange', 'arbeiten', 'muss.'],
        acceptedSentencesDe: [
          'Ich komme nicht, weil ich lange arbeiten muss.',
          'Ich komme nicht, weil ich arbeiten lange muss.',
        ],
        canonicalSentenceDe: 'Ich komme nicht, weil ich lange arbeiten muss.',
        explanationTr:
          '“weil” yan cümlesinde çekimli modal fiil (“muss”) en sona gider: “…, weil ich lange arbeiten muss.”',
      },
      {
        id: 'a2-write-einladung-ctrl-2',
        kind: 'satzbau',
        instructionDe: 'Bilden Sie einen Satz mit „deshalb“ (Inversion: Verb auf Position 2).',
        instructionTr: '“deshalb” sonrası fiili hemen 2. konuma getirerek cümleyi kurun.',
        tokens: ['Ich', 'bin', 'krank,', 'deshalb', 'bleibe', 'ich', 'zu', 'Hause.'],
        acceptedSentencesDe: ['Ich bin krank, deshalb bleibe ich zu Hause.'],
        canonicalSentenceDe: 'Ich bin krank, deshalb bleibe ich zu Hause.',
        explanationTr:
          '“deshalb” 1. konumu doldurduğu için fiil hemen arkasından gelir (“deshalb bleibe ich…”).',
      },
      {
        id: 'a2-write-einladung-ctrl-3',
        kind: 'cloze-typed',
        beforeBlankDe: 'Vielen Dank für deine',
        afterBlankDe: 'zur Party am Samstag!',
        hintTr: '“davet” anlamına gelen isim (büyük harfle başlar)',
        acceptedAnswers: ['Einladung'],
        canonicalAnswer: 'Einladung',
        requiresCapitalizedNoun: true,
        disallowLeadingArticle: true,
        explanationTr:
          '“die Einladung” (davet) isimdir ve büyük harfle yazılır; “deine” zaten önde olduğu için sadece “Einladung” yazılır.',
      },
    ],
  },
  {
    id: 'a2-schreiben-reklamation',
    titleDe: 'Reparatur anfragen (Hausverwaltung)',
    titleTr: 'Ev Yönetimine Arıza & Tamir E-Postası',
    contextLabelTr: 'Resmî E-Posta · Sie',
    subtitleTr: 'Çalışmayan kalorifer/internet arızasını bildirme, etkisini anlatma ve teknisyen randevusu isteme',
    cefrFocusTr: 'Resmî hitap (Sie) + seit + deshalb/weil',
    register: 'Sie',
    estimatedMinutes: 9,
    imageUrl: imgReklamation,
    imageAlt: 'Ev yönetimi için masa üzerinde hazırlanmış düzenli arıza bildirimi notu',
    messageTask: {
      id: 'a2-write-reklamation-msg',
      formatLabelDe: 'Formelle / Halbformelle E-Mail',
      formatLabelTr: 'Resmî / Yarı-Resmî E-Posta',
      titleDe: 'Heizung defekt — E-Mail an Frau Berger',
      titleTr: 'Kalorifer Arızası — Frau Berger’e E-Posta',
      register: 'Sie',
      registerLabelTr: 'Resmî Hitap (Sie)',
      promptDe:
        'Seit Montag funktioniert die Heizung in Ihrer Wohnung nicht mehr richtig. Schreiben Sie eine höfliche E-Mail an Frau Berger von der Hausverwaltung (mindestens 38 Wörter) zu allen drei Leitpunkten.',
      promptTr:
        'Pazartesiden beri dairenizdeki kalorifer düzgün çalışmıyor. Ev yönetiminden Frau Berger’e 3 zorunlu görev maddesini kapsayan resmî (Sie) bir e-posta yazın (en az 38 kelime).',
      minWords: 38,
      minSentences: 4,
      bullets: [
        {
          id: 'reklamation-b1',
          labelDe: '1. Das Problem beschreiben UND angeben, seit wann es besteht',
          labelTr: '1. Sorunu belirtin VE ne zamandan beri sürdüğünü yazın',
          requiredSubConditions: [
            {
              id: 'reklamation-b1-problem',
              labelTr: 'Arıza tanımı (Heizung / Internet + funktioniert nicht / kaputt / defekt)',
              pattern:
                '(heizung|internet|wlan|dusche|fenster).{0,55}(nicht\\s+mehr|nicht\\s+richtig|funktioniert\\s+nicht|kaputt|defekt|kalt)|((funktioniert|geht)\\s+[^.!?]{0,25}(heizung|internet)[^.!?]{0,20}nicht)',
              missingHintTr:
                'Arızayı açıkça yazın: ör. “die Heizung in meiner Wohnung funktioniert leider nicht mehr richtig”.',
            },
            {
              id: 'reklamation-b1-since',
              labelTr: 'Başlangıç süresi (seit + Montag / gestern / Tagen / einer Woche)',
              pattern:
                '\\bseit\\s+(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|gestern|vorgestern|zwei|drei|vier|einigen|mehreren|einer\\s+woche|dem\\s+wochenende|letzter\\s+woche)\\b',
              missingHintTr:
                'Sorunun ne zamandan beri sürdüğünü “seit” ile yazın: ör. “seit Montag” veya “seit drei Tagen”.',
            },
          ],
          hintTr:
            'Örnek: “Seit Montag funktioniert die Heizung in meiner Wohnung leider nicht mehr richtig.”',
        },
        {
          id: 'reklamation-b2',
          labelDe: '2. Die Folge oder Ihren eigenen Versuch mit einem Konnektor erklären',
          labelTr: '2. Etkisini veya denediğiniz çözümü bir bağlaçla açıklayın',
          requiredSubConditions: [
            {
              id: 'reklamation-b2-impact',
              labelTr: 'Etki veya denenen adım (kalt, Homeoffice, arbeiten, geprüft, probiert)',
              pattern:
                '\\b(kalt|frieren|homeoffice|arbeiten|schlafen|geprüft|probiert|entlüftet|neugestartet|versucht|unangenehm|problem\\s+bleibt)\\b',
              missingHintTr:
                'Sorunun etkisini veya denediğiniz bir adımı yazın: ör. “Die Zimmer bleiben sehr kalt” veya “Ich habe die Heizung schon geprüft”.',
            },
            {
              id: 'reklamation-b2-connector',
              labelTr: 'Bağlaç kullanımı (deshalb / weil / dass / obwohl / aber)',
              pattern: '\\b(deshalb|deswegen|weil|dass|obwohl|aber)\\b',
              missingHintTr:
                'Cümleleri bir bağlaçla bağlayın: ör. “Die Zimmer bleiben kalt, deshalb kann ich kaum arbeiten.”',
            },
          ],
          hintTr:
            'Örnek: “Die Zimmer bleiben sehr kalt, deshalb kann ich abends kaum im Homeoffice arbeiten.”',
        },
        {
          id: 'reklamation-b3',
          labelDe: '3. Um einen Techniker/Termin bitten UND Ihre Erreichbarkeit nennen',
          labelTr: '3. Teknisyen/randevu isteyin VE ne zaman uygun olduğunuzu belirtin',
          requiredSubConditions: [
            {
              id: 'reklamation-b3-request',
              labelTr: 'Teknisyen veya tamir randevusu talebi (Techniker / Reparatur / Termin)',
              pattern:
                '\\b(techniker|handwerker|reparatur|reparieren|termin|prüfen\\s+lassen|schicken)\\b',
              missingHintTr:
                'Teknisyen veya tamir talebi ekleyin: ör. “Könnten Sie bitte bald einen Techniker schicken?”',
            },
            {
              id: 'reklamation-b3-availability',
              labelTr: 'Uygunluk saati veya ulaşılabilirlik (ab 16 Uhr, vormittags, erreichbar, zu Hause)',
              pattern:
                '\\b(uhr|vormittags|nachmittags|abends|erreichbar|zu\\s+hause|telefonisch|ab\\s+\\d{1,2}|zwischen\\s+\\d{1,2})\\b',
              missingHintTr:
                'Ne zaman evde veya ulaşılabilir olduğunuzu yazın: ör. “Ich bin jeden Tag ab 16 Uhr erreichbar und zu Hause.”',
            },
          ],
          hintTr:
            'Örnek: “Könnten Sie bitte bald einen Techniker schicken? Ich bin ab 16 Uhr zu Hause.”',
        },
      ],
      structureRequirements: [
        {
          id: 'reklamation-struct-seit',
          labelTr: 'Zaman edatı “seit” (…-den beri)',
          pattern: '\\bseit\\b',
          exampleDe: 'Seit Montag funktioniert die Heizung nicht mehr.',
          missingHintTr:
            'Devam eden bir durumun başlangıcını belirtmek için “seit” kullanın (“für” yerine).',
        },
        {
          id: 'reklamation-struct-connector',
          labelTr: 'A2 bağlacı (deshalb / weil / dass / obwohl / wenn)',
          pattern: '\\b(deshalb|deswegen|weil|dass|obwohl|wenn)\\b',
          exampleDe: 'Die Wohnung ist kalt, deshalb brauche ich schnell Hilfe.',
          missingHintTr:
            'En az bir A2 bağlacı ekleyin (deshalb, weil, dass, obwohl veya wenn).',
        },
      ],
      nounCapitalizationTargets: [
        'Heizung',
        'Wohnung',
        'Montag',
        'Zimmer',
        'Techniker',
        'Reparatur',
        'Termin',
        'Problem',
        'Uhr',
        'Grüßen',
      ],
      pitfallRules: [
        {
          id: 'a2-pitfall-seit-fuer',
          pattern: '\\bfür\\s+(montag|dienstag|zwei\\s+tagen|drei\\s+tagen|einer\\s+woche)\\b',
          messageTr:
            'Edat uyarısı: Geçmişte başlayıp hâlâ süren durumlarda “für” değil “seit” kullanılır (“seit Montag / seit drei Tagen”).',
        },
        {
          id: 'a2-pitfall-reklamation-weil-v2',
          pattern:
            '\\b(weil|dass|obwohl)\\s+(ich|es|die\\s+heizung|sie|wir)\\s+(bin|ist|sind|habe|hat|kann|muss|bleibt)\\b',
          messageTr:
            'Yan cümle uyarısı: “weil / dass / obwohl” sonrasında çekimli fiil cümle sonuna gider.',
        },
      ],
      phrases: [
        {
          id: 'rek-p1',
          german: 'Sehr geehrte Frau Berger,',
          turkish: 'Sayın Bayan Berger,',
          categoryTr: 'Resmî Selamlama',
        },
        {
          id: 'rek-p2',
          german: 'Seit Montag funktioniert die Heizung in meiner Wohnung nicht mehr richtig.',
          turkish: 'Pazartesiden beri dairemdeki kalorifer artık düzgün çalışmıyor.',
          categoryTr: 'Arıza & Süre',
        },
        {
          id: 'rek-p3',
          german: 'Könnten Sie bitte bald einen Techniker für die Reparatur schicken?',
          turkish: 'Tamir için yakında bir teknisyen gönderebilir misiniz lütfen?',
          categoryTr: 'Nazik Talep',
        },
        {
          id: 'rek-p4',
          german: 'Ich bin jeden Tag ab 16 Uhr telefonisch erreichbar und zu Hause.',
          turkish: 'Her gün saat 16’dan itibaren telefonla ulaşılabilir ve evdeyim.',
          categoryTr: 'Uygunluk',
        },
      ],
      draftingStepsTr: [
        '1. Resmî hitapla başlayın: “Sehr geehrte Frau Berger,”',
        '2. “Seit Montag…” ile arızayı ve ne zamandan beri sürdüğünü yazın.',
        '3. “deshalb” veya “weil” ile evde yarattığı etkiyi ya da denediğiniz kontrolü açıklayın.',
        '4. “Könnten Sie bitte…” ile teknisyen isteyin, uygun saatlerinizi yazın ve “Mit freundlichen Grüßen” ile kapatın.',
      ],
      modelAnswerDe:
        'Sehr geehrte Frau Berger,\nseit Montag funktioniert die Heizung in meiner Wohnung leider nicht mehr richtig. Die Zimmer bleiben sehr kalt, deshalb kann ich abends kaum im Homeoffice arbeiten. Ich habe die Heizung schon geprüft, aber das Problem bleibt. Könnten Sie bitte bald einen Techniker für die Reparatur schicken? Ich bin jeden Tag ab 16 Uhr telefonisch erreichbar und zu Hause.\nMit freundlichen Grüßen\nMert Kaya',
      modelAnswerTr:
        'Sayın Bayan Berger,\nPazartesiden beri dairemdeki kalorifer maalesef artık düzgün çalışmıyor. Odalar çok soğuk kalıyor, bu yüzden akşamları evden çalışmakta çok zorlanıyorum. Kaloriferi kontrol ettim ama sorun devam ediyor. Tamir için yakında bir teknisyen gönderebilir misiniz lütfen? Her gün saat 16’dan itibaren telefonla ulaşılabilir ve evdeyim.\nSaygılarımla\nMert Kaya',
    },
    controlledItems: [
      {
        id: 'a2-write-reklamation-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Ordnen Sie die höfliche Bitte mit „Könnten Sie“.',
        instructionTr: '“Könnten Sie” ile nazik resmî rica cümlesini kurun.',
        tokens: ['Könnten', 'Sie', 'bitte', 'einen', 'Techniker', 'schicken?'],
        acceptedSentencesDe: ['Könnten Sie bitte einen Techniker schicken?'],
        canonicalSentenceDe: 'Könnten Sie bitte einen Techniker schicken?',
        explanationTr:
          'Nazik soru cümlesinde “Könnten Sie” başta, mastar fiil “schicken” cümle sonunda yer alır.',
      },
      {
        id: 'a2-write-reklamation-ctrl-2',
        kind: 'satzbau',
        instructionDe: 'Setzen Sie die Zeitangabe „Seit Montag“ auf Position 1.',
        instructionTr: '“Seit Montag” zaman zarfını 1. konuma koyarak fiili 2. sırada tutun.',
        tokens: ['Seit', 'Montag', 'funktioniert', 'die', 'Heizung', 'nicht', 'mehr.'],
        acceptedSentencesDe: ['Seit Montag funktioniert die Heizung nicht mehr.'],
        canonicalSentenceDe: 'Seit Montag funktioniert die Heizung nicht mehr.',
        explanationTr:
          'Zaman ifadesi 1. konumdaysa fiil 2. konumda kalır, özne (“die Heizung”) fiilden hemen sonra gelir.',
      },
      {
        id: 'a2-write-reklamation-ctrl-3',
        kind: 'cloze-typed',
        beforeBlankDe: 'Das Internet geht',
        afterBlankDe: 'drei Tagen nicht mehr.',
        hintTr: '“-den beri” anlamında Dativ alan zaman edatı',
        acceptedAnswers: ['seit'],
        canonicalAnswer: 'seit',
        caseArticleHints: [
          {
            wrongValue: 'für',
            messageTr: 'Devam eden sürelerde “für” değil “seit” kullanılır (“seit drei Tagen”).',
          },
          {
            wrongValue: 'vor',
            messageTr: '“vor drei Tagen” (üç gün önce) bitmiş bir anı anlatır; hâlâ sürüyorsa “seit” kullanın.',
          },
        ],
        explanationTr:
          'Geçmişte başlayıp şu an da devam eden arızalar için “seit + Dativ” kullanılır: “seit drei Tagen”.',
      },
    ],
  },
  {
    id: 'a2-schreiben-wochenende',
    titleDe: 'Über das Wochenende berichten',
    titleTr: 'Geçmiş Hafta Sonu Gezisini Anlatma',
    contextLabelTr: 'Geçmiş Zaman (Perfekt) · du',
    subtitleTr: 'Bir arkadaşa hafta sonu nereye gittiğinizi, ne yaptığınızı Perfekt ile anlatma',
    cefrFocusTr: 'Perfekt (haben/sein + Partizip II) + obwohl/weil',
    register: 'du',
    estimatedMinutes: 8,
    imageUrl: imgWochenende,
    imageAlt: 'Seyahat haritası ve gezi not defteri ile hafta sonu yazısı',
    messageTask: {
      id: 'a2-write-wochenende-msg',
      formatLabelDe: 'Persönliche Nachricht (Perfekt)',
      formatLabelTr: 'Kişisel Mesaj (Perfekt Anlatımı)',
      titleDe: 'Wochenendausflug an Sara',
      titleTr: 'Sara’ya Hafta Sonu Gezisi Mesajı',
      register: 'du',
      registerLabelTr: 'Samimi Hitap (du)',
      promptDe:
        'Sie haben am letzten Wochenende einen Ausflug gemacht. Schreiben Sie Ihrer Freundin Sara (mindestens 38 Wörter) im Perfekt zu allen drei Leitpunkten.',
      promptTr:
        'Geçen hafta sonu kısa bir geziye çıktınız. Arkadaşınız Sara’ya 3 zorunlu görev maddesini de kapsayan samimi (du) ve Perfekt zamanlı bir mesaj yazın (en az 38 kelime).',
      minWords: 38,
      minSentences: 4,
      bullets: [
        {
          id: 'wochenende-b1',
          labelDe: '1. Schreiben, wohin Sie gefahren/gegangen sind UND mit wem',
          labelTr: '1. Nereye gittiğinizi VE kiminle gittiğinizi Perfekt ile yazın',
          requiredSubConditions: [
            {
              id: 'wochenende-b1-destination',
              labelTr: 'Gidiş / yer ifadesi (gefahren / gereist / gewesen / besucht / Ausflug gemacht)',
              pattern:
                '\\b(gefahren|gereist|gewesen|besucht|geflogen|gegangen|ausflug\\s+gemacht)\\b',
              missingHintTr:
                'Nereye gittiğinizi Perfekt ile yazın: ör. “bin ich nach München gefahren” veya “habe ich einen Ausflug gemacht”.',
            },
            {
              id: 'wochenende-b1-companion',
              labelTr: 'Kiminle gittiğiniz (mit Freunden / meiner Familie / Kollegen / Schwester)',
              pattern:
                '\\bmit\\s+(meinen\\s+|meiner\\s+|meinem\\s+)?(freunden|freundin|freund|familie|eltern|schwester|bruder|kollegen|partner|kindern)\\b|\\ballein(e)?\\b',
              missingHintTr:
                'Kiminle gittiğinizi ekleyin: ör. “mit meinen Freunden” veya “mit meiner Familie”.',
            },
          ],
          hintTr:
            'Örnek: “Am letzten Wochenende bin ich mit meinen Freunden nach München gefahren.”',
        },
        {
          id: 'wochenende-b2',
          labelDe: '2. Eine Aktivität im Perfekt beschreiben UND Eindruck/Wetter nennen',
          labelTr: '2. Yaptığınız bir etkinliği VE izleniminizi/havayı anlatın',
          requiredSubConditions: [
            {
              id: 'wochenende-b2-activity',
              labelTr: 'Etkinlik (besichtigt, gegessen, gewandert, gesehen, spazieren, fotografiert)',
              pattern:
                '\\b(besichtigt|gegessen|getrunken|gewandert|gesehen|spazieren|fotografiert|eingekauft|geschwommen|gespielt|gekocht|besucht|gemacht)\\b',
              missingHintTr:
                'Orada yaptığınız bir etkinliği Perfekt ile yazın: ör. “Wir haben die Altstadt besichtigt und gut gegessen.”',
            },
            {
              id: 'wochenende-b2-impression',
              labelTr: 'İzlenim veya hava durumu (toll, schön, super, interessant, sonnig, geregnet)',
              pattern:
                '\\b(toll|schön|super|wunderbar|interessant|entspannend|lecker|sonnig|warm|kalt|geregnet|wetter|spaß\\s+gemacht)\\b',
              missingHintTr:
                'Gezinin nasıl geçtiğini veya havayı ekleyin: ör. “Obwohl es kurz geregnet hat, war der Ausflug wirklich toll.”',
            },
          ],
          hintTr:
            'Örnek: “Wir haben die Altstadt besichtigt und lecker gegessen. Der Ausflug war wirklich toll.”',
        },
        {
          id: 'wochenende-b3',
          labelDe: '3. Nach Saras Wochenende fragen ODER ein Treffen vorschlagen',
          labelTr: '3. Sara’ya hafta sonunu sorun VEYA yakında buluşma önerin',
          requiredSubConditions: [
            {
              id: 'wochenende-b3-prompt',
              labelTr: 'Soru veya buluşma cümlesi (Wie war dein…, Was hast du…, Hast du Lust…)',
              pattern:
                '(wie\\s+war|was\\s+hast\\s+du|hast\\s+du\\s+lust|wollen\\s+wir|treffen\\s+wir\\s+uns|wann\\s+hast\\s+du\\s+zeit|erzähl\\s+mir)',
              missingHintTr:
                'Sara’ya dönük bir soru veya davet ekleyin: ör. “Wie war dein Wochenende?” veya “Hast du nächste Woche Lust auf einen Kaffee?”',
            },
            {
              id: 'wochenende-b3-qmark',
              labelTr: 'Doğrudan soru işareti (?)',
              pattern: '\\?',
              missingHintTr: 'Soru cümlenizin sonuna soru işareti (?) koyun.',
            },
          ],
          hintTr:
            'Örnek: “Wie war dein Wochenende und hast du nächste Woche Lust auf einen Kaffee?”',
        },
      ],
      structureRequirements: [
        {
          id: 'wochenende-struct-perfekt',
          labelTr: 'Perfekt yapısı (haben/sein + Partizip II)',
          pattern:
            '\\b(bin|bist|ist|sind|habe|hast|hat|haben)\\b[\\s\\S]{0,80}\\b(ge[a-zäöüß]{2,}(?:t|en)|besichtigt|besucht|fotografiert|probiert|organisiert)\\b|\\b(ge[a-zäöüß]{2,}(?:t|en)|besichtigt|besucht)\\s+(habe|hast|hat|haben|bin|ist|sind)\\b',
          exampleDe: 'Wir sind nach München gefahren und haben die Altstadt besichtigt.',
          missingHintTr:
            'Geçmişi anlatırken Perfekt kullanın: yardımcı fiil (“bin/habe/haben/sind”) + Partizip II (“gefahren/gegessen/besichtigt”).',
        },
        {
          id: 'wochenende-struct-connector',
          labelTr: 'A2 bağlacı (obwohl / weil / deshalb / dass / aber)',
          pattern: '\\b(obwohl|weil|deshalb|dass|aber|trotzdem)\\b',
          exampleDe: 'Obwohl es am Sonntag geregnet hat, war der Ausflug toll.',
          missingHintTr:
            'Cümleleri akıcı kılmak için en az bir bağlaç ekleyin (obwohl, weil, deshalb, dass veya aber).',
        },
      ],
      nounCapitalizationTargets: [
        'Wochenende',
        'Ausflug',
        'Freunden',
        'Familie',
        'Altstadt',
        'Sonntag',
        'Samstag',
        'Kaffee',
        'Woche',
        'Grüße',
      ],
      pitfallRules: [
        {
          id: 'a2-pitfall-haben-gefahren',
          pattern: '\\b(habe|hast|hat|haben)\\s+[^.!?]{0,45}\\b(gefahren|gegangen|gereist|gewesen)\\b',
          messageTr:
            'Perfekt yardımcı fiil uyarısı: Yer değiştirme/hareket fiilleri (“gefahren, gegangen, gereist”) ve “gewesen” “haben” ile değil “sein” (bin/sind) ile kurulur.',
        },
        {
          id: 'a2-pitfall-obwohl-v2',
          pattern: '\\bobwohl\\s+(es|ich|wir)\\s+(hat|ist|war|haben|sind)\\b',
          messageTr:
            'Yan cümle uyarısı: “obwohl” bağlacından sonra çekimli fiil cümle sonuna gider (“obwohl es geregnet hat”).',
        },
      ],
      phrases: [
        {
          id: 'woc-p1',
          german: 'Am letzten Wochenende bin ich mit meinen Freunden nach München gefahren.',
          turkish: 'Geçen hafta sonu arkadaşlarımla Münih’e gittim.',
          categoryTr: 'Perfekt (sein)',
        },
        {
          id: 'woc-p2',
          german: 'Wir haben die Altstadt besichtigt und sehr gut gegessen.',
          turkish: 'Eski şehri gezdik ve çok güzel yemek yedik.',
          categoryTr: 'Perfekt (haben)',
        },
        {
          id: 'woc-p3',
          german: 'Obwohl es am Sonntag kurz geregnet hat, war der Ausflug wirklich toll.',
          turkish: 'Pazar günü kısa süre yağmur yağmasına rağmen gezi gerçekten harikaydı.',
          categoryTr: 'Zıtlık (obwohl)',
        },
        {
          id: 'woc-p4',
          german: 'Wie war dein Wochenende und hast du nächste Woche Lust auf einen Kaffee?',
          turkish: 'Senin hafta sonun nasıldı ve gelecek hafta kahveye var mısın?',
          categoryTr: 'Soru & Davet',
        },
      ],
      draftingStepsTr: [
        '1. “Liebe Sara,” ile başlayın.',
        '2. “bin ich mit … nach … gefahren” kalıbıyla nereye ve kiminle gittiğinizi yazın.',
        '3. “haben + Partizip II” ile bir etkinlik ve “obwohl / aber” ile hava veya izleniminizi ekleyin.',
        '4. Sara’ya bir soru sorup (“Wie war dein Wochenende?”) “Viele Grüße + Adınız” ile bitirin.',
      ],
      modelAnswerDe:
        'Liebe Sara,\nam letzten Wochenende bin ich mit meinen Freunden nach München gefahren. Wir haben die Altstadt besichtigt und in einem kleinen Lokal sehr gut gegessen. Obwohl es am Sonntag kurz geregnet hat, war der Ausflug wirklich toll und sehr interessant. Wie war dein Wochenende und hast du nächste Woche Lust auf einen Kaffee?\nViele Grüße\nElif',
      modelAnswerTr:
        'Sevgili Sara,\nGeçen hafta sonu arkadaşlarımla Münih’e gittim. Eski şehri gezdik ve küçük bir lokantada çok güzel yemek yedik. Pazar günü kısa süre yağmur yağmasına rağmen gezi gerçekten harika ve çok ilginçti. Senin hafta sonun nasıldı ve gelecek hafta bir kahveye var mısın?\nÇok selamlar\nElif',
    },
    controlledItems: [
      {
        id: 'a2-write-wochenende-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Bilden Sie die Perfekt-Satzklammer mit „sein“.',
        instructionTr: '“sein + Partizip II” cümle parantezini kurun.',
        tokens: ['Am', 'Samstag', 'sind', 'wir', 'nach', 'Hamburg', 'gefahren.'],
        acceptedSentencesDe: ['Am Samstag sind wir nach Hamburg gefahren.'],
        canonicalSentenceDe: 'Am Samstag sind wir nach Hamburg gefahren.',
        explanationTr:
          '“fahren” hareket fiili olduğu için Perfekt “sein” (sind) ile kurulur ve “gefahren” cümle sonuna gider.',
      },
      {
        id: 'a2-write-wochenende-ctrl-2',
        kind: 'satzbau',
        instructionDe: 'Verbinden Sie den Kontrast mit „Obwohl“ (Verb am Ende des Nebensatzes).',
        instructionTr: '“Obwohl” yan cümlesini ve ana cümle fiilini doğru sıralayın.',
        tokens: ['Obwohl', 'es', 'geregnet', 'hat,', 'war', 'es', 'schön.'],
        acceptedSentencesDe: ['Obwohl es geregnet hat, war es schön.'],
        canonicalSentenceDe: 'Obwohl es geregnet hat, war es schön.',
        explanationTr:
          'Yan cümle başta geldiğinde virgülden hemen sonra ana cümlenin fiili (“war”) gelir.',
      },
      {
        id: 'a2-write-wochenende-ctrl-3',
        kind: 'cloze-typed',
        beforeBlankDe: 'Wir haben am Abend in einem kleinen Restaurant sehr lecker',
        afterBlankDe: '.',
        hintTr: '“essen” fiilinin Partizip II hali',
        acceptedAnswers: ['gegessen'],
        canonicalAnswer: 'gegessen',
        caseArticleHints: [
          {
            wrongValue: 'geessen',
            messageTr: '“essen” düzensizdir ve ses uyumu için araya “g” alır: “gegessen”.',
          },
        ],
        explanationTr: '“essen” fiilinin Perfekt ortacı “gegessen” şeklindedir.',
      },
    ],
  },
  {
    id: 'a2-schreiben-meinung',
    titleDe: 'Meinung & Plan zum Kursangebot',
    titleTr: 'Kurs Önerisine Görüş Bildirme & Plan',
    contextLabelTr: 'Görüş & Plan · Sie',
    subtitleTr: 'Öğretmenin konuşma kulübü önerisine fikir, katılım koşulu (wenn) ve soru ile yanıt verme',
    cefrFocusTr: 'Meinung (weil/dass) + koşul/plan (wenn/deshalb) + Sie',
    register: 'Sie',
    estimatedMinutes: 9,
    imageUrl: imgMeinung,
    imageAlt: 'Çalışma masasında Almanca kurs planı ve resmi e-posta taslağı',
    messageTask: {
      id: 'a2-write-meinung-msg',
      formatLabelDe: 'Höfliche Kurs-E-Mail',
      formatLabelTr: 'Resmî / Nazik Kurs E-Postası',
      titleDe: 'Rückmeldung zum Konversationskurs an Frau Weber',
      titleTr: 'Frau Weber’e Konuşma Kulübü Geri Bildirimi',
      register: 'Sie',
      registerLabelTr: 'Resmî Hitap (Sie)',
      promptDe:
        'Ihre Deutschlehrerin Frau Weber möchte am Donnerstagnachmittag einen zusätzlichen Konversationskurs anbieten. Schreiben Sie ihr eine E-Mail (mindestens 38 Wörter) zu allen drei Leitpunkten.',
      promptTr:
        'Almanca öğretmeniniz Frau Weber Perşembe öğleden sonra ek bir konuşma kulübü açmayı önerdi. Kendisine 3 zorunlu görev maddesini de kapsayan nazik (Sie) bir e-posta yazın (en az 38 kelime).',
      minWords: 38,
      minSentences: 4,
      bullets: [
        {
          id: 'meinung-b1',
          labelDe: '1. Ihre Meinung zum Vorschlag schreiben UND begründen (weil/dass)',
          labelTr: '1. Öneri hakkındaki görüşünüzü yazın VE gerekçelendirin (weil / dass)',
          requiredSubConditions: [
            {
              id: 'meinung-b1-stance',
              labelTr: 'Açık görüş ifadesi (ich finde / denke / meine + gut / sinnvoll / wichtig)',
              pattern:
                '(ich\\s+(finde|denke|meine|glaube)|meiner\\s+meinung\\s+nach|es\\s+ist\\s+eine\\s+(gute|tolle|sinnvolle)\\s+idee)[\\s\\S]{0,60}(gut|sinnvoll|wichtig|hilfreich|super|toll|nützlich|idee|vorschlag)',
              missingHintTr:
                'Öneri hakkındaki fikrinizi yazın: ör. “Ich finde Ihren Vorschlag sehr sinnvoll” veya “Ich denke, dass die Idee sehr gut ist”.',
            },
            {
              id: 'meinung-b1-reason',
              labelTr: 'Gerekçe bağlacı (weil / dass / denn)',
              pattern: '\\b(weil|dass|denn)\\b',
              missingHintTr:
                'Görüşünüzü “weil”, “dass” veya “denn” ile destekleyin: ör. “..., weil wir mehr sprechen üben können.”',
            },
          ],
          hintTr:
            'Örnek: “Ich finde Ihren Vorschlag sehr sinnvoll, weil wir im Unterricht oft zu wenig Zeit zum Sprechen haben.”',
        },
        {
          id: 'meinung-b2',
          labelDe: '2. Ihren persönlichen Plan oder eine Bedingung nennen (wenn/deshalb)',
          labelTr: '2. Kişisel katılım planınızı veya koşulunuzu belirtin (wenn / deshalb)',
          requiredSubConditions: [
            {
              id: 'meinung-b2-condition',
              labelTr: 'Koşul veya sonuç bağlacı (wenn / falls / deshalb)',
              pattern: '\\b(wenn|falls|deshalb|deswegen)\\b',
              missingHintTr:
                'Koşul veya sonuç bağlacı ekleyin: ör. “Wenn der Kurs nach 17 Uhr beginnt, …” veya “Deshalb möchte ich …”',
            },
            {
              id: 'meinung-b2-plan',
              labelTr: 'Katılım / çalışma planı (teilnehmen, üben, sprechen, kommen, möchte, plane)',
              pattern:
                '\\b(teilnehmen|mitmachen|üben|sprechen|verbessern|lernen|plane|möchte|werde|regelmäßig)\\b',
              missingHintTr:
                'Kendi planınızı belirtin: ör. “möchte ich regelmäßig teilnehmen und mein Deutsch üben”.',
            },
          ],
          hintTr:
            'Örnek: “Wenn der Kurs nach 17 Uhr beginnt, möchte ich gern regelmäßig teilnehmen und sprechen üben.”',
        },
        {
          id: 'meinung-b3',
          labelDe: '3. Eine konkrete Frage zur Organisation stellen (Wann/Wo/Kosten?)',
          labelTr: '3. Organizasyon hakkında somut bir soru sorun (Saat / Yer / Ücret?)',
          requiredSubConditions: [
            {
              id: 'meinung-b3-topic',
              labelTr: 'Organizasyon sorusu (Wann, Wo, Raum, Uhrzeit, kostet, Teilnahme, anmelden)',
              pattern:
                '\\b(wann|wo|welchem\\s+raum|raum|uhrzeit|wie\\s+lange|wie\\s+viel|kostet|kosten|anmelden|anmeldung|brauchen\\s+wir|material)\\b',
              missingHintTr:
                'Saat, oda, kayıt veya ücret hakkında bir soru ekleyin: ör. “In welchem Raum findet das Treffen statt und kostet die Teilnahme extra?”',
            },
            {
              id: 'meinung-b3-qmark',
              labelTr: 'Doğrudan soru işareti (?)',
              pattern: '\\?',
              missingHintTr: 'Sorunuzu soru işareti (?) ile bitirin.',
            },
          ],
          hintTr:
            'Örnek: “In welchem Raum findet das Treffen statt und kostet die Teilnahme extra?”',
        },
      ],
      structureRequirements: [
        {
          id: 'meinung-struct-subordinate',
          labelTr: 'Yan cümle bağlacı (weil veya dass)',
          pattern: '\\b(weil|dass)\\b',
          exampleDe: 'Ich finde den Kurs wichtig, weil wir mehr sprechen können.',
          missingHintTr: 'Görüşünüzü gerekçelendirmek için “weil” veya “dass” kullanın.',
        },
        {
          id: 'meinung-struct-condition',
          labelTr: 'Koşul veya sonuç bağlacı (wenn veya deshalb)',
          pattern: '\\b(wenn|deshalb)\\b',
          exampleDe: 'Wenn der Kurs nach 17 Uhr beginnt, nehme ich gern teil.',
          missingHintTr: 'Katılım koşulu veya planı için “wenn” ya da “deshalb” kullanın.',
        },
      ],
      nounCapitalizationTargets: [
        'Vorschlag',
        'Unterricht',
        'Zeit',
        'Kurs',
        'Donnerstag',
        'Uhr',
        'Frage',
        'Raum',
        'Treffen',
        'Teilnahme',
        'Grüßen',
      ],
      pitfallRules: [
        {
          id: 'a2-pitfall-wenn-v2',
          pattern:
            '\\b(wenn|dass|weil)\\s+(der\\s+kurs|ich|wir|es|das\\s+treffen)\\s+(beginnt|ist|habe|kann|möchte|findet|kostet)\\b',
          messageTr:
            'Yan cümle uyarısı: “wenn / dass / weil” bağlaçlarından sonra çekimli fiil yan cümlenin sonuna gider (“Wenn der Kurs nach 17 Uhr beginnt, …”).',
        },
      ],
      phrases: [
        {
          id: 'mei-p1',
          german: 'Ich finde Ihren Vorschlag sehr sinnvoll, weil wir mehr sprechen üben können.',
          turkish: 'Önerinizi çok mantıklı buluyorum çünkü daha fazla konuşma pratiği yapabiliriz.',
          categoryTr: 'Görüş & Gerekçe',
        },
        {
          id: 'mei-p2',
          german: 'Wenn der Kurs nach 17 Uhr beginnt, möchte ich gern regelmäßig teilnehmen.',
          turkish: 'Kurs saat 17’den sonra başlarsa düzenli olarak katılmak isterim.',
          categoryTr: 'Koşul & Plan',
        },
        {
          id: 'mei-p3',
          german: 'Deshalb habe ich noch eine kurze Frage:',
          turkish: 'Bu yüzden kısa bir sorum daha var:',
          categoryTr: 'Geçiş',
        },
        {
          id: 'mei-p4',
          german: 'In welchem Raum findet das Treffen statt und kostet die Teilnahme extra?',
          turkish: 'Buluşma hangi odada gerçekleşecek ve katılım ek ücrete tabi mi?',
          categoryTr: 'Organizasyon Sorusu',
        },
      ],
      draftingStepsTr: [
        '1. “Sehr geehrte Frau Weber,” ile resmî selamlama yapın.',
        '2. “Ich finde Ihren Vorschlag…” + “weil / dass” ile fikrinizi ve nedenini yazın.',
        '3. “Wenn der Kurs …” veya “Deshalb …” ile kendi katılım planınızı belirtin.',
        '4. Yer/saat/ücret sorusu sorup (“…?”) “Mit freundlichen Grüßen + Adınız” ile kapatın.',
      ],
      modelAnswerDe:
        'Sehr geehrte Frau Weber,\nich finde Ihren Vorschlag für einen Konversationskurs am Donnerstag sehr sinnvoll, weil wir im Unterricht oft zu wenig Zeit zum freien Sprechen haben. Wenn der Kurs nach 17 Uhr beginnt, möchte ich sehr gern regelmäßig teilnehmen und mein Deutsch aktiv üben. Deshalb habe ich noch eine kurze Frage: In welchem Raum findet das Treffen statt und kostet die Teilnahme extra? Ich freue mich sehr auf Ihre Antwort.\nMit freundlichen Grüßen\nSelin Demir',
      modelAnswerTr:
        'Sayın Bayan Weber,\nPerşembe günü için konuşma kursu önerinizi çok mantıklı buluyorum çünkü derste serbest konuşma için çoğu zaman çok az vaktimiz oluyor. Kurs saat 17’den sonra başlarsa düzenli olarak katılmayı ve Almancamı aktif şekilde çalışmayı çok isterim. Bu yüzden kısa bir sorum daha var: Buluşma hangi odada gerçekleşecek ve katılım ek ücrete tabi mi? Yanıtınızı heyecanla bekliyorum.\nSaygılarımla\nSelin Demir',
    },
    controlledItems: [
      {
        id: 'a2-write-meinung-ctrl-1',
        kind: 'satzbau',
        instructionDe: 'Bilden Sie einen „dass“-Nebensatz (Verb am Ende).',
        instructionTr: '“dass” yan cümlesinde fiili sona koyarak görüş cümlesini kurun.',
        tokens: ['Ich', 'denke,', 'dass', 'der', 'Kurs', 'sehr', 'hilfreich', 'ist.'],
        acceptedSentencesDe: ['Ich denke, dass der Kurs sehr hilfreich ist.'],
        canonicalSentenceDe: 'Ich denke, dass der Kurs sehr hilfreich ist.',
        explanationTr: '“dass” yan cümlesinde çekimli fiil (“ist”) cümlenin en sonuna gider.',
      },
      {
        id: 'a2-write-meinung-ctrl-2',
        kind: 'satzbau',
        instructionDe: 'Bilden Sie einen Bedingungssatz mit „Wenn“ am Satzanfang.',
        instructionTr: 'Başta “Wenn” ile koşul cümlesi kurun (virgül sonrası fiil-fiil kuralı).',
        tokens: ['Wenn', 'ich', 'Zeit', 'habe,', 'komme', 'ich', 'gern.'],
        acceptedSentencesDe: ['Wenn ich Zeit habe, komme ich gern.'],
        canonicalSentenceDe: 'Wenn ich Zeit habe, komme ich gern.',
        explanationTr:
          '“Wenn” cümlesi başta geldiğinde yan cümle fiili (“habe”) virgülden önce, ana cümle fiili (“komme”) virgülden hemen sonra gelir.',
      },
      {
        id: 'a2-write-meinung-ctrl-3',
        kind: 'cloze-typed',
        beforeBlankDe: 'Ich finde Ihren',
        afterBlankDe: 'für einen Konversationskurs sehr gut.',
        hintTr: '“öneri” anlamına gelen Almanca isim (büyük harfle başlar)',
        acceptedAnswers: ['Vorschlag'],
        canonicalAnswer: 'Vorschlag',
        requiresCapitalizedNoun: true,
        disallowLeadingArticle: true,
        explanationTr:
          '“der Vorschlag” (öneri) Akkusativ’de “Ihren Vorschlag” olur; isim büyük harfle yazılır.',
      },
    ],
  },
];

export function getA2WritingScenarioById(id?: string): A2WritingScenario {
  return GERMAN_A2_WRITING_SCENARIOS.find((s) => s.id === id) ?? GERMAN_A2_WRITING_SCENARIOS[0];
}

export function getA2WritingScenarioTaskIds(scenario: A2WritingScenario): string[] {
  return [scenario.messageTask.id, ...scenario.controlledItems.map((c) => c.id)];
}

export const ALL_A2_WRITING_TASK_IDS: string[] = GERMAN_A2_WRITING_SCENARIOS.flatMap(
  getA2WritingScenarioTaskIds
);

export const TOTAL_A2_WRITING_TASKS = ALL_A2_WRITING_TASK_IDS.length;
