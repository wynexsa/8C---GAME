// --- OYUN DURUMU (GAME STATE) ---
let gameState = {
    para: 100,
    seviye: 1,
    xp: 0,
    can: 100,
    maxCan: 100,
    stres: 0,
    puan: 0,
    mevcutSoruIndex: 0,
    toplamSoruSayisi: 10,
    zorluk: 'normal',
    seciliKarakterId: 'normal',
    envanter: {
        kahve: 0,
        papatya: 0
    }
};

// --- KARAKTERLER VE MAĞAZA VERİLERİ ---
const karakterler = [
    { id: 'normal', isim: 'Normal Öğrenci', fiyat: 0, aciklama: 'Dengeli istatistikler.', satinAlindi: true },
    { id: 'inekk', isim: 'Çalışkan İnek', fiyat: 150, aciklama: 'Stres artışlarını %25 azaltır.', satinAlindi: false },
    { id: 'arkasira', isim: 'Arka Sıra Tayfası', fiyat: 200, aciklama: 'Stres düşüren etkiler %25 daha güçlü olur.', satinAlindi: false },
    { id: 'deli', isim: 'Sınıfın Delisi', fiyat: 300, aciklama: '+20 Ekstra Can ile başlar (120 Can).', satinAlindi: false }
];

const boostlar = [
    { id: 'kahve', isim: 'Enerji İçeceği', fiyat: 30, aciklama: 'Canı +%20 yeniler.' },
    { id: 'papatya', isim: 'Papatya Çayı', fiyat: 25, aciklama: 'Stresi -%20 azaltır.' }
];

// --- SENARYOLAR ---
const senaryolar = [
    {
        soru: "Matematik hocası ansızın sözlü yapmaya karar verdi ve gözlerini sınıfta gezdirmeye başladı!",
        secenekler: [
            { metin: "Göz temasından kaçın, silgini düşürmüş gibi yap.", can: 0, stres: 10, puan: 15, sonuc: "🙈 Hoca seni fark etmedi ve yan sıradaki arkadaşını kaldırdı! Kıl payı kurtuldun." },
            { metin: "Kendinden emin bir şekilde hocanın gözlerinin içine bak.", can: -15, stres: 20, puan: 30, sonuc: "👨‍🏫 Hoca özgüvenine hayran kaldı ama seni tahtaya kaldırdı! Soruda biraz bocaladın." },
            { metin: "Arka sıradaki arkadaşının arkasına saklan.", can: -5, stres: 5, puan: 5, sonuc: "😅 Saklandığını gören hoca hafifçe gülümsedi ama pas geçti." }
        ]
    },
    {
        soru: "Kantin sırasında biri önüne geçti ve 'Arkadaşıma sıra tutuyordum' dedi.",
        secenekler: [
            { metin: "Sertçe uyar ve sıranın arkasına geçmesini söyle.", can: -10, stres: 15, puan: 20, sonuc: "🗣️ Sözlü tartışma çıktı! Hakkını savundun ama boş yere gerildin." },
            { metin: "Görmezden gel, sabırla bekle.", can: 0, stres: 10, puan: 5, sonuc: "🍞 İçine attın ama tostunu alabildin." },
            { metin: "Kantinciye şikayet et.", can: 0, stres: -5, puan: 15, sonuc: "🤝 Kantinci adil davrandı ve kaynak yapanı sıranın en arkasına yolladı." }
        ]
    },
    {
        soru: "Beden eğitimi dersinde iki kaptan takım kuruyor ve seni sona bıraktılar.",
        secenekler: [
            { metin: "Hırslan, maçta tüm gücünü gösterip kendini kanıtla.", can: -15, stres: -10, puan: 35, sonuc: "⚽ İnanılmaz bir performans sergiledin ve 2 gol attın!" },
            { metin: "Yedek kulübesinde oturup telefonla oyna.", can: 5, stres: 0, puan: 5, sonuc: "📱 Dinlendin ve enerjini topladın." },
            { metin: "Kaleye geçmeyi teklif et.", can: -5, stres: 5, puan: 20, sonuc: "🧤 Özveri gösterdin, birkaç zorlu şutu çıkardın." }
        ]
    },
    {
        soru: "Nöbetçi öğretmen koridorda koştuğunu gördü ve seni durdurdu!",
        secenekler: [
            { metin: "Aptala yat: 'Hocam tuvalete yetişmeye çalışıyordum!'", can: 0, stres: 10, puan: 10, sonuc: "🚽 Öğretmen haline acıdı ve 'Bir daha koşma' diyerek bıraktı." },
            { metin: "Özür dile ve hemen yavaşça yürümeye başla.", can: 0, stres: -5, puan: 15, sonuc: "👨‍🏫 Olgun davranışın öğretmenin hoşuna gitti." },
            { metin: "Arkanı dönüp kaçmaya çalış.", can: -25, stres: 30, puan: 0, sonuc: "🚨 Yakalandın! Müdür yardımcısına götürüldün." }
        ]
    },
    {
        soru: "Müzik dersinde blok flüt çalma sırası sana geldi ama evde hiç çalışmadın!",
        secenekler: [
            { metin: "Rastgele notalara basarak uydurma bir beste yap.", can: -10, stres: 15, puan: 10, sonuc: "🎶 Çıkardığın garip sesler yüzünden tüm sınıf kahkahalara boğuldu." },
            { metin: "Flütümü evde unuttum hocam de.", can: -5, stres: 5, puan: 5, sonuc: "📝 Hoca eksi yazdı ama rezil olmaktan kurtuldun." },
            { metin: "Öksürme krizine girmiş gibi yapıp izin iste.", can: 0, stres: 10, puan: 15, sonuc: "😷 Oyunculuk yeteneğin sayesinde lavaboya gitme izni aldın." }
        ]
    },
    {
        soru: "Sınıf başkanı gürültü yapanların adını tahtaya yazıyor. Senin adını da yazdı!",
        secenekler: [
            { metin: "Gidip adını tahtadan sil.", can: -15, stres: 20, puan: 10, sonuc: "✏️ Sınıf başkanıyla kavga ettin." },
            { metin: "Sessizce oturup hocaya durumu açıklayacağını söyle.", can: 0, stres: 5, puan: 20, sonuc: "🤝 Sakin kaldın. Hoca gelince durum anlaşıldı." },
            { metin: "Sınıf başkanına çikolata ısmarlama teklif et.", can: -5, stres: -5, puan: 15, sonuc: "🍫 Rüşvet işe yaradı! Adın tahtadan silindi." }
        ]
    },
    {
        soru: "Türkçe dersinde öğretmen serbest okuma saatinde kitap okumanızı söyledi.",
        secenekler: [
            { metin: "Gerçekten kitap oku.", can: 5, stres: -15, puan: 25, sonuc: "📚 Zihnin dinlendi, stresin azaldı." },
            { metin: "Kitabın arasına karikatür saklayıp oku.", can: 0, stres: 10, puan: 15, sonuc: "🎨 Eğlendin ama sürekli yakalanma korkusu yaşadın." },
            { metin: "Kitabı yüzüne siper edip uyu.", can: 10, stres: 5, puan: 0, sonuc: "😴 Güzel bir uyku çektin ama hoca seni uyandırdı!" }
        ]
    },
    {
        soru: "Okul çıkışında arkadaşlarından biri 'İnternet kafeye gidelim mi?' dedi.",
        secenekler: [
            { metin: "Kabul et, oyuna akın!", can: -10, stres: -25, puan: 30, sonuc: "🎮 Bütün stresi oyunda attınız!" },
            { metin: "Ödevlerim var diyerek eve git.", can: 10, stres: 5, puan: 20, sonuc: "🏠 Eve gidip ödevlerini hallettin." },
            { metin: "Kütüphaneye gidip beraber ders çalışmayı teklif et.", can: -5, stres: 10, puan: 35, sonuc: "✍️ Verimli bir çalışma oldu." }
        ]
    },
    {
        soru: "Fen Laboratuvarında öğretmen deney tüplerine dokunmayın dedi.",
        secenekler: [
            { metin: "Tüpleri gizlice karıştır.", can: -30, stres: 25, puan: 5, sonuc: "💥 Tüpten duman çıktı! Laboratuvar tahliye edildi!" },
            { metin: "Sadece uzaktan incele ve soru sor.", can: 0, stres: -5, puan: 25, sonuc: "🔬 Öğretmen ilgini sevdi ve ekstra puan verdi." },
            { metin: "Arkadaşını kışkırt: 'Kanka dokunsana bir şey olmaz.'", can: 0, stres: 15, puan: 0, sonuc: "😈 Arkadaşın dokundu ve azar yedi." }
        ]
    },
    {
        soru: "Son ders zili çaldı, hoca 'Cuma günkü sınavı öne alıyoruz!' dedi.",
        secenekler: [
            { metin: "Tüm sınıf adına itiraz et.", can: -10, stres: 15, puan: 30, sonuc: "📢 Sınıfın kahramanı oldun ama karar değişmedi." },
            { metin: "Sessizce kabul et ve eve gidip çalış.", can: -5, stres: 5, puan: 20, sonuc: "🧠 Gerçekçi davrandın." },
            { metin: "Derin bir 'Oofff' çek.", can: -5, stres: 10, puan: 5, sonuc: "😮‍💨 Hoca sana sert bir bakış attı." }
        ]
    }
];

// --- GÜVENLİ YARDIMCI FONKSİYONLAR (HATA ÖNLEYİCİ) ---
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}

function setDisplay(id, displayStyle) {
    const el = document.getElementById(id);
    if (el) el.style.display = displayStyle;
}

// --- SAYFA YÖNETİMİ ---
function sayfaDegis(targetScreenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const activeScreen = document.getElementById(targetScreenId);
    if (activeScreen) {
        activeScreen.classList.add('active');
    }
    updateUI();
}

function updateUI() {
    setText('menuPara', gameState.para);
    setText('shopPara', gameState.para);
    setText('menuSeviye', gameState.seviye);
    setText('menuXP', gameState.xp);

    const seciliKarakterObj = karakterler.find(k => k.id === gameState.seciliKarakterId);
    setText('oyuncuKarakterGosterge', seciliKarakterObj ? seciliKarakterObj.isim : 'Normal Öğrenci');

    setText('livesCount', `%${gameState.can}`);
    setText('stressCount', `%${gameState.stres}`);
    setText('scoreCount', gameState.puan);

    setText('btnKahveKullan', `⚡ Enerji İçeceği (${gameState.envanter.kahve})`);
    setText('btnPapatyaKullan', `🍵 Papatya Çayı (${gameState.envanter.papatya})`);
}

// --- OYUN AKIŞI ---
function oyunuBaslatTikla() {
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
        gameState.zorluk = modeSelect.value;
    }

    if (gameState.zorluk === 'kolay') gameState.toplamSoruSayisi = 5;
    else if (gameState.zorluk === 'normal') gameState.toplamSoruSayisi = 10;
    else if (gameState.zorluk === 'zor') gameState.toplamSoruSayisi = 20;

    // Karakter Özel Yetenekleri
    if (gameState.seciliKarakterId === 'deli') {
        gameState.maxCan = 120;
        gameState.can = 120;
    } else {
        gameState.maxCan = 100;
        gameState.can = 100;
    }

    gameState.stres = 0;
    gameState.puan = 0;
    gameState.mevcutSoruIndex = 0;

    sayfaDegis('quizScreen');
    soruYukle();
}

function soruYukle() {
    setDisplay('resultOutcomeBox', 'none');
    setDisplay('nextBtn', 'none');
    setDisplay('optionsList', 'block');

    const soruData = senaryolar[gameState.mevcutSoruIndex];
    setText('questionNum', `Senaryo ${gameState.mevcutSoruIndex + 1} / ${gameState.toplamSoruSayisi}`);
    setText('questionText', soruData.soru);

    const optionsList = document.getElementById('optionsList');
    if (optionsList) {
        optionsList.innerHTML = '';
        soruData.secenekler.forEach((secenek, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = secenek.metin;
            btn.onclick = () => secimYap(index);
            optionsList.appendChild(btn);
        });
    }
}

function secimYap(secenekIndex) {
    const mevcutSenaryo = senaryolar[gameState.mevcutSoruIndex];
    const secim = mevcutSenaryo.secenekler[secenekIndex];

    let netCan = secim.can;
    let netStres = secim.stres;

    // Karakter Pasif Etkileri
    if (netStres > 0 && gameState.seciliKarakterId === 'inekk') {
        netStres = Math.round(netStres * 0.75); // %25 daha az stres
    }
    if (netStres < 0 && gameState.seciliKarakterId === 'arkasira') {
        netStres = Math.round(netStres * 1.25); // %25 daha çok stres azalır
    }

    gameState.can += netCan;
    gameState.stres += netStres;
    gameState.puan += secim.puan;

    if (gameState.can > gameState.maxCan) gameState.can = gameState.maxCan;
    if (gameState.can < 0) gameState.can = 0;
    if (gameState.stres < 0) gameState.stres = 0;

    updateUI();

    setDisplay('optionsList', 'none');

    let sonucKutusu = document.getElementById('resultOutcomeBox');
    if (!sonucKutusu) {
        sonucKutusu = document.createElement('div');
        sonucKutusu.id = 'resultOutcomeBox';
        const parentElem = document.getElementById('quizScreen') || document.body;
        parentElem.appendChild(sonucKutusu);
    }

    let etkiOzeti = [];
    if (secim.puan !== 0) etkiOzeti.push(`${secim.puan > 0 ? '+' : ''}${secim.puan} Puan`);
    if (netCan !== 0) etkiOzeti.push(`${netCan > 0 ? '+' : ''}${netCan}% Can`);
    if (netStres !== 0) etkiOzeti.push(`${netStres > 0 ? '+' : ''}${netStres}% Stres`);

    sonucKutusu.innerHTML = `
        <div style="background: #334155; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 5px solid #3b82f6;">
            <p style="font-size: 1.05em; line-height: 1.4; margin-bottom: 10px; color: #f8fafc;">${secim.sonuc}</p>
            <small style="color: #cbd5e1; font-weight: bold;">Etkiler: ${etkiOzeti.join(' | ') || 'Etki Yok'}</small>
        </div>
    `;
    sonucKutusu.style.display = 'block';

    if (gameState.can <= 0) {
        oyunuBitir(false, "❤️ Canın bitti! Okul hayatının stresi seni pes ettirdi.");
        return;
    }
    if (gameState.zorluk === 'zor' && gameState.stres >= 100) {
        oyunuBitir(false, "🤯 Aşırı stresten bayıldın! Revire kaldırıldın.");
        return;
    }

    setDisplay('nextBtn', 'block');
}

function sonrakiSoruTikla() {
    gameState.mevcutSoruIndex++;

    if (gameState.mevcutSoruIndex >= gameState.toplamSoruSayisi || gameState.mevcutSoruIndex >= senaryolar.length) {
        oyunuBitir(true, "🎉 Tebrikler! Tüm senaryoları başarıyla tamamladın.");
    } else {
        soruYukle();
    }
}

function oyunuBitir(kazandi, mesaj) {
    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');

    if (kazandi) {
        if (endTitle) {
            endTitle.innerText = "🏆 Başarılı!";
            endTitle.style.color = "#22c55e";
        }

        const kazanilanXP = gameState.puan * 2;
        const kazanilanPara = Math.floor(gameState.puan / 2);

        gameState.xp += kazanilanXP;
        gameState.para += kazanilanPara;

        if (gameState.xp >= gameState.seviye * 100) {
            gameState.seviye++;
            mesaj += `<br><br>🌟 <b>SEVİYE ATLADIN! Yeni Seviye: ${gameState.seviye}</b>`;
        }

        if (endMessage) {
            endMessage.innerHTML = `${mesaj}<br><br><b>Kazanılan Ödüller:</b><br>🪙 +${kazanilanPara} Altın<br>🔥 +${kazanilanXP} XP`;
        }
    } else {
        if (endTitle) {
            endTitle.innerText = "💀 Oyun Bitti";
            endTitle.style.color = "#ef4444";
        }
        if (endMessage) endMessage.innerText = mesaj;
    }

    setText('finalScore', gameState.puan);
    sayfaDegis('gameOverScreen');
}

