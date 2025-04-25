// Проверка загрузки темы при запуске
console.log('Инициализация темы...');
console.log('Текущая тема из localStorage:', localStorage.getItem('theme'));
console.log('Системные настройки:', window.matchMedia('(prefers-color-scheme: dark)').matches);

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let students = [
    { id: 1, firstName: "Вадим", lastName: "Бабинский", score: 0, history: [] },
    { id: 2, firstName: "София", lastName: "Баркалова", score: 0, history: [] },
    { id: 3, firstName: "Владимир", lastName: "Богатырев", score: 0, history: [] },
    { id: 4, firstName: "Антон", lastName: "Веселов", score: 0, history: [] },
    { id: 5, firstName: "Милана", lastName: "Железняк", score: 0, history: [] },
    { id: 6, firstName: "Дмитрий", lastName: "Иванов", score: 0, history: [] },
    { id: 7, firstName: "Владислав", lastName: "Каминский", score: 0, history: [] },
    { id: 8, firstName: "Никита", lastName: "Киселёв", score: 0, history: [] },
    { id: 9, firstName: "Виктория", lastName: "Колодинская", score: 0, history: [] },
    { id: 10, firstName: "Денис", lastName: "Колосович", score: 0, history: [] },
    { id: 11, firstName: "Кирилл", lastName: "Комаров", score: 0, history: [] },
    { id: 12, firstName: "Владимир", lastName: "Лопарёв", score: 0, history: [] },
    { id: 13, firstName: "Никита", lastName: "Маханьков", score: 0, history: [] },
    { id: 14, firstName: "Никита", lastName: "Прохоренков", score: 0, history: [] },
    { id: 15, firstName: "Даниил", lastName: "Реут", score: 0, history: [] },
    { id: 16, firstName: "Алексей", lastName: "Сафонов", score: 0, history: [] },
    { id: 17, firstName: "Иван", lastName: "Слышанков", score: 0, history: [] },
    { id: 18, firstName: "Станислав", lastName: "Сметанин", score: 0, history: [] },
    { id: 19, firstName: "Владислав", lastName: "Струнин", score: 0, history: [] },
    { id: 20, firstName: "Юлия", lastName: "Фомина", score: 0, history: [] },
    { id: 21, firstName: "Мария", lastName: "Черняк", score: 0, history: [] },
    { id: 22, firstName: "Анатолий", lastName: "Чижиков", score: 0, history: [] },
    { id: 23, firstName: "Иван", lastName: "Швец", score: 0, history: [] },
    { id: 24, firstName: "Полина", lastName: "Шевченко", score: 0, history: [] },
    { id: 25, firstName: "Дарья", lastName: "Шукайло", score: 0, history: [] }
];

let loginAttempts = 0;
const MAX_ATTEMPTS = 3;

// ===== СИСТЕМА ТЕМ =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(initialTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            
            document.documentElement.classList.remove(isDark ? 'dark' : 'light');
            document.documentElement.classList.add(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ===== МОДАЛЬНОЕ ОКНО =====
function setupPasswordModal() {
    const modal = document.getElementById('passwordModal');
    const input = document.getElementById('modalPasswordInput');
    const title = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('modalSubmit');
    const cancelBtn = document.getElementById('modalCancel');
    const toggleBtn = document.getElementById('togglePassword');

    // Переключение видимости пароля
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleBtn.classList.toggle('fa-eye-slash', !isPassword);
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        input.value = '';
    }

    // Закрытие по клику вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);

    return {
        show: (isSetup = false) => {
            title.textContent = isSetup ? 'Установите пароль админки' : 'Введите пароль';
            submitBtn.textContent = isSetup ? 'Сохранить' : 'Войти';
            modal.style.display = 'flex';
            input.focus();
        },
        close: closeModal,
        getInputValue: () => input.value.trim(),
        setSubmitHandler: (handler) => {
            submitBtn.onclick = (e) => {
                e.preventDefault();
                handler(input.value.trim());
            };
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handler(input.value.trim());
                }
            };
        }
    };
}

// ===== РАБОТА С ДАННЫМИ =====
function saveData() {
    const dataToSave = students.map(student => ({
        id: student.id,
        score: student.score,
        history: student.history
    }));
    localStorage.setItem('studentData', JSON.stringify(dataToSave));
}

function loadData() {
    const data = localStorage.getItem('studentData');
    if (data) {
        const parsed = JSON.parse(data);
        students = students.map(student => {
            const savedData = parsed.find(s => s.id === student.id);
            return savedData ? {
                ...student,
                score: savedData.score,
                history: savedData.history || []
            } : student;
        });
    }
}

// ===== ГЛАВНАЯ СТРАНИЦА =====
function initMainPage() {
    const studentsList = document.getElementById('studentsList');
    const searchInput = document.getElementById('searchInput');
    const adminBtn = document.getElementById('adminLogin');

    function renderStudents(studentsArray = students) {
        studentsList.innerHTML = studentsArray.map(student => `
            <div class="student-card" data-id="${student.id}">
                <h3>${student.lastName} ${student.firstName}</h3>
                <p>${student.score} баллов</p>
            </div>
        `).join('');
        
        document.querySelectorAll('.student-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                localStorage.setItem('currentStudentId', id);
                window.location.href = 'student.html';
            });
        });
    }

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = students.filter(s => 
            `${s.lastName} ${s.firstName}`.toLowerCase().includes(term)
        );
        renderStudents(filtered);
    });

    // Инициализация админ-доступа
    const passwordModal = setupPasswordModal();
    
    adminBtn.addEventListener('click', () => {
        if (!localStorage.getItem('adminPassword')) {
            passwordModal.show(true);
            passwordModal.setSubmitHandler((password) => {
                if (password) {
                    localStorage.setItem('adminPassword', password);
                    alert('Пароль сохранён! Теперь войдите с ним.');
                    passwordModal.close();
                }
            });
        } else {
            loginAttempts = 0;
            passwordModal.show(false);
            passwordModal.setSubmitHandler((password) => {
                if (password === localStorage.getItem('adminPassword')) {
                    window.location.href = 'admin.html';
                } else {
                    loginAttempts++;
                    alert(`Неверный пароль! Осталось попыток: ${MAX_ATTEMPTS - loginAttempts}`);
                    if (loginAttempts >= MAX_ATTEMPTS) {
                        alert('Доступ заблокирован. Попробуйте позже.');
                        passwordModal.close();
                    }
                }
            });
        }
    });

    renderStudents();
}

// ===== АДМИН-ПАНЕЛЬ =====
function initAdminPage() {
    const studentSelect = document.getElementById('studentSelect');
    const scoreInput = document.getElementById('scoreInput');
    const reasonInput = document.getElementById('reasonInput');
    const addBtn = document.getElementById('addScore');
    const removeBtn = document.getElementById('removeScore');
    const backBtn = document.getElementById('backToMain');

    function updateSelect() {
        studentSelect.innerHTML = students.map(s => `
            <option value="${s.id}">${s.lastName} ${s.firstName} (${s.score})</option>
        `).join('');
    }

    function modifyScore(isAddition) {
        const studentId = parseInt(studentSelect.value);
        const points = parseInt(scoreInput.value);
        const reason = reasonInput.value.trim();
        
        if (!studentId || isNaN(points) || !reason) {
            alert('Заполните все поля корректно!');
            return;
        }
        
        const student = students.find(s => s.id === studentId);
        if (!isAddition && points > student.score) {
            alert('Нельзя снять больше баллов, чем есть у студента!');
            return;
        }
        
        student.score += isAddition ? points : -points;
        student.history.push({
            date: new Date().toLocaleString(),
            change: `${isAddition ? '+' : '-'}${points}`,
            reason
        });
        
        saveData();
        updateSelect();
        scoreInput.value = '';
        reasonInput.value = '';
    }

    addBtn.addEventListener('click', () => modifyScore(true));
    removeBtn.addEventListener('click', () => modifyScore(false));

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Сброс пароля по двойному клику
    document.querySelector('header h1')?.addEventListener('dblclick', () => {
        if (confirm('Сбросить пароль админки?')) {
            localStorage.removeItem('adminPassword');
            alert('Пароль сброшен! При следующем входе установите новый.');
        }
    });

    updateSelect();
}

// ===== СТРАНИЦА СТУДЕНТА =====
function initStudentPage() {
    const studentName = document.getElementById('studentName');
    const studentScore = document.getElementById('studentScore');
    const historyList = document.getElementById('scoreHistory');
    const backBtn = document.getElementById('backToMain');

    const studentId = parseInt(localStorage.getItem('currentStudentId'));
    const student = students.find(s => s.id === studentId);

    if (student) {
        studentName.textContent = `${student.lastName} ${student.firstName}`;
        studentScore.textContent = student.score;
        
        historyList.innerHTML = student.history.map(item => `
            <div class="history-item ${item.change.startsWith('+') ? 'positive' : 'negative'}">
                <p><strong>${item.date}</strong>: ${item.change} (${item.reason})</p>
            </div>
        `).join('') || '<p>Нет истории изменений</p>';
    }

    backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadData();

    if (window.location.pathname.endsWith('admin.html')) {
        initAdminPage();
    } else if (window.location.pathname.endsWith('student.html')) {
        initStudentPage();
    } else {
        initMainPage();
    }
});