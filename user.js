// ==UserScript==
// @name         LoseOnline Blum Toplayıcı
// @version      1.0
// @namespace    Violentmonkey Scripts
// @author       Traique
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://imgur.com/a/IyF61ni
// @downloadURL  https://github.com/loseonline/Bl/raw/main/user.js
// @updateURL    https://github.com/loseonline/Bl/raw/main/user.js
// @homepage     https://github.com/loseonline/Bl
// ==/UserScript==

(function() {
    'use strict';

    let çiçekAtlamaYüzdesi = 50;
    let minBuzVuruşu = 1;
    let minBombaVuruşu = 1;
    let minGecikmeMs = 50;
    let maxGecikmeMs = 150;
    let otomatikOyna = true;
    let bombaVuruşu = 0;
    let buzVuruşu = 0;

    let köpekVuruşu = 0;
    let maxKöpekVuruşu = 5;

    localStorage.getItem("çiçekAtlamaYüzdesi") ? çiçekAtlamaYüzdesi = parseInt(localStorage.getItem("çiçekAtlamaYüzdesi")) : localStorage.setItem("çiçekAtlamaYüzdesi", çiçekAtlamaYüzdesi);
    localStorage.getItem("minBuzVuruşu") ? minBuzVuruşu = parseInt(localStorage.getItem("minBuzVuruşu")) : localStorage.setItem("minBuzVuruşu", minBuzVuruşu);
    localStorage.getItem("minBombaVuruşu") ? minBombaVuruşu = parseInt(localStorage.getItem("minBombaVuruşu")) : localStorage.setItem("minBombaVuruşu", minBombaVuruşu);
    localStorage.getItem("minGecikmeMs") ? minGecikmeMs = parseInt(localStorage.getItem("minGecikmeMs")) : localStorage.setItem("minGecikmeMs", minGecikmeMs);
    localStorage.getItem("maxGecikmeMs") ? maxGecikmeMs = parseInt(localStorage.getItem("maxGecikmeMs")) : localStorage.setItem("maxGecikmeMs", maxGecikmeMs);
    localStorage.getItem("otomatikOyna") ? otomatikOyna = localStorage.getItem("otomatikOyna") === 'true' : localStorage.setItem("otomatikOyna", otomatikOyna);
    localStorage.getItem("maxKöpekVuruşu") ? maxKöpekVuruşu = parseInt(localStorage.getItem("maxKöpekVuruşu")) : localStorage.setItem("maxKöpekVuruşu", maxKöpekVuruşu);

    function elemanıİşle(element) {
        if (!element || !element.item) return;

        const { type } = element.item;
        switch (type) {
            case "CLOVER":
                çiçekİşle(element);
                break;
            case "BOMB":
                bombaİşle(element);
                break;
            case "FREEZE":
                buzİşle(element);
                break;
            case "DOG":
                köpekİşle(element);
                break;
        }
    }

    function çiçekİşle(element) {
        if (Math.random() * 100 > çiçekAtlamaYüzdesi) {
            tıkla(element);
        }
    }

    function bombaİşle(element) {
        if (bombaVuruşu < minBombaVuruşu) {
            tıkla(element);
            bombaVuruşu++;
        }
    }

    function buzİşle(element) {
        if (buzVuruşu < minBuzVuruşu) {
            tıkla(element);
            buzVuruşu++;
        }
    }

    function köpekİşle(element) {
        if (köpekVuruşu < maxKöpekVuruşu) {
            tıkla(element);
            köpekVuruşu++;
        }
    }

    function tıkla(element) {
        if (element && element.element) {
            setTimeout(() => {
                element.element.click();
            }, minGecikmeMs + Math.random() * (maxGecikmeMs - minGecikmeMs));
        }
    }

    const originalPush = Array.prototype.push;
    Array.prototype.push = function(...args) {
        const element = args[0];
        elemanıİşle(element);
        return originalPush.apply(this, args);
    };

    function oyunTamamlanmaKontrolü() {
        const ödülElement = document.querySelector('.reward');
        if (ödülElement) {
            oyunİstatistikleriniSıfırla();

            if (otomatikOyna) {
                oynaButonunuKontrolEtVeTıkla();
            }
        }
    }

    function oyunİstatistikleriniSıfırla() {
        bombaVuruşu = 0;
        buzVuruşu = 0;
        köpekVuruşu = 0;
    }

    function oynaButonunuKontrolEtVeTıkla() {
        const playButton = document.querySelector('[data-testid="play-button"]');
        if (playButton) {
            setTimeout(() => {
                playButton.click();
            }, 1000);
        }
    }

    const observer = new MutationObserver(oyunTamamlanmaKontrolü);
    observer.observe(document.body, { childList: true, subtree: true });

    oynaButonunuKontrolEtVeTıkla();

    // Ayar menüsünü oluştur
    const ayarButonu = document.createElement("button");
    ayarButonu.textContent = "LoseOnline Blum Toplayıcı Ayarları";
    ayarButonu.style.position = "fixed";
    ayarButonu.style.top = "10px";
    ayarButonu.style.left = "10px";
    ayarButonu.style.zIndex = "9999";
    document.body.appendChild(ayarButonu);

    ayarButonu.addEventListener("click", () => {
        çiçekAtlamaYüzdesi = parseInt(prompt("Çiçek atlama yüzdesi (%):", çiçekAtlamaYüzdesi));
        minBuzVuruşu = parseInt(prompt("Minimum buz vuruşu:", minBuzVuruşu));
        minBombaVuruşu = parseInt(prompt("Minimum bomba vuruşu:", minBombaVuruşu));
        maxKöpekVuruşu = parseInt(prompt("Maksimum köpek vuruşu:", maxKöpekVuruşu));
        minGecikmeMs = parseInt(prompt("Minimum gecikme (ms):", minGecikmeMs));
        maxGecikmeMs = parseInt(prompt("Maksimum gecikme (ms):", maxGecikmeMs));
        otomatikOyna = confirm("Otomatik 'Oyna' butonuna tıklansın mı?");

        localStorage.setItem("çiçekAtlamaYüzdesi", çiçekAtlamaYüzdesi);
        localStorage.setItem("minBuzVuruşu", minBuzVuruşu);
        localStorage.setItem("minBombaVuruşu", minBombaVuruşu);
        localStorage.setItem("maxKöpekVuruşu", maxKöpekVuruşu);
        localStorage.setItem("minGecikmeMs", minGecikmeMs);
        localStorage.setItem("maxGecikmeMs", maxGecikmeMs);
        localStorage.setItem("otomatikOyna", otomatikOyna);
    });
})();
