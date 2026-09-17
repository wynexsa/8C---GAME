// Web Audio API - Ses Sentezleyici
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Ses Efektleri
function playCorrectSound() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    osc.frequency.setValueAtTime(1046.50, now + 0.3);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
}

function playWrongSound() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
}

function playBuySound() {
    initAudio();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.setValueAtTime(880.00, now + 0.1); // A5

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
}

// Güvenli DOM Yardımcıları (Eleman bulunamazsa çökmeyi önler)
function setElemText(id, text) {
    const el = document.getElementById(id);
    if (el) el.innerText = text;
}
function setElemHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
}
function setElemDisplay(id, display) {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
}

// Oyuncu Verileri (LocalStorage)
let playerProfile = {
    isim: localStorage.getItem('oyuncu_isim') || "",
    toplamPara: parseInt(localStorage.getItem('oyuncu_para')) || 100, // Altın
    elmas: parseInt(localStorage.getItem('oyuncu_elmas')) || 10,       // Elmas
    xp: parseInt(localStorage.getItem('oyuncu_xp')) || 0,
    seviye: parseInt(localStorage.getItem('oyuncu_seviye')) || 1,
    toplamOynamaSuresiDk: parseInt(localStorage.getItem('oyuncu_sure')) || 0,
    acilanKarakterler: JSON.parse(localStorage.getItem('acilan_karakterler')) || ["1"], // "1" her zaman açık
    aktifKarakterId: localStorage.getItem('aktif_karakter') || "1",
    aktifBoostlar: JSON.parse(localStorage.getItem('aktif_boostlar')) || {}
};

function saveProfile() {
    localStorage.setItem('oyuncu_isim', playerProfile.isim);
    localStorage.setItem('oyuncu_para', playerProfile.toplamPara);
    localStorage.setItem('oyuncu_elmas', playerProfile.elmas);
    localStorage.setItem('oyuncu_xp', playerProfile.xp);
    localStorage.setItem('oyuncu_seviye', playerProfile.seviye);
    localStorage.setItem('oyuncu_sure', playerProfile.toplamOynamaSuresiDk);
    localStorage.setItem('acilan_karakterler', JSON.stringify(playerProfile.acilanKarakterler));
    localStorage.setItem('aktif_karakter', playerProfile.aktifKarakterId);
    localStorage.setItem('aktif_boostlar', JSON.stringify(playerProfile.aktifBoostlar));
}

// Karakterler (Normal Öğrenci Her Zaman Bedava)
const KARAKTER_TIPLERI = {
    "1": { ad: "Normal Öğrenci (Varsayılan)", fiyat: 0, elmasFiyat: 0, akilSagligi: 100 },
    "2": { ad: "Sınav Canavarı", fiyat: 150, elmasFiyat: 0, akilSagligi: 90 },
    "3": { ad: "Arka Sıra Filozofu", fiyat: 250, elmasFiyat: 0, akilSagligi: 100 },
    "4": { ad: "Veli", fiyat: 400, elmasFiyat: 5, akilSagligi: 110 }
};

// Boost Ürünleri
const BOOST_URUNLERI = {
    "boost_1s": { ad: "1 Saatlik XP/Altın Boost", sureMs: 3600000, fiyatAltin: 100, fiyatElmas: 2 },
    "boost_1g": { ad: "1 Günlük XP/Altın Boost", sureMs: 86400000, fiyatAltin: 800, fiyatElmas: 12 },
    "boost_3g": { ad: "3 Günlük XP/Altın Boost", sureMs: 259200000, fiyatAltin: 2000, fiyatElmas: 30 }
};

// Soru Havuzu
const SORU_HAVUZU = [
    { soru: "Türkiye'nin başkenti neresidir?", secenekler: ["İstanbul", "Ankara", "İzmir", "Bursa"], cevap: 1 },
    { soru: "Hangisi bir programlama dili değildir?", secenekler: ["Python", "HTML", "C++", "Java"], cevap: 1 },
    { soru: "Güneş sistemine en yakın gezegen hangisidir?", secenekler: ["Venüs", "Mars", "Merkür", "Jüpiter"], cevap: 2 },
    { soru: "İstiklal Marşı'nın şairi kimdir?", secenekler: ["Mehmet Akif Ersoy", "Orhan Veli", "Namık Kemal", "Atatürk"], cevap: 0 },
    { soru: "Su hangi sıcaklıkta kaynar (normal atmosfer basıncında)?", secenekler: ["90°C", "100°C", "110°C", "80°C"], cevap: 1 },
    { soru: "Hücrenin enerji merkezi olarak bilinen organel hangisidir?", secenekler: ["Ribozom", "Mitokondri", "Golgi", "Kloroplast"], cevap: 1 },
    { soru: "Periyodik cetvelde 'Fe' simgesi hangi elementi temsil eder?", secenekler: ["Fosfor", "Flor", "Demir", "Fermiyum"], cevap: 2 },
    { soru: "Dünya'nın tek doğal uydusu hangisidir?", secenekler: ["Titan", "Ay", "Phobos", "Europa"], cevap: 1 }
];

