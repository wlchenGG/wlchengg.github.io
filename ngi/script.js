// 导航栏滚动效果
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white', 'shadow-md', 'py-2');
        navbar.classList.remove('py-4');
    } else {
        navbar.classList.remove('bg-white', 'shadow-md', 'py-2');
        navbar.classList.add('py-4');
    }
});

// 移动端菜单切换
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    if (mobileMenu.classList.contains('hidden')) {
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }
});

// 点击链接时关闭移动菜单
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
});

// 锚点链接平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 滚动动画
const animateOnScroll = () => {
    const elements = document.querySelectorAll('section > div > div.text-center, .grid > div');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('animate-fade-in-up');
        }
    });
};

// 页面加载时初始检查
window.addEventListener('load', animateOnScroll);
// 滚动时检查
window.addEventListener('scroll', animateOnScroll);

// 响应式图片处理
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
});
    