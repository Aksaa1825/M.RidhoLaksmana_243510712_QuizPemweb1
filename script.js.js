/* ==========================================
   Traditional Melayu Audio Synth Logic
   ========================================== */
class MelayuSynth {
    constructor() {
        this.audioCtx = null;
        this.isPlaying = false;
        this.notes = [220, 247, 277, 330, 370, 440, 494, 554, 660]; // Melayu Slendro-inspired traditional scale
        this.timer = null;
        this.currentStep = 0;
    }

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playPluck(frequency, time, duration = 1.2) {
        const osc = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();
        const filterNode = this.audioCtx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, time);

        // Add slight microtonal frequency vibration for authentic string character
        osc.frequency.linearRampToValueAtTime(frequency * 1.005, time + 0.05);
        osc.frequency.linearRampToValueAtTime(frequency, time + duration);

        // Traditional pluck envelope (sharp attack, exponential decay)
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.4, time + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        // Filter for warm hollow acoustic gambus/sape box feel
        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(1200, time);
        filterNode.frequency.exponentialRampToValueAtTime(300, time + duration);

        osc.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        osc.start(time);
        osc.stop(time + duration);
    }

    startMelody() {
        this.init();
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.audioCtx.resume();
        
        const scheduleNext = () => {
            const stepDuration = 0.45; // Tempo
            const now = this.audioCtx.currentTime;
            
            // Algorithmic traditional gambus picking pattern
            if (Math.random() > 0.15) {
                const noteIdx = [0, 3, 4, 3, 5, 7, 5, 3][this.currentStep % 8];
                const oct = Math.random() > 0.85 ? 2 : 1;
                this.playPluck(this.notes[noteIdx % this.notes.length] * oct, now);
            }
            
            // Occasional background secondary accompaniment pluck
            if (this.currentStep % 4 === 0 && Math.random() > 0.5) {
                this.playPluck(this.notes[0] * 0.5, now, 2.0);
            }

            this.currentStep++;
            this.timer = setTimeout(scheduleNext, stepDuration * 1000);
        };
        scheduleNext();
    }

    stopMelody() {
        if (this.timer) clearTimeout(this.timer);
        this.isPlaying = false;
    }
}

const synthInstance = new MelayuSynth();

function toggleTraditionalMusic() {
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');

    if (!synthInstance.isPlaying) {
        synthInstance.startMelody();
        musicBtn.classList.add('active');
        musicIcon.setAttribute('data-lucide', 'music-4');
        musicText.innerText = "Musik On";
    } else {
        synthInstance.stopMelody();
        musicBtn.classList.remove('active');
        musicIcon.setAttribute('data-lucide', 'music');
        musicText.innerText = "Musik Off";
    }
    lucide.createIcons();
}

function playCustomBeep(frequency, duration) {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, context.currentTime);
        
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(context.destination);
        
        osc.start();
        osc.stop(context.currentTime + duration);
        
        showToast(`Memutar sampel melodi tradisional pada frekuensi ${frequency}Hz.`);
    } catch (e) {
        console.error("Web Audio API not supported/active", e);
    }
}

/* ==========================================
   Global Search Catalog & Engine
   ========================================== */
const searchCatalog = [
    { id: 'rendang', title: 'Rendang Melayu', cat: 'kuliner', desc: 'Rendang basah aromatis khas Riau.', link: '#kuliner' },
    { id: 'gulai', title: 'Gulai Ikan Patin', cat: 'kuliner', desc: 'Hidangan utama bersantan kuning khas Kampar Riau.', link: '#kuliner' },
    { id: 'asam-pedas', title: 'Asam Pedas Melayu', cat: 'kuliner', desc: 'Sajian ikan segar berkuah pedas asam menggugah selera.', link: '#kuliner' },
    { id: 'kue-bangkit', title: 'Kue Bangkit Sagu', cat: 'kuliner', desc: 'Kue kering sagu kelapa manis meleleh di mulut.', link: '#kuliner' },
    { id: 'mie-sagu', title: 'Mie Sagu Selatpanjang', cat: 'kuliner', desc: 'Olahan sagu khas Kepulauan Meranti yang digoreng pedas.', link: '#kuliner' },
    { id: 'bolu-kemojo', title: 'Bolu Kemojo Pandan', cat: 'kuliner', desc: 'Kue adat pandan legit menyerupai bunga kemboja.', link: '#kuliner' },
    { id: 'kurung', title: 'Baju Kurung Adat', cat: 'busana', desc: 'Setelan longgar santun bagi kaum wanita Melayu.', link: '#busana' },
    { id: 'teluk-belanga', title: 'Teluk Belanga Pria', cat: 'busana', desc: 'Pakaian adat formal pria berhias kain samping songket.', link: '#busana' },
    { id: 'kebaya-melayu', title: 'Kebaya Melayu Panjang', cat: 'busana', desc: 'Kebaya panjang berjejer bros permata tiga tingkat.', link: '#busana' },
    { id: 'songket', title: 'Songket Melayu Tenun', cat: 'busana', desc: 'Tenunan bernilai tinggi berhiaskan rajutan benang emas.', link: '#busana' },
    { id: 'zapin', title: 'Tari Zapin Islami', cat: 'seni', desc: 'Seni tari kelincahan kaki bernuansa edukasi agama.', link: '#seni' },
    { id: 'gambus', title: 'Alat Musik Gambus', cat: 'seni', desc: 'Instrumen petik pengiring lantunan bait syair nasehat.', link: '#seni' },
    { id: 'kompang', title: 'Kompang Rebana perkusi', cat: 'seni', desc: 'Alat musik tepuk kulit kambing penyambut arak tamu.', link: '#seni' },
    { id: 'syair', title: 'Sastra Bait Syair Melayu', cat: 'seni', desc: 'Karya sastra puitis peninggalan pujangga bangsawan istana.', link: '#seni' },
];

