import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ArrowRight, ArrowUpRight, Check, Zap, Database, TrendingUp, Code, Layout, Smartphone, Globe, ShieldCheck, Target, Users, MessageSquare, Send, Loader2, Hotel, Bed, Key, MapPin, Utensils, Wine, Car, Navigation, Plane, Languages, Mail, Linkedin, Download
} from 'lucide-react';

// --- GEMINI API CONFIGURATION ---
const apiKey = ""; // Вставьте сюда ваш API Key от Google Gemini

// --- LANGUAGE DETECTION & MANAGEMENT ---
const detectUserLanguage = () => {
  // Check localStorage first
  const saved = localStorage.getItem('preferredLanguage');
  if (saved) return saved;

  // Check browser language
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('ru')) return 'ru';

  return 'en'; // Default to English
};

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    // Navbar
    works: 'Works',
    contact: 'Contact',

    // Homepage
    heroTag: 'Web3 • Digital • E-commerce',
    heroTitle1: 'Technical PM Who',
    heroTitle2: 'Fixes Whats Broken',
    heroDesc: 'I rescue failing projects, automate chaos, and build products that scale. Focused on execution, data, and technical depth.',
    yearsExp: 'Years Experience',
    productsLaunched: 'Products Launched',
    revenueImpact: '$K+ Revenue Impact',
    selectedCases: 'Selected Case Studies',
    readCase: 'Read Case',

    // Case Study Page
    backToProjects: 'Back to Projects',
    role: 'Role',
    timeline: 'Timeline',
    team: 'Team',
    website: 'Website',
    liveLink: 'Live Link',
    summary: 'Summary',
    contribution: 'Contribution',
    theProblem: 'THE PROBLEM',
    projectGoals: 'PROJECT GOALS',
    deliveryProcess: 'DELIVERY PROCESS',
    results: 'RESULTS',
    businessImpact: 'Business Impact',
    technicalMetrics: 'Technical Metrics',
    whatDidILearn: 'What did I learn?',
    nextCase: 'Next Case Study',
    specificChallenge: 'Specific Challenge',
    whatIDid: 'What I Did',
    outcome: 'Outcome',

    // AI Chat
    aiGreeting: "Hi! I'm Egor's AI assistant. Any questions about this case?",
    aiGreetingProject: "Hi! I'm Egor's AI assistant. Ask me anything about the",
    aiGreetingPortfolio: 'Portfolio',
    project: 'project.',
    askAboutCase: 'Ask about this case...',
    aiAssistant: 'AI Assistant',
    askAI: 'Ask AI'
  },
  ru: {
    // Navbar
    works: 'Проекты',
    contact: 'Контакт',

    // Homepage
    heroTag: 'Web3 • Digital • E-commerce',
    heroTitle1: 'Technical PM, который',
    heroTitle2: 'Чинит сломанное',
    heroDesc: 'Я спасаю проваливающиеся проекты, автоматизирую хаос и создаю продукты, которые масштабируются. Фокус на исполнении, данных и технической глубине.',
    yearsExp: 'Лет опыта',
    productsLaunched: 'Запущенных продуктов',
    revenueImpact: 'тыс.$ влияния на выручку',
    selectedCases: 'Избранные кейсы',
    readCase: 'Читать кейс',

    // Case Study Page
    backToProjects: 'Назад к проектам',
    role: 'Роль',
    timeline: 'Сроки',
    team: 'Команда',
    website: 'Сайт',
    liveLink: 'Перейти',
    summary: 'Резюме',
    contribution: 'Вклад',
    theProblem: 'ПРОБЛЕМА',
    projectGoals: 'ЦЕЛИ ПРОЕКТА',
    deliveryProcess: 'ЭТАПЫ РАБОТ',
    results: 'РЕЗУЛЬТАТЫ',
    businessImpact: 'Бизнес-эффект',
    technicalMetrics: 'Технические метрики',
    whatDidILearn: 'Чему я научился?',
    nextCase: 'Следующий кейс',
    specificChallenge: 'Конкретная проблема',
    whatIDid: 'Что я сделал',
    outcome: 'Результат',

    // AI Chat
    aiGreeting: 'Привет! Я AI-ассистент Егора. Есть вопросы по этому кейсу?',
    aiGreetingProject: 'Привет! Я AI-ассистент Егора. Задайте любой вопрос про проект',
    aiGreetingPortfolio: 'Portfolio',
    project: '.',
    askAboutCase: 'Спросите о кейсе...',
    aiAssistant: 'AI Ассистент',
    askAI: 'Спросить AI'
  }
};

// --- PROJECT CARD BACKGROUND ANIMATION ---
const ProjectCardBg = ({ projectId }) => {
  const icons = {
    'mg-hotels': [Hotel, Bed, Key, Globe],
    'inspiritaly': [MapPin, Utensils, Wine, Plane],
    'deluxe-limo': [Car, Navigation, Globe, Zap]
  };

  const selectedIcons = icons[projectId] || [];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      {[...Array(8)].map((_, i) => {
        const Icon = selectedIcons[i % selectedIcons.length];
        const delay = i * 0.15;
        const x = (i % 4) * 25;
        const y = Math.floor(i / 4) * 50;

        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          >
            <Icon
              size={40 + (i % 3) * 20}
              className="text-blue-500/10"
              strokeWidth={1}
            />
          </div>
        );
      })}
    </div>
  );
};

// --- COUNTER ANIMATION COMPONENT ---
const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef}>
      {prefix}{count}{suffix}
    </span>
  );
};

// --- AI CHAT COMPONENT ---
const AIChatWidget = ({ currentCase, t, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t.aiGreeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when changing cases or language
  useEffect(() => {
    setMessages([{ role: 'assistant', text: `${t.aiGreetingProject} ${currentCase ? currentCase.title : t.aiGreetingPortfolio}${t.project}` }]);
  }, [currentCase, language, t]);

  const generateResponse = async (userQuery) => {
    setIsLoading(true);
    
    // Context building
    const context = currentCase 
      ? `Ты цифровой двойник Technical PM Егора Андриенко. Сейчас пользователь смотрит кейс "${currentCase.title}".
         
         Данные кейса:
         - Роль: ${currentCase.role}
         - Проблема: ${currentCase.problem.desc}
         - Решение: ${currentCase.solution.desc}
         - Результаты: ${currentCase.results.desc}
         
         Твоя цель: Отвечать кратко, профессионально и уверенно, подчеркивая навыки Егора (Agile, Tech background, Data-driven). Не выдумывай факты, используй только предоставленные данные.`
      : `Ты цифровой двойник Technical PM Егора Андриенко. Твоя цель - помочь рекрутеру узнать больше о навыках Егора.`;

    try {
      let attempts = 0;
      let success = false;
      let data = null;

      while (attempts < 3 && !success) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `Context: ${context}\n\nUser Question: ${userQuery}` }]
              }]
            })
          });
          
          if (!response.ok) throw new Error('API Error');
          
          data = await response.json();
          success = true;
        } catch (e) {
          attempts++;
          await new Promise(r => setTimeout(r, 1000 * attempts));
        }
      }

      if (success && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const reply = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Извините, сейчас я не могу подключиться к серверу AI. Попробуйте позже.' }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Произошла ошибка связи.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    generateResponse(input);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] max-h-[500px] bg-[#111] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-neutral-800 bg-[#1A1A1A] flex justify-between items-center">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Zap size={14} className="text-yellow-400 fill-current" /> {t.aiAssistant}
            </span>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white"><X size={16}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0A0A] min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 p-3 rounded-lg rounded-bl-none text-neutral-400">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-neutral-800 bg-[#111] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.askAboutCase}
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 group flex items-center gap-0 hover:gap-2"
      >
        <MessageSquare size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-bold">
          {t.askAI}
        </span>
      </button>
    </div>
  );
};

// --- GENERATIVE MOCKUPS (SCREENS) ---
const WindowFrame = ({ title, children, className = "" }) => (
  <div className={`w-full bg-[#111] rounded-xl overflow-hidden border border-[#333] flex flex-col ${className}`}>
    <div className="h-8 bg-[#1A1A1A] border-b border-[#333] flex items-center px-4 gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
      <div className="ml-4 text-[10px] text-neutral-500 font-mono flex-1 text-center">{title}</div>
    </div>
    <div className="relative flex-1 bg-[#050505] p-1 overflow-hidden">
      {children}
    </div>
  </div>
);

const ScreenDashboard = () => (
  <div className="w-full h-full p-4 flex flex-col gap-4 opacity-80">
    <div className="flex gap-4">
      <div className="w-1/4 h-24 bg-[#222] rounded border border-[#333] p-3 flex flex-col justify-between">
        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center"><TrendingUp size={16} className="text-blue-500"/></div>
        <div className="h-2 w-12 bg-[#444] rounded"></div>
      </div>
      <div className="w-1/4 h-24 bg-[#222] rounded border border-[#333] p-3 flex flex-col justify-between">
        <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center"><Database size={16} className="text-green-500"/></div>
        <div className="h-2 w-12 bg-[#444] rounded"></div>
      </div>
      <div className="w-1/2 h-24 bg-[#222] rounded border border-[#333] p-3 relative overflow-hidden">
         <div className="absolute bottom-0 left-0 right-0 top-8 flex items-end justify-between px-2 pb-2 gap-1">
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} className="w-full bg-neutral-700 rounded-t" style={{height: `${h}%`}}></div>
            ))}
         </div>
      </div>
    </div>
    <div className="flex-1 bg-[#222] rounded border border-[#333] p-4 flex flex-col gap-3">
       <div className="flex justify-between border-b border-[#444] pb-2">
          <div className="h-3 w-24 bg-[#444] rounded"></div>
          <div className="h-3 w-8 bg-[#444] rounded"></div>
       </div>
       {[1,2,3,4].map(i => (
         <div key={i} className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
               <div className="w-6 h-6 rounded-full bg-[#333]"></div>
               <div className="h-2 w-32 bg-[#333] rounded"></div>
            </div>
            <div className="h-2 w-12 bg-[#333] rounded"></div>
         </div>
       ))}
    </div>
  </div>
);

const ScreenMobile = () => (
  <div className="w-full h-full flex justify-center items-center bg-[#0A0A0A]">
    <div className="w-[180px] h-[360px] bg-black border-[4px] border-[#333] rounded-[24px] overflow-hidden relative flex flex-col">
      <div className="h-12 bg-[#111] border-b border-[#222] flex items-center justify-center"><div className="w-12 h-3 bg-[#222] rounded-full"></div></div>
      <div className="flex-1 p-3 flex flex-col gap-3">
         <div className="w-full aspect-video bg-[#222] rounded-lg"></div>
         <div className="h-2 w-3/4 bg-[#222] rounded"></div>
         <div className="h-2 w-1/2 bg-[#222] rounded"></div>
         <div className="flex gap-2 mt-2">
            <div className="h-8 flex-1 bg-blue-600 rounded"></div>
            <div className="h-8 w-8 bg-[#222] rounded"></div>
         </div>
         <div className="mt-auto flex justify-between px-2 pt-2 border-t border-[#222]">
            <div className="w-6 h-6 rounded bg-[#222]"></div>
            <div className="w-6 h-6 rounded bg-[#222]"></div>
            <div className="w-6 h-6 rounded bg-[#222]"></div>
         </div>
      </div>
    </div>
  </div>
);

