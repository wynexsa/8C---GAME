// ==========================================
// 1. OYUN DURUMU (GAME STATE)
// ==========================================
let gameState = {
    para: 100,
    elmas: 10,
    seviye: 1,
    xp: 0,
    can: 100,
    stres: 0,
    puan: 0,
    mevcutSoruIndex: 0,
    toplamSoruSayisi: 10,
    zorluk: 'normal',
    seciliKarakter: 'Normal Öğrenci'
};

// ==========================================
// 2. MAĞAZA VE LİDERLİK VERİLERİ
// ==========================================
const karakterler = [
    { id: 'normal', isim: 'Normal Öğrenci', fiyat: 0, birim: 'altin', aciklama: 'Dengeli istatistikler.', satinAlindi: true },
    { id: 'inekk', isim: 'Çalışkan İnek', fiyat: 150, birim: 'altin', aciklama: 'Daha az stres kazanır.', satinAlindi: false },
    { id: 'palyaco', isim: 'Sınıf Palyaçosu', fiyat: 200, birim: 'altin', aciklama: 'Espri gücüyle stresi hızlı düşürür.', satinAlindi: false },
    { id: 'havali', isim: 'Arka Sıradaki Havalı', fiyat: 15, birim: 'elmas', aciklama: 'Hocalardan daha az ceza alır.', satinAlindi: false }
];

const boostlar = [
    { id: 'kahve', isim: 'Enerji İçeceği', fiyat: 30, birim: 'altin', aciklama: 'Canı +%20 yeniler.' },
    { id: 'papatya', isim: 'Papatya Çayı', fiyat: 25, birim: 'altin', aciklama: 'Stresi -%20 azaltır.' }
];

const liderlikVerisi = [
    { isim: 'Ahmet_8C', xp: 2400, seviye: 12 },
    { isim: 'Zeynep_Pro', xp: 1950, seviye: 10 },
    { isim: 'Efe_Kral', xp: 1600, seviye: 8 },
    { isim: 'MehmetT', xp: 1200, seviye: 6 },
    { isim: 'Selin_S', xp: 850, seviye: 4 }
];

