'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import Head from 'next/head';

interface TemplateData {
  name: string;
  desc: string;
  badge: string;
  bgGradient: string;
  textColor: string;
  content: string;
}

const templatesData: Record<string, TemplateData> = {
  '1': { 
    name: "✨ Aurora Elegance", 
    desc: "Сияющий градиент, идеально для новостных рассылок", 
    badge: "Премиум",
    bgGradient: "linear-gradient(145deg, #0a192f, #1e3a5f, #2d4a7a)",
    textColor: "#ffffff",
    content: `<h1 style="color: #a0c0ff;">✨ Aurora Elegance</h1><p>Добро пожаловать в нашу новостную рассылку! Сегодня мы подготовили для вас вдохновляющие новости и свежие идеи.</p><h2 style="color: #c0e0ff;">🌟 Главная новость</h2><p>Наши новые продукты доступны для предзаказа. Успейте получить специальную скидку 20% по промокоду <strong>AURORA20</strong>.</p><p>С уважением,<br>Команда Aurora</p>`
  },
  '2': { 
    name: "🌿 Minimal Nature", 
    desc: "Свежий, природный стиль с мягкими тенями", 
    badge: "Популярный",
    bgGradient: "linear-gradient(125deg, #1e3a2f, #2a5a4a, #3c7a60)",
    textColor: "#e0f0e0",
    content: `<h1 style="color: #a0d0a0;">🌿 Minimal Nature</h1><p>Природа вдохновляет нас каждый день. Делимся с вами эко-новостями и советами для устойчивого образа жизни.</p><h2 style="color: #c0e0c0;">🍃 Совет недели</h2><p>Начните сортировать отходы — это проще, чем кажется! А мы поможем с выбором эко-товаров.</p><p>Берегите планету,<br>Nature Team</p>`
  },
  '3': { 
    name: "💎 Luxury Gold", 
    desc: "Роскошь, золотые акценты", 
    badge: "Эксклюзив",
    bgGradient: "linear-gradient(135deg, #2c2418, #5e4b2f, #927f5f)",
    textColor: "#f5e6c8",
    content: `<h1 style="color: #ffd700;">💎 Luxury Gold</h1><p>Уважаемые клиенты, приглашаем вас на эксклюзивный вечер, посвящённый запуску новой коллекции.</p><h2 style="color: #ffc800;">✨ Детали мероприятия</h2><p>Дата: 15 декабря. Место: Carlton Lounge. Dress code: Evening.</p><p>Ждём вас,<br>Luxury Team</p>`
  },
  '4': { 
    name: "🚀 Tech Future", 
    desc: "Футуристичный темный стиль с неоновыми бликами", 
    badge: "Современный",
    bgGradient: "linear-gradient(115deg, #0b0f1c, #161b33, #242a55)",
    textColor: "#c0d0ff",
    content: `<h1 style="color: #6c5ce7;">🚀 Tech Future</h1><p>Инновации не ждут. Представляем вам обновлённую платформу с AI-помощником и аналитикой нового поколения.</p><h2 style="color: #a363d9;">⚡ Что нового?</h2><p>Автоматизация процессов, интеграция с CRM и улучшенная безопасность данных.</p><p>Будущее уже здесь,<br>Tech Future</p>`
  },
  '5': { 
    name: "🌸 Spring Blossom", 
    desc: "Нежные пастельные оттенки", 
    badge: "Весенний",
    bgGradient: "linear-gradient(140deg, #f5cdd9, #f8e0c0, #fce8e0)",
    textColor: "#5a3a4a",
    content: `<h1 style="color: #c85a7a;">🌸 Spring Blossom</h1><p>Весна — время обновлений! Наша новая коллекция уже в продаже.</p><h2 style="color: #e07a9a;">🌷 Скидка 15%</h2><p>Промокод SPRING15 действует на весь ассортимент до конца месяца.</p><p>Вдохновляйтесь,<br>Blossom Team</p>`
  },
  '6': { 
    name: "🎄 Festive Magic", 
    desc: "Праздничное настроение", 
    badge: "Сезонный",
    bgGradient: "linear-gradient(120deg, #8b1e1e, #c23b3b, #e07a5f)",
    textColor: "#fff0e0",
    content: `<h1 style="color: #ffd700;">🎄 Festive Magic</h1><p>С наступающими праздниками! Дарите радость с нашими подарками.</p><h2 style="color: #ffb347;">🎁 Подарочный набор</h2><p>При заказе от 3000 рублей — стильный подарок в подарок!</p><p>С любовью,<br>Festive Team</p>`
  }
};

const getStorageKey = (templateId: string | null) => {
  if (templateId) {
    return `neymark_draft_${templateId}`;
  }
  return 'neymark_draft_new';
};

function TemplateEditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('id');
  
  const starsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
  const editableDivRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<TemplateData | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [showMessage, setShowMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState({ characters: 0, charactersNoSpaces: 0, words: 0 });
  const [showMobileTools, setShowMobileTools] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [showComponentMenu, setShowComponentMenu] = useState(false);
  const [singleButtonColor, setSingleButtonColor] = useState('#4f46e5');
  const [primaryButtonColor, setPrimaryButtonColor] = useState('#4f46e5');
  const [secondaryButtonColor, setSecondaryButtonColor] = useState('#ffffff');
  const [quoteColor, setQuoteColor] = useState('#6c5ce7');
  const [dividerColor, setDividerColor] = useState('#d1d5db');

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isUndoRedoAction, setIsUndoRedoAction] = useState<boolean>(false);

  const saveToHistory = () => {
    if (!editableDivRef.current) return;
    if (isUndoRedoAction) {
      setIsUndoRedoAction(false);
      return;
    }
    
    const currentContent = editableDivRef.current.innerHTML;
    
    if (history.length > 0 && history[historyIndex] === currentContent) {
      return;
    }
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(currentContent);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0 || !editableDivRef.current) return;
    
    setIsUndoRedoAction(true);
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    editableDivRef.current.innerHTML = history[newIndex];
    updateStats();
    saveToLocalStorage();
    showMessagePopup('↩️ Отменено', false);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !editableDivRef.current) return;
    
    setIsUndoRedoAction(true);
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    editableDivRef.current.innerHTML = history[newIndex];
    updateStats();
    saveToLocalStorage();
    showMessagePopup('↪️ Возвращено', false);
  };

  const updateStats = () => {
    if (!editableDivRef.current) return;
    const text = editableDivRef.current.innerText || '';
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    setStats({ characters, charactersNoSpaces, words });
  };

  const generateFullHtml = () => {
    const content = editableDivRef.current?.innerHTML || '';
    const bgGradient = editableDivRef.current?.style.background || currentTemplate?.bgGradient || '#0a0f1e';
    const textColor = editableDivRef.current?.style.color || currentTemplate?.textColor || '#ffffff';
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>НЕЙМАРК | ${currentTemplate?.name || 'Email шаблон'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, 'Roboto', sans-serif;
            line-height: 1.5;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            background: #0a0f1e;
        }
        .email-container {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .email-content {
            padding: 50px 40px;
            background: ${bgGradient};
            color: ${textColor};
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
        }
        .email-content * {
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .email-content h1 { font-size: 2rem; margin-bottom: 1rem; }
        .email-content h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
        .email-content h3 { font-size: 1.17rem; margin: 1rem 0 0.5rem; }
        .email-content p { margin-bottom: 1rem; }
        .email-content img { max-width: 100%; border-radius: 16px; margin: 15px 0; }
        .email-content a { color: ${textColor}; text-decoration: underline; }
        .email-content .btn-single {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            text-decoration: none;
            background: #4f46e5;
            color: #ffffff !important;
            margin: 10px 0;
            transition: all 0.3s ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
            border: none;
            cursor: pointer;
        }
        .email-content .btn-single:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
        }
        .email-content .btn-two-container {
            display: flex;
            gap: 16px;
            margin: 10px 0;
        }
        .email-content .btn-two-container .btn-two {
            flex: 1;
            box-sizing: border-box;
            padding: 12px 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
            cursor: pointer;
        }
        .email-content .btn-two-container .btn-two-primary {
            background: #4f46e5;
            color: #ffffff !important;
            border: none;
        }
        .email-content .btn-two-container .btn-two-primary:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
        }
        .email-content .btn-two-container .btn-two-secondary {
            background: #ffffff;
            color: #111827 !important;
            border: 1px solid #e5e7eb;
        }
        .email-content .btn-two-container .btn-two-secondary:hover {
            background: #f9fafb;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .email-content .hr {
            margin-top: 16px;
            margin-bottom: 16px;
            border: none;
            border-top: 2px solid #d1d5db;
        }
        .email-content .quote {
            border-left: 4px solid #6c5ce7;
            padding-left: 20px;
            margin: 16px 0;
            color: rgba(255,255,255,0.8);
            font-style: italic;
            font-size: 1.1rem;
            line-height: 1.6;
        }
        .email-content .features-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background: #ffffff;
            border-radius: 8px;
        }
        .email-content .features-heading {
            font-size: 24px;
            line-height: 32px;
            margin-bottom: 42px;
            text-align: center;
            color: #1a1a2e;
        }
        .email-content .feature-section {
            margin-bottom: 36px;
        }
        .email-content .feature-row {
            padding-left: 12px;
            padding-right: 32px;
            display: flex;
            gap: 18px;
        }
        .email-content .feature-number {
            width: 24px;
            height: 24px;
            min-width: 24px;
            background: #6c5ce7;
            border-radius: 9999px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        .email-content .feature-content {
            flex: 1;
        }
        .email-content .feature-title {
            font-size: 18px;
            line-height: 28px;
            margin-bottom: 8px;
            margin-top: 0;
            color: #1a1a2e;
        }
        .email-content .feature-description {
            font-size: 14px;
            line-height: 24px;
            margin: 0;
            color: #6b7280;
        }
        @media (max-width: 600px) {
            .email-content { padding: 30px 20px; }
            .email-content h1 { font-size: 1.5rem; }
            .email-content .btn-two-container {
                flex-direction: column;
                gap: 10px;
            }
            .email-content .features-container { padding: 16px; }
            .email-content .feature-row { padding-right: 12px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-content">
            ${content}
        </div>
    </div>
</body>
</html>`;
  };

  const handleSendEmail = async () => {
    if (!sendEmail || !sendEmail.includes('@')) {
      showMessagePopup('❌ Введите корректный email адрес', true);
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: sendEmail,
          subject: `НЕЙМАРК | ${currentTemplate?.name || 'Email шаблон'}`,
          html: generateFullHtml(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showMessagePopup(`✅ Письмо успешно отправлено на ${sendEmail}!`, false);
        setShowSendModal(false);
        setSendEmail('');
      } else {
        showMessagePopup('❌ Ошибка при отправке письма', true);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessagePopup('❌ Ошибка соединения с сервером', true);
    } finally {
      setIsSending(false);
    }
  };

  const saveToLocalStorage = () => {
    if (!editableDivRef.current) return;
    const content = editableDivRef.current.innerHTML;
    const bgGradient = editableDivRef.current.style.background;
    const textColor = editableDivRef.current.style.color;
    
    const key = getStorageKey(templateId);
    const state = {
      content,
      bgGradient,
      textColor,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(state));
  };

  const loadFromLocalStorage = () => {
    const key = getStorageKey(templateId);
    const saved = localStorage.getItem(key);
    if (saved && editableDivRef.current) {
      try {
        const state = JSON.parse(saved);
        editableDivRef.current.innerHTML = state.content;
        editableDivRef.current.style.background = state.bgGradient;
        editableDivRef.current.style.color = state.textColor;
        (editableDivRef.current.style as any).backgroundSize = "cover";
        updateStats();
        setHistory([state.content]);
        setHistoryIndex(0);
        showMessagePopup('📂 Загружен автосохранённый черновик', false);
        return true;
      } catch (e) {
        console.error('Ошибка загрузки из localStorage', e);
      }
    }
    return false;
  };

  const resetToOriginal = () => {
    if (isNewTemplate) {
      if (editableDivRef.current) {
        const content = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
        editableDivRef.current.innerHTML = content;
        editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
        editableDivRef.current.style.color = "#1a1a2e";
        (editableDivRef.current.style as any).backgroundSize = "cover";
        setHistory([content]);
        setHistoryIndex(0);
        updateStats();
        showMessagePopup('🔄 Новый шаблон очищен', false);
      }
    } else if (originalTemplate && editableDivRef.current) {
      const content = originalTemplate.content;
      editableDivRef.current.innerHTML = content;
      editableDivRef.current.style.background = originalTemplate.bgGradient;
      editableDivRef.current.style.color = originalTemplate.textColor;
      (editableDivRef.current.style as any).backgroundSize = "cover";
      setCurrentTemplate(originalTemplate);
      setHistory([content]);
      setHistoryIndex(0);
      updateStats();
      showMessagePopup(`🔄 Шаблон "${originalTemplate.name}" сброшен к исходному`, false);
    }
    saveToLocalStorage();
  };

  const clearAllDrafts = () => {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('neymark_draft_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (templateId && templatesData[templateId]) {
      const template = templatesData[templateId];
      if (editableDivRef.current) {
        const content = template.content;
        editableDivRef.current.innerHTML = content;
        editableDivRef.current.style.background = template.bgGradient;
        editableDivRef.current.style.color = template.textColor;
        (editableDivRef.current.style as any).backgroundSize = "cover";
        setHistory([content]);
        setHistoryIndex(0);
        updateStats();
      }
    } else if (editableDivRef.current) {
      const content = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
      editableDivRef.current.innerHTML = content;
      editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
      editableDivRef.current.style.color = "#1a1a2e";
      setHistory([content]);
      setHistoryIndex(0);
      updateStats();
    }
    
    showMessagePopup('🗑 Все черновики удалены!', false);
    setShowConfirmModal(false);
  };

  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      saveToLocalStorage();
    }, 2000);
    
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [templateId, currentTemplate]);

  useEffect(() => {
    const handleInput = () => {
      updateStats();
      saveToHistory();
      saveToLocalStorage();
    };
    
    const element = editableDivRef.current;
    if (element) {
      element.addEventListener('input', handleInput);
      element.addEventListener('keyup', handleInput);
      return () => {
        element.removeEventListener('input', handleInput);
        element.removeEventListener('keyup', handleInput);
      };
    }
  }, [history, historyIndex]);

  const openLinkModal = () => {
    setShowLinkModal(true);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

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
        const hue = Math.random() * 40 + 220;
        particle.style.background = `radial-gradient(circle, rgba(${hue-20},${hue-80},255,0.3) 0%, rgba(${hue-10},${hue-50},200,0.1) 70%, transparent 100%)`;
        particlesContainer.appendChild(particle);
      }
    }

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

  useEffect(() => {
    if (templateId && templatesData[templateId]) {
      const template = templatesData[templateId];
      setCurrentTemplate(template);
      setOriginalTemplate(template);
      setIsNewTemplate(false);
      if (editableDivRef.current) {
        const loaded = loadFromLocalStorage();
        if (!loaded) {
          const content = template.content;
          editableDivRef.current.innerHTML = content;
          editableDivRef.current.style.background = template.bgGradient;
          editableDivRef.current.style.color = template.textColor;
          (editableDivRef.current.style as any).backgroundSize = "cover";
          setHistory([content]);
          setHistoryIndex(0);
          updateStats();
        }
      }
    } else if (editableDivRef.current) {
      setCurrentTemplate(null);
      setOriginalTemplate(null);
      setIsNewTemplate(true);
      const loaded = loadFromLocalStorage();
      if (!loaded) {
        const content = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
        editableDivRef.current.innerHTML = content;
        editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
        editableDivRef.current.style.color = "#1a1a2e";
        setHistory([content]);
        setHistoryIndex(0);
        updateStats();
      }
    }
  }, [templateId]);

  const showMessagePopup = (text: string, isSuccess: boolean = false) => {
    setShowMessage({ text, isSuccess });
    setTimeout(() => setShowMessage(null), 2500);
  };

  const isValidUrl = (url: string): boolean => {
    if (!url || url.trim() === '') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const execCommand = (command: string, value?: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) {
      showMessagePopup('⚠️ Выделите текст для форматирования', true);
      return;
    }
    
    const selectedText = selection.toString().trim();
    if (!selectedText) {
      showMessagePopup('⚠️ Выделите текст для форматирования', true);
      return;
    }
    
    document.execCommand(command, false, value);
    editableDivRef.current?.focus();
    setTimeout(() => {
      updateStats();
      saveToHistory();
      saveToLocalStorage();
    }, 10);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      showMessagePopup('⚠️ Выделите текст для изменения размера', true);
      return;
    }
    
    const range = sel.getRangeAt(0);
    const selectedText = range.toString().trim();
    if (!selectedText) {
      showMessagePopup('⚠️ Выделите текст, чтобы изменить размер шрифта', true);
      return;
    }
    
    try {
      // Создаем span с нужным размером
      const span = document.createElement('span');
      span.style.fontSize = newSize;
      
      // Извлекаем содержимое выделения
      const fragment = range.extractContents();
      span.appendChild(fragment);
      
      // Вставляем span обратно в документ
      range.insertNode(span);
      
      // Восстанавливаем выделение на span
      range.setStartBefore(span);
      range.setEndAfter(span);
      sel.removeAllRanges();
      sel.addRange(range);
      
      editableDivRef.current?.focus();
      setTimeout(() => {
        updateStats();
        saveToHistory();
        saveToLocalStorage();
      }, 10);
    } catch (error) {
      // Если не удалось обернуть в span (например, выделение пересекает границы элементов),
      // используем execCommand как запасной вариант
      try {
        document.execCommand('fontSize', false, '7');
        
        const fontElements = document.querySelectorAll('font[size="7"]');
        fontElements.forEach(el => {
          const span = document.createElement('span');
          span.style.fontSize = newSize;
          span.innerHTML = el.innerHTML;
          el.parentNode?.replaceChild(span, el);
        });
        
        // Пытаемся восстановить выделение по тексту
        const walker = document.createTreeWalker(
          editableDivRef.current!,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              if (node.textContent?.includes(selectedText)) {
                return NodeFilter.FILTER_ACCEPT;
              }
              return NodeFilter.FILTER_REJECT;
            }
          }
        );
        let node = walker.nextNode();
        while (node) {
          const text = node.textContent || '';
          const index = text.indexOf(selectedText);
          if (index !== -1) {
            const newRange = document.createRange();
            newRange.setStart(node, index);
            newRange.setEnd(node, index + selectedText.length);
            sel.removeAllRanges();
            sel.addRange(newRange);
            break;
          }
          node = walker.nextNode();
        }
        
        editableDivRef.current?.focus();
        setTimeout(() => {
          updateStats();
          saveToHistory();
          saveToLocalStorage();
        }, 10);
      } catch (err) {
        showMessagePopup('❌ Не удалось изменить размер шрифта. Попробуйте выделить текст заново.', true);
      }
    }
  };

  const insertAtCursor = (html: string) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const fragment = range.createContextualFragment(html);
      range.insertNode(fragment);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      editableDivRef.current?.insertAdjacentHTML('beforeend', html);
    }
    editableDivRef.current?.focus();
    setTimeout(() => {
      updateStats();
      saveToHistory();
      saveToLocalStorage();
    }, 10);
  };

  const insertSingleButton = () => {
    const html = `<a href="#" class="btn-single" style="background: ${singleButtonColor}; color: #ffffff !important;" contenteditable="true">Get started</a>`;
    insertAtCursor(html);
    setShowComponentMenu(false);
  };

  const insertTwoButtons = () => {
    const html = `
      <div class="btn-two-container">
        <a href="#" class="btn-two btn-two-primary" style="background: ${primaryButtonColor}; color: #ffffff !important;" contenteditable="true">Login</a>
        <a href="#" class="btn-two btn-two-secondary" style="background: ${secondaryButtonColor}; color: #111827 !important; border: 1px solid #e5e7eb;" contenteditable="true">Sign up</a>
      </div>
    `;
    insertAtCursor(html);
    setShowComponentMenu(false);
  };

  const insertDivider = () => {
    const html = `
      <p>Текст до разделителя</p>
      <hr class="hr" style="border-top-color: ${dividerColor};" />
      <p>Текст после разделителя</p>
    `;
    insertAtCursor(html);
    setShowComponentMenu(false);
  };

  const insertQuote = () => {
    const html = `
      <blockquote class="quote" style="border-left-color: ${quoteColor};">
        "Это пример цитаты. Здесь вы можете разместить вдохновляющую фразу или важную мысль."
      </blockquote>
    `;
    insertAtCursor(html);
    setShowComponentMenu(false);
  };

  const insertHeading = (type: string) => {
    const headings: Record<string, string> = {
      'h1': `<h1>H1 Title</h1>`,
      'h2': `<h2>H2 Subtitle</h2>`,
      'h3': `<h3>H3 Heading</h3>`
    };
    insertAtCursor(headings[type]);
    setShowComponentMenu(false);
  };

  const insertSimpleList = () => {
    const html = `
      <div class="features-container">
        <h2 class="features-heading">Топ 5 преимуществ нашего сервиса</h2>
        <div class="feature-section">
          <div class="feature-row">
            <div class="feature-number">1</div>
            <div class="feature-content">
              <h3 class="feature-title">Инновационные решения</h3>
              <p class="feature-description">Мы предлагаем инновационные решения, которые способствуют успеху и росту вашего бизнеса.</p>
            </div>
          </div>
        </div>
        <div class="feature-section">
          <div class="feature-row">
            <div class="feature-number">2</div>
            <div class="feature-content">
              <h3 class="feature-title">Высокая производительность</h3>
              <p class="feature-description">Наши сервисы обеспечивают высокое качество работы и эффективность на всех уровнях.</p>
            </div>
          </div>
        </div>
        <div class="feature-section">
          <div class="feature-row">
            <div class="feature-number">3</div>
            <div class="feature-content">
              <h3 class="feature-title">Надежная поддержка</h3>
              <p class="feature-description">Мы предоставляем надежную поддержку, чтобы ваша работа всегда была бесперебойной.</p>
            </div>
          </div>
        </div>
        <div class="feature-section">
          <div class="feature-row">
            <div class="feature-number">4</div>
            <div class="feature-content">
              <h3 class="feature-title">Передовая безопасность</h3>
              <p class="feature-description">Мы внедряем передовые меры безопасности для защиты ваших данных и активов.</p>
            </div>
          </div>
        </div>
        <div class="feature-section">
          <div class="feature-row">
            <div class="feature-number">5</div>
            <div class="feature-content">
              <h3 class="feature-title">Масштабируемый рост</h3>
              <p class="feature-description">Мы разрабатываем стратегии для устойчивого и масштабируемого роста вашего бизнеса.</p>
            </div>
          </div>
        </div>
      </div>
    `;
    insertAtCursor(html);
    setShowComponentMenu(false);
  };

  const handleLinkConfirm = () => {
    if (!linkUrl) return;
    if (!isValidUrl(linkUrl)) {
      showMessagePopup('❌ Некорректный URL. Ссылка должна начинаться с http:// или https://');
      return;
    }
    
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const selectedText = range.toString();
      
      if (selectedText.length > 0) {
        range.deleteContents();
        
        const link = document.createElement('a');
        link.href = linkUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = selectedText;
        link.style.color = '#6c5ce7';
        link.style.textDecoration = 'underline';
        
        range.insertNode(link);
        const newRange = document.createRange();
        newRange.setStartAfter(link);
        newRange.setEndAfter(link);
        sel.removeAllRanges();
        sel.addRange(newRange);
        
        showMessagePopup('✅ Ссылка добавлена на выделенный текст', false);
      } else {
        const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #6c5ce7; text-decoration: underline;">${linkUrl}</a>&nbsp;`;
        range.deleteContents();
        const fragment = range.createContextualFragment(linkHtml);
        range.insertNode(fragment);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        showMessagePopup('✅ Ссылка вставлена', false);
      }
    }
    
    setShowLinkModal(false);
    setLinkUrl('https://');
    setTimeout(() => {
      updateStats();
      saveToHistory();
      saveToLocalStorage();
    }, 10);
  };

  const handleImageConfirm = () => {
    if (!imageUrl) return;
    if (!isValidUrl(imageUrl)) {
      showMessagePopup('❌ Некорректный URL изображения');
      return;
    }
    
    const html = `<img src="${imageUrl}" alt="Изображение" style="max-width: 100%; border-radius: 12px; margin: 10px 0; display: block;" />`;
    insertAtCursor(html);
    
    showMessagePopup('✅ Изображение вставлено', false);
    
    setShowImageModal(false);
    setImageUrl('https://');
    setTimeout(() => {
      updateStats();
      saveToHistory();
      saveToLocalStorage();
    }, 10);
  };

  const handleSave = () => {
    const fullHtml = generateFullHtml();
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const link = document.createElement('a');
    const templateName = currentTemplate ? currentTemplate.name.replace(/[^\wа-яё]/gi, '_') : 'custom';
    link.download = `НЕЙМАРК-${templateName}.html`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    saveToLocalStorage();
    showMessagePopup('✅ HTML-документ сохранён!', false);
  };

  const handleCopy = async () => {
    const fullHtml = generateFullHtml();
    try {
      await navigator.clipboard.writeText(fullHtml);
      showMessagePopup('📋 HTML скопирован в буфер обмена!', false);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = fullHtml;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showMessagePopup('📋 HTML скопирован в буфер обмена!', false);
    }
  };

  const handleExportPDF = () => {
    const content = editableDivRef.current?.innerHTML || '';
    const bgGradient = editableDivRef.current?.style.background || currentTemplate?.bgGradient || '#0a0f1e';
    const textColor = editableDivRef.current?.style.color || currentTemplate?.textColor || '#ffffff';
    
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) {
      showMessagePopup('❌ Не удалось создать iframe для печати', true);
      return;
    }
    
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>НЕЙМАРК | ${currentTemplate?.name || 'Email шаблон'}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, 'Roboto', sans-serif;
            line-height: 1.5;
            padding: 40px 20px;
            background: white;
          }
          .email-container {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            border-radius: 32px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          .email-content {
            padding: 50px 40px;
            background: ${bgGradient};
            color: ${textColor};
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
          }
          .email-content * {
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          .email-content h1 { font-size: 2rem; margin-bottom: 1rem; }
          .email-content h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
          .email-content h3 { font-size: 1.17rem; margin: 1rem 0 0.5rem; }
          .email-content p { margin-bottom: 1rem; }
          .email-content img { max-width: 100%; border-radius: 16px; margin: 15px 0; }
          .email-content a { color: ${textColor}; text-decoration: underline; }
          .email-content .btn-single {
            display: block;
            width: 100%;
            box-sizing: border-box;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            text-decoration: none;
            background: #4f46e5;
            color: #ffffff !important;
            margin: 10px 0;
            transition: all 0.3s ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
            border: none;
            cursor: pointer;
          }
          .email-content .btn-single:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
          }
          .email-content .btn-two-container {
            display: flex;
            gap: 16px;
            margin: 10px 0;
          }
          .email-content .btn-two-container .btn-two {
            flex: 1;
            box-sizing: border-box;
            padding: 12px 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            word-wrap: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
            cursor: pointer;
          }
          .email-content .btn-two-container .btn-two-primary {
            background: #4f46e5;
            color: #ffffff !important;
            border: none;
          }
          .email-content .btn-two-container .btn-two-primary:hover {
            filter: brightness(0.9);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
          }
          .email-content .btn-two-container .btn-two-secondary {
            background: #ffffff;
            color: #111827 !important;
            border: 1px solid #e5e7eb;
          }
          .email-content .btn-two-container .btn-two-secondary:hover {
            background: #f9fafb;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          }
          .email-content .hr {
            margin-top: 16px;
            margin-bottom: 16px;
            border: none;
            border-top: 2px solid #d1d5db;
          }
          .email-content .quote {
            border-left: 4px solid #6c5ce7;
            padding-left: 20px;
            margin: 16px 0;
            color: rgba(255,255,255,0.8);
            font-style: italic;
            font-size: 1.1rem;
            line-height: 1.6;
          }
          .email-content .features-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 24px;
            background: #ffffff;
            border-radius: 8px;
          }
          .email-content .features-heading {
            font-size: 24px;
            line-height: 32px;
            margin-bottom: 42px;
            text-align: center;
            color: #1a1a2e;
          }
          .email-content .feature-section {
            margin-bottom: 36px;
          }
          .email-content .feature-row {
            padding-left: 12px;
            padding-right: 32px;
            display: flex;
            gap: 18px;
          }
          .email-content .feature-number {
            width: 24px;
            height: 24px;
            min-width: 24px;
            background: #6c5ce7;
            border-radius: 9999px;
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }
          .email-content .feature-content {
            flex: 1;
          }
          .email-content .feature-title {
            font-size: 18px;
            line-height: 28px;
            margin-bottom: 8px;
            margin-top: 0;
            color: #1a1a2e;
          }
          .email-content .feature-description {
            font-size: 14px;
            line-height: 24px;
            margin: 0;
            color: #6b7280;
          }
          @media print {
            body { padding: 0; }
            .email-container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-content">
            ${content}
          </div>
        </div>
      </body>
      </html>
    `);
    iframeDoc.close();
    
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 100);
    
    showMessagePopup('📄 Откроется окно печати. Выберите "Сохранить как PDF"', false);
  };

  return (
    <>
      <Head>
        <title>НЕЙМАРК | Редактор писем</title>
        <meta name="description" content="Создайте идеальное письмо с помощью редактора НЕЙМАРК" />
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

        .nav-buttons {
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

        .toolbar {
          position: fixed;
          top: 25px;
          right: 25px;
          z-index: 20;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          padding: 12px 20px;
          border-radius: 60px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: auto;
        }

        .tool-btn {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          position: relative;
        }

        .tool-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: scale(1.02);
          color: rgba(255, 255, 255, 0.9);
        }

        .tool-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        .tool-btn-dropdown {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: rgba(15, 20, 35, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 10px;
          min-width: 280px;
          margin-top: 8px;
          z-index: 100;
          max-height: 400px;
          overflow-y: auto;
        }

        .dropdown-menu-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.8);
          font-family: inherit;
          font-size: 0.85rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-menu-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .dropdown-menu-item .badge {
          float: right;
          font-size: 0.65rem;
          opacity: 0.5;
        }

        .dropdown-menu-item .color-picker {
          float: right;
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-left: 8px;
        }

        .tool-select {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.7);
          padding: 8px 12px;
          border-radius: 40px;
          font-size: clamp(0.7rem, 2vw, 0.85rem);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .tool-select option {
          background: #1a1f35;
          color: rgba(255, 255, 255, 0.8);
        }

        .color-input {
          width: 40px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }

        .separator {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 5px;
        }

        .container {
          position: relative;
          z-index: 10;
          max-width: 1000px;
          margin: 0 auto;
          padding: 100px 30px 80px;
          pointer-events: auto;
        }

        .editor-area {
          border-radius: 32px;
          overflow: hidden;
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .editor-header {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .stats-bar {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 12px 20px;
          margin-top: 15px;
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(0.65rem, 2vw, 0.85rem);
        }

        .stat-label {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
        }

        .stat-value {
          font-weight: 700;
          font-size: clamp(0.8rem, 2.5vw, 1.1rem);
          color: #6c8cff;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .save-btn, .copy-btn, .reset-btn, .pdf-btn, .clear-btn, .send-btn, .toggle-tools-btn {
          border: none;
          color: rgba(255, 255, 255, 0.8);
          padding: 6px 18px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: clamp(0.7rem, 2vw, 0.85rem);
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .save-btn:hover, .copy-btn:hover, .reset-btn:hover, .pdf-btn:hover, .clear-btn:hover, .send-btn:hover, .toggle-tools-btn:hover {
          transform: scale(1.02);
          background: rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.95);
        }

        .save-btn {
          background: rgba(108, 92, 231, 0.3);
          border-color: rgba(108, 92, 231, 0.3);
        }

        .reset-btn {
          background: rgba(255, 100, 100, 0.15);
          border-color: rgba(255, 100, 100, 0.2);
        }

        .pdf-btn {
          background: rgba(255, 150, 50, 0.15);
          border-color: rgba(255, 150, 50, 0.2);
        }

        .clear-btn {
          background: rgba(200, 50, 50, 0.15);
          border-color: rgba(200, 50, 50, 0.2);
        }

        .send-btn {
          background: rgba(50, 200, 100, 0.15);
          border-color: rgba(50, 200, 100, 0.2);
        }

        .toggle-tools-btn {
          background: rgba(108, 92, 231, 0.2);
          border-color: rgba(108, 92, 231, 0.2);
        }

        .editable-content {
          padding: 40px;
          min-height: 500px;
          outline: none;
          font-size: clamp(14px, 2.5vw, 16px);
          line-height: 1.5;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }

        .editable-content * {
          max-width: 100%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .editable-content:focus {
          box-shadow: inset 0 0 0 3px rgba(108, 92, 231, 0.2);
        }

        .editable-content .btn-single {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          text-decoration: none;
          background: #4f46e5;
          color: #ffffff !important;
          margin: 10px 0;
          transition: all 0.3s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
          border: none;
          cursor: pointer;
        }
        .editable-content .btn-single:hover {
          filter: brightness(0.9);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
        }
        .editable-content .btn-two-container {
          display: flex;
          gap: 16px;
          margin: 10px 0;
        }
        .editable-content .btn-two-container .btn-two {
          flex: 1;
          box-sizing: border-box;
          padding: 12px 20px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
          cursor: pointer;
        }
        .editable-content .btn-two-container .btn-two-primary {
          background: #4f46e5;
          color: #ffffff !important;
          border: none;
        }
        .editable-content .btn-two-container .btn-two-primary:hover {
          filter: brightness(0.9);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
        }
        .editable-content .btn-two-container .btn-two-secondary {
          background: #ffffff;
          color: #111827 !important;
          border: 1px solid #e5e7eb;
        }
        .editable-content .btn-two-container .btn-two-secondary:hover {
          background: #f9fafb;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .editable-content .hr {
          margin-top: 16px;
          margin-bottom: 16px;
          border: none;
          border-top: 2px solid #d1d5db;
        }
        .editable-content .quote {
          border-left: 4px solid #6c5ce7;
          padding-left: 20px;
          margin: 16px 0;
          color: rgba(255,255,255,0.8);
          font-style: italic;
          font-size: clamp(0.9rem, 2.5vw, 1.1rem);
          line-height: 1.6;
        }
        .editable-content .features-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
          background: #ffffff;
          border-radius: 8px;
        }
        .editable-content .features-heading {
          font-size: clamp(1.2rem, 4vw, 24px);
          line-height: 32px;
          margin-bottom: 42px;
          text-align: center;
          color: #1a1a2e;
        }
        .editable-content .feature-section {
          margin-bottom: 36px;
        }
        .editable-content .feature-row {
          padding-left: 12px;
          padding-right: 32px;
          display: flex;
          gap: 18px;
        }
        .editable-content .feature-number {
          width: 24px;
          height: 24px;
          min-width: 24px;
          background: #6c5ce7;
          border-radius: 9999px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .editable-content .feature-content {
          flex: 1;
        }
        .editable-content .feature-title {
          font-size: clamp(0.9rem, 3vw, 18px);
          line-height: 28px;
          margin-bottom: 8px;
          margin-top: 0;
          color: #1a1a2e;
        }
        .editable-content .feature-description {
          font-size: clamp(0.7rem, 2vw, 14px);
          line-height: 24px;
          margin: 0;
          color: #6b7280;
        }

        .template-info-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 15px 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .template-info-card p {
          color: rgba(220, 230, 255, 0.5);
          font-size: clamp(0.7rem, 2vw, 0.85rem);
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(108, 92, 231, 0.3);
          border-radius: 50px;
          font-size: 0.75rem;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.8);
        }

        .custom-alert {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          z-index: 1000;
          font-size: clamp(0.8rem, 2vw, 0.9rem);
          animation: fadeInOut 2.5s ease forwards;
          pointer-events: none;
        }

        .custom-alert.success {
          border: 1px solid rgba(100, 255, 100, 0.3);
        }

        .custom-alert.error {
          border: 1px solid rgba(255, 100, 100, 0.3);
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(15px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: rgba(15, 20, 35, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          max-width: 450px;
          width: 90%;
          padding: 28px;
          border: 1px solid rgba(255,255,255,0.15);
          text-align: center;
        }

        .modal-content h3 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .modal-content p {
          color: rgba(255,255,255,0.7);
          margin-bottom: 24px;
        }

        .modal-content input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-size: 1rem;
          margin-bottom: 24px;
          outline: none;
        }

        .modal-content input:focus {
          border-color: #6c5ce7;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
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
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .modal-btn.confirm:hover {
          transform: scale(1.02);
          background: linear-gradient(135deg, #7d6ef7, #b574e9);
        }

        @media (max-width: 860px) {
          .container {
            padding: 20px 12px 80px;
            margin-top: 0;
          }
          
          .nav-buttons {
            position: relative;
            top: 0;
            left: 0;
            justify-content: center;
            margin-bottom: 16px;
            background: rgba(20, 25, 45, 0.6);
            backdrop-filter: blur(12px);
            padding: 8px 12px;
            border-radius: 50px;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .nav-btn {
            padding: 6px 14px;
            font-size: clamp(0.7rem, 2.5vw, 0.8rem);
          }
          
          .toolbar {
            display: ${showMobileTools ? 'flex' : 'none'};
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            justify-content: center;
            gap: 6px;
            background: rgba(10, 10, 20, 0.95);
            backdrop-filter: blur(12px);
            padding: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            flex-wrap: wrap;
            max-height: 60vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 20px;
          }
          
          .toggle-tools-btn {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 101;
            border-radius: 50px;
            padding: 8px 16px;
            background: rgba(108, 92, 231, 0.6);
            border: 1px solid rgba(108, 92, 231, 0.3);
            color: rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: clamp(0.65rem, 2vw, 0.8rem);
          }
          
          .tool-btn {
            padding: 5px 10px;
            font-size: clamp(0.6rem, 2vw, 0.7rem);
            min-width: 32px;
          }
          
          .tool-select {
            padding: 5px 8px;
            font-size: clamp(0.6rem, 2vw, 0.7rem);
            max-width: 80px;
          }
          
          .color-input {
            width: 28px;
            height: 28px;
          }
          
          .separator {
            height: 20px;
            margin: 0 2px;
          }
          
          .editable-content {
            padding: 16px;
            margin-bottom: 0;
          }
          
          .editor-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .header-buttons {
            flex-direction: column;
            width: 100%;
            gap: 8px;
          }
          
          .save-btn, .copy-btn, .reset-btn, .pdf-btn, .clear-btn, .send-btn {
            width: 100%;
            text-align: center;
            padding: 8px;
            font-size: clamp(0.7rem, 2vw, 0.8rem);
          }
          
          .stats-bar {
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 10px;
            margin-bottom: 10px;
          }
          
          .stat-item {
            font-size: clamp(0.6rem, 2vw, 0.75rem);
          }
          
          .stat-value {
            font-size: clamp(0.7rem, 2.5vw, 0.9rem);
          }
          
          .template-info-card {
            padding: 10px;
            margin-bottom: 10px;
          }
          
          .template-info-card p {
            font-size: clamp(0.6rem, 2vw, 0.75rem);
          }
          
          .badge {
            font-size: 0.65rem;
            padding: 2px 8px;
          }

          .dropdown-menu {
            position: fixed;
            bottom: 80px;
            left: 10px;
            right: 10px;
            top: auto;
            max-height: 50vh;
            min-width: auto;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }

          .dropdown-menu-item {
            font-size: clamp(0.7rem, 2.5vw, 0.85rem);
            padding: 8px 12px;
          }
        }

        @media (max-width: 900px) and (orientation: landscape) {
          .toolbar {
            max-height: 80vh;
            padding: 8px 12px 16px;
            gap: 4px;
          }
          .tool-btn {
            padding: 4px 8px;
            font-size: 0.65rem;
            min-width: 28px;
          }
          .tool-select {
            padding: 4px 6px;
            font-size: 0.65rem;
            max-width: 60px;
          }
          .color-input {
            width: 24px;
            height: 24px;
          }
          .separator {
            height: 16px;
            margin: 0 2px;
          }
          .dropdown-menu {
            max-height: 60vh;
            bottom: 60px;
          }
          .dropdown-menu-item {
            font-size: 0.7rem;
            padding: 6px 10px;
          }
        }
      `}</style>

      <div className="modal-overlay" style={{ display: showLinkModal ? 'flex' : 'none' }} onClick={() => setShowLinkModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>🔗 Вставить ссылку</h3>
          <input
            type="text"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLinkConfirm()}
            autoFocus
          />
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => setShowLinkModal(false)}>Отмена</button>
            <button className="modal-btn confirm" onClick={handleLinkConfirm}>Вставить</button>
          </div>
        </div>
      </div>

      <div className="modal-overlay" style={{ display: showImageModal ? 'flex' : 'none' }} onClick={() => setShowImageModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>🖼️ Вставить изображение</h3>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleImageConfirm()}
            autoFocus
          />
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => setShowImageModal(false)}>Отмена</button>
            <button className="modal-btn confirm" onClick={handleImageConfirm}>Вставить</button>
          </div>
        </div>
      </div>

      <div className="modal-overlay" style={{ display: showConfirmModal ? 'flex' : 'none' }} onClick={() => setShowConfirmModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>⚠️ Подтверждение</h3>
          <p>Вы уверены, что хотите удалить ВСЕ черновики? Это действие нельзя отменить.</p>
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => setShowConfirmModal(false)}>Отмена</button>
            <button className="modal-btn confirm" onClick={clearAllDrafts}>Да, удалить</button>
          </div>
        </div>
      </div>

      <div className="modal-overlay" style={{ display: showSendModal ? 'flex' : 'none' }} onClick={() => setShowSendModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>✉️ Отправить письмо</h3>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={sendEmail}
            onChange={(e) => setSendEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendEmail()}
            disabled={isSending}
            autoFocus
          />
          <div className="modal-actions">
            <button className="modal-btn cancel" onClick={() => setShowSendModal(false)} disabled={isSending}>
              Отмена
            </button>
            <button className="modal-btn confirm" onClick={handleSendEmail} disabled={isSending}>
              {isSending ? 'Отправка...' : 'Отправить'}
            </button>
          </div>
        </div>
      </div>

      {showMessage && (
        <div className={`custom-alert ${showMessage.isSuccess ? 'success' : 'error'}`}>
          {showMessage.text}
        </div>
      )}

      <div ref={gradientRef} className="sky-gradient"></div>
      <div className="stars" ref={starsRef}></div>
      <div className="particle-field" ref={particlesRef}></div>
      <div className="glow-overlay"></div>

      <div className="nav-buttons">
        <Link href="/" className="nav-btn" title="На главную">← На главную</Link>
        <Link href="/editor" className="nav-btn" title="К выбору шаблонов">📋 К шаблонам</Link>
      </div>

      <div className="toolbar">
        <button className="tool-btn" onClick={() => execCommand('bold')} title="Жирный">B</button>
        <button className="tool-btn" onClick={() => execCommand('italic')} title="Курсив">I</button>
        <button className="tool-btn" onClick={() => execCommand('underline')} title="Подчёркнутый">U</button>
        <div className="separator"></div>
        
        <select onChange={(e) => execCommand('fontName', e.target.value)} className="tool-select" defaultValue="Segoe UI" title="Выбор шрифта">
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Segoe UI">Segoe UI</option>
          <option value="Roboto">Roboto</option>
          <option value="Verdana">Verdana</option>
        </select>
        
        <select onChange={handleFontSizeChange} value={fontSize} className="tool-select" title="Размер шрифта">
          <option value="8px">8px</option>
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="40px">40px</option>
          <option value="48px">48px</option>
          <option value="56px">56px</option>
          <option value="64px">64px</option>
        </select>
        
        <div className="separator"></div>
        
        <button className="tool-btn" onClick={() => execCommand('justifyLeft')} title="Выровнять по левому краю">◀</button>
        <button className="tool-btn" onClick={() => execCommand('justifyCenter')} title="Выровнять по центру">▲</button>
        <button className="tool-btn" onClick={() => execCommand('justifyRight')} title="Выровнять по правому краю">▶</button>
        <button className="tool-btn" onClick={() => execCommand('justifyFull')} title="Выровнять по ширине">■</button>
        
        <div className="separator"></div>

        <div className="tool-btn-dropdown">
          <button className="tool-btn" onClick={() => setShowComponentMenu(!showComponentMenu)} title="Components">
            🧩 Components ▼
          </button>
          {showComponentMenu && (
            <div className="dropdown-menu">
              <div style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Buttons</div>
              <button className="dropdown-menu-item" onClick={insertSingleButton}>
                🔘 Single Button
                <input 
                  type="color" 
                  value={singleButtonColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSingleButtonColor(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker"
                />
              </button>
              <button className="dropdown-menu-item" onClick={insertTwoButtons}>
                🔘🔘 Two Buttons
                <input 
                  type="color" 
                  value={primaryButtonColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setPrimaryButtonColor(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker"
                  style={{ marginLeft: '4px' }}
                />
                <input 
                  type="color" 
                  value={secondaryButtonColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setSecondaryButtonColor(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker"
                />
              </button>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 16px' }}></div>
              <div style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Headings</div>
              <button className="dropdown-menu-item" onClick={() => insertHeading('h1')}>📌 H1 Title</button>
              <button className="dropdown-menu-item" onClick={() => insertHeading('h2')}>📌 H2 Subtitle</button>
              <button className="dropdown-menu-item" onClick={() => insertHeading('h3')}>📌 H3 Heading</button>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 16px' }}></div>
              <div style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LAYOUTS</div>
              <button className="dropdown-menu-item" onClick={insertDivider}>
                ➖ Divider
                <input 
                  type="color" 
                  value={dividerColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setDividerColor(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker"
                />
              </button>
              <button className="dropdown-menu-item" onClick={insertQuote}>
                💬 Quote
                <input 
                  type="color" 
                  value={quoteColor}
                  onChange={(e) => {
                    e.stopPropagation();
                    setQuoteColor(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="color-picker"
                />
              </button>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 16px' }}></div>
              <div style={{ padding: '8px 16px', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>LISTS</div>
              <button className="dropdown-menu-item" onClick={insertSimpleList}>📋 Simple List</button>
            </div>
          )}
        </div>
        
        <div className="separator"></div>
        
        <button className="tool-btn" onClick={openLinkModal} title="Вставить ссылку">🔗</button>
        <button className="tool-btn" onClick={openImageModal} title="Вставить изображение">🖼️</button>
        
        <div className="separator"></div>
        
        <input type="color" onChange={(e) => execCommand('foreColor', e.target.value)} className="color-input" defaultValue="#6c5ce7" title="Цвет текста" />
        <input type="color" onChange={(e) => {
          if (editableDivRef.current) {
            editableDivRef.current.style.background = e.target.value;
            (editableDivRef.current.style as any).backgroundSize = "cover";
          }
        }} className="color-input" defaultValue="#ffffff" title="Цвет фона редактора" />
        
        <div className="separator"></div>
        
        <button 
          className="tool-btn" 
          onClick={undo} 
          disabled={historyIndex <= 0}
          title="Отменить"
          suppressHydrationWarning
        >
          ↩️ Отменить
        </button>
        <button 
          className="tool-btn" 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1}
          title="Вернуть"
          suppressHydrationWarning
        >
          ↪️ Вернуть
        </button>
      </div>

      <div className="container">
        <div className="editor-area">
          <div className="editor-header">
            <span>✏️ НЕЙМАРК | Редактируемая область (кликните для ввода текста)</span>
            <div className="header-buttons">
              <button className="copy-btn" onClick={handleCopy} title="Скопировать HTML">📋 Скопировать HTML</button>
              <button className="pdf-btn" onClick={handleExportPDF} title="Сохранить как PDF">📄 Сохранить как PDF</button>
              <button className="send-btn" onClick={() => setShowSendModal(true)} title="Отправить письмо на email">✉️ Отправить письмо</button>
              <button className="reset-btn" onClick={resetToOriginal} title="Сбросить к исходному шаблону">🔄 Сбросить</button>
              <button className="clear-btn" onClick={() => setShowConfirmModal(true)} title="Удалить все черновики">🗑 Очистить черновики</button>
              <button className="save-btn" onClick={handleSave} title="Сохранить HTML">💾 Сохранить HTML</button>
            </div>
          </div>
          <div 
            ref={editableDivRef} 
            className="editable-content" 
            contentEditable 
            suppressContentEditableWarning 
          />
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">📝 Символов (с пробелами):</span>
            <span className="stat-value">{stats.characters}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">🔤 Символов (без пробелов):</span>
            <span className="stat-value">{stats.charactersNoSpaces}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">📖 Слов:</span>
            <span className="stat-value">{stats.words}</span>
          </div>
        </div>

        <div className="template-info-card">
          <p><strong>Выбранный шаблон:</strong> {currentTemplate?.name || 'Новый шаблон'}</p>
          <p>{currentTemplate?.desc || 'Создайте письмо с нуля'}</p>
          <div className="badge">{currentTemplate?.badge || 'Новый'}</div>
        </div>
      </div>

      <button 
        className="toggle-tools-btn"
        onClick={() => setShowMobileTools(!showMobileTools)}
        title={showMobileTools ? 'Скрыть панель инструментов' : 'Показать панель инструментов'}
      >
        ⚙️ Инструменты {showMobileTools ? '▲' : '▼'}
      </button>
    </>
  );
}

export default function TemplateEditorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Загрузка редактора...</div>}>
      <TemplateEditorContent />
    </Suspense>
  );
}