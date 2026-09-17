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
            ["Sıranın altına saklanıp camdan dışarı bak", -30, 25, -10]
        ]
    },
    {
        baslik: "MATEMATİK SÖZLÜSÜ KABUSU",
        metin: "Matematik hocası tahtaya kalktı ve 'Bugün herkes sözlüye kalkacak, defterleri kapatın!' dedi. Hiçbir şey bilmiyorsun. Ne yapıyorsun?",
        secenekler: [
            ["Karnım ağrıyor deyip hemen rehberliğe kaçmak için izin iste", -10, 15, -10],
            ["Hocaya dik dik bakıp kara borsa kopya kağıdını çıkar", -20, 40, 25],
            ["Allah'a emanet tahtaya çıkıp hocanın gözünün içine bakarak saçmala", -15, 30, -20]
        ]
    },
    {
        baslik: "KANTİN SIRA KAVGASI",
        metin: "Teneffüste tost sırasının en önüne küçük sınıflardan biri kaynamaya çalıştı. Arkadaşların arkadan 'Yakalayın!' diye bağırdı.",
        secenekler: [
            ["Çocuğun omzuna vurup 'Hayırdır kanka sıra var burada' diyerek kavgaya tutuş", -25, 35, 10],
            ["Görmezden gelip en arkada sessizce beklemeye devam et", 0, 5, -5],
            ["Sosyal medya için olay anını videoya çekip '8-C dramaları' diye gruba at", 0, -10, 15]
        ]
    },
    {
        baslik: "BEDEN EĞİTİMİNDE PARKUR ÇİLESİ",
        metin: "Beden Eğitimi dersinde hocanın yaptırdığı zorlu parkurda ayağın takıldı, bütün sınıf sana gülüyor!",
        secenekler: [
            ["Hiç bozuntuya vermeyip 'Stil olsun diye yaptım' çek", 0, 10, 10],
            ["Yerden kalkıp utancından tuvalete kaç", -15, 35, -15],
            ["Hocaya bakıp sakatlık numarası yaparak faaliyeti kaytarmaya çalış", -10, 20, -5]
        ]
    },
    {
        baslik: "FEN LABORATUVARI KAZASI",
        metin: "Fen Bilimleri dersinde deney tüpünü karıştırırken yanlışlıkla mor bir sıvı taşırdı ve ortalık duman altı oldu!",
        secenekler: [
            ["Hızlıca camı açıp 'Hocam ben yapmadım tüp kendi patladı!' diye suç at", -10, 30, -10],
            ["Hocanın sert bakışları altında sessizce köşeye büzüş", -20, 40, -15],
            ["Bilim insanı havası takınıp 'Kontrollü bir reaksiyondu hocam' de", -5, 25, 15]
        ]
    },
    {
        baslik: "TÜRKÇE KOMPOZİSYON SUNUMU",
        metin: "Türkçe dersinde, yazdığın anlamsız kompozisyonu sesli okuman istendi. Sınıf gülmekten kırılmak üzere.",
        secenekler: [
            ["Cesaretini toplayıp tiyatrocu gibi coşkuyla oku", 0, 15, 20],
            ["Küp kırmızı olup kağıdı yırtmak iste", -10, 35, -10],
            ["Ağlamaklı sesle 'Hocam sesim kısılmış okuyamam' de", -5, 20, -5]
        ]
    },
    {
        baslik: "İNKILAP TARİHİ SORUSU",
        metin: "İnkılap Tarihi dersinde hoca kalkıp en zor ve uzun antlaşma maddesini sordu. Sınıfta mutlak bir sessizlik var.",
        secenekler: [
            ["Sallama taktiğiyle tarihteki olayları birbirine karıştırarak cevap ver", -15, 30, -10],
            ["Parmak kaldırıp cesurca bildiğin kadarını anlat", 0, 20, 25],
            ["Kitabın arkasına saklanıp hocanın seni görmemesini dile", -5, 25, -15]
        ]
    },
    {
        baslik: "İNGİLİZCE DİYALOG KRİZİ",
        metin: "İngilizce dersinde hocan seni tahtaya kaldırıp akıcı İngilizce diyalog kurmanı istedi. Dilin damağın kurudu.",
        secenekler: [
            ["'Hello teacher, how are you yes yes' diyerek konuyu kapatmaya çalış", -10, 25, 5],
            ["Tahtada taşa dönüp kelime bulamayarak kal", -20, 40, -20],
            ["Ezberlediğin tek cümle olan 'I don't know' ile durumu kurtar", -5, 15, -5]
        ]
    },
    {
        baslik: "GÖRSEL SANATLAR MALZEME KRİZİ",
        metin: "Görsel Sanatlar dersinde boya kalemlerini unuttuğun için yan masadan otlanmaya çalışıyorsun ama kimse vermek istemiyor.",
        secenekler: [
            ["Masadaki kalemi zorla alıp apar topar çizime başla", -10, 20, 5],
            ["Resim yapmaktan vazgeçip kağıda alakasız karalama yap", 0, 10, -10],
            ["Hocaya gidip 'Arkadaşım kalem vermiyor' diye şikayet et", -5, 15, 0]
        ]
    },
    {
        baslik: "MÜZİK DERSİNDE NOTA ŞOKU",
        metin: "Müzik dersinde herkes flüt çalarken sen arkada telefonla oynamaya çalışıyorsun. Tam o sırada hoca arkadan yaklaştı.",
        secenekler: [
            ["Telefonu hızlıca kalemliğin altına sakla", -15, 45, -10],
            ["Yakalanıp telefonun elinden alınma acısını yaşa", -30, 60, -35],
            ["Hocaya gülümseyip 'Nota çalışıyorum hocam' de", -5, 25, 10]
        ]
    },
    {
        baslik: "DİN KÜLTÜRÜ ANİ SORU",
        metin: "Din Kültürü dersinde dalıp gitmişken hoca ani bir soru yöneltti: 'Evladım dinliyor musun beni, söyle bakalım?'",
        secenekler: [
            ["Hemen toparlanıp hocanın sorusuna mantıklı bir yorum yap", 0, 15, 20],
            ["Panikleyip 'Evet hocam haklısınız' diye alakasız bir cevap ver", -10, 25, -10],
            ["Yere düşen silgini arıyormuş gibi yap", -5, 20, -5]
        ]
    },
    {
        baslik: "TEKNOLOJİ VE TASARIM ATÖLYESİ",
        metin: "Teknoloji ve Tasarım atölyesinde cetvelle kesmen gereken tahtayı yanlışlıkla ortadan ikiye yamuk kestin.",
        secenekler: [
            ["Üzerini zımparayla kapatıp 'Modern sanat bu hocam' de", -5, 20, 10],
            ["Baştan yeni bir tahta almak için depoya koş", -20, 30, -5],
            ["Kırık parçaları birbirine yapıştırıp hocaya çaktırmamaya çalış", -15, 35, -15]
        ]
    },
    {
        baslik: "OKUL KORİDORUNDA KOŞU CEZASI",
        metin: "Zil çaldığı an koridorda koştururken okulun en sert disiplin hocalarından biriyle kafa kafaya çarpıştın.",
        secenekler: [
            ["Özür dileyip hızlıca kaçmaya devam et", -20, 35, -15],
            ["Hemen durup ceketini ilikle ve saygıyla başını öne eğ", -5, 20, 10],
            ["Yere düşüp masum bir öğrenci taklidi yap", -15, 25, -5]
        ]
    },
    {
        baslik: "KOPYA ÇEKERKEN YAKALANMA",
        metin: "Yazılı sınavda arkadaştan kağıt isterken hoca masanın başında bitti ve kağıdı ortak yakaladı!",
        secenekler: [
            ["Hemen 'Hocam ben kağıda bakmıyordum düşen silgimi alıyordum' de", -10, 30, -10],
            ["Boynunu büküp 'Bir daha yapmayacağım hocam' diyerek affedilmeyi bekle", -5, 25, 5],
            ["Kağıdı hızlıca buruşturup yutmaya çalış", -25, 50, -20]
        ]
    },
    {
        baslik: "SON ZİL ÇALIYOR",
        metin: "Yılın son dersinin son saniyeleri. Herkes kapıya doğru set çekmiş, zilin çökmesini bekliyor.",
        secenekler: [
            ["Zil çalar çalmaz dışarı fırlayıp koridorda zafer turu at", 0, -30, 30],
            ["Sakin bir şekilde çantanı toplayıp sınıftan çık", 0, -10, 15],
            ["Heyecandan merdivenlerden aşağı düşüp tatile hastanede başla", -40, 20, -20]
        ]
    }
];