// ==========================================
// 3. SENARYOLAR VE SONUÇLARI (HİKAYE AKIŞI)
// ==========================================
const senaryolar = [
    {
        soru: "Matematik hocası ansızın sözlü yapmaya karar verdi ve gözlerini sınıfta gezdirmeye başladı!",
        secenekler: [
            {
                metin: "Göz temasından kaçın, silgini düşürmüş gibi yap.",
                can: 0,
                stres: 10,
                puan: 15,
                sonuc: "🙈 Hoca seni fark etmedi ve yan sıradaki arkadaşını kaldırdı! Kıl payı kurtuldun ama gerginlikten stresin arttı."
            },
            {
                metin: "Kendinden emin bir şekilde hocanın gözlerinin içine bak.",
                can: -15,
                stres: 20,
                puan: 30,
                sonuc: "👨‍🏫 Hoca özgüvenine hayran kaldı ama seni tahtaya kaldırdı! Soruda biraz bocalayınca azarı yedin."
            },
            {
                metin: "Arka sıradaki arkadaşının arkasına saklan.",
                can: -5,
                stres: 5,
                puan: 5,
                sonuc: "😅 Saklandığını gören hoca hafifçe gülümsedi ama pas geçti. Karizmayı biraz çizdirdin."
            }
        ]
    },
    {
        soru: "Kantin sırasında biri önün geçti ve 'Arkadaşıma sıra tutuyordum' dedi.",
        secenekler: [
            {
                metin: "Sertçe uyar ve sıranın arkasına geçmesini söyle.",
                can: -10,
                stres: 15,
                puan: 20,
                sonuc: "🗣️ Sözlü tartışma çıktı! Kantinci araya girdi, hakkını savundun ama boş yere sinirlendin."
            },
            {
                metin: "Görmezden gel, sabırla bekle.",
                can: 0,
                stres: 10,
                puan: 5,
                sonuc: "🍞 İçine attın ama tostunu alabildin. Biraz için içini yedi."
            },
            {
                metin: "Kantinciye şikayet et.",
                can: 0,
                stres: -5,
                puan: 15,
                sonuc: "🤝 Kantinci adil davrandı ve kaynak yapanı sıranın en arkasına yolladı. Zafer senin!"
            }
        ]
    },
    {
        soru: "Beden eğitimi dersinde iki kaptan takım kuruyor ve seni sona bıraktılar.",
        secenekler: [
            {
                metin: "Hırslan, maçta tüm gücünü gösterip kendini kanıtla.",
                can: -15,
                stres: -10,
                puan: 35,
                sonuc: "⚽ İnanılmaz bir performans sergiledin ve 2 gol attın! Herkes seni tebrik etti."
            },
            {
                metin: "Yedek kulübesinde oturup telefonla oyna.",
                can: 5,
                stres: 0,
                puan: 5,
                sonuc: "📱 Dinlendin ve enerjini topladın ama takımdakiler biraz soğuk davrandı."
            },
            {
                metin: "Kaleye geçmeyi teklif et.",
                can: -5,
                stres: 5,
                puan: 20,
                sonuc: "🧤 Özveri gösterdin, birkaç zorlu şutu çıkardın. Takım arkadaşlarının takdirini kazandın."
            }
        ]
    },
    {
        soru: "Nöbetçi öğretmen koridorda koştuğunu gördü ve seni durdurdu!",
        secenekler: [
            {
                metin: "Aptala yat: 'Hocam tuvalete yetişmeye çalışıyordum!'",
                can: 0,
                stres: 10,
                puan: 10,
                sonuc: "🚽 Öğretmen haline acıdı ve 'Bir daha koşma' diyerek bıraktı."
            },
            {
                metin: "Özür dile ve hemen yavaşça yürümeye başla.",
                can: 0,
                stres: -5,
                puan: 15,
                sonuc: "👨‍🏫 Olgun davranışın öğretmenin hoşuna gitti, sorunsuz devam ettin."
            },
            {
                metin: "Arkanı dönüp kaçmaya çalış.",
                can: -25,
                stres: 30,
                puan: 0,
                sonuc: "🚨 Yakalandın! Müdür yardımcısına götürüldün ve ciddi bir azar yedin."
            }
        ]
    },
    {
        soru: "Müzik dersinde blok flüt çalma sırası sana geldi ama evde hiç çalışmadın!",
        secenekler: [
            {
                metin: "Rastgele notalara basarak uydurma bir beste yap.",
                can: -10,
                stres: 15,
                puan: 10,
                sonuc: "🎶 Çıkardığın garip sesler yüzünden tüm sınıf kahkahalara boğuldu. Hoca pek memnun kalmadı."
            },
            {
                metin: "Flütümü evde unuttum hocam de.",
                can: -5,
                stres: 5,
                puan: 5,
                sonuc: "📝 Hoca eksi yazdı ama rezil olmaktan kurtuldun."
            },
            {
                metin: "Öksürme krizine girmiş gibi yapıp izin iste.",
                can: 0,
                stres: 10,
                puan: 15,
                sonuc: "😷 Oyunculuk yeteneğin sayesinde lavaboya gitme izni aldın. Günü kurtardın!"
            }
        ]
    },
    {
        soru: "Sınıf başkanı gürültü yapanların adını tahtaya yazıyor. Senin adını da yazdı!",
        secenekler: [
            {
                metin: "Gidip adını tahtadan sil.",
                can: -15,
                stres: 20,
                puan: 10,
                sonuc: "✏️ Sınıf başkanıyla kavga ettin, durum hoca gelince daha da büyüdü."
            },
            {
                metin: "Sessizce oturup hocaya durumu açıklayacağını söyle.",
                can: 0,
                stres: 5,
                puan: 20,
                sonuc: "🤝 Sakin kaldın. Hoca gelince durum anlaşıldı ve adın çizildi."
            },
            {
                metin: "Sınıf başkanına çikolata ısmarlama teklif et.",
                can: -5,
                stres: -5,
                puan: 15,
                sonuc: "🍫 Rüşvet işe yaradı! Adın tahtadan gizlice silindi."
            }
        ]
    },
    {
        soru: "Türkçe dersinde öğretmen serbest okuma saatinde kitap okumanızı söyledi.",
        secenekler: [
            {
                metin: "Gerçekten kitap oku.",
                can: 5,
                stres: -15,
                puan: 25,
                sonuc: "📚 Zihnin dinlendi, stresin azaldı ve hocanın takdirini kazandın."
            },
            {
                metin: "Kitabın arasına karikatür/çizgi roman saklayıp oku.",
                can: 0,
                stres: 10,
                puan: 15,
                sonuc: "🎨 Eğlendin ama sürekli yakalanma korkusu yaşadın."
            },
            {
                metin: "Kitabı yüzüne siper edip uyu.",
                can: 10,
                stres: 5,
                puan: 0,
                sonuc: "😴 Güzel bir uyku çektin ama hoca sıraya vurarak seni uyandırdı!"
            }
        ]
    },
    {
        soru: "Okul çıkışında arkadaşlarından biri 'İnternet kafeye gidelim mi?' dedi.",
        secenekler: [
            {
                metin: "Kabul et, oyuna akın!",
                can: -10,
                stres: -25,
                puan: 30,
                sonuc: "🎮 Bütün stresi oyunda attınız, harika zaman geçirdin!"
            },
            {
                metin: "Ödevlerim var diyerek eve git.",
                can: 10,
                stres: 5,
                puan: 20,
                sonuc: "🏠 Eve gidip ödevlerini hallettin, için rahat etti."
            },
            {
                metin: "Kütüphaneye gidip beraber ders çalışmayı teklif et.",
                can: -5,
                stres: 10,
                puan: 35,
                sonuc: "✍️ Arkadaşların önce mızmızlandı ama sonra verimli bir çalışma oldu."
            }
        ]
    },
    {
        soru: "Fen Laboratuvarında öğretmen deney tüplerine dokunmayın dedi ama çok merak ediyorsun.",
        secenekler: [
            {
                metin: "Tüpleri gizlice karıştır.",
                can: -30,
                stres: 25,
                puan: 5,
                sonuc: "💥 Tüpten kötü bir koku ve duman çıktı! Laboratuvar tahliye edildi, disiplinlik oldun!"
            },
            {
                metin: "Sadece uzaktan incele ve soru sor.",
                can: 0,
                stres: -5,
                puan: 25,
                sonuc: "🔬 Öğretmen ilgini sevdi ve sana ekstra sözlü puanı verdi."
            },
            {
                metin: "Arkadaşını kışkırt: 'Kanka dokunsana bir şey olmaz.'",
                can: 0,
                stres: 15,
                puan: 0,
                sonuc: "😈 Arkadaşın dokundu ve azar yedi. Vicdan azabı çekiyorsun."
            }
        ]
    },
    {
        soru: "Son ders zili çaldı, tam sınıftan çıkarken hoca 'Cuma günkü sınavı öne alıyoruz!' dedi.",
        secenekler: [
            {
                metin: "Tüm sınıf adına itiraz et.",
                can: -10,
                stres: 15,
                puan: 30,
                sonuc: "📢 Sınıfın kahramanı oldun ama hoca kararından dönmedi."
            },
            {
                metin: "Sessizce kabul et ve eve gidip çalışmaya karar ver.",
                can: -5,
                stres: 5,
                puan: 20,
                sonuc: "🧠 Gerçekçi davrandın, planlı hareket etmek seni rahatlattı."
            },
            {
                metin: "Derin bir 'Oofff' çek.",
                can: -5,
                stres: 10,
                puan: 5,
                sonuc: "😮‍💨 Hoca sana sert bir bakış attı ama bir şey demedi."
            }
        ]
    }
];

// ==========================================
// 4. EKRAN VE ARAYÜZ YÖNETİMİ
// ==========================================
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
    // Menu Bilgileri
    document.getElementById('menuPara').innerText = gameState.para;
    document.getElementById('menuElmas').innerText = gameState.elmas;
    document.getElementById('menuSeviye').innerText = gameState.seviye;
    document.getElementById('menuXP').innerText = gameState.xp;
    document.getElementById('oyuncuKarakterGosterge').innerText = gameState.seciliKarakter;

    // Oyun İçi Üst Bar (Yüzdelik Format)
    const livesElem = document.getElementById('livesCount');
    if (livesElem) livesElem.innerText = `%${gameState.can}`;

    const stressElem = document.getElementById('stressCount');
    if (stressElem) stressElem.innerText = `%${gameState.stres}`;

    const scoreElem = document.getElementById('scoreCount');
    if (scoreElem) scoreElem.innerText = gameState.puan;

    // Mağaza
    const shopPara = document.getElementById('shopPara');
    if (shopPara) shopPara.innerText = gameState.para;

    const shopElmas = document.getElementById('shopElmas');
    if (shopElmas) shopElmas.innerText = gameState.elmas;
}

// ==========================================
// 5. OYUN AKIŞ MANTIĞI (GAMEPLAY)
// ==========================================
function oyunuBaslatTikla() {
    const zorlukSecimi = document.getElementById('mode-select').value;
    gameState.zorluk = zorlukSecimi;

    if (zorlukSecimi === 'kolay') gameState.toplamSoruSayisi = 5;
    else if (zorlukSecimi === 'normal') gameState.toplamSoruSayisi = 10;
    else if (zorlukSecimi === 'zor') gameState.toplamSoruSayisi = 20;

    gameState.can = 100;
    gameState.stres = 0;
    gameState.puan = 0;
    gameState.mevcutSoruIndex = 0;

    sayfaDegis('quizScreen');
    soruYukle();
}

function soruYukle() {
    // Sonuç kutusunu gizle, şıklar kutusunu aç
    const sonucKutusu = document.getElementById('resultOutcomeBox');
    if (sonucKutusu) sonucKutusu.style.display = 'none';

    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('optionsList').style.display = 'block';

    const soruData = senaryolar[gameState.mevcutSoruIndex];
    document.getElementById('questionNum').innerText = `Senaryo ${gameState.mevcutSoruIndex + 1} / ${gameState.toplamSoruSayisi}`;
    document.getElementById('questionText').innerText = soruData.soru;

    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    soruData.secenekler.forEach((secenek, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = secenek.metin;
        btn.onclick = () => secimYap(index);
        optionsList.appendChild(btn);
    });
}

function secimYap(secenekIndex) {
    const mevcutSenaryo = senaryolar[gameState.mevcutSoruIndex];
    const secim = mevcutSenaryo.secenekler[secenekIndex];

    // 1. Etkileri uygula
    gameState.can += secim.can;
    gameState.stres += secim.stres;
    gameState.puan += secim.puan;

    // Sınır kontrolleri (%0 - %100)
    if (gameState.can > 100) gameState.can = 100;
    if (gameState.stres < 0) gameState.stres = 0;

    updateUI();

    // 2. Şıkları Gizle
    document.getElementById('optionsList').style.display = 'none';

    // 3. Hikaye Devamı (Sonuç) Kutusunu Olustur/Goster
    let sonucKutusu = document.getElementById('resultOutcomeBox');
    if (!sonucKutusu) {
        sonucKutusu = document.createElement('div');
        sonucKutusu.id = 'resultOutcomeBox';
        document.getElementById('quizContentBox').insertBefore(sonucKutusu, document.getElementById('nextBtn'));
    }

    // Etki Değişim Özetini Hazırla
    let etkiOzeti = [];
    if (secim.puan !== 0) etkiOzeti.push(`${secim.puan > 0 ? '+' : ''}${secim.puan} Puan`);
    if (secim.can !== 0) etkiOzeti.push(`${secim.can > 0 ? '' : ''}${secim.can}% Can`);
    if (secim.stres !== 0) etkiOzeti.push(`${secim.stres > 0 ? '+' : ''}${secim.stres}% Stres`);

    sonucKutusu.innerHTML = `
        <div style="background: #334155; padding: 15px; border-radius: 10px; margin: 15px 0; border-left: 5px solid #3b82f6;">
            <p style="font-size: 1.05em; line-height: 1.4; margin-bottom: 10px; color: #f8fafc;">${secim.sonuc}</p>
            <small style="color: #cbd5e1; font-weight: bold;">Etkiler: ${etkiOzeti.join(' | ') || 'Etki Yok'}</small>
        </div>
    `;
    sonucKutusu.style.display = 'block';

    // 4. Ölüm veya Yenilgi Kontrolü
    if (gameState.can <= 0) {
        oyunuBitir(false, "❤️ Canın bitti! Okul hayatının stresi seni pes ettirdi.");
        return;
    }
    if (gameState.zorluk === 'zor' && gameState.stres >= 100) {
        oyunuBitir(false, "🤯 Aşırı stresten bayıldın! Revire kaldırıldın.");
        return;
    }

    // 5. İlerleme Butonunu Göster
    document.getElementById('nextBtn').style.display = 'block';
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
    const finalScore = document.getElementById('finalScore');

    if (kazandi) {
        endTitle.innerText = "🏆 Başarılı!";
        endTitle.style.color = "#22c55e";

        // Kazanılan Ödüller
        const kazanilanXP = gameState.puan * 2;
        const kazanilanPara = Math.floor(gameState.puan / 2);

        gameState.xp += kazanilanXP;
        gameState.para += kazanilanPara;

        // Seviye Atlama Kontrolü
        if (gameState.xp >= gameState.seviye * 100) {
            gameState.seviye++;
            mesaj += `<br><br>🌟 <b>SEVİYE ATLADIN! Yeni Seviye: ${gameState.seviye}</b>`;
        }

        endMessage.innerHTML = `${mesaj}<br><br><b>Kazanılan Ödüller:</b><br>🪙 +${kazanilanPara} Altın<br>🔥 +${kazanilanXP} XP`;
    } else {
        endTitle.innerText = "💀 Oyun Bitti";
        endTitle.style.color = "#ef4444";
        endMessage.innerText = mesaj;
    }

    finalScore.innerText = gameState.puan;
    sayfaDegis('gameOverScreen');
}