const ScreenCode = () => (
  <div className="w-full h-full p-4 font-mono text-[10px] text-neutral-400 overflow-hidden">
    <div className="flex gap-4">
      <div className="flex flex-col text-neutral-700 text-right select-none">
        {Array.from({length: 15}).map((_, i) => <span key={i}>{i+1}</span>)}
      </div>
      <div className="flex flex-col gap-1">
        <div><span className="text-purple-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-300">TourBuilder</span>() {'{'}</div>
        <div className="pl-4"><span className="text-purple-400">const</span> [config, setConfig] = <span className="text-blue-400">useTour</span>();</div>
        <div className="pl-4"><span className="text-purple-400">const</span> price = <span className="text-blue-400">computed</span>(() ={'>'} {'{'}</div>
        <div className="pl-8"><span className="text-neutral-500">// Dynamic pricing logic</span></div>
        <div className="pl-8"><span className="text-purple-400">return</span> base + (pax * <span className="text-orange-400">50</span>) + services;</div>
        <div className="pl-4">{'}'});</div>
        <div className="pl-4 text-neutral-500">/* Optimized for Nuxt SSR */</div>
        <div className="pl-4"><span className="text-purple-400">return</span> (</div>
        <div className="pl-8">{'<'}<span className="text-red-400">StepWizard</span> price={'{price}'} /{'>'}</div>
        <div className="pl-4">);</div>
        <div>{'}'}</div>
      </div>
    </div>
  </div>
);

