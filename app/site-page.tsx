"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import extensionCatalog from "../data/extensions.json";
import webStoreSnapshot from "../data/chrome-web-store.json";

export type Language = "zh" | "en";
export type SitePageName = "home" | "interests" | "thinking" | "values" | "extensions";
type RoutePrefix = "" | "/en" | "/zh";
type ExtensionCatalogItem = (typeof extensionCatalog)[number];
type WebStoreItem = {
  id: string;
  userCount: number;
  userCountText: string;
  englishDescription: string;
};

const EXTENSIONS_PER_ROW = 5;
const webStoreItemsById = new Map(
  (webStoreSnapshot.items as WebStoreItem[]).map((item) => [item.id, item]),
);

function extensionUserLabel(item: WebStoreItem | undefined, language: Language, unavailable: string) {
  if (!item) return unavailable;
  const quantity = item.userCountText.replace(/\s+users?$/i, "");
  return language === "zh" ? `${quantity} 位使用者` : item.userCountText;
}

function extensionItems(language: Language, unavailable: string) {
  return extensionCatalog
    .map((extension: ExtensionCatalogItem, catalogIndex) => {
      const storeData = webStoreItemsById.get(extension.id);
      return {
        ...extension,
        catalogIndex,
        userCount: storeData?.userCount ?? -1,
        userLabel: extensionUserLabel(storeData, language, unavailable),
        // The complete official English Overview is authoritative for both language views.
        // The localized catalog text remains a resilient fallback for the initial or failed sync state.
        description: storeData?.englishDescription ?? extension.fallbackDescription[language],
      };
    })
    .sort((left, right) => right.userCount - left.userCount || left.catalogIndex - right.catalogIndex);
}

function pageHref(page: SitePageName, language: Language) {
  const pagePath = page === "home" ? "" : `/${page}`;
  return language === "zh" ? `/zh${pagePath}` : pagePath || "/";
}

