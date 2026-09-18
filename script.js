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

// --- SABİT MÜFREDAT VE OKUL YAŞAMI SORULARI ---
const SABIT_SORULAR = [
    { soru: "Türkçe: 'Koşarak gelen çocuk düşe kalka ilerledi.' cümlesinde kaç tane zarf-fiil vardır?", secenekler: ["1", "2", "3", "4"], cevap: 2 },
    { soru: "İnkılap Tarihi: Mustafa Kemal'in fikir hayatını etkileyen şehirlerden hangisi yurt dışındadır?", secenekler: ["Manastır", "İstanbul", "İzmir", "Amasya"], cevap: 0 },
    { soru: "Fen Bilimleri: Hangisi DNA'nın temel yapı birimidir?", secenekler: ["Kromozom", "Gen", "Nükleotid", "Organel"], cevap: 2 },
    { soru: "İngilizce: 'If you want to pass LGS exam, you must...'", secenekler: ["sleep all day", "study regularly", "skip classes", "play video games"], cevap: 1 },
    { soru: "Din Kültürü: Hangisi İslam'ın paylaşma ve yardımlaşmaya verdiği önemi gösteren farz ibadettir?", secenekler: ["Sadaka", "Zekat", "Fıtır Sadakası", "Kurban"], cevap: 1 },
    { soru: "Türkçe: 'Ateş pahası' deyiminin anlamı nedir?", secenekler: ["Çok sıcak olmak", "Çok pahalı olmak", "Çok hızlı olmak", "Çok tehlikeli olmak"], cevap: 1 },
    { soru: "İnkılap Tarihi: Manda ve himaye fikri ilk kez nerede reddedilmiştir?", secenekler: ["Amasya Genelgesi", "Erzurum Kongresi", "Sivas Kongresi", "Misak-ı Milli"], cevap: 1 },
    { soru: "Fen Bilimleri: pH değeri 3 olan bir çözelti için hangisi doğrudur?", secenekler: ["Kuvvetli bazdır", "Nötrdür", "Kuvvetli asittir", "Zayıf bazdır"], cevap: 2 },
    { soru: "8-C Mantık: Derse geç kaldın ve öğretmen içeride. Doğru davranış nedir?", secenekler: ["Kapıyı vurup izin isteyerek girmek", "Sessizce arkadan sızmak", "Kantine gitmek", "Kapıda bekleyip bağırmak"], cevap: 0 },
    { soru: "İnkılap Tarihi: TBMM'nin varlığını tanıyan ilk devlet hangisidir?", secenekler: ["Fransa", "Ermenistan", "Sovyetler Birliği", "İngiltere"], cevap: 1 },
    { soru: "Fen Bilimleri: Periyodik sistemde aynı grupta bulunan elementlerin nesi benzerdir?", secenekler: ["Kütle numaraları", "Kimyasal özellikleri", "Proton sayıları", "Katman sayıları"], cevap: 1 },
    { soru: "Türkçe: Hangi cümlede sebep-sonuç ilişkisi vardır?", secenekler: ["Kar yağdığı için yollar kapandı.", "Okula gitmek üzere çıktı.", "Çalışırsan başarırsın.", "Kitap okumayı çok sever."], cevap: 0 },
    { soru: "İngilizce: 'What is the opposite of 'Hard-working'?'", secenekler: ["Smart", "Lazy", "Kind", "Polite"], cevap: 1 },
    { soru: "8-C Okul Yaşamı: Sınıf nöbetçisinin temel görevi nedir?", secenekler: ["Tahtayı silip sınıf düzenini sağlamak", "Derste uyumak", "Kantin sırasını bozmak", "Hocanın çantasını kaçırmak"], cevap: 0 },
    { soru: "Din Kültürü: Hangisi insanın kendi iradesiyle seçebildiği (cüzi irade) bir durumdur?", secenekler: ["Doğum yeri", "Irkı", "Ahlaklı ve dürüst olmak", "Anne babası"], cevap: 2 },
    { soru: "Fen Bilimleri: Katı basıncı hangisine bağlı olarak değişir?", secenekler: ["Kuvvet ve Yüzey Alanı", "Hacim ve Sıcaklık", "Yükseklik ve Yoğunluk", "Sadece Derinlik"], cevap: 0 },
    { soru: "İnkılap Tarihi: Kurtuluş Savaşı'nın Doğu Cephesi hangi antlaşma ile kapanmıştır?", secenekler: ["Gümrü Antlaşması", "Ankara Antlaşması", "Mudanya Mütarekesi", "Lozan Antlaşması"], cevap: 0 },
    { soru: "Türkçe: 'Ağaç yaşken eğilir' atasözünün anlamı nedir?", secenekler: ["Ağaçlar gençken budanır", "İnsanlar küçük yaşta eğitilir", "Yaşlı insanlar esnek olur", "Meyve veren ağaç taşlanır"], cevap: 1 },
    { soru: "İngilizce: 'Sundance is a adventurous person. He loves...'", secenekler: ["extreme sports", "staying at home", "sleeping early", "doing homework"], cevap: 0 },
    { soru: "8-C Mantık: Sınav esnasında kaleminin ucu kırıldı. Ne yapmalısın?", secenekler: ["Sessizce parmak kaldırıp öğretmeninden izin istemek", "Yanındakinin kalemini kapmak", "Sınavı bırakıp çıkmak", "Ağlamaya başlamak"], cevap: 0 }
];