function anaMenuyeDon() {
    sayfaDegis('startScreen');
}

// ==========================================
// 6. MAĞAZA İŞLEMLERİ
// ==========================================
function magazayiYukle() {
    const charList = document.getElementById('characterShopList');
    if (!charList) return;

    charList.innerHTML = '';
    karakterler.forEach(char => {
        const card = document.createElement('div');
        card.className = `shop-card ${gameState.seciliKarakter === char.isim ? 'aktif' : ''}`;

        let butonKodu = '';
        if (char.satinAlindi) {
            if (gameState.seciliKarakter === char.isim) {
                butonKodu = `<button style="background: #22c55e; border:none; color:white; padding: 6px 12px; border-radius:6px; font-weight:bold;">Seçili</button>`;
            } else {
                butonKodu = `<button onclick="karakterSec('${char.isim}')" style="background: #3b82f6; border:none; color:white; padding: 6px 12px; border-radius:6px; cursor:pointer;">Seç</button>`;
            }
        } else {
            const sembol = char.birim === 'altin' ? '🪙' : '💎';
            butonKodu = `<button onclick="karakterSatinal('${char.id}')" style="background: #eab308; border:none; color:black; padding: 6px 12px; border-radius:6px; font-weight:bold; cursor:pointer;">Satın Al (${sembol}${char.fiyat})</button>`;
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

    // Boostlar Listesi
    const boostList = document.getElementById('boostShopList');
    if (!boostList) return;

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

function karakterSatinal(id) {
    const char = karakterler.find(c => c.id === id);
    if (!char) return;

    if (char.birim === 'altin' && gameState.para >= char.fiyat) {
        gameState.para -= char.fiyat;
        char.satinAlindi = true;
        karakterSec(char.isim);
        alert(`${char.isim} satın alındı!`);
    } else if (char.birim === 'elmas' && gameState.elmas >= char.fiyat) {
        gameState.elmas -= char.fiyat;
        char.satinAlindi = true;
        karakterSec(char.isim);
        alert(`${char.isim} satın alındı!`);
    } else {
        alert("Yetersiz bakiye!");
    }
    magazayiYukle();
    updateUI();
}

function karakterSec(isim) {
    gameState.seciliKarakter = isim;
    magazayiYukle();
    updateUI();
}

function boostSatinal(id) {
    const boost = boostlar.find(b => b.id === id);
    if (!boost) return;

    if (gameState.para >= boost.fiyat) {
        gameState.para -= boost.fiyat;
        if (id === 'kahve') {
            gameState.can = Math.min(100, gameState.can + 20);
            alert("Kahve içtin! Canın %20 arttı.");
        } else if (id === 'papatya') {
            gameState.stres = Math.max(0, gameState.stres - 20);
            alert("Papatya çayı içtin! Stresin %20 azaldı.");
        }
    } else {
        alert("Yetersiz Altın!");
    }
    updateUI();
}

// ==========================================
// 7. LİDERLİK TABLOSU VE DESTEK
// ==========================================
function liderlikAc() {
    sayfaDegis('leaderboardScreen');
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    // Kendi skorumuzu da ekleyelim
    const liste = [...liderlikVerisi, { isim: 'SEN', xp: gameState.xp, seviye: gameState.seviye }];
    liste.sort((a, b) => b.xp - a.xp);

    liste.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (item.isim === 'SEN') tr.style.color = '#3b82f6';
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.isim}</td>
            <td>${item.xp}</td>
            <td>${item.seviye}</td>
        `;
        tbody.appendChild(tr);
    });
}

function openSupport() {
    alert("📧 Destek ve Geri Bildirim\n\nHer türlü soru ve önerileriniz için okul simülatörü geliştirici ekibiyle iletişime geçebilirsiniz.");
}

// ==========================================
// 8. İLK YÜKLEME (INIT)
// ==========================================
window.onload = function() {
    updateUI();
    magazayiYukle();
};