const translations = {
  zh: {
    pageTitle: "That Developer Steven｜從物理、科技與系統理解世界",
    brand: "That Developer Steven",
    homeLabel: "返回首頁",
    navigationLabel: "主要導覽",
    languageLabel: "選擇網站語言",
    languageMenuTitle: "選擇語言",
    languageMenuHint: "以所選語言載入整個網站",
    navigation: {
      about: "關於我",
      interests: "興趣與習慣",
      thinking: "如何思考",
      values: "生活價值",
      extensions: "擴充功能",
    },
    about: {
      title: "關於我",
      paragraphs: [
        "你好，我是 Steven，在網上亦稱為 Developer Steven。我是一名來自香港的大學生，主修物理學及數據分析。",
        "在大學課程和擴充功能開發以外，我喜歡閱讀、學習投資，以及維持健康而活躍的生活方式。我定期健身，也喜歡遠足、露營、踏單車和釣魚等戶外活動。我亦致力終身學習，經常探索新的 AI 工具和技能，尤其是 vibe coding。",
        "我嘗試減少使用 Facebook、Instagram 和 Threads 等社交媒體平台。研究發現，較頻繁使用短影音平台與較差的注意力、抑制控制及其他認知表現有關。然而，我不認為問題可以簡單概括為社交媒體完全有害。它的影響會因平台的使用方式、接觸的內容，以及個人控制使用時間的能力而有所不同。",
        "即使意識到這些風險，我有時仍會發現自己花在網上內容的時間超出原本預期。這個親身困擾促使我製作瀏覽器擴充功能，協助減少干擾、避免無意識滑動，並讓使用者更能掌控自己在網上的時間。",
        "我最初製作這些擴充功能是為了幫助自己，但也希望它們能夠支援遇到相似困難的人。",
        "這個網站是我分享瀏覽器擴充功能、新想法和開發進度的地方。我亦希望網站可以讓更多人認識我、交流想法，並與擁有共同興趣的人建立聯繫。",
      ],
    },
    interests: {
      kicker: "HOBBIES & INTERESTS",
      title: "興趣與習慣",
      intro: "這些長期投入的主題與活動，一部分幫助我理解世界，一部分讓我保持活力、創意與好奇心。",
      items: [
        {
          title: "科學、宇宙與心理",
          description: "我以物理學作為理解自然的基礎，也持續探索宇宙與人的思考和行為。",
          tags: ["理論與應用物理", "量子與相對論", "天文與黑洞", "認知與決策", "人際關係"],
        },
        {
          title: "AI、科技與創造",
          description: "我會追蹤新科技，研究 AI 模型與 Agent，並透過自動化和自製工具解決實際問題。",
          tags: ["ChatGPT 與 Copilot", "模型與 Agent", "自動化", "DIY 工具", "創業與 Side Project"],
        },
        {
          title: "閱讀與終身學習",
          description: "閱讀讓我接觸不同世界和觀點；學習新技能則讓好奇心逐步變成可實踐的能力。",
          tags: ["小說與非小說", "科普", "商業書", "傳記", "持續學習新技能"],
        },
        {
          title: "投資、經濟與商業",
          description: "我關注資產配置、企業和宏觀經濟，嘗試理解市場背後的誘因、週期與取捨。",
          tags: ["股票與 ETF", "債券與基金", "個人理財", "公司與財報", "通脹、利率與 GDP"],
        },
        {
          title: "運動與自我優化",
          description: "我以持續訓練建立健康和紀律，也會研究如何改善效率、能力與決策方式。",
          tags: ["健身", "跑步", "力量訓練", "健康", "效率與決策"],
        },
        {
          title: "影像、電影與音樂",
          description: "我喜歡以相片和影片記錄觀察，也會主動聆聽不同音樂類型並學習結他。",
          tags: ["攝影與構圖", "相機與手機攝影", "電影與紀錄片", "YouTube", "音樂與結他"],
        },
        {
          title: "戶外與探索",
          description: "旅行和戶外活動讓我離開熟悉環境，以更直接的方式認識地方、自然和自己。",
          tags: ["旅行規劃", "背包旅行", "遠足與登山", "露營", "單車與釣魚"],
        },
        {
          title: "水族造景與收藏",
          description: "我對微型生態、造景和天然物件感興趣，享受觀察細節與設計平衡的過程。",
          tags: ["水族養魚", "魚蝦與水生生物", "Aquascaping", "沉木與石材", "礦石與晶體"],
        },
      ],
    },
    thinking: {
      kicker: "HOW I THINK",
      title: "我如何思考",
      intro: "我的思考由好奇心開始，再以第一性原理、證據和實際嘗試逐步收窄問題。我用邏輯尋找缺口，以批判思考判斷資訊是否可靠，並透過簡單解釋檢驗自己是否真正理解。",
      methodKicker: "A WORKING METHOD",
      methodTitle: "保持好奇、結構清晰，並落到實處",
      methodBody: "物理訓練我由假設和限制出發，數據分析提醒我分辨直覺與證據，而製作工具則讓我把想法放進真實情境中測試。",
      principles: [
        { title: "從第一性原理開始", description: "先拆解既有假設，找出真正的限制、目標和不可再簡化的部分。" },
        { title: "沿着證據與邏輯前進", description: "檢查論證是否合理、資料是否足夠，並主動尋找反例和邏輯漏洞。" },
        { title: "透過解釋深化理解", description: "嘗試用簡單語言教懂別人；如果說不清楚，通常代表自己的理解仍有缺口。" },
        { title: "看見誘因與取捨", description: "在談判、商業和日常決策中，同時考慮各方利益、成本和可能的次級影響。" },
        { title: "建立、測試、再改進", description: "把想法做成工具、自動化或小型實驗，根據實際結果反覆修正。" },
      ],
    },
    values: {
      kicker: "A LIFE I VALUE",
      title: "我重視的生活",
    },
    extensions: {
      kicker: "BROWSER EXTENSIONS",
      title: "我製作的擴充功能",
      intro: "按 Chrome Web Store 公開使用者數量由多至少排列；英文簡介會每六小時與商店頁面同步。點擊卡片可查看詳情。",
      showDetails: "展開簡介",
      hideDetails: "收起簡介",
      storeLabel: "前往 Chrome Web Store",
      userCountUnavailable: "使用者數量暫未提供",
    },
    footer: {
      description: "一個持續學習、整理思想與記錄探索的個人空間。",
      backToTop: "回到頁首",
    },
  },
  en: {
    pageTitle: "That Developer Steven | Understanding the world through physics, technology, and systems",
    brand: "That Developer Steven",
    homeLabel: "Back to home",
    navigationLabel: "Primary navigation",
    languageLabel: "Choose site language",
    languageMenuTitle: "Choose a language",
    languageMenuHint: "Load the complete site in your chosen language",
    navigation: {
      about: "About me",
      interests: "Hobbies",
      thinking: "How I think",
      values: "Life values",
      extensions: "Extensions",
    },
    about: {
      title: "About Me",
      paragraphs: [
        "Hi, I'm Steven, also known online as Developer Steven. I am a university student from Hong Kong, majoring in Physics and Data Analytics.",
        "Outside of university and extension development, I enjoy reading, learning about investing, and maintaining a healthy and active lifestyle. I go to the gym regularly and enjoy outdoor activities such as hiking, camping, cycling, and fishing. I am also committed to lifelong learning and frequently explore new AI tools and skills, particularly vibe coding.",
        "I try to limit my use of social media platforms such as Facebook, Instagram, and Threads. Research has found that heavier use of short-form video platforms is associated with poorer attention, inhibitory control, and other cognitive outcomes. However, I do not believe the issue is as simple as saying that social media is entirely harmful. Its effects can vary depending on how a platform is used, what content a person consumes, and how well they are able to control their usage.",
        "Despite being conscious of these risks, I still sometimes find myself spending more time than intended on online content. This personal struggle inspired me to create browser extensions that help reduce distractions, discourage mindless scrolling, and give users greater control over how they spend their time online.",
        "I originally created these extensions to help myself, but I hope they can also support other people who experience similar difficulties.",
        "This website is where I share my browser extensions, new ideas, and development progress. I also hope it provides an opportunity for more people to get to know me, exchange ideas, and connect over shared interests.",
      ],
    },
    interests: {
      kicker: "HOBBIES & INTERESTS",
      title: "Hobbies & interests",
      intro: "The subjects and activities I return to—some help me understand the world, while others keep me active, creative, and curious.",
      items: [
        {
          title: "Science, space & psychology",
          description: "Physics is my foundation for understanding nature, and I keep exploring both the universe and how people think and behave.",
          tags: ["Theoretical & applied physics", "Quantum & relativity", "Astronomy & black holes", "Cognition & decisions", "Human relationships"],
        },
        {
          title: "AI, technology & making",
          description: "I follow emerging technology, study AI models and agents, and use automation and small tools to solve practical problems.",
          tags: ["ChatGPT & Copilot", "Models & agents", "Automation", "DIY tools", "Startups & side projects"],
        },
        {
          title: "Reading & lifelong learning",
          description: "Reading exposes me to different worlds and viewpoints; learning new skills turns curiosity into something I can apply.",
          tags: ["Fiction & nonfiction", "Popular science", "Business books", "Biographies", "Learning new skills"],
        },
        {
          title: "Investing, economics & business",
          description: "I study asset allocation, companies, and the wider economy to understand the incentives, cycles, and trade-offs behind markets.",
          tags: ["Stocks & ETFs", "Bonds & funds", "Personal finance", "Companies & financials", "Inflation, rates & GDP"],
        },
        {
          title: "Training & self-improvement",
          description: "Consistent training helps me build health and discipline, while self-improvement helps me refine how I work and decide.",
          tags: ["Fitness", "Running", "Strength training", "Health", "Efficiency & decisions"],
        },
        {
          title: "Photography, film & music",
          description: "I enjoy recording observations through images and video, listening closely to different genres, and learning guitar.",
          tags: ["Photography & composition", "Cameras & mobile photography", "Film & documentaries", "YouTube", "Music & guitar"],
        },
        {
          title: "Outdoor exploration",
          description: "Travel and outdoor activities take me beyond familiar settings and offer a direct way to learn about places, nature, and myself.",
          tags: ["Travel planning", "Backpacking", "Hiking", "Camping", "Cycling & fishing"],
        },
        {
          title: "Aquatic worlds & collecting",
          description: "I am drawn to miniature ecosystems, aquascaping, and natural objects—the details and balance reward patient observation.",
          tags: ["Aquarium keeping", "Fish, shrimp & aquatic life", "Aquascaping", "Wood & stone", "Minerals & crystals"],
        },
      ],
    },
    thinking: {
      kicker: "HOW I THINK",
      title: "How I think",
      intro: "My thinking starts with curiosity, then narrows a problem through first principles, evidence, and practical experiments. I use logic to find gaps, critical thinking to judge whether information is trustworthy, and simple explanations to test whether I truly understand.",
      methodKicker: "A WORKING METHOD",
      methodTitle: "Curious, structured, and practical",
      methodBody: "Physics taught me to begin with assumptions and constraints, data analysis reminds me to separate intuition from evidence, and building tools lets me test ideas in real situations.",
      principles: [
        { title: "Start with first principles", description: "Break down inherited assumptions and identify the real goal, constraints, and irreducible parts of a problem." },
        { title: "Follow evidence and logic", description: "Check whether an argument is coherent and the evidence sufficient, while actively looking for counterexamples and gaps." },
        { title: "Explain to understand", description: "Try to teach a complex idea in simple language; if I cannot explain it clearly, my own understanding probably has gaps." },
        { title: "Map incentives and trade-offs", description: "In negotiation, business, and everyday decisions, consider each side's interests, costs, and likely second-order effects." },
        { title: "Build, test, and refine", description: "Turn ideas into tools, automations, or small experiments, then revise them using what happens in practice." },
      ],
    },
    values: {
      kicker: "A LIFE I VALUE",
      title: "The life I value",
    },
    extensions: {
      kicker: "BROWSER EXTENSIONS",
      title: "Extensions I have built",
      intro: "Sorted by public Chrome Web Store users, from highest to lowest. English descriptions sync with the store every six hours. Select a card for details.",
      showDetails: "Show details",
      hideDetails: "Hide details",
      storeLabel: "Open in Chrome Web Store",
      userCountUnavailable: "User count unavailable",
    },
    footer: {
      description: "A personal space for continued learning, organising ideas, and recording exploration.",
      backToTop: "Back to top",
    },
  },
} as const;