function toggleSearch() {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('global-search-input');
    if (!overlay.classList.contains('active')) {
        overlay.classList.add('active');
        input.focus();
        performLiveSearch(); // Perform initial full query preview
    } else {
        overlay.classList.remove('active');
        input.value = '';
    }
}

function performLiveSearch() {
    const query = document.getElementById('global-search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    const matches = searchCatalog.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.desc.toLowerCase().includes(query) ||
        item.cat.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-no-results">
                <p>Tidak ada hasil yang ditemukan.</p>
                <p>Gunakan kata kunci alternatif lainnya.</p>
            </div>
        `;
        return;
    }

    matches.forEach(match => {
        const card = document.createElement('a');
        card.href = match.link;
        card.onclick = () => { toggleSearch(); };
        card.className = "search-result-card";
        card.innerHTML = `
            <div class="search-result-header">
                <span class="search-result-cat">${match.cat}</span>
                <i data-lucide="arrow-up-right"></i>
            </div>
            <h4 class="search-result-title">${match.title}</h4>
            <p class="search-result-desc">${match.desc}</p>
        `;
        resultsContainer.appendChild(card);
    });
    lucide.createIcons();
}

/* ==========================================
   Theme & Toast Notification Logic
   ========================================== */
function toggleTheme() {
    const html = document.documentElement;
    const icon = document.getElementById('theme-icon');
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        icon.setAttribute('data-lucide', 'moon');
        showToast("Mengubah ke Tema Terang (Cream Minimalist)");
    } else {
        html.classList.add('dark');
        icon.setAttribute('data-lucide', 'sun');
        showToast("Mengubah ke Tema Gelap (Premium Emerald & Gold)");
    }
    lucide.createIcons();
}

function showToast(message) {
    const toast = document.getElementById('toast-message');
    const text = document.getElementById('toast-text');
    text.innerText = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3500);
}

/* ==========================================
   Navigation Header Scroll Reveal & Mobile Drawer
   ========================================== */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-btn-icon');
    if (!menu.classList.contains('active')) {
        menu.classList.add('active');
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.remove('active');
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

/* ==========================================
   Tab Switcher (Tentang Section)
   ========================================== */
function switchTab(tabId, btn) {
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.remove('active-tab');
    });
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('block');
    });

    // Activate selected button and content
    btn.classList.add('active-tab');
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('block');
    }
}

/* ==========================================
   Horizontal Culinary Card Slider
   ========================================== */
let currentSlideIndex = 0;
function slideCulinary(direction) {
    const slider = document.getElementById('culinary-slider');
    const cards = document.querySelectorAll('.food-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 24; // Width + Margin gap
    const totalCards = cards.length;
    const visibleWidth = document.getElementById('slider-outer').offsetWidth;
    const maxScrollableIndex = totalCards - Math.floor(visibleWidth / cardWidth);

    if (direction === 'next') {
        if (currentSlideIndex < maxScrollableIndex) {
            currentSlideIndex++;
        } else {
            currentSlideIndex = 0; // Return to beginning
        }
    } else {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
        } else {
            currentSlideIndex = maxScrollableIndex > 0 ? maxScrollableIndex : 0; // Go to end
        }
    }
    slider.style.transform = `translateX(-${currentSlideIndex * cardWidth}px)`;
}

// Reset slider on window resize
window.addEventListener('resize', () => {
    const slider = document.getElementById('culinary-slider');
    if (slider) {
        slider.style.transform = 'translateX(0px)';
    }
    currentSlideIndex = 0;
});

/* ==========================================
   Attire Modal details (Interactive pop-ups)
   ========================================== */
function openAttireModal(title, philosophy, material, usage) {
    const modal = document.getElementById('attire-modal');
    
    document.getElementById('modal-attire-title').innerText = title;
    document.getElementById('modal-attire-philosophy').innerText = philosophy;
    document.getElementById('modal-attire-material').innerText = material;
    document.getElementById('modal-attire-usage').innerText = usage;

    modal.classList.add('active');
}

function closeAttireModal() {
    const modal = document.getElementById('attire-modal');
    modal.classList.remove('active');
}

/* ==========================================
   Interactive Linimasa (Timeline)
   ========================================== */
function activateTimelineStep(stepNum) {
    // Toggle Active state style on buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active-time');
    });

    const activeBtn = document.getElementById(`time-btn-${stepNum}`);
    if (activeBtn) {
        activeBtn.classList.add('active-time');
    }

    // Toggle visibility on text details
    document.querySelectorAll('.timeline-content').forEach(content => {
        content.classList.remove('block');
    });
    const targetContent = document.getElementById(`timeline-step-${stepNum}`);
    if (targetContent) {
        targetContent.classList.add('block');
    }
}

/* ==========================================
   Galeri (Gallery) Pinterest Filter System
   ========================================== */
function filterGallery(category, button) {
    // Filter button styles update
    document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.classList.remove('active-filter');
    });
    button.classList.add('active-filter');

    // Hide/Show items based on target category
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (category === 'semua' || item.getAttribute('data-category') === category) {
            item.style.display = 'flex';
            // Trigger quick visual fade in
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 50);
        } else {
            item.style.display = 'none';
        }
    });
}

/* ==========================================
   Application Bootstrapper
   ========================================== */
window.onload = function () {
    lucide.createIcons();
}