const ScreenWireframe = () => (
  <div className="w-full h-full p-6 flex flex-col gap-4 bg-[#0A0A0A]">
     <div className="w-full h-8 bg-[#222] rounded flex items-center justify-between px-4">
        <div className="flex gap-2">
           <div className="w-4 h-4 rounded-full bg-[#333]"></div>
           <div className="w-16 h-2 bg-[#333] rounded"></div>
        </div>
        <div className="w-24 h-2 bg-[#333] rounded"></div>
     </div>
     <div className="flex gap-4 h-full">
        <div className="w-1/4 h-full bg-[#161616] rounded border border-[#222] p-2 flex flex-col gap-2">
           <div className="w-full h-2 bg-[#222] rounded"></div>
           <div className="w-full h-2 bg-[#222] rounded"></div>
           <div className="w-full h-2 bg-[#222] rounded"></div>
        </div>
        <div className="w-3/4 h-full flex flex-col gap-4">
           <div className="w-full h-32 bg-[#161616] rounded border border-[#222] flex items-center justify-center">
              <Layout size={32} className="text-[#333]"/>
           </div>
           <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-[#161616] rounded border border-[#222]"></div>
              <div className="h-24 bg-[#161616] rounded border border-[#222]"></div>
              <div className="h-24 bg-[#161616] rounded border border-[#222]"></div>
           </div>
        </div>
     </div>
  </div>
);


// --- DATA ---
const getDATA = (lang) => {
  const isRu = lang === 'ru';

  return {
  cases: [
    {
      id: 'mg-hotels',
      slug: 'mg-hotels',
      title: "MG Hotels",
      subtitle: isRu ? "Мультиобъектная платформа для гостиничного бизнеса" : "Multi-Property Hospitality Platform",
      tags: ["TravelTech"],

      // 1. HERO
      heroTitle: isRu ? "МУЛЬТИОБЪЕКТНАЯ ГОСТИНИЧНАЯ ПЛАТФОРМА" : "MULTI-PROPERTY HOSPITALITY PLATFORM",
      role: "Technical Project Manager",
      timeline: isRu ? "2-3 месяца" : "2-3 Months",
      team: isRu ? "10 специалистов" : "10 Specialists",

      // Визуалы
      visuals: {
        hero: <ScreenDashboard />,
        process: <ScreenWireframe />,
        solution: <ScreenDashboard />
      },

      // 2. SUMMARY
      summary: {
        desc: isRu
          ? "MG Hotels управляет 5 объектами среднего и премиум-сегмента в Москве. До этого проекта у каждого отеля был собственный сайт — отдельный хостинг, отдельные домены, отдельное управление контентом. Каждое обновление требовало времени разработчика, расходы на хостинг умножались на 5, а SEO было фрагментировано по доменам. Клиент хотел консолидации: одна платформа, меньше затрат, лучшая видимость в поиске. Я руководил технической реализацией — единая архитектура, CMS-управление контентом и SEO-оптимизация, которая обеспечила устойчивый рост."
          : "MG Hotels operates 5 mid-to-premium properties across Moscow. Before this project, each hotel had its own website — separate hosting, separate domains, separate content management. Every update required developer time, hosting costs were multiplied by 5, and SEO was fragmented across domains. The client wanted consolidation: one platform, lower costs, better search visibility. I led the technical delivery — unified architecture, CMS-driven content management, and SEO optimization that positioned them for sustainable growth.",
        contribution: isRu
          ? "Я управлял всей миграцией от концепции до запуска — техническая архитектура, координация процессов, согласование со стейкхолдерами и SEO-стратегия. Результат: масштабируемая платформа, которая снизила операционные издержки и улучшила органическую видимость."
          : "I managed the full migration from concept to launch — technical architecture, process coordination, stakeholder alignment, and SEO strategy. The result: a scalable platform that reduced operational overhead and improved organic visibility.",
        metrics: [
            { val: "5 → 1", label: isRu ? "Консолидация сайтов" : "Websites Consolidated" },
            { val: "-70%", label: isRu ? "Расходы на хостинг (5 серверов → 1)" : "Hosting Costs (5 servers → 1)" },
            { val: "-100%", label: isRu ? "Время разработчиков на контент" : "Dev Time on Content Updates" },
            { val: "+25%", label: isRu ? "SEO показы (3 месяца)" : "SEO Impressions (3 months)" },
            { val: "+75%", label: isRu ? "Индексированные страницы (~200 → ~350)" : "Indexed Pages (~200 → ~350)" }
        ]
      },

      // 3. PROBLEM
      problem: {
        desc: isRu
          ? "MG Hotels столкнулся с классической проблемой мультиобъектного бизнеса: операционная фрагментация."
          : "MG Hotels faced a classic multi-property challenge: operational fragmentation.",
        challenges: isRu ? [
          "5 отдельных сайтов, расходы × 5: У каждого отеля был свой домен, хостинг и кодовая база. Только хостинг стоил ~$1,000/месяц на 5 серверов. Любые общие обновления (изменение цен, политики) нужно было дублировать 5 раз.",
          "Нет CMS — каждое изменение через разработчика: Не было админ-панели. Обновить описание номера? Обратиться к разработчику. Изменить цены? Разработчик. Загрузить новые фото? Разработчик. Контент-менеджер был в бутылочном горлышке, а разработчики тратили 8–10 часов в неделю на тривиальные правки контента.",
          "Фрагментированный SEO-авторитет: Каждый сайт конкурировал за рейтинги в поиске независимо. Ссылочный вес распределялся на 5 доменов, размывая общую видимость. Google видел 5 слабых сайтов вместо 1 сильного бренда.",
          "Несогласованный брендовый опыт: У каждого сайта были небольшие различия в дизайне, разные структуры навигации и несогласованное качество контента. Это вредило восприятию бренда и доверию пользователей.",
          "Нет масштабируемости: Добавление 6-го объекта означало бы создание 6-го сайта. Модель не масштабировалась — каждый новый отель умножал сложность и затраты."
        ] : [
          "5 Separate Websites, 5x the Cost: Each hotel had its own domain, hosting, and codebase. Monthly hosting alone was ~$1,000 across 5 servers. Any shared updates (pricing changes, policy updates) had to be replicated 5 times.",
          "No CMS — Every Change Required Developer Time: There was no admin panel. Want to update a room description? Contact a developer. Change pricing? Developer. Upload new photos? Developer. The content manager was bottlenecked, and developers were spending 8–10 hours per week on trivial content edits.",
          "Fragmented SEO Authority: Each site competed for search rankings independently. Link equity was split across 5 domains, diluting overall visibility. Google saw 5 weak sites instead of 1 strong brand.",
          "Inconsistent Brand Experience: Each site had slight design variations, different navigation structures, and inconsistent content quality. This hurt brand perception and user trust.",
          "No Scalability: Adding a 6th property would mean building a 6th website. The model didn't scale — every new hotel multiplied complexity and cost."
        ]
      },

      // 4. GOALS
      goals: {
        desc: isRu
          ? "Задача клиента была ясна: 'Нам нужен один сайт, меньше расходов на хостинг, лучшее SEO и возможность управлять контентом самостоятельно.'"
          : "The client's directive was clear: 'We want one website, lower hosting costs, better SEO, and the ability to manage content ourselves.'",
        points: isRu ? [
            "Консолидировать 5 сайтов в 1 единую платформу — Одна кодовая база, один домен, общая инфраструктура",
            "Снизить операционные расходы — Сократить расходы на хостинг, исключить дублирующуюся разработку",
            "Обеспечить самостоятельное управление контентом — Дать клиенту полный контроль без зависимости от разработчиков",
            "Улучшить SEO-видимость — Консолидировать авторитет, увеличить индексированные страницы, оптимизировать для поиска",
            "Запуск до пикового сезона — Выйти в продакшн до Нового года (высокий сезон бронирований в Москве)"
        ] : [
            "Consolidate 5 websites into 1 unified platform — Single codebase, single domain, shared infrastructure",
            "Reduce operational costs — Cut hosting fees, eliminate redundant development work",
            "Enable self-service content management — Give the client full control without developer dependency",
            "Improve SEO visibility — Consolidate authority, increase indexed pages, optimize for search",
            "Launch before peak season — Go live before New Year's (high booking period in Moscow)"
        ]
      },

      // 5. DELIVERY PROCESS
      deliveryProcess: {
        steps: [
          {
            number: "01",
            title: isRu ? "Техническая архитектура и стратегия миграции" : "Technical Architecture & Migration Strategy",
            challenge: isRu
              ? "Миграция 5 сайтов без нарушения SEO, потери контента или простоя во время перехода."
              : "Migrating 5 websites without breaking SEO, losing content, or causing downtime during the transition.",
            whatIDid: "Tech stack selection: Backend/Frontend: Laravel (full-stack monolith for simplicity), CMS: Initially launched with Orchid CMS, later migrated to Filament based on team feedback and better admin UX, Hosting consolidation: 5 independent servers → 1 unified hosting environment (reducing costs by ~70%). Migration plan: Audit all 5 existing sites — content inventory, URL structures, assets. Design unified database schema — standardized room types, pricing models, booking flows. Build content import scripts — automated migration to minimize manual work. Set up 301 redirects — preserve SEO value from old domains. Key Decision: I recommended launching on a single primary domain (mghotels.ru) with the 4 old domains redirecting permanently (301). This consolidated link equity and sent clear signals to Google that these properties were now unified under one brand.",
            outcome: isRu
              ? "Нулевой простой во время миграции. Весь исторический контент сохранен. SEO-рейтинги остались стабильными во время перехода и улучшились в следующие месяцы."
              : "Zero downtime during migration. All historical content preserved. SEO rankings remained stable during transition and improved over the following months."
          },
          {
            number: "02",
            title: isRu ? "Внедрение No-Code CMS" : "No-Code CMS Implementation",
            challenge: isRu
              ? "Контент-менеджер клиента тратил часы в неделю, ожидая разработчиков для простых изменений. Это не масштабировалось."
              : "The client's content manager was spending hours per week waiting for developers to make simple changes. This wasn't scalable.",
            whatIDid: "Built a custom admin panel (Orchid CMS initially, then Filament) that gave the client full control over: Room details (descriptions, amenities, photos, pricing), Hotel pages (overview, location, services), SEO metadata (titles, descriptions, structured data), Booking settings (availability, seasonal pricing). The interface was designed for non-technical users — no code, no FTP, no developer dependency. Key Decision: We later migrated from Orchid to Filament based on user feedback. Filament offered better UX for content managers, faster performance, and easier customization for future features.",
            outcome: isRu
              ? "Время разработчиков на обновление контента сократилось с 8–10 часов/неделю до 0. Контент-менеджер теперь мог обновлять все 5 объектов в реальном времени без технической поддержки."
              : "Developer time on content updates dropped from 8–10 hours/week to 0. The content manager could now update all 5 properties in real-time without technical assistance."
          },
          {
            number: "03",
            title: isRu ? "SEO-оптимизация и рост видимости" : "SEO Optimization & Visibility Growth",
            challenge: isRu
              ? "5 отдельных доменов означали фрагментированный SEO-авторитет. Клиент хотел ранжироваться выше по конкурентным запросам типа 'отели в Москве', 'бутик-отели' и поиск по районам."
              : "5 separate domains meant fragmented SEO authority. The client wanted to rank higher for competitive keywords like 'hotels in Moscow,' 'boutique hotels,' and specific district searches.",
            whatIDid: "301 redirects from old domains: All 4 old domains permanently redirected to the new unified site, consolidating link juice and signaling to Google that this was the authoritative source. Schema.org structured data: Implemented JSON-LD markup for hotels — location, amenities, pricing, reviews. This helped Google display rich snippets in search results. Core Web Vitals optimization: Image compression and lazy loading, Minified CSS/JS, Server-side caching. Content strategy: Rewrote key pages with better keyword targeting, improved internal linking between hotel pages, and added unique content for each property (neighborhood guides, local attractions). Expanded indexed pages: The unified site had more pages indexed (~350 vs ~200 previously) because we added dedicated pages for room types, amenities, and location-specific content.",
            outcome: isRu
              ? "SEO-показы выросли на +25% за 3 месяца после запуска. Сайт начал ранжироваться по более широким брендовым запросам и захватил больше органического трафика."
              : "SEO impressions grew +25% in 3 months post-launch. The site started ranking for broader brand terms and captured more organic traffic."
          },
          {
            number: "04",
            title: isRu ? "Управление процессами и координация стейкхолдеров" : "Process Management & Stakeholder Coordination",
            challenge: isRu
              ? "Координация команды из 10 человек по дизайну, разработке, QA и аналитике с одновременным информированием клиента о прогрессе."
              : "Coordinating a 10-person team across design, development, QA, and analytics while keeping the client aligned on progress.",
            whatIDid: "Scrum framework: 2-week sprints, Bi-weekly releases, Daily standups (when needed, not mandatory), Sprint retrospectives and planning sessions. Stakeholder communication: Weekly Figma demos — I walked the client through design iterations, collected feedback, and logged changes in a structured backlog. Progress tracking in Jira — Client had read-only access to see what was in progress, what was blocked, and what was shipping next. Key Decision: I structured feedback sessions around specific deliverables rather than open-ended discussions. For example: 'Here's the booking flow — does it match your expectations?' This reduced scope creep and kept the project on track.",
            outcome: isRu
              ? "Ноль инцидентов в продакшене во время запуска. Клиент был вовлечен на всех этапах, но не перегружен техническими деталями. Поставка шла по графику, и платформа вышла за 2 месяца до пикового новогоднего сезона."
              : "Zero production incidents during launch. The client was involved throughout but not overwhelmed with technical details. Delivery stayed on schedule, and the platform went live 2 months before New Year's peak season."
          }
        ]
      },

      // 6. RESULTS
      results: {
        desc: isRu
          ? "Консолидированная платформа обеспечила немедленную экономию операционных расходов и долгосрочную стратегическую ценность."
          : "The consolidated platform delivered immediate operational savings and long-term strategic value.",
        businessImpact: isRu ? [
          "~$23k годовой экономии — Расходы на хостинг упали с ~$1,000/месяц до $300/месяц (экономия $8,400/год). Время разработчиков на обновление контента устранено ($15k/год в почасовых ставках).",
          "Запуск вовремя — Платформа вышла до Нового года, захватив бронирования высокого сезона без сбоев.",
          "Разблокирована масштабируемость — Добавление 6-го объекта теперь занимает дни (создать страницы в CMS) вместо месяцев (построить новый сайт).",
          "Эволюция платформы — После запуска мы мигрировали CMS с Orchid на Filament на основе отзывов пользователей. Это улучшило UX админки, сократило время загрузки и упростило будущую разработку функций."
        ] : [
          "~$23k annual savings — Hosting costs dropped from ~$1,000/month to $300/month ($8,400/year saved). Developer time on content updates eliminated ($15k/year in hourly rates).",
          "Launched on time — Platform went live before New Year's, capturing high-season bookings without disruption.",
          "Scalability unlocked — Adding a 6th property now takes days (create pages in CMS) instead of months (build a new site).",
          "Platform Evolution — Post-launch, we migrated the CMS from Orchid to Filament based on user feedback. This improved admin UX, reduced load times, and simplified future feature development."
        ],
        stats: [
          { val: "$1,000 → $300", label: isRu ? "Расходы на хостинг/месяц (-70%)" : "Hosting Costs/Month (-70%)" },
          { val: "8-10h → 0h", label: isRu ? "Время разработчиков на контент (-100%)" : "Dev Time on Content (-100%)" },
          { val: "+25%", label: isRu ? "SEO показы (3 месяца)" : "SEO Impressions (3 months)" },
          { val: "~200 → ~350", label: isRu ? "Индексированные страницы (+75%)" : "Indexed Pages (+75%)" },
          { val: isRu ? "2 месяца" : "2 months", label: isRu ? "Срок запуска (до дедлайна)" : "Launch Timeline (before deadline)" }
        ]
      },

      // 8. KEY LEARNINGS
      learnings: {
        blocks: isRu ? [
          {
            text: "Этот проект подтвердил принцип, который я видел в разных индустриях: консолидация — это конкурентное преимущество. MG Hotels не страдал от плохого дизайна или плохого маркетинга. Они теряли деньги на операционной неэффективности — расходы на хостинг ×5, фрагментированное SEO, зависимость от разработчиков для базовых обновлений.",
            align: "left"
          },
          {
            text: "Консолидируя инфраструктуру и убирая технические узкие места, мы не просто сэкономили деньги. Мы дали клиенту стратегическую гибкость — возможность запускать новые объекты, тестировать ценовые стратегии и итерировать контент без ожидания разработчиков.",
            align: "left"
          },
          {
            text: "Я также понял ценность процессной дисциплины при жестких дедлайнах. Миграция за 2–3 месяца могла пойти не так десятками способов. Но благодаря структурированным спринтам, четкой коммуникации со стейкхолдерами и безжалостной приоритизации, мы поставили вовремя с нулевыми инцидентами в продакшене. Наконец, этот проект показал мне, что SEO — это не только ключевые слова и обратные ссылки. Это техническое исполнение — скорость сайта, структурированные данные, правильные редиректы и контентная архитектура.",
            align: "right"
          }
        ] : [
          {
            text: "This project reinforced a principle I've seen across multiple industries: consolidation is a competitive advantage. MG Hotels wasn't suffering from poor design or bad marketing. They were bleeding money on operational inefficiency — 5x hosting costs, fragmented SEO, developer dependency for basic updates.",
            align: "left"
          },
          {
            text: "By consolidating infrastructure and removing technical bottlenecks, we didn't just save money. We gave the client strategic flexibility — the ability to launch new properties, test pricing strategies, and iterate on content without waiting for developers.",
            align: "left"
          },
          {
            text: "I also learned the value of process discipline under tight deadlines. A 2–3 month timeline for a full migration could've gone wrong in dozens of ways. But by running structured sprints, maintaining clear stakeholder communication, and prioritizing ruthlessly, we delivered on time with zero production incidents. Finally, this project showed me that SEO isn't just about keywords and backlinks. It's about technical execution — site speed, structured data, proper redirects, and content architecture.",
            align: "right"
          }
        ]
      },

      nextCase: "InspirItaly"
    },
    {
        id: 'inspiritaly',
        slug: 'inspiritaly',
        title: "InspirItaly",
        subtitle: isRu ? "Премиум TravelTech платформа" : "Premium TravelTech Platform",
        tags: ["TravelTech"],

        // 1. HERO
        heroTitle: isRu ? "ПРЕМИУМ TRAVELTECH ПЛАТФОРМА" : "PREMIUM TRAVELTECH PLATFORM",
        role: "Technical Project Manager",
        timeline: isRu ? "1,5 месяца" : "1.5 Months",
        team: isRu ? "20 специалистов" : "20 Specialists",

        visuals: {
            hero: <ScreenWireframe />,
            process: <ScreenCode />,
            solution: <ScreenMobile />
        },

        // 2. SUMMARY & CONTRIBUTION
        summary: {
            desc: isRu
              ? "InspirItaly — это премиум-платформа для бронирования индивидуальных туров по Италии, ориентированная на обеспеченных итало-американских путешественников. Платформа позволяет пользователям создавать персонализированные туристические впечатления — выбирать автомобили, добавлять премиальные услуги, такие как дегустации вин и частные гиды, и бронировать всё в одном потоке. Когда я присоединился, до начала пикового сезона (февраль–сентябрь) оставалось 6 недель, но проект застопорился из-за хаотичного управления. Предыдущий PM раздул бэклог до 50+ задач, накопил технический долг, а скорость команды падала. Клиенту нужен был готовый к продакшену продукт до начала сезона — без компромиссов по качеству."
              : "InspirItaly is a premium booking platform for custom Italy tours targeting affluent Italian-American travelers. The platform allows users to design personalized travel experiences — choosing vehicles, adding premium services like wine tastings and private guides, and booking everything in one flow. When I joined, the project was 6 weeks from peak season (February–September) but had stalled under chaotic management. The previous PM had bloated the backlog with 50+ tasks, accumulated tech debt, and the team's velocity was dropping. The client needed a production-ready product before season started — no compromises on quality.",
            contribution: isRu
              ? "Я взял на себя полную ответственность за поставку — очистил бэклог, ускорил команду на 25% и выпустил готовую к продакшену платформу за половину исходного таймлайна. Результат: масштабируемый движок бронирования, который конвертировал посетителей в покупателей и дал клиенту новый источник дохода."
              : "I took full ownership of delivery — cleaned the backlog, accelerated team velocity by 25%, and shipped a production-ready platform in half the original timeline. The result: a scalable booking engine that converted browsers into buyers and gave the client a new revenue stream.",
            metrics: [
                { val: "50%", label: isRu ? "Скорость выхода на рынок (1.5м vs 3)" : "Time to Market (1.5mo vs 3)" },
                { val: "25%", label: isRu ? "Рост скорости команды" : "Team Velocity Increase" },
                { val: "18%", label: isRu ? "Рост конверсии" : "Conversion Rate Lift" },
                { val: "$450k", label: isRu ? "Выручка (первые 6 месяцев)" : "Revenue (First 6 Months)" },
                { val: "0", label: isRu ? "Критические баги (месяц 1)" : "Critical Bugs (Month 1)" }
            ]
        },

        // 3. THE PROBLEM
        problem: {
          desc: isRu ? "До моего участия InspirItaly сталкивался с тремя критическими проблемами:" : "Before my involvement, InspirItaly faced three critical issues:",
          challenges: isRu ? [
            "Хаотичное управление проектом: Предыдущий PM потерял контроль. Бэклог разросся до 50+ задач без чёткой приоритизации. Члены команды не понимали, что делать дальше, скорость стагнировала, а дата запуска стремительно приближалась.",
            "Накопление технического долга: Плохие архитектурные решения в начале проекта создали узкие места. Качество кода было непоследовательным, покрытие тестами — низким, и каждая новая функция рисковала сломать существующий функционал.",
            "Жёсткий дедлайн с требованиями к качеству: Клиент требовал запуск в феврале, чтобы захватить туристический сезон (февраль–сентябрь в Италии). Бюджет был фиксирован, таймлайн — не подлежал обсуждению, но качество нельзя было принести в жертву — платформа должна была работать безупречно для премиум-клиентов.",
            "Негибкий процесс бронирования: Оригинальный дизайн предлагал только готовые пакеты туров (автомобиль + питание + активность). Исследование пользователей показало, что обеспеченные путешественники хотели гибкости — возможности кастомизировать свой опыт. Без этого платформа не смогла бы выделиться среди конкурентов."
          ] : [
            "Chaotic Project Management: The previous PM had lost control. The backlog had ballooned to 50+ tasks with no clear prioritization. Team members were confused about what to build next, velocity was stagnating, and the launch date was approaching fast.",
            "Technical Debt Accumulation: Poor architectural decisions early in the project had created bottlenecks. Code quality was inconsistent, testing coverage was low, and every new feature risked breaking existing functionality.",
            "Tight Deadline with Quality Expectations: The client demanded a February launch to capture the tourist season (February–September in Italy). The budget was fixed, the timeline non-negotiable, but quality could not be sacrificed — the platform needed to work flawlessly for premium customers.",
            "Inflexible Booking Flow: The original design only offered pre-packaged tours (vehicle + meal + activity). User research showed that affluent travelers wanted flexibility — the ability to customize their experience. Without this, the platform would fail to differentiate from competitors."
          ]
        },

        // 4. PROJECT GOALS
        goals: {
            desc: isRu ? "У нас была одна главная цель: запустить готовую к продакшену платформу до пикового сезона, без компромиссов по качеству." : "We had one overarching goal: launch a production-ready platform before peak season, with zero quality compromises.",
            points: isRu ? [
                "Выпустить MVP за 1,5 месяца — Сфокусироваться на ядре процесса бронирования, отложить функции 'было бы неплохо'",
                "Увеличить скорость команды — Разблокировать разработчиков, прояснить приоритеты, убрать отвлекающие факторы",
                "Построить гибкий движок бронирования — Позволить пользователям кастомизировать туры (автомобиль, пассажиры, дополнения)",
                "Обеспечить техническое качество — Никаких критических багов в продакшене, быстрая загрузка страниц, mobile-first UX",
                "Настроить масштабируемость — Создать фундамент для будущих итераций и white-label CMS"
            ] : [
                "Ship an MVP in 1.5 months — Focus on core booking flow, defer nice-to-have features",
                "Increase team velocity — Unblock developers, clarify priorities, remove distractions",
                "Build a flexible booking engine — Allow users to customize tours (vehicle, passengers, add-ons)",
                "Ensure technical quality — No critical bugs in production, fast page loads, mobile-first UX",
                "Set up for scale — Create a foundation for future iterations and white-label CMS"
            ]
        },

        // 5. DELIVERY PROCESS (NEW)
        deliveryProcess: {
            steps: [
                {
                    number: "01",
                    title: isRu ? "Хирургия бэклога" : "Backlog Surgery",
                    challenge: isRu
                      ? "Бэклог разросся до 50+ задач без фреймворка приоритизации. Функции варьировались от 'критично для запуска' до 'было бы неплохо когда-нибудь'. Команда была перегружена и не знала, на чём фокусироваться."
                      : "The backlog had grown to 50+ tasks with no prioritization framework. Features ranged from 'critical for launch' to 'nice-to-have someday.' The team was overwhelmed and didn't know what to focus on.",
                    whatIDid: isRu
                      ? "Я провёл полный аудит бэклога, используя матрицу Impact vs Effort. Каждая задача была оценена по: Бизнес-влияние (это увеличивает бронирования?), Ценность для пользователя (это улучшает опыт?), Технические усилия (сколько это займёт?). Ключевые решения: Вырезал 30% задач немедленно — функции вроде социального шэринга, элементов геймификации и мультиязычной поддержки (v1 будет только на английском). Сфокусировался на ядре процесса бронирования: Обзор туров → Кастомизация → Бронирование → Оплата. Всё остальное было деприоритизировано. Заблокировал скоуп после планирования — никаких новых функций в середине спринта, кроме критических багов."
                      : "I ran a full backlog audit using an Impact vs Effort matrix. Every task was scored based on: Business impact (does this drive bookings?), User value (does this improve the experience?), Technical effort (how long will this take?). Key Decisions: Cut 30% of tasks immediately — features like social sharing, gamification elements, and multilingual support (v1 would be English-only). Focused on the core booking flow: Browse tours → Customize → Book → Pay. Everything else was deprioritized. Locked scope after planning — no new features mid-sprint unless they were critical bugs.",
                    outcome: isRu
                      ? "У команды наконец появилась ясность. Разработчики точно знали, что строить, дизайнеры знали, что приоритизировать, а QA знали, что тестировать. Скорость сразу улучшилась, потому что больше не было путаницы 'над чем мне работать дальше?'."
                      : "The team finally had clarity. Developers knew exactly what to build, designers knew what to prioritize, and QA knew what to test. Velocity immediately improved because there was no more 'what should I work on next?' confusion."
                },
                {
                    number: "02",
                    title: isRu ? "Ускорение velocity" : "Velocity Acceleration",
                    challenge: isRu
                      ? "Команда доставляла 40 story points за спринт, но нужно было выйти на 50+, чтобы уложиться в дедлайн. Узкое место было не в таланте — а в неэффективности процессов."
                      : "The team was delivering 40 story points per sprint but needed to hit 50+ to meet the deadline. The bottleneck wasn't talent — it was process inefficiency.",
                    whatIDid: isRu
                      ? "Внедрил гибридный Agile-подход, сочетающий Scrum и Kanban: Спринты по 1 неделе вместо 2 недель (быстрые циклы обратной связи, меньше путаницы в середине спринта), Ежедневные 15-минутные стендапы (никаких больше часовых статусных встреч), Kanban-доска для срочных фиксов (баги не ждали следующего спринта), 20% каждого спринта резервировалось под технический долг (предотвращало будущие замедления). Я также внедрил сессии парного программирования для критических функций — два разработчика, работающих вместе, сокращали баги и изоляцию знаний. Ключевое решение: Сокращённые циклы спринтов означали, что команда должна была фокусироваться на меньших, более сфокусированных целях. Это заставило всех думать в терминах 'что минимально нужно выпустить?' вместо 'как сделать это идеальным?'"
                      : "Implemented a hybrid Agile approach combining Scrum and Kanban: 1-week sprints instead of 2-week (faster feedback loops, less mid-sprint confusion), Daily 15-minute standups (no more hour-long status meetings), Kanban board for urgent fixes (bugs didn't wait for the next sprint), 20% of each sprint reserved for tech debt (prevented future slowdowns). I also introduced pair programming sessions for critical features — two devs working together reduced bugs and knowledge silos. Key Decision: Shortened sprint cycles meant the team had to commit to smaller, more focused goals. This forced everyone to think in terms of 'what's the minimum we need to ship?' rather than 'how can we make this perfect?'",
                    outcome: isRu
                      ? "Velocity команды увеличилась с 40 story points/спринт до 50 story points/спринт — рост на 25%. Мы теперь были на пути к выполнению дедлайна."
                      : "Team velocity increased from 40 story points/sprint to 50 story points/sprint — a 25% improvement. We were now on track to hit the deadline."
                },
                {
                    number: "03",
                    title: isRu ? "Конструктор туров (Продуктовая инновация)" : "Custom Tour Builder (Product Innovation)",
                    challenge: isRu
                      ? "Оригинальный дизайн предлагал только готовые пакетные туры. Исследование пользователей (проведённое до моего прихода) показало, что обеспеченные путешественники хотели контроля над своим опытом — выбирать собственный автомобиль, добавлять дополнения и кастомизировать маршруты."
                      : "The original design only offered pre-packaged tours. User research (conducted before I joined) showed that affluent travelers wanted control over their experience — choosing their own vehicle, selecting add-ons, and customizing itineraries.",
                    whatIDid: isRu
                      ? "Я работал с командами дизайна и разработки, чтобы построить модульный движок бронирования: Шаг 1: Выбор типа автомобиля (седан, SUV, фургон) в зависимости от размера группы, Шаг 2: Выбор количества пассажиров, Шаг 3: Добавление премиальных услуг (дегустация вин, частный гид, фотосъёмка, встреча), Шаг 4: Динамический расчёт цены в реальном времени, Шаг 5: Мгновенный чекаут через Stripe. Ключевой инсайт: вместо того, чтобы загонять пользователей в жёсткие пакеты, мы позволили им строить собственный опыт. Система рассчитывала цену на лету на основе выбора. Ключевое решение: Мы построили это как mobile-first опыт, потому что аналитика показала, что 70% трафика шло с мобильных устройств. Десктоп-версия была вторичной."
                      : "I worked with the design and dev teams to build a modular booking engine: Step 1: Choose vehicle type (sedan, SUV, van) based on group size, Step 2: Select number of passengers, Step 3: Add premium services (wine tasting, private guide, photography, meet & greet), Step 4: Dynamic pricing calculation in real-time, Step 5: Instant checkout with Stripe. The key insight: instead of forcing users into rigid packages, we let them build their own experience. The system calculated pricing on the fly based on selections. Key Decision: We built this as a mobile-first experience because analytics showed 70% of traffic came from mobile devices. The desktop version was secondary.",
                    outcome: isRu
                      ? "Конверсия увеличилась на 18% (измерялась как посетители, которые начали процесс бронирования → завершили оплату). Пользователи тратили больше времени на кастомизацию туров, а средний чек вырос, потому что они добавляли премиальные услуги."
                      : "Conversion rate increased by 18% (measured as visitors who started the booking flow → completed payment). Users spent more time customizing their tours, and average order value went up because they were adding premium services."
                },
                {
                    number: "04",
                    title: isRu ? "Оптимизация производительности" : "Performance Optimization",
                    challenge: isRu
                      ? "Начальные билды имели плохую производительность — время загрузки страниц было медленным, изображения не оптимизированы, а мобильный UX был неуклюжим."
                      : "The initial builds had poor performance — page load times were slow, images were unoptimized, and mobile UX was clunky.",
                    whatIDid: isRu
                      ? "Оптимизация изображений: Конвертировал все изображения в 4 формата (WebP, AVIF, JPG, PNG) с автоматическими фоллбэками для старых браузеров. Внедрил ленивую загрузку для контента ниже сгиба. AWS S3 + CloudFront CDN: Переместил все статические ассеты на S3 и раздавал их через CloudFront. Это сократило время загрузки изображений на 60%. Code splitting (Next.js): Разбил JavaScript-бандлы, чтобы пользователи загружали только код, нужный для текущей страницы. Это сократило размер начального бандла на 40%. Ленивая загрузка и prefetching: Критические ресурсы загружались первыми, некритические — в фоне."
                      : "Image optimization: Converted all images to 4 formats (WebP, AVIF, JPG, PNG) with automatic fallbacks for older browsers. Implemented lazy loading for below-the-fold content. AWS S3 + CloudFront CDN: Moved all static assets to S3 and served them via CloudFront. This reduced image load times by 60%. Code splitting (Next.js): Split JavaScript bundles so users only loaded the code they needed for the current page. This reduced initial bundle size by 40%. Lazy loading & prefetching: Critical resources loaded first, non-critical resources loaded in the background.",
                    outcome: isRu
                      ? "PageSpeed скор улучшился с 67 (мобильный) до 92 (мобильный) и 96 (десктоп). Более быстрое время загрузки снизило bounce rate и улучшило SEO-рейтинги."
                      : "PageSpeed score improved from 67 (mobile) to 92 (mobile) and 96 (desktop). Faster load times reduced bounce rate and improved SEO rankings."
                },
                {
                    number: "05",
                    title: isRu ? "Контроль качества под давлением" : "Quality Assurance Under Pressure",
                    challenge: isRu
                      ? "Жёсткие дедлайны часто приводят к компромиссам в качестве. Клиент был ясен: 'Нам нужно это быстро, но это должно работать идеально'."
                      : "Tight deadlines often lead to quality shortcuts. The client was clear: 'We need this fast, but it must work perfectly.'",
                    whatIDid: isRu
                      ? "End-to-end тестирование (Cypress): Автоматизированные тесты для всего процесса бронирования — от лендинга до подтверждения оплаты. Покрытие unit-тестами (70%): Критическая бизнес-логика (расчёт цены, проверки доступности, обработка платежей) была полностью протестирована. Поэтапный раскат: Мы не запускались для всех сразу. Сначала внутреннее QA-тестирование. Затем бета-запуск для 100 пользователей. Затем публичный запуск. Система приоритизации багов: Критические баги (сбои платежей, ошибки бронирования) исправлялись немедленно. Мелкие баги (UI-твики) шли в следующий спринт. Ключевое решение: Я настоял на 2-недельном буфере перед публичным запуском для исправления багов. Клиент сопротивлялся, но я показал им риск: запуск с багами платежей разрушит доверие и будет стоить дороже в возвратах, чем задержка на 2 недели."
                      : "End-to-end testing (Cypress): Automated tests for the entire booking flow — from landing page to payment confirmation. Unit test coverage (70%): Critical business logic (pricing calculation, availability checks, payment processing) was fully tested. Staged rollout: We didn't launch to everyone at once. First, internal QA testing. Then, beta launch to 100 users. Then, public launch. Bug triage system: Critical bugs (payment failures, booking errors) were fixed immediately. Minor bugs (UI tweaks) went into the next sprint. Key Decision: I insisted on a 2-week buffer before public launch for bug fixes. The client pushed back, but I showed them the risk: launching with payment bugs would destroy trust and cost more in refunds than delaying 2 weeks.",
                    outcome: isRu
                      ? "Ноль критических багов в первый месяц продакшена. Мелкие UI-проблемы логировались и исправлялись в последующих спринтах, но ядро процесса бронирования работало безупречно."
                      : "Zero critical bugs in the first month of production. Minor UI issues were logged and fixed in subsequent sprints, but the core booking flow worked flawlessly."
                }
            ]
        },

        // 6. RESULTS
        results: {
          desc: "The platform launched in 1.5 months instead of 3 — a 50% faster delivery. Here's what happened next:",
          businessImpact: [
            "$450k revenue in the first 6 months — The platform generated enough revenue to cover development costs and achieve profitability within 4 months.",
            "ROI achieved in 4 months — Client broke even on their investment faster than expected due to high conversion rates and premium pricing.",
            "White-label CMS opportunity — Success led to a new B2B2C revenue stream. We built a white-label version of the platform (using Filament CMS) that other travel agencies could license. This became an additional revenue source."
          ],
          stats: [
            { val: "3.2% → 3.78%", label: "Conversion Rate (+18% lift)" },
            { val: "$2,400 → $2,930", label: "Avg Order Value (+22%)" },
            { val: "67 → 92", label: "PageSpeed Mobile (+37%)" },
            { val: "+28%", label: "Organic Traffic (3 months)" },
            { val: "0", label: "Critical Bugs (Month 1)" }
          ]
        },

        // 8. KEY LEARNINGS (NEW)
        learnings: {
          blocks: [
            {
              text: "This project reinforced a core principle: Speed and quality aren't opposites — they're the result of ruthless prioritization. The key wasn't working faster. It was cutting everything that didn't directly contribute to the core value proposition. Social sharing features? Nice-to-have. Gamification? Later. Multilingual support? Version 2.",
              align: "left"
            },
            {
              text: "By focusing on the one thing that mattered — a smooth, flexible booking experience — we delivered faster and better than the original timeline promised. I also learned that team velocity is a function of clarity. When developers know exactly what to build and why, they move fast. When the backlog is a mess of competing priorities, they slow down.",
              align: "left"
            },
            {
              text: "Finally, this project taught me the value of technical quality under pressure. Cutting corners on testing or architecture would've saved a few days but cost weeks in bug fixes and user complaints. Quality isn't a luxury — it's a prerequisite for long-term success.",
              align: "right"
            }
          ]
        },

        nextCase: "Deluxe Limo Italy"
      },
      {
        id: 'deluxe-limo',
        slug: 'deluxe-limo',
        title: "Deluxe Limo Italy",
        subtitle: isRu ? "Платформа премиум-трансферов" : "Premium Ground Transportation Platform",
        tags: ["B2B"],

        heroTitle: isRu ? "ПЛАТФОРМА ПРЕМИУМ-ТРАНСФЕРОВ" : "PREMIUM GROUND TRANSPORTATION PLATFORM",
        role: "Technical Project Manager",
        timeline: isRu ? "Ongoing (основная фаза: 3 месяца)" : "Ongoing (3 months major phase)",
        team: isRu ? "10 человек (4 разработчика, 2 QA, 1 аналитик, 1 дизайнер, 1 PM, 1 sales/ops)" : "10 Specialists",

        visuals: {
            hero: <ScreenMobile />,
            process: <ScreenWireframe />,
            solution: <ScreenCode />
        },

        summary: {
            desc: isRu
              ? "Deluxe Limo Italy — сервис премиальных трансферов по Италии для состоятельных итало-американских туристов и B2B-клиентов (турагентства, отели). Когда я пришёл в проект, весь бизнес работал вручную — каждый заказ обрабатывался по email, оплата собиралась через счета, из-за медленного ответа клиенты уходили к конкурентам. Я запустил автоматизированную систему бронирования с интеграцией в CRM, которая превратила ручной процесс в масштабируемую платформу. Результат: конверсия выросла, брошенные заказы начали возвращаться, появился фундамент для B2B-расширения."
              : "Deluxe Limo Italy provides premium transfers across Italy, targeting affluent Italian-American travelers and B2B partners (travel agencies, hotels). When I joined, the business relied on manual lead processing — every booking required back-and-forth emails, manual payment collection, and high abandonment rates due to slow response times. I led the development of an automated booking engine with integrated CRM automation, transforming a manual sales process into a scalable, conversion-optimized platform. The result: higher conversion rates, recovered abandoned bookings, and a foundation for B2B expansion.",
            contribution: isRu
              ? "Я управлял всем — продуктовая стратегия, архитектура, интеграция CRM, контроль качества. Сейчас платформа обрабатывает B2C-заказы автоматически и поддерживает B2B-партнёров через отдельные личные кабинеты с оплатой по счёту."
              : "I managed end-to-end delivery — product strategy, technical architecture, CRM automation, and quality assurance. The platform now handles B2C bookings automatically and supports B2B partners with dedicated dashboards and NET30 payment terms.",
            metrics: [
                { val: "+62%", label: isRu ? "Рост конверсии" : "Conversion Rate Increase" },
                { val: "90%", label: isRu ? "Заказов обрабатываются автоматически" : "Bookings Automated" },
                { val: "18%", label: isRu ? "Возврат брошенных корзин" : "Abandoned Cart Recovery" },
                { val: "-31%", label: isRu ? "Снижение Bounce Rate на мобильных" : "Mobile Bounce Rate" },
                { val: "-60%", label: isRu ? "Сокращение времени QA на регрессию" : "QA Regression Time" }
            ]
        },

        problem: {
          desc: isRu ? "До автоматизации Deluxe Limo работал как консьерж-сервис — персонализированно, вручную, без возможности масштабирования." : "Before the booking engine, Deluxe Limo operated like a traditional concierge service — high-touch, manual, unscalable.",
          challenges: isRu ? [
            "Всё вручную = клиенты уходят. Сайт собирал заявки через форму, дальше — email-переписка. Sales отправляли коммерческое предложение, согласовывали цену, высылали счёт, ждали оплату. На каждый заказ уходило 30–40 минут. Из-за медленного ответа 20–30% клиентов уходили — они бронировали у конкурентов с мгновенным подтверждением.",
            "Не было данных, где клиенты отваливаются. Sales не понимали, на каком этапе теряются клиенты. Они видели цену и уходили? Заполняли форму и исчезали? Получали КП и не отвечали? Без аналитики работали вслепую.",
            "QA выгорал на регрессии. Первые разработчики писали код без архитектуры (SOLID не использовали, модули не разделяли). Каждая новая фича рисковала сломать существующий функционал. QA тратил 80% времени на регрессию вместо тестирования новых фич.",
            "Мобилка работала плохо. 60% трафика — мобильные, но bounce rate на мобилках был 58%. Причины: медленная загрузка (PageSpeed 42), мелкие кнопки (38px вместо 48px для тач-экранов), перегруженный интерфейс.",
            "B2B работал через жопу. Турагентства хотели заказывать трансферы для клиентов, но не было личного кабинета. Приходилось писать email или звонить — узкое место для роста партнёрств."
          ] : [
            "Manual Booking Process = High Abandonment: The existing website collected leads via forms, but every booking required manual processing: sales team emailed quotes, negotiated pricing, sent invoices, and waited for bank transfers. Each booking took 30–40 minutes of staff time. Slow response times led to 20–30% abandonment — users would inquire but book with competitors who offered instant confirmation.",
            "No Visibility into Drop-Off Points: The sales team had no data on where users abandoned the process. Did they leave after seeing the price? After filling out the form? After receiving the quote? Without analytics, we were flying blind.",
            "QA Burnout from Regression Testing: The original dev team had no architectural discipline (SOLID principles ignored, no modular structure). Every new feature risked breaking existing functionality. QA spent 80% of their time on regression testing instead of validating new features.",
            "Poor Mobile Experience: 60% of traffic came from mobile devices, but the site had a 58% mobile bounce rate. Root causes: slow load times (PageSpeed score of 42), tiny clickable areas (buttons were 38px instead of the recommended 48px for touch), and cluttered UI that didn't prioritize the booking CTA.",
            "No B2B Infrastructure: Travel agencies wanted to book transfers for clients but had no self-service portal. They had to email or call, creating bottlenecks and limiting partnership growth."
          ]
        },

        goals: {
            desc: isRu ? "Клиент хотел: «Автоматизировать процесс так, чтобы мы могли обрабатывать в 10 раз больше заказов без увеличения штата»." : "The client's directive: 'Build an automated booking engine that replaces manual workflows and scales to handle 10x the current volume.'",
            points: isRu ? [
                "Автоматизировать 90%+ заказов — От выбора маршрута до подтверждения оплаты без участия человека",
                "Внедрить CRM-автоматизацию — Возвращать брошенные корзины через email/SMS",
                "Создать B2B-портал — Дать агентствам возможность бронировать массово, работать по счетам",
                "Улучшить мобилку — Снизить bounce rate, оптимизировать под touch, ускорить загрузку",
                "Внедрить автотесты — Снизить нагрузку на QA и убрать регрессии"
            ] : [
                "Automate 90%+ of bookings — From route selection to payment confirmation, zero human intervention for standard bookings",
                "Integrate CRM automation — Recover abandoned carts with intelligent email/SMS drip campaigns",
                "Build B2B portal — Allow agencies to book in bulk, manage clients, and access NET30 payment terms",
                "Improve mobile conversion — Reduce bounce rate, optimize for touch, speed up load times",
                "Implement quality gates — Automated testing to prevent regressions and reduce QA workload"
            ]
        },

        deliveryProcess: {
          steps: [
            {
              number: "01",
              title: isRu ? "Автоматическая система бронирования (B2C)" : "Automated Booking Engine (B2C)",
              challenge: isRu
                ? "Перейти от ручного сбора заявок к полностью автоматической системе без потери премиального имиджа бренда."
                : "Transitioning from a manual lead-capture form to a fully automated booking flow without losing the premium, concierge-style brand positioning.",
              whatIDid: isRu
                ? "Новый процесс бронирования: Шаг 1: Выбор маршрута. Пользователи вводят точки подачи/высадки с автодополнением Google Places. Шаг 2: Выбор машины. Показываем доступные варианты (седан, внедорожник, микроавтобус) с ценой в реальном времени. Шаг 3: Дополнительные услуги. Выбор опций: детские кресла, шампанское, Wi-Fi, табличка для встречи. Шаг 4: Мгновенная оплата. Интеграция со Stripe, подтверждение без email-переписки. Прозрачное ценообразование: Цена считается сразу на основе маршрута, типа машины и доп. услуг. Пользователь видит финальную цену заранее без скрытых комиссий. Автоматическое подтверждение: После оплаты — мгновенное письмо с деталями заказа, информацией о водителе (назначается за 24 часа до подачи) и условиями отмены. Ключевое решение: Сделали два отдельных flow — B2C (мгновенное бронирование + оплата) и B2B (личный кабинет с оплатой по счёту, массовая загрузка CSV для 10+ трансферов, отслеживание комиссий). Это позволило работать с обоими рынками без ущерба для UX."
                : "Booking flow redesign: Step 1: Route Selection — Users enter pickup/drop-off locations with Google Places autocomplete (reduces friction, auto-fills addresses). Step 2: Vehicle Selection — Display available vehicles (sedan, SUV, van) with real-time pricing based on route distance and duration. Step 3: Add-Ons — Users select premium services (child seats, champagne, Wi-Fi, meet & greet signage). Step 4: Instant Payment — Stripe integration for immediate booking confirmation (no email back-and-forth). Dynamic pricing engine: Price calculated in real-time based on route, vehicle type, and add-ons. Users see transparent, upfront pricing — no hidden fees, no surprises. Confirmation automation: After payment, users receive instant email confirmation with booking details, driver info (assigned 24h before pickup), and cancellation policy. Key Decision: We built two separate flows — B2C (instant booking + payment) and B2B (agency dashboard with NET30 terms, bulk CSV upload for 10+ transfers, and commission tracking). This allowed us to serve both markets without compromising UX for either.",
              outcome: isRu
                ? "90% заказов обрабатываются автоматически. Sales освобождён от рутины — теперь фокусируются на B2B-партнёрствах и VIP-клиентах."
                : "90% of bookings now process automatically. Sales team freed from repetitive data entry and payment collection — they now focus on B2B partnerships and VIP client relationships."
            },
            {
              number: "02",
              title: isRu ? "CRM-автоматизация и возврат брошенных корзин" : "CRM Automation & Abandoned Cart Recovery",
              challenge: isRu
                ? "Яндекс.Метрика показывала, что 45% пользователей бросали заказ до оплаты. Нужно было вернуть эти лиды без ручной работы Sales."
                : "Yandex Metrica data showed 45% of users who started the booking flow abandoned before payment. We needed to recover these leads without manual sales follow-up.",
              whatIDid: isRu
                ? "Интегрировал Zoho CRM для отслеживания поведения и автоматических цепочек: Цепочка 1: Ввёл маршрут, машину не выбрал. Триггер: Пользователь ввёл маршрут и ушёл с сайта. Действие: Email через 15 минут — «Завершите бронирование». Цепочка 2: Выбрал машину, не оплатил. Триггер: Пользователь выбрал машину, но не перешёл к оплате. Действие: Email через 30 минут + промокод 10% + SMS. Цепочка 3: Дошёл до оплаты и ушёл. Триггер: Пользователь открыл страницу оплаты, но не завершил. Действие: Email через 1 час со ссылкой на онлайн-чат. Логика сегментации: Дорогие маршруты (аэропорт, многодневные поездки) получали телефонный звонок + email. Недорогие — только email для экономии времени Sales. Ключевое решение: A/B-тестировали скидки — 5%, 10%, 15% — выяснили, что 10% оптимально (выше возврат без сильного ущерба марже). Также тестировали тайминг SMS — мгновенная SMS для дорогих заказов работала в 2 раза лучше отложенной."
                : "Integrated Zoho CRM with the booking platform to track user behavior and trigger automated campaigns: Drip Campaign 1: Route Entered, No Vehicle Selected — Trigger: User entered route but left site. Action: Email sent 15 minutes later — 'Complete your booking and save time'. Drip Campaign 2: Vehicle Selected, No Payment — Trigger: User selected vehicle but didn't proceed to payment. Action: Email sent 30 minutes later + 10% discount code + SMS reminder. Drip Campaign 3: Payment Page Abandoned — Trigger: User reached payment page but didn't complete transaction. Action: Email sent 1 hour later with live chat link for support. Segmentation logic: High-value routes (airport transfers, multi-day trips) received phone follow-up in addition to email. Low-value routes got email-only sequences to optimize sales team time. Key Decision: We A/B tested discount thresholds — 5%, 10%, 15% — and found that 10% was the sweet spot (higher recovery rate without eroding margins). We also tested SMS timing and found that immediate SMS for high-value bookings had 2x higher response rates than delayed follow-up.",
              outcome: isRu
                ? "18% возврата брошенных корзин. Примерно $180k в год возвращённой выручки от пользователей, которые иначе ушли бы к конкурентам."
                : "18% abandoned cart recovery rate. Estimated $180k/year in recovered revenue from users who would have otherwise booked with competitors."
            },
            {
              number: "03",
              title: isRu ? "Технический rescue и автотестирование" : "Technical Rescue & Test Automation",
              challenge: isRu
                ? "Первые разработчики сдали сломанный код. Без архитектуры (SOLID игнорировали), без тестов, куча регрессий. QA выгорал — 80% времени на ручную регрессию."
                : "The original dev team had delivered a broken codebase. No architectural patterns (SOLID ignored), no test coverage, frequent regressions. QA was in burnout mode — 80% of their time spent on manual regression testing.",
              whatIDid: isRu
                ? "Шаг 1: Заменил команду разработчиков. Нанял senior-инженеров, которые понимают модульную архитектуру и разработку через тесты. Шаг 2: Внедрил E2E-тесты (Playwright + Selenium). Полный процесс бронирования протестирован на Chrome, Safari, Firefox, Edge. Интеграция с платёжным шлюзом протестирована (тестовые карты Stripe). Триггеры CRM проверены (письма о брошенных корзинах отправляются корректно). Шаг 3: Рефакторинг кода. Внедрил service layer (бизнес-логика отделена от контроллеров). Вынес логику платёжного шлюза в отдельный слой (легче менять провайдеров). Оптимизировал запросы к БД (создание заказа: 8 секунд → 1.2 секунды). Покрытие тестами: Frontend: 85% (критичные UI-процессы). Backend: 75% (бизнес-логика, API). Ключевое решение: Сначала приоритизировал E2E-тесты, а не unit-тесты, потому что главный риск — регрессии на стороне пользователя (сломанный процесс бронирования = потерянные деньги). Unit-тесты добавлял постепенно."
                : "Step 1: Replace the dev team — Hired senior engineers who understood modular architecture, separation of concerns, and test-driven development. Step 2: Implement E2E tests (Playwright + Selenium) — Full booking flow tested across Chrome, Safari, Firefox, and Edge. Payment gateway integration tested with Stripe test cards. CRM triggers validated (abandoned cart emails firing correctly). Step 3: Code refactoring — Introduced service layer architecture (business logic separated from controllers). Extracted payment gateway logic into abstraction layer (easier to swap providers). Database query optimization (reduced booking creation time from 8 seconds to 1.2 seconds). Coverage metrics: Frontend: 85% test coverage (critical UI flows). Backend: 75% test coverage (business logic, API endpoints). Key Decision: I prioritized E2E tests over unit tests initially because the biggest risk was user-facing regressions (broken booking flow = lost revenue). Unit tests were added incrementally as we refactored modules.",
              outcome: isRu
                ? "Нагрузка на QA: 20 часов/неделю → 8 часов/неделю (минус 60%). Скорость релизов +40%, потому что выкатывали уверенно без ручного пере-тестирования всего. Баги в продакшене: ~15/месяц → <2/месяц (минус 87%)."
                : "QA workload dropped from 20 hours/week on regression to 8 hours/week (-60%). Release velocity increased by 40% because we could ship confidently without manual re-testing of the entire app. Production bugs dropped by 87% (~15 bugs/month → <2 bugs/month)."
            },
            {
              number: "04",
              title: isRu ? "Мобильная оптимизация (UX + производительность)" : "Mobile Optimization (UX + Performance)",
              challenge: isRu
                ? "60% трафика — мобильные, но bounce rate 58%. Пользователи заходили, видели медленную загрузку и перегруженный интерфейс, уходили."
                : "60% of traffic was mobile, but bounce rate was 58%. Users were landing, seeing slow load times and cluttered UI, and leaving immediately.",
              whatIDid: isRu
                ? "UX-изменения: Упростил навигацию — Меню с 7 пунктов до 3 (Забронировать, Мои поездки, Поддержка). Прогрессивное раскрытие — Показываем только важное сначала (ввод маршрута), детали раскрываются после первого шага. Touch-friendly элементы — Все кнопки 56px высоты (больше рекомендации Apple 44px). Прогресс-бар — 4 шага, пользователь видит, где он находится. Оптимизация производительности: Lazy loading — Картинки и некритичный JS загружаются только при прокрутке. Оптимизация изображений — WebP с fallback на JPG (на 60% меньше вес). Code splitting — JS-бандл: 840KB → 320KB (загружается только код для текущей страницы). CDN — Статика раздаётся через Cloudflare CDN. Ключевое решение: Использовал PageSpeed Insights как главную метрику. Каждое решение оценивалось через: «Улучшит ли это Core Web Vitals?»"
                : "UX changes: Simplified navigation — Menu reduced from 7 items to 3 (Book, My Trips, Support). Progressive disclosure — Show only essential info first (route input), reveal details (vehicle options) after initial input. Touch-friendly targets — All buttons increased to 56px height (exceeds Apple's 44px recommendation). Progress indicator — 4-step progress bar shows users exactly where they are in the booking flow. Performance optimizations: Lazy loading — Images and non-critical JS loaded only when scrolled into view. Image format optimization — WebP format with fallback to JPG (60% smaller file sizes). Code splitting — JavaScript bundle reduced from 840KB to 320KB (only load code needed for current page). CDN integration — Static assets served via Cloudflare CDN. Key Decision: We used PageSpeed Insights as the north star metric. Every design decision was evaluated against: 'Will this improve Core Web Vitals?'",
              outcome: isRu
                ? "PageSpeed: 42 → 87 (mobile), 96 (desktop). Mobile bounce rate: 58% → 40% (минус 31%). Mobile conversion: +14%"
                : "PageSpeed score: 42 → 87 (mobile), 96 (desktop). Mobile bounce rate: 58% → 40% (-31%). Mobile conversion rate: +14% (more users completing bookings on mobile)."
            },
            {
              number: "05",
              title: isRu ? "Аналитика и data-driven решения" : "Analytics & Data-Driven Optimization",
              challenge: isRu
                ? "У клиента была Google Analytics, но без кастомных событий. Видели трафик, но не поведение внутри процесса бронирования."
                : "The client had Google Analytics installed but no custom event tracking. They could see traffic but not user behavior inside the booking flow.",
              whatIDid: isRu
                ? "Кастомные события: Поиск маршрута, Просмотр машины, Клик по доп. услугам, Инициирование оплаты, Завершение бронирования. Визуализация воронки: Главная → Маршрут → Машина → Оплата → Подтверждение. Обнаружили, что 62% уходили на этапе оплаты. Причина: пользователи ожидали больше способов оплаты (была только карта). Решение: Добавили Apple Pay и Google Pay → отказы на оплате упали на 19%. Когортный анализ: B2C бронируют за 7 дней (спонтанные поездки). B2B бронируют за 21 день (запланированные туры). Средний чек B2C: $285. Средний чек B2B: $1,240. Инсайт: B2B клиенты более чувствительны к last-minute ценам. Внедрили ступенчатое ценообразование — бронь за 30+ дней = скидка 15%. Это сгладило спрос и увеличило ранние бронирования. A/B-тесты: Показывать цену сразу vs скрывать до выбора машины → Цена сразу +12% к конверсии. Добавить отзывы на карточки машин → Нулевое влияние (убрали для упрощения)."
                : "Custom event tracking: Route searched, Vehicle viewed, Add-on clicked, Payment initiated, Booking completed. Funnel visualization: Homepage → Route Selection → Vehicle Selection → Payment → Confirmation. We discovered that 62% of users dropped off at the payment step. Root cause analysis showed users expected more payment options (credit card only at launch). Solution: Added Apple Pay and Google Pay → payment abandonment dropped by 19%. Cohort analysis: B2C users book on average 7 days in advance (spontaneous travel). B2B users book on average 21 days in advance (planned group tours). Average B2C transaction: $285. Average B2B transaction: $1,240. Insight: B2B users were more price-sensitive to last-minute bookings. We implemented tiered pricing — book 30+ days in advance, get 15% discount. This smoothed demand and increased early bookings. A/B testing: Showing price upfront vs hiding until vehicle selection → Upfront pricing increased conversion by 12%. Adding customer reviews to vehicle cards → No measurable impact (removed to simplify UI).",
              outcome: isRu
                ? "Data-driven решения заменили догадки. Каждое изменение валидировалось аналитикой перед полным запуском."
                : "Data-driven decisions replaced guesswork. Every feature change was validated with analytics before full rollout."
            }
          ]
        },

        results: {
          desc: isRu ? "Автоматизация превратила Deluxe Limo из ручного сервиса в масштабируемую платформу." : "The booking engine transformed Deluxe Limo from a manual service business into a scalable platform.",
          businessImpact: isRu ? [
            "B2C-заказы: +85% (автоматизация снизила трение, быстрое подтверждение)",
            "+3 B2B-партнёра (отдельный портал позволил агентствам работать самостоятельно)",
            "~$180k/год от возврата брошенных корзин (CRM-автоматизация монетизировала упущенные лиды)",
            "Sales: 60% времени освобождено (не тратят время на обработку заказов, фокусируются на B2B)",
            "Масштабируемость: 500+ заказов/месяц (vs 120/месяц при ручной обработке)"
          ] : [
            "B2C bookings increased by 85% — Automated flow reduced friction, faster confirmation",
            "+3 B2B agency partnerships — Dedicated portal enabled self-service booking",
            "~$180k/year from abandoned cart recovery — CRM automation monetized previously lost leads",
            "Sales team productivity: 60% time freed — No longer processing bookings manually, focused on high-value B2B acquisition",
            "Scalability: 500+ bookings/month — vs 120/month manual capacity before automation"
          ],
          stats: [
            { val: "2.1% → 3.4%", label: isRu ? "Конверсия (+62%)" : "Conversion Rate (+62%)" },
            { val: "58% → 40%", label: isRu ? "Mobile bounce rate (минус 31%)" : "Mobile Bounce Rate (-31%)" },
            { val: "18%", label: isRu ? "Возврат брошенных корзин" : "Abandoned Cart Recovery" },
            { val: "20h → 8h", label: isRu ? "QA-время на регрессию (минус 60%)" : "QA Regression Time (-60%)" },
            { val: "~15 → <2", label: isRu ? "Баги в продакшене/месяц (минус 87%)" : "Production Bugs/Month (-87%)" },
            { val: "42 → 87", label: isRu ? "PageSpeed (mobile) (+107%)" : "PageSpeed Mobile (+107%)" }
          ]
        },

        learnings: {
          blocks: isRu ? [
            {
              text: "Этот проект показал, что автоматизация — это не просто замена ручного труда. Это возможность роста, которого раньше не было. Deluxe Limo не мог масштабироваться дальше 120 заказов/месяц, потому что каждый заказ требовал человека. Автоматизировав процесс, мы не просто сэкономили на зарплатах — мы убрали потолок роста.",
              align: "left"
            },
            {
              text: "Также понял силу CRM-автоматизации для возврата выручки. Цепочки писем о брошенных корзинах — это не «приятный маркетинг», а прямой revenue driver на $180k/год с почти нулевыми затратами. На технической стороне проект подтвердил, что автотесты — это мультипликатор скорости команды. Первая команда думала, что тесты — это «лишняя работа». Новая команда понимала, что тесты — это страховка от регрессий, которая позволяет двигаться быстро без риска всё сломать.",
              align: "left"
            },
            {
              text: "Наконец, проект показал важность mobile-first подхода. Когда 60% трафика — мобильные, мобилка не может быть «на потом». Производительность и UX на мобилках — это критично для конверсии.",
              align: "right"
            }
          ] : [
            {
              text: "This project taught me that automation isn't just about replacing manual work — it's about unlocking growth that wasn't possible before. Deluxe Limo couldn't scale beyond 120 bookings/month because every booking required human intervention. By automating the workflow, we didn't just save labor costs — we removed the ceiling on how many bookings the business could handle.",
              align: "left"
            },
            {
              text: "I also learned the power of CRM automation for revenue recovery. The abandoned cart campaigns weren't just 'nice-to-have marketing' — they were a direct revenue driver, contributing $180k/year with near-zero marginal cost. On the technical side, this project reinforced that test automation is a multiplier on team velocity. The initial dev team thought tests were 'extra work.' The new team understood that tests are insurance against regressions — they let you move fast without breaking things.",
              align: "left"
            },
            {
              text: "Finally, this project showed me the importance of mobile-first thinking. When 60% of your traffic is mobile, you can't treat mobile as an afterthought. Performance and UX on mobile aren't 'nice-to-have' — they're critical to conversion.",
              align: "right"
            }
          ]
        },

        nextCase: "MG Hotels"
      }
  ]
  };
};

// --- HERO BACKGROUND ---
const HeroCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 30 : 60;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${p.opacity})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
};

// --- NAVIGATION ---
const Navbar = ({ goHome, language, setLanguage, t }) => {
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ru' : 'en';
    setLanguage(newLang);
    localStorage.setItem('preferredLanguage', newLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button onClick={goHome} className="flex flex-col items-start leading-none group">
          <span className="text-white font-bold tracking-tight text-lg group-hover:text-blue-500 transition-colors">EGOR ANDRIENKO</span>
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">Technical PM</span>
        </button>
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <Languages size={16} />
            <span className="uppercase">{language}</span>
          </button>

          <a
            href="mailto:egorandrienko184@gmail.com"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Mail size={16} />
            <span>Email</span>
          </a>

          <a
            href="https://www.linkedin.com/in/egorandrienko/"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin size={16} />
            <span>LinkedIn</span>
          </a>

          <a
            href="/cv.pdf"
            download
            className="flex items-center gap-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            <Download size={16} />
            <span>CV</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

// --- HOME PAGE ---
const HomePage = ({ navigateToCase, DATA, t }) => {
  return (
    <div className="relative min-h-screen pt-20">
      <HeroCanvas />

      {/* Hero Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
            {t.heroTag}
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {t.heroTitle1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{t.heroTitle2}</span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 mx-auto">
            {t.heroDesc}
          </p>

          <div className="grid grid-cols-3 gap-12 pt-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
             <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-bold text-blue-500">
                  <AnimatedCounter end={3} suffix="+" />
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-2">{t.yearsExp}</div>
             </div>
             <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-bold text-blue-500">
                  <AnimatedCounter end={15} suffix="+" />
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-2">{t.productsLaunched}</div>
             </div>
             <div className="text-center">
                <div className="text-3xl md:text-4xl font-mono font-bold text-blue-500">
                  <AnimatedCounter end={650} suffix="K+" />
                </div>
                <div className="text-xs text-neutral-400 uppercase tracking-widest mt-2">{t.revenueImpact}</div>
             </div>
          </div>
        </div>
      </section>

      {/* Selected Cases */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 border-t border-neutral-800 bg-[#0A0A0A]">
        <h2 className="text-2xl font-bold text-white mb-12">{t.selectedCases}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DATA.cases.map((project) => (
            <div
              key={project.id}
              onClick={() => navigateToCase(project.slug)}
              className="group relative bg-neutral-900/50 border border-neutral-800 p-8 rounded-xl hover:border-blue-500/50 transition-all cursor-pointer flex flex-col h-full overflow-hidden"
            >
              <ProjectCardBg projectId={project.id} />
              <div className="mb-6 relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-1 bg-neutral-800 rounded text-neutral-400 uppercase">{tag}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <p className="text-neutral-400 text-sm">{project.subtitle}</p>
              </div>
              <div className="mt-auto pt-6 border-t border-neutral-800 relative z-10">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  <span className="group-hover:underline underline-offset-4">{t.readCase}</span>


                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- SCROLL ANIMATIONS HOOK ---
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

// --- CASE STUDY PAGE (STRUCTURED AS REQUESTED) ---
const CaseStudyPage = ({ project, goBack, onNext, t }) => {
  useScrollAnimation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  if (!project) return null;

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#E5E5E5] pt-24 pb-0 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 0. NAV & HEADER */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <button onClick={goBack} className="group flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} />
          {t.backToProjects}
        </button>
      </div>

      <header className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        {/* 1. TITLE */}
        <h1 className="text-[10vw] lg:text-[120px] leading-[0.85] font-bold uppercase tracking-tighter text-white mb-16 break-words">
          {project.heroTitle}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-neutral-800 py-8">
          <div><span className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">{t.role}</span><span className="block text-lg font-medium text-white">{project.role}</span></div>
          <div><span className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">{t.timeline}</span><span className="block text-lg font-medium text-white">{project.timeline}</span></div>
          <div><span className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">{t.team}</span><span className="block text-lg font-medium text-white">{project.team}</span></div>
          <div><span className="block text-[10px] font-mono text-neutral-500 uppercase mb-2">{t.website}</span><span className="block text-lg font-medium text-blue-400 cursor-pointer flex items-center gap-1">{t.liveLink} <ArrowUpRight size={14}/></span></div>
        </div>
      </header>

      {/* 2. HERO VISUAL - VIDEO */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32">
         <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src={`/videos/${project.slug}.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
         </div>
      </section>

      {/* 3. SUMMARY, CONTRIBUTION & METRICS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 fade-in-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-16">
            <div>
                <span className="text-xs font-mono text-neutral-500 uppercase mb-4 block">{t.summary}</span>
                <p className="text-2xl text-white leading-relaxed">{project.summary.desc}</p>
            </div>
            <div>
                <span className="text-xs font-mono text-neutral-500 uppercase mb-4 block">{t.contribution}</span>
                <p className="text-xl text-neutral-400 leading-relaxed">{project.summary.contribution}</p>
            </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-neutral-800">
            {project.summary.metrics.map((m, i) => (
                <div key={i} className="fade-in-section metric-card" style={{transitionDelay: `${i * 0.1}s`}}>
                    <span className="block text-5xl md:text-7xl font-bold text-white tracking-tighter mb-2 metric-value">{m.val}</span>
                    <span className="block text-sm font-mono text-neutral-500 uppercase">{m.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* 4. THE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 fade-in-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
             <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white sticky top-32">
               {t.theProblem}
             </h2>
          </div>
          <div className="lg:col-span-8">
             <p className="text-2xl md:text-3xl leading-tight font-medium text-neutral-200 mb-12">
               {project.problem.desc}
             </p>
             <div className="border-t border-neutral-800">
                {project.problem.challenges.map((item, i) => (
                    <div key={i} className="py-6 border-b border-neutral-800 flex items-start gap-4">
                        <X className="w-6 h-6 text-red-500 mt-1 shrink-0" />
                        <p className="text-xl text-neutral-400">{item}</p>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* VISUAL BREAK */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32">
         <WindowFrame title="Process & Architecture" className="h-[300px]">
            {project.visuals.process}
         </WindowFrame>
      </section>

      {/* 5. PROJECT GOALS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 fade-in-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
             <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white sticky top-32">
               {t.projectGoals}
             </h2>
          </div>
          <div className="lg:col-span-8">
             <p className="text-xl text-neutral-400 mb-8">{project.goals.desc}</p>
             <div className="space-y-4">
                {project.goals.points.map((goal, i) => (
                    <div key={i} className="flex items-start gap-4 bg-neutral-900/50 p-6 rounded-lg border border-neutral-800">
                        <Target className="w-6 h-6 text-blue-500 mt-1 shrink-0" />
                        <span className="text-xl text-white font-medium">{goal}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* 6. DELIVERY PROCESS (if exists) */}
      {project.deliveryProcess && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 fade-in-section">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none text-white sticky top-32">
                {t.deliveryProcess}
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-20">
              {project.deliveryProcess.steps.map((step, idx) => (
                <div key={idx} className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-neutral-800">{step.number}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">{step.title}</h3>
                  </div>

                  {step.challenge && (
                    <div>
                      <span className="block text-xs font-mono text-neutral-500 uppercase mb-2">{t.specificChallenge}</span>
                      <p className="text-lg text-neutral-300 leading-relaxed">{step.challenge}</p>
                    </div>
                  )}

                  {step.whatIDid && (
                    <div>
                      <span className="block text-xs font-mono text-neutral-500 uppercase mb-2">{t.whatIDid}</span>
                      <p className="text-lg text-neutral-300 leading-relaxed">{step.whatIDid}</p>
                    </div>
                  )}

                  <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-lg">
                    <span className="block text-xs font-mono text-neutral-500 uppercase mb-2">{t.outcome}</span>
                    <p className="text-lg text-blue-400 font-medium">{step.outcome}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. RESULTS */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-32 fade-in-section">
        <h2 className="text-6xl md:text-9xl font-bold tracking-tighter text-white leading-none mb-16">
            {t.results}
        </h2>

        <p className="text-2xl font-bold text-neutral-400 mb-16 max-w-3xl">
            {project.results.desc}
        </p>

        {/* Business Impact (if exists) */}
        {project.results.businessImpact && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-8">{t.businessImpact}</h3>
            <div className="space-y-4">
              {project.results.businessImpact.map((impact, i) => (
                <div key={i} className="flex items-start gap-3 p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                  <Check size={24} className="text-blue-500 shrink-0 mt-1" />
                  <span className="text-xl text-neutral-200 leading-relaxed">{impact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Metrics */}
        {project.results.stats && (
          <div>
            {project.results.businessImpact && <h3 className="text-3xl font-bold text-white mb-8">{t.technicalMetrics}</h3>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {project.results.stats.map((stat, i) => (
                    <div key={i} className="border-t-2 border-white pt-4">
                        <span className="block text-sm font-mono uppercase text-neutral-500 mb-2">{stat.label}</span>
                        <span className="block text-4xl md:text-5xl font-bold tracking-tighter text-white">{stat.val}</span>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Metrics (backward compatibility) */}
        {project.results.additionalMetrics && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.results.additionalMetrics.map((metric, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <Check size={20} className="text-blue-500 shrink-0" />
                <span className="text-lg text-neutral-300">{metric}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 9. KEY LEARNINGS (if exists) */}
      {project.learnings && (
        <section className="bg-neutral-900 border-y border-neutral-800 py-24 mb-32 fade-in-section">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16">
              {t.whatDidILearn}
            </h2>

            {project.learnings.blocks ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {project.learnings.blocks.map((block, i) => (
                  <div
                    key={i}
                    className={`${
                      i === 0 ? 'lg:col-span-6' :
                      i === 1 ? 'lg:col-span-6' :
                      'lg:col-span-6 lg:col-start-7'
                    }`}
                  >
                    <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6 max-w-5xl">
                {Array.isArray(project.learnings) ? (
                  project.learnings.map((paragraph, i) => (
                    <p key={i} className="text-2xl md:text-3xl text-neutral-200 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-2xl md:text-3xl text-neutral-200 leading-relaxed">
                    {project.learnings}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 8. NEXT PROJECT */}
      <section className="bg-[#0A0A0A] border-t border-neutral-800">
        <button
            onClick={() => onNext(project.nextCase)}
            className="w-full py-32 flex flex-col items-center justify-center hover:bg-neutral-900 transition-colors group"
        >
            <span className="text-xs font-mono text-neutral-500 uppercase mb-4">{t.nextCase}</span>
            <span className="text-5xl md:text-8xl font-bold text-white group-hover:text-blue-500 transition-colors text-center px-4">
                {project.nextCase} <ArrowRight className="inline ml-4 w-12 h-12 md:w-20 md:h-20" />
            </span>
        </button>
      </section>

    </div>
  );
};

// --- APP CONTROLLER ---
const App = () => {
  const [view, setView] = useState('home');
  const [currentSlug, setCurrentSlug] = useState(null);
  const [language, setLanguage] = useState(() => detectUserLanguage());

  const DATA = getDATA(language);
  const t = TRANSLATIONS[language];

  // Initialize from URL on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setView('home');
      setCurrentSlug(null);
    } else {
      const slug = path.replace('/', '');
      const project = DATA.cases.find(c => c.slug === slug);
      if (project) {
        setCurrentSlug(slug);
        setView('case');
      } else {
        setView('home');
        window.history.pushState({}, '', '/');
      }
    }
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/') {
        setView('home');
        setCurrentSlug(null);
      } else {
        const slug = path.replace('/', '');
        const project = DATA.cases.find(c => c.slug === slug);
        if (project) {
          setCurrentSlug(slug);
          setView('case');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [DATA]);

  const navigateToCase = (slug) => {
    setCurrentSlug(slug);
    setView('case');
    window.history.pushState({}, '', `/${slug}`);
  };

  const navigateNext = (title) => {
     const next = DATA.cases.find(c => c.title === title);
     if (next) navigateToCase(next.slug);
     else {
       setView('home');
       window.history.pushState({}, '', '/');
     }
  };

  const goHome = () => {
    setView('home');
    setCurrentSlug(null);
    window.history.pushState({}, '', '/');
  };

  const currentProject = DATA.cases.find(p => p.slug === currentSlug);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#E5E5E5] font-sans selection:bg-blue-500/30 selection:text-white relative">
      <Navbar goHome={goHome} language={language} setLanguage={setLanguage} t={t} />

      {view === 'home' && <main><HomePage navigateToCase={navigateToCase} DATA={DATA} t={t} /></main>}

      {view === 'case' && (
        <main>
           <CaseStudyPage project={currentProject} goBack={goHome} onNext={navigateNext} t={t} />
           <AIChatWidget currentCase={currentProject} t={t} language={language} />
        </main>
      )}
    </div>
  );
};

export default App;