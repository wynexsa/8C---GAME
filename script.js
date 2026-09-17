const KARAKTER_TIPLERI = {
    "1": { ad: "Arka Sıra Filozofu", stres: 30, basari: 30 },
    "2": { ad: "Sınav Canavarı", stres: 80, basari: 90 },
    "3": { ad: "Orta Yolcu Öğrenci", stres: 50, basari: 50 }
};

const KRIZLER = [
    {
        baslik: "KAĞIT UÇAK SAVAŞI",
        metin: "Hoca sınıfta yokken arka sırada en yakın arkadaşınla birbirinize kağıt uçağı fırlatıyorsunuz. Tam o sırada kapı gürültüyle açıldı ve sert müdür yardımcısı içeri girdi! Ne yapacaksın?",
        secenekler: [
            ["Hiçbir şey olmamış gibi defteri açıp matematik çalışmaya başla", 0, 20, 15],
            ["Arkadaşını işaret edip 'Hocam o attı, ben uyuyordum!' de", 0, 10, -5],
            ["Sıranın altına saklanıp camdan dışarı bak", -10, 25, -10]
        ]
    },
    {
        baslik: "MATEMATİK SÖZLÜSÜ KABUSU",
        metin: "Matematik hocası tahtaya kalktı ve 'Bugün herkes sözlüye kalkacak, defterleri kapatın!' dedi. Hiçbir şey bilmiyorsun. Ne yapıyorsun?",
        secenekler: [
            ["Karnım ağrıyor deyip hemen rehberliğe kaçmak için izin iste", -5, 15, -10],
            ["Hocaya dik dik bakıp kara borsa kopya kağıdını çıkar", -10, 30, 25],
            ["Allah'a emanet tahtaya çıkıp hocanın gözünün içine bakarak saçmala", -5, 20, -20]
        ]
    },
    {
        baslik: "KANTİN SIRA KAVGASI",
        metin: "Teneffüste tost sırasının en önüne küçük sınıflardan biri kaynamaya çalıştı. Arkadaşların arkadan 'Yakalayın!' diye bağırdı.",
        secenekler: [
            ["Çocuğun omzuna vurup 'Hayırdır kanka sıra var burada' diyerek kavgaya tutuş", -10, 25, 10],
            ["Görmezden gelip en arkada sessizce beklemeye devam et", 0, 5, -5],
            ["Sosyal medya için olay anını videoya çekip '8-C dramaları' diye gruba at", 0, -10, 15]
        ]
    },
    {
        baslik: "BEDEN EĞİTİMİNDE PARKUR ÇİLESİ",
        metin: "Beden Eğitimi dersinde hocanın yaptırdığı zorlu parkurda ayağın takıldı, bütün sınıf sana gülüyor!",
        secenekler: [
            ["Hiç bozuntuya vermeyip 'Stil olsun diye yaptım' çek", 0, 10, 10],
            ["Yerden kalkıp utancından tuvalete kaç", -5, 25, -15],
            ["Hocaya bakıp sakatlık numarası yaparak faaliyeti kaytarmaya çalış", -5, 15, -5]
        ]
    },
    {
        baslik: "FEN LABORATUVARI KAZASI",
        metin: "Fen Bilimleri dersinde deney tüpünü karıştırırken yanlışlıkla mor bir sıvı taşırdı ve ortalık duman altı oldu!",
        secenekler: [
            ["Hızlıca camı açıp 'Hocam ben yapmadım tüp kendi patladı!' diye suç at", -5, 20, -10],
            ["Hocanın sert bakışları altında sessizce köşeye büzüş", -10, 30, -15],
            ["Bilim insanı havası takınıp 'Kontrollü bir reaksiyondu hocam' de", -5, 15, 15]
        ]
    },
    {
        baslik: "TÜRKÇE KOMPOZİSYON SUNUMU",
        metin: "Türkçe dersinde, yazdığın anlamsız kompozisyonu sesli okuman istendi. Sınıf gülmekten kırılmak üzere.",
        secenekler: [
            ["Cesaretini toplayıp tiyatrocu gibi coşkuyla oku", 0, 10, 20],
            ["Küp kırmızı olup kağıdı yırtmak iste", -5, 25, -10],
            ["Ağlamaklı sesle 'Hocam sesim kısılmış okuyamam' de", -5, 15, -5]
        ]
    },
    {
        baslik: "İNKILAP TARİHİ SORUSU",
        metin: "İnkılap Tarihi dersinde hoca kalkıp en zor ve uzun antlaşma maddesini sordu. Sınıfta mutlak bir sessizlik var.",
        secenekler: [
            ["Sallama taktiğiyle tarihteki olayları birbirine karıştırarak cevap ver", -5, 20, -10],
            ["Parmak kaldırıp cesurca bildiğin kadarını anlat", 0, 10, 25],
            ["Kitabın arkasına saklanıp hocanın seni görmemesini dile", -5, 15, -15]
        ]
    },
    {
        baslik: "İNGİLİZCE DİYALOG KRİZİ",
        metin: "İngilizce dersinde hocan seni tahtaya kaldırıp akıcı İngilizce diyalog kurmanı istedi. Dilin damağın kurudu.",
        secenekler: [
            ["'Hello teacher, how are you yes yes' diyerek konuyu kapatmaya çalış", -5, 15, 5],
            ["Tahtada taşa dönüp kelime bulamayarak kal", -10, 25, -20],
            ["Ezberlediğin tek cümle olan 'I don't know' ile durumu kurtar", -5, 10, -5]
        ]
    },
    {
        baslik: "GÖRSEL SANATLAR MALZEME KRİZİ",
        metin: "Görsel Sanatlar dersinde boya kalemlerini unuttuğun için yan masadan otlanmaya çalışıyorsun ama kimse vermek istemiyor.",
        secenekler: [
            ["Masadaki kalemi zorla alıp apar topar çizime başla", -5, 15, 5],
            ["Resim yapmaktan vazgeçip kağıda alakasız karalama yap", 0, 5, -10],
            ["Hocaya gidip 'Arkadaşım kalem vermiyor' diye şikayet et", -5, 10, 0]
        ]
    },
    {
        baslik: "MÜZİK DERSİNDE NOTA ŞOKU",
        metin: "Müzik dersinde herkes flüt çalarken sen arkada telefonla oynamaya çalışıyorsun. Tam o sırada hoca arkadan yaklaştı.",
        secenekler: [
            ["Telefonu hızlıca kalemliğin altına sakla", -10, 30, -10],
            ["Hocaya yakalanıp telefonun alınması acısını göğüsle", -15, 30, -20],
            ["Hocaya gülümseyip 'Nota çalışıyorum hocam' de", -5, 15, 10]
        ]
    },
    {
        baslik: "DİN KÜLTÜRÜ ANİ SORU",
        metin: "Din Kültürü dersinde dalıp gitmişken hoca ani bir soru yöneltti: 'Evladım dinliyor musun beni, söyle bakalım?'",
        secenekler: [
            ["Hemen toparlanıp hocanın sorusuna mantıklı bir yorum yap", 0, 10, 20],
            ["Panikleyip 'Evet hocam haklısınız' diye alakasız bir cevap ver", -5, 15, -10],
            ["Yere düşen silgini arıyormuş gibi yap", -5, 10, -5]
        ]
    },
    {
        baslik: "TEKNOLOJİ VE TASARIM ATÖLYESİ",
        metin: "Teknoloji ve Tasarım atölyesinde cetvelle kesmen gereken tahtayı yanlışlıkla ortadan ikiye yamuk kestin.",
        secenekler: [
            ["Üzerini zımparayla kapatıp 'Modern sanat bu hocam' de", -5, 10, 10],
            ["Baştan yeni bir tahta almak için depoya koş", -10, 20, -5],
            ["Kırık parçaları birbirine yapıştırıp hocaya çaktırmamaya çalış", -10, 20, -15]
        ]
    },
    {
        baslik: "OKUL KORİDORUNDA KOŞU CEZASI",
        metin: "Zil çaldığı an koridorda koştururken okulun en sert disiplin hocalarından biriyle kafa kafaya çarpıştın.",
        secenekler: [
            ["Özür dileyip hızlıca kaçmaya devam et", -10, 20, -15],
            ["Hemen durup ceketini ilikle ve saygıyla başını öne eğ", -5, 10, 10],
            ["Yere düşüp masum bir öğrenci taklidi yap", -10, 15, -5]
        ]
    },
    {
        baslik: "KOPYA ÇEKERKEN YAKALANMA",
        metin: "Yazılı sınavda arkadaştan kağıt isterken hoca masanın başında bitti ve kağıdı ortak yakaladı!",
        secenekler: [
            ["Hemen 'Hocam ben kağıda bakmıyordum düşen silgimi alıyordum' de", -5, 20, -10],
            ["Boynunu büküp 'Bir daha yapmayacağım hocam' diyerek affedilmeyi bekle", -5, 15, 5],
            ["Kağıdı hızlıca buruşturup yutmaya çalış", -10, 25, -10]
        ]
    },
    {
        baslik: "SON ZİL ÇALIYOR",
        metin: "Yılın son dersinin son saniyeleri. Herkes kapıya doğru set çekmiş, zilin çökmesini bekliyor.",
        secenekler: [
            ["Zil çalar çalmaz dışarı fırlayıp koridorda zafer turu at", 0, -20, 30],
            ["Sakin bir şekilde çantanı toplayıp sınıftan çık", 0, -10, 15],
            ["Heyecandan merdivenlerden aşağı düşüp tatile git", -15, 15, -10]
        ]
    }
];