function anaMenuyeDon() {
    sayfaDegis('startScreen');
}

// --- MAĞAZA VE ENVANTER SİSTEMİ ---
function magazayiYukle() {
    const charList = document.getElementById('characterShopList');
    if (charList) {
        charList.innerHTML = '';
        karakterler.forEach(char => {
            const card = document.createElement('div');
            card.className = `shop-card ${gameState.seciliKarakterId === char.id ? 'aktif' : ''}`;

            let butonKodu = '';
            if (char.satinAlindi) {
                if (gameState.seciliKarakterId === char.id) {
                    butonKodu = `<button style="background: #22c55e; border:none; color:white; padding: 6px 12px; border-radius:6px; font-weight:bold;">Seçili</button>`;
                } else {
                    butonKodu = `<button onclick="karakterSec('${char.id}')" style="background: #3b82f6; border:none; color:white; padding: 6px 12px; border-radius:6px; cursor:pointer;">Seç</button>`;
                }
            } else {
                butonKodu = `<button onclick="karakterSatinal('${char.id}')" style="background: #eab308; border:none; color:black; padding: 6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Satın Al (🪙${char.fiyat})</button>`;
            }

            card.innerHTML = `
                <div>
                    <div style="font-weight:bold;">${char.isim}</div>
                    <small style="color: #94a3b8;">${char.aciklama}</small>
                </div>
                <div>${butonKodu}</div>
            `;
            charList.appendChild(card);
        });
    }

    const boostList = document.getElementById('boostShopList');
    if (boostList) {
        boostList.innerHTML = '';
        boostlar.forEach(b => {
            const card = document.createElement('div');
            card.className = 'shop-card';
            card.innerHTML = `
                <div>
                    <div style="font-weight:bold;">${b.isim}</div>
                    <small style="color: #94a3b8;">${b.aciklama}</small>
                </div>
                <div>
                    <button onclick="boostSatinal('${b.id}')" style="background: #eab308; border:none; color:black; padding: 6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Satın Al (🪙${b.fiyat})</button>
                </div>
            `;
            boostList.appendChild(card);
        });
    }
}

function karakterSatinal(id) {
    const char = karakterler.find(c => c.id === id);
    if (!char) return;

    if (gameState.para >= char.fiyat) {
        gameState.para -= char.fiyat;
        char.satinAlindi = true;
        karakterSec(char.id);
    } else {
        alert("❌ Yetersiz Altın!");
    }
    magazayiYukle();
    updateUI();
}

function karakterSec(id) {
    gameState.seciliKarakterId = id;
    magazayiYukle();
    updateUI();
}

function boostSatinal(id) {
    const boost = boostlar.find(b => b.id === id);
    if (!boost) return;

    if (gameState.para >= boost.fiyat) {
        gameState.para -= boost.fiyat;
        gameState.envanter[id]++;
    } else {
        alert("❌ Yetersiz Altın!");
    }
    magazayiYukle();
    updateUI();
}

function esyaKullan(id) {
    if (gameState.envanter[id] <= 0) {
        alert("⚠️ Bu eşyadan envanterinde kalmadı!");
        return;
    }

    if (id === 'kahve') {
        if (gameState.can >= gameState.maxCan) {
            alert(`Canın zaten tam (%${gameState.maxCan})!`);
            return;
        }
        gameState.can = Math.min(gameState.maxCan, gameState.can + 20);
        gameState.envanter.kahve--;
    } else if (id === 'papatya') {
        if (gameState.stres <= 0) {
            alert("Stresin zaten %0!");
            return;
        }
        let dusus = 20;
        if (gameState.seciliKarakterId === 'arkasira') dusus = 25; // Arka Sıra Tayfası bonusu
        gameState.stres = Math.max(0, gameState.stres - dusus);
        gameState.envanter.papatya--;
    }

    updateUI();
}

// --- SAYFA YÜKLENDİĞİNDE BAŞLAT ---
window.onload = function() {
    updateUI();
    magazayiYukle();
};
