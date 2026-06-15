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
          background: radial-gradient(circle at 20% 30%, #0a0f1e, #03050a);
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
          background: rgba(20, 25, 45, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-family: inherit;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateX(-3px);
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

        .page-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          background: linear-gradient(135deg, #fff, #a0c0ff, #e0c0ff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 600;
          letter-spacing: -0.02em;
        }

        .page-header p {
          color: rgba(220, 230, 255, 0.7);
          margin-top: 12px;
          font-size: 1.1rem;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 30px;
        }

        .template-card {
          background: rgba(20, 25, 45, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .template-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 35px rgba(0, 0, 0, 0.4);
          background: rgba(30, 35, 60, 0.6);
        }

        .template-preview {
          height: 220px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          position: relative;
          border-bottom: 1px solid rgba(255,255,255,0.1);
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
          color: #fff;
          font-weight: 500;
        }

        .template-info {
          padding: 22px 20px 25px;
        }

        .template-info h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .template-info p {
          color: rgba(200, 210, 255, 0.7);
          font-size: 0.9rem;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        .select-btn {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
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
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(0.98);
        }

        .modal {
          display: ${modalTemplate ? 'flex' : 'none'};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(15px);
          z-index: 1000;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
        }

        .modal-content {
          background: rgba(15, 20, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 40px;
          max-width: 500px;
          width: 90%;
          padding: 30px;
          border: 1px solid rgba(255,255,255,0.3);
          text-align: center;
          animation: modalFadeIn 0.3s ease;
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
          border: 1px solid rgba(255,255,255,0.2);
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-top: 20px;
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
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
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
            background: rgba(20, 25, 45, 0.8);
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
          .page-header h1 {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div ref={gradientRef} className="sky-gradient"></div>
      <div className="stars" ref={starsRef}></div>
      <div className="particle-field" ref={particlesRef}></div>
      <div className="glow-overlay"></div>
      <div className="mist"></div>

      <div className="top-buttons">
        <Link href="/" className="nav-btn" title="На главную">← На главную</Link>
        <Link href="/template-editor" className="nav-btn" title="Создать новый шаблон">➕ Создать новый шаблон</Link>
      </div>

      <div className="container">
        <div className="page-header">
          <h1>НЕЙМАРК | Шедевры email-дизайна</h1>
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
          <p style={{ color: '#ccc' }}>{modalTemplate?.desc}</p>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={closeModal}>Отмена</button>
            <button className="modal-btn confirm" onClick={confirmSelect}>Редактировать</button>
          </div>
        </div>
      </div>
    </>
  );
}