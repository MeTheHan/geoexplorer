// game.js - Sade ve Temiz Coğrafya Oyunu

// DİL SİSTEMİ - TAM ÇEVİRİ
const translations = {
    tr: {
        // Arayüz
        subtitle: "Dünya Coğrafyasını Keşfet!",
        round: "Raunt",
        points: "Puan",
        guess: "Tahminimi Onayla",
        skip: "Geç",
        nextRound: "Sonraki Raunt",
        accuracy: "Doğruluk",
        distance: "Ort. Mesafe",
        found: "Bulunan",
        coordinates: "Koordinatlar:",
        continent: "Kıta:",
        
        // Ayarlar
        settingsTitle: "Ayarlar",
        languageLabel: "Dil",
        timerLabel: "Zamanlayıcı (saniye)",
        roundsLabel: "Toplam Raunt Sayısı",
        continentLabel: "Kıta Filtresi",
        saveText: "Ayarları Kaydet",
        
        // Oyun
        kmAway: "km uzakta",
        pointsEarned: "Puan",
        actualLocation: "Gerçek Konum",
        skipped: "Konum Geçildi",
        gameOver: "Oyun Tamamlandı!",
        finalScore: "Final Skorun",
        avgDistance: "Ortalama Mesafe",
        accuracyRate: "Doğruluk Oranı",
        timeLeft: "Kalan Süre",
        
        // Kıtalar
        europe: "Avrupa",
        asia: "Asya",
        africa: "Afrika",
        northamerica: "Kuzey Amerika", 
        southamerica: "Güney Amerika",
        oceania: "Okyanusya",
        all: "Tüm Dünya"
    },
    en: {
        // Interface
        subtitle: "Explore World Geography!",
        round: "Round",
        points: "Points",
        guess: "Confirm My Guess",
        skip: "Skip",
        nextRound: "Next Round",
        accuracy: "Accuracy",
        distance: "Avg. Distance",
        found: "Found",
        coordinates: "Coordinates:",
        continent: "Continent:",
        
        // Settings
        settingsTitle: "Settings",
        languageLabel: "Language",
        timerLabel: "Timer (seconds)",
        roundsLabel: "Total Rounds",
        continentLabel: "Continent Filter",
        saveText: "Save Settings",
        
        // Game
        kmAway: "km away",
        pointsEarned: "Points",
        actualLocation: "Actual Location",
        skipped: "Location Skipped",
        gameOver: "Game Over!",
        finalScore: "Final Score",
        avgDistance: "Average Distance",
        accuracyRate: "Accuracy Rate",
        timeLeft: "Time Left",
        
        // Continents
        europe: "Europe",
        asia: "Asia",
        africa: "Africa",
        northamerica: "North America",
        southamerica: "South America", 
        oceania: "Oceania",
        all: "All World"
    }
};

// MATEMATİKSEL RASTGELE LOKASYON ÜRETİCİ
function generateRandomLocation(continent = 'all') {
    // Kıta sınırları (lat, lng min/max)
    const continentBounds = {
        europe: { latMin: 35, latMax: 70, lngMin: -10, lngMax: 40 },
        asia: { latMin: 10, latMax: 55, lngMin: 60, lngMax: 150 },
        africa: { latMin: -35, latMax: 37, lngMin: -20, lngMax: 55 },
        northamerica: { latMin: 15, latMax: 70, lngMin: -170, lngMax: -55 },
        southamerica: { latMin: -55, latMax: 15, lngMin: -85, lngMax: -30 },
        oceania: { latMin: -50, latMax: 0, lngMin: 110, lngMax: 180 }
    };
    
    let bounds;
    if (continent === 'all') {
        // Tüm dünyadan rastgele
        const continents = Object.values(continentBounds);
        bounds = continents[Math.floor(Math.random() * continents.length)];
    } else {
        bounds = continentBounds[continent];
    }
    
    // Rastgele koordinat üret
    const lat = bounds.latMin + Math.random() * (bounds.latMax - bounds.latMin);
    const lng = bounds.lngMin + Math.random() * (bounds.lngMax - bounds.lngMin);
    
    // Lokasyon ismini oluştur
    const locationName = {
        tr: `Rastgele Konum (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        en: `Random Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };
    
    return {
        lat: lat,
        lng: lng,
        name: locationName,
        continent: continent === 'all' ? getRandomContinent() : continent,
        description: {
            tr: "Bu konumu haritada bulmaya çalışın",
            en: "Try to find this location on the map"
        }
    };
}

function getRandomContinent() {
    const continents = ['europe', 'asia', 'africa', 'northamerica', 'southamerica', 'oceania'];
    return continents[Math.floor(Math.random() * continents.length)];
}

// LocalStorage'dan ayarları yükle
function loadSettings() {
    const saved = localStorage.getItem('geoExplorerSettings');
    if (saved) {
        return JSON.parse(saved);
    }
    return {
        language: 'tr',
        timerDuration: 120,
        totalRounds: 5,
        continent: 'all'
    };
}

// Ayarları kaydet
function saveSettingsToStorage(settings) {
    localStorage.setItem('geoExplorerSettings', JSON.stringify(settings));
}

// Oyun değişkenleri
let settings = loadSettings();
let map, guessMarker, timerInterval;
let gameState = {};

// Oyun durumunu sıfırla
function resetGameState() {
    gameState = {
        currentRound: 1,
        totalScore: 0,
        currentLocation: null,
        playerGuess: null,
        roundActive: true,
        timer: settings.timerDuration,
        roundScores: [],
        roundDistances: [],
        foundCount: 0
    };
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});

// Oyunu başlat
function initGame() {
    resetGameState();
    initMap();
    updateLanguage();
    startRound();
}

// Haritayı başlat
function initMap() {
    map = L.map('guessMap').setView([20, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Haritaya tıklama olayı
    map.on('click', function(e) {
        if (!gameState.roundActive) return;
        
        if (guessMarker) {
            map.removeLayer(guessMarker);
        }
        
        guessMarker = L.marker(e.latlng).addTo(map)
            .bindPopup(`📍 ${getTranslation('guess')}: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`)
            .openPopup();
        
        gameState.playerGuess = e.latlng;
        document.getElementById('guessBtn').disabled = false;
    });
}

// Çeviri fonksiyonu
function getTranslation(key) {
    return translations[settings.language][key] || key;
}

// Dili güncelle - TAM ÇEVİRİ
function updateLanguage() {
    // Başlık ve alt başlık
    document.getElementById('subtitle').textContent = getTranslation('subtitle');
    
    // Oyun arayüzü
    document.getElementById('roundText').textContent = getTranslation('round');
    document.getElementById('pointsText').textContent = getTranslation('points');
    document.getElementById('guessText').textContent = getTranslation('guess');
    document.getElementById('skipText').textContent = getTranslation('skip');
    document.getElementById('nextRoundText').textContent = getTranslation('nextRound');
    document.getElementById('accuracyText').textContent = getTranslation('accuracy');
    document.getElementById('distanceText').textContent = getTranslation('distance');
    document.getElementById('foundText').textContent = getTranslation('found');
    document.getElementById('coordinatesText').textContent = getTranslation('coordinates');
    document.getElementById('continentText').textContent = getTranslation('continent');
    
    // Ayarlar
    document.getElementById('settingsTitle').textContent = getTranslation('settingsTitle');
    document.getElementById('languageLabel').textContent = getTranslation('languageLabel');
    document.getElementById('timerLabel').textContent = getTranslation('timerLabel');
    document.getElementById('roundsLabel').textContent = getTranslation('roundsLabel');
    document.getElementById('continentLabel').textContent = getTranslation('continentLabel');
    document.getElementById('saveText').textContent = getTranslation('saveText');
    
    // Kıta seçeneklerini güncelle
    const continentSelect = document.getElementById('continentSelect');
    continentSelect.innerHTML = `
        <option value="all">${getTranslation('all')}</option>
        <option value="europe">${getTranslation('europe')}</option>
        <option value="asia">${getTranslation('asia')}</option>
        <option value="africa">${getTranslation('africa')}</option>
        <option value="northamerica">${getTranslation('northamerica')}</option>
        <option value="southamerica">${getTranslation('southamerica')}</option>
        <option value="oceania">${getTranslation('oceania')}</option>
    `;
    continentSelect.value = settings.continent;
}

// Yeni raunt başlat
function startRound() {
    gameState.roundActive = true;
    gameState.playerGuess = null;
    gameState.timer = settings.timerDuration;
    
    // MATEMATİKSEL RASTGELE lokasyon üret
    gameState.currentLocation = generateRandomLocation(settings.continent);
    
    // Lokasyon bilgilerini göster
    updateLocationDisplay();
    
    // Haritayı sıfırla
    if (guessMarker) {
        map.removeLayer(guessMarker);
        guessMarker = null;
    }
    map.setView([20, 0], 2);
    
    // UI'ı sıfırla
    document.getElementById('guessBtn').disabled = true;
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'none';
    document.getElementById('guessBtn').style.display = 'flex';
    
    // Timer'ı başlat
    startTimer();
    
    // Round bilgisini güncelle
    document.getElementById('roundNumber').textContent = gameState.currentRound;
    document.getElementById('totalRounds').textContent = settings.totalRounds;
    updateTimerDisplay();
}

// Lokasyon bilgilerini güncelle
function updateLocationDisplay() {
    document.getElementById('locationName').textContent = gameState.currentLocation.name[settings.language];
    document.getElementById('coordinatesValue').textContent = `${gameState.currentLocation.lat.toFixed(4)}, ${gameState.currentLocation.lng.toFixed(4)}`;
    document.getElementById('continentValue').textContent = getTranslation(gameState.currentLocation.continent);
}

// Tahmin yap
function makeGuess() {
    if (!gameState.playerGuess || !gameState.roundActive) return;
    
    gameState.roundActive = false;
    clearInterval(timerInterval);
    
    const distance = calculateDistance(
        gameState.playerGuess.lat, gameState.playerGuess.lng,
        gameState.currentLocation.lat, gameState.currentLocation.lng
    );
    
    const score = calculateScore(distance);
    gameState.totalScore += score;
    gameState.roundScores.push(score);
    gameState.roundDistances.push(distance);
    gameState.foundCount++;
    
    showResults(distance, score);
    updateStats();
}

// Konumu geç
function skipLocation() {
    if (!gameState.roundActive) return;
    gameState.roundActive = false;
    clearInterval(timerInterval);
    
    showResults(0, 0, true);
    updateStats();
}

// Mesafe hesapla (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Dünya yarıçapı km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Skor hesapla - Mesafe azaldıkça puan artar
function calculateScore(distance) {
    if (distance < 10) return 5000;
    if (distance < 50) return 4500;
    if (distance < 100) return 4000;
    if (distance < 500) return 3000;
    if (distance < 1000) return 2000;
    if (distance < 2000) return 1000;
    return 500;
}

// Sonuçları göster
function showResults(distance, score, skipped = false) {
    const resultsContainer = document.getElementById('resultsContainer');
    const distanceScore = document.getElementById('distanceScore');
    const locationDetails = document.getElementById('locationDetails');
    
    if (skipped) {
        distanceScore.innerHTML = `<span style="color: var(--error);">⏭️ ${getTranslation('skipped')}</span>`;
        locationDetails.innerHTML = `
            <strong>${getTranslation('actualLocation')}: ${gameState.currentLocation.name[settings.language]}</strong><br>
            <span style="color: var(--text-secondary);">${gameState.currentLocation.description[settings.language]}</span>
        `;
    } else {
        distanceScore.innerHTML = `
            <span style="color: ${score > 2500 ? 'var(--success)' : score > 1000 ? 'var(--warning)' : 'var(--error)'};">
                ${score} ${getTranslation('pointsEarned')} • ${distance.toFixed(1)} ${getTranslation('kmAway')}
            </span>
        `;
        locationDetails.innerHTML = `
            <strong>${getTranslation('actualLocation')}: ${gameState.currentLocation.name[settings.language]}</strong><br>
            <span style="color: var(--text-secondary);">${gameState.currentLocation.description[settings.language]}</span>
        `;
    }
    
    // Gerçek konumu haritada göster
    L.marker([gameState.currentLocation.lat, gameState.currentLocation.lng], {
        icon: new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map).bindPopup(`🎯 ${getTranslation('actualLocation')}: ${gameState.currentLocation.name[settings.language]}`).openPopup();
    
    resultsContainer.style.display = 'block';
    document.getElementById('guessBtn').style.display = 'none';
    document.getElementById('nextRoundBtn').style.display = 'flex';
}

// Sonraki raunt
function nextRound() {
    gameState.currentRound++;
    
    if (gameState.currentRound > settings.totalRounds) {
        endGame();
    } else {
        startRound();
    }
}

// Oyunu bitir
function endGame() {
    const avgDistance = calculateAverageDistance();
    const accuracy = calculateAccuracy();
    
    alert(`🎉 ${getTranslation('gameOver')}\n\n${getTranslation('finalScore')}: ${gameState.totalScore}\n${getTranslation('avgDistance')}: ${avgDistance.toFixed(1)} km\n${getTranslation('accuracyRate')}: ${accuracy}%`);
    
    resetGameState();
    updateStats();
    startRound();
}

// Zamanlayıcı
function startTimer() {
    updateTimerDisplay();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        gameState.timer--;
        updateTimerDisplay();
        
        if (gameState.timer <= 0) {
            clearInterval(timerInterval);
            if (gameState.roundActive) {
                makeGuess();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
    // Son 10 saniyede kırmızı ve titreme
    if (gameState.timer <= 10) {
        timerElement.style.background = 'rgba(239, 68, 68, 0.95)';
        timerElement.classList.add('timer-warning');
    } else {
        timerElement.style.background = 'rgba(99, 102, 241, 0.95)';
        timerElement.classList.remove('timer-warning');
    }
}

// İstatistikleri güncelle
function updateStats() {
    document.getElementById('totalScore').textContent = gameState.totalScore;
    document.getElementById('accuracy').textContent = calculateAccuracy() + '%';
    document.getElementById('avgDistance').textContent = calculateAverageDistance().toFixed(1) + ' km';
    document.getElementById('foundCount').textContent = gameState.foundCount;
}

function calculateAccuracy() {
    if (gameState.roundScores.length === 0) return 0;
    const avgScore = gameState.roundScores.reduce((a, b) => a + b, 0) / gameState.roundScores.length;
    return Math.round((avgScore / 5000) * 100);
}

function calculateAverageDistance() {
    if (gameState.roundDistances.length === 0) return 0;
    return gameState.roundDistances.reduce((a, b) => a + b, 0) / gameState.roundDistances.length;
}

// AYARLAR FONKSİYONLARI
function openSettings() {
    // Mevcut ayarları forma yükle
    document.getElementById('languageSelect').value = settings.language;
    document.getElementById('timerInput').value = settings.timerDuration;
    document.getElementById('roundsInput').value = settings.totalRounds;
    document.getElementById('continentSelect').value = settings.continent;
    
    document.getElementById('settingsModal').style.display = 'flex';
}

function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const oldLanguage = settings.language;
    
    settings.language = document.getElementById('languageSelect').value;
    settings.timerDuration = parseInt(document.getElementById('timerInput').value);
    settings.totalRounds = parseInt(document.getElementById('roundsInput').value);
    settings.continent = document.getElementById('continentSelect').value;
    
    // LocalStorage'a kaydet
    saveSettingsToStorage(settings);
    
    // Dili güncelle
    if (oldLanguage !== settings.language) {
        updateLanguage();
    }
    
    // Oyunu güncelle
    gameState.timer = settings.timerDuration;
    updateTimerDisplay();
    
    closeSettings();
    alert('✅ ' + (settings.language === 'tr' ? 'Ayarlar kaydedildi!' : 'Settings saved!'));
    
    // Yeni ayarlarla oyunu yeniden başlat
    resetGameState();
    startRound();
}