const BITTIGINDE_MESAJLAR = [
    "Tebrikler! Ne kadar kriz çıksa da en azından kazasız belasız seneyi tamamladın ve 8-C'den mezun oldun!",
    "Zorlu anlar yaşadın, bazen stres tavan yaptı ama sonunda zili çalmayı başardın!",
    "Ortaokul koridorlarının tozunu attırdın ve sonunda hak ettiğin tatile ulaştın!"
];

let gameState = {
    aktifKarakter: null,
    zorlukModu: "1",
    can: 100,
    stres: 50,
    basari: 50,
    krizler: [],
    currentIndex: 0,
    soruSayisi: 10
};

document.getElementById('char-select').addEventListener('change', function() {
    const customBox = document.getElementById('custom-char-box');
    if (this.value === '4') {
        customBox.classList.remove('hidden');
    } else {
        customBox.classList.add('hidden');
    }
});

function oyunuBaslat() {
    const charType = document.getElementById('char-select').value;
    const modeType = document.getElementById('mode-select').value;
    
    let karakter = {};
    if (charType === '4') {
        let isim = document.getElementById('custom-name').value.trim();
        let lakap = document.getElementById('custom-nickname').value.trim();
        if(!isim) isim = "Meçhul Öğrenci";
        if(!lakap) lakap = "8-C'li";
        karakter = { ad: `${isim} '${lakap}'`, stres: 50, basari: 50 };
    } else {
        karakter = { ...KARAKTER_TIPLERI[charType] };
    }

    gameState.aktifKarakter = karakter;
    gameState.zorlukModu = modeType;
    gameState.can = 100;
    gameState.stres = karakter.stres;
    gameState.basari = karakter.basari;
    gameState.currentIndex = 0;
    
    if (modeType === "2") {
        gameState.soruSayisi = 15;
        gameState.krizler = [...KRIZLER].sort(() => 0.5 - Math.random()).slice(0, 15);
    } else {
        gameState.soruSayisi = 10;
        gameState.krizler = [...KRIZLER].sort(() => 0.5 - Math.random()).slice(0, 10);
    }

    document.getElementById('screen-menu').classList.add('hidden');
    document.getElementById('screen-end').classList.add('hidden');
    document.getElementById('screen-game').classList.remove('hidden');
    
    document.getElementById('char-info').innerText = `Karakter: ${karakter.ad} (${modeType === "2" ? "Zor Mod" : "Normal Mod"})`;
    
    soruyuGoster();
}

