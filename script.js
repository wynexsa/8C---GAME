let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playBuySound() {
    initAudio();
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
}

let playerProfile = {
    isim: "Sen (8-C)",
    toplamPara: parseInt(localStorage.getItem('oyuncu_para')) || 100,
    elmas: parseInt(localStorage.getItem('oyuncu_elmas')) || 10,
    xp: parseInt(localStorage.getItem('oyuncu_xp')) || 0,
    seviye: parseInt(localStorage.getItem('oyuncu_seviye')) || 1,
    acilanKarakterler: JSON.parse(localStorage.getItem('acilan_karakterler')) || ["1"],
    aktifKarakterId: localStorage.getItem('aktif_karakter') || "1",
    aktifBoostlar: JSON.parse(localStorage.getItem('aktif_boostlar')) || {}
};

function kaydet() {
    localStorage.setItem('oyuncu_para', playerProfile.toplamPara);
    localStorage.setItem('oyuncu_elmas', playerProfile.elmas);
    localStorage.setItem('oyuncu_xp', playerProfile.xp);
    localStorage.setItem('oyuncu_seviye', playerProfile.seviye);
    localStorage.setItem('acilan_karakterler', JSON.stringify(playerProfile.acilanKarakterler));
    localStorage.setItem('aktif_karakter', playerProfile.aktifKarakterId);
    localStorage.setItem('aktif_boostlar', JSON.stringify(playerProfile.aktifBoostlar));
}

const KARAKTER_TIPLERI = {
    "1": { ad: "Normal Öğrenci", fiyatAltin: 0, fiyatElmas: 0, ciftPara: false, aciklama: "Standart 8-C öğrencisi." },
    "2": { ad: "Sınav Canavarı", fiyatAltin: 150, fiyatElmas: 0, ciftPara: false, aciklama: "Ekstra Puan kazanır." },
    "3": { ad: "Arka Sıra Filozofu", fiyatAltin: 250, fiyatElmas: 0, ciftPara: false, aciklama: "Ekstra Altın kazanır." },
    "4": { ad: "⚡ DELİ (Süper Güçlü OP)", fiyatAltin: 1000, fiyatElmas: 5, ciftPara: true, aciklama: "Oyunun en iyisi! 5 Can başlar, 2x Altın & Puan kazanır!" }
};

const BOOST_URUNLERI = {
    "boost_1s": { ad: "1 Saatlik Boost", sureMs: 3600000, fiyatAltin: 100, fiyatElmas: 0, aciklama: "1.5x Puan" },
    "boost_mega": { ad: "🚀 Mega XP Katlayıcı", sureMs: 7200000, fiyatAltin: 250, fiyatElmas: 0, aciklama: "2x XP Kazanımı" },
    "boost_elmas": { ad: "🛡️ Elmas Kalkanı", sureMs: 3600000, fiyatAltin: 0, fiyatElmas: 3, aciklama: "+1 Ekstra Can" },
    "boost_kantin": { ad: "🍔 Kantin Katlayıcı", sureMs: 3600000, fiyatAltin: 500, fiyatElmas: 0, aciklama: "2x Altın Kazanımı" }
};

const SORU_HAVUZU = [
    { soru: "Matematik öğretmeni tahtaya kaldırdı: '2x + 6 = 14 ise x kaçtır?'", secenekler: ["3", "4", "5", "6"], cevap: 1 },
    { soru: "Türkçe dersinde fiilimsi sorusu: 'Koşarak gelen çocuk' cümlesinde 'koşarak' türü nedir?", secenekler: ["İsim-fiil", "Sıfat-fiil", "Zarf-fiil", "Çekimli fiil"], cevap: 2 },
    { soru: "Fen Bilgisi labında hoca sordu: Periyodik cetvelde 'Na' hangi elementtir?", secenekler: ["Azot", "Sodyum", "Nikel", "Neon"], cevap: 1 },
    { soru: "İnkılap Tarihi dersinde: Amasya Genelgesi'nin en önemli sonucu nedir?", secenekler: ["Milli Mücadelenin amacı ve yöntemi belirtildi", "Manda ve himaye kabul edildi", "Sevr antlaşması imzalandı", "Savaş bitti"], cevap: 0 },
    { soru: "Kantin sırasında arkadan biri önüne geçmeye çalıştı, 8-C öğrencisi olarak ne yaparsın?", secenekler: ["Kavga ederim", "Sıranın arkasına geçmesi için uyarırım", "Görmezden gelirim", "Kantinciden bağırırım"], cevap: 1 },
    { soru: "İngilizce öğretmeni sordu: 'What is the capital of England?'", secenekler: ["Paris", "London", "Berlin", "Madrid"], cevap: 1 },
    { soru: "Beden Eğitimi dersinde voleybol turnuvası var. Takım kaptanı seni seçti, tutumun ne olur?", secenekler: ["Oynamam", "Takım ruhuyla elinden geleni yaparsın", "Topu tek başına oynarsın", "Kenarda oturursun"], cevap: 1 },
    { soru: "Din Kültürü dersinde: Zekat kimlere verilir?", secenekler: ["Zenginlere", "İhtiyaç sahiplerine", "Okul müdürüne", "Herkese"], cevap: 1 },
    { soru: "Nöbetçi öğrencisin, müdür yardımcısı evrak imzalatmanı istedi. Ne yaparsın?", secenekler: ["Hemen gidip imzalatıp getiririm", "Sınıfa gidip uyurum", "Bahçede gezerim", "Evrakı kaybederim"], cevap: 0 },
    { soru: "Yazılı sınavdan 100 aldın, öğretmen sözlüne kaç verir?", secenekler: ["50", "100", "0", "70"], cevap: 1 },
    { soru: "Görsel Sanatlar dersinde resim çantasını evde unuttun, ne yaparsın?", secenekler: ["Dersten kaçarım", "Sıra arkadaşımdan yedek boya isterim", "Uykuma bakarim", "Ağlarım"], cevap: 1 },
    { soru: "Müzik dersinde blok flüt çalma sırası sana geldi. Hangi notayla başlarsın?", secenekler: ["Do", "Re", "Mi", "Fa"], cevap: 0 },
    { soru: "Rehberlik öğretmeni gelecekteki hedefini sorduğunda en mantıklı yanıt nedir?", secenekler: ["Yatmak", "Düzenli çalışıp başarmak", "Bilgisayar oynamak", "Okulu bırakmak"], cevap: 1 },
    { soru: "Sınıf başkanı seçiminde aday oldun. İlk vaadin ne olur?", secenekler: ["Sınıfı temiz ve düzenli tutmak", "Ödevleri yaptırmamak", "Derse girmemek", "Her gün tatil yapmak"], cevap: 0 },
    { soru: "Sınıfta cam kırıldı, hoca kim yaptı diye soruyor. Dürüst davranış nedir?", secenekler: ["Başkasına iftira atmak", "Doğruyu söylemek", "Sessiz kalmak", "Kaçmak"], cevap: 1 },
    { soru: "Solunum sistemimizin ana organı hangisidir?", secenekler: ["Kalp", "Mide", "Akciğer", "Böbrek"], cevap: 2 },
    { soru: "Kütüphanede uyulması gereken en temel kurallardan biri nedir?", secenekler: ["Yüksek sesle konuşmak", "Sessiz olmak", "Yemek yemek", "Müzik dinlemek"], cevap: 1 },
    { soru: "Suyun donma noktası kaç derecedir?", secenekler: ["0°C", "100°C", "-10°C", "50°C"], cevap: 0 },
    { soru: "İstiklal Marşı kaç kıtadan oluşur?", secenekler: ["8", "10", "12", "5"], cevap: 1 },
    { soru: "8-C sınıfında en başarılı öğrenci olmak için ne yapmalısın?", secenekler: ["Düzenli tekrar ve soru çözümü yapmak", "Sadece oyun oynamak", "Dersi dinlememek", "Kitap açmamak"], cevap: 0 }
];

let gameState = {
    zorluk: "normal",
    can: 3,
    puan: 0,
    kazanilanAltin: 0,
    kazanilanElmas: 0,
    aktifSorular: [],
    currentIndex: 0,
    answered: false,
    toplamSoruSayisi: 10
};

window.onload = () => {
    lobiGuncelle();
};

function sayfaDegis(hedefId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(hedefId).classList.add('active');
    if(hedefId === 'shopScreen') lobiGuncelle();
}

function openSupport() {
    const email = "qiwee617@gmail.com";
    alert(`📧 Destek ve önerileriniz için e-posta adresimiz:\n${email}`);
    window.location.href = `mailto:${email}?subject=8C-GAME%20Oneri%20ve%20Sikayet`;
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

    // Karakter Mağazası
    const charList = document.getElementById('characterShopList');
    if (charList) {
        charList.innerHTML = '';
        Object.keys(KARAKTER_TIPLERI).forEach(id => {
            let k = KARAKTER_TIPLERI[id];
            let acik = playerProfile.acilanKarakterler.includes(id);
            let secili = playerProfile.aktifKarakterId === id;

            let div = document.createElement('div');
            div.className = `shop-card ${secili ? 'aktif' : ''}`;
            
            let fiyatEtiketi = "";
            if (k.ciftPara) {
                fiyatEtiketi = `${k.fiyatAltin} 🪙 + ${k.fiyatElmas} 💎`;
            } else {
                fiyatEtiketi = k.fiyatAltin > 0 ? `${k.fiyatAltin} 🪙` : (k.fiyatElmas > 0 ? `${k.fiyatElmas} 💎` : "Ücretsiz");
            }

            let durumYazisi = secili ? "✅ Seçili" : (acik ? "Kullan" : fiyatEtiketi);
            
            div.innerHTML = `<div><b>${k.ad}</b><br><small style="color:#cbd5e1">${k.aciklama}</small></div><button class="main-btn" style="width:auto; padding:8px 15px; margin:0;" onclick="karakterSecVeyaAl('${id}')">${durumYazisi}</button>`;
            charList.appendChild(div);
        });
    }

    // Boost Mağazası
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
                alert(`❌ DELİ karakteri için hem ${k.fiyatAltin} Altın hem de ${k.fiyatElmas} Elmas gerekiyor!`);
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
        alert("⚡ SÜPER GÜÇLÜ DELİ KARAKTERİ AÇILDI!");
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
    alert("🛍️ Boost aktif edildi!");
}

