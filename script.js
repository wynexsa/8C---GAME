const SAVE_KEY = '8c_game_data_v1';

let playerProfile = {
    isim: "Sen (8-C)",
    toplamPara: 100,
    elmas: 10,
    xp: 0,
    seviye: 1,
    acilanKarakterler: ["1"],
    aktifKarakterId: "1",
    aktifBoostlar: {}
};

function veriYukle() {
    try {
        const kayit = localStorage.getItem(SAVE_KEY);
        if (kayit) {
            const parsed = JSON.parse(kayit);
            playerProfile = {
                ...playerProfile,
                ...parsed,
                toplamPara: typeof parsed.toplamPara === 'number' && !isNaN(parsed.toplamPara) ? parsed.toplamPara : 100,
                elmas: typeof parsed.elmas === 'number' && !isNaN(parsed.elmas) ? parsed.elmas : 10,
                xp: typeof parsed.xp === 'number' && !isNaN(parsed.xp) ? parsed.xp : 0,
                seviye: typeof parsed.seviye === 'number' && !isNaN(parsed.seviye) ? parsed.seviye : 1
            };
        }
    } catch (e) {
        console.error("Kayıt yüklenirken hata oluştu:", e);
    }
}

function kaydet() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(playerProfile));
    } catch (e) {
        console.error("Kayıt yapılırken hata oluştu:", e);
    }
}

let audioCtx = null;
function playBuySound() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880.00, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
    } catch (e) {}
}

const KARAKTER_TIPLERI = {
    "1": { ad: "Normal Öğrenci", fiyatAltin: 0, fiyatElmas: 0, ciftPara: false, maxCan: 100, aciklama: "Standart 100 Can ile başlar." },
    "2": { ad: "Sınav Canavarı", fiyatAltin: 150, fiyatElmas: 0, ciftPara: false, maxCan: 100, aciklama: "Ekstra Puan kazanır." },
    "3": { ad: "Arka Sıra Filozofu", fiyatAltin: 250, fiyatElmas: 0, ciftPara: false, maxCan: 110, aciklama: "+10 Can ve Ekstra Altın kazanır." },
    "4": { ad: "⚡ DELİ (Süper Güçlü OP)", fiyatAltin: 1000, fiyatElmas: 5, ciftPara: true, maxCan: 150, aciklama: "150 Can başlar, 2x Altın & Puan kazanır!" }
};

const BOOST_URUNLERI = {
    "boost_1s": { ad: "1 Saatlik Boost", sureMs: 3600000, fiyatAltin: 100, fiyatElmas: 0, aciklama: "1.5x Puan" },
    "boost_mega": { ad: "🚀 Mega XP Katlayıcı", sureMs: 7200000, fiyatAltin: 250, fiyatElmas: 0, aciklama: "2x XP Kazanımı" },
    "boost_elmas": { ad: "🛡️ Elmas Kalkanı", sureMs: 3600000, fiyatAltin: 0, fiyatElmas: 3, aciklama: "+20 Ekstra Can" },
    "boost_kantin": { ad: "🍔 Kantin Katlayıcı", sureMs: 3600000, fiyatAltin: 500, fiyatElmas: 0, aciklama: "2x Altın Kazanımı" }
};

