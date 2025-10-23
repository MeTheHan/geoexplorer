import pygame
import sys
import random
import math
import time
import os
from pygame.locals import *

# Pygame başlatma
pygame.init()
pygame.font.init()

# Ekran ayarları
WIDTH, HEIGHT = 1200, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.RESIZABLE)
pygame.display.set_caption("🌍 GeoQuest 2025")

# Modern renk paleti
COLORS = {
    "background": (248, 250, 252),
    "surface": (255, 255, 255),
    "primary": (99, 102, 241),
    "primary_light": (199, 210, 254),
    "secondary": (236, 72, 153),
    "accent": (14, 165, 233),
    "success": (34, 197, 94),
    "warning": (234, 179, 8),
    "error": (239, 68, 68),
    "text_primary": (15, 23, 42),
    "text_secondary": (100, 116, 139),
    "text_light": (148, 163, 184),
    "border": (226, 232, 240),
    "shadow": (100, 116, 139, 50)
}

# Fontlar
class Fonts:
    def __init__(self):
        self.title = pygame.font.SysFont("Arial", 48, bold=True)
        self.heading = pygame.font.SysFont("Arial", 32, bold=True)
        self.subheading = pygame.font.SysFont("Arial", 24, bold=True)
        self.body_large = pygame.font.SysFont("Arial", 20)
        self.body = pygame.font.SysFont("Arial", 16)
        self.small = pygame.font.SysFont("Arial", 14)

fonts = Fonts()

# Dil seçenekleri
languages = {
    "English": {
        "menu": "Explorer Hub", "settings": "Preferences", "start_game": "Begin Quest",
        "choose_continent": "Select Regions", "timer": "Time Challenge", "language": "Language",
        "score": "Explorer Score", "time_left": "Mission Time", "find_country": "Locate: {}",
        "game_over": "Expedition Complete", "play_again": "New Journey", "high_score": "Legendary Score",
        "total_found": "Territories Discovered", "accuracy": "Precision Rate", "back": "Return to Base"
    },
    "Türkçe": {
        "menu": "Kaşif Merkezi", "settings": "Tercihler", "start_game": "Keşfe Başla",
        "choose_continent": "Bölge Seçimi", "timer": "Zaman Mücadelesi", "language": "Dil",
        "score": "Kaşif Puanı", "time_left": "Görev Süresi", "find_country": "Konum Bul: {}",
        "game_over": "Keşif Tamamlandı", "play_again": "Yeni Macera", "high_score": "Efsanevi Skor",
        "total_found": "Keşfedilen Topraklar", "accuracy": "Doğruluk Oranı", "back": "Üsse Dön"
    }
}

# Kıtalar ve ülkeler
continents = {
    "All": ["Turkey", "Germany", "France", "USA", "Brazil", "Japan", "Australia", "Egypt", "Canada", "Italy"],
    "Europe": ["Turkey", "Germany", "France", "Italy", "Spain", "UK"],
    "Asia": ["Japan", "China", "India", "Russia", "South Korea"],
    "Africa": ["Egypt", "South Africa", "Nigeria", "Kenya"],
    "North America": ["USA", "Canada", "Mexico"],
    "South America": ["Brazil", "Argentina", "Chile"]
}

class ModernButton:
    def __init__(self, x, y, width, height, text, icon="", color=COLORS["primary"]):
        self.rect = pygame.Rect(x, y, width, height)
        self.text = text
        self.icon = icon
        self.color = color
        self.is_hovered = False
        
    def draw(self, surface):
        color = COLORS["accent"] if self.is_hovered else self.color
        pygame.draw.rect(surface, color, self.rect, border_radius=12)
        
        if self.icon:
            icon_font = pygame.font.SysFont("Segoe UI Emoji", 20)
            icon_surf = icon_font.render(self.icon, True, COLORS["surface"])
            icon_rect = icon_surf.get_rect(midleft=(self.rect.left + 15, self.rect.centery))
            surface.blit(icon_surf, icon_rect)
            
        text_surf = fonts.body.render(self.text, True, COLORS["surface"])
        text_rect = text_surf.get_rect(center=self.rect.center)
        if self.icon:
            text_rect.x += 10
        surface.blit(text_surf, text_rect)
        
    def is_clicked(self, pos):
        return self.rect.collidepoint(pos)
        
    def update_hover(self, pos):
        self.is_hovered = self.rect.collidepoint(pos)

class Card:
    def __init__(self, x, y, width, height):
        self.rect = pygame.Rect(x, y, width, height)
        
    def draw(self, surface):
        pygame.draw.rect(surface, COLORS["surface"], self.rect, border_radius=16)
        pygame.draw.rect(surface, COLORS["border"], self.rect, 2, border_radius=16)

class GameState:
    def __init__(self):
        self.current_screen = "menu"
        self.language = "English"
        self.selected_continents = ["All"]
        self.timer_enabled = True
        self.game_time = 120
        self.score = 0
        self.high_score = 0
        self.current_country = None
        self.time_left = 0
        self.game_started = False
        self.total_found = 0
        self.total_attempts = 0

game_state = GameState()

def draw_background_elements():
    for i in range(5):
        x = random.randint(0, WIDTH)
        y = random.randint(0, HEIGHT)
        size = random.randint(2, 6)
        alpha = random.randint(10, 30)
        color = (*random.choice([COLORS["primary_light"], COLORS["accent"]]), alpha)
        pygame.draw.circle(screen, color, (x, y), size)

def draw_menu():
    screen.fill(COLORS["background"])
    draw_background_elements()
    
    main_card = Card(WIDTH//2 - 200, HEIGHT//2 - 250, 400, 500)
    main_card.draw(screen)
    
    title_text = fonts.title.render("🌍 GeoQuest 2025", True, COLORS["text_primary"])
    screen.blit(title_text, (WIDTH//2 - title_text.get_width()//2, HEIGHT//2 - 220))
    
    buttons = []
    start_button = ModernButton(WIDTH//2 - 150, HEIGHT//2 - 100, 300, 60, 
                               languages[game_state.language]["start_game"], "🚀")
    settings_button = ModernButton(WIDTH//2 - 150, HEIGHT//2 - 20, 300, 60, 
                                  languages[game_state.language]["settings"], "⚙️")
    
    start_button.draw(screen)
    settings_button.draw(screen)
    buttons.extend([start_button, settings_button])
    
    return buttons

def draw_settings():
    screen.fill(COLORS["background"])
    draw_background_elements()
    
    main_card = Card(WIDTH//2 - 250, 100, 500, HEIGHT - 200)
    main_card.draw(screen)
    
    title = fonts.heading.render(languages[game_state.language]["settings"], True, COLORS["text_primary"])
    screen.blit(title, (WIDTH//2 - title.get_width()//2, 130))
    
    buttons = []
    
    # Dil butonu
    lang_button = ModernButton(WIDTH//2 - 100, 200, 200, 50, 
                              f"Language: {game_state.language}", "🌐")
    buttons.append(lang_button)
    
    # Geri butonu
    back_button = ModernButton(WIDTH//2 - 100, HEIGHT - 150, 200, 50, 
                              languages[game_state.language]["back"], "←")
    buttons.append(back_button)
    
    for button in buttons:
        button.draw(screen)
        
    return buttons

def draw_game():
    screen.fill(COLORS["background"])
    
    # Harita alanı
    map_card = Card(50, 50, WIDTH - 400, HEIGHT - 100)
    map_card.draw(screen)
    
    # Basit harita
    map_rect = pygame.Rect(70, 70, WIDTH - 440, HEIGHT - 140)
    pygame.draw.rect(screen, COLORS["accent"], map_rect, border_radius=12)
    
    # Bilgi paneli
    info_card = Card(WIDTH - 320, 50, 270, HEIGHT - 100
