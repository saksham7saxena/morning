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
    { category: "Sports", headline: "Historical record broken in marathon majors this weekend under optimal conditions." },
    { category: "Science", headline: "Astronomers discover exoplanet with significant atmospheric water vapor." },
    { category: "Culture", headline: "Minimalist art exhibit draws record-breaking crowds globally." },
    { category: "Tech", headline: "Quantum computing breakthrough accelerates cryptography timelines." },
    { category: "Business", headline: "Startups focusing on mental health tools see unprecedented funding round." }
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
            // Uses RSS2JSON to convert NYT World News RSS into JSON format
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://rss.nytimes.com/services/xml/rss/nyt/World.xml');
            if (!response.ok) throw new Error("News fetch failed");
            const data = await response.json();

            const selectedNews = data.items.slice(0, 3);
            newsList.innerHTML = '';

            selectedNews.forEach(news => {
                const li = document.createElement('li');
                li.className = 'news-item';
                li.innerHTML = `
                    <span class="news-category">World News</span>
                    <span class="news-headline"><a href="${news.link}" target="_blank" style="text-decoration:none; color:inherit;">${news.title}</a></span>
                `;
                newsList.appendChild(li);
            });
        } catch (e) {
            console.warn("News fetch failed, using local fallback", e);
            const selectedNews = getRandomItems(newsDataset, 3);
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

    async loadWeather() {
        try {
            // Step 1: Get location from IP
            const geoResponse = await fetch('https://get.geojs.io/v1/ip/geo.json');
            if (!geoResponse.ok) throw new Error('Location fetch failed');
            const geoData = await geoResponse.json();

            const lat = geoData.latitude;
            const lon = geoData.longitude;
            const city = geoData.city;

            // Step 2: Get weather from Open-Meteo
            const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`);
            if (!weatherResponse.ok) throw new Error('Weather fetch failed');
            const weatherData = await weatherResponse.json();

            const temp = Math.round(weatherData.current_weather.temperature);
            const weatherCode = weatherData.current_weather.weathercode;
            const isDay = weatherData.current_weather.is_day;

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

            document.getElementById('weather-icon').textContent = condition.icon;
            document.getElementById('weather-temp').textContent = `${temp}°F`;
            document.getElementById('weather-desc').textContent = `${condition.desc} in ${city}`;

        } catch (error) {
            console.error("Could not fetch weather data. Falling back to default.", error);
            // Defaults will remain visible
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

// Bootstrap the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    AppDashboard.init();
    TodoComponent.init();
});
