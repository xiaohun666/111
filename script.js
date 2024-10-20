document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 表单提交处理
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我会尽快回复您。');
            form.reset();
        });
    }

    // 简单的动画效果
    function fadeInElement(element) {
        let opacity = 0;
        element.style.opacity = 0;
        let last = +new Date();
        const tick = function() {
            opacity += (new Date() - last) / 400;
            element.style.opacity = opacity;
            last = +new Date();

            if (opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };
        tick();
    }

    // 为 "关于我" 部分添加淡入效果
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        window.addEventListener('scroll', function() {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                fadeInElement(aboutSection);
            }
        });
    }

    // AI 助手功能
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function addMessage(sender, message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = `${sender}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getAIResponse(message) {
        const responses = [
            "这是一个很好的问题！",
            "让我想想...",
            "我需要更多信息来回答这个问题。",
            "这是一个复杂的话题，但我会尽力解释。",
            "我很高兴你问了这个问题！",
            "您的问题很有趣，让我为您详细解答。",
            "这个问题涉及到了很多方面，我们可以逐一探讨。",
            "您提出了一个很好的观点，我们来深入讨论一下。"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('您', message);
            userInput.value = '';
            
            setTimeout(() => {
                const response = getAIResponse(message);
                addMessage('AI', response);
            }, 1000);
        }
    }

    sendButton.addEventListener('click', handleSendMessage);

    let isComposing = false;

    userInput.addEventListener('compositionstart', () => {
        isComposing = true;
    });

    userInput.addEventListener('compositionend', () => {
        isComposing = false;
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // 加载图片轮播
    function loadImagesFromFolder() {
        const imgFolder = 'imgs/';
        const carouselInner = document.querySelector('.carousel-inner');

        // 使用 fetch 获取 imgs 文件夹中的所有图片
        fetch(imgFolder)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const imageLinks = Array.from(htmlDoc.querySelectorAll('a'))
                    .filter(link => link.href.match(/\.(jpe?g|png|gif)$/i))
                    .map(link => link.href.split('/').pop());

                imageLinks.forEach((img, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;

                    const imgElement = document.createElement('img');
                    imgElement.src = `${imgFolder}${img}`;
                    imgElement.className = 'd-block w-100';
                    imgElement.alt = `照片${index + 1}`;

                    const caption = document.createElement('div');
                    caption.className = 'carousel-caption';
                    caption.innerHTML = `<h5>照片${index + 1}</h5>`;

                    carouselItem.appendChild(imgElement);
                    carouselItem.appendChild(caption);
                    carouselInner.appendChild(carouselItem);
                });

                // 添加轮播控制按钮
                const carousel = document.getElementById('photoCarousel');
                if (imageLinks.length > 1) {
                    carousel.innerHTML += `
                        <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">上一张</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">下一张</span>
                        </button>
                    `;
                }
            })
            .catch(error => console.error('Error loading images:', error));
    }

    loadImagesFromFolder();

    // 处理所有支持中文输入的输入框
    const chineseInputs = document.querySelectorAll('.chinese-input');
    chineseInputs.forEach(input => {
        let isComposing = false;

        input.addEventListener('compositionstart', () => {
            isComposing = true;
        });

        input.addEventListener('compositionend', () => {
            isComposing = false;
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                e.preventDefault();
                if (input.form) {
                    const submitButton = input.form.querySelector('button[type="submit"]');
                    if (submitButton) {
                        submitButton.click();
                    }
                }
            }
        });
    });

    // 处理联系表单提交
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我会尽快回复您。');
            contactForm.reset();
        });
    }
});
