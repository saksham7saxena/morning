const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" }
];

const greetingElement = document.getElementById('greeting');
const quoteTextElement = document.getElementById('quote-text');
const quoteAuthorElement = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote-btn');

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
}

function updateGreeting() {
    greetingElement.textContent = getGreeting();
}

function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

function displayQuote() {
    // Fade out
    quoteTextElement.style.opacity = 0;
    quoteAuthorElement.style.opacity = 0;

    setTimeout(() => {
        const quote = getRandomQuote();
        quoteTextElement.textContent = `"${quote.text}"`;
        quoteAuthorElement.textContent = `- ${quote.author}`;

        // Fade in
        quoteTextElement.style.opacity = 1;
        quoteAuthorElement.style.opacity = 1;
    }, 300); // Wait for fade out
}

// Add transition/opacity styles for smooth change
quoteTextElement.style.transition = "opacity 0.3s ease";
quoteAuthorElement.style.transition = "opacity 0.3s ease";

// Event Listeners
newQuoteBtn.addEventListener('click', displayQuote);

// Initial Load
updateGreeting();
displayQuote();