function soruyuGoster() {
    // Oyun burada sadece belirlenen soru sayısı bittiğinde biter, ölüm/game-over yoktur!
    if (gameState.currentIndex >= gameState.krizler.length) {
        oyunuBitir();
        return;
    }

    const kriz = gameState.krizler[gameState.currentIndex];
    document.getElementById('game-title').innerText = `Soru ${gameState.currentIndex + 1} / ${gameState.soruSayisi}`;
    document.getElementById('crisis-title').innerText = `🚨 ${kriz.baslik}`;
    document.getElementById('crisis-text').innerText = kriz.metin;
    
    document.getElementById('stat-can').innerText = gameState.can;
    document.getElementById('stat-stres').innerText = gameState.stres;
    document.getElementById('stat-basari').innerText = gameState.basari;

    const optionsBox = document.getElementById('options-box');
    optionsBox.innerHTML = '';
    
    document.getElementById('feedback-box').style.display = 'none';

    kriz.secenekler.forEach((secenek, idx) => {
        const btn = document.createElement('button');
        btn.innerText = `${idx + 1}. ${secenek[0]}`;
        btn.onclick = () => secimYap(idx);
        optionsBox.appendChild(btn);
    });
}

function secimYap(secimIdx) {
    const kriz = gameState.krizler[gameState.currentIndex];
    let [metin, canEtki, stresEtki, basariEtki] = kriz.secenekler[secimIdx];

    if (gameState.zorlukModu === "2") {
        canEtki *= 1.3;
        stresEtki *= 1.3;
    }

    gameState.can += canEtki;
    gameState.stres += stresEtki;
    gameState.basari += basariEtki;

    // Değerleri sınırla ama oyunu asla bitirme
    gameState.can = Math.max(10, Math.min(100, gameState.can));
    gameState.stres = Math.max(0, Math.min(100, gameState.stres));
    gameState.basari = Math.max(0, Math.min(100, gameState.basari));

    const buttons = document.querySelectorAll('#options-box button');
    buttons.forEach(b => b.disabled = true);

    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.style.display = 'block';
    
    if (basariEtki > 0 || (canEtki === 0 && stresEtki <= 10)) {
        feedbackBox.className = 'feedback success';
        feedbackBox.innerText = '✔ Harika hamle! Durumu başarıyla atlattın.';
    } else {
        feedbackBox.className = 'feedback warning';
        feedbackBox.innerText = '⚠ İşler biraz kararsa da yola devam ediyorsun!';
    }

    setTimeout(() => {
        gameState.currentIndex++;
        soruyuGoster();
    }, 2500);
}

function oyunuBitir() {
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById('screen-end').classList.remove('hidden');

    const endHeader = document.getElementById('end-header');
    const endText = document.getElementById('end-text');

    endHeader.style.color = '#00b37e';
    endHeader.innerText = '🎉 ZİL ÇALDI - YILI TAMAMLADIN!';
    
    let rastgeleMesaj = BITTIGINDE_MESAJLAR[Math.floor(Math.random() * BITTIGINDE_MESAJLAR.length)];
    endText.innerHTML = `${rastgeleMesaj}<br><br><b>Final Başarı Puanın:</b> ${gameState.basari} / 100<br><b>Final Stres Puanın:</b> ${gameState.stres} / 100`;
}

function anaMenuyeDon() {
    document.getElementById('screen-end').classList.add('hidden');
    document.getElementById('screen-menu').classList.remove('hidden');
}