const EXTENSION_VIEWPORT_PADDING_PX = 24;
const EXTENSION_REVEAL_EASING = [0.22, 1, 0.36, 1] as const;

function cubicBezierProgress(progress: number, [x1, y1, x2, y2]: readonly number[]) {
  const sampleCurve = (time: number, point1: number, point2: number) => {
    const inverseTime = 1 - time;
    return 3 * inverseTime * inverseTime * time * point1
      + 3 * inverseTime * time * time * point2
      + time * time * time;
  };

  let lowerBound = 0;
  let upperBound = 1;
  for (let iteration = 0; iteration < 10; iteration += 1) {
    const time = (lowerBound + upperBound) / 2;
    if (sampleCurve(time, x1, x2) < progress) lowerBound = time;
    else upperBound = time;
  }

  return sampleCurve((lowerBound + upperBound) / 2, y1, y2);
}

function animateWindowScroll(targetY: number, duration: number) {
  const startY = window.scrollY;
  const startTime = performance.now();
  let frameId = 0;
  let stopped = false;

  function stop() {
    if (stopped) return;
    stopped = true;
    window.cancelAnimationFrame(frameId);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("pointerdown", stop);
  }

  function step(now: number) {
    if (stopped) return;
    const elapsed = Math.min((now - startTime) / duration, 1);
    const easedProgress = cubicBezierProgress(elapsed, EXTENSION_REVEAL_EASING);
    window.scrollTo({ top: startY + (targetY - startY) * easedProgress, behavior: "auto" });

    if (elapsed < 1) frameId = window.requestAnimationFrame(step);
    else stop();
  }

  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("pointerdown", stop, { passive: true });
  frameId = window.requestAnimationFrame(step);

  return stop;
}

export function SitePage({
  page,
  language = "en",
  routePrefix = "",
}: {
  page: SitePageName;
  language?: Language;
  routePrefix?: RoutePrefix;
}) {
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const extensionsSectionRef = useRef<HTMLElement>(null);
  const extensionScrollCancelRef = useRef<(() => void) | null>(null);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [expandedExtensionIndex, setExpandedExtensionIndex] = useState<number | null>(null);
  const [selectedExtensionIndex, setSelectedExtensionIndex] = useState<number | null>(null);
  const copy = translations[language];
  const sortedExtensions = extensionItems(language, copy.extensions.userCountUnavailable);
  const extensionRowCount = Math.ceil(sortedExtensions.length / EXTENSIONS_PER_ROW);
  const pageTitle = page === "home" ? copy.pageTitle : `${copy.navigation[page]} | ${copy.brand}`;
  const extensionAssetPrefix = routePrefix ? "../.." : "..";
  const brandImageDepth = (routePrefix ? 1 : 0) + (page === "home" ? 0 : 1);
  const brandImageSrc = `${"../".repeat(brandImageDepth)}brand-avatar.png`;

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hant" : "en";
    document.title = pageTitle;
  }, [language, pageTitle]);

  useEffect(() => {
    function closeMenuFromOutside(event: PointerEvent) {
      const menu = languageMenuRef.current;
      if (menu && !menu.contains(event.target as Node)) setLanguageMenuOpen(false);
    }

    function closeMenuWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || languageMenuRef.current?.dataset.open !== "true") return;

      setLanguageMenuOpen(false);
      languageButtonRef.current?.focus();
    }

    document.addEventListener("pointerdown", closeMenuFromOutside);
    document.addEventListener("keydown", closeMenuWithEscape);

    return () => {
      document.removeEventListener("pointerdown", closeMenuFromOutside);
      document.removeEventListener("keydown", closeMenuWithEscape);
    };
  }, []);

  useEffect(() => {
    if (expandedExtensionIndex === null) return;
    const activeIndex = expandedExtensionIndex;

    function closeExtensionFromOutside(event: PointerEvent) {
      const section = extensionsSectionRef.current;
      const target = event.target as Node;
      if (!section) return;

      const activeCard = section.querySelector(`[data-extension-index="${activeIndex}"]`);
      const activePanel = section.querySelector(`[data-extension-panel="${Math.floor(activeIndex / EXTENSIONS_PER_ROW)}"]`);
      if (!activeCard?.contains(target) && !activePanel?.contains(target)) {
        setExpandedExtensionIndex(null);
      }
    }

    function closeExtensionWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setExpandedExtensionIndex(null);
      extensionsSectionRef.current
        ?.querySelector<HTMLElement>(`[data-extension-index="${activeIndex}"] button`)
        ?.focus();
    }

    document.addEventListener("pointerdown", closeExtensionFromOutside, true);
    document.addEventListener("keydown", closeExtensionWithEscape);

    return () => {
      document.removeEventListener("pointerdown", closeExtensionFromOutside, true);
      document.removeEventListener("keydown", closeExtensionWithEscape);
    };
  }, [expandedExtensionIndex]);

  useLayoutEffect(() => {
    extensionScrollCancelRef.current?.();
    extensionScrollCancelRef.current = null;
    if (expandedExtensionIndex === null) return;

    const section = extensionsSectionRef.current;
    if (!section) return;

    const activeIndex = expandedExtensionIndex;
    const mobileLayout = window.matchMedia("(max-width: 720px)").matches;
    const targetSelector = mobileLayout
      ? `[data-extension-index="${activeIndex}"]`
      : `[data-extension-panel="${Math.floor(activeIndex / EXTENSIONS_PER_ROW)}"]`;
    const liveTarget = section.querySelector<HTMLElement>(targetSelector);
    if (!liveTarget) return;

    const sectionBounds = section.getBoundingClientRect();
    const measurement = section.cloneNode(true) as HTMLElement;
    measurement.setAttribute("aria-hidden", "true");
    Object.assign(measurement.style, {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
      left: "-100000px",
      top: "0",
      width: `${sectionBounds.width}px`,
      margin: "0",
    });
    document.body.appendChild(measurement);

    const measuredTarget = measurement.querySelector<HTMLElement>(targetSelector);
    if (!measuredTarget) {
      measurement.remove();
      return;
    }

    const measurementBounds = measurement.getBoundingClientRect();
    const finalTargetBounds = measuredTarget.getBoundingClientRect();
    const finalTargetTop = sectionBounds.top + window.scrollY
      + finalTargetBounds.top - measurementBounds.top;
    const finalTargetHeight = finalTargetBounds.height;
    measurement.remove();

    const visibleTop = window.scrollY + EXTENSION_VIEWPORT_PADDING_PX;
    const visibleBottom = window.scrollY + window.innerHeight - EXTENSION_VIEWPORT_PADDING_PX;
    const finalTargetBottom = finalTargetTop + finalTargetHeight;
    const isFullyVisible = finalTargetTop >= visibleTop && finalTargetBottom <= visibleBottom;
    if (isFullyVisible) return;

    const availableHeight = window.innerHeight - EXTENSION_VIEWPORT_PADDING_PX * 2;
    const targetY = Math.max(0, finalTargetHeight <= availableHeight
      ? finalTargetTop - (window.innerHeight - finalTargetHeight) / 2
      : finalTargetTop - EXTENSION_VIEWPORT_PADDING_PX);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      return;
    }

    const reveal = mobileLayout
      ? liveTarget.querySelector<HTMLElement>(".extension-inline-reveal")
      : liveTarget;
    const duration = Number.parseFloat(
      reveal ? getComputedStyle(reveal).getPropertyValue("--extension-reveal-duration") : "",
    ) || 420;
    extensionScrollCancelRef.current = animateWindowScroll(targetY, duration);

    return () => {
      extensionScrollCancelRef.current?.();
      extensionScrollCancelRef.current = null;
    };
  }, [expandedExtensionIndex]);

  function toggleExtension(index: number) {
    if (expandedExtensionIndex === index) {
      setExpandedExtensionIndex(null);
      return;
    }

    setSelectedExtensionIndex(index);
    setExpandedExtensionIndex(index);
  }

  return (
    <main id="top" lang={language === "zh" ? "zh-Hant" : "en"}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="page-shell" data-page={page}>
        <header
          className="site-header glass"
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setLanguageMenuOpen(false);
          }}
        >
          <Link className="brand" href={pageHref("home", language)} aria-label={copy.homeLabel}>
            <img className="brand-avatar" src={brandImageSrc} alt="" width="36" height="36" />
            {copy.brand}
          </Link>
          <div className="header-actions">
            <nav aria-label={copy.navigationLabel}>
              <Link href={pageHref("home", language)} aria-current={page === "home" ? "page" : undefined}>{copy.navigation.about}</Link>
              <Link href={pageHref("interests", language)} aria-current={page === "interests" ? "page" : undefined}>{copy.navigation.interests}</Link>
              <Link href={pageHref("thinking", language)} aria-current={page === "thinking" ? "page" : undefined}>{copy.navigation.thinking}</Link>
              <Link href={pageHref("values", language)} aria-current={page === "values" ? "page" : undefined}>{copy.navigation.values}</Link>
              <Link href={pageHref("extensions", language)} aria-current={page === "extensions" ? "page" : undefined}>{copy.navigation.extensions}</Link>
            </nav>
            <div
              className="language-menu"
              data-open={languageMenuOpen}
              ref={languageMenuRef}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setLanguageMenuOpen(true);
              }}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setLanguageMenuOpen(false);
                }
              }}
            >
              <button
                className="language-globe-button"
                type="button"
                aria-label={copy.languageLabel}
                aria-controls="language-menu-panel"
                aria-expanded={languageMenuOpen}
                title={copy.languageLabel}
                ref={languageButtonRef}
                onClick={() => setLanguageMenuOpen((open) => !open)}
              >
                <span className="globe-icon" aria-hidden="true">🌐</span>
              </button>
              <div
                className="language-menu-panel"
                id="language-menu-panel"
                aria-label={copy.languageLabel}
                aria-hidden={!languageMenuOpen}
              >
                <p className="language-menu-kicker">LANGUAGE</p>
                <p className="language-menu-title">{copy.languageMenuTitle}</p>
                <p className="language-menu-hint">{copy.languageMenuHint}</p>
                <nav className="language-options" aria-label={copy.languageLabel}>
                  <Link
                    className={language === "zh" ? "active" : undefined}
                    href={pageHref(page, "zh")}
                    aria-current={language === "zh" ? "page" : undefined}
                    tabIndex={languageMenuOpen ? 0 : -1}
                  >
                    <span><strong>繁體中文</strong><small>Traditional Chinese</small></span>
                    {language === "zh" ? <span className="language-check" aria-hidden="true">✓</span> : <span aria-hidden="true">↗</span>}
                  </Link>
                  <Link
                    className={language === "en" ? "active" : undefined}
                    href={pageHref(page, "en")}
                    aria-current={language === "en" ? "page" : undefined}
                    tabIndex={languageMenuOpen ? 0 : -1}
                  >
                    <span><strong>English</strong><small>英文</small></span>
                    {language === "en" ? <span className="language-check" aria-hidden="true">✓</span> : <span aria-hidden="true">↗</span>}
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {page === "home" ? <section className="hero about-hero glass" aria-labelledby="about-title">
          <div className="about-copy">
            <div className="about-heading">
              <p className="about-star" aria-hidden="true">✦</p>
              <h1 id="about-title">{copy.about.title}</h1>
            </div>
            <div className="about-body">
              {copy.about.paragraphs.map((paragraph, index) => (
                <p className={index === 0 ? "about-intro" : undefined} key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section> : null}

        {page === "interests" ? <section className="interests-section section-block" id="interests" aria-labelledby="interests-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{copy.interests.kicker}</p>
              <h2 id="interests-title">{copy.interests.title}</h2>
            </div>
            <p>{copy.interests.intro}</p>
          </div>
          <div className="interest-grid">
            {copy.interests.items.map((interest, index) => (
              <article className="interest-card glass" key={interest.title}>
                <div className="interest-top"><span>{String(index + 1).padStart(2, "0")}</span><i aria-hidden="true" /></div>
                <h3>{interest.title}</h3>
                <p>{interest.description}</p>
                <div className="tag-row">
                  {interest.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section> : null}

        {page === "thinking" ? <section className="thinking-section glass" id="thinking" aria-labelledby="thinking-title">
          <div className="thinking-intro">
            <p className="section-kicker">{copy.thinking.kicker}</p>
            <h2 id="thinking-title">{copy.thinking.title}</h2>
            <p>{copy.thinking.intro}</p>
          </div>
        </section> : null}

        {page === "thinking" ? <section className="learning-grid thinking-principles" aria-labelledby="thinking-method-title">
          <article className="learning-copy glass">
            <p className="section-kicker">{copy.thinking.methodKicker}</p>
            <h2 id="thinking-method-title">{copy.thinking.methodTitle}</h2>
            <p>{copy.thinking.methodBody}</p>
          </article>
          <ol className="learning-steps glass">
            {copy.thinking.principles.map((principle, index) => (
              <li key={principle.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{principle.title}</h3><p>{principle.description}</p></div>
              </li>
            ))}
          </ol>
        </section> : null}

        {page === "values" ? <section className="values-section glass" id="values" aria-labelledby="values-title">
          <div className="values-copy">
            <p className="section-kicker">{copy.values.kicker}</p>
            <h2 id="values-title">{copy.values.title}</h2>
          </div>
        </section> : null}

        {page === "extensions" ? <section className="extensions-section section-block" id="extensions" aria-labelledby="extensions-title" ref={extensionsSectionRef}>
          <div className="section-heading extensions-heading">
            <div>
              <p className="section-kicker">{copy.extensions.kicker}</p>
              <h2 id="extensions-title">{copy.extensions.title}</h2>
            </div>
            <p>{copy.extensions.intro}</p>
          </div>
          <div className="extension-grid">
            {Array.from({ length: extensionRowCount }, (_, rowIndex) => {
              const rowStartIndex = rowIndex * EXTENSIONS_PER_ROW;
              const rowExtensions = sortedExtensions.slice(rowStartIndex, rowStartIndex + EXTENSIONS_PER_ROW);
              const expandedInRow = expandedExtensionIndex !== null
                && Math.floor(expandedExtensionIndex / EXTENSIONS_PER_ROW) === rowIndex;
              const selectedInRow = selectedExtensionIndex !== null
                && Math.floor(selectedExtensionIndex / EXTENSIONS_PER_ROW) === rowIndex;
              const selectedExtension = selectedInRow
                ? sortedExtensions[selectedExtensionIndex]
                : null;

              return <div className="extension-row-group" key={rowIndex}>
                <div className={`extension-row${expandedInRow ? " has-active" : ""}`}>
                  {rowExtensions.map((extension, offset) => {
                    const index = rowStartIndex + offset;
                    const isExpanded = expandedExtensionIndex === index;
                    const positionClass = expandedInRow
                      ? index < expandedExtensionIndex ? " is-before-active" : index > expandedExtensionIndex ? " is-after-active" : " is-active"
                      : "";
                    const detailsId = `extension-details-${index}`;

                    return <article
                      className={`extension-card glass${positionClass}`}
                      data-extension-index={index}
                      data-extension-id={extension.id}
                      key={extension.id}
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => toggleExtension(index)}
                      >
                        <span className="extension-card-meta">
                          <span className="extension-number">{String(index + 1).padStart(2, "0")}</span>
                          <span className="extension-users">{extension.userLabel}</span>
                        </span>
                        <span
                          className="extension-icon"
                          style={{ backgroundImage: `url(${extensionAssetPrefix}${extension.icon})` }}
                          aria-hidden="true"
                        />
                        <span className="extension-name" id={`extension-card-title-${index}`}>{extension.name}</span>
                        <span className="extension-toggle" aria-hidden="true">
                          <span>{isExpanded ? copy.extensions.hideDetails : copy.extensions.showDetails}</span>
                          <i>⌄</i>
                        </span>
                      </button>
                      <div className={`extension-inline-reveal${isExpanded ? " is-open" : ""}`} id={detailsId}>
                        <div>
                          <p>{extension.description}</p>
                          <a className="extension-detail-link" href={extension.storeUrl} target="_blank" rel="noreferrer" tabIndex={isExpanded ? 0 : -1}>
                            {copy.extensions.storeLabel} <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      </div>
                    </article>;
                  })}
                </div>

                <div
                  className={`extension-wide-reveal glass${expandedInRow ? " is-open" : ""}`}
                  data-extension-panel={rowIndex}
                  aria-hidden={!expandedInRow}
                >
                  <div className="extension-wide-inner">
                    {selectedExtension ? <>
                      <div className="extension-wide-identity">
                        <span
                          className="extension-wide-icon"
                          style={{ backgroundImage: `url(${extensionAssetPrefix}${selectedExtension.icon})` }}
                          aria-hidden="true"
                        />
                        <div>
                          <div className="extension-wide-meta">
                            <span>{String((selectedExtensionIndex ?? 0) + 1).padStart(2, "0")}</span>
                            <span className="extension-users">{selectedExtension.userLabel}</span>
                          </div>
                          <h3>{selectedExtension.name}</h3>
                        </div>
                      </div>
                      <div className="extension-wide-copy">
                        <p>{selectedExtension.description}</p>
                        <a className="extension-detail-link" href={selectedExtension.storeUrl} target="_blank" rel="noreferrer" tabIndex={expandedInRow ? 0 : -1}>
                          {copy.extensions.storeLabel} <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </> : null}
                  </div>
                </div>
              </div>;
            })}
          </div>
        </section> : null}

        <footer className="site-footer">
          <div><img className="brand-avatar brand-avatar-footer" src={brandImageSrc} alt="" width="28" height="28" />{copy.brand}</div>
          <p>{copy.footer.description}</p>
          <a href="#top">{copy.footer.backToTop} <span aria-hidden="true">↑</span></a>
        </footer>
      </div>
    </main>
  );
}
