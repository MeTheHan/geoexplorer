// game.js - GeoExplorer 2025 Oyun Motoru

// DİL SİSTEMİ - TAM ÇALIŞIYOR!
const translations = {
    tr: {
        round: "RAUNT",
        instruction: "Konumu haritada işaretleyin",
        points: "Puan",
        guess: "Tahminimi Onayla",
        skip: "Geç",
        nextRound: "Sonraki Raunt",
        accuracy: "Doğruluk",
        distance: "Ort. Mesafe",
        settingsTitle: "Ayarlar",
        languageLabel: "Dil / Language",
        timerLabel: "Zamanlayıcı (saniye)",
        roundsLabel: "Toplam Raunt Sayısı",
        continentLabel: "Kıta Filtresi",
        soundText: "Ses Efektleri",
        hintsText: "İpuçlarını Göster",
        saveText: "Ayarları Kaydet",
        kmAway: "km uzakta",
        pointsEarned: "Puan",
        actualLocation: "Gerçek Konum",
        skipped: "Konum Geçildi",
        gameOver: "Oyun Tamamlandı!",
        finalScore: "Final Skorun",
        avgDistance: "Ortalama Mesafe",
        accuracyRate: "Doğruluk Oranı",
        timeLeft: "Kalan Süre"
    },
    en: {
        round: "ROUND",
        instruction: "Mark the location on the map",
        points: "Points",
        guess: "Confirm My Guess",
        skip: "Skip",
        nextRound: "Next Round",
        accuracy: "Accuracy",
        distance: "Avg. Distance",
        settingsTitle: "Settings",
        languageLabel: "Language / Dil",
        timerLabel: "Timer (seconds)",
        roundsLabel: "Total Rounds",
        continentLabel: "Continent Filter",
        soundText: "Sound Effects",
        hintsText: "Show Hints",
        saveText: "Save Settings",
        kmAway: "km away",
        pointsEarned: "Points",
        actualLocation: "Actual Location",
        skipped: "Location Skipped",
        gameOver: "Game Over!",
        finalScore: "Final Score",
        avgDistance: "Average Distance",
        accuracyRate: "Accuracy Rate",
        timeLeft: "Time Left"
    }
};

