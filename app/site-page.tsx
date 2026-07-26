"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type Language = "zh" | "en";
export type SitePageName = "home" | "interests" | "thinking" | "values" | "extensions";
type RoutePrefix = "" | "/en" | "/zh";

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
      interests: "長期興趣",
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
    thinking: {
      kicker: "HOW I THINK",
      title: "我如何思考",
    },
    values: {
      kicker: "A LIFE I VALUE",
      title: "我重視的生活",
    },
    extensions: {
      kicker: "BROWSER EXTENSIONS",
      title: "我製作的擴充功能",
      intro: "一些由實際需要出發的瀏覽器工具，涵蓋專注力、使用統計、自動化與日常效率。點擊卡片可查看簡介與 Chrome Web Store 連結。",
      showDetails: "展開簡介",
      hideDetails: "收起簡介",
      storeLabel: "前往 Chrome Web Store",
      items: [
        { name: "Better Instagram: Stop Scrolling", description: "停止在 Instagram 網頁版無意義滑動：隱藏廣告與推薦內容、淡化未追蹤貼文、灰階模式、Reels 計時器與統計、深色模式。", storeUrl: "https://chromewebstore.google.com/detail/better-instagram-stop-scr/hbaefnliifnjeegbijmkjognpfcgcjja", icon: "/extension-icons/better-instagram.png" },
        { name: "YouTube Search History Hider", description: "隱藏 YouTube 搜尋下拉選單中的搜尋記錄建議，但不會刪除或修改實際記錄。", storeUrl: "https://chromewebstore.google.com/detail/youtube-search-history-hi/odblhgiogpigmabbjoekkhlbfiommljo", icon: "/extension-icons/youtube-search-history-hider.png" },
        { name: "ChatGPT Message Queue", description: "在 ChatGPT 仍在回應時預先排隊後續提示，讓對話流程不中斷。", storeUrl: "https://chromewebstore.google.com/detail/chatgpt-message-queue/bdeaocefmnkeinfiknfeahpghemjjgjo", icon: "/extension-icons/chatgpt-message-queue.png" },
        { name: "Browser Statistic", description: "記錄造訪的網站、停留時間、新分頁網站開啟次數，以及瀏覽器啟動後開啟的第一個網站。", storeUrl: "https://chromewebstore.google.com/detail/browser-statistic/aanphhcamfkdoddabpndlehafpnlihgb", icon: "/extension-icons/browser-statistic.png" },
        { name: "Google Sign-out Button Blocker", description: "隱藏 Google 與 YouTube 帳戶選單中的登出項目，減少意外登出。", storeUrl: "https://chromewebstore.google.com/detail/google-sign-out-button-bl/gihgdlmihjffijgdcphogioneecekpdl", icon: "/extension-icons/google-signout-blocker.png" },
        { name: "Better Youtube: Reduce Distraction", description: "透過依頁面分類的開關、多語言 popup 控制和觀看時間工具，減少 YouTube 干擾。", storeUrl: "https://chromewebstore.google.com/detail/better-youtube-reduce-dis/ekgikkblidfggbmadhdbepnikknmdgmk", icon: "/extension-icons/better-youtube.png" },
        { name: "Video Watch Time Statistic Pro", description: "以多種指標與歷史報告，專業追蹤不同網站的影片觀看時間。", storeUrl: "https://chromewebstore.google.com/detail/video-watch-time-statisti/jglhflgbojcnjjjlombjijgmkpeafmem", icon: "/extension-icons/video-watch-time-pro.png" },
        { name: "Video Watched Time Companion", description: "透過可自訂顯示的即時浮動計時器，追蹤、量度及監察影片觀看時間。", storeUrl: "https://chromewebstore.google.com/detail/video-watched-time-compan/kgldileenmeldkmlefmgoebbfeckcihl", icon: "/extension-icons/video-watched-time-companion.png" },
        { name: "Website Auto Refresh", description: "自動重新整理指定的瀏覽器分頁，並監察重要的頁面變化，無需逐頁手動重新載入。", storeUrl: "https://chromewebstore.google.com/detail/website-auto-refresh/ehhijipfiopdlmhglhhkbhndaodfnfdj", icon: "/extension-icons/website-auto-refresh.png" },
        { name: "QuoteSpark", description: "純黑新分頁，顯示 10 種主要語言的隨機名言和作者。", storeUrl: "https://chromewebstore.google.com/detail/quotespark/nmnfklkcpjkglpjekmjocbagneignlfi", icon: "/extension-icons/quotespark.png" },
      ],
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
      interests: "Interests",
      thinking: "How I think",
      values: "Life values",
      extensions: "Extensions",
    },
    about: {
      title: "About Me",
      paragraphs: [
        "Hi, I’m Steven, also known online as Developer Steven. I am a university student from Hong Kong, majoring in Physics and Data Analytics.",
        "Outside of university and extension development, I enjoy reading, learning about investing, and maintaining a healthy and active lifestyle. I go to the gym regularly and enjoy outdoor activities such as hiking, camping, cycling, and fishing. I am also committed to lifelong learning and frequently explore new AI tools and skills, particularly vibe coding.",
        "I try to limit my use of social media platforms such as Facebook, Instagram, and Threads. Research has found that heavier use of short-form video platforms is associated with poorer attention, inhibitory control, and other cognitive outcomes. However, I do not believe the issue is as simple as saying that social media is entirely harmful. Its effects can vary depending on how a platform is used, what content a person consumes, and how well they are able to control their usage.",
        "Despite being conscious of these risks, I still sometimes find myself spending more time than intended on online content. This personal struggle inspired me to create browser extensions that help reduce distractions, discourage mindless scrolling, and give users greater control over how they spend their time online.",
        "I originally created these extensions to help myself, but I hope they can also support other people who experience similar difficulties.",
        "This website is where I share my browser extensions, new ideas, and development progress. I also hope it provides an opportunity for more people to get to know me, exchange ideas, and connect over shared interests.",
      ],
    },
    thinking: {
      kicker: "HOW I THINK",
      title: "How I think",
    },
    values: {
      kicker: "A LIFE I VALUE",
      title: "The life I value",
    },
    extensions: {
      kicker: "BROWSER EXTENSIONS",
      title: "Extensions I have built",
      intro: "Browser tools created from practical needs across focus, usage statistics, automation, and everyday efficiency. Select a card to see its introduction and Chrome Web Store link.",
      showDetails: "Show details",
      hideDetails: "Hide details",
      storeLabel: "Open in Chrome Web Store",
      items: [
        { name: "Better Instagram: Stop Scrolling", description: "Stop scrolling on Instagram Web: hide ads and suggestions, dim posts from accounts you do not follow, use grayscale mode, view a Reels timer and statistics, and enable Dark Mode.", storeUrl: "https://chromewebstore.google.com/detail/better-instagram-stop-scr/hbaefnliifnjeegbijmkjognpfcgcjja", icon: "/extension-icons/better-instagram.png" },
        { name: "YouTube Search History Hider", description: "Hide YouTube search-history suggestions from the search dropdown without deleting or changing the underlying history.", storeUrl: "https://chromewebstore.google.com/detail/youtube-search-history-hi/odblhgiogpigmabbjoekkhlbfiommljo", icon: "/extension-icons/youtube-search-history-hider.png" },
        { name: "ChatGPT Message Queue", description: "Queue follow-up prompts while ChatGPT is still responding.", storeUrl: "https://chromewebstore.google.com/detail/chatgpt-message-queue/bdeaocefmnkeinfiknfeahpghemjjgjo", icon: "/extension-icons/chatgpt-message-queue.png" },
        { name: "Browser Statistic", description: "Track visited sites, dwell time, new-tab site opens, and the first site opened after browser startup.", storeUrl: "https://chromewebstore.google.com/detail/browser-statistic/aanphhcamfkdoddabpndlehafpnlihgb", icon: "/extension-icons/browser-statistic.png" },
        { name: "Google Sign-out Button Blocker", description: "Hide account-menu sign-out entries on Google and YouTube pages to reduce accidental sign-outs.", storeUrl: "https://chromewebstore.google.com/detail/google-sign-out-button-bl/gihgdlmihjffijgdcphogioneecekpdl", icon: "/extension-icons/google-signout-blocker.png" },
        { name: "Better Youtube: Reduce Distraction", description: "Reduce YouTube distractions with page-based toggles, multilingual popup controls, and watch-time tools.", storeUrl: "https://chromewebstore.google.com/detail/better-youtube-reduce-dis/ekgikkblidfggbmadhdbepnikknmdgmk", icon: "/extension-icons/better-youtube.png" },
        { name: "Video Watch Time Statistic Pro", description: "Professional video watch-time tracking with multiple metrics and historical reports.", storeUrl: "https://chromewebstore.google.com/detail/video-watch-time-statisti/jglhflgbojcnjjjlombjijgmkpeafmem", icon: "/extension-icons/video-watch-time-pro.png" },
        { name: "Video Watched Time Companion", description: "Track, measure, and monitor video watch time through a real-time overlay timer with customizable display options.", storeUrl: "https://chromewebstore.google.com/detail/video-watched-time-compan/kgldileenmeldkmlefmgoebbfeckcihl", icon: "/extension-icons/video-watched-time-companion.png" },
        { name: "Website Auto Refresh", description: "Keep selected browser tabs up to date and monitor important page changes without manually reloading each page.", storeUrl: "https://chromewebstore.google.com/detail/website-auto-refresh/ehhijipfiopdlmhglhhkbhndaodfnfdj", icon: "/extension-icons/website-auto-refresh.png" },
        { name: "QuoteSpark", description: "A pure-black new-tab page displaying a random quote and author in 10 major languages.", storeUrl: "https://chromewebstore.google.com/detail/quotespark/nmnfklkcpjkglpjekmjocbagneignlfi", icon: "/extension-icons/quotespark.png" },
      ],
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
      const activePanel = section.querySelector(`[data-extension-panel="${Math.floor(activeIndex / 5)}"]`);
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
      : `[data-extension-panel="${Math.floor(activeIndex / 5)}"]`;
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

        {page === "thinking" ? <section className="thinking-section glass" id="thinking" aria-labelledby="thinking-title">
          <div className="thinking-intro">
            <p className="section-kicker">{copy.thinking.kicker}</p>
            <h2 id="thinking-title">{copy.thinking.title}</h2>
          </div>
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
            {[0, 1].map((rowIndex) => {
              const rowStartIndex = rowIndex * 5;
              const rowExtensions = copy.extensions.items.slice(rowStartIndex, rowStartIndex + 5);
              const expandedInRow = expandedExtensionIndex !== null
                && Math.floor(expandedExtensionIndex / 5) === rowIndex;
              const selectedInRow = selectedExtensionIndex !== null
                && Math.floor(selectedExtensionIndex / 5) === rowIndex;
              const selectedExtension = selectedInRow
                ? copy.extensions.items[selectedExtensionIndex]
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
                      key={extension.name}
                    >
                      <button
                        type="button"
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => toggleExtension(index)}
                      >
                        <span className="extension-number">{String(index + 1).padStart(2, "0")}</span>
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
                          <span>{String((selectedExtensionIndex ?? 0) + 1).padStart(2, "0")}</span>
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
