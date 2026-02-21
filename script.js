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

    loadQuote() {
        const quote = getRandomItem(quotesDataset);
        document.getElementById('quote-text').textContent = `"${quote.text}"`;
        document.getElementById('quote-author').textContent = quote.author;
    },

    loadNudge() {
        const nudge = getRandomItem(nudgesDataset);
        document.getElementById('nudge-text').textContent = nudge;
    },

    loadNews() {
        const selectedNews = getRandomItems(newsDataset, 3);
        const newsList = document.getElementById('news-list');
        newsList.innerHTML = ''; // Clear fallback

        selectedNews.forEach(news => {
            const li = document.createElement('li');
            li.className = 'news-item';
            li.innerHTML = `
                <span class="news-category">${news.category}</span>
                <span class="news-headline">${news.headline}</span>
            `;
            newsList.appendChild(li);
        });
    },

    async loadWeather() {
        try {
            // wttr.in automatically detects location from IP and formats as: icon|temp|description|location
            const response = await fetch('https://wttr.in/?format=%c|%t|%C|%l');
            if (response.ok) {
                const data = await response.text();
                const [icon, temp, desc, loc] = data.trim().split('|');

                if (icon && temp && desc) {
                    document.getElementById('weather-icon').textContent = icon;
                    document.getElementById('weather-temp').textContent = temp.replace('+', ''); // Remove positive sign

                    const locationName = loc ? loc.split(',')[0].trim() : '';
                    document.getElementById('weather-desc').textContent = locationName ? `${desc} in ${locationName}` : desc;
                }
            }
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
