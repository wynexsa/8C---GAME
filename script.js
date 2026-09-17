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
    isim: "Öğrenci",
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
    "1": { ad: "Normal Öğrenci", fiyat: 0, elmasFiyat: 0 },
    "2": { ad: "Sınav Canavarı", fiyat: 150, elmasFiyat: 0 },
    "3": { ad: "Arka Sıra Filozofu", fiyat: 250, elmasFiyat: 0 },
    "4": { ad: "Veli", fiyat: 0, elmasFiyat: 5 }
};

const BOOST_URUNLERI = {
    "boost_1s": { ad: "1 Saatlik Boost", sureMs: 3600000, fiyatAltin: 100, fiyatElmas: 2 }
};

const SORU_HAVUZU = [
    { soru: "Türkiye'nin başkenti neresidir?", secenekler: ["İstanbul", "Ankara", "İzmir", "Bursa"], cevap: 1 },
    { soru: "Hangisi bir programlama dili değildir?", secenekler: ["Python", "HTML", "C++", "Java"], cevap: 1 },
    { soru: "Güneş sistemine en yakın gezegen hangisidir?", secenekler: ["Venüs", "Mars", "Merkür", "Jüpiter"], cevap: 2 },
    { soru: "İstiklal Marşı'nın şairi kimdir?", secenekler: ["Mehmet Akif Ersoy", "Orhan Veli", "Namık Kemal", "Atatürk"], cevap: 0 },
    { soru: "Su hangi sıcaklıkta kaynar?", secenekler: ["90°C", "100°C", "110°C", "80°C"], cevap: 1 }
];

let gameState = {
    zorluk: "normal",
    can: 3,
    puan: 0,
    kazanilanAltin: 0,
    kazanilanElmas: 0,
    aktifSorular: [],
    currentIndex: 0,
    answered: false
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
    document.getElementById('shopPara').innerText = playerProfile.toplamPara;
    document.getElementById('shopElmas').innerText = playerProfile.elmas;

    let aktifKarakterAdi = KARAKTER_TIPLERI[playerProfile.aktifKarakterId] ? KARAKTER_TIPLERI[playerProfile.aktifKarakterId].ad : "Normal Öğrenci";
    document.getElementById('oyuncuKarakterGosterge').innerText = aktifKarakterAdi;

    const list = document.getElementById('characterShopList');
    if (list) {
        list.innerHTML = '';
        Object.keys(KARAKTER_TIPLERI).forEach(id => {
            let k = KARAKTER_TIPLERI[id];
            let acik = playerProfile.acilanKarakterler.includes(id);
            let secili = playerProfile.aktifKarakterId === id;

            let div = document.createElement('div');
            div.className = `shop-card ${secili ? 'aktif' : ''}`;
            
            let durumYazisi = secili ? "✅ Seçili" : (acik ? "Kullan" : (k.fiyat > 0 ? `${k.fiyat} 🪙` : `${k.elmasFiyat} 💎`));
            
            div.innerHTML = `<div><b>${k.ad}</b></div><button class="main-btn" style="width:auto; padding:8px 15px; margin:0;" onclick="karakterSecVeyaAl('${id}')">${durumYazisi}</button>`;
            list.appendChild(div);
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
        if (k.fiyat > 0 && playerProfile.toplamPara >= k.fiyat) {
            playerProfile.toplamPara -= k.fiyat;
        } else if (k.elmasFiyat > 0 && playerProfile.elmas >= k.elmasFiyat) {
            playerProfile.elmas -= k.elmasFiyat;
        } else {
            alert("❌ Yetersiz bakiye!");
            return;
        }
        playBuySound();
        playerProfile.acilanKarakterler.push(id);
        playerProfile.aktifKarakterId = id;
        kaydet();
        lobiGuncelle();
        alert("🛍️ Satın alım başarılı!");
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

function oyunuBaslatTikla() {
    initAudio();
    gameState.zorluk = document.getElementById('mode-select').value;
    gameState.can = 3;
    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    gameState.currentIndex = 0;
    gameState.answered = false;

    gameState.aktifSorular = [...SORU_HAVUZU].sort(() => 0.5 - Math.random()).slice(0, 5);

    sayfaDegis('quizScreen');

    let senaryoGec = document.getElementById('skipScenarioCheck').checked;
    if (senaryoGec) {
        if (playerProfile.elmas >= 10) {
            playerProfile.elmas -= 10;
            kaydet();
            alert("💎 10 Elmas harcanarak senaryo geçildi!");
            sorulariAc();
        } else {
            alert("❌ 10 Elmasın olmadığı için senaryo geçilemedi!");
            senaryoGoster();
        }
    } else {
        senaryoGoster();
    }
}

function senaryoGoster() {
    document.getElementById('scenarioBox').style.display = 'block';
    document.getElementById('quizContentBox').style.display = 'none';
    setTimeout(() => sorulariAc(), 2500);
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

    if (idx === q.cevap) {
        btn.classList.add('correct');
        gameState.puan += 20;
        gameState.kazanilanAltin += 15;
        if (Math.random() < 0.2) gameState.kazanilanElmas += 1;
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
        setTimeout(() => oyunBitir(true), 1500);
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