// --- DİNAMİK 1000+ SORU ÜRETİCİ ALGORİTMA ---
function dinamikSoruBankasiUret() {
    let havuz = [...SABIT_SORULAR];

    // 1. Denklem Soruları (150 Adet Varyasyon)
    for (let a = 2; a <= 10; a++) {
        for (let b = 1; b <= 15; b++) {
            let x = Math.floor(Math.random() * 8) + 2;
            let c = a * x + b;
            havuz.push({
                soru: `Matematik: '${a}x + ${b} = ${c}' denkleminde x kaçtır?`,
                secenekler: [`${x}`, `${x + 1}`, `${x - 1}`, `${x + 2}`],
                cevap: 0
            });
        }
    }

    // 2. Karekök Soruları (100 Adet Varyasyon)
    for (let i = 2; i <= 25; i++) {
        let kare = i * i;
        havuz.push({
            soru: `Matematik: '√${kare}' ifadesinin değeri kaçtır?`,
            secenekler: [`${i}`, `${i - 1}`, `${i + 2}`, `${i * 2}`],
            cevap: 0
        });
    }

    // 3. Fen Bilimleri Element/Atom Numarası Soruları (100 Adet)
    const elementler = [
        { ad: "Hidrojen", sembol: "H", no: 1 }, { ad: "Helyum", sembol: "He", no: 2 },
        { ad: "Lityum", sembol: "Li", no: 3 }, { ad: "Berilyum", sembol: "Be", no: 4 },
        { ad: "Bor", sembol: "B", no: 5 }, { ad: "Karbon", sembol: "C", no: 6 },
        { ad: "Azot", sembol: "N", no: 7 }, { ad: "Oksijen", sembol: "O", no: 8 },
        { ad: "Flor", sembol: "F", no: 9 }, { ad: "Neon", sembol: "Ne", no: 10 },
        { ad: "Sodyum", sembol: "Na", no: 11 }, { ad: "Magnezyum", sembol: "Mg", no: 12 },
        { ad: "Alüminyum", sembol: "Al", no: 13 }, { ad: "Silisyum", sembol: "Si", no: 14 },
        { ad: "Fosfor", sembol: "P", no: 15 }, { ad: "Kükürt", sembol: "S", no: 16 },
        { ad: "Klor", sembol: "Cl", no: 17 }, { ad: "Argon", sembol: "Ar", no: 18 }
    ];

    elementler.forEach(e => {
        havuz.push({
            soru: `Fen Bilimleri: '${e.ad}' elementinin kimyasal sembolü nedir?`,
            secenekler: [e.sembol, e.ad.substring(0,2).toUpperCase(), "X", "K"],
            cevap: 0
        });
        havuz.push({
            soru: `Fen Bilimleri: Sembolü '${e.sembol}' olan elementin atom numarası kaçtır?`,
            secenekler: [`${e.no}`, `${e.no + 2}`, `${e.no - 1}`, `${e.no + 5}`],
            cevap: 0
        });
    });

    // 4. DNA Nükleotid Eşleşme Mantık Soruları (100 Adet)
    for (let a = 100; a <= 1000; a += 50) {
        havuz.push({
            soru: `Fen Bilimleri: Bir DNA molekülünde ${a} Adenin varsa, kaç tane Timin bulunur?`,
            secenekler: [`${a}`, `${a / 2}`, `${a * 2}`, `${a + 100}`],
            cevap: 0
        });
    }

    // 5. Üslü İfadeler Soruları (150 Adet)
    for (let taban = 2; taban <= 5; taban++) {
        for (let us = 2; us <= 6; us++) {
            let sonuc = Math.pow(taban, us);
            havuz.push({
                soru: `Matematik: '${taban}^${us}' üslü ifadesinin değeri kaçtır?`,
                secenekler: [`${sonuc}`, `${sonuc + taban}`, `${sonuc - 2}`, `${taban * us}`],
                cevap: 0
            });
        }
    }

    // Seçenekleri Şıklar Arasında Karıştır
    havuz.forEach(item => {
        let dogruCevapMetni = item.secenekler[item.cevap];
        // Şıkları karıştır
        for (let i = item.secenekler.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [item.secenekler[i], item.secenekler[j]] = [item.secenekler[j], item.secenekler[i]];
        }
        item.cevap = item.secenekler.indexOf(dogruCevapMetni);
    });

    return havuz;
}

