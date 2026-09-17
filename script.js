// Web Audio API Sound Synthesizer
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

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

// Oyuncu Profili ve Yerel Depolama (LocalStorage)
let playerProfile = {
    isim: localStorage.getItem('oyuncu_isim') || "",
    toplamPara: parseInt(localStorage.getItem('oyuncu_para')) || 100, // Altın
    elmas: parseInt(localStorage.getItem('oyuncu_elmas')) || 5,       // Elmas (Daha zor kazanılır)
    xp: parseInt(localStorage.getItem('oyuncu_xp')) || 0,
    seviye: parseInt(localStorage.getItem('oyuncu_seviye')) || 1,
    toplamOynamaSuresiDk: parseInt(localStorage.getItem('oyuncu_sure')) || 0, // Dakika cinsinden
    acilanKarakterler: JSON.parse(localStorage.getItem('acilan_karakterler')) || ["1"],
    aktifKarakterId: localStorage.getItem('aktif_karakter') || "1",
    satinAlinanOzellikler: JSON.parse(localStorage.getItem('satin_ozellikler')) || [],
    aktifBoostlar: JSON.parse(localStorage.getItem('aktif_boostlar')) || {} // { tip: bitis_zamani_ms }
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
    localStorage.setItem('satin_ozellikler', JSON.stringify(playerProfile.satinAlinanOzellikler));
    localStorage.setItem('aktif_boostlar', JSON.stringify(playerProfile.aktifBoostlar));
}

// Karakterler
const KARAKTER_TIPLERI = {
    "1": { ad: "Arka Sıra Filozofu", fiyat: 0, akilSagligi: 100 },
    "2": { ad: "Sınav Canavarı", fiyat: 150, akilSagligi: 90 },
    "3": { ad: "Orta Yolcu Öğrenci", fiyat: 250, akilSagligi: 100 },
    "4": { ad: "Veli", fiyat: 400, akilSagligi: 110 }
};

// Mağaza Boost Ürünleri (Süre bazlı)
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

// Oyun Açılışında İsim Kontrolü ve Lobi
window.onload = () => {
    kontrolVeIsteIsim();
    renderLobby();
    oyunSuresiBaslat();
};

function kontrolVeIsteIsim() {
    if (!playerProfile.isim || playerProfile.isim.trim() === "") {
        let girilenIsim = prompt("Lütfen oyuncu adınızı girin:\n⚠️ (UYARI: Gerçek isminizi girmeyiniz!)");
        if (girilenIsim && girilenIsim.trim() !== "") {
            playerProfile.isim = girilenIsim.trim();
        } else {
            playerProfile.isim = "GizliÖğrenci_" + Math.floor(Math.random() * 1000);
        }
        saveProfile();
    }
}

// Oyunda geçirilen süreyi dakikalık olarak takip et (Tier List için)
function oyunSuresiBaslat() {
    setInterval(() => {
        playerProfile.toplamOynamaSuresiDk += 1;
        saveProfile();
    }, 60000); // Her 1 dakikada bir artar
}

// Lobi Arayüzünü Güncelle
function renderLobby() {
    document.getElementById('menuPara').innerText = playerProfile.toplamPara;
    document.getElementById('menuElmas').innerText = playerProfile.elmas;
    document.getElementById('menuSeviye').innerText = playerProfile.seviye;
    document.getElementById('menuXp').innerText = playerProfile.xp;
    document.getElementById('oyuncuIsimGosterge').innerText = playerProfile.isim;

    // Karakter Listesi
    const charListDiv = document.getElementById('characterShopList');
    if (charListDiv) {
        charListDiv.innerHTML = '';
        Object.keys(KARAKTER_TIPLERI).forEach(id => {
            let k = KARAKTER_TIPLERI[id];
            let acik = playerProfile.acilanKarakterler.includes(id);
            let aktif = playerProfile.aktifKarakterId === id;

            let btn = document.createElement('div');
            btn.className = `shop-card ${aktif ? 'aktif' : ''}`;
            btn.innerHTML = `
                <h4>${k.ad}</h4>
                <p>${acik ? (aktif ? '✅ Seçili' : 'Kilidi Açık') : '🔒 Fiyat: ' + k.fiyat + ' Altın'}</p>
            `;
            btn.onclick = () => {
                if (acik) {
                    playerProfile.aktifKarakterId = id;
                    saveProfile();
                    renderLobby();
                } else if (playerProfile.toplamPara >= k.fiyat) {
                    playerProfile.toplamPara -= k.fiyat;
                    playerProfile.acilanKarakterler.push(id);
                    playerProfile.aktifKarakterId = id;
                    saveProfile();
                    renderLobby();
                } else {
                    alert("Yeterli altının yok!");
                }
            };
            charListDiv.appendChild(btn);
        });
    }

    // Liderlik Tablosu / Tier List Güncelle (Simüle edilmiş oyuncular + gerçek oyuncu)
    renderTierList();
}

function renderTierList() {
    const tierDiv = document.getElementById('tierListContainer');
    if (!tierDiv) return;

    // Örnek diğer oyuncular ile birlikte gerçek oyuncunun süresini sıralayalım
    let liderler = [
        { isim: playerProfile.isim, sure: playerProfile.toplamOynamaSuresiDk },
        { isim: "ProGamer_99", sure: 1420 },
        { isim: "GeceKusu", sure: 980 },
        { isim: "PixelNinja", sure: 650 },
        { isim: "DersÇalışmayan", sure: 210 }
    ];

    // Süreye göre büyükten küçüğe sırala
    liderler.sort((a, b) => b.sure - a.sure);

    let html = "<h3>🏆 En Çok Oynayanlar Tier List</h3><ul style='list-style:none; padding:0;'>";
    liderler.forEach((l, index) => {
        let badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮";
        let aktifMi = l.isim === playerProfile.isim ? "style='color:#4ade80; font-weight:bold;'" : "";
        html += `<li ${aktifMi}>${badge} #${index+1} - <b>${l.isim}</b>: ${l.sure} dakika</li>`;
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
        } else { alert("Yeterli altının yok!"); return; }
    } else {
        if (playerProfile.elmas >= boost.fiyatElmas) {
            playerProfile.elmas -= boost.fiyatElmas;
        } else { alert("Yeterli elmasın yok!"); return; }
    }

    // Boost süresini ekle
    let mevcutBitis = playerProfile.aktifBoostlar[boostKey] || simdi;
    playerProfile.aktifBoostlar[boostKey] = Math.max(simdi, mevcutBitis) + boost.sureMs;
    saveProfile();
    renderLobby();
    alert(boost.ad + " başarıyla aktifleştirildi!");
}

// Oyunu Başlatma
function startGame() {
    initAudio();
    gameState.zorluk = document.getElementById('mode-select').value;
    
    gameState.can = 3;
    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    
    let aktifChar = KARAKTER_TIPLERI[playerProfile.aktifKarakterId];
    gameState.akilSagligi = aktifChar.akilSagligi;
    gameState.currentIndex = 0;
    gameState.answered = false;

    let shuffled = [...SORU_HAVUZU].sort(() => 0.5 - Math.random());
    gameState.aktifSorular = shuffled.slice(0, 5);

    document.getElementById('startScreen').classList.remove('active');
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('quizScreen').classList.add('active');

    const akilContainer = document.getElementById('akil-sagligi-container');
    if (akilContainer) {
        akilContainer.style.display = (gameState.zorluk === 'zor') ? 'flex' : 'none';
    }

    // Senaryoyu Geç Kontrolü (10 Elmas Maliyetli)
    let senaryoGecIstegi = document.getElementById('skipScenarioCheck') && document.getElementById('skipScenarioCheck').checked;
    
    if (senaryoGecIstegi) {
        if (playerProfile.elmas >= 10) {
            playerProfile.elmas -= 10;
            saveProfile();
            alert("💎 10 Elmas harcanarak senaryo geçildi!");
            gizleSenaryoVeSorulariAc();
        } else {
            alert("❌ Senaryoyu geçmek için yeterli elmasın yok! (10 Elmas gerekiyor)");
            gosterSenaryoEkrani(); // Normal senaryoya dön
        }
    } else {
        gosterSenaryoEkrani();
    }
}

function gosterSenaryoEkrani() {
    document.getElementById('scenarioBox').style.display = 'block';
    document.getElementById('quizContentBox').style.display = 'none';
}

function gizleSenaryoVeSorulariAc() {
    document.getElementById('scenarioBox').style.display = 'none';
    document.getElementById('quizContentBox').style.display = 'block';
    updateUI();
    loadQuestion();
}

function updateUI() {
    document.getElementById('livesCount').innerText = gameState.can;
    document.getElementById('scoreCount').innerText = gameState.puan;
    if (gameState.zorluk === 'zor') {
        document.getElementById('akilCount').innerText = gameState.akilSagligi;
    }
}

function loadQuestion() {
    if (gameState.currentIndex >= gameState.aktifSorular.length) {
        endGame(true);
        return;
    }

    gameState.answered = false;
    document.getElementById('nextBtn').style.display = 'none';

    const q = gameState.aktifSorular[gameState.currentIndex];
    document.getElementById('questionNum').innerText = `Soru ${gameState.currentIndex + 1} / ${gameState.aktifSorular.length}`;
    document.getElementById('questionText').innerText = q.soru;

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    q.secenekler.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => selectOption(index, btn);
        optionsList.appendChild(btn);
    });
}

function selectOption(selectedIndex, btnElement) {
    if (gameState.answered) return;
    gameState.answered = true;

    const q = gameState.aktifSorular[gameState.currentIndex];
    const allBtns = document.querySelectorAll('.option-btn');

    // Boost kontrolü (Aktif boost varsa çarpanlar 2 katı)
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
        
        // Elmas çok zor kazanılır: Sadece %15 ihtimalle 1 elmas düşer
        if (Math.random() < 0.15) {
            gameState.kazanilanElmas += 1;
        }

        playCorrectSound();
    } else {
        btnElement.classList.add('wrong');
        allBtns[q.cevap].classList.add('correct');
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
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(() => endGame(true), 1500);
    }
}

function nextQuestion() {
    gameState.currentIndex++;
    loadQuestion();
}

function endGame(success) {
    document.getElementById('quizScreen').classList.remove('active');
    document.getElementById('gameOverScreen').classList.add('active');

    const endTitle = document.getElementById('endTitle');
    const endMessage = document.getElementById('endMessage');
    const finalScore = document.getElementById('finalScore');

    finalScore.innerText = gameState.puan;

    // Ödülleri profile işle
    playerProfile.toplamPara += gameState.kazanilanAltin;
    playerProfile.elmas += gameState.kazanilanElmas;
    playerProfile.xp += gameState.puan;

    // Seviye Atlama
    let gerekenXp = playerProfile.seviye * 100;
    if (playerProfile.xp >= gerekenXp) {
        playerProfile.seviye += 1;
        alert("🎉 Seviye atladın! Yeni Seviye: " + playerProfile.seviye);
    }
    saveProfile();

    if (success) {
        endTitle.innerText = "🏫 Zil Çaldı, Eve Dönüş Vakti! 🎉";
        endMessage.innerHTML = `Tebrikler ${playerProfile.isim}! Karneni alıp eve doğru yola çıktın.<br>
        💰 <b>Kazanılan Altın:</b> +${gameState.kazanilanAltin}<br>
        💎 <b>Kazanılan Elmas:</b> +${gameState.kazanilanElmas}<br>
        ⭐ <b>Toplam Puan:</b> ${gameState.puan}`;
    } else {
        endTitle.innerText = "😵 Sınıfta Kaldın!";
        endMessage.innerHTML = `Canın ya da akıl sağlığın tükendi.<br>
        💰 <b>Kazanılan Altın:</b> +${gameState.kazanilanAltin}<br>
        💎 <b>Kazanılan Elmas:</b> +${gameState.kazanilanElmas}<br>
        ⭐ <b>Toplam Puan:</b> ${gameState.puan}`;
    }
}

function restartGame() {
    document.getElementById('gameOverScreen').classList.remove('active');
    document.getElementById('startScreen').classList.add('active');
    renderLobby();
}