const BASARILI_SONLAR = [
    "Tebrikler! Ortaokulun krizlerini, zorlu sözlüleri ve tüm engelleri zeka ile atlattın!",
    "Müdür yardımcısının odasından hep teğet geçtin, 8-C sınıfının efsanesi olarak ortaokulu bitirdin!"
];

const BASARISIZ_SONLAR = [
    "Maalesef krizleri yönetemedin ve disiplin kurulunun kurbanı oldun. Artık bütün okul seni konuşuyor!",
    "Stres tavan yaptı, sicilin bozuldu ve hayatta kalma simülasyonu burada bitti!"
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
    if (gameState.currentIndex >= gameState.krizler.length || gameState.can <= 0 || gameState.stres >= 100) {
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
        canEtki *= 1.5;
        stresEtki *= 1.5;
    }

    gameState.can += canEtki;
    gameState.stres += stresEtki;
    gameState.basari += basariEtki;

    gameState.can = Math.max(0, Math.min(100, gameState.can));
    gameState.stres = Math.max(0, Math.min(100, gameState.stres));
    gameState.basari = Math.max(0, Math.min(100, gameState.basari));

    const buttons = document.querySelectorAll('#options-box button');
    buttons.forEach(b => b.disabled = true);

    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.style.display = 'block';
    if (basariEtki > 0 || (canEtki === 0 && stresEtki <= 0)) {
        feedbackBox.className = 'feedback success';
        feedbackBox.innerText = '✔ Harika hamle! Durumu başarıyla kurtardın.';
    } else if (stresEtki > 20 || canEtki < -10) {
        feedbackBox.className = 'feedback danger';
        feedbackBox.innerText = '✖ Eyvah! İşler sarpa sardı, stres tavan yaptı!';
    } else {
        feedbackBox.className = 'feedback warning';
        feedbackBox.innerText = '⚠ Eh işte, idare ettin ama dikkatli ol.';
    }

    setTimeout(() => {
        gameState.currentIndex++;
        soruyuGoster();
    }, 3000);
}

