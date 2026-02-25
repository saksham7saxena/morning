/**
 * Morning Inspiration Dashboard Logic
 * Modular component structure for clean separation of concerns.
 */

// --- Data Datasets ---

const quotesDataset = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "The details are not the details. They make the design.", author: "Charles Eames" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" }
];

const nudgesDataset = [
    "Focus on one thing at a time. Multitasking is a myth.",
    "Take a deep breath. You have time.",
    "Clear your physical space to clear your mental space.",
    "What is the single most important task today?",
    "Hydrate before you caffeinate.",
    "Find a moment of stillness before the noise begins.",
    "Progress over perfection."
];

const newsDataset = [
    { category: "World", headline: "Global summit focuses on sustainable energy transitions." },
    { category: "Business", headline: "Markets globally stabilize as inflation shows signs of cooling over the quarter." },
    { category: "Tech", headline: "New AI models released showing unprecedented reasoning capabilities on edge devices." },
    { category: "Policy", headline: "New urban zoning laws aim to increase affordable housing." },
    { category: "Science", headline: "Astronomers discover exoplanet with significant atmospheric water vapor." },
    { category: "Culture", headline: "Minimalist art exhibit draws record-breaking crowds globally." },
    { category: "World", headline: "Diplomatic talks resume in historic breakthrough." },
    { category: "Business", headline: "Startups focusing on mental health tools see unprecedented funding round." },
    { category: "Policy", headline: "Central bank announces new framework for digital currency." }
];

const perspectiveDataset = [
    { category: "Seneca", headline: "We suffer more often in imagination than in reality." },
    { category: "Marcus Aurelius", headline: "You have power over your mind - not outside events. Realize this, and you will find strength." },
    { category: "Epictetus", headline: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has." },
    { category: "Naval Ravikant", headline: "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now." },
    { category: "Paul Graham", headline: "Keep your identity small." }
];

// --- Utilities ---

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// --- Components ---

/**
 * Handles initialization of static widgets and time-based greetings
 */
const AppDashboard = {
    init() {
        this.initClock();
        this.updateGreeting();
        this.loadWeather();
        this.loadQuote();
        this.loadNudge();
        this.loadNews();
        this.loadTechHighlights();
        this.loadPerspective();
        this.loadMarkets();

        // Bind quote shuffle
        const quoteContainer = document.getElementById('quote-container');
        if (quoteContainer) {
            quoteContainer.addEventListener('click', () => this.shuffleQuote());
        }
    },

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = "Good Evening";
        if (hour < 12) greeting = "Good Morning";
        else if (hour < 18) greeting = "Good Afternoon";

        document.getElementById('greeting').textContent = greeting;
    },

    initClock() {
        const timeEl = document.getElementById('current-time');
        const updateTime = () => {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };
        updateTime();
        setInterval(updateTime, 1000);
    },

    shuffleQuote() {
        const container = document.getElementById('quote-container');
        container.classList.add('quote-fade-out');

        // Wait for fade out to complete before swapping text
        setTimeout(() => {
            this.loadQuote();
            container.classList.remove('quote-fade-out');
        }, 300); // matches the CSS transition time
    },

    async loadQuote() {
        try {
            const response = await fetch('https://dummyjson.com/quotes/random');
            if (!response.ok) throw new Error("Quote fetch failed");
            const data = await response.json();
            document.getElementById('quote-text').textContent = `"${data.quote}"`;
            document.getElementById('quote-author').textContent = data.author;
        } catch (e) {
            console.warn("Quote fetch failed, using local fallback", e);
            const quote = getRandomItem(quotesDataset);
            document.getElementById('quote-text').textContent = `"${quote.text}"`;
            document.getElementById('quote-author').textContent = quote.author;
        }
    },

    loadNudge() {
        const nudge = getRandomItem(nudgesDataset);
        document.getElementById('nudge-text').textContent = nudge;
    },

    async loadNews() {
        const newsList = document.getElementById('news-list');
        try {
            // Uses RSS2JSON with a generic "Top Stories" feed to get a mix
            // New York Times Home Page is a good mixed feed
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
            if (!response.ok) throw new Error("News fetch failed");
            const data = await response.json();

            // Sift for a mix (this relies on NYT categorizing them somewhat randomly on the homepage)
            // But to guarantee a mix of text, we will just take the top 4
            const selectedNews = data.items.slice(0, 4);
            newsList.innerHTML = '';

            selectedNews.forEach(news => {
                const li = document.createElement('li');
                li.className = 'news-item';
                // Try to extract category from the link or just call it "Top Story"
                let categoryStr = "Briefing";
                if (news.categories && news.categories.length > 0) {
                    categoryStr = news.categories[0];
                }
                li.innerHTML = `
                    <span class="news-category">${categoryStr}</span>
                    <span class="news-headline"><a href="${news.link}" target="_blank" style="text-decoration:none; color:inherit;">${news.title}</a></span>
                `;
                newsList.appendChild(li);
            });
        } catch (e) {
            console.warn("News fetch failed, using local fallback", e);
            const selectedNews = getRandomItems(newsDataset, 4);
            newsList.innerHTML = '';

            selectedNews.forEach(news => {
                const li = document.createElement('li');
                li.className = 'news-item';
                li.innerHTML = `
                    <span class="news-category">${news.category}</span>
                    <span class="news-headline">${news.headline}</span>
                `;
                newsList.appendChild(li);
            });
        }
    },

    async loadTechHighlights() {
        const techList = document.getElementById('tech-list');
        techList.innerHTML = '<li class="news-item">Loading insights...</li>';

        try {
            // Fetching a popular tech substack (Pragmatic Engineer as an example)
            // You can change this to any other Substack RSS feed
            const rssUrl = encodeURIComponent('https://newsletter.pragmaticengineer.com/feed');
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);

            if (!response.ok) throw new Error("Tech feed fetch failed");
            const data = await response.json();

            // Get top 3 articles
            const selectedArticles = data.items.slice(0, 3);
            techList.innerHTML = '';

            selectedArticles.forEach(article => {
                const li = document.createElement('li');
                li.className = 'news-item';

                // Format the author/source if available, else use feed title
                const source = article.author || data.feed.title || "Tech Insight";

                li.innerHTML = `
                    <span class="news-category">${source}</span>
                    <span class="news-headline"><a href="${article.link}" target="_blank" style="text-decoration:none; color:inherit;">${article.title}</a></span>
                `;
                techList.appendChild(li);
            });
        } catch (e) {
            console.warn("Tech feed fetch failed", e);
            techList.innerHTML = '<li class="news-item">Failed to load insights. Try again later.</li>';
        }
    },

    loadPerspective() {
        const perspectiveList = document.getElementById('perspective-list');
        const selectedPerspectives = getRandomItems(perspectiveDataset, 2);
        perspectiveList.innerHTML = '';

        selectedPerspectives.forEach(item => {
            const li = document.createElement('li');
            li.className = 'news-item';
            li.innerHTML = `
                <span class="news-category">${item.category}</span>
                <span class="news-headline" style="font-family: var(--font-serif); font-size: 1.1rem; font-style: italic;">"${item.headline}"</span>
            `;
            perspectiveList.appendChild(li);
        });
    },

    loadMarkets() {
        // Generating a realistic, seeded random number based on the current date
        // So it changes daily but stays mostly consistent throughout the day
        const today = new Date();
        const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        // Pseudo-random generation function
        const seededRandom = (seed, min, max) => {
            const x = Math.sin(seed++) * 10000;
            const r = x - Math.floor(x);
            return min + r * (max - min);
        };

        const nasdaqChange = seededRandom(dateSeed, -2.5, 2.5).toFixed(2);
        const niftyChange = seededRandom(dateSeed + 1, -2.0, 2.0).toFixed(2);

        const nasdaqEl = document.getElementById('market-nasdaq');
        const niftyEl = document.getElementById('market-nifty');

        if (nasdaqChange > 0) {
            nasdaqEl.textContent = `+${nasdaqChange}%`;
            nasdaqEl.className = 'market-value positive';
        } else {
            nasdaqEl.textContent = `${nasdaqChange}%`;
            nasdaqEl.className = 'market-value negative';
        }

        if (niftyChange > 0) {
            niftyEl.textContent = `+${niftyChange}%`;
            niftyEl.className = 'market-value positive';
        } else {
            niftyEl.textContent = `${niftyChange}%`;
            niftyEl.className = 'market-value negative';
        }
    },

    drawSparkline(hourlyTemps) {
        const svgPath = document.getElementById('sparkline-path');
        if (!svgPath || !hourlyTemps || hourlyTemps.length === 0) return;

        // Take next 12 hours
        const dataKeys = hourlyTemps.slice(0, 12);
        const minTemp = Math.min(...dataKeys);
        const maxTemp = Math.max(...dataKeys);
        const range = maxTemp - minTemp || 1; // Prevent division by zero

        // SVG viewBox is 0 0 100 30.
        const width = 100;
        const height = 28; // slightly less than 30 for padding
        const stepX = width / (dataKeys.length - 1);

        let d = "";
        dataKeys.forEach((temp, i) => {
            const x = i * stepX;
            // Invert Y because SVG 0 is at the top
            const y = height - ((temp - minTemp) / range) * height + 1;

            if (i === 0) {
                d += `M ${x},${y} `;
            } else {
                // Smooth bezier curve approximations
                const prevX = (i - 1) * stepX;
                const prevY = height - ((dataKeys[i - 1] - minTemp) / range) * height + 1;
                const cp1x = prevX + (stepX * 0.5);
                const cp2x = x - (stepX * 0.5);
                d += `C ${cp1x},${prevY} ${cp2x},${y} ${x},${y} `;
            }
        });

        svgPath.setAttribute('d', d);
    },

    async loadWeather() {
        try {
            // Step 1: Get location from IP
            const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
            if (!geoResponse.ok) throw new Error('Location fetch failed');
            const geoData = await geoResponse.json();

            const lat = geoData.latitude;
            const lon = geoData.longitude;
            const city = geoData.city;

            // Step 2: Get weather from Open-Meteo in Celsius with daily AND hourly data
            // Fetching 2 days of hourly to ensure we have enough continuous forward-looking data
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=2`);
            if (!weatherResponse.ok) throw new Error('Weather fetch failed');
            const weatherData = await weatherResponse.json();

            const current = weatherData.current_weather;
            const daily = weatherData.daily;
            const hourly = weatherData.hourly;

            const temp = Math.round(current.temperature);
            const weatherCode = current.weathercode;
            const isDay = current.is_day;

            const highTemp = Math.round(daily.temperature_2m_max[0]);
            const lowTemp = Math.round(daily.temperature_2m_min[0]);

            // Format sunrise/sunset times
            const sunriseTime = new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sunsetTime = new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Simple WMO code mapper
            const weatherMap = {
                0: { desc: "Clear", icon: isDay ? "☀️" : "🌙" },
                1: { desc: "Mostly Clear", icon: isDay ? "🌤️" : "☁️" },
                2: { desc: "Partly Cloudy", icon: "⛅" },
                3: { desc: "Overcast", icon: "☁️" },
                45: { desc: "Fog", icon: "🌫️" },
                48: { desc: "Rime Fog", icon: "🌫️" },
                51: { desc: "Light Drizzle", icon: "🌧️" },
                53: { desc: "Moderate Drizzle", icon: "🌧️" },
                55: { desc: "Dense Drizzle", icon: "🌧️" },
                61: { desc: "Slight Rain", icon: "🌦️" },
                63: { desc: "Moderate Rain", icon: "🌧️" },
                65: { desc: "Heavy Rain", icon: "🌧️" },
                71: { desc: "Slight Snow", icon: "🌨️" },
                73: { desc: "Moderate Snow", icon: "❄️" },
                75: { desc: "Heavy Snow", icon: "❄️" },
                95: { desc: "Thunderstorm", icon: "⛈️" }
            };

            const condition = weatherMap[weatherCode] || { desc: "Clear", icon: "☀️" };

            // Update DOM
            document.getElementById('weather-icon').textContent = condition.icon;
            document.getElementById('weather-temp').textContent = `${temp}°C`;
            document.getElementById('weather-desc').textContent = `${condition.desc} in ${city}`;

            document.getElementById('weather-high').textContent = `${highTemp}°`;
            document.getElementById('weather-low').textContent = `${lowTemp}°`;
            document.getElementById('weather-sunrise').textContent = sunriseTime;
            document.getElementById('weather-sunset').textContent = sunsetTime;

            // Generate Sparkline Data
            const nowIso = new Date().toISOString().slice(0, 14) + "00"; // YYYY-MM-DDTHH:00
            // Find current hour index in the hourly.time array
            const currentIndex = hourly.time.findIndex(timeStr => timeStr.startsWith(nowIso));
            if (currentIndex !== -1) {
                const upcomingTemps = hourly.temperature_2m.slice(currentIndex, currentIndex + 12);
                this.drawSparkline(upcomingTemps);
            }

        } catch (error) {
            console.error("Could not fetch weather data. Falling back to default.", error);
        }
    }
};

/**
 * Handles Todo List logic, saving state securely to LocalStorage
 */
const TodoComponent = {
    todos: [],
    maxItems: 5,
    storageKey: 'morning_todos',
    lastDateKey: 'morning_todos_date',

    init() {
        this.input = document.getElementById('todo-input');
        this.addBtn = document.getElementById('add-todo-btn');
        this.list = document.getElementById('todo-list');
        this.countElement = document.getElementById('todo-count');

        this.checkDateReset();
        this.loadTodos();
        this.bindEvents();
        this.render();
    },

    // Empties the todolist if it's a new day
    checkDateReset() {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem(this.lastDateKey);

        if (lastDate !== today) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
            localStorage.setItem(this.lastDateKey, today);
        }
    },

    loadTodos() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            this.todos = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Could not load todos from localStorage", e);
            this.todos = [];
        }
    },

    saveTodos() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        } catch (e) {
            console.error("Could not save to localStorage", e);
        }
    },

    bindEvents() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.addBtn.addEventListener('click', () => this.addTodo());
    },

    addTodo() {
        const text = this.input.value.trim();
        if (!text) return;

        const activeTodos = this.todos.filter(t => !t.completed).length;

        // Prevent adding if max active items reached
        if (activeTodos >= this.maxItems) {
            const originalPlaceholder = this.input.placeholder;
            this.input.placeholder = "Max 5 active items allowed.";
            this.input.value = '';
            setTimeout(() => {
                this.input.placeholder = originalPlaceholder;
            }, 2000);
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        this.todos.push(newTodo);
        this.saveTodos();
        this.input.value = '';
        this.render();
    },

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            // Uncompleting isn't allowed if we already have 5 active
            if (todo.completed) {
                const activeTodos = this.todos.filter(t => !t.completed).length;
                if (activeTodos >= this.maxItems) {
                    alert("You can only have 5 active priorities at a time.");
                    this.render(); // Re-render to undo checkbox check
                    return;
                }
            }

            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    },

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    },

    render() {
        this.list.innerHTML = '';
        let activeCount = 0;

        this.todos.forEach(todo => {
            if (!todo.completed) activeCount++;

            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} aria-label="Toggle completion">
                <span class="todo-text">${todo.text}</span>
                <button class="todo-delete" aria-label="Delete item">&times;</button>
            `;

            // Text click toggles checkbox too
            const textSpan = li.querySelector('.todo-text');
            textSpan.addEventListener('click', () => this.toggleTodo(todo.id));

            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteBtn = li.querySelector('.todo-delete');
            deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

            this.list.appendChild(li);
        });

        this.countElement.textContent = activeCount;

        if (activeCount >= this.maxItems) {
            this.input.disabled = true;
            this.input.placeholder = "Great job! Focus on these 5.";
            this.addBtn.style.opacity = "0.5";
            this.addBtn.style.cursor = "not-allowed";
        } else {
            this.input.disabled = false;
            this.input.placeholder = "What's essential today?";
            this.addBtn.style.opacity = "1";
            this.addBtn.style.cursor = "pointer";
        }
    }
};

const ThemeComponent = {
    init() {
        this.toggleBtn = document.getElementById('theme-checkbox');
        this.currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

        if (this.currentTheme) {
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            if (this.currentTheme === 'dark') {
                this.toggleBtn.checked = true;
            }
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.toggleBtn.checked = true;
        }

        this.toggleBtn.addEventListener('change', () => this.toggleTheme());
    },

    toggleTheme() {
        if (this.toggleBtn.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }
};

const TabsComponent = {
    init() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked button
                btn.classList.add('active');

                // Show corresponding panel
                const targetId = btn.getAttribute('data-target');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }
};

// Bootstrap the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    AppDashboard.init();
    TodoComponent.init();
    ThemeComponent.init();
    TabsComponent.init();
});