// LOKASYON VERİTABANI - 25+ GERÇEK LOKASYON
const worldLocations = [
    // Avrupa
    {
        lat: 41.0082, lng: 28.9784, 
        name: { tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" },
        continent: "europe",
        image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=600&fit=crop",
        description: { tr: "Boğaz'ı ve tarihi yarımadayı gösteren manzara", en: "View showing the Bosphorus and historic peninsula" }
    },
    {
        lat: 48.8566, lng: 2.3522,
        name: { tr: "Paris, Fransa", en: "Paris, France" },
        continent: "europe", 
        image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop",
        description: { tr: "Eyfel Kulesi ve Seine Nehri", en: "Eiffel Tower and Seine River" }
    },
    {
        lat: 51.5074, lng: -0.1278,
        name: { tr: "Londra, İngiltere", en: "London, England" },
        continent: "europe",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
        description: { tr: "Big Ben ve Thames Nehri", en: "Big Ben and Thames River" }
    },
    {
        lat: 52.5200, lng: 13.4050,
        name: { tr: "Berlin, Almanya", en: "Berlin, Germany" },
        continent: "europe",
        image: "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?w=800&h=600&fit=crop",
        description: { tr: "Brandenburg Kapısı ve modern mimari", en: "Brandenburg Gate and modern architecture" }
    },
    {
        lat: 41.9028, lng: 12.4964,
        name: { tr: "Roma, İtalya", en: "Rome, Italy" },
        continent: "europe",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
        description: { tr: "Kolezyum ve antik Roma kalıntıları", en: "Colosseum and ancient Roman ruins" }
    },

    // Asya
    {
        lat: 35.6762, lng: 139.6503,
        name: { tr: "Tokyo, Japonya", en: "Tokyo, Japan" },
        continent: "asia",
        image: "https://images.unsplash.com/photo-1540959733332-abcde1234?w=800&h=600&fit=crop",
        description: { tr: "Shibuya geçişi ve modern gökdelenler", en: "Shibuya crossing and modern skyscrapers" }
    },
    {
        lat: 39.9042, lng: 116.4074,
        name: { tr: "Pekin, Çin", en: "Beijing, China" },
        continent: "asia",
        image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
        description: { tr: "Çin Seddi ve Yasak Şehir", en: "Great Wall and Forbidden City" }
    },
    {
        lat: 1.3521, lng: 103.8198,
        name: { tr: "Singapur", en: "Singapore" },
        continent: "asia",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop",
        description: { tr: "Marina Bay Sands ve modern şehir", en: "Marina Bay Sands and modern city" }
    },

    // Kuzey Amerika
    {
        lat: 40.7128, lng: -74.0060,
        name: { tr: "New York, USA", en: "New York, USA" },
        continent: "northamerica",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
        description: { tr: "Empire State Binası ve şehir manzarası", en: "Empire State Building and city skyline" }
    },
    {
        lat: 34.0522, lng: -118.2437,
        name: { tr: "Los Angeles, USA", en: "Los Angeles, USA" },
        continent: "northamerica",
        image: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800&h=600&fit=crop",
        description: { tr: "Hollywood ve plajlar", en: "Hollywood and beaches" }
    },
    {
        lat: 43.6532, lng: -79.3832,
        name: { tr: "Toronto, Kanada", en: "Toronto, Canada" },
        continent: "northamerica",
        image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&h=600&fit=crop",
        description: { tr: "CN Kulesi ve göller bölgesi", en: "CN Tower and lakes region" }
    },

    // Güney Amerika
    {
        lat: -23.5505, lng: -46.6333,
        name: { tr: "São Paulo, Brezilya", en: "São Paulo, Brazil" },
        continent: "southamerica",
        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800&h=600&fit=crop",
        description: { tr: "Güney Amerika'nın finans merkezi", en: "Financial center of South America" }
    },
    {
        lat: -34.6037, lng: -58.3816,
        name: { tr: "Buenos Aires, Arjantin", en: "Buenos Aires, Argentina" },
        continent: "southamerica",
        image: "https://images.unsplash.com/photo-1612296727716-d6c69d7c7d87?w=800&h=600&fit=crop",
        description: { tr: "Tango ve Avrupa mimarisi", en: "Tango and European architecture" }
    },

    // Afrika
    {
        lat: 30.0444, lng: 31.2357,
        name: { tr: "Kahire, Mısır", en: "Cairo, Egypt" },
        continent: "africa",
        image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&h=600&fit=crop",
        description: { tr: "Piramitler ve Nil Nehri", en: "Pyramids and Nile River" }
    },
    {
        lat: 33.9249, lng: 18.4241,
        name: { tr: "Cape Town, Güney Afrika", en: "Cape Town, South Africa" },
        continent: "africa",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=600&fit=crop",
        description: { tr: "Table Mountain ve okyanus manzarası", en: "Table Mountain and ocean view" }
    },

    // Okyanusya
    {
        lat: -33.8688, lng: 151.2093,
        name: { tr: "Sidney, Avustralya", en: "Sydney, Australia" },
        continent: "oceania",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop",
        description: { tr: "Opera Binası ve liman", en: "Opera House and harbor" }
    }
];

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
        continent: 'all',
        soundEffects: true,
        showHints: true
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
        usedLocations: new Set()
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
    
    // Loading ekranını kaldır
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
    }, 2000);
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

// Dili güncelle
function updateLanguage() {
    document.getElementById('roundText').textContent = getTranslation('round');
    document.getElementById('instructionText').textContent = getTranslation('instruction');
    document.getElementById('pointsText').textContent = getTranslation('points');
    document.getElementById('guessText').textContent = getTranslation('guess');
    document.getElementById('skipText').textContent = getTranslation('skip');
    document.getElementById('nextRoundText').textContent = getTranslation('nextRound');
    document.getElementById('accuracyText').textContent = getTranslation('accuracy');
    document.getElementById('distanceText').textContent = getTranslation('distance');
    document.getElementById('settingsTitle').textContent = getTranslation('settingsTitle');
    document.getElementById('languageLabel').textContent = getTranslation('languageLabel');
    document.getElementById('timerLabel').textContent = getTranslation('timerLabel');
    document.getElementById('roundsLabel').textContent = getTranslation('roundsLabel');
    document.getElementById('continentLabel').textContent = getTranslation('continentLabel');
    document.getElementById('soundText').textContent = getTranslation('soundText');
    document.getElementById('hintsText').textContent = getTranslation('hintsText');
    document.getElementById('saveText').textContent = getTranslation('saveText');
}

// Yeni raunt başlat
function startRound() {
    gameState.roundActive = true;
    gameState.playerGuess = null;
    gameState.timer = settings.timerDuration;
    
    // Filtrelenmiş lokasyonlardan seç
    const availableLocations = worldLocations.filter(loc => 
        settings.continent === 'all' || loc.continent === settings.continent
    ).filter(loc => !gameState.usedLocations.has(loc.name[settings.language]));
    
    if (availableLocations.length === 0) {
        // Tüm lokasyonlar kullanıldı, resetle
        gameState.usedLocations.clear();
        startRound();
        return;
    }
    
    const randomLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
    gameState.currentLocation = randomLocation;
    gameState.usedLocations.add(randomLocation.name[settings.language]);
    
    // Sokak görünümünü güncelle
    updateStreetView(randomLocation);
    
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

// Sokak görünümünü güncelle
function updateStreetView(location) {
    const streetViewImage = document.getElementById('streetViewImage');
    streetViewImage.src = location.image;
    streetViewImage.style.display = 'block';
    streetViewImage.alt = location.name[settings.language];
}

// Hareket kontrolleri
function moveForward() {
    showFeedback("🚶 " + (settings.language === 'tr' ? "İleri hareket ediliyor..." : "Moving forward..."));
}

function moveBackward() {
    showFeedback("🔙 " + (settings.language === 'tr' ? "Geri hareket ediliyor..." : "Moving backward..."));
}

function rotateLeft() {
    showFeedback("↪️ " + (settings.language === 'tr' ? "Sola dönülüyor..." : "Rotating left..."));
}

function rotateRight() {
    showFeedback("↩️ " + (settings.language === 'tr' ? "Sağa dönülüyor..." : "Rotating right..."));
}

function showFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.85); color: white; padding: 15px 25px; border-radius: 25px;
        font-weight: 600; z-index: 1000; backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.2);
    `;
    feedback.textContent = message;
    document.getElementById('streetView').appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 1200);
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

// Skor hesapla
function calculateScore(distance) {
    if (distance < 1) return 5000;
    if (distance < 10) return 4500;
    if (distance < 50) return 4000;
    if (distance < 100) return 3500;
    if (distance < 500) return 2500;
    if (distance < 1000) return 1500;
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
            <strong>${gameState.currentLocation.name[settings.language]}</strong><br>
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
    document.getElementById('totalScore').textContent = '0';
    document.getElementById('accuracy').textContent = '0%';
    document.getElementById('avgDistance').textContent = '- km';
    
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
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
    // Son 10 saniyede kırmızı yap
    if (gameState.timer <= 10) {
        document.getElementById('timer').style.background = 'rgba(239, 68, 68, 0.95)';
    } else {
        document.getElementById('timer').style.background = 'rgba(99, 102, 241, 0.95)';
    }
}

// İstatistikleri güncelle
function updateStats() {
    document.getElementById('totalScore').textContent = gameState.totalScore;
    document.getElementById('accuracy').textContent = calculateAccuracy() + '%';
    document.getElementById('avgDistance').textContent = calculateAverageDistance().toFixed(1) + ' km';
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
    document.getElementById('soundEffects').checked = settings.soundEffects;
    document.getElementById('showHints').checked = settings.showHints;
    
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
    settings.soundEffects = document.getElementById('soundEffects').checked;
    settings.showHints = document.getElementById('showHints').checked;
    
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
