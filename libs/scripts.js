// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function toggleTheme() {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);

    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

    localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
const icon = themeToggle.querySelector('i');
icon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// NLP Demo
const nlpInput = document.getElementById('nlpInput');
const sqlOutput = document.getElementById('sqlOutput');

const nlpExamples = {
    'students with pending fees': 'SELECT s.name, s.id, f.amount_due, f.due_date FROM students s JOIN fees f ON s.id = f.student_id WHERE f.status = "pending";',
    'total fees collected this month': 'SELECT SUM(amount_paid) as total_collected FROM fee_payments WHERE MONTH(payment_date) = MONTH(CURRENT_DATE()) AND YEAR(payment_date) = YEAR(CURRENT_DATE());',
    'students in batch 2024': 'SELECT name, email, phone FROM students WHERE batch_year = 2024 ORDER BY name;',
    'overdue library books': 'SELECT b.title, s.name, lb.issue_date, lb.due_date FROM library_books lb JOIN books b ON lb.book_id = b.id JOIN students s ON lb.student_id = s.id WHERE lb.due_date < CURDATE() AND lb.return_date IS NULL;',
    'attendance below 75%': 'SELECT s.name, (a.present_days / a.total_days * 100) as attendance_percentage FROM students s JOIN attendance a ON s.id = a.student_id WHERE (a.present_days / a.total_days * 100) < 75;'
};

nlpInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    let matchedSQL = null;

    for (let key in nlpExamples) {
        if (query.includes(key) || key.includes(query)) {
            matchedSQL = nlpExamples[key];
            break;
        }
    }

    if (matchedSQL) {
        sqlOutput.innerHTML = `<span style="color: #10b981; font-weight: 600;">Generated SQL:</span><br><br>${matchedSQL}`;
    } else if (query.length > 3) {
        sqlOutput.innerHTML = `<span style="color: #34d399; font-weight: 600;">AI Processing...</span><br><br>SELECT * FROM ${query.includes('student') ? 'students' : query.includes('fee') ? 'fees' : query.includes('book') ? 'books' : 'data'} WHERE condition_based_on_query;`;
    } else {
        sqlOutput.innerHTML = '<span style="color: var(--text-secondary);">Type a question above to see the generated SQL...</span>';
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
const formstatus = document.getElementById('formStatus');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const institution = formData.get('institution');
        const interest = formData.get('interest');
        const message = formData.get('message');

        // Simple validation
        if (!email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // 
        let data = {
            name: name,
            email: email,
            subject: "Grooki - " + interest,
            query: "Institution: " + institution + "\n\n" + message
        }

        const body = JSON.stringify(data);

        formstatus.textContent = `Sending your message...`;

        fetch("https://script.google.com/macros/s/AKfycbww24PTd6LgBC_fpwWqzRrQham461waHrIst8bLeTnvIW-gTh3yihqJ23wvd7ZaVeDe8Q/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: body
        }).then((result) => {
            const submitBtn = this.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#059669';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                this.reset();
            }, 3000);
            formstatus.textContent = ``;
        }).catch((error) => {
            formstatus.textContent = `Oops, something went wrong. Please try again.`;
        });
        // 
        console.log('Contact form submitted:', { name, email, institution, interest, message });
    });
}
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = body.getAttribute('data-theme') === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(15, 20, 25, 0.95)';
    } else {
        header.style.background = body.getAttribute('data-theme') === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(15, 20, 25, 0.9)';
    }
});


// Year
document.getElementById('year').textContent = new Date().getFullYear();