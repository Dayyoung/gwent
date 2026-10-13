// ==========================================================================
// SNSHero.com - G-went : Responsive Mobile Controller (responsive.js)
// ==========================================================================

(function() {
  'use strict';

  let currentMobileTab = 'bank'; // 'bank' or 'deck'
  let rotatePromptDismissed = false;

  function initMobileSystem() {
    setupMobileTabs();
    setupRotateOverlay();
    updateTabBadges();

    // Viewport & Orientation events
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleViewportChange, 150);
    });
    window.addEventListener('gwent-language-changed', handleLanguageChange);

    // Watch start-game button click to check rotation
    const startBtn = document.getElementById('start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        setTimeout(handleViewportChange, 300);
      });
    }

    // Initial check
    handleViewportChange();
  }

  // 1. Mobile Deckbuilder Tabs
  function setupMobileTabs() {
    const tabBank = document.getElementById('mobile-tab-bank');
    const tabDeck = document.getElementById('mobile-tab-deck');

    if (tabBank) {
      tabBank.addEventListener('click', (e) => {
        e.preventDefault();
        setMobileTab('bank');
      });
    }

    if (tabDeck) {
      tabDeck.addEventListener('click', (e) => {
        e.preventDefault();
        setMobileTab('deck');
      });
    }

    // Set initial default tab view
    setMobileTab('bank');

    // Auto-update badges periodically
    setInterval(updateTabBadges, 400);
  }

  function setMobileTab(tab) {
    currentMobileTab = tab;
    const tabBank = document.getElementById('mobile-tab-bank');
    const tabDeck = document.getElementById('mobile-tab-deck');
    const bankElem = document.getElementById('card-bank');
    const deckElem = document.getElementById('card-deck');

    if (tab === 'bank') {
      tabBank?.classList.add('active');
      tabDeck?.classList.remove('active');
      document.body.classList.add('mobile-view-bank');
      document.body.classList.remove('mobile-view-deck');
      bankElem?.classList.add('mobile-active');
      deckElem?.classList.remove('mobile-active');
      if (bankElem) bankElem.scrollTop = 0;
    } else {
      tabDeck?.classList.add('active');
      tabBank?.classList.remove('active');
      document.body.classList.add('mobile-view-deck');
      document.body.classList.remove('mobile-view-bank');
      deckElem?.classList.add('mobile-active');
      bankElem?.classList.remove('mobile-active');
      if (deckElem) deckElem.scrollTop = 0;
    }

    if (window.AudioManager) {
      AudioManager.playSFX('ui_card');
    }
  }

  function updateTabBadges() {
    const bankBadge = document.getElementById('mobile-tab-bank-count');
    const deckBadge = document.getElementById('mobile-tab-deck-count');

    if (window.dm) {
      if (bankBadge && dm.bank) {
        const bankCount = dm.bank.filter(c => c.count > 0).length;
        bankBadge.innerText = bankCount;
      }
      if (deckBadge && dm.deck) {
        const deckCount = dm.deck.filter(c => c.count > 0).reduce((sum, c) => sum + c.count, 0);
        deckBadge.innerText = deckCount;
      }
    }
  }

  // 2. Screen Rotation Prompt Overlay (During Battle)
  function setupRotateOverlay() {
    const overlay = document.getElementById('rotate-device-overlay');
    const dismissBtn = document.getElementById('rotate-dismiss-btn');

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        rotatePromptDismissed = true;
        overlay?.classList.add('hide');
      });
    }
  }

  function handleViewportChange() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobileWidth = window.innerWidth <= 768;
    const isGameActive = document.getElementById('deck-customization')?.classList.contains('hide');

    const rotateOverlay = document.getElementById('rotate-device-overlay');

    if (isGameActive && isPortrait && isMobileWidth && !rotatePromptDismissed) {
      rotateOverlay?.classList.remove('hide');
    } else {
      rotateOverlay?.classList.add('hide');
      if (!isPortrait) {
        // Reset dismiss flag when rotated to landscape
        rotatePromptDismissed = false;
      }
    }
  }

  // 3. Multilingual Translation
  function handleLanguageChange(e) {
    const isEn = e.detail && e.detail.lang === 'en';
    
    // Tab labels
    const tabBankText = document.getElementById('mobile-tab-bank-text');
    const tabDeckText = document.getElementById('mobile-tab-deck-text');
    if (tabBankText) tabBankText.innerText = isEn ? 'Card Collection' : '보유 카드 컬렉션';
    if (tabDeckText) tabDeckText.innerText = isEn ? 'Cards in Deck' : '덱 편성 카드';

    // Rotation prompt
    const rotateTitle = document.getElementById('rotate-prompt-title');
    const rotateDesc = document.getElementById('rotate-prompt-desc');
    const rotateBtn = document.getElementById('rotate-dismiss-btn');

    if (rotateTitle) rotateTitle.innerText = isEn ? 'Please Rotate to Landscape' : '화면을 가로로 돌려주세요';
    if (rotateDesc) rotateDesc.innerText = isEn 
      ? 'Gwent battlefield and hand cards are best experienced in Landscape mode.' 
      : '궨트는 가로 모드(Landscape)에서 전장과 손패가 가장 넓고 선명하게 표시됩니다.';
    if (rotateBtn) rotateBtn.innerText = isEn ? 'Continue in Portrait' : '세로 모드로 계속하기';
  }

  // Bootstrap when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileSystem);
  } else {
    initMobileSystem();
  }

  window.ResponsiveController = {
    setMobileTab,
    updateTabBadges,
    handleViewportChange
  };
})();
