import imgAsset1 from '../assets/images/a2_horen_arztpraxis_rezept_1795439826898.jpg';
import imgAsset2 from '../assets/images/a2_horen_bahnhof_ansage_1795439767199.jpg';
import imgAsset3 from '../assets/images/a2_horen_termin_buero_1795439784881.jpg';
import imgAsset4 from '../assets/images/a2_horen_wochenende_plan_1795439768093.jpg';
import type { A2ListeningScenario } from '../types';

export const GERMAN_A2_LISTENING_SCENARIOS: A2ListeningScenario[] = [
  {
    id: 'a2-horen-termin',
    titleDe: 'Termin im Büro verschieben',
    titleTr: 'İşyerinde Randevu Erteleme',
    contextLabelTr: 'İş Hayatı & Randevu',
    subtitleTr:
      'Telefon görüşmesinde tarih/saat değişikliğini, gerekçeyi (weil) ve yeni planı anlayın.',
    cefrFocusTr: 'weil / dass yan cümleleri · tarih ve saat değişikliği · nazik ricada bulunma (könnten)',
    estimatedMinutes: 6,
    imageUrl: imgAsset3,
    imageAlt: 'Haftalık randevu ajandası ve dizüstü bilgisayar bulunan Almanca ofis masası',
    lines: [
      {
        id: 'a2h-t-1',
        speaker: 'Frau Weber',
        speakerGender: 'female',
        textDe: 'Guten Morgen, Firma Nordlicht, Weber am Apparat. Wie kann ich Ihnen helfen?',
        textTr: 'Günaydın, Nordlicht firması, telefonda Weber. Size nasıl yardımcı olabilirim?',
      },
      {
        id: 'a2h-t-2',
        speaker: 'Herr Demir',
        speakerGender: 'male',
        textDe:
          'Guten Morgen, Frau Weber. Hier spricht Kerem Demir. Wir haben eigentlich am Dienstag um zehn Uhr ein Gespräch über das neue Projekt.',
        textTr:
          'Günaydın Bayan Weber. Ben Kerem Demir. Aslında salı günü saat onda yeni proje hakkında bir görüşmemiz var.',
      },
      {
        id: 'a2h-t-3',
        speaker: 'Frau Weber',
        speakerGender: 'female',
        textDe: 'Ja, genau, der Termin steht schon in meinem Kalender. Gibt es ein Problem?',
        textTr: 'Evet, tam olarak öyle, randevu takvimimde kayıtlı. Bir sorun mu var?',
      },
      {
        id: 'a2h-t-4',
        speaker: 'Herr Demir',
        speakerGender: 'male',
        textDe:
          'Leider ja. Ich muss am Dienstagvormittag nach Hamburg fahren, weil ein wichtiger Kunde unsere Hilfe braucht. Könnten wir den Termin auf Donnerstag verschieben?',
        textTr:
          'Maalesef evet. Salı öğleden önce Hamburg’a gitmem gerekiyor çünkü önemli bir müşteri yardımımıza ihtiyaç duyuyor. Randevuyu perşembeye erteleyebilir miyiz?',
      },
      {
        id: 'a2h-t-5',
        speaker: 'Frau Weber',
        speakerGender: 'female',
        textDe:
          'Einen Moment, ich schaue kurz nach. Am Donnerstagmorgen habe ich eine Besprechung, aber am Nachmittag ab vierzehn Uhr dreißig bin ich frei.',
        textTr:
          'Bir saniye, hemen bakıyorum. Perşembe sabahı bir toplantım var ama öğleden sonra saat 14.30’dan itibaren müsaitim.',
      },
      {
        id: 'a2h-t-6',
        speaker: 'Herr Demir',
        speakerGender: 'male',
        textDe:
          'Vierzehn Uhr dreißig passt mir wunderbar. Soll ich die aktuellen Unterlagen schon vorher per E-Mail schicken?',
        textTr:
          'Saat 14.30 bana harika uyar. Güncel belgeleri önceden e-posta ile göndereyim mi?',
      },
      {
        id: 'a2h-t-7',
        speaker: 'Frau Weber',
        speakerGender: 'female',
        textDe:
          'Ja, das wäre sehr hilfreich, damit ich alles in Ruhe lesen kann. Vielen Dank für den Anruf und gute Fahrt nach Hamburg!',
        textTr:
          'Evet, bu çok faydalı olur, böylece her şeyi sakince okuyabilirim. Aradığınız için çok teşekkürler ve Hamburg’a iyi yolculuklar!',
      },
    ],
    trueFalse: [
      {
        id: 'a2h-t-tf1',
        statementDe: 'Herr Demir möchte den Termin absagen, weil er krank ist.',
        statementTr: 'Bay Demir hasta olduğu için randevuyu iptal etmek istiyor.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Bay Demir hasta değil; önemli bir müşteriye yardım etmek için salı öğleden önce Hamburg’a gitmesi gerektiği için randevuyu ertelemek (verschieben) istiyor.',
      },
      {
        id: 'a2h-t-tf2',
        statementDe: 'Am Donnerstagvormittag hat Frau Weber schon eine andere Besprechung.',
        statementTr: 'Bayan Weber’in perşembe sabahı başka bir toplantısı var.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Bayan Weber "Am Donnerstagmorgen habe ich eine Besprechung" diyerek sabah dolu olduğunu, 14.30’dan sonra müsait olduğunu söylüyor.',
      },
      {
        id: 'a2h-t-tf3',
        statementDe: 'Herr Demir will die Unterlagen vor dem Treffen per E-Mail senden.',
        statementTr: 'Bay Demir belgeleri görüşmeden önce e-posta ile göndermek istiyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Bay Demir güncel belgeleri önceden e-posta ile göndermeyi teklif ediyor, Bayan Weber de bunu çok faydalı buluyor.',
      },
    ],
    cloze: [
      {
        id: 'a2h-t-cl1',
        promptDe: 'Könnten wir den Termin auf Donnerstag ___?',
        hintTr: 'Randevuyu başka bir güne "ertelemek" anlamına gelen ayrılmaz fiil.',
        options: ['verschieben', 'verlieren', 'verkaufen', 'verstehen'],
        correctOption: 'verschieben',
        explanationTr:
          '"einen Termin verschieben" Almancada bir randevuyu ileri bir tarihe ertelemek anlamına gelen temel A2 kalıbıdır.',
      },
      {
        id: 'a2h-t-cl2',
        promptDe: 'Ich muss nach Hamburg fahren, ___ ein wichtiger Kunde unsere Hilfe braucht.',
        hintTr: 'Sebep bildiren ve fiili cümlenin sonuna atan bağlaç ("çünkü").',
        options: ['weil', 'aber', 'oder', 'trotzdem'],
        correctOption: 'weil',
        explanationTr:
          '"weil" yan cümle bağlacı gerekçe bildirir ve çekimli fiili (braucht) cümlenin en sonuna gönderir.',
      },
      {
        id: 'a2h-t-cl3',
        promptDe: 'Am Nachmittag ab vierzehn Uhr dreißig bin ich ___.',
        hintTr: 'Takvimde "müsait / boş" anlamına gelen sıfat.',
        options: ['frei', 'fertig', 'früh', 'fremd'],
        correctOption: 'frei',
        explanationTr:
          '"frei sein" randevu bağlamında "müsait olmak" demektir; "am Nachmittag ab 14:30 Uhr bin ich frei".',
      },
    ],
    multipleChoice: [
      {
        id: 'a2h-t-mc1',
        questionTr: 'Yeni görüşme ne zaman yapılacak?',
        questionDe: 'Wann findet das neue Gespräch statt?',
        options: [
          'Salı günü saat 10.00’da',
          'Perşembe günü saat 10.00’da',
          'Perşembe günü saat 14.30’da',
          'Cuma öğleden sonra Hamburg’da',
        ],
        correctIndex: 2,
        explanationTr:
          'İlk randevu salı 10.00’daydı. Perşembe sabahı Bayan Weber’in toplantısı olduğu için ikisi perşembe saat 14.30 konusunda anlaşıyor.',
      },
      {
        id: 'a2h-t-mc2',
        questionTr: 'Bayan Weber belgelerin önceden gelmesini neden istiyor?',
        questionDe: 'Warum möchte Frau Weber die Unterlagen schon vorher bekommen?',
        options: [
          'Belgeleri müşteriye kargolamak için',
          'Her şeyi sakince önceden okuyabilmek için',
          'Toplantıyı tamamen e-posta ile yapmak için',
          'Hamburg’daki ofise yönlendirmek için',
        ],
        correctIndex: 1,
        explanationTr:
          'Bayan Weber "damit ich alles in Ruhe lesen kann" (böylece her şeyi sakince okuyabileyim) diyerek gerekçesini açıkça belirtiyor.',
      },
    ],
  },
  {
    id: 'a2-horen-bahnhof',
    titleDe: 'Durchsage & Umstieg am Bahnhof',
    titleTr: 'İstasyonda Anons ve Aktarma',
    contextLabelTr: 'Seyahat & Ulaşım',
    subtitleTr:
      'Tren istasyonu anonsundaki gecikme, peron değişikliği ve aktarma yönlendirmelerini yakalayın.',
    cefrFocusTr: 'Resmi anons dili (Durchsage) · sayılar & peron (Gleis) · yön ve aktarma ifadeleri',
    estimatedMinutes: 6,
    imageUrl: imgAsset2,
    imageAlt: 'Bölgesel trenin yanaştığı modern Alman tren istasyonu peronu',
    lines: [
      {
        id: 'a2h-b-1',
        speaker: 'Bahnhofsansage',
        speakerGender: 'female',
        textDe:
          'Achtung, eine wichtige Durchsage für die Fahrgäste nach Köln Hauptbahnhof: Der Regionalexpress RE 5, planmäßige Abfahrt elf Uhr zwanzig, hat heute leider etwa fünfzehn Minuten Verspätung.',
        textTr:
          'Dikkat, Köln Merkez İstasyonu yolcuları için önemli bir anons: Planlı kalkışı 11.20 olan RE 5 bölgesel ekspres treni bugün maalesef yaklaşık on beş dakika gecikmelidir.',
      },
      {
        id: 'a2h-b-2',
        speaker: 'Bahnhofsansage',
        speakerGender: 'female',
        textDe:
          'Bitte beachten Sie außerdem eine Gleisänderung: Der Zug fährt heute nicht von Gleis vier, sondern von Gleis sieben ab. Wir bitten um Ihr Verständnis.',
        textTr:
          'Lütfen ayrıca bir peron değişikliğine dikkat ediniz: Tren bugün 4. perondan değil, 7. perondan kalkacaktır. Anlayışınız için teşekkür ederiz.',
      },
      {
        id: 'a2h-b-3',
        speaker: 'Reisender (Lukas)',
        speakerGender: 'male',
        textDe:
          'Entschuldigung, haben Sie das gerade gehört? Fährt der Zug nach Köln jetzt wirklich von Gleis sieben?',
        textTr:
          'Affedersiniz, az önceki anonsu duydunuz mu? Köln treni şimdi gerçekten 7. perondan mı kalkıyor?',
      },
      {
        id: 'a2h-b-4',
        speaker: 'Reisende (Hannah)',
        speakerGender: 'female',
        textDe:
          'Ja, genau! Und er kommt fünfzehn Minuten später. Wir müssen also die Treppe runter und durch die Unterführung zu Gleis sieben gehen.',
        textTr:
          'Evet, tam olarak öyle! Ve on beş dakika daha geç geliyor. Yani merdivenlerden inip alt geçitten 7. perona gitmeliyiz.',
      },
      {
        id: 'a2h-b-5',
        speaker: 'Reisender (Lukas)',
        speakerGender: 'male',
        textDe:
          'Oh je, ich muss in Köln in den ICE nach Frankfurt umsteigen. Hoffentlich verpasse ich meinen Anschlusszug nicht!',
        textTr:
          'Eyvah, Köln’de Frankfurt’a giden ICE trenine aktarma yapmam gerekiyor. Umarım bağlantı trenimi kaçırmam!',
      },
      {
        id: 'a2h-b-6',
        speaker: 'Reisende (Hannah)',
        speakerGender: 'female',
        textDe:
          'Fragen Sie am besten im Zug sofort den Schaffner. Manchmal wartet der Anschlusszug ein paar Minuten, oder man darf den nächsten ICE ohne Aufpreis nehmen.',
        textTr:
          'En iyisi trende hemen kondüktöre sorun. Bazen bağlantı treni birkaç dakika bekler ya da ek ücret ödemeden bir sonraki ICE’ye binmeye izin verilir.',
      },
      {
        id: 'a2h-b-7',
        speaker: 'Reisender (Lukas)',
        speakerGender: 'male',
        textDe:
          'Das ist eine gute Idee, vielen Dank! Gehen wir schnell zusammen rüber zu Gleis sieben.',
        textTr: 'Bu iyi bir fikir, çok teşekkürler! Hızlıca birlikte 7. perona geçelim.',
      },
    ],
    trueFalse: [
      {
        id: 'a2h-b-tf1',
        statementDe: 'Der Regionalexpress RE 5 fährt heute pünktlich um elf Uhr zwanzig ab.',
        statementTr: 'RE 5 bölgesel ekspres treni bugün tam vaktinde saat 11.20’de kalkıyor.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Anonsa göre trenin planlı kalkışı 11.20 olsa da bugün yaklaşık 15 dakika gecikmesi (Verspätung) var.',
      },
      {
        id: 'a2h-b-tf2',
        statementDe: 'Die Fahrgäste müssen zu Gleis sieben wechseln.',
        statementTr: 'Yolcuların 7. perona geçmesi gerekiyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Peron değişikliği (Gleisänderung) nedeniyle tren 4. peron yerine 7. perondan kalkıyor.',
      },
      {
        id: 'a2h-b-tf3',
        statementDe: 'Lukas möchte in Köln umsteigen und weiter nach Frankfurt fahren.',
        statementTr: 'Lukas Köln’de aktarma yapıp Frankfurt’a devam etmek istiyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Lukas "ich muss in Köln in den ICE nach Frankfurt umsteigen" diyerek aktarma yapacağını söylüyor.',
      },
    ],
    cloze: [
      {
        id: 'a2h-b-cl1',
        promptDe: 'Der Zug hat heute leider etwa fünfzehn Minuten ___.',
        hintTr: 'Toplu taşımada "gecikme" anlamına gelen A2 ismi.',
        options: ['Verspätung', 'Verbindung', 'Vorbereitung', 'Veranstaltung'],
        correctOption: 'Verspätung',
        explanationTr:
          '"Verspätung haben" tren, otobüs ve uçuş anonslarında "gecikmesi olmak" anlamına gelir.',
      },
      {
        id: 'a2h-b-cl2',
        promptDe: 'Der Zug fährt heute nicht von Gleis vier, ___ von Gleis sieben ab.',
        hintTr: '"... değil, aksine ..." karşıtlığını kuran bağlaç.',
        options: ['sondern', 'denn', 'weil', 'obwohl'],
        correctOption: 'sondern',
        explanationTr:
          '"nicht A, sondern B" kalıbı olumsuzlanan bir bilgiyi düzeltirken kullanılır ("4. perondan değil, 7. perondan").',
      },
      {
        id: 'a2h-b-cl3',
        promptDe: 'Ich muss in Köln in den ICE nach Frankfurt ___.',
        hintTr: 'Bir araçtan başka bir araca "aktarma yapmak" fiili.',
        options: ['umsteigen', 'einsteigen', 'aussteigen', 'mitnehmen'],
        correctOption: 'umsteigen',
        explanationTr:
          '"umsteigen" aktarma yapmak demektir; "einsteigen" binmek, "aussteigen" ise inmek anlamındadır.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2h-b-mc1',
        questionTr: 'Yolcular 7. perona nasıl ulaşacak?',
        questionDe: 'Wie kommen die Fahrgäste zu Gleis sieben?',
        options: [
          'İstasyon dışına çıkıp otobüse binerek',
          'Merdivenlerden inip alt geçitten geçerek',
          'Asansörle çatı katına çıkarak',
          'Aynı peronun diğer ucuna yürüyerek',
        ],
        correctIndex: 1,
        explanationTr:
          'Hannah "Wir müssen also die Treppe runter und durch die Unterführung zu Gleis sieben gehen" diyerek alt geçidi tarif ediyor.',
      },
      {
        id: 'a2h-b-mc2',
        questionTr: 'Hannah, Lukas’a bağlantı treni konusunda ne tavsiye ediyor?',
        questionDe: 'Was empfiehlt Hannah Lukas wegen seines Anschlusszugs?',
        options: [
          'İstasyonda hemen yeni bir bilet satın almasını',
          'Trende hemen kondüktöre sormasını',
          'Frankfurt yerine Köln’de kalmasını',
          'Taksiyle Frankfurt’a gitmesini',
        ],
        correctIndex: 1,
        explanationTr:
          'Hannah, trende hemen kondüktöre (dem Schaffner) sormasını; bağlantı treninin bekleyebileceğini veya ek ücretsiz sonraki ICE’ye izin verilebileceğini söylüyor.',
      },
    ],
  },
  {
    id: 'a2-horen-gesundheit',
    titleDe: 'In der Arztpraxis & Apotheke',
    titleTr: 'Doktor Muayenehanesi ve Eczane',
    contextLabelTr: 'Sağlık & Hizmetler',
    subtitleTr:
      'Şikâyetleri, doktor tavsiyesini, reçeteyi ve ilaç kullanım talimatını eksiksiz kavrayın.',
    cefrFocusTr: 'sağlık şikâyetleri · modal fiiller (sollen / dürfen) · zaman zarfları (seit + Dativ)',
    estimatedMinutes: 6,
    imageUrl: imgAsset1,
    imageAlt: 'Aydınlık Alman doktor muayenehanesi danışma ve eczane tezgâhı',
    lines: [
      {
        id: 'a2h-g-1',
        speaker: 'Ärztin',
        speakerGender: 'female',
        textDe: 'Guten Tag, Herr Yılmaz! Was führt Sie heute zu mir? Welche Beschwerden haben Sie?',
        textTr: 'İyi günler Bay Yılmaz! Bugün sizi bana getiren nedir? Hangi şikâyetleriniz var?',
      },
      {
        id: 'a2h-g-2',
        speaker: 'Patient (Emre)',
        speakerGender: 'male',
        textDe:
          'Guten Tag, Frau Doktor. Seit drei Tagen habe ich starke Halsschmerzen und Husten. Gestern Abend hatte ich außerdem leichtes Fieber.',
        textTr:
          'İyi günler doktor hanım. Üç gündür şiddetli boğaz ağrım ve öksürüğüm var. Dün akşam ayrıca hafif ateşim vardı.',
      },
      {
        id: 'a2h-g-3',
        speaker: 'Ärztin',
        speakerGender: 'female',
        textDe:
          'Ich untersuche Sie kurz. Ihr Hals ist ziemlich rot, aber die Lunge klingt zum Glück ganz frei. Es ist eine starke Erkältung.',
        textTr:
          'Sizi kısaca muayene edeyim. Boğazınız epey kızarık ama neyse ki akciğerleriniz tamamen temiz duyuluyor. Şiddetli bir soğuk algınlığı.',
      },
      {
        id: 'a2h-g-4',
        speaker: 'Patient (Emre)',
        speakerGender: 'male',
        textDe:
          'Brauche ich ein Antibiotikum? Und kann ich morgen wieder arbeiten gehen?',
        textTr: 'Antibiyotiğe ihtiyacım var mı? Ve yarın tekrar işe gidebilir miyim?',
      },
      {
        id: 'a2h-g-5',
        speaker: 'Ärztin',
        speakerGender: 'female',
        textDe:
          'Nein, ein Antibiotikum ist nicht nötig. Aber Sie sollten bis Freitag zu Hause bleiben und sich gut ausruhen. Ich schreibe Sie für drei Tage krank.',
        textTr:
          'Hayır, antibiyotik gerekli değil. Ancak cumaya kadar evde kalmalı ve iyice dinlenmelisiniz. Size üç günlük hastalık raporu yazıyorum.',
      },
      {
        id: 'a2h-g-6',
        speaker: 'Ärztin',
        speakerGender: 'female',
        textDe:
          'Hier ist Ihr Rezept für die Apotheke. Nehmen Sie den Hustensaft zweimal täglich nach dem Essen ein und trinken Sie viel warmen Tee.',
        textTr:
          'Eczane için reçeteniz burada. Öksürük şurubunu günde iki kez yemekten sonra alın ve bol sıcak çay için.',
      },
      {
        id: 'a2h-g-7',
        speaker: 'Patient (Emre)',
        speakerGender: 'male',
        textDe:
          'Vielen Dank, Frau Doktor. Ich gehe gleich nebenan in die Apotheke und hole das Medikament ab.',
        textTr:
          'Çok teşekkürler doktor hanım. Hemen yan taraftaki eczaneye gidip ilacı alacağım.',
      },
    ],
    trueFalse: [
      {
        id: 'a2h-g-tf1',
        statementDe: 'Emre hat seit drei Tagen Halsschmerzen und Husten.',
        statementTr: 'Emre’nin üç gündür boğaz ağrısı ve öksürüğü var.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Emre şikâyetlerini "Seit drei Tagen habe ich starke Halsschmerzen und Husten" şeklinde ifade ediyor.',
      },
      {
        id: 'a2h-g-tf2',
        statementDe: 'Die Ärztin verschreibt Emre ein Antibiotikum.',
        statementTr: 'Doktor Emre’ye antibiyotik reçete ediyor.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Doktor "Nein, ein Antibiotikum ist nicht nötig" diyerek antibiyotiğe gerek olmadığını, öksürük şurubu (Hustensaft) yazacağını söylüyor.',
      },
      {
        id: 'a2h-g-tf3',
        statementDe: 'Emre soll den Hustensaft vor dem Frühstück nehmen.',
        statementTr: 'Emre öksürük şurubunu kahvaltıdan önce almalı.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Doktor kullanım talimatını "zweimal täglich nach dem Essen" (günde iki kez yemekten sonra) olarak veriyor.',
      },
    ],
    cloze: [
      {
        id: 'a2h-g-cl1',
        promptDe: '___ drei Tagen habe ich starke Halsschmerzen und Husten.',
        hintTr: 'Geçmişte başlayıp hâlâ süren zamanı bildiren edat ("-den beri").',
        options: ['Seit', 'Vor', 'Nach', 'Bis'],
        correctOption: 'Seit',
        explanationTr:
          '"seit" edatı Dativ ile kullanılır ve geçmişte başlayıp konuşma anında hâlâ devam eden durumları bildirir ("seit drei Tagen").',
      },
      {
        id: 'a2h-g-cl2',
        promptDe: 'Sie sollten bis Freitag zu Hause bleiben und sich gut ___.',
        hintTr: '"Dinlenmek" anlamına gelen dönüşlü (reflexiv) A2 fiili.',
        options: ['ausruhen', 'aufstehen', 'anmelden', 'aufmachen'],
        correctOption: 'ausruhen',
        explanationTr:
          '"sich ausruhen" dinlenmek anlamına gelir ve doktor tavsiyelerinde sıkça kullanılır.',
      },
      {
        id: 'a2h-g-cl3',
        promptDe: 'Hier ist Ihr ___ für die Apotheke.',
        hintTr: 'Doktorun ilaç almak için yazdığı "reçete".',
        options: ['Rezept', 'Formular', 'Zeugnis', 'Ticket'],
        correctOption: 'Rezept',
        explanationTr:
          '"das Rezept" hem yemek tarifi hem de eczaneye verilen doktor reçetesi anlamına gelir.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2h-g-mc1',
        questionTr: 'Doktor muayene sonucunda Emre için neye karar veriyor?',
        questionDe: 'Was entscheidet die Ärztin nach der Untersuchung?',
        options: [
          'Hastaneye yatması gerektiğine',
          'Yarın işe dönebileceğine',
          'Üç gün raporlu olup cumaya kadar evde dinlenmesine',
          'Sadece soğuk içecekler tüketmesine',
        ],
        correctIndex: 2,
        explanationTr:
          'Doktor şiddetli soğuk algınlığı nedeniyle Emre’ye üç gün rapor (krankschreiben) veriyor ve cumaya kadar evde dinlenmesini öneriyor.',
      },
      {
        id: 'a2h-g-mc2',
        questionTr: 'Emre muayenehaneden çıktıktan hemen sonra nereye gidecek?',
        questionDe: 'Wohin geht Emre direkt nach dem Arztbesuch?',
        options: [
          'İşyerine raporunu teslim etmeye',
          'Yan taraftaki eczaneye ilacını almaya',
          'Tren istasyonuna bilet değiştirmeye',
          'Spor salonuna',
        ],
        correctIndex: 1,
        explanationTr:
          'Emre "Ich gehe gleich nebenan in die Apotheke und hole das Medikament ab" diyerek yan taraftaki eczaneye gideceğini söylüyor.',
      },
    ],
  },
  {
    id: 'a2-horen-plaene',
    titleDe: 'Wochenendpläne & Erfahrungen',
    titleTr: 'Hafta Sonu Planları ve Deneyimler',
    contextLabelTr: 'Günlük Yaşam & Planlar',
    subtitleTr:
      'Geçmiş deneyim anlatımını (Perfekt), kişisel görüşleri ve hafta sonu planı üzerinde anlaşmayı dinleyin.',
    cefrFocusTr: 'Perfekt ile deneyim anlatımı · öneri ve görüş bildirme · obwohl / wenn bağlaçları',
    estimatedMinutes: 6,
    imageUrl: imgAsset4,
    imageAlt: 'Berlin kafesinde harita, iki fincan kahve ve not defterleri bulunan ahşap masa',
    lines: [
      {
        id: 'a2h-p-1',
        speaker: 'Selin',
        speakerGender: 'female',
        textDe:
          'Na, Jonas, wie war dein letztes Wochenende? Du wolltest doch eigentlich ans Meer fahren, oder?',
        textTr:
          'Ee Jonas, geçen hafta sonun nasıldı? Aslında denize gitmek istiyordun, değil mi?',
      },
      {
        id: 'a2h-p-2',
        speaker: 'Jonas',
        speakerGender: 'male',
        textDe:
          'Ja, aber am Samstag hat es den ganzen Tag geregnet. Deshalb bin ich in Berlin geblieben und habe mit meiner Schwester eine Fotoausstellung besucht.',
        textTr:
          'Evet ama cumartesi bütün gün yağmur yağdı. Bu yüzden Berlin’de kaldım ve kız kardeşimle bir fotoğraf sergisi gezdim.',
      },
      {
        id: 'a2h-p-3',
        speaker: 'Selin',
        speakerGender: 'female',
        textDe:
          'Oh, das klingt aber auch sehr schön! Hat dir die Ausstellung gefallen?',
        textTr: 'Aa, o da kulağa çok hoş geliyor! Sergi hoşuna gitti mi?',
      },
      {
        id: 'a2h-p-4',
        speaker: 'Jonas',
        speakerGender: 'male',
        textDe:
          'Total! Obwohl das Museum ziemlich voll war, waren die Bilder wirklich beeindruckend. Und was hast du für dieses Wochenende geplant?',
        textTr:
          'Kesinlikle! Müze epey kalabalık olmasına rağmen fotoğraflar gerçekten etkileyiciydi. Peki sen bu hafta sonu için ne planladın?',
      },
      {
        id: 'a2h-p-5',
        speaker: 'Selin',
        speakerGender: 'female',
        textDe:
          'Der Wetterbericht sagt, dass es am Sonntag sonnig und warm wird. Ich möchte gern eine Wanderung in den Bergen bei Potsdam machen. Hast du Lust mitzukommen?',
        textTr:
          'Hava durumu pazar günü güneşli ve sıcak olacağını söylüyor. Potsdam yakınlarında doğa yürüyüşü yapmak istiyorum. Benimle gelmek ister misin?',
      },
      {
        id: 'a2h-p-6',
        speaker: 'Jonas',
        speakerGender: 'male',
        textDe:
          'Sehr gern! Ich muss nur noch meine Wanderschuhe sauber machen. Wann sollen wir uns treffen?',
        textTr:
          'Memnuniyetle! Sadece yürüyüş ayakkabılarımı temizlemem gerekiyor. Saat kaçta buluşalım?',
      },
      {
        id: 'a2h-p-7',
        speaker: 'Selin',
        speakerGender: 'female',
        textDe:
          'Wenn wir um neun Uhr am Bahnhof starten, sind wir pünktlich zum Mittagessen am See. Ich bringe belegte Brötchen und Obst mit!',
        textTr:
          'Saat dokuzda istasyondan yola çıkarsak öğle yemeğine tam vaktinde gölde oluruz. Ben sandviç ve meyve getiririm!',
      },
    ],
    trueFalse: [
      {
        id: 'a2h-p-tf1',
        statementDe: 'Jonas ist am letzten Wochenende wegen des Regens nicht ans Meer gefahren.',
        statementTr: 'Jonas geçen hafta sonu yağmur yüzünden denize gitmedi.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Cumartesi bütün gün yağmur yağdığı için Jonas Berlin’de kalmış ve sergiye gitmiş.',
      },
      {
        id: 'a2h-p-tf2',
        statementDe: 'Jonas fand die Fotoausstellung langweilig.',
        statementTr: 'Jonas fotoğraf sergisini sıkıcı buldu.',
        isTrue: false,
        explanationTr:
          'Yanlış (Falsch). Jonas müze kalabalık olsa da fotoğrafların gerçekten etkileyici ("wirklich beeindruckend") olduğunu söylüyor.',
      },
      {
        id: 'a2h-p-tf3',
        statementDe: 'Selin und Jonas wollen sich am Sonntag um neun Uhr am Bahnhof treffen.',
        statementTr: 'Selin ve Jonas pazar günü saat dokuzda istasyonda buluşmak istiyor.',
        isTrue: true,
        explanationTr:
          'Doğru (Richtig). Selin saat dokuzda istasyondan hareket etmeyi öneriyor ve sandviç ile meyve getireceğini ekliyor.',
      },
    ],
    cloze: [
      {
        id: 'a2h-p-cl1',
        promptDe: 'Deshalb ___ ich in Berlin geblieben und habe eine Ausstellung besucht.',
        hintTr: '"bleiben" (kalmak) fiilinin Perfekt yardımcı fiili (ich çekimi).',
        options: ['bin', 'habe', 'war', 'werde'],
        correctOption: 'bin',
        explanationTr:
          'Almancada "bleiben" fiili istisnai olarak Perfekt zamanında "sein" yardımcı fiiliyle kurulur: "ich bin geblieben".',
      },
      {
        id: 'a2h-p-cl2',
        promptDe: '___ das Museum ziemlich voll war, waren die Bilder beeindruckend.',
        hintTr: '"-e rağmen" anlamında zıtlık kuran yan cümle bağlacı.',
        options: ['Obwohl', 'Weil', 'Deshalb', 'Damit'],
        correctOption: 'Obwohl',
        explanationTr:
          '"obwohl" (-e rağmen) karşıt bir durum bildirir ve yan cümlede fiili (war) sona atar.',
      },
      {
        id: 'a2h-p-cl3',
        promptDe: 'Der Wetterbericht sagt, ___ es am Sonntag sonnig und warm wird.',
        hintTr: 'Aktarma cümlesi kuran "ki / -dığını" bağlacı.',
        options: ['dass', 'wann', 'woher', 'sonst'],
        correctOption: 'dass',
        explanationTr:
          '"sagen, dass ..." yapısı bir bilgiyi veya tahmini aktarırken kullanılır ve fiili (wird) cümle sonuna taşır.',
      },
    ],
    multipleChoice: [
      {
        id: 'a2h-p-mc1',
        questionTr: 'Jonas geçen hafta sonu kiminle fotoğraf sergisine gitti?',
        questionDe: 'Mit wem hat Jonas am letzten Wochenende die Fotoausstellung besucht?',
        options: [
          'Selin ile',
          'Kız kardeşiyle',
          'İş arkadaşlarıyla',
          'Tek başına',
        ],
        correctIndex: 1,
        explanationTr:
          'Jonas "habe mit meiner Schwester eine Fotoausstellung besucht" diyerek kız kardeşiyle gittiğini belirtiyor.',
      },
      {
        id: 'a2h-p-mc2',
        questionTr: 'Selin pazar günkü yürüyüş için yanına ne getirecek?',
        questionDe: 'Was bringt Selin für die Wanderung am Sonntag mit?',
        options: [
          'Sıcak çay ve pasta',
          'Yeni yürüyüş ayakkabıları',
          'Sandviç (belegte Brötchen) ve meyve',
          'Şemsiye ve yağmurluk',
        ],
        correctIndex: 2,
        explanationTr:
          'Selin konuşmanın sonunda "Ich bringe belegte Brötchen und Obst mit!" diyerek sandviç ve meyve getireceğini söylüyor.',
      },
    ],
  },
];

export function getA2ListeningScenarioById(id: string): A2ListeningScenario | undefined {
  return GERMAN_A2_LISTENING_SCENARIOS.find((s) => s.id === id);
}

export function getA2ListeningExerciseIds(scenario: A2ListeningScenario): string[] {
  return [
    ...scenario.trueFalse.map((q) => q.id),
    ...scenario.cloze.map((q) => q.id),
    ...scenario.multipleChoice.map((q) => q.id),
  ];
}

export const ALL_A2_LISTENING_EXERCISE_IDS: string[] = GERMAN_A2_LISTENING_SCENARIOS.flatMap(
  (scenario) => getA2ListeningExerciseIds(scenario)
);

export const TOTAL_A2_LISTENING_EXERCISES: number = ALL_A2_LISTENING_EXERCISE_IDS.length;
