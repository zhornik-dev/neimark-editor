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
  const savedRangeRef = useRef<Range | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateData | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<TemplateData | null>(null);
  const [isNewTemplate, setIsNewTemplate] = useState(false);
  const [showMessage, setShowMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('https://');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://');
  const [mobilePreview, setMobilePreview] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState({ characters: 0, charactersNoSpaces: 0, words: 0 });

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
        }
        .email-content h1 { font-size: 2rem; margin-bottom: 1rem; }
        .email-content h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
        .email-content p { margin-bottom: 1rem; }
        .email-content img { max-width: 100%; border-radius: 16px; margin: 15px 0; }
        .email-content a { color: ${textColor}; text-decoration: underline; }
        @media (max-width: 600px) {
            .email-content { padding: 30px 20px; }
            .email-content h1 { font-size: 1.5rem; }
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
        editableDivRef.current.innerHTML = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
        editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
        editableDivRef.current.style.color = "#1a1a2e";
        (editableDivRef.current.style as any).backgroundSize = "cover";
        updateStats();
        showMessagePopup('🔄 Новый шаблон очищен', false);
      }
    } else if (originalTemplate && editableDivRef.current) {
      editableDivRef.current.innerHTML = originalTemplate.content;
      editableDivRef.current.style.background = originalTemplate.bgGradient;
      editableDivRef.current.style.color = originalTemplate.textColor;
      (editableDivRef.current.style as any).backgroundSize = "cover";
      setCurrentTemplate(originalTemplate);
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
        editableDivRef.current.innerHTML = template.content;
        editableDivRef.current.style.background = template.bgGradient;
        editableDivRef.current.style.color = template.textColor;
        (editableDivRef.current.style as any).backgroundSize = "cover";
        updateStats();
      }
    } else if (editableDivRef.current) {
      editableDivRef.current.innerHTML = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
      editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
      editableDivRef.current.style.color = "#1a1a2e";
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
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRangeRef.current);
      editableDivRef.current?.focus();
    }
  };

  const openLinkModal = () => {
    saveSelection();
    setShowLinkModal(true);
  };

  const openImageModal = () => {
    saveSelection();
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
    if (templateId && templatesData[templateId]) {
      const template = templatesData[templateId];
      setCurrentTemplate(template);
      setOriginalTemplate(template);
      setIsNewTemplate(false);
      if (editableDivRef.current) {
        const loaded = loadFromLocalStorage();
        if (!loaded) {
          editableDivRef.current.innerHTML = template.content;
          editableDivRef.current.style.background = template.bgGradient;
          editableDivRef.current.style.color = template.textColor;
          (editableDivRef.current.style as any).backgroundSize = "cover";
          updateStats();
        }
      }
    } else if (editableDivRef.current) {
      setCurrentTemplate(null);
      setOriginalTemplate(null);
      setIsNewTemplate(true);
      const loaded = loadFromLocalStorage();
      if (!loaded) {
        editableDivRef.current.innerHTML = `<h1>✏️ Новый шаблон</h1><p>Начните писать своё письмо...</p>`;
        editableDivRef.current.style.background = "linear-gradient(135deg, #f5f5f5, #ffffff)";
        editableDivRef.current.style.color = "#1a1a2e";
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
    document.execCommand(command, false, value);
    editableDivRef.current?.focus();
    setTimeout(() => updateStats(), 10);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.fontSize = e.target.value;
    range.surroundContents(span);
    editableDivRef.current?.focus();
    setTimeout(() => updateStats(), 10);
  };

  const insertAtCursor = (html: string) => {
    restoreSelection();
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
    setTimeout(() => updateStats(), 10);
  };

  const handleLinkConfirm = () => {
    if (!linkUrl) return;
    if (!isValidUrl(linkUrl)) {
      showMessagePopup('❌ Некорректный URL. Ссылка должна начинаться с http:// или https://');
      return;
    }
    
    restoreSelection();
    
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      const selectedText = selection.toString();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const link = document.createElement('a');
      link.href = linkUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = selectedText;
      link.style.color = '#6c5ce7';
      link.style.textDecoration = 'underline';
      
      range.insertNode(link);
      range.setStartAfter(link);
      range.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(range);
      
      showMessagePopup('✅ Ссылка добавлена на выделенный текст', false);
    } else {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color: #6c5ce7; text-decoration: underline;">${linkUrl}</a>&nbsp;`;
      insertAtCursor(linkHtml);
      showMessagePopup('✅ Ссылка вставлена', false);
    }
    
    setShowLinkModal(false);
    setLinkUrl('https://');
    savedRangeRef.current = null;
    setTimeout(() => updateStats(), 10);
  };

  const handleImageConfirm = () => {
    if (!imageUrl) return;
    if (!isValidUrl(imageUrl)) {
      showMessagePopup('❌ Некорректный URL изображения');
      return;
    }
    
    restoreSelection();
    
    const imgHtml = `<img src="${imageUrl}" alt="Изображение" style="max-width: 100%; border-radius: 12px; margin: 10px 0; display: block;" />`;
    insertAtCursor(imgHtml);
    
    showMessagePopup('✅ Изображение вставлено', false);
    
    setShowImageModal(false);
    setImageUrl('https://');
    savedRangeRef.current = null;
    setTimeout(() => updateStats(), 10);
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
          }
          .email-content h1 { font-size: 2rem; margin-bottom: 1rem; }
          .email-content h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
          .email-content p { margin-bottom: 1rem; }
          .email-content img { max-width: 100%; border-radius: 16px; margin: 15px 0; }
          .email-content a { color: ${textColor}; text-decoration: underline; }
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

        .toolbar {
          position: fixed;
          top: 25px;
          right: 25px;
          z-index: 20;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          background: rgba(20, 25, 45, 0.7);
          backdrop-filter: blur(12px);
          padding: 12px 20px;
          border-radius: 60px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          pointer-events: auto;
        }

        .tool-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .tool-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.02);
        }

        .tool-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 12px;
          border-radius: 40px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .tool-select option {
          background: #1a1f35;
          color: white;
        }

        .color-input {
          width: 40px;
          height: 36px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          cursor: pointer;
        }

        .separator {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.3);
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
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          margin-bottom: 25px;
        }

        .editor-header {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(4px);
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .stats-bar {
          background: rgba(20, 25, 45, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 12px 20px;
          margin-top: 15px;
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.85rem;
        }

        .stat-label {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
        }

        .stat-value {
          font-weight: 700;
          font-size: 1.1rem;
          color: #a0c0ff;
        }

        .header-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .save-btn, .copy-btn, .reset-btn, .pdf-btn, .mobile-btn, .clear-btn, .send-btn {
          border: none;
          color: white;
          padding: 6px 18px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .save-btn {
          background: linear-gradient(135deg, #6c5ce7, #a363d9);
        }

        .save-btn:hover {
          transform: scale(1.02);
          background: linear-gradient(135deg, #7d6ef7, #b574e9);
        }

        .copy-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .copy-btn:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: scale(1.02);
        }

        .reset-btn {
          background: rgba(255, 100, 100, 0.3);
          border: 1px solid rgba(255, 100, 100, 0.5);
        }

        .reset-btn:hover {
          background: rgba(255, 100, 100, 0.5);
          transform: scale(1.02);
        }

        .pdf-btn {
          background: rgba(255, 150, 50, 0.3);
          border: 1px solid rgba(255, 150, 50, 0.5);
        }

        .pdf-btn:hover {
          background: rgba(255, 150, 50, 0.5);
          transform: scale(1.02);
        }

        .mobile-btn {
          background: rgba(50, 150, 255, 0.3);
          border: 1px solid rgba(50, 150, 255, 0.5);
        }

        .mobile-btn.active {
          background: rgba(50, 150, 255, 0.7);
          border-color: rgba(50, 150, 255, 0.9);
        }

        .mobile-btn:hover {
          background: rgba(50, 150, 255, 0.5);
          transform: scale(1.02);
        }

        .clear-btn {
          background: rgba(200, 50, 50, 0.3);
          border: 1px solid rgba(200, 50, 50, 0.5);
        }

        .clear-btn:hover {
          background: rgba(200, 50, 50, 0.5);
          transform: scale(1.02);
        }

        .send-btn {
          background: rgba(50, 200, 100, 0.3);
          border: 1px solid rgba(50, 200, 100, 0.5);
        }

        .send-btn:hover {
          background: rgba(50, 200, 100, 0.5);
          transform: scale(1.02);
        }

        .editable-content {
          padding: 40px;
          min-height: 500px;
          outline: none;
          font-size: 16px;
          line-height: 1.5;
          transition: all 0.3s ease;
        }

        .editable-content.mobile {
          max-width: 375px;
          margin: 0 auto;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.3);
        }

        .editable-content:focus {
          box-shadow: inset 0 0 0 3px rgba(108, 92, 231, 0.3);
        }

        .editable-content h1 { font-size: 2rem; margin: 0 0 0.5rem; }
        .editable-content h2 { font-size: 1.5rem; margin: 0 0 0.5rem; }
        .editable-content p { margin: 0 0 1rem; }
        .editable-content img { max-width: 100%; border-radius: 12px; margin: 10px 0; }

        .template-info-card {
          background: rgba(20, 25, 45, 0.5);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 15px 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .template-info-card p {
          color: rgba(220, 230, 255, 0.8);
          font-size: 0.85rem;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: rgba(108, 92, 231, 0.6);
          border-radius: 50px;
          font-size: 0.75rem;
          margin-top: 5px;
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
          font-size: 0.9rem;
          animation: fadeInOut 2.5s ease forwards;
          pointer-events: none;
        }

        .custom-alert.success {
          border: 1px solid rgba(100, 255, 100, 0.5);
        }

        .custom-alert.error {
          border: 1px solid rgba(255, 100, 100, 0.5);
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
          background: rgba(0, 0, 0, 0.8);
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
          border: 1px solid rgba(255,255,255,0.3);
          text-align: center;
        }

        .modal-content h3 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }

        .modal-content p {
          color: rgba(255,255,255,0.8);
          margin-bottom: 24px;
        }

        .modal-content input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
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
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .modal-btn.confirm:hover {
          transform: scale(1.02);
          background: linear-gradient(135deg, #7d6ef7, #b574e9);
        }

        @media (max-width: 860px) {
          .container {
            padding: 30px 16px 50px;
            margin-top: 20px;
          }
          .nav-buttons {
            position: relative;
            top: 0;
            left: 0;
            justify-content: center;
            margin-bottom: 20px;
            background: rgba(20, 25, 45, 0.8);
            backdrop-filter: blur(12px);
            padding: 12px;
            border-radius: 60px;
            flex-wrap: wrap;
          }
          .toolbar {
            position: relative;
            top: 0;
            right: 0;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .editable-content {
            padding: 20px;
          }
          .header-buttons {
            flex-direction: column;
            width: 100%;
          }
          .save-btn, .copy-btn, .reset-btn, .pdf-btn, .mobile-btn, .clear-btn, .send-btn {
            width: 100%;
            text-align: center;
          }
          .stats-bar {
            flex-direction: column;
            align-items: center;
            gap: 10px;
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
            placeholder="example@mail.com"
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
      <div className="mist"></div>

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
        
        <select onChange={handleFontSizeChange} className="tool-select" defaultValue="16px" title="Размер шрифта">
          <option value="10px">10px</option>
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
          <option value="48px">48px</option>
        </select>
        
        <div className="separator"></div>
        
        <button className="tool-btn" onClick={() => execCommand('justifyLeft')} title="Выровнять по левому краю">◀</button>
        <button className="tool-btn" onClick={() => execCommand('justifyCenter')} title="Выровнять по центру">▲</button>
        <button className="tool-btn" onClick={() => execCommand('justifyRight')} title="Выровнять по правому краю">▶</button>
        <button className="tool-btn" onClick={() => execCommand('justifyFull')} title="Выровнять по ширине">■</button>
        
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
        
        <button className="tool-btn" onClick={() => execCommand('undo')} title="Отменить">↩️</button>
        <button className="tool-btn" onClick={() => execCommand('redo')} title="Вернуть">↪️</button>
      </div>

      <div className="container">
        <div className="editor-area">
          <div className="editor-header">
            <span>✏️ НЕЙМАРК | Редактируемая область (кликните для ввода текста)</span>
            <div className="header-buttons">
              <button className="copy-btn" onClick={handleCopy} title="Скопировать HTML">📋 Скопировать HTML</button>
              <button className={`mobile-btn ${mobilePreview ? 'active' : ''}`} onClick={() => setMobilePreview(!mobilePreview)} title="Мобильный предпросмотр">
                📱 {mobilePreview ? 'Отключить' : 'Мобильный'} предпросмотр
              </button>
              <button className="pdf-btn" onClick={handleExportPDF} title="Сохранить как PDF">📄 Сохранить как PDF</button>
              <button className="send-btn" onClick={() => setShowSendModal(true)} title="Отправить письмо на email">✉️ Отправить письмо</button>
              <button className="reset-btn" onClick={resetToOriginal} title="Сбросить к исходному шаблону">🔄 Сбросить</button>
              <button className="clear-btn" onClick={() => setShowConfirmModal(true)} title="Удалить все черновики">🗑 Очистить черновики</button>
              <button className="save-btn" onClick={handleSave} title="Сохранить HTML">💾 Сохранить HTML</button>
            </div>
          </div>
          <div 
            ref={editableDivRef} 
            className={`editable-content ${mobilePreview ? 'mobile' : ''}`} 
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
    </>
  );
}

export default function TemplateEditorPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>Загрузка редактора...</div>}>
      <TemplateEditorContent />
    </Suspense>
  );
}