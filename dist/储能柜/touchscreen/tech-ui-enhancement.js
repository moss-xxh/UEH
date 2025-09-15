// 科技感UI动态效果增强

// 初始化科技感UI
function initTechUI() {
    // 添加背景纹理
    addTechPattern();
    
    // 增强数值动画
    enhanceValueAnimations();
    
    // 添加粒子效果
    addParticleEffects();
    
    // 增强按钮交互
    enhanceButtonInteractions();
    
    // 添加打字机效果
    addTypewriterEffect();
    
    // 增强图表动画
    enhanceChartAnimations();
}

// 添加科技感背景纹理
function addTechPattern() {
    const pattern = document.createElement('div');
    pattern.className = 'tech-pattern';
    document.body.appendChild(pattern);
}

// 增强数值变化动画
function enhanceValueAnimations() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target;
                if (target.classList && (target.classList.contains('metric-value') || 
                    target.classList.contains('card-value') || 
                    target.classList.contains('stat-number'))) {
                    target.classList.add('updating');
                    setTimeout(() => {
                        target.classList.remove('updating');
                    }, 500);
                }
            }
        });
    });

    // 监听所有数值元素
    document.querySelectorAll('.metric-value, .card-value, .stat-number').forEach(el => {
        observer.observe(el, { 
            childList: true, 
            characterData: true, 
            subtree: true 
        });
    });
}

// 添加粒子效果（用于特殊页面）
function addParticleEffects() {
    if (document.querySelector('.login-container')) {
        createLoginParticles();
    }
}

// 创建登录页面粒子效果
function createLoginParticles() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = `rgba(30, 144, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 连接临近粒子
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(30, 144, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 增强按钮交互效果
function enhanceButtonInteractions() {
    document.querySelectorAll('button, .btn, .control-btn, .action-btn').forEach(btn => {
        // 添加波纹效果
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });

        // 添加悬停发光效果
        btn.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(30, 144, 255, 0.5)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// 添加打字机效果
function addTypewriterEffect() {
    const titles = document.querySelectorAll('.login-title, .chart-title, .section-title');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.style.visibility = 'visible';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // 延迟开始，创建渐进效果
        setTimeout(typeWriter, Math.random() * 500);
    });
}

// 增强图表动画
function enhanceChartAnimations() {
    const charts = document.querySelectorAll('.chart-content, .chart-area');
    
    charts.forEach(chart => {
        // 添加扫描线效果
        const scanLine = document.createElement('div');
        scanLine.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, transparent, #00d4ff, transparent);
            animation: scanLine 3s linear infinite;
            pointer-events: none;
        `;
        
        chart.style.position = 'relative';
        chart.appendChild(scanLine);
    });
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes scanLine {
        from { left: -2px; }
        to { left: 100%; }
    }
    
    /* 增强的加载动画 */
    .loading {
        position: relative;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: -3px;
        left: -3px;
        right: -3px;
        bottom: -3px;
        background: linear-gradient(45deg, transparent, #00d4ff, transparent);
        border-radius: 50%;
        opacity: 0.5;
        animation: loadingRotate 1s linear infinite;
    }
    
    @keyframes loadingRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* 科技感文字阴影 */
    .login-title, .chart-title, .section-title {
        text-shadow: 0 0 20px rgba(30, 144, 255, 0.5);
    }
    
    /* 增强的悬停效果 */
    .overview-card:hover .card-icon,
    .stat-card:hover .stat-icon {
        animation: iconPulse 1s ease-in-out infinite;
    }
    
    @keyframes iconPulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(5deg); }
    }
`;
document.head.appendChild(style);

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTechUI);
} else {
    initTechUI();
}

// 导出给全局使用
window.TechUI = {
    init: initTechUI,
    addParticles: addParticleEffects,
    enhanceButtons: enhanceButtonInteractions
};