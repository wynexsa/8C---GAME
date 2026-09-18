const SAVE_KEY = '8c_game_data_v3';

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

function arrayShuffle(dizi) {
    let kopya = [...dizi];
    for (let i = kopya.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
    }
    return kopya;
}

// --- 50 ADET EĞLENCELİ 8-C OKUL SENARYOSU ---
function soruBankasiOlustur() {
    return [
        { soru: "Derse 5 dakika geç kaldın ve hoca kapıda dikiliyor! Ne yaparsın?", secenekler: ["'Hocam revirdeydim kan verdim' demek", "Sessizce arkadan içeri sızmak", "Kantine kaçıp tost yemek", "Kapıda bekleyip ağlamak"], cevap: 0 },
        { soru: "Hoca listeden rastgele sözlüye adam kaldırıyor ve seninle göz göze geldi!", secenekler: ["Kalemi düşürmüş gibi yapıp sıranın altına saklanmak", "Hocaya dik dik bakıp özgüven şovu yapmak", "Öksürme krizine girmek", "Tuvalet için izin istemek"], cevap: 0 },
        { soru: "Kantinde son kaşarlı tost kaldı ama önünde 8-A'dan biri var!", secenekler: ["'O tost dün geceden kaldı kanka' deyip aklını çelmek", "Efendi gibi sıranı beklemek", "Tostu kapıp kaçmak", "Kantinciye 50 TL rüşvet teklif etmek"], cevap: 0 },
        { soru: "Sınıf nöbetçisisin ve müdür koridorda sana doğru yürüyor!", secenekler: ["Boş kağıtlara ciddi ciddi bakarak hızlıca yanından geçmek", "Tuvalete kaçıp kapıyı kilitlemek", "Görmezden gelip ıslık çalmak", "Koşup müdüre sarılmak"], cevap: 0 },
        { soru: "Derste gizlice cips paketi açman gerekiyor ama ses çıkacak!", secenekler: ["Arkadaşın öksürürken paketi tek hamlede patlatmak", "Yavaşça açmaya çalışıp 'ÇIIİRT' diye ses çıkartmak", "Paketi sıranın altında dişlemek", "Hocaya ikram etmek"], cevap: 0 },
        { soru: "Hoca 'Bu soruyu çözene sözlüye 100 veriyorum' dedi!", secenekler: ["Hiçbir şey bilmesen de özgüvenle tahtaya fırlamak", "Yanındakini dürtüp tahtaya itmek", "Kafanı sıraya gömmek", "'Hocam soru hatalı' demek"], cevap: 0 },
        { soru: "Beden dersinde eşofmanını evde unuttun!", secenekler: ["'Hocam ayak bileğim burkuldu' deyip kenarda oturmak", "Kot pantolonla 100 metre depar atmak", "Arkadaşının şortunu ödünç alıp giymek", "Soyunma odasında ders sonuna kadar saklanmak"], cevap: 0 },
        { soru: "Sınıfın akıllı tahtası dondu, hoca çaresizce bakıyor!", secenekler: ["Arka sıradan 'Hocam fişi çekip takalım' diye bağırmak", "Format atmaya çalışıp tahtayı tamamen bozmak", "Hocaya arkadan taktik vermek", "Hiç istifini bozmamak"], cevap: 0 },
        { soru: "Yazılıda arkadaki arkadaşın sürekli sırtına vurup cevap istiyor!", secenekler: ["Hoca bakarken garip el hareketleriyle yanlış cevap vermek", "Kağıdı tamamen kapatıp arkana dönmemek", "Kağıdı çaktırmadan arkaya kaydırmak", "Hocaya 'Arkamdaki beni taciz ediyor' demek"], cevap: 0 },
        { soru: "Zil çaldı ve sınıf kapısının önü izdiham alanına döndü!", secenekler: ["Çantanı kalkan yapıp kalabalığı yarmak", "Herkesin çıkmasını sakince beklemek", "Pencereden atlamayı düşünmek", "Sınıfın kapısını üzerlerine kilitlemek"], cevap: 0 },
        { soru: "Hoca ödev kontrolü yapıyor ve sen ödevi kesinlikle yapmadın!", secenekler: ["'Hocam masadaydı annem çantama koymamış' demek", "Yanındakinin ödevini hızlıca kendi defterine geçirmek", "Hoca yaklaşınca bayılma numarası yapmak", "Dürüstçe 'Yapmadım hocam' deyip 1 almak"], cevap: 0 },
        { soru: "Yan sıradaki arkadaşın senin sıranın üzerine silgi tozu dağıttı!", secenekler: ["Tüm tozları üfleyip onun yüzüne uçurmak", "Sessizce silgi tozlarını toplamak", "Onun sırasına çöp kovasını dökmek", "Hocaya ağlayarak şikayet etmek"], cevap: 0 },
        { soru: "Fen labında hoca 'Sakın buna dokunmayın' dedi!", secenekler: ["Hoca arkasını dönünce parmak ucuyla dokunmak", "Tüpü yanlışlıkla devirip küçük bir patlama yaratmak", "Laboratuvardan dışarı kaçmak", "Tüpün fotoğrafını çekip gruba atmak"], cevap: 0 },
        { soru: "Koridorda koşarken yanlışlıkla müdür yardımcısına çarptın!", secenekler: ["'Hocam ders yetişiyordu' deyip özür dileyerek ışık hızında kaçmak", "Yere düşüp ayağım kırıldı numarası yapmak", "Müdür yardımcısına 'Önüne baksana birader' demek", "Donup kalmak"], cevap: 0 },
        { soru: "Teneffüste sınıfta pet şişeyle futbol oynarken hoca içeri girdi!", secenekler: ["Şişeyi hemen sıranın altına saklayıp test çözüyor gibi yapmak", "Şişeyi hocanın ayaklarına doğru pas atmak", "'Hocam şişeyi geri dönüşüme atıyorduk' demek", "Korkudan pencereden bakmak"], cevap: 0 },
        { soru: "Yağmurlu günde okul bahçesinde devasa bir çamur birikintisi oluştu!", secenekler: ["Arkadaşını çaktırmadan çamurun içine itmek", "Etrafından dolaşmak", "Üzerinden çılgınca atlamaya çalışıp çamura saplanmak", "Çamurda kaydırak yapmak"], cevap: 0 },
        { soru: "Çöp kovasına buruşturulmuş kağıtla üçlük denemesi yaptın ve kaçırdın!", secenekler: ["Hoca görmeden hemen koşup yerdeki kağıdı almak", "'Rüzgar çıktı hocam' demek", "Kağıdı başkasının attığını iddia etmek", "İkinci kağıdı atıp şansını denemek"], cevap: 0 },
        { soru: "Derste telefonunun zil sesi son ses çalmaya başladı!", secenekler: ["Yanındakine dik dik bakıp 'Kardeşim kapatsana şu telefonu' demek", "Öksürük krizine girip sesi bastırmaya çalışmak", "Telefonu çantanın en dibine fırlatmak", "Telefonu açıp 'Dersteyim anne' demek"], cevap: 0 },
        { soru: "Sıradaki arkadaşın derste horlayarak uyuyakalmış!", secenekler: ["Hoca tam soru sorarken arkadaşını dürtüp 'Hoca seni çağırdı' demek", "Üstünü montla örtüp uyumasına izin vermek", "Sessizce fotoğrafını çekmek", "Hocaya gösterip gülmek"], cevap: 0 },
        { soru: "Kantinde simit alacaksın ama 5 TL eksiğin var!", secenekler: ["Kantinciye 'Yarın vereyim abi' bakışı atmak", "Arkadaşının cebinden çaktırmadan 5 TL yürütmek", "Simidin yarısını istemek", "Vazgeçip aç kalmak"], cevap: 0 },
        { soru: "İstiklal Marşı töreninde en önde gülme krizine girdin!", secenekler: ["Dudaklarını ısırıp gökyüzüne bakarak kendini tutmaya çalışmak", "Arkadaşının arkasına saklanmak", "Ciddi durmak için matematik problemleri düşünmek", "Kahkaha atmak"], cevap: 0 },
        { soru: "Hoca 'Arka sıra yine çok konuşuyor!' diye bağırdı!", secenekler: ["Hemen ön sıradakileri işaret edip suçu onlara atmak", "'Hocam dersle ilgili tartışıyorduk' demek", "Özür dileyip sessizleşmek", "Arka sırayı terk etmek"], cevap: 0 },
        { soru: "Test sınavında iki şık arasında kaldın: A mı C mi?", secenekler: ["Silgiyi havaya atıp yazı tura yöntemiyle seçmek", "İkisini de işaretlemek", "Boş bırakmak", "Ön sıradakinin kağıdına bakmak"], cevap: 0 },
        { soru: "Rehberlik öğretmeni 'Bir derdin var mı evladım?' diye sordu!", secenekler: ["'Hayat çok zor hocam' deyip 45 dakika dersten kaytarmak", "'Yok hocam sağ olun' deyip sınıfa dönmek", "Okul yemeklerini şikayet etmek", "Ağlama taklidi yapmak"], cevap: 0 },
        { soru: "Sınıfa yeni bir nakil öğrenci geldi!", secenekler: ["İlk teneffüste yanına gidip 'Bu sınıfın kuralları var' pozu kesmek", "Hoş geldin deyip kantinden çay ısmarlamak", "Görmezden gelmek", "Onu en arka sıraya oturtmak"], cevap: 0 },
        { soru: "Sınıf kapısının kolu aniden elinde kaldı!", secenekler: ["Çaktırmadan yerine takıp kapıyı açık bırakarak uzaklaşmak", "Kapı koluyla sınıfta şov yapmak", "Hocaya teslim etmek", "Çöpe atmak"], cevap: 0 },
        { soru: "Yan sıradaki arkadaşın tostundan 'bir ısırık' istedi!", secenekler: ["Tostun yarısını tek hamlede ısırıp geri vermek", "Küçücük bir parça koparmak", "'Tost bozuk kanka' deyip vermemek", "Tostu ona hediye etmek"], cevap: 0 },
        { soru: "Sessiz derste karnından devasa bir gurultu sesi yükseldi!", secenekler: ["Sandalyeyi yere sürterek sesi taklit etmeye çalışmak", "'Hocam dışarıdan inşaat sesi geliyor' demek", "Karnını tutup dışarı çıkmak", "Arkadaşına bakıp 'Öküz gibi guruldamasana' demek"], cevap: 0 },
        { soru: "Okul kütüphanesinde tam bir sessizlik hakim!", secenekler: ["Metal kalemliği yere düşürüp deprem etkisi yaratmak", "Sessizce kitap okumak", "Fısıltıyla gıybet yapmak", "Kütüphaneciden azar yemek"], cevap: 0 },
        { soru: "Yazılı kağıdına adını soyadını yazmayı unuttun!", secenekler: ["Kağıtlar toplanırken koşup hocanın masasında gizlice yazmak", "Hocanın ilan etmesini beklemek", "Önemsemediğin için 0 almak", "Başkasının adına sahip çıkmak"], cevap: 0 },
        { soru: "Hoca 'Tahtayı kim siler?' diye sordu!", secenekler: ["Dersten 3 dakika kazanmak için hemen parmak kaldırmak", "Gözlerini kaçırmak", "Tahta silgisini saklamak", "Yanındakini zorla kaldırmak"], cevap: 0 },
        { soru: "Bahçede kartopu oynarken attığın kartopu müdürün kafasına geldi!", secenekler: ["Anında yere yatıp kar meleği yapıyormuş gibi davranmak", "Arkadaşını gösterip 'O attı hocam' demek", "Okuldan kaçmak", "Müdürün yanına gidip özür dilemek"], cevap: 0 },
        { soru: "Görsel sanatlar dersinde resim çizecek boyan kalmadı!", secenekler: ["Arkadaşının boyalarından çaktırmadan 'ödünç' alıp geri vermemek", "Siyah kalemle karalama yapmak", "Hocaya 'Resim benim ruhumda' demek", "Resim yapmamak"], cevap: 0 },
        { soru: "Sınıfın kaloriferi bozuldu ve sınıf buz gibi!", secenekler: ["Montu ve kapüşonu çekip eskimo gibi oturmak", "Sınıfta koşarak ısınmaya çalışmak", "Müdüre dilekçe yazmak", "Teneffüste bahçede güneşlenmek"], cevap: 0 },
        { soru: "Müzik dersinde flütle çalman gereken şarkıyı unuttun!", secenekler: ["Üfler gibi yapıp arkadaki arkadaşının sesine senkronize olmak", "Flütün içine tükürük kaçtı numarası yapmak", "Yanlış notalar basıp özgün beste yaptım demek", "Flütü evde unuttum demek"], cevap: 0 },
        { soru: "Teneffüs bitti ama sen daha tostunu yarılayamadın!", secenekler: ["Tostu cebe atıp derste sıranın altında gizlice yemek", "Kapıda tek hamlede tostu ağzına tıkmak", "Tostu çöpe atmak", "Hocaya ikram edip derse girmek"], cevap: 0 },
        { soru: "Hoca 'Sorusu olan var mı?' dedi ve zil çalmak üzere!", secenekler: ["Biri soru sorup dersi uzatmasın diye sınıfa ölümcül bakış atmak", "Soru sorup dersi 10 dakika uzatmak", "Çantayı toplayıp ayağa kalkmak", "Derhal dışarı fırlamak"], cevap: 0 },
        { soru: "İngilizce dersinde hoca sana zor bir soru sordu ama anlamadın!", secenekler: ["'Yes, I agree teacher' deyip geçiştirmek", "Türkçe cevap vermek", "'I don't know' deyip oturmak", "Arkadaşına bakıp yardım istemek"], cevap: 0 },
        { soru: "Tuvalette peçete kalmadığını son anda fark ettin!", secenekler: ["Yan kabinden 'Kardeşim peçeten var mı?' diye bağırmak", "Çantadaki test kağıdını kullanmak", "Sessizce kaderine razı olmak", "Kapıyı açıp yardım aramak"], cevap: 0 },
        { soru: "Sınıf başkanı gürültü yapanların adını tahtaya yazıyor!", secenekler: ["Başkana kantinden çikolata ısmarla deyip adını sildirmek", "Tahta silgisini saklamak", "Başkanın adını tahtaya yazmak", "Sessizce oturmak"], cevap: 0 },
        { soru: "Din dersinde hoca ezbere dua okutacak ve sıra sana geliyor!", secenekler: ["Sıra sana gelene kadar içinden 100 kere duayı hızlıca tekrar etmek", "Tuvalete gitmek için izin istemek", "Okuyormuş gibi yapıp mırıldanmak", "Hocam unuttum demek"], cevap: 0 },
        { soru: "Sınıfa dev bir arı girdi ve pencereler kapalı!", secenekler: ["Tüm sınıf defterlerle arıyı kovalayıp dersi kaynatmak", "Sıranın altına saklanmak", "Pencereyi açıp arıya yol göstermek", "Sınıftan dışarı kaçmak"], cevap: 0 },
        { soru: "Okul servisinde en arka 5'li koltuk kapışması başladı!", secenekler: ["Servise ilk binip çantanı arka koltuğa fırlatmak", "En önde şoförün yanında oturmak", "Servisi kaçırmak", "Ayakta kalmak"], cevap: 0 },
        { soru: "Hoca 'Yazılı sonuçlarını okuyorum' dedi!", secenekler: ["İçinden bildiğin tüm duaları okuyup gözlerini kapatmak", "Sonuçları dinlemeyip kulaklarını kapatmak", "Hocaya 'Hatalı okudunuz' demek", "Sıranın altına girmek"], cevap: 0 },
        { soru: "Ders bitti ama nöbetçi öğrenci sınıfı süpürmeni istiyor!", secenekler: ["'Benim acil kursum var kanka' deyip arkana bakmadan kaçmak", "Süpürgeyi alıp sınıfı temizlemek", "Süpürgeyi kırıp kaçmak", "Nöbetçiye çikolata vermek"], cevap: 0 },
        { soru: "Arkadaşın sırtına 'Beni Ye' yazılı kağıt yapıştırmış!", secenekler: ["Fark edince kağıdı çıkarıp çaktırmadan onun sırtına yapıştırmak", "Tüm gün kağıtla gezmek", "Kağıdı yırtıp çöpe atmak", "Arkadaşına kışkırtıcı bakış atmak"], cevap: 0 },
        { soru: "Okul meclis başkanlığı seçimleri başladı!", secenekler: ["'Okula serbest kıyafet getireceğim' deyip tutamayacağın vaatler vermek", "Kantin fiyatlarını düşüreceğim demek", "Aday olmamak", "Arkadaşına oy toplamak"], cevap: 0 },
        { soru: "Hoca masada uyuklamaya başladı!", secenekler: ["Sınıfça çıt çıkarmayıp dersin bitmesini beklemek", "Masaya vurup hocayı uyandırmak", "Sınıftan gizlice çıkmak", "Hocanın fotoğrafını çekmek"], cevap: 0 },
        { soru: "Beden eğitimi öğretmeninin düdüğünü çaldın ve yakalandın!", secenekler: ["'Hocam düdük kendiliğinden öttü vallahi' demek", "Özür dileyip 10 tur tur koşmak", "Düdüğü yere atıp kaçmak", "Düdüğü arkadaşına vermek"], cevap: 0 },
        { soru: "Okulun son günü karneler dağıtılıyor!", secenekler: ["Belgeyi çantaya atıp 'Tatil başladı!' diye çığlık atarak kaçmak", "Okul bahçesinde arkadaşlarınla vedalaşmak", "Karneye bakmadan eve gitmek", "Hocalarla helalleşmek"], cevap: 0 }
    ];
}

function soruHazirla(q) {
    let secenekler = [...q.secenekler];
    let dogruMetin = secenekler[q.cevap];
    secenekler = arrayShuffle(secenekler);
    let yeniCevap = secenekler.indexOf(dogruMetin);
    return {
        soru: q.soru,
        secenekler: secenekler,
        cevap: yeniCevap
    };
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
    veriYukle();
    lobiGuncelle();
};

function sayfaDegis(hedefId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const hedef = document.getElementById(hedefId);
    if (hedef) hedef.classList.add('active');
    if (hedefId === 'shopScreen') lobiGuncelle();
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
    if (!tbody) return;
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
    playBuySound();
    const modeSelect = document.getElementById('mode-select');
    gameState.zorluk = modeSelect ? modeSelect.value : 'normal';
    
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

    let rawPool = soruBankasiOlustur();
    let karistirilmis = arrayShuffle(rawPool).slice(0, gameState.toplamSoruSayisi);
    gameState.aktifSorular = karistirilmis.map(q => soruHazirla(q));

    sayfaDegis('quizScreen');
    senaryoGoster();
}

function senaryoGoster() {
    document.getElementById('scenarioBox').style.display = 'block';
    document.getElementById('quizContentBox').style.display = 'none';
    setTimeout(() => sorulariAc(), 1500);
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
    document.getElementById('questionNum').innerText = `Senaryo ${gameState.currentIndex + 1} / ${gameState.aktifSorular.length}`;
    document.getElementById('questionText').innerText = q.soru;

    let optList = document.getElementById('optionsList');
    optList.innerHTML = '';

    q.secenekler.forEach((optText, index) => {
        let btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = optText;
        btn.onclick = () => secenekSec(index, btn);
        optList.appendChild(btn);
    });
}

function secenekSec(secilenIndex, btn) {
    if (gameState.answered) return;
    gameState.answered = true;
    let q = gameState.aktifSorular[gameState.currentIndex];
    let allBtns = document.querySelectorAll('.option-btn');

    let puanKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;
    let altinKatsayi = (playerProfile.aktifKarakterId === "4") ? 2 : 1;

    if (secilenIndex === q.cevap) {
        btn.classList.add('correct');
        gameState.puan += 20 * puanKatsayi;
        gameState.kazanilanAltin += 15 * altinKatsayi;
        if (Math.random() < 0.3) gameState.kazanilanElmas += 1;
    } else {
        btn.classList.add('wrong');
        if (allBtns[q.cevap]) {
            allBtns[q.cevap].classList.add('correct');
        }
        gameState.can -= 1;
    }
    updateUI();

    if (gameState.can <= 0) {
        setTimeout(() => oyunBitir(false), 1000);
    } else if (gameState.currentIndex < gameState.aktifSorular.length - 1) {
        document.getElementById('nextBtn').style.display = 'block';
    } else {
        setTimeout(() => oyunBitir(true), 1000);
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
        document.getElementById('endTitle').innerText = "🏫 Zil Çaldı, Günü Kurtardın! 🎉";
        document.getElementById('endMessage').innerHTML = `Tebrikler!<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
    } else {
        document.getElementById('endTitle').innerText = "😵 Disipline Sevk Edildin!";
        document.getElementById('endMessage').innerHTML = `Canın tükendi.<br>🪙 +${gameState.kazanilanAltin} Altın<br>💎 +${gameState.kazanilanElmas} Elmas`;
    }
}

function anaMenuyeDon() {
    sayfaDegis('startScreen');
    lobiGuncelle();
}
