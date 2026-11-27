import type { SpeakingScenario } from '../types';
import sprechenAlltagImg from '../assets/images/sprechen_alltag_intro_1795389385794.jpg';
import sprechenCafeImg from '../assets/images/sprechen_cafe_order_1795389386360.jpg';
import sprechenWohnungImg from '../assets/images/sprechen_wohnung_neighbor_1795389385345.jpg';
import sprechenReisenImg from '../assets/images/sprechen_reisen_station_1795389386947.jpg';

export const GERMAN_A1_SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 'sprechen-alltag',
    titleDe: 'Vorstellung & Alltag',
    titleTr: 'Tanışma ve Günlük Yaşam',
    contextLabelTr: 'Günlük İletişim · Kendini Tanıtma',
    subtitleTr: 'Kendini tanıtma, yaşadığı şehri söyleme ve kursta kısa tanışma diyaloğu.',
    estimatedMinutes: 6,
    imageUrl: sprechenAlltagImg,
    imageAlt: 'Aydınlık dil kursu sınıfında masada sohbet ederek Almanca pratik yapan öğrenciler',
    repeatItems: [
      {
        id: 'sprechen-alltag-rep-1',
        titleTr: 'Cümle 1 · Kendini ve şehrini tanıtma',
        textDe: 'Hallo! Ich heiße Deniz, komme aus der Türkei und wohne jetzt in Berlin.',
        textTr: 'Merhaba! Benim adım Deniz, Türkiye’den geliyorum ve şimdi Berlin’de yaşıyorum.',
        pronunciationFocusDe: 'ei [ay] (heiße) · ch [iç] (ich) · ü (Türkei)',
        pronunciationTipTr:
          '“heiße” sözcüğündeki “ei” sesini “ay” gibi, “ß” harfini keskin “s” gibi söyleyin; “ich” sonunda gırtlaktan değil yumuşak ön damaktan gelen “h/ş” arası bir ses çıkarın.',
        speakerGender: 'female',
        selfCheckCriteria: [
          {
            id: 'rep-a1-1',
            labelTr: 'Model cümleyi en az bir kez dinleyip yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-a1-2',
            labelTr: '“heiße” ve “ich” seslerini net ve anlaşılır biçimde söyledim.',
          },
          {
            id: 'rep-a1-3',
            labelTr: 'Cümleyi duraksamadan, temel A1 ritmiyle tamamlayabildim.',
          },
        ],
      },
      {
        id: 'sprechen-alltag-rep-2',
        titleTr: 'Cümle 2 · Dil ve meslek bilgisi',
        textDe: 'Ich spreche Türkisch, ein bisschen Englisch und lerne seit zwei Monaten Deutsch.',
        textTr: 'Türkçe, biraz İngilizce konuşuyorum ve iki aydır Almanca öğreniyorum.',
        pronunciationFocusDe: 'sp [şp] (spreche) · zw [tsv] (zwei) · eu [oy] (Deutsch)',
        pronunciationTipTr:
          'Kelime başındaki “sp” birleşimini “şp” (şprehe), “z” harfini “ts” (tsvay) ve “eu” birleşimini “oy” (Doyç) şeklinde telaffuz edin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          {
            id: 'rep-a2-1',
            labelTr: 'Model sesi dinleyip cümleyi yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-a2-2',
            labelTr: '“spreche”, “zwei” ve “Deutsch” sözcüklerindeki temel seslere dikkat ettim.',
          },
          {
            id: 'rep-a2-3',
            labelTr: 'Cümleyi kendi adıma da uyarlayabilecek kadar rahat okuyabildim.',
          },
        ],
      },
    ],
    promptItems: [
      {
        id: 'sprechen-alltag-prm-1',
        titleTr: 'Soru 1 · Ad, şehir ve diller',
        questionDe: 'Wie heißen Sie, wo wohnen Sie und welche Sprachen sprechen Sie?',
        questionTr: 'Adınız nedir, nerede yaşıyorsunuz ve hangi dilleri konuşuyorsunuz?',
        cuesDe: ['Name', 'Stadt / Wohnort', 'Sprachen'],
        cuesTr: ['Adınız', 'Yaşadığınız şehir', 'Konuştuğunuz diller'],
        speakerGender: 'female',
        phrases: [
          {
            id: 'alltag-p1-1',
            german: 'Ich heiße … / Mein Name ist …',
            turkish: 'Benim adım …',
            categoryTr: 'Ad',
          },
          {
            id: 'alltag-p1-2',
            german: 'Ich wohne in …',
            turkish: '… şehrinde yaşıyorum.',
            categoryTr: 'Şehir',
          },
          {
            id: 'alltag-p1-3',
            german: 'Ich spreche Türkisch und lerne Deutsch.',
            turkish: 'Türkçe konuşuyorum ve Almanca öğreniyorum.',
            categoryTr: 'Diller',
          },
        ],
        modelAnswerDe:
          'Ich heiße Selin. Ich wohne in Ankara. Ich spreche Türkisch, Englisch und ein bisschen Deutsch.',
        modelAnswerTr:
          'Benim adım Selin. Ankara’da yaşıyorum. Türkçe, İngilizce ve biraz Almanca konuşuyorum.',
        selfCheckCriteria: [
          {
            id: 'prm-a1-1',
            labelTr: 'Adımı ve yaşadığım şehri tam bir Almanca A1 cümlesiyle söyledim.',
          },
          {
            id: 'prm-a1-2',
            labelTr: 'Konuştuğum veya öğrendiğim dilleri (“Ich spreche … / lerne …”) belirttim.',
          },
          {
            id: 'prm-a1-3',
            labelTr: 'Cevabımı örnek model yanıtla karşılaştırıp anlaşılır buldum.',
          },
        ],
      },
      {
        id: 'sprechen-alltag-prm-2',
        titleTr: 'Soru 2 · Günlük rutin',
        questionDe: 'Was machen Sie am Morgen und wann beginnt Ihr Tag?',
        questionTr: 'Sabahları ne yapıyorsunuz ve gününüz saat kaçta başlıyor?',
        cuesDe: ['Uhrzeit (um … Uhr)', 'Frühstück / Kaffee', 'Arbeit oder Kurs'],
        cuesTr: ['Saat (um … Uhr)', 'Kahvaltı / Kahve', 'İş veya kurs'],
        speakerGender: 'male',
        phrases: [
          {
            id: 'alltag-p2-1',
            german: 'Ich stehe um sieben Uhr auf.',
            turkish: 'Saat yedide kalkıyorum.',
            categoryTr: 'Saat',
          },
          {
            id: 'alltag-p2-2',
            german: 'Ich trinke Kaffee und frühstücke.',
            turkish: 'Kahve içiyorum ve kahvaltı yapıyorum.',
            categoryTr: 'Sabah',
          },
          {
            id: 'alltag-p2-3',
            german: 'Um neun Uhr gehe ich zur Arbeit / zum Kurs.',
            turkish: 'Saat dokuzda işe / kursa gidiyorum.',
            categoryTr: 'Rutin',
          },
        ],
        modelAnswerDe:
          'Mein Tag beginnt um halb acht. Ich trinke zuerst einen Kaffee und frühstücke. Um neun Uhr gehe ich zum Deutschkurs.',
        modelAnswerTr:
          'Günüm yedibuçukta başlıyor. Önce bir kahve içiyorum ve kahvaltı yapıyorum. Saat dokuzda Almanca kursuna gidiyorum.',
        selfCheckCriteria: [
          {
            id: 'prm-a2-1',
            labelTr: 'Günün başlangıç saatini (“um … Uhr”) kullanarak belirttim.',
          },
          {
            id: 'prm-a2-2',
            labelTr: 'Sabah yaptığım en az bir eylemi fiil çekimiyle (“Ich trinke / gehe …”) söyledim.',
          },
          {
            id: 'prm-a2-3',
            labelTr: 'Örnek yanıtı dinleyip telaffuzumu ve kelime sıramı kontrol ettim.',
          },
        ],
      },
    ],
    roleplay: {
      id: 'sprechen-alltag-roleplay',
      titleDe: 'Erster Tag im Deutschkurs',
      titleTr: 'Almanca Kursunda İlk Gün',
      situationDe:
        'Sie sind zum ersten Mal im Deutschkurs A1. Eine neue Kursteilnehmerin (Anna) begrüßt Sie in der Pause und stellt Ihnen drei kurze Fragen.',
      situationTr:
        'Almanca A1 kursunda ilk gününüzdesiniz. Yeni sınıf arkadaşınız Anna teneffüste sizi selamlıyor ve üç kısa soru soruyor.',
      partnerName: 'Anna',
      partnerRoleTr: 'Sınıf Arkadaşı',
      partnerGender: 'female',
      turns: [
        {
          id: 'rp-alltag-t1',
          turnNumber: 1,
          partnerLineDe: 'Hallo! Ich bin Anna. Bist du auch neu im Kurs? Wie heißt du?',
          partnerLineTr: 'Merhaba! Ben Anna. Sen de kursta yeni misin? Adın ne?',
          learnerCueDe: 'Begrüße Anna, bestätige und nenne deinen Namen.',
          learnerCueTr: 'Anna’yı selamla, yeni olduğunu onayla ve adını söyle.',
          modelResponseDe: 'Hallo Anna! Ja, ich bin auch neu hier. Ich heiße Mert.',
          modelResponseTr: 'Merhaba Anna! Evet, ben de burada yeniyim. Benim adım Mert.',
        },
        {
          id: 'rp-alltag-t2',
          turnNumber: 2,
          partnerLineDe: 'Schön, dich kennenzulernen! Woher kommst du und wo wohnst du jetzt?',
          partnerLineTr: 'Tanıştığımıza memnun oldum! Nerelisin ve şimdi nerede yaşıyorsun?',
          learnerCueDe: 'Nenne dein Land und deinen aktuellen Wohnort.',
          learnerCueTr: 'Geldiğin ülkeyi ve şu an yaşadığın şehri söyle.',
          modelResponseDe: 'Ich komme aus der Türkei, aber ich wohne jetzt in München.',
          modelResponseTr: 'Türkiye’den geliyorum ama şimdi Münih’te yaşıyorum.',
        },
        {
          id: 'rp-alltag-t3',
          turnNumber: 3,
          partnerLineDe: 'Super! Hast du nach dem Kurs Zeit für einen Kaffee?',
          partnerLineTr: 'Harika! Kurstan sonra bir kahve için vaktin var mı?',
          learnerCueDe: 'Antworte höflich (ja oder nein) und bedanke dich.',
          learnerCueTr: 'Kibarca kabul et (veya mazeret bildir) ve teşekkür et.',
          modelResponseDe: 'Ja, sehr gern! Vielen Dank, das ist eine gute Idee.',
          modelResponseTr: 'Evet, çok isterim! Çok teşekkürler, bu iyi bir fikir.',
        },
      ],
      phrases: [
        {
          id: 'rp-alltag-ph-1',
          german: 'Freut mich! / Schön, dich kennenzulernen!',
          turkish: 'Memnun oldum! / Tanıştığımıza sevindim!',
          categoryTr: 'Tanışma',
        },
        {
          id: 'rp-alltag-ph-2',
          german: 'Ich komme aus … und wohne in …',
          turkish: '…’den geliyorum ve …’de yaşıyorum.',
          categoryTr: 'Köken',
        },
        {
          id: 'rp-alltag-ph-3',
          german: 'Ja, sehr gern! / Tut mir leid, heute habe ich keine Zeit.',
          turkish: 'Evet, memnuniyetle! / Üzgünüm, bugün vaktim yok.',
          categoryTr: 'Davet Yanıtı',
        },
      ],
      selfCheckCriteria: [
        {
          id: 'rp-a-c1',
          labelTr: 'Anna’nın her 3 repliğini dinleyip sırayla Almanca sesli yanıt verdim.',
        },
        {
          id: 'rp-a-c2',
          labelTr: 'Selamlama, ad/şehir bilgisi ve kahve davetine yanıt noktalarının tamamını kapsadım.',
        },
        {
          id: 'rp-a-c3',
          labelTr: 'En az bir kez örnek yanıtları dinleyip kendi cümlelerimle karşılaştırdım.',
        },
      ],
    },
  },
  {
    id: 'sprechen-speisekarte',
    titleDe: 'Einkaufen & Speisekarte',
    titleTr: 'Alışveriş ve Kafede Sipariş',
    contextLabelTr: 'Kafe & Fırın · Sipariş ve Ödeme',
    subtitleTr: 'Kibarca yiyecek-içecek isteme, fiyat sorma ve kafede hesap ödeme pratiği.',
    estimatedMinutes: 6,
    imageUrl: sprechenCafeImg,
    imageAlt: 'Sıcak aydınlatmalı Avrupa kafesinde kahve ve kruvasan siparişi veren müşteri',
    repeatItems: [
      {
        id: 'sprechen-cafe-rep-1',
        titleTr: 'Cümle 1 · Kibarca sipariş verme',
        textDe: 'Guten Tag! Ich hätte gern einen Milchkaffee und ein Käsebrötchen, bitte.',
        textTr: 'İyi günler! Bir sütlü kahve ve bir peynirli sandviç ekmeği rica edebilir miyim lütfen.',
        pronunciationFocusDe: 'ä [e] (hätte, Käse) · ö (Brötchen) · ch (Milch, -chen)',
        pronunciationTipTr:
          '“hätte” sözcüğündeki “ä” harfini açık “e” gibi okuyun; “Brötchen” sonunda “t” ve yumuşak “ç/h” sesini ayırarak söyleyin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          {
            id: 'rep-c1-1',
            labelTr: 'Model siparişi dinleyip yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-c1-2',
            labelTr: '“Ich hätte gern …” kibar isteme kalıbını akıcı biçimde söyledim.',
          },
          {
            id: 'rep-c1-3',
            labelTr: '“Käsebrötchen” ve “bitte” vurgusunu net ve anlaşılır tuttum.',
          },
        ],
      },
      {
        id: 'sprechen-cafe-rep-2',
        titleTr: 'Cümle 2 · Fiyat sorma ve ödeme',
        textDe: 'Entschuldigung, was kostet das zusammen? Kann ich mit Karte zahlen?',
        textTr: 'Affedersiniz, hepsi toplam ne kadar tutuyor? Kartla ödeyebilir miyim?',
        pronunciationFocusDe: 'sch [ş] (Entschuldigung) · z [ts] (zusammen, zahlen)',
        pronunciationTipTr:
          '“Entschuldigung” kelimesinde “sch” sesini “ş”, “zusammen” ve “zahlen” başındaki “z” harfini “ts” olarak okuyun.',
        speakerGender: 'female',
        selfCheckCriteria: [
          {
            id: 'rep-c2-1',
            labelTr: 'Model soruları dinleyip soru tonlamasıyla tekrar ettim.',
          },
          {
            id: 'rep-c2-2',
            labelTr: '“Entschuldigung” ve “zusammen” telaffuzlarını temiz söyledim.',
          },
          {
            id: 'rep-c2-3',
            labelTr: '“Kann ich mit Karte zahlen?” kalıbını duraksamadan söyleyebildim.',
          },
        ],
      },
    ],
    promptItems: [
      {
        id: 'sprechen-cafe-prm-1',
        titleTr: 'Soru 1 · Kafe siparişi',
        questionDe: 'Was möchten Sie heute trinken und essen?',
        questionTr: 'Bugün ne içmek ve ne yemek istersiniz?',
        cuesDe: ['Ein Getränk', 'Ein Essen / Gebäck', 'Höflich (bitte / gern)'],
        cuesTr: ['Bir içecek', 'Bir yiyecek / hamur işi', 'Kibar ifade (bitte / gern)'],
        speakerGender: 'male',
        phrases: [
          {
            id: 'cafe-p1-1',
            german: 'Ich möchte gern einen Tee / einen Kaffee.',
            turkish: 'Bir çay / bir kahve rica ediyorum.',
            categoryTr: 'İçecek',
          },
          {
            id: 'cafe-p1-2',
            german: 'Und dazu nehme ich ein Stück Kuchen.',
            turkish: 'Yanına da bir dilim pasta alayım.',
            categoryTr: 'Yiyecek',
          },
          {
            id: 'cafe-p1-3',
            german: 'Ohne Zucker, bitte.',
            turkish: 'Şekersiz lütfen.',
            categoryTr: 'Detay',
          },
        ],
        modelAnswerDe:
          'Ich möchte gern einen schwarzen Tee ohne Zucker und dazu ein Stück Apfelkuchen, bitte.',
        modelAnswerTr:
          'Şekersiz bir siyah çay ve yanına bir dilim elmalı kek rica ediyorum lütfen.',
        selfCheckCriteria: [
          {
            id: 'prm-c1-1',
            labelTr: 'En az bir içecek ve bir yiyeceği Almanca sipariş kalıbıyla söyledim.',
          },
          {
            id: 'prm-c1-2',
            labelTr: '“Ich möchte …” veya “Ich hätte gern …” ile “bitte” ifadesini kullandım.',
          },
          {
            id: 'prm-c1-3',
            labelTr: 'Cümlemi örnek model yanıtla kıyaslayıp telaffuzumu doğruladım.',
          },
        ],
      },
      {
        id: 'sprechen-cafe-prm-2',
        titleTr: 'Soru 2 · Pazarda alışveriş',
        questionDe: 'Was kaufen Sie heute auf dem Markt ein?',
        questionTr: 'Bugün pazardan neler alıyorsunuz?',
        cuesDe: ['Obst oder Gemüse', 'Menge (ein Kilo / zwei …)', 'Frage nach dem Preis'],
        cuesTr: ['Meyve veya sebze', 'Miktar (bir kilo / iki adet)', 'Fiyat sorusu'],
        speakerGender: 'female',
        phrases: [
          {
            id: 'cafe-p2-1',
            german: 'Ich brauche ein Kilo Tomaten und vier Äpfel.',
            turkish: 'Bir kilo domatese ve dört elmaya ihtiyacım var.',
            categoryTr: 'Miktar',
          },
          {
            id: 'cafe-p2-2',
            german: 'Was kosten die Erdbeeren?',
            turkish: 'Çileklerin fiyatı ne kadar?',
            categoryTr: 'Fiyat',
          },
          {
            id: 'cafe-p2-3',
            german: 'Das ist alles, danke schön.',
            turkish: 'Hepsi bu kadar, çok teşekkürler.',
            categoryTr: 'Kapanış',
          },
        ],
        modelAnswerDe:
          'Ich kaufe ein Kilo Tomaten, ein Brot und sechs Äpfel. Entschuldigung, was kostet das alles zusammen?',
        modelAnswerTr:
          'Bir kilo domates, bir ekmek ve altı elma alıyorum. Affedersiniz, bunların hepsi toplam ne kadar tutuyor?',
        selfCheckCriteria: [
          {
            id: 'prm-c2-1',
            labelTr: 'En az iki ürünü miktar belirterek söyledim.',
          },
          {
            id: 'prm-c2-2',
            labelTr: 'Fiyat sormak için doğru A1 soru kalıbını (“Was kostet …?”) kurdum.',
          },
          {
            id: 'prm-c2-3',
            labelTr: 'Sesli cevabımın anlaşılır ve eksiksiz olduğunu kontrol ettim.',
          },
        ],
      },
    ],
    roleplay: {
      id: 'sprechen-cafe-roleplay',
      titleDe: 'Bestellung im Café Linden',
      titleTr: 'Linden Kafede Sipariş',
      situationDe:
        'Sie sitzen im Café Linden. Der Kellner (Lukas) kommt an Ihren Tisch. Bestellen Sie etwas zu trinken und zu essen und fragen Sie am Ende nach der Rechnung.',
      situationTr:
        'Linden Kafede oturuyorsunuz. Garson Lukas masanıza geliyor. Bir içecek ile bir yiyecek sipariş edin ve sonunda hesabı isteyin.',
      partnerName: 'Lukas',
      partnerRoleTr: 'Kafe Garsonu',
      partnerGender: 'male',
      turns: [
        {
          id: 'rp-cafe-t1',
          turnNumber: 1,
          partnerLineDe: 'Guten Tag! Willkommen im Café Linden. Was darf ich Ihnen bringen?',
          partnerLineTr: 'İyi günler! Linden Kafeye hoş geldiniz. Size ne getirebilirim?',
          learnerCueDe: 'Begrüße den Kellner und bestelle ein Getränk.',
          learnerCueTr: 'Garsonu selamla ve bir içecek sipariş et.',
          modelResponseDe: 'Guten Tag! Ich hätte gern einen Cappuccino und ein Glas Wasser, bitte.',
          modelResponseTr: 'İyi günler! Bir kapuçino ve bir bardak su rica edebilir miyim lütfen.',
        },
        {
          id: 'rp-cafe-t2',
          turnNumber: 2,
          partnerLineDe: 'Sehr gern. Möchten Sie auch etwas essen? Unser Apfelkuchen ist heute frisch.',
          partnerLineTr: 'Memnuniyetle. Bir şey yemek de ister misiniz? Elmalı kekimiz bugün taze.',
          learnerCueDe: 'Nimm den Kuchen an oder bestelle etwas anderes.',
          learnerCueTr: 'Elmalı keki kabul et veya başka bir yiyecek seç.',
          modelResponseDe: 'Oh, das klingt gut! Dann nehme ich gern ein Stück Apfelkuchen.',
          modelResponseTr: 'Ah, kulağa harika geliyor! O zaman bir dilim elmalı kek alayım.',
        },
        {
          id: 'rp-cafe-t3',
          turnNumber: 3,
          partnerLineDe: 'Hat es Ihnen geschmeckt? Möchten Sie noch etwas oder die Rechnung?',
          partnerLineTr: 'Beğendiniz mi? Başka bir arzunuz var mı yoksa hesabı mı istersiniz?',
          learnerCueDe: 'Bedanke dich, bitte um die Rechnung und frage nach Kartenzahlung.',
          learnerCueTr: 'Teşekkür et, hesabı iste ve kartla ödeme yapıp yapamayacağını sor.',
          modelResponseDe:
            'Es war sehr lecker, danke! Ich möchte bitte zahlen. Geht es mit Karte?',
          modelResponseTr:
            'Çok lezzetliydi, teşekkürler! Hesabı ödemek istiyorum lütfen. Kart geçiyor mu?',
        },
      ],
      phrases: [
        {
          id: 'rp-cafe-ph-1',
          german: 'Ich hätte gern … / Ich nehme …',
          turkish: '… rica ediyorum / … alıyorum.',
          categoryTr: 'Sipariş',
        },
        {
          id: 'rp-cafe-ph-2',
          german: 'Die Rechnung, bitte. / Ich möchte bitte zahlen.',
          turkish: 'Hesap lütfen. / Ödemek istiyorum lütfen.',
          categoryTr: 'Hesap',
        },
        {
          id: 'rp-cafe-ph-3',
          german: 'Es war sehr lecker, vielen Dank!',
          turkish: 'Çok lezzetliydi, çok teşekkürler!',
          categoryTr: 'Teşekkür',
        },
      ],
      selfCheckCriteria: [
        {
          id: 'rp-c-c1',
          labelTr: 'Garson Lukas’ın 3 repliğine sırayla yüksek sesle Almanca yanıt verdim.',
        },
        {
          id: 'rp-c-c2',
          labelTr: 'İçecek, yiyecek ve hesap isteme adımlarını kibar kalıplarla tamamladım.',
        },
        {
          id: 'rp-c-c3',
          labelTr: 'Örnek yanıtları dinleyip eksik veya tereddüt ettiğim cümleyi tekrar ettim.',
        },
      ],
    },
  },
  {
    id: 'sprechen-wohnung',
    titleDe: 'Wohnung & Nachbarschaft',
    titleTr: 'Ev ve Komşuluk',
    contextLabelTr: 'Günlük Yaşam · Ev & Komşu İletişimi',
    subtitleTr: 'Evini kısaca tarif etme, komşuyla selamlaşma ve paket/ev bilgisi paylaşma.',
    estimatedMinutes: 6,
    imageUrl: sprechenWohnungImg,
    imageAlt: 'Aydınlık apartman koridorunda elinde kargo paketiyle güler yüzle konuşan iki komşu',
    repeatItems: [
      {
        id: 'sprechen-wohnung-rep-1',
        titleTr: 'Cümle 1 · Evin odalarını anlatma',
        textDe: 'Meine Wohnung ist im zweiten Stock. Sie ist hell und hat zwei Zimmer und einen Balkon.',
        textTr: 'Dairem ikinci katta. Aydınlık, iki odası ve bir balkonu var.',
        pronunciationFocusDe: 'W [v] (Wohnung) · St [şt] (Stock) · Z [ts] (zwei, Zimmer)',
        pronunciationTipTr:
          '“Wohnung” kelimesinde “w” harfini “v” gibi, “Stock” başında “st” birleşimini “şt”, “Zimmer” başında “z” harfini “ts” gibi söyleyin.',
        speakerGender: 'female',
        selfCheckCriteria: [
          {
            id: 'rep-w1-1',
            labelTr: 'Model cümleyi dinleyip yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-w1-2',
            labelTr: '“Wohnung”, “Stock” ve “Zimmer” sözcüklerini doğru sesle okudum.',
          },
          {
            id: 'rep-w1-3',
            labelTr: 'İki cümleyi doğal duraklamayla anlaşılır biçimde söyledim.',
          },
        ],
      },
      {
        id: 'sprechen-wohnung-rep-2',
        titleTr: 'Cümle 2 · Komşudan kibar rica',
        textDe: 'Entschuldigung, könnten Sie heute Nachmittag kurz ein Paket für mich annehmen?',
        textTr: 'Affedersiniz, bugün öğleden sonra benim için kısaca bir kargo teslim alabilir misiniz?',
        pronunciationFocusDe: 'ö (könnten) · ch [h] (Nachmittag) · ie [uzun i] (Sie)',
        pronunciationTipTr:
          '“Nachmittag” sözcüğünde “a” sesinden sonra gelen “ch” biraz daha kalın/sert söylenir; “könnten Sie” ifadesini yumuşak bir soru tonuyla okuyun.',
        speakerGender: 'male',
        selfCheckCriteria: [
          {
            id: 'rep-w2-1',
            labelTr: 'Model soruyu dinleyip kibar soru tonlamasıyla tekrar ettim.',
          },
          {
            id: 'rep-w2-2',
            labelTr: '“könnten Sie” ve “Nachmittag” ifadelerini anlaşılır söyledim.',
          },
          {
            id: 'rep-w2-3',
            labelTr: 'Ayrılabilir/mastar fiil sonu (“annehmen”) vurgusunu doğru yerleştirdim.',
          },
        ],
      },
    ],
    promptItems: [
      {
        id: 'sprechen-wohnung-prm-1',
        titleTr: 'Soru 1 · Evini tanıtma',
        questionDe: 'Wie ist Ihre Wohnung oder Ihr Haus? Was gefällt Ihnen dort am besten?',
        questionTr: 'Daireniz veya eviniz nasıl? Orada en çok ne hoşunuza gidiyor?',
        cuesDe: ['Größe / Zimmerzahl', 'Hell, ruhig oder zentral', 'Lieblingsplatz (Balkon, Küche …)'],
        cuesTr: ['Büyüklük / oda sayısı', 'Aydınlık, sakin veya merkezi', 'En sevilen yer (balkon, mutfak …)'],
        speakerGender: 'female',
        phrases: [
          {
            id: 'wohnung-p1-1',
            german: 'Meine Wohnung hat … Zimmer, eine Küche und ein Bad.',
            turkish: 'Dairemde … oda, bir mutfak ve bir banyo var.',
            categoryTr: 'Odalar',
          },
          {
            id: 'wohnung-p1-2',
            german: 'Die Wohnung ist ruhig und sehr hell.',
            turkish: 'Daire sakin ve çok aydınlık.',
            categoryTr: 'Özellik',
          },
          {
            id: 'wohnung-p1-3',
            german: 'Am besten gefällt mir der Balkon.',
            turkish: 'En çok balkon hoşuma gidiyor.',
            categoryTr: 'Favori',
          },
        ],
        modelAnswerDe:
          'Meine Wohnung hat drei Zimmer, eine kleine Küche und ein Bad. Sie ist ruhig und hell. Am besten gefällt mir der Balkon, dort trinke ich morgens Tee.',
        modelAnswerTr:
          'Dairem üç oda, küçük bir mutfak ve bir banyodan oluşuyor. Sakin ve aydınlık. En çok balkon hoşuma gidiyor, sabahları orada çay içiyorum.',
        selfCheckCriteria: [
          {
            id: 'prm-w1-1',
            labelTr: 'Evimin oda sayısını veya bölümlerini Almanca söyledim.',
          },
          {
            id: 'prm-w1-2',
            labelTr: 'En az bir sıfat (“groß, klein, hell, ruhig”) kullandım.',
          },
          {
            id: 'prm-w1-3',
            labelTr: 'En sevdiğim bölümü belirtip model yanıtla karşılaştırdım.',
          },
        ],
      },
      {
        id: 'sprechen-wohnung-prm-2',
        titleTr: 'Soru 2 · Mahallede neler var?',
        questionDe: 'Was gibt es in Ihrer Nachbarschaft? Gibt es eine Bäckerei oder eine Haltestelle?',
        questionTr: 'Mahallenizde neler var? Fırın veya durak var mı?',
        cuesDe: ['Es gibt …', 'Supermarkt / Bäckerei / Park', 'Entfernung (in der Nähe / 5 Minuten)'],
        cuesTr: ['“Es gibt …” kalıbı', 'Süpermarket / fırın / park', 'Mesafe (yakında / 5 dakika)'],
        speakerGender: 'male',
        phrases: [
          {
            id: 'wohnung-p2-1',
            german: 'In meiner Nähe gibt es einen Supermarkt und eine Bäckerei.',
            turkish: 'Yakınımda bir süpermarket ve bir fırın var.',
            categoryTr: 'Yerler',
          },
          {
            id: 'wohnung-p2-2',
            german: 'Die Bushaltestelle ist nur fünf Minuten zu Fuß.',
            turkish: 'Otobüs durağı yürüyerek yalnızca beş dakika.',
            categoryTr: 'Ulaşım',
          },
          {
            id: 'wohnung-p2-3',
            german: 'Gegenüber gibt es einen kleinen Park.',
            turkish: 'Karşıda küçük bir park var.',
            categoryTr: 'Konum',
          },
        ],
        modelAnswerDe:
          'In meiner Nachbarschaft gibt es eine Bäckerei, eine Apotheke und einen Supermarkt. Die Bushaltestelle ist sehr nah, nur drei Minuten zu Fuß.',
        modelAnswerTr:
          'Mahallemde bir fırın, bir eczane ve bir süpermarket var. Otobüs durağı çok yakın, yürüyerek sadece üç dakika.',
        selfCheckCriteria: [
          {
            id: 'prm-w2-1',
            labelTr: '“Es gibt …” kalıbıyla mahallemdeki en az iki yeri söyledim.',
          },
          {
            id: 'prm-w2-2',
            labelTr: 'Uzaklık veya konum bilgisi (“in der Nähe / zu Fuß”) ekledim.',
          },
          {
            id: 'prm-w2-3',
            labelTr: 'Örnek yanıtı dinleyip artikellere (“einen / eine”) dikkat ederek tekrar ettim.',
          },
        ],
      },
    ],
    roleplay: {
      id: 'sprechen-wohnung-roleplay',
      titleDe: 'Gespräch mit der Nachbarin',
      titleTr: 'Komşuyla Koridorda Konuşma',
      situationDe:
        'Sie sind neu in das Haus eingezogen und treffen Ihre Nachbarin Frau Weber im Treppenhaus. Sie hat ein Paket für Sie angenommen.',
      situationTr:
        'Binaya yeni taşındınız ve merdiven boşluğunda komşunuz Bayan Weber ile karşılaşıyorsunuz. Sizin için bir kargo teslim almış.',
      partnerName: 'Frau Weber',
      partnerRoleTr: 'Komşu (Resmi — Sie)',
      partnerGender: 'female',
      turns: [
        {
          id: 'rp-wohnung-t1',
          turnNumber: 1,
          partnerLineDe: 'Guten Abend! Sind Sie der neue Nachbar oder die neue Nachbarin aus dem dritten Stock?',
          partnerLineTr: 'İyi akşamlar! Üçüncü kattaki yeni komşu siz misiniz?',
          learnerCueDe: 'Begrüße Frau Weber höflich (Sie), bestätige und stelle dich vor.',
          learnerCueTr: 'Bayan Weber’i resmi (“Sie”) olarak selamla, onayla ve kendini tanıt.',
          modelResponseDe:
            'Guten Abend! Ja, genau. Ich wohne seit Montag im dritten Stock. Ich heiße Emre.',
          modelResponseTr:
            'İyi akşamlar! Evet, tam olarak öyle. Pazartesiden beri üçüncü katta oturuyorum. Adım Emre.',
        },
        {
          id: 'rp-wohnung-t2',
          turnNumber: 2,
          partnerLineDe: 'Herzlich willkommen im Haus! Ich habe heute ein Paket für Sie angenommen.',
          partnerLineTr: 'Binaya hoş geldiniz! Bugün sizin için bir paket teslim aldım.',
          learnerCueDe: 'Bedanke dich freundlich und frage, wann du es abholen kannst.',
          learnerCueTr: 'İçtenlikle teşekkür et ve paketi ne zaman alabileceğini sor.',
          modelResponseDe:
            'Oh, vielen Dank, Frau Weber! Das ist sehr nett von Ihnen. Kann ich das Paket jetzt abholen?',
          modelResponseTr:
            'Ah, çok teşekkür ederim Bayan Weber! Çok naziksiniz. Paketi şimdi alabilir miyim?',
        },
        {
          id: 'rp-wohnung-t3',
          turnNumber: 3,
          partnerLineDe: 'Natürlich, kommen Sie einfach kurz mit. Brauchen Sie noch Tipps für die Nachbarschaft?',
          partnerLineTr: 'Elbette, kısaca benimle gelin. Mahalle için başka tavsiyeye ihtiyacınız var mı?',
          learnerCueDe: 'Frage nach einer Bäckerei oder einem Supermarkt in der Nähe und verabschiede dich.',
          learnerCueTr: 'Yakında bir fırın veya süpermarket olup olmadığını sor ve iyi akşamlar dile.',
          modelResponseDe:
            'Ja gern! Wo gibt es hier in der Nähe eine gute Bäckerei? Vielen Dank und schönen Abend!',
          modelResponseTr:
            'Evet memnuniyetle! Buralarda yakında iyi bir fırın nerede var? Çok teşekkürler, iyi akşamlar!',
        },
      ],
      phrases: [
        {
          id: 'rp-wohnung-ph-1',
          german: 'Guten Abend, Frau Weber! Ich wohne seit … hier.',
          turkish: 'İyi akşamlar Bayan Weber! … tarihinden beri burada oturuyorum.',
          categoryTr: 'Resmi Selamlama',
        },
        {
          id: 'rp-wohnung-ph-2',
          german: 'Vielen Dank, das ist sehr freundlich von Ihnen!',
          turkish: 'Çok teşekkür ederim, çok naziksiniz!',
          categoryTr: 'Teşekkür',
        },
        {
          id: 'rp-wohnung-ph-3',
          german: 'Wo gibt es hier in der Nähe …?',
          turkish: 'Buralarda yakında … nerede var?',
          categoryTr: 'Yer Sorma',
        },
      ],
      selfCheckCriteria: [
        {
          id: 'rp-w-c1',
          labelTr: 'Bayan Weber’le konuşurken resmi “Sie” hitabını korudum.',
        },
        {
          id: 'rp-w-c2',
          labelTr: 'Kendimi tanıtma, paket için teşekkür etme ve mahallede yer sorma adımlarını yaptım.',
        },
        {
          id: 'rp-w-c3',
          labelTr: 'Üç turu da sesli söyleyip model yanıtlarla karşılaştırdım.',
        },
      ],
    },
  },
  {
    id: 'sprechen-reisen',
    titleDe: 'Freizeit & Reisen',
    titleTr: 'Boş Zaman ve Seyahat',
    contextLabelTr: 'İstasyon & Hafta Sonu · Bilet ve Plan',
    subtitleTr: 'Hafta sonu planını anlatma, tren istasyonunda bilet ve peron bilgisi sorma.',
    estimatedMinutes: 6,
    imageUrl: sprechenReisenImg,
    imageAlt: 'Tren istasyonundaki danışma gişesinde bilet ve hareket saati bilgisi alan yolcu',
    repeatItems: [
      {
        id: 'sprechen-reisen-rep-1',
        titleTr: 'Cümle 1 · Tren bileti ve hareket saati',
        textDe: 'Einmal nach Köln, bitte. Wann fährt der nächste Zug und von welchem Gleis?',
        textTr: 'Köln’e tek yön bir bilet lütfen. Bir sonraki tren saat kaçta ve hangi perondan kalkıyor?',
        pronunciationFocusDe: 'ä [e] (fährt, nächste) · Z [ts] (Zug) · ei [ay] (Gleis)',
        pronunciationTipTr:
          '“fährt” kelimesindeki “h” okunmaz ama “ä” sesini uzatır; “Zug” başında “ts” ve “Gleis” içinde “ay” sesine dikkat edin.',
        speakerGender: 'male',
        selfCheckCriteria: [
          {
            id: 'rep-r1-1',
            labelTr: 'Model cümleyi dinleyip yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-r1-2',
            labelTr: '“fährt”, “nächste” ve “Gleis” sözcüklerini anlaşılır telaffuz ettim.',
          },
          {
            id: 'rep-r1-3',
            labelTr: 'İki soruyu doğal A1 soru tonlamasıyla bitirdim.',
          },
        ],
      },
      {
        id: 'sprechen-reisen-rep-2',
        titleTr: 'Cümle 2 · Hafta sonu ve boş zaman',
        textDe: 'Am Wochenende fahre ich gern mit dem Zug ans Meer oder treffe meine Freunde.',
        textTr: 'Hafta sonunda trenle denize gitmeyi ya da arkadaşlarımla buluşmayı severim.',
        pronunciationFocusDe: 'W [v] (Wochenende) · eu [oy] (Freunde) · ch (Wochen-)',
        pronunciationTipTr:
          '“Wochenende” sözcüğünü “Vohen-ende” şeklinde hafif bir ara ile, “Freunde” sözcüğünü “Froynde” biçiminde söyleyin.',
        speakerGender: 'female',
        selfCheckCriteria: [
          {
            id: 'rep-r2-1',
            labelTr: 'Model cümleyi dinleyip yüksek sesle tekrar ettim.',
          },
          {
            id: 'rep-r2-2',
            labelTr: '“Wochenende” ve “Freunde” telaffuzlarına özen gösterdim.',
          },
          {
            id: 'rep-r2-3',
            labelTr: '“Am Wochenende fahre ich …” devrik fiil sırasını (fiil 2. sırada) doğru söyledim.',
          },
        ],
      },
    ],
    promptItems: [
      {
        id: 'sprechen-reisen-prm-1',
        titleTr: 'Soru 1 · Boş zaman hobileri',
        questionDe: 'Was machen Sie gern in Ihrer Freizeit oder am Wochenende?',
        questionTr: 'Boş zamanınızda veya hafta sonunda neler yapmayı seversiniz?',
        cuesDe: ['Ein Hobby (Sport, Musik, Lesen …)', 'Mit wem? (allein / mit Freunden)', 'Wann? (am Samstag / am Abend)'],
        cuesTr: ['Bir hobi (spor, müzik, okuma …)', 'Kiminle? (yalnız / arkadaşlarla)', 'Ne zaman? (Cumartesi / akşam)'],
        speakerGender: 'female',
        phrases: [
          {
            id: 'reisen-p1-1',
            german: 'In meiner Freizeit lese ich gern / höre ich Musik.',
            turkish: 'Boş zamanımda kitap okumayı / müzik dinlemeyi severim.',
            categoryTr: 'Hobi',
          },
          {
            id: 'reisen-p1-2',
            german: 'Am Samstag treffe ich meine Freunde im Park.',
            turkish: 'Cumartesi günü arkadaşlarımla parkta buluşuyorum.',
            categoryTr: 'Hafta Sonu',
          },
          {
            id: 'reisen-p1-3',
            german: 'Am Sonntag mache ich gern einen Ausflug.',
            turkish: 'Pazar günü kısa bir gezi yapmayı severim.',
            categoryTr: 'Gezi',
          },
        ],
        modelAnswerDe:
          'In meiner Freizeit höre ich gern Musik und gehe spazieren. Am Samstag treffe ich meine Freunde und am Sonntag koche ich zu Hause.',
        modelAnswerTr:
          'Boş zamanımda müzik dinlemeyi ve yürüyüş yapmayı severim. Cumartesi arkadaşlarımla buluşuyorum, pazar günü de evde yemek yapıyorum.',
        selfCheckCriteria: [
          {
            id: 'prm-r1-1',
            labelTr: 'En az iki boş zaman etkinliğini “gern” kullanarak söyledim.',
          },
          {
            id: 'prm-r1-2',
            labelTr: 'Gün veya zaman ifadesi (“am Samstag / am Wochenende”) ekledim.',
          },
          {
            id: 'prm-r1-3',
            labelTr: 'Örnek yanıtı dinleyip cümle düzenimi kontrol ettim.',
          },
        ],
      },
      {
        id: 'sprechen-reisen-prm-2',
        titleTr: 'Soru 2 · Kısa bir seyahat planı',
        questionDe: 'Wohin möchten Sie reisen und wie fahren Sie dorthin?',
        questionTr: 'Nereye seyahat etmek istersiniz ve oraya neyle gidiyorsunuz?',
        cuesDe: ['Ziel (Stadt oder Land)', 'Verkehrsmittel (mit dem Zug / Bus / Flugzeug)', 'Dauer (zwei Tage / eine Woche)'],
        cuesTr: ['Hedef (şehir veya ülke)', 'Ulaşım aracı (tren / otobüs / uçak)', 'Süre (iki gün / bir hafta)'],
        speakerGender: 'male',
        phrases: [
          {
            id: 'reisen-p2-1',
            german: 'Ich möchte nach … reisen.',
            turkish: '…’e seyahat etmek istiyorum.',
            categoryTr: 'Hedef',
          },
          {
            id: 'reisen-p2-2',
            german: 'Ich fahre mit dem Zug / fliege mit dem Flugzeug.',
            turkish: 'Trenle gidiyorum / uçakla uçuyorum.',
            categoryTr: 'Ulaşım',
          },
          {
            id: 'reisen-p2-3',
            german: 'Ich bleibe dort drei Tage.',
            turkish: 'Orada üç gün kalıyorum.',
            categoryTr: 'Süre',
          },
        ],
        modelAnswerDe:
          'Ich möchte im Sommer nach Wien reisen. Ich fahre mit dem Zug und bleibe dort vier Tage. Ich möchte Museen besuchen und Kaffee trinken.',
        modelAnswerTr:
          'Yazın Viyana’ya seyahat etmek istiyorum. Trenle gidiyorum ve orada dört gün kalıyorum. Müzeleri gezmek ve kahve içmek istiyorum.',
        selfCheckCriteria: [
          {
            id: 'prm-r2-1',
            labelTr: 'Gitmek istediğim yeri (“nach …”) ve ulaşım aracını (“mit dem …”) söyledim.',
          },
          {
            id: 'prm-r2-2',
            labelTr: 'Kalış süresini veya orada yapmak istediğim bir şeyi ekledim.',
          },
          {
            id: 'prm-r2-3',
            labelTr: 'Cevabımı sesli söyleyip örnek yanıtla karşılaştırdım.',
          },
        ],
      },
    ],
    roleplay: {
      id: 'sprechen-reisen-roleplay',
      titleDe: 'Am Fahrkartenschalter im Bahnhof',
      titleTr: 'Tren İstasyonunda Bilet Gişesinde',
      situationDe:
        'Sie sind am Hauptbahnhof und möchten heute nach Hamburg fahren. Fragen Sie am Schalter nach einer Fahrkarte, der Abfahrtszeit und dem Gleis.',
      situationTr:
        'Ana tren istasyonundasınız ve bugün Hamburg’a gitmek istiyorsunuz. Gişede bilet, kalkış saati ve peron numarasını sorun.',
      partnerName: 'Herr Klein',
      partnerRoleTr: 'İstasyon Görevlisi',
      partnerGender: 'male',
      turns: [
        {
          id: 'rp-reisen-t1',
          turnNumber: 1,
          partnerLineDe: 'Guten Tag! Wohin möchten Sie heute fahren?',
          partnerLineTr: 'İyi günler! Bugün nereye gitmek istiyorsunuz?',
          learnerCueDe: 'Begrüße ihn und bitte um eine Fahrkarte nach Hamburg (einfach oder hin und zurück).',
          learnerCueTr: 'Selamla ve Hamburg’a (tek yön veya gidiş-dönüş) bir bilet iste.',
          modelResponseDe:
            'Guten Tag! Ich möchte eine Fahrkarte nach Hamburg, hin und zurück, bitte.',
          modelResponseTr:
            'İyi günler! Hamburg’a gidiş-dönüş bir bilet istiyorum lütfen.',
        },
        {
          id: 'rp-reisen-t2',
          turnNumber: 2,
          partnerLineDe: 'Gern. Das kostet 38 Euro. Der nächste ICE fährt um 14:15 Uhr ab.',
          partnerLineTr: 'Memnuniyetle. 38 Euro tutuyor. Bir sonraki ICE treni saat 14:15’te kalkıyor.',
          learnerCueDe: 'Frage nach dem Gleis und ob du umsteigen musst.',
          learnerCueTr: 'Hangi perondan kalktığını ve aktarma yapman gerekip gerekmediğini sor.',
          modelResponseDe:
            'Von welchem Gleis fährt der Zug ab? Und muss ich umsteigen?',
          modelResponseTr:
            'Tren hangi perondan kalkıyor? Ve aktarma yapmam gerekiyor mu?',
        },
        {
          id: 'rp-reisen-t3',
          turnNumber: 3,
          partnerLineDe: 'Der Zug fährt direkt von Gleis 7, Sie müssen nicht umsteigen. Gute Reise!',
          partnerLineTr: 'Tren 7. perondan direkt kalkıyor, aktarma yapmanız gerekmiyor. İyi yolculuklar!',
          learnerCueDe: 'Bedanke dich freundlich und verabschiede dich.',
          learnerCueTr: 'Nazikçe teşekkür et ve vedalaş.',
          modelResponseDe: 'Super, vielen Dank für die Hilfe! Auf Wiedersehen!',
          modelResponseTr: 'Harika, yardımınız için çok teşekkür ederim! Hoşça kalın!',
        },
      ],
      phrases: [
        {
          id: 'rp-reisen-ph-1',
          german: 'Eine Fahrkarte nach …, bitte. (einfach / hin und zurück)',
          turkish: '…’e bir bilet lütfen. (tek yön / gidiş-dönüş)',
          categoryTr: 'Bilet',
        },
        {
          id: 'rp-reisen-ph-2',
          german: 'Von welchem Gleis fährt der Zug ab?',
          turkish: 'Tren hangi perondan kalkıyor?',
          categoryTr: 'Peron',
        },
        {
          id: 'rp-reisen-ph-3',
          german: 'Muss ich umsteigen?',
          turkish: 'Aktarma yapmam gerekiyor mu?',
          categoryTr: 'Aktarma',
        },
      ],
      selfCheckCriteria: [
        {
          id: 'rp-r-c1',
          labelTr: 'Gişe görevlisinin 3 repliğini dinleyip sırayla sesli yanıt verdim.',
        },
        {
          id: 'rp-r-c2',
          labelTr: 'Bilet talebi, peron sorusu ve aktarma sorusunu anlaşılır biçimde kurdum.',
        },
        {
          id: 'rp-r-c3',
          labelTr: 'Örnek yanıtları dinleyip en az bir cümleyi telaffuz için tekrar ettim.',
        },
      ],
    },
  },
];

export function getSpeakingScenarioExerciseIds(scenario: SpeakingScenario): string[] {
  return [
    ...scenario.repeatItems.map((item) => item.id),
    ...scenario.promptItems.map((item) => item.id),
    scenario.roleplay.id,
  ];
}

export const TOTAL_SPEAKING_TASKS: number = GERMAN_A1_SPEAKING_SCENARIOS.reduce(
  (sum, scenario) => sum + getSpeakingScenarioExerciseIds(scenario).length,
  0
);

export function getSpeakingScenarioById(id?: string): SpeakingScenario {
  return (
    GERMAN_A1_SPEAKING_SCENARIOS.find((s) => s.id === id) ?? GERMAN_A1_SPEAKING_SCENARIOS[0]
  );
}