function arrayShuffle(dizi) {
    let kopya = [...dizi];
    for (let i = kopya.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
    return kopya;
}

// --- 3 SEÇENEKLİ DERECE SİSTEMLİ SENARYOLAR ---
function soruBankasiOlustur() {
    return [
        {
            soru: "Derse 5 dakika geç kaldın ve hoca kapıda dikiliyor!",
            secenekler: [
                { metin: "'Hocam revirdeydim, sevk kağıdım burada' demek", derece: "tam" },
                { metin: "Sessizce arkadan içeri sızmaya çalışmak", derece: "orta" },
                { metin: "Kantine kaçıp tost yemek", derece: "yanlis" }
            ]
        },
        {
            soru: "Hoca listeden rastgele sözlüye adam kaldırıyor ve seninle göz göze geldi!",
            secenekler: [
                { metin: "Özgüvenle gözlerinin içine bakıp soruyu beklemek", derece: "tam" },
                { metin: "Kalemi düşürmüş gibi yapıp sıranın altına eğilmek", derece: "orta" },
                { metin: "Aniden ayağa kalkıp 'Tuvalete kaçmam lazım!' diye bağırmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Kantinde son kaşarlı tost kaldı ama önünde 8-A'dan biri var!",
            secenekler: [
                { metin: "'O tost dün geceden kaldı kanka' deyip aklını çelmek", derece: "tam" },
                { metin: "Efendi gibi sıranın kendisine gelmesini beklemek", derece: "orta" },
                { metin: "Tostu tezgahtan kapıp koridorda depar atmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Sınıf nöbetçisisin ve müdür koridorda sana doğru yürüyor!",
            secenekler: [
                { metin: "Eldeki evraklara ciddi ciddi bakarak hızlıca yanından geçmek", derece: "tam" },
                { metin: "Durup askeri selam vermek", derece: "orta" },
                { metin: "Korkudan tuvalete kaçıp kapıyı kitlemek", derece: "yanlis" }
            ]
        },
        {
            soru: "Derste gizlice cips paketi açman gerekiyor ama ses çıkacak!",
            secenekler: [
                { metin: "Arkadaşın öksürürken paketi tek hamlede açmak", derece: "tam" },
                { metin: "Paketi sıranın altında yavaşça gıdım gıdım yırtmak", derece: "orta" },
                { metin: "Paketi patlatarak açmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Hoca 'Bu soruyu çözene sözlüye 100 veriyorum' dedi!",
            secenekler: [
                { metin: "Mantıklı bir tahmin yapıp tahtaya kalkmak", derece: "tam" },
                { metin: "Yanındakini dürtüp tahtaya itmek", derece: "orta" },
                { metin: "'Hocam soru külliyen hatalı' diye bağırmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Beden dersinde eşofmanını evde unuttun!",
            secenekler: [
                { metin: "'Hocam bileğim burkuldu' deyip kenarda maçı izlemek", derece: "tam" },
                { metin: "Kot pantolonla sahaya çıkıp oynamak", derece: "orta" },
                { metin: "Soyunma odasına saklanıp ders sonuna kadar çıkmamak", derece: "yanlis" }
            ]
        },
        {
            soru: "Sınıfın akıllı tahtası dondu, hoca çaresizce bakıyor!",
            secenekler: [
                { metin: "Kibarca 'Hocam fişi çekip takalım mı?' demek", derece: "tam" },
                { metin: "Ekrana sertçe iki kere vurmak", derece: "orta" },
                { metin: "Tahtaya format atmaya çalışıp işletim sistemini silmek", derece: "yanlis" }
            ]
        },
        {
            soru: "Yazılıda arkadaki arkadaşın sürekli sırtına vurup cevap istiyor!",
            secenekler: [
                { metin: "Kağıdını çaktırmadan azıcık kenara kaydırmak", derece: "tam" },
                { metin: "El işaretleriyle yanlış cevabı göstermek", derece: "orta" },
                { metin: "Arkanı dönüp 'Cevap vermiyorum!' diye bağırmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Zil çaldı ve sınıf kapısının önü izdiham alanına döndü!",
            secenekler: [
                { metin: "Herkesin çıkmasını 1 dakika sakince beklemek", derece: "tam" },
                { metin: "Çantanı kalkan yapıp kalabalığın arasına girmek", derece: "orta" },
                { metin: "Pencereden atlamaya çalışmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Hoca ödev kontrolü yapıyor ve sen ödevi kesinlikle yapmadın!",
            secenekler: [
                { metin: "'Hocam masamdaydı, annem çantama koymayı unutmuş' demek", derece: "tam" },
                { metin: "Yanındakinin defterini hızlıca kopyalamaya çalışmak", derece: "orta" },
                { metin: "Hoca yaklaşınca numaradan bayılmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Yan sıradaki arkadaşın senin sıranın üzerine silgi tozu dağıttı!",
            secenekler: [
                { metin: "Üfleyip tozları yere düşürmek", derece: "tam" },
                { metin: "Tozları toplayıp onun sırasına geri atmak", derece: "orta" },
                { metin: "Onun sırasına çöp kovasını devirmek", derece: "yanlis" }
            ]
        },
        {
            soru: "Fen labında hoca 'Sakın bu tüpe dokunmayın' dedi!",
            secenekler: [
                { metin: "Ellerini arkana bağlayıp uzaktan izlemek", derece: "tam" },
                { metin: "Hoca bakmazken parmak ucuyla dokunmak", derece: "orta" },
                { metin: "Tüpü çalkalayıp küçük bir patlama patlatmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Koridorda koşarken yanlışlıkla müdür yardımcısına çarptın!",
            secenekler: [
                { metin: "'Hocam derse yetişiyordum, çok özür dilerim' demek", derece: "tam" },
                { metin: "Yere düşüp ayağım kırıldı numarası yapmak", derece: "orta" },
                { metin: "'Önüne baksana hoca' demek", derece: "yanlis" }
            ]
        },
        {
            soru: "Teneffüste sınıfta pet şişeyle futbol oynarken hoca içeri girdi!",
            secenekler: [
                { metin: "Şişeyi hemen ayağınla sıranın altına itmek", derece: "tam" },
                { metin: "'Hocam geri dönüşüm kutusuna atıyorduk' demek", derece: "orta" },
                { metin: "Şişeyi hocanın bacak arasından tünel atmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Çöp kovasına kağıttan basket atışı denedin ve kaçırdın!",
            secenekler: [
                { metin: "Hemen gidip kağıdı yerden alıp çöpe atmak", derece: "tam" },
                { metin: "'Rüzgar savurdu hocam' demek", derece: "orta" },
                { metin: "İkinci kağıdı çıkarıp tekrar denemek", derece: "yanlis" }
            ]
        },
        {
            soru: "Derste telefonunun zil sesi son ses çalmaya başladı!",
            secenekler: [
                { metin: "Anında sessize alıp çantaya atmak", derece: "tam" },
                { metin: "Yanındakine bakıp 'Kardeşim kapatsana şu telefonu' demek", derece: "orta" },
                { metin: "Telefonu açıp 'Dersteyim anne sonra ara' demek", derece: "yanlis" }
            ]
        },
        {
            soru: "Kantinde simit alacaksın ama 5 TL eksiğin var!",
            secenekler: [
                { metin: "Arkadaşından rica edip 5 TL borç almak", derece: "tam" },
                { metin: "Kantinciye 'Yarın vereyim abi' demek", derece: "orta" },
                { metin: "Tezgahtan simidi kapıp kaçmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Hoca 'Arka sıra yine çok konuşuyor!' diye bağırdı!",
            secenekler: [
                { metin: "Özür dileyip hemen derse odaklanmak", derece: "tam" },
                { metin: "'Hocam dersle ilgili konuşuyorduk' demek", derece: "orta" },
                { metin: "Ön sıradakileri gösterip suçu onlara atmak", derece: "yanlis" }
            ]
        },
        {
            soru: "Sınıf başkanı gürültü yapanların adını tahtaya yazıyor!",
            secenekler: [
                { metin: "Sessizce yerinde oturmak", derece: "tam" },
                { metin: "Başkana kantinden çikolata vaat etmek", derece: "orta" },
                { metin: "Gidip tahta silgisini çöpe atmak", derece: "yanlis" }
            ]
        }
    ];
}

function soruHazirla(q) {
    let karistirilmisSecenekler = arrayShuffle([...q.secenekler]);
    return {
        soru: q.soru,
        secenekler: karistirilmisSecenekler
    };
}

let gameState = {
    zorluk: "normal",
    can: 100,
    maxCan: 100,
    stres: 0,
    puan: 0,
    kazanilanAltin: 0,
    kazanilanElmas: 0,
    aktifSorular: [],
    currentIndex: 0,
    answered: false,
    toplamSoruSayisi: 10
};

window.onload = () => {
    veriYukle();
    lobiGuncelle();
};

function sayfaDegis(hedefId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const hedef = document.getElementById(hedefId);
    if (hedef) hedef.classList.add('active');
    if (hedefId === 'shopScreen') lobiGuncelle();
}

function lobiGuncelle() {
    document.getElementById('menuPara').innerText = playerProfile.toplamPara;
    document.getElementById('menuElmas').innerText = playerProfile.elmas;
    document.getElementById('menuSeviye').innerText = playerProfile.seviye;
    document.getElementById('menuXP').innerText = playerProfile.xp;
    document.getElementById('shopPara').innerText = playerProfile.toplamPara;
    document.getElementById('shopElmas').innerText = playerProfile.elmas;

    let aktifKarakterAdi = KARAKTER_TIPLERI[playerProfile.aktifKarakterId] ? KARAKTER_TIPLERI[playerProfile.aktifKarakterId].ad : "Normal Öğrenci";
    document.getElementById('oyuncuKarakterGosterge').innerText = aktifKarakterAdi;

    const charList = document.getElementById('characterShopList');
    if (charList) {
        charList.innerHTML = '';
        Object.keys(KARAKTER_TIPLERI).forEach(id => {
            let k = KARAKTER_TIPLERI[id];
            let acik = playerProfile.acilanKarakterler.includes(id);
            let secili = playerProfile.aktifKarakterId === id;

            let div = document.createElement('div');
            div.className = `shop-card ${secili ? 'aktif' : ''}`;
            
            let fiyatEtiketi = k.ciftPara ? `${k.fiyatAltin} 🪙 + ${k.fiyatElmas} 💎` : (k.fiyatAltin > 0 ? `${k.fiyatAltin} 🪙` : (k.fiyatElmas > 0 ? `${k.fiyatElmas} 💎` : "Ücretsiz"));
            let durumYazisi = secili ? "✅ Seçili" : (acik ? "Kullan" : fiyatEtiketi);
            
            div.innerHTML = `<div><b>${k.ad}</b><br><small style="color:#cbd5e1">${k.aciklama}</small></div><button class="main-btn" style="width:auto; padding:8px 15px; margin:0;" onclick="karakterSecVeyaAl('${id}')">${durumYazisi}</button>`;
            charList.appendChild(div);
        });
    }

    const boostList = document.getElementById('boostShopList');
    if (boostList) {
        boostList.innerHTML = '';
        Object.keys(BOOST_URUNLERI).forEach(key => {
            let b = BOOST_URUNLERI[key];
            let div = document.createElement('div');
            div.className = 'shop-card';
            let fiyatTxt = b.fiyatAltin > 0 ? `${b.fiyatAltin} 🪙` : `${b.fiyatElmas} 💎`;
            let tur = b.fiyatAltin > 0 ? 'altin' : 'elmas';
            div.innerHTML = `<div><b>${b.ad}</b><br><small style="color:#cbd5e1">${b.aciklama}</small></div><button class="main-btn" style="width:auto; padding:8px 12px; margin:0;" onclick="boostSatinAl('${key}', '${tur}')">${fiyatTxt}</button>`;
            boostList.appendChild(div);
        });
    }
}

function karakterSecVeyaAl(id) {
    let k = KARAKTER_TIPLERI[id];
    if (playerProfile.acilanKarakterler.includes(id)) {
        playerProfile.aktifKarakterId = id;
        kaydet();
        lobiGuncelle();
    } else {
        if (k.ciftPara) {
            if (playerProfile.toplamPara >= k.fiyatAltin && playerProfile.elmas >= k.fiyatElmas) {
                playerProfile.toplamPara -= k.fiyatAltin;
                playerProfile.elmas -= k.fiyatElmas;
            } else {
                alert(`❌ Yetersiz bakiye!`);
                return;
            }
        } else if (k.fiyatAltin > 0 && playerProfile.toplamPara >= k.fiyatAltin) {
            playerProfile.toplamPara -= k.fiyatAltin;
        } else if (k.fiyatElmas > 0 && playerProfile.elmas >= k.fiyatElmas) {
            playerProfile.elmas -= k.fiyatElmas;
        } else {
            alert("❌ Yetersiz bakiye!");
            return;
        }
        playBuySound();
        playerProfile.acilanKarakterler.push(id);
        playerProfile.aktifKarakterId = id;
        kaydet();
        lobiGuncelle();
    }
}

function boostSatinAl(boostKey, tur) {
    let b = BOOST_URUNLERI[boostKey];
    if (tur === 'altin' && playerProfile.toplamPara >= b.fiyatAltin) {
        playerProfile.toplamPara -= b.fiyatAltin;
    } else if (tur === 'elmas' && playerProfile.elmas >= b.fiyatElmas) {
        playerProfile.elmas -= b.fiyatElmas;
    } else {
        alert("❌ Yetersiz bakiye!");
        return;
    }
    playBuySound();
    playerProfile.aktifBoostlar[boostKey] = Date.now() + b.sureMs;
    kaydet();
    lobiGuncelle();
}

function oyunuBaslatTikla() {
    playBuySound();
    const modeSelect = document.getElementById('mode-select');
    gameState.zorluk = modeSelect ? modeSelect.value : 'normal';
    
    if (gameState.zorluk === 'kolay') gameState.toplamSoruSayisi = 5;
    else if (gameState.zorluk === 'normal') gameState.toplamSoruSayisi = 10;
    else if (gameState.zorluk === 'zor') gameState.toplamSoruSayisi = 20;

    let k = KARAKTER_TIPLERI[playerProfile.aktifKarakterId] || KARAKTER_TIPLERI["1"];
    gameState.maxCan = k.maxCan;
    if (playerProfile.aktifBoostlar["boost_elmas"]) gameState.maxCan += 20;
    
    gameState.can = gameState.maxCan;
    gameState.stres = 0;
    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    gameState.currentIndex = 0;
    gameState.answered = false;

    let rawPool = soruBankasiOlustur();
    let karistirilmis = arrayShuffle(rawPool).slice(0, gameState.toplamSoruSayisi);
    gameState.aktifSorular = karistirilmis.map(q => soruHazirla(q));

    sayfaDegis('quizScreen');
    senaryoGoster();
}

function senaryoGoster() {
    document.getElementById('scenarioBox').style.display = 'block';
    document.getElementById('quizContentBox').style.display = 'none';
    setTimeout(() => sorulariAc(), 1200);
}

function sorulariAc() {
    document.getElementById('scenarioBox').style.display = 'none';
    document.getElementById('quizContentBox').style.display = 'block';
    updateUI();
    soruYukle();
}

function updateUI() {
    const livesElem = document.getElementById('livesCount');
    if (livesElem) livesElem.innerText = `${gameState.can}/${gameState.maxCan}`;

    const stressElem = document.getElementById('stressCount');
    if (stressElem) stressElem.innerText = `%${gameState.stres}`;

    const scoreElem = document.getElementById('scoreCount');
    if (scoreElem) scoreElem.innerText = gameState.puan;
}

function soruYukle() {
    if (gameState.currentIndex >= gameState.aktifSorular.length) {
        oyunBitir(true, "tamamlandi");
        return;
    }
    gameState.answered = false;
    document.getElementById('nextBtn').style.display = 'none';
    
    let q = gameState.aktifSorular[gameState.currentIndex];
    document.getElementById('questionNum').innerText = `Senaryo ${gameState.currentIndex + 1} / ${gameState.aktifSorular.length}`;
    document.getElementById('questionText').innerText = q.soru;

    let optList = document.getElementById('optionsList');
    optList.innerHTML = '';

    q.secenekler.forEach((secenekObj, index) => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = secenekObj.metin;
        btn.onclick = () => secenekSec(secenekObj, btn);
        optList.appendChild(btn);
    });
}

function secenekSec(secenekObj, btn) {
    if (gameState.answered) return;
    gameState.answered = true;

    let puanKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;
    let altinKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;

    if (secenekObj.derece === "tam") {
        btn.style.backgroundColor = "#22c55e"; // Yeşil
        btn.style.color = "#ffffff";
        gameState.puan += 30 * puanKatsayi;
        gameState.kazanilanAltin += 20 * altinKatsayi;
        gameState.stres = Math.max(0, gameState.stres - 10);
        if (Math.random() < 0.35) gameState.kazanilanElmas += 1;
    } else if (secenekObj.derece === "orta") {
        btn.style.backgroundColor = "#eab308"; // Sarı
        btn.style.color = "#000000";
        gameState.puan += 15 * puanKatsayi;
        gameState.kazanilanAltin += 10 * altinKatsayi;
        gameState.can = Math.max(0, gameState.can - 10);
        gameState.stres = Math.min(100, gameState.stres + 10);
    } else {
        btn.style.backgroundColor = "#ef4444"; // Kırmızı
        btn.style.color = "#ffffff";
        gameState.can = Math.max(0, gameState.can - 25);
        gameState.stres = Math.min(100, gameState.stres + 25);
    }
    
    updateUI();

    // Ölüm Şartları Kontrolü
    if (gameState.can <= 0) {
        setTimeout(() => oyunBitir(false, "can_bitti"), 1000);
    } else if (gameState.zorluk === 'zor' && gameState.stres >= 100) {
        setTimeout(() => oyunBitir(false, "stres_krizi"), 1000);
    } else if (gameState.currentIndex < gameState.aktifSorular.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(() => oyunBitir(true, "tamamlandi"), 1000);
    }
}

function sonrakiSoruTikla() {
    gameState.currentIndex++;
    soruYukle();
}

function oyunBitir(basarili, neden) {
    sayfaDegis('gameOverScreen');
    
    const scoreElem = document.getElementById('finalScore');
    if (scoreElem) scoreElem.innerText = gameState.puan;

    playerProfile.toplamPara += gameState.kazanilanAltin;
    playerProfile.elmas += gameState.kazanilanElmas;
    playerProfile.xp += gameState.puan;

    if (playerProfile.xp >= playerProfile.seviye * 100) {
        playerProfile.seviye += 1;
        alert("🎉 Seviye atladın!");
    }
    
    kaydet();

    const titleElem = document.getElementById('endTitle');
    const msgElem = document.getElementById('endMessage');

    if (basarili) {
        if (titleElem) titleElem.innerText = "🏫 Zil Çaldı, Günü Kurtardın! 🎉";
        if (msgElem) msgElem.innerHTML = `Tebrikler!<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
    } else {
        if (neden === "stres_krizi") {
            if (titleElem) titleElem.innerText = "💥 Aşırı Stres Krizine Girdin!";
            if (msgElem) msgElem.innerHTML = `Zor modda Stres Barın %100 oldu ve derste fenalaştın!<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
        } else {
            if (titleElem) titleElem.innerText = "😵 Disipline Sevk Edildin!";
            if (msgElem) msgElem.innerHTML = `Canın tükendi ve disipline gönderildin.<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
        }
    }
}

function anaMenuyeDon() {
    sayfaDegis('startScreen');
    lobiGuncelle();
}