function liderlikAc() {
    sayfaDegis('leaderboardScreen');
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '';

    let botData = [
        { isim: "Ahmet (8-A)", xp: 1200, seviye: 12 },
        { isim: "Zeynep (8-C)", xp: 950, seviye: 10 },
        { isim: "Mehmet (8-B)", xp: 700, seviye: 7 },
        { isim: "Ece (8-C)", xp: 450, seviye: 5 }
    ];

    let allPlayers = [...botData, { isim: playerProfile.isim + " (Sen)", xp: playerProfile.xp, seviye: playerProfile.seviye }];
    allPlayers.sort((a, b) => b.xp - a.xp);

    allPlayers.forEach((p, idx) => {
        let tr = document.createElement('tr');
        if (p.isim.includes("(Sen)")) tr.style.fontWeight = 'bold';
        tr.innerHTML = `<td>#${idx + 1}</td><td>${p.isim}</td><td>⭐ ${p.xp}</td><td>Lvl ${p.seviye}</td>`;
        tbody.appendChild(tr);
    });
}

function oyunuBaslatTikla() {
    initAudio();
    gameState.zorluk = document.getElementById('mode-select').value;
    
    // Zorluk moduna göre soru sayısı
    if (gameState.zorluk === 'kolay') gameState.toplamSoruSayisi = 5;
    else if (gameState.zorluk === 'normal') gameState.toplamSoruSayisi = 10;
    else if (gameState.zorluk === 'zor') gameState.toplamSoruSayisi = 20;

    // Deli karakteri 5 can verir, diğerleri 3
    gameState.can = (playerProfile.aktifKarakterId === "4") ? 5 : 3;
    if (playerProfile.aktifBoostlar["boost_elmas"]) gameState.can += 1;

    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    gameState.currentIndex = 0;
    gameState.answered = false;

    // Soruları karıştır ve seç
    gameState.aktifSorular = [...SORU_HAVUZU].sort(() => 0.5 - Math.random()).slice(0, gameState.toplamSoruSayisi);

    sayfaDegis('quizScreen');
    senaryoGoster();
}

function senaryoGoster() {
    document.getElementById('scenarioBox').style.display = 'block';
    document.getElementById('quizContentBox').style.display = 'none';
    setTimeout(() => sorulariAc(), 1800);
}

function sorulariAc() {
    document.getElementById('scenarioBox').style.display = 'none';
    document.getElementById('quizContentBox').style.display = 'block';
    updateUI();
    soruYukle();
}

function updateUI() {
    document.getElementById('livesCount').innerText = gameState.can;
    document.getElementById('scoreCount').innerText = gameState.puan;
}

function soruYukle() {
    if (gameState.currentIndex >= gameState.aktifSorular.length) {
        oyunBitir(true);
        return;
    }
    gameState.answered = false;
    document.getElementById('nextBtn').style.display = 'none';
    
    let q = gameState.aktifSorular[gameState.currentIndex];
    document.getElementById('questionNum').innerText = `Soru ${gameState.currentIndex + 1} / ${gameState.aktifSorular.length}`;
    document.getElementById('questionText').innerText = q.soru;

    let optList = document.getElementById('optionsList');
    optList.innerHTML = '';
    q.secenekler.forEach((opt, idx) => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => secenekSec(idx, btn);
        optList.appendChild(btn);
    });
}

function secenekSec(idx, btn) {
    if (gameState.answered) return;
    gameState.answered = true;
    let q = gameState.aktifSorular[gameState.currentIndex];
    let allBtns = document.querySelectorAll('.option-btn');

    let puanKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;
    let altınKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;

    if (idx === q.cevap) {
        btn.classList.add('correct');
        gameState.puan += 20 * puanKatsayi;
        gameState.kazanilanAltin += 15 * altınKatsayi;
        if (Math.random() < 0.3) gameState.kazanilanElmas += 1;
    } else {
        btn.classList.add('wrong');
        if (allBtns[q.cevap]) allBtns[q.cevap].classList.add('correct');
        gameState.can -= 1;
    }
    updateUI();

    if (gameState.can <= 0) {
        setTimeout(() => oyunBitir(false), 1200);
    } else if (gameState.currentIndex < gameState.aktifSorular.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(() => oyunBitir(true), 1200);
    }
}

function sonrakiSoruTikla() {
    gameState.currentIndex++;
    soruYukle();
}

function oyunBitir(basarili) {
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

    if (basarili) {
        document.getElementById('endTitle').innerText = "🏫 Zil Çaldı, Eve Dönüş Vakti! 🎉";
        document.getElementById('endMessage').innerHTML = `Tebrikler!<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
    } else {
        document.getElementById('endTitle').innerText = "😵 Sınıfta Kaldın!";
        document.getElementById('endMessage').innerHTML = `Canın tükendi.<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
    }
}

function anaMenuyeDon() {
    sayfaDegis('startScreen');
    lobiGuncelle();
}