function oyunuBitir() {
    document.getElementById('screen-game').classList.add('hidden');
    document.getElementById('screen-end').classList.remove('hidden');

    const endHeader = document.getElementById('end-header');
    const endText = document.getElementById('end-text');

    if (gameState.can <= 0 || gameState.stres >= 100) {
        endHeader.style.color = '#f75a5a';
        endHeader.innerText = 'OYUN BİTTİ - DİSİPLİNLİK OLDUN!';
        endText.innerText = BASARISIZ_SONLAR[Math.floor(Math.random() * BASARISIZ_SONLAR.length)];
    } else if (gameState.basari < 40) {
        endHeader.style.color = '#fba94c';
        endHeader.innerText = 'KRİZLERİ TAMAMLADIN AMA SINIFI ZOR GEÇTİN!';
        endText.innerText = BASARISIZ_SONLAR[Math.floor(Math.random() * BASARISIZ_SONLAR.length)];
    } else {
        endHeader.style.color = '#00b37e';
        endHeader.innerText = 'TEBRİKLER! YILIN ÖĞRENCİSİ OLDUN!';
        endText.innerText = BASARILI_SONLAR[Math.floor(Math.random() * BASARILI_SONLAR.length)];
    }
}

function anaMenuyeDon() {
    document.getElementById('screen-end').classList.add('hidden');
    document.getElementById('screen-menu').classList.remove('hidden');
}