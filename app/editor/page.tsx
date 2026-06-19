'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

interface Template {
  id: number;
  name: string;
  desc: string;
  previewBg: string;
  badge: string;
}

const templates: Template[] = [
  { id: 1, name: "✨ Aurora Elegance", desc: "Сияющий градиент, идеально для новостных рассылок и вдохновляющих писем.", previewBg: "linear-gradient(145deg, #0a192f, #1e3a5f, #2d4a7a)", badge: "Премиум" },
  { id: 2, name: "🌿 Minimal Nature", desc: "Свежий, природный стиль с мягкими тенями — для эко-брендов и лаунж-стиля.", previewBg: "linear-gradient(125deg, #1e3a2f, #2a5a4a, #3c7a60)", badge: "Популярный" },
  { id: 3, name: "💎 Luxury Gold", desc: "Роскошь, золотые акценты, подходит для премиум-продуктов и приглашений.", previewBg: "linear-gradient(135deg, #2c2418, #5e4b2f, #927f5f)", badge: "Эксклюзив" },
  { id: 4, name: "🚀 Tech Future", desc: "Футуристичный темный стиль с неоновыми бликами — для IT и инноваций.", previewBg: "linear-gradient(115deg, #0b0f1c, #161b33, #242a55)", badge: "Современный" },
  { id: 5, name: "🌸 Spring Blossom", desc: "Нежные пастельные оттенки, романтичный и тёплый дизайн для fashion / beauty.", previewBg: "linear-gradient(140deg, #f5cdd9, #f8e0c0, #fce8e0)", badge: "Весенний" },
  { id: 6, name: "🎄 Festive Magic", desc: "Праздничное настроение, идеально для рождественских и новогодних рассылок.", previewBg: "linear-gradient(120deg, #8b1e1e, #c23b3b, #e07a5f)", badge: "Сезонный" }
];

export default function EditorPage() {
  const router = useRouter();
  const starsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const [modalTemplate, setModalTemplate] = useState<Template | null>(null);

  useEffect(() => {
    // Создание звёзд
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

    // Создание партиклов
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
        const hue = Math.random() * 40 + 220;
        particle.style.background = `radial-gradient(circle, rgba(${hue-20},${hue-80},255,0.3) 0%, rgba(${hue-10},${hue-50},200,0.1) 70%, transparent 100%)`;
        particlesContainer.appendChild(particle);
      }
    }

    // Мышь интеракшн
    const handleMouseMove = (e: MouseEvent) => {
      if (!gradientRef.current) return;
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      gradientRef.current.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(40,50,80,0.6), rgba(10,10,20,1))`;
      gradientRef.current.style.transition = 'background 0.3s ease';
      
      clearTimeout((window as any).mouseTimeout);
      (window as any).mouseTimeout = setTimeout(() => {
        if (gradientRef.current) {
          gradientRef.current.style.background = '';
          gradientRef.current.style.animation = 'auroraFlow 18s ease infinite';
        }
      }, 1500);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Рипл эффект при клике
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '0px';
      ripple.style.height = '0px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(100, 150, 255, 0.3)';
      ripple.style.transform = 'translate(-50%, -50%)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '100';
      ripple.style.boxShadow = '0 0 40px rgba(80, 130, 255, 0.4)';
      ripple.style.transition = 'all 1s ease-out';
      document.body.appendChild(ripple);
      
      requestAnimationFrame(() => {
        ripple.style.width = '300px';
        ripple.style.height = '300px';
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

  // Ресайз
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
          const hue = Math.random() * 40 + 220;
          particle.style.background = `radial-gradient(circle, rgba(${hue-20},${hue-80},255,0.3) 0%, rgba(${hue-10},${hue-50},200,0.1) 70%, transparent 100%)`;
          container.appendChild(particle);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openModal = (template: Template) => {
    setModalTemplate(template);
  };

  const closeModal = () => {
    setModalTemplate(null);
  };

  const confirmSelect = () => {
    if (modalTemplate) {
      router.push(`/template-editor?id=${modalTemplate.id}`);
    }
    closeModal();
  };

  return (
    <>
      <Head>
        <title>НЕЙМАРК | Выбор шаблона</title>
        <meta name="description" content="Выберите шаблон для создания письма" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          min-height: 100vh;
          background: #0a0a0f;
          font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, 'Roboto', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        .sky-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(125deg, 
            #0a0a12 0%, 
            #12121f 25%, 
            #1a1a2e 50%, 
            #12121f 75%, 
            #0a0a12 100%);
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
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
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
          background-color: rgba(255,255,255,0.8);
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 4s infinite alternate;
        }

        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(1); }
          100% { opacity: 0.9; transform: scale(1.2); }
        }

        .glow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(ellipse at 70% 40%, rgba(60,80,150,0.08) 0%, rgba(0,0,0,0.6) 80%);
          z-index: 0;
          pointer-events: none;
        }

        .top-buttons {
          position: fixed;
          top: 25px;
          left: 25px;
          z-index: 20;
          display: flex;
          gap: 15px;
          pointer-events: auto;
        }

        .nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-family: inherit;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(-3px);
          color: rgba(255, 255, 255, 0.9);
        }

        .container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 30px 80px;
          pointer-events: auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .page-header .logo-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .page-header .logo-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
        }

        .page-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .page-header h1 .accent {
          background: linear-gradient(135deg, #6c8cff, #a78bfa);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .page-header p {
          color: rgba(220, 230, 255, 0.5);
          margin-top: 4px;
          font-size: 1.1rem;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }

        .template-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .template-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(108, 92, 231, 0.4);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }

        .template-preview {
          height: 220px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .template-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .template-info {
          padding: 22px 20px 25px;
        }

        .template-info h3 {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .template-info p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .select-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 20px;
          border-radius: 40px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
          font-family: inherit;
          backdrop-filter: blur(4px);
        }

        .select-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(108, 92, 231, 0.4);
          transform: scale(0.98);
          color: rgba(255, 255, 255, 0.95);
        }

        .modal {
          display: ${modalTemplate ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          z-index: 1000;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
          padding: 20px;
        }

        .modal-content {
          background: rgba(15, 20, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.15);
          text-align: center;
          animation: modalFadeIn 0.3s ease;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-content h3 {
          color: white;
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .modal-preview-img {
          width: 100%;
          height: 180px;
          background-size: cover;
          background-position: center;
          border-radius: 24px;
          margin: 20px 0;
          border: 1px solid rgba(255,255,255,0.15);
          flex-shrink: 0;
        }

        .modal-content > p {
          color: rgba(255,255,255,0.7);
          flex-shrink: 0;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
          flex-shrink: 0;
        }

        .modal-btn {
          padding: 10px 28px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: 0.2s;
        }

        .modal-btn.confirm {
          background: linear-gradient(135deg, #6c5ce7, #a363d9);
          color: white;
        }

        .modal-btn.cancel {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .modal-btn.confirm:hover {
          transform: scale(1.02);
          background: linear-gradient(135deg, #7d6ef7, #b574e9);
        }

        @media (max-width: 760px) {
          .container {
            padding: 20px 16px 50px;
          }
          .templates-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .top-buttons {
            position: relative;
            top: 0;
            left: 0;
            justify-content: center;
            margin-bottom: 20px;
            background: rgba(20, 25, 45, 0.6);
            backdrop-filter: blur(12px);
            padding: 12px;
            border-radius: 60px;
          }
          .nav-btn {
            padding: 6px 16px;
            font-size: 0.85rem;
          }
          .page-header {
            margin-top: 0;
            padding-top: 0;
          }
          .page-header .logo-icon {
            width: 36px;
            height: 36px;
          }
          .page-header .logo-wrapper {
            gap: 8px;
          }
          .page-header h1 {
            font-size: 1.8rem;
          }
          .modal-content {
            padding: 20px;
            max-height: 85vh;
          }
          .modal-content h3 {
            font-size: 1.4rem;
          }
          .modal-preview-img {
            height: 120px;
            margin: 12px 0;
          }
          .modal-btn {
            padding: 8px 20px;
            font-size: 0.9rem;
          }
        }

        /* Горизонтальная ориентация на мобильных устройствах */
        @media (max-width: 900px) and (orientation: landscape) {
          .modal {
            padding: 10px;
          }
          .modal-content {
            max-width: 600px;
            max-height: 85vh;
            padding: 16px 24px;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 16px;
          }
          .modal-content h3 {
            font-size: 1.3rem;
            margin-bottom: 0;
            width: 100%;
            text-align: center;
          }
          .modal-preview-img {
            height: 100px;
            width: 200px;
            flex: 1;
            margin: 0;
            min-width: 150px;
          }
          .modal-content > p {
            flex: 1;
            min-width: 150px;
            font-size: 0.85rem;
            margin: 0;
          }
          .modal-actions {
            width: 100%;
            margin-top: 12px;
          }
          .modal-btn {
            padding: 8px 24px;
            font-size: 0.85rem;
          }
        }

        @media (max-width: 500px) and (orientation: landscape) {
          .modal-content {
            padding: 12px 16px;
            gap: 10px;
          }
          .modal-content h3 {
            font-size: 1.1rem;
          }
          .modal-preview-img {
            height: 70px;
            min-width: 100px;
          }
          .modal-content > p {
            font-size: 0.75rem;
          }
          .modal-btn {
            padding: 6px 16px;
            font-size: 0.75rem;
          }
        }
      `}</style>

      <div ref={gradientRef} className="sky-gradient"></div>
      <div className="stars" ref={starsRef}></div>
      <div className="particle-field" ref={particlesRef}></div>
      <div className="glow-overlay"></div>

      <div className="top-buttons">
        <Link href="/" className="nav-btn" title="На главную">← На главную</Link>
        <Link href="/template-editor" className="nav-btn" title="Создать новый шаблон">➕ Создать новый шаблон</Link>
      </div>

      <div className="container">
        <div className="page-header">
          <div className="logo-wrapper">
            <svg className="logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.1504 26.8305V11.5695H13.6692V26.8305H12.1504ZM25.8195 26.8305V11.5695H27.3382V26.8305H25.8195ZM14.6959 18.4359H24.7927V19.9641H14.6959V18.4359ZM36.4298 5.45653V8.513H39.4672V32.9435H36.4298V36H15.188V32.9435H6.07518C2.7381 32.9435 0 30.1883 0 26.8305V8.513C0 5.15515 2.7381 2.4 6.07518 2.4H27.317V5.45653H6.07518C5.2409 5.45653 4.4922 5.80088 3.93603 6.36053C3.37985 6.92018 3.03763 7.67353 3.03763 8.513V26.8305C3.03763 27.67 3.37985 28.4233 3.93603 28.983C4.4922 29.5425 5.2409 29.887 6.07518 29.887H15.188V32.9435H36.4298V8.513H27.317V5.45653H36.4298Z" fill="#FD9968"/>
            </svg>
            <h1>
              НЕЙМАРК <span className="accent">|</span> Шедевры email-дизайна
            </h1>
          </div>
          <p>Выберите шаблон — и создайте идеальное письмо</p>
        </div>

        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card" onClick={() => openModal(template)}>
              <div className="template-preview" style={{ background: template.previewBg }}>
                <div className="template-badge">{template.badge}</div>
              </div>
              <div className="template-info">
                <h3>{template.name}</h3>
                <p>{template.desc}</p>
                <button className="select-btn" onClick={(e) => { e.stopPropagation(); openModal(template); }}>
                  Выбрать шаблон →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal">
        <div className="modal-content">
          <h3>{modalTemplate?.name}</h3>
          <div className="modal-preview-img" style={{ background: modalTemplate?.previewBg }}></div>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{modalTemplate?.desc}</p>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={closeModal}>Отмена</button>
            <button className="modal-btn confirm" onClick={confirmSelect}>Редактировать</button>
          </div>
        </div>
      </div>
    </>
  );
}