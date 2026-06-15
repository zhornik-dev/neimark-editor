'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const starsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqItems = [
    { question: 'Можно ли использовать свои изображения?', answer: 'Да, вы можете вставлять ссылки на любые изображения из интернета.' },
    { question: 'Как отправить готовое письмо?', answer: 'Скопируйте HTML-код и вставьте его в любой email-сервис.' },
    { question: 'Бесплатно ли это?', answer: 'Да, конструктор полностью бесплатный, без ограничений.' },
  ];

  useEffect(() => {
    const starsContainer = starsRef.current;
    if (starsContainer) {
      starsContainer.innerHTML = '';
      for (let i = 0; i < 250; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = duration + 's';
        star.style.animationDelay = Math.random() * 5 + 's';
        starsContainer.appendChild(star);
      }
    }

    const particlesContainer = particlesRef.current;
    if (particlesContainer) {
      particlesContainer.innerHTML = '';
      for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 70 + 30;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.setProperty('--dx', String((Math.random() - 0.5) * 180));
        const duration = Math.random() * 12 + 8;
        const delay = Math.random() * 15;
        particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
        const hue = Math.random() * 40 + 200;
        particle.style.background = `radial-gradient(circle, rgba(${hue-30},${hue-100},255,0.5) 0%, rgba(${hue-20},${hue-80},200,0.2) 70%, transparent 100%)`;
        particlesContainer.appendChild(particle);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!gradientRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gradientRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, #19213f, #0a0f1e)`;
      gradientRef.current.style.backgroundSize = '100% 100%';
      gradientRef.current.style.transition = 'background 0.3s ease';
      
      clearTimeout((window as any).mouseTimeout);
      (window as any).mouseTimeout = setTimeout(() => {
        if (gradientRef.current) {
          gradientRef.current.style.background = '';
          gradientRef.current.style.backgroundSize = '200% 200%';
          gradientRef.current.style.animation = 'auroraFlow 18s ease infinite';
        }
      }, 1500);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '0px';
      ripple.style.height = '0px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(180, 220, 255, 0.4)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '100';
      ripple.style.boxShadow = '0 0 30px rgba(120, 180, 255, 0.8)';
      ripple.style.transition = 'all 1s ease-out';
      document.body.appendChild(ripple);
      
      requestAnimationFrame(() => {
        ripple.style.width = '200px';
        ripple.style.height = '200px';
        ripple.style.opacity = '0';
      });
      
      setTimeout(() => ripple.remove(), 1000);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const container = particlesRef.current;
      if (container) {
        container.innerHTML = '';
        for (let i = 0; i < 35; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          const size = Math.random() * 70 + 30;
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          particle.style.left = Math.random() * 100 + '%';
          particle.style.setProperty('--dx', String((Math.random() - 0.5) * 180));
          const duration = Math.random() * 12 + 8;
          const delay = Math.random() * 15;
          particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
          const hue = Math.random() * 40 + 200;
          particle.style.background = `radial-gradient(circle, rgba(${hue-30},${hue-100},255,0.5) 0%, rgba(${hue-20},${hue-80},200,0.2) 70%, transparent 100%)`;
          container.appendChild(particle);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>НЕЙМАРК | Конструктор email-шаблонов</title>
        <meta name="description" content="Бесплатный конструктор email-шаблонов для платформ VK и MAX" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          min-height: 100vh;
          background: radial-gradient(circle at 20% 30%, #0a0f1e, #03050a);
          overflow-x: hidden;
          position: relative;
          font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, 'Roboto', sans-serif;
        }

        .sky-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(125deg, 
            #0b1120 0%, 
            #1a1f35 25%, 
            #2a1e3c 50%, 
            #1f2a3e 75%, 
            #0a0f1c 100%);
          background-size: 200% 200%;
          animation: auroraFlow 18s ease infinite;
          z-index: 0;
        }

        @keyframes auroraFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .particle-field {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          filter: blur(6px);
          animation: floatParticle linear infinite;
          opacity: 0;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(100vh) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-20vh) translateX(calc(var(--dx, 0) * 1px)) scale(0.6);
            opacity: 0;
          }
        }

        .stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .star {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 4s infinite alternate;
        }

        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.2); }
        }

        .glow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 70% 40%, rgba(80,120,200,0.15) 0%, rgba(0,0,0,0.4) 80%);
          z-index: 0;
          pointer-events: none;
        }

        .mist {
          position: fixed;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: repeating-linear-gradient( 
            45deg,
            rgba(255,255,255,0.02) 0px,
            rgba(255,255,255,0.02) 2px,
            transparent 2px,
            transparent 8px
          );
          animation: drift 60s linear infinite;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes drift {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(5%, 5%) rotate(2deg); }
        }

        .hero-title {
          position: relative;
          z-index: 10;
          text-align: center;
          padding-top: 6vh;
          pointer-events: none;
        }

        .hero-title h1 {
          font-size: clamp(1.8rem, 6vw, 3.5rem);
          font-weight: 600;
          background: linear-gradient(135deg, #ffffff, #a0c0ff, #c0a0ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: titleShine 4s ease infinite;
          text-shadow: 0 0 30px rgba(100, 150, 255, 0.3);
          letter-spacing: -0.02em;
        }

        @keyframes titleShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-sub {
          margin-top: 1rem;
          font-size: clamp(0.85rem, 3vw, 1.1rem);
          color: rgba(220, 230, 255, 0.7);
          font-weight: 400;
          letter-spacing: 0.3px;
        }

        .steps-container {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 30px auto 20px;
          padding: 0 20px;
          pointer-events: auto;
        }

        .steps-card {
          background: rgba(20, 25, 45, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 28px 24px;
          transition: all 0.3s ease;
        }

        .steps-title {
          text-align: center;
          margin-bottom: 24px;
        }

        .steps-title span {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(108, 92, 231, 0.4);
          padding: 6px 16px;
          border-radius: 40px;
          letter-spacing: 0.5px;
        }

        .steps-grid {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .step-item {
          flex: 1;
          min-width: 180px;
          text-align: center;
          padding: 16px 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          transition: all 0.3s ease;
        }

        .step-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        .step-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .step-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }

        .step-desc {
          font-size: 0.8rem;
          color: rgba(220, 230, 255, 0.7);
          line-height: 1.4;
        }

        .button-container {
          position: relative;
          z-index: 10;
          text-align: center;
          margin-top: 20px;
          margin-bottom: 30px;
          pointer-events: auto;
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .create-btn {
          display: inline-block;
          padding: 14px 42px;
          font-size: 1.2rem;
          font-weight: 600;
          font-family: inherit;
          color: white;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 60px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .create-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: scale(1.02);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        }

        .footer {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 30px 20px 40px;
          margin-top: 20px;
          pointer-events: auto;
        }

        .vk-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 28px;
          background: rgba(0, 119, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 119, 255, 0.4);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-family: inherit;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .vk-link:hover {
          background: rgba(0, 119, 255, 0.3);
          border-color: rgba(0, 119, 255, 0.7);
          transform: scale(1.02);
        }

        .vk-icon {
          width: 24px;
          height: 24px;
          fill: #ffffff;
        }

        .faq-container {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto 40px;
          padding: 0 20px;
          pointer-events: auto;
        }

        .faq-card {
          background: rgba(20, 25, 45, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 28px 24px;
        }

        .faq-title {
          text-align: center;
          margin-bottom: 24px;
        }

        .faq-title span {
          font-size: 1.1rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          background: rgba(108, 92, 231, 0.4);
          padding: 6px 16px;
          border-radius: 40px;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .faq-item:last-child {
          border-bottom: none;
        }

        .faq-question {
          padding: 18px 0;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: rgba(255, 255, 255, 0.03);
          margin: 0 -10px;
          padding: 18px 10px;
          border-radius: 16px;
        }

        .faq-question-text {
          font-size: 1rem;
          font-weight: 500;
          color: white;
          padding-right: 20px;
        }

        .faq-icon {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.2rem;
          transition: transform 0.3s ease;
          min-width: 24px;
          text-align: center;
        }

        .faq-item.active .faq-icon {
          transform: rotate(180deg);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-out;
        }

        .faq-item.active .faq-answer {
          max-height: 200px;
          padding-bottom: 18px;
        }

        .faq-answer p {
          color: rgba(220, 230, 255, 0.8);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        @media (max-width: 700px) {
          .hero-title {
            padding-top: 4vh;
          }
          .steps-container {
            margin: 20px auto 15px;
          }
          .steps-grid {
            flex-direction: column;
            gap: 12px;
          }
          .step-item {
            display: flex;
            align-items: center;
            text-align: left;
            gap: 16px;
            padding: 14px 18px;
          }
          .step-icon {
            margin-bottom: 0;
            font-size: 2rem;
          }
          .step-text {
            flex: 1;
          }
          .step-title {
            margin-bottom: 4px;
          }
          .button-container {
            margin-top: 15px;
            margin-bottom: 20px;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .create-btn {
            padding: 12px 32px;
            font-size: 1rem;
          }
          .faq-container {
            margin: 0 auto 30px;
          }
          .faq-question-text {
            font-size: 0.9rem;
          }
          .vk-link {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div ref={gradientRef} className="sky-gradient"></div>
      <div className="stars" ref={starsRef}></div>
      <div className="particle-field" ref={particlesRef}></div>
      <div className="glow-overlay"></div>
      <div className="mist"></div>

      <div className="hero-title">
        <h1>НЕЙМАРК | Бесплатный конструктор email-шаблонов</h1>
        <div className="hero-sub">Создавайте письма, которые запоминаются</div>
      </div>

      <div className="steps-container">
        <div className="steps-card">
          <div className="steps-title">
            <span>📋 3 простых шага</span>
          </div>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-icon">1️⃣</div>
              <div className="step-text">
                <div className="step-title">Выберите шаблон</div>
                <div className="step-desc">Изучите коллекцию из 6 уникальных шаблонов и выберите подходящий</div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-icon">2️⃣</div>
              <div className="step-text">
                <div className="step-title">Добавьте контент</div>
                <div className="step-desc">Редактируйте текст, вставляйте изображения, настраивайте шрифты и цвета</div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-icon">3️⃣</div>
              <div className="step-text">
                <div className="step-title">Получите HTML</div>
                <div className="step-desc">Скопируйте код в буфер обмена или скачайте готовый HTML-файл</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="button-container">
        <Link href="/editor" className="create-btn">✨ Создать письмо</Link>
      </div>

      <div className="faq-container">
        <div className="faq-card">
          <div className="faq-title">
            <span>❓ Часто задаваемые вопросы</span>
          </div>
          {faqItems.map((item, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span className="faq-question-text">{item.question}</span>
                <span className="faq-icon">▼</span>
              </div>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer">
        <a 
          href="https://vk.com/neimark_it" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="vk-link"
        >
          <svg className="vk-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.579 6.855c.14-.465 0-.805-.662-.805h-2.193c-.557 0-.813.295-.953.62 0 0-1.115 2.719-2.695 4.482-.51.51-.742.673-1.02.673-.14 0-.34-.163-.34-.628V6.855c0-.558-.16-.805-.626-.805h-3.44c-.348 0-.558.258-.558.504 0 .528.79.65.87 2.136v3.227c0 .706-.127.834-.406.834-.742 0-2.545-2.723-3.615-5.84-.21-.6-.422-.84-.98-.84H4.218c-.65 0-.78.295-.78.62 0 .58.744 3.458 3.464 7.267 1.813 2.634 4.367 4.062 6.69 4.062 1.395 0 1.566-.314 1.566-.856v-1.977c0-.62.135-.834.585-.834.33 0 .9.165 2.225 1.437 1.515 1.515 1.765 2.194 2.616 2.194h2.193c.65 0 .976-.314.785-.93-.205-.637-.94-1.558-1.915-2.652-.53-.61-1.325-1.27-1.565-1.6-.335-.42-.24-.61 0-.99 0 0 2.765-3.894 3.045-5.22z" fill="white"/>
          </svg>
          НЕЙМАРК во ВКонтакте
        </a>
      </div>
    </>
  );
}