document.addEventListener('DOMContentLoaded', function() {
    function loadReviews() {
        const loader = document.getElementById('loader'); // Находим крутилку
        const reviewContainer = document.querySelector('.review-container'); // Контейнер отзывов
        const imageElement = document.getElementById('review-image');
        const nameTextElement = document.getElementById('review-text-name');
        const textTextElement = document.getElementById('review-text-text');
        const dateTextElement = document.getElementById('review-text-date');


        // Показываем крутилку
        loader.style.display = 'block';

        fetch('/get_reviews/')
            .then(response => response.json())
            .then(reviews => {
                let currentIndex = 0;

                // Функция для смены отзыва
                function changeReview() {
                    // Скрываем содержимое
                    imageElement.style.opacity = 0;
                    nameTextElement.style.opacity = 0;
                    textTextElement.style.opacity = 0;
                    dateTextElement.style.opacity = 0;

                    setTimeout(() => {
                        const nextReview = reviews[currentIndex];

                        // Обновляем данные
                        imageElement.src = nextReview.photo;
                        imageElement.onload = () => {
                            nameTextElement.innerHTML = `
                                <strong>${nextReview.customer_name}, ${nextReview.city}</strong>
                            `;
                            textTextElement.innerHTML = `
                                <p>${nextReview.text}</p>
                            `;
                            dateTextElement.innerHTML = `
                                <p>${nextReview.created_at}</p>
                            `;

                            // Показываем содержимое
                            imageElement.style.opacity = 1;
                            nameTextElement.style.opacity = 1;
                            textTextElement.style.opacity = 1;
                            dateTextElement.style.opacity = 1;

                            // Скрываем крутилку
                            loader.style.display = 'none';
                        };

                        currentIndex = (currentIndex + 1) % reviews.length;
                    }, 500);
                }

                changeReview();
                setInterval(changeReview, 10000);
            })
            .catch(error => {
                console.error('Ошибка загрузки отзывов:', error);
                loader.style.display = 'none'; // Скрываем крутилку при ошибке
            });
    }

    const modal = document.getElementById("myModal");
    const modalOverlay = document.getElementById("modalOverlay");
    const cross = document.getElementById("closeBtn");
    // Функция для проверки query-параметров
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Показать окно, если в URL есть параметр ?showModal=true
    window.onload = function() {
        const promoTextElement = document.getElementById('promo');

        if (getQueryParam('contacts') === 'true') {
            modal.style.display = "flex";
            modalOverlay.style.display = "flex";
            document.body.classList.add('modal-open');
        }

        if (getQueryParam('promo')) {
            promoTextElement.value = getQueryParam('promo');
        }
    };

    // Закрыть окно при клике вне модального контента
    window.onclick = function(event) {
        if (event.target == modalOverlay || event.target == cross) {
            modal.style.display = "none";
            modalOverlay.style.display = "none";
            document.body.classList.remove('modal-open');
        }
    };

    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const sendToWhatsAppButton = document.getElementById('toWhatsappButton');

    // Открытие/закрытие шторки
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
    });

    sendToWhatsAppButton.addEventListener('click', function () {
        sendToWhatsApp();
    })

    // Закрытие шторки при клике на ссылку
    mobileMenu.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            mobileMenu.classList.remove('open');
        }
    });

    // Закрытие шторки при клике вне её области
    document.addEventListener('click', function (event) {
        if (!mobileMenu.contains(event.target) && event.target !== menuToggle) {
            mobileMenu.classList.remove('open');
        }
    });

    function sendToWhatsApp() {
        const customer_name = document.getElementById("customer_name").value;
        const phone = document.getElementById("phone").value;
        const email = document.getElementById("email").value;
        const car_model = document.getElementById("car_model").value;
        const car_brand = document.getElementById("car_brand").value;
        const car_year_from = document.getElementById("car_year_from").value;
        const car_year_to = document.getElementById("car_year_to").value;
        const desired_mileage_to = document.getElementById("desired_mileage_to").value;
        const budget_to = document.getElementById("budget_to").value;
        const promo = document.getElementById("promo").value;

        const fieldIds = [
            "customer_name",
            "phone",
            "email",
            "car_model",
            "car_brand",
            "car_year_from",
            "car_year_to",
            "desired_mileage_to",
            "budget_to",
        ];

        let isValid = true;

        fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.classList.remove("error");
            }
        });

        fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field && !field.value.trim()) {
            field.classList.add("error"); // Добавляем красную тень
            isValid = false;
            }
        });

        if (!isValid) {
        // Если есть ошибки, выходим из функции
        return;
        }

        const phone_to_send = "79143238005"; // Ваш номер телефона с кодом страны (без +)
        const text = `Здравствуйте! Меня зовут ${encodeURIComponent(customer_name)}.%0A
Я хочу заказать автомобиль с такими характеристиками:%0A
- Марка: ${encodeURIComponent(car_brand)}%0A
- Модель: ${encodeURIComponent(car_model)}%0A
- Год выпуска: от ${encodeURIComponent(car_year_from)} до ${encodeURIComponent(car_year_to)}%0A
- Пробег: до ${encodeURIComponent(desired_mileage_to)}%0A
- Бюджет: до ${encodeURIComponent(budget_to)}%0A
Мой телефон: ${encodeURIComponent(phone)}%0A
Мой email: ${encodeURIComponent(email)}%0A
Мой промокод: ${encodeURIComponent(promo)}`

        const whatsappUrl = `https://wa.me/${phone_to_send}?text=${text}`;

        window.open(whatsappUrl, "_blank");
    }

    const gridItems = document.querySelectorAll('.grid-item, .step');

    gridItems.forEach((item) => {
        item.addEventListener('click', function () {
            item.classList.toggle('expanded');
        });
    });

    // Загружаем отзывы при загрузке страницы
    loadReviews();
});