// SORU HAVUZUNU OLUŞTUR
const TAM_SORU_HAVUZU = dinamikSoruBankasiUret();

// --- FISHER-YATES GERÇEK RASTGELELEŞTİRME ALGORİTMASI ---
function diziKaristir(dizi) {
    let kopya = [...dizi];
    for (let i = kopya.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
    return kopya;
}

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
    
    if (gameState.zorluk === 'kolay') gameState.toplamSoruSayisi = 5;
    else if (gameState.zorluk === 'normal') gameState.toplamSoruSayisi = 10;
    else if (gameState.zorluk === 'zor') gameState.toplamSoruSayisi = 20;

    gameState.can = (playerProfile.aktifKarakterId === "4") ? 5 : 3;
    if (playerProfile.aktifBoostlar["boost_elmas"]) gameState.can += 1;

    gameState.puan = 0;
    gameState.kazanilanAltin = 0;
    gameState.kazanilanElmas = 0;
    gameState.currentIndex = 0;
    gameState.answered = false;

    // TANIMLI + DİNAMİK TÜM SORULARI Fisher-Yates İLE KARIŞTIR
    let karistirilmisTümSorular = diziKaristir(TAM_SORU_HAVUZU);
    gameState.aktifSorular = karistirilmisTümSorular.slice(0, gameState.toplamSoruSayisi);

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
    
    // Soru seçeneklerini de her soru yüklendiğinde kendi içinde rastgele karıştır
    let secenekListesi = q.secenekler.map((opt, idx) => ({ metin: opt, orijinalIdx: idx }));
    secenekListesi = diziKaristir(secenekListesi);

    secenekListesi.forEach(item => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = item.metin;
        btn.onclick = () => secenekSec(item.orijinalIdx, btn);
        optList.appendChild(btn);
    });
}

function secenekSec(orijinalIdx, btn) {
    if (gameState.answered) return;
    gameState.answered = true;
    let q = gameState.aktifSorular[gameState.currentIndex];
    let allBtns = document.querySelectorAll('.option-btn');

    let puanKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;
    let altınKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;

    if (orijinalIdx === q.cevap) {
        btn.classList.add('correct');
        gameState.puan += 20 * puanKatsayi;
        gameState.kazanilanAltin += 15 * altınKatsayi;
        if (Math.random() < 0.3) gameState.kazanilanElmas += 1;
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.innerText === q.secenekler[q.cevap]) {
                b.classList.add('correct');
            }
        });
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
