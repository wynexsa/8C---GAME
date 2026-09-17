<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>8C GAME - Okul Simülasyonu</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; text-align: center; margin: 0; padding: 20px; }
        .screen { display: none; max-width: 600px; margin: 0 auto; background: #1e293b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .screen.active { display: block; }
        .profile-bar { display: flex; justify-content: space-around; background: #334155; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-size: 14px; }
        .main-btn { background: #22c55e; color: white; border: none; padding: 12px 20px; font-size: 16px; border-radius: 8px; cursor: pointer; margin: 10px 0; width: 100%; font-weight: bold; }
        .main-btn:hover { background: #16a34a; }
        .support-btn { background: #3b82f6; color: white; border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; margin: 5px 0; width: 100%; }
        .support-btn:hover { background: #2563eb; }
        .shop-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .shop-card { background: #334155; padding: 10px; border-radius: 8px; cursor: pointer; border: 2px solid transparent; }
        .shop-card.aktif { border-color: #22c55e; }
        .options-grid { display: flex; flex-direction: column; gap: 10px; margin-top: 15px; }
        .option-btn { background: #475569; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-size: 15px; text-align: left; }
        .option-btn:hover { background: #64748b; }
        .option-btn.correct { background: #22c55e !important; }
        .option-btn.wrong { background: #ef4444 !important; }
        .game-header { display: flex; justify-content: space-between; background: #334155; padding: 10px 15px; border-radius: 8px; margin-bottom: 15px; font-weight: bold; }
        .card { background: #334155; padding: 15px; border-radius: 8px; margin-top: 10px; text-align: left; }
        .tier-section { background: #334155; padding: 10px; border-radius: 8px; margin-top: 15px; text-align: left; }
    </style>
</head>
<body>

    <!-- Ana Menü / Lobi -->
    <div id="startScreen" class="screen active">
        <h1>🏫 8C Sınıfı Simülasyonu</h1>
        
        <div class="profile-bar">
            <span>👤 <b id="oyuncuIsimGosterge">Öğrenci</b></span>
            <span>🪙 <b id="menuPara">100</b></span>
            <span>💎 <b id="menuElmas">10</b></span>
            <span>⭐ Seviye: <b id="menuSeviye">1</b> (<span id="menuXp">0</span> XP)</span>
        </div>

        <div style="margin: 15px 0; text-align: left;">
            <label for="mode-select"><b>Zorluk Seç:</b></label>
            <select id="mode-select" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 6px; background: #334155; color: white; border: 1px solid #475569;">
                <option value="normal">Normal</option>
                <option value="zor">Zor (Akıl Sağlığı Dahil)</option>
            </select>
        </div>

        <div style="margin: 10px 0; text-align: left;">
            <label style="cursor: pointer;">
                <input type="checkbox" id="skipScenarioCheck"> Senaryoyu Geç (💎 10 Elmas)
            </label>
        </div>

        <button class="main-btn" onclick="startGame()">🚀 Oyuna Başla</button>
        <button class="support-btn" onclick="openSupport()">📧 Destek ve Öneri (qiwee617@gmail.com)</button>

        <div class="shop-section">
            <h3>🛍️ Karakter Mağazası</h3>
            <div id="characterShopList" class="shop-grid"></div>
        </div>

        <div class="shop-section" style="margin-top: 15px;">
            <h3>⚡ Boost Ürünleri</h3>
            <button class="support-btn" onclick="buyBoost('boost_1s', 'altin')">1 Saatlik Boost (100 Altın)</button>
            <button class="support-btn" onclick="buyBoost('boost_1s', 'elmas')">1 Saatlik Boost (2 Elmas)</button>
        </div>

        <div id="tierListContainer" class="tier-section"></div>
    </div>

    <!-- Oyun Ekranı -->
    <div id="quizScreen" class="screen">
        <div class="game-header">
            <span>Can: ❤️ <span id="livesCount">3</span></span>
            <span id="akil-sagligi-container" style="display:none;">Akıl: 🧠 <span id="akilCount">100</span></span>
            <span>Puan: ⭐ <span id="scoreCount">0</span></span>
        </div>

        <div id="scenarioBox" class="card">
            <h3>📖 Senaryo Akışı</h3>
            <p>Zil çaldı, ders başladı. Öğretmen tahtaya kalkmanı istiyor...</p>
        </div>

        <div id="quizContentBox" class="card" style="display: none;">
            <h3 id="questionNum">Soru 1 / 5</h3>
            <p id="questionText">Soru yükleniyor...</p>
            <div id="optionsList" class="options-grid"></div>
            <button id="nextBtn" class="main-btn" style="display: none; margin-top: 15px;" onclick="nextQuestion()">Sonraki Soru</button>
        </div>
    </div>

    <!-- Oyun Bitiş Ekranı -->
    <div id="gameOverScreen" class="screen">
        <h2 id="endTitle">Oyun Bitti</h2>
        <p id="endMessage">Sonuçlar yükleniyor...</p>
        <p>Toplam Puanın: <span id="finalScore">0</span></p>
        <button class="main-btn" onclick="restartGame()">Ana Menüye Dön</button>
    </div>

    <script src="script.js"></script>
</body>
</html>