let gameState = {
    zorluk: "normal",
    can: 3,
    puan: 0,
    kazanilanAltin: 0,
    kazanilanElmas: 0,
    akilSagligi: 100,
    aktifSorular: [],
    currentIndex: 0,
    answered: false
};

// Sayfa Yüklendiğinde
window.onload = () => {
    kontrolVeIsteIsim();
    renderLobby();
    oyunSuresiBaslat();
};

function kontrolVeIsteIsim() {
    if (!playerProfile.isim || playerProfile.isim.trim() === "") {
        let girilenIsim = prompt("Lütfen oyuncu adınızı girin:\n⚠️ (GERÇEK İSMİNİZİ GİRMEYİNİZ!)");
        if (girilenIsim && girilenIsim.trim() !== "") {
            playerProfile.isim = girilenIsim.trim();
        } else {
            playerProfile.isim = "Öğrenci_" + Math.floor(Math.random() * 1000);
        }
        saveProfile();
    }
}

function oyunSuresiBaslat() {
    setInterval(() => {
        playerProfile.toplamOynamaSuresiDk += 1;
        saveProfile();
    }, 60000);
}

// Destek ve Öneri Modalı / İletişim
function openSupport() {
    const email = "qiwee617@gmail.com";
    alert(`📧 DESTEK VE ÖNERİ\n\nHer türlü öneri, şikayet ve görüşleriniz için e-posta adresimiz:\n${email}\n\nTamam'a basarak doğrudan e-posta gönderebilirsiniz.`);
    window.location.href = `mailto:${email}?subject=8C-GAME%20Oneri%20ve%20Sikayet`;
}

// Lobi ve Mağaza Ekranı Render
function renderLobby() {
    setElemText('menuPara', playerProfile.toplamPara);
    setElemText('menuElmas', playerProfile.elmas);
    setElemText('menuSeviye', playerProfile.seviye);
    setElemText('menuXp', playerProfile.xp);
    setElemText('oyuncuIsimGosterge', playerProfile.isim);

    // Karakter Mağazası Render
    const charListDiv = document.getElementById('characterShopList');
    if (charListDiv) {
        charListDiv.innerHTML = '';
        Object.keys(KARAKTER_TIPLERI).forEach(id => {
            let k = KARAKTER_TIPLERI[id];
            let acik = playerProfile.acilanKarakterler.includes(id);
            let aktif = playerProfile.aktifKarakterId === id;

            let card = document.createElement('div');
            card.className = `shop-card ${aktif ? 'aktif' : ''}`;
            
            let fiyatMetni = "BEDAVA";
            if (!acik) {
                fiyatMetni = k.fiyat > 0 ? `🔒 ${k.fiyat} Altın` : `🔒 ${k.elmasFiyat} Elmas`;
            } else {
                fiyatMetni = aktif ? "✅ Seçili" : "Kullan";
            }

            card.innerHTML = `
                <h4>${k.ad}</h4>
                <p>${fiyatMetni}</p>
            `;

            card.onclick = () => satinAlVeyaSecKarakter(id);
            charListDiv.appendChild(card);
        });
    }

    renderTierList();
}

function satinAlVeyaSecKarakter(id) {
    let k = KARAKTER_TIPLERI[id];
    let acik = playerProfile.acilanKarakterler.includes(id);

    if (acik) {
        playerProfile.aktifKarakterId = id;
        saveProfile();
        renderLobby();
    } else {
        if (k.fiyat > 0 && playerProfile.toplamPara >= k.fiyat) {
            playerProfile.toplamPara -= k.fiyat;
            basariliSatinAlim(id);
        } else if (k.elmasFiyat > 0 && playerProfile.elmas >= k.elmasFiyat) {
            playerProfile.elmas -= k.elmasFiyat;
            basariliSatinAlim(id);
        } else {
            alert("❌ Yeterli bakiyeniz bulunmuyor!");
        }
    }
}

function basariliSatinAlim(id) {
    playBuySound();
    playerProfile.acilanKarakterler.push(id);
    playerProfile.aktifKarakterId = id;
    saveProfile();
    renderLobby();
    alert("🛍️ Oyun içi parayla satın alımınız için teşekkürler!");
}

function renderTierList() {
    const tierDiv = document.getElementById('tierListContainer');
    if (!tierDiv) return;

    let liderler = [
        { isim: playerProfile.isim, sure: playerProfile.toplamOynamaSuresiDk },
        { isim: "ProGamer_99", sure: 1420 },
        { isim: "GeceKusu", sure: 980 },
        { isim: "PixelNinja", sure: 650 },
        { isim: "DersÇalışmayan", sure: 210 }
    ];

    liderler.sort((a, b) => b.sure - a.sure);

    let html = "<h3>🏆 En Çok Oynayanlar Tier List</h3><ul style='list-style:none; padding:0;'>";
    liderler.forEach((l, index) => {
        let badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮";
        let aktifMi = l.isim === playerProfile.isim ? "style='color:#4ade80; font-weight:bold;'" : "";
        html += `<li ${aktifMi}>${badge} #${index+1} - <b>${l.isim}</b>: ${l.sure} dk</li>`;
    });
    html += "</ul>";
    tierDiv.innerHTML = html;
}

// Boost Satın Alma
function buyBoost(boostKey, paraTuru) {
    let boost = BOOST_URUNLERI[boostKey];
    let simdi = Date.now();

    if (paraTuru === 'altin') {
        if (playerProfile.toplamPara >= boost.fiyatAltin) {
            playerProfile.toplamPara -= boost.fiyatAltin;
        } else { alert("❌ Yeterli altının yok!"); return; }
    } else {
        if (playerProfile.elmas >= boost.fiyatElmas) {
            playerProfile.elmas -= boost.fiyatElmas;
        } else { alert("❌ Yeterli elmasın yok!"); return; }
    }

    playBuySound();
    let mevcutBitis = playerProfile.aktifBoostlar[boostKey] || simdi;
    playerProfile.aktifBoostlar[boostKey] = Math.max(simdi, mevcutBitis) + boost.sureMs;
    saveProfile();
    renderLobby();
    alert("🛍️ Oyun içi parayla satın alımınız için teşekkürler!\n" + boost.ad + " aktifleştirildi!");
}

// Oyuna Başla
function startGame() {
    initAudio();

    const modeSelectEl = document.getElementById('mode-select');
    gameState.zorluk = modeSelectEl ? modeSelectEl.value : 'normal';
    
    gameState.can = 3;
    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    
    let aktifChar = KARAKTER_TIPLERI[playerProfile.aktifKarakterId] || KARAKTER_TIPLERI["1"];
    gameState.akilSagligi = aktifChar.akilSagligi;
    gameState.currentIndex = 0;
    gameState.answered = false;

    let shuffled = [...SORU_HAVUZU].sort(() => 0.5 - Math.random());
    gameState.aktifSorular = shuffled.slice(0, 5);

    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const quizScreen = document.getElementById('quizScreen');

    if (startScreen) startScreen.classList.remove('active');
    if (gameOverScreen) gameOverScreen.classList.remove('active');
    if (quizScreen) quizScreen.classList.add('active');

    const akilContainer = document.getElementById('akil-sagligi-container');
    if (akilContainer) {
        akilContainer.style.display = (gameState.zorluk === 'zor') ? 'flex' : 'none';
    }

    // Senaryo Geçme Kontrolü
    const skipCheck = document.getElementById('skipScenarioCheck');
    let senaryoGecIstegi = skipCheck ? skipCheck.checked : false;
    
    if (senaryoGecIstegi) {
        if (playerProfile.elmas >= 10) {
            playerProfile.elmas -= 10;
            saveProfile();
            alert("💎 10 Elmas harcanarak senaryo geçildi!");
            gizleSenaryoVeSorulariAc();
        } else {
            alert("❌ Senaryoyu geçmek için yeterli elmasın yok! (10 Elmas gerekiyor)");
            gosterSenaryoEkrani();
        }
    } else {
        // Eğer HTML'de senaryo kutusu yoksa direkt soruları aç
        if (document.getElementById('scenarioBox')) {
            gosterSenaryoEkrani();
        } else {
            gizleSenaryoVeSorulariAc();
        }
    }
}

function gosterSenaryoEkrani() {
    setElemDisplay('scenarioBox', 'block');
    setElemDisplay('quizContentBox', 'none');
}

function gizleSenaryoVeSorulariAc() {
    setElemDisplay('scenarioBox', 'none');
    setElemDisplay('quizContentBox', 'block');
    updateUI();
    loadQuestion();
}

function updateUI() {
    setElemText('livesCount', gameState.can);
    setElemText('scoreCount', gameState.puan);
    if (gameState.zorluk === 'zor') {
        setElemText('akilCount', gameState.akilSagligi);
    }
}

function loadQuestion() {
    if (gameState.currentIndex >= gameState.aktifSorular.length) {
        endGame(true);
        return;
    }

    gameState.answered = false;
    setElemDisplay('nextBtn', 'none');

    const q = gameState.aktifSorular[gameState.currentIndex];
    setElemText('questionNum', `Soru ${gameState.currentIndex + 1} / ${gameState.aktifSorular.length}`);
    setElemText('questionText', q.soru);

    const optionsList = document.getElementById('optionsList');
    if (optionsList) {
        optionsList.innerHTML = '';
        q.secenekler.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => selectOption(index, btn);
            optionsList.appendChild(btn);
        });
    }
}

function selectOption(selectedIndex, btnElement) {
    if (gameState.answered) return;
    gameState.answered = true;

    const q = gameState.aktifSorular[gameState.currentIndex];
    const allBtns = document.querySelectorAll('.option-btn');

    let simdi = Date.now();
    let boostAktif = false;
    for (let bKey in playerProfile.aktifBoostlar) {
        if (playerProfile.aktifBoostlar[bKey] > simdi) {
            boostAktif = true;
            break;
        }
    }
    let carpani = boostAktif ? 2 : 1;

    if (selectedIndex === q.cevap) {
        btnElement.classList.add('correct');
        gameState.puan += (20 * carpani);
        gameState.kazanilanAltin += (15 * carpani);
        
        if (Math.random() < 0.20) { // %20 ihtimalle 1 elmas
            gameState.kazanilanElmas += 1;
        }

        playCorrectSound();
    } else {
        btnElement.classList.add('wrong');
        if (allBtns[q.cevap]) allBtns[q.cevap].classList.add('correct');
        gameState.can -= 1;
        playWrongSound();

        if (gameState.zorluk === 'zor') {
            gameState.akilSagligi -= 25;
            if (gameState.akilSagligi < 0) gameState.akilSagligi = 0;
        }
    }

    updateUI();

    if (gameState.can <= 0 || (gameState.zorluk === 'zor' && gameState.akilSagligi <= 0)) {
        setTimeout(() => endGame(false), 1200);
    } else if (gameState.currentIndex < gameState.aktifSorular.length - 1) {
        setElemDisplay('nextBtn', 'block');
    } else {
        setTimeout(() => endGame(true), 1500);
    }
}

function nextQuestion() {
    gameState.currentIndex++;
    loadQuestion();
}

function endGame(success) {
    const quizScreen = document.getElementById('quizScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (quizScreen) quizScreen.classList.remove('active');
    if (gameOverScreen) gameOverScreen.classList.add('active');

    setElemText('finalScore', gameState.puan);

    playerProfile.toplamPara += gameState.kazanilanAltin;
    playerProfile.elmas += gameState.kazanilanElmas;
    playerProfile.xp += gameState.puan;

    let gerekenXp = playerProfile.seviye * 100;
    if (playerProfile.xp >= gerekenXp) {
        playerProfile.seviye += 1;
        alert("🎉 Seviye atladın! Yeni Seviye: " + playerProfile.seviye);
    }
    saveProfile();

    if (success) {
        setElemText('endTitle', "🏫 Zil Çaldı, Eve Dönüş Vakti! 🎉");
        setElemHTML('endMessage', `Tebrikler ${playerProfile.isim}! Karneni alıp eve ulaştın.<br>
        🪙 <b>Kazanılan Altın:</b> +${gameState.kazanilanAltin}<br>
        💎 <b>Kazanılan Elmas:</b> +${gameState.kazanilanElmas}<br>
        ⭐ <b>Toplam Puan:</b> ${gameState.puan}`);
    } else {
        setElemText('endTitle', "😵 Sınıfta Kaldın!");
        setElemHTML('endMessage', `Canın veya akıl sağlığın tükendi.<br>
        🪙 <b>Kazanılan Altın:</b> +${gameState.kazanilanAltin}<br>
        💎 <b>Kazanılan Elmas:</b> +${gameState.kazanilanElmas}<br>
        ⭐ <b>Toplam Puan:</b> ${gameState.puan}`);
    }
}

function restartGame() {
    setElemDisplay('gameOverScreen', 'none');
    const startScreen = document.getElementById('startScreen');
    if (startScreen) startScreen.classList.add('active');
    renderLobby();
}
