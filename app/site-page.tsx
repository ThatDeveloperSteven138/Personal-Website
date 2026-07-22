"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Language = "zh" | "en";
export type SitePageName = "home" | "interests" | "thinking" | "values" | "extensions";
type RoutePrefix = "" | "/en" | "/zh";
const LANGUAGE_MENU_CLOSE_DELAY_MS = 350;

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
    hero: {
      eyebrow: "物理 · 科技 · 系統 · 人",
      title: "從物理、科技與系統出發，",
      titleAccent: "持續理解世界如何運作。",
      intro: "我喜歡把複雜問題拆開，尋找真正影響結果的因素；以證據建立理解，也為新的證據保留修正空間。",
      primaryAction: "探索長期興趣",
      secondaryAction: "看看我如何思考",
      portraitLabel: "一幅以軌道、節點與座標構成的抽象系統圖",
    },
    interests: {
      kicker: "LONG-TERM CURIOSITIES",
      title: "長期核心興趣",
      intro: "這些主題彼此交疊：自然規律影響科技，科技改變制度，而制度與工具又塑造人的選擇。",
      items: [
        { number: "01", title: "物理與自然世界", text: "從模型、實驗、量測與誤差出發，理解科學如何建立可驗證、但有適用範圍的解釋。", tags: ["模型", "因果", "物理教育"] },
        { number: "02", title: "人工智能與程式開發", text: "關注 AI 如何協助學習、研究與多步驟任務，也持續追問可靠性、審查權與實際生產力。", tags: ["AI", "程式設計", "智能代理"] },
        { number: "03", title: "自動化與生活效率", text: "尋找流程中的重複、錯誤與認知負擔，設計可以重複執行、容易驗證而且不增加摩擦的工具。", tags: ["流程", "驗證", "低摩擦"] },
        { number: "04", title: "經濟、投資與市場", text: "從利率、通脹、企業基本面與風險理解長期變化，區分短期情緒與結構性因素。", tags: ["基本面", "風險", "長期變化"] },
        { number: "05", title: "科技產品與數碼工具", text: "在規格以外，比較穩定性、使用摩擦、隱私、支援與長期價值，判斷產品是否真正解決問題。", tags: ["產品體驗", "隱私", "長期價值"] },
        { number: "06", title: "攝影與影像表達", text: "探索畫面如何傳遞資訊，以及器材、便攜性、影像品質、構圖與視覺層次之間的取捨。", tags: ["攝影", "構圖", "視覺敘事"] },
        { number: "07", title: "數碼空間設計", text: "比較版面、資訊層級與介面風格，在科技感、清晰閱讀與適度視覺效果之間尋找平衡。", tags: ["介面", "Bento", "資訊層級"] },
        { number: "08", title: "系統性學習", text: "先理解原理，再比較來源、確認定義、檢查推論與邊界，最後整理成可以反覆使用的框架。", tags: ["原理", "原始資料", "知識框架"] },
      ],
    },
    thinking: {
      kicker: "HOW I THINK",
      title: "我如何思考",
    },
    learning: {
      kicker: "LEARNING PROCESS",
      title: "學習不是收集答案，",
      titleAccent: "而是建立可以更新的理解。",
      intro: "我偏好由原理開始，沿着來源、證據和邊界逐步檢查，再把知識整理成能夠重新使用的框架。",
      steps: [
        ["01", "理解原理", "先問機制與定義，不急於記住結論。"],
        ["02", "回到來源", "查看正式或原始資料，知道說法從何而來。"],
        ["03", "比較證據", "確認不同來源是否使用相同口徑與假設。"],
        ["04", "測試邊界", "尋找例外、極端情況與可能失效的條件。"],
        ["05", "重新解釋", "把複雜內容整理成可以反覆使用的理解框架。"],
      ],
    },
    questions: {
      kicker: "OPEN QUESTIONS",
      title: "值得長期追問的問題",
      intro: "有些問題沒有快速結論，但值得在不同時間、帶着新的證據再次回來。",
      items: [
        "AI 應如何協助人類，而不削弱獨立思考能力？",
        "哪些工作適合完全自動化，哪些應保留人工判斷？",
        "科學模型在甚麼情況下能幫助日常決策？",
        "經濟增長為甚麼未必改善所有人的生活感受？",
        "如何在效率、準確性與人的自主權之間取得平衡？",
        "科技應如何服務生活，而不是讓生活圍繞科技運轉？",
      ],
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
    hero: {
      eyebrow: "Physics · Technology · Systems · People",
      title: "Starting with physics, technology, and systems,",
      titleAccent: "I keep exploring how the world works.",
      intro: "I enjoy breaking complex problems into parts and finding the factors that truly shape the outcome—building understanding from evidence while staying open to revision when better evidence appears.",
      primaryAction: "Explore my interests",
      secondaryAction: "See how I think",
      portraitLabel: "An abstract systems portrait formed by orbits, nodes, and coordinates",
    },
    interests: {
      kicker: "LONG-TERM CURIOSITIES",
      title: "Core long-term interests",
      intro: "These subjects overlap: natural laws shape technology, technology changes institutions, and institutions and tools shape the choices people make.",
      items: [
        { number: "01", title: "Physics and the natural world", text: "Starting from models, experiments, measurement, and uncertainty, I explore how science builds explanations that can be tested while remaining bounded by their conditions of use.", tags: ["Models", "Causality", "Physics education"] },
        { number: "02", title: "AI and software development", text: "I study how AI can support learning, research, and multi-step work while continuing to question reliability, human oversight, and real productivity.", tags: ["AI", "Programming", "Agents"] },
        { number: "03", title: "Automation and everyday efficiency", text: "I look for repetition, errors, and cognitive load in a process, then design tools that are repeatable, easy to verify, and low in friction.", tags: ["Process", "Verification", "Low friction"] },
        { number: "04", title: "Economics, investing, and markets", text: "I use interest rates, inflation, business fundamentals, and risk to understand long-term change and distinguish short-term sentiment from structural forces.", tags: ["Fundamentals", "Risk", "Long-term change"] },
        { number: "05", title: "Technology products and digital tools", text: "Beyond specifications, I compare reliability, usability, privacy, support, and long-term value to judge whether a product truly solves a problem.", tags: ["Product experience", "Privacy", "Long-term value"] },
        { number: "06", title: "Photography and visual expression", text: "I explore how images carry information and how equipment, portability, image quality, composition, and visual depth trade off against one another.", tags: ["Photography", "Composition", "Visual storytelling"] },
        { number: "07", title: "Designing digital spaces", text: "I compare layout, information hierarchy, and interface styles to balance a technological feel, clear reading, and purposeful visual effects.", tags: ["Interface", "Bento", "Information hierarchy"] },
        { number: "08", title: "Systematic learning", text: "I begin with principles, compare sources, clarify definitions, test inferences and boundaries, and turn the result into a reusable framework.", tags: ["Principles", "Primary sources", "Knowledge frameworks"] },
      ],
    },
    thinking: {
      kicker: "HOW I THINK",
      title: "How I think",
    },
    learning: {
      kicker: "LEARNING PROCESS",
      title: "Learning is not collecting answers,",
      titleAccent: "but building understanding that can change.",
      intro: "I prefer to start from first principles, check sources, evidence, and boundaries step by step, then organise the knowledge into a framework I can use again.",
      steps: [
        ["01", "Understand the principle", "Ask about mechanisms and definitions before memorising conclusions."],
        ["02", "Return to the source", "Consult formal or primary material and understand where a claim came from."],
        ["03", "Compare the evidence", "Check whether different sources use the same definitions and assumptions."],
        ["04", "Test the boundaries", "Look for exceptions, extremes, and the conditions under which an idea may fail."],
        ["05", "Explain it again", "Turn complex material into a reusable framework for understanding."],
      ],
    },
    questions: {
      kicker: "OPEN QUESTIONS",
      title: "Questions worth returning to",
      intro: "Some questions do not have quick conclusions, but they are worth revisiting at different times with new evidence.",
      items: [
        "How should AI assist people without weakening independent thought?",
        "Which kinds of work should be fully automated, and which should retain human judgment?",
        "When can scientific models improve everyday decisions?",
        "Why does economic growth not always improve how life feels for everyone?",
        "How can we balance efficiency, accuracy, and human agency?",
        "How can technology serve life instead of making life revolve around technology?",
      ],
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
  const languageMenuCloseTimerRef = useRef<number | null>(null);
  const extensionsSectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => () => {
    if (languageMenuCloseTimerRef.current !== null) {
      window.clearTimeout(languageMenuCloseTimerRef.current);
    }
  }, []);

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

  useEffect(() => {
    if (expandedExtensionIndex === null) return;
    const activeIndex = expandedExtensionIndex;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrollTimer = window.setTimeout(() => {
      const section = extensionsSectionRef.current;
      const activeCard = section?.querySelector<HTMLElement>(`[data-extension-index="${activeIndex}"]`);
      const widePanel = section?.querySelector<HTMLElement>(`[data-extension-panel="${Math.floor(activeIndex / 5)}"]`);
      const target = window.matchMedia("(max-width: 720px)").matches ? activeCard : widePanel;
      if (!target) return;

      const bounds = target.getBoundingClientRect();
      const viewportPadding = 24;
      const isFullyVisible = bounds.top >= viewportPadding
        && bounds.bottom <= window.innerHeight - viewportPadding;

      if (!isFullyVisible) {
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
      }
    }, reduceMotion ? 0 : 440);

    return () => window.clearTimeout(scrollTimer);
  }, [expandedExtensionIndex]);

  function toggleExtension(index: number) {
    if (expandedExtensionIndex === index) {
      setExpandedExtensionIndex(null);
      return;
    }

    setSelectedExtensionIndex(index);
    setExpandedExtensionIndex(index);
  }

  function cancelLanguageMenuClose() {
    if (languageMenuCloseTimerRef.current === null) return;
    window.clearTimeout(languageMenuCloseTimerRef.current);
    languageMenuCloseTimerRef.current = null;
  }

  function scheduleLanguageMenuClose() {
    cancelLanguageMenuClose();
    languageMenuCloseTimerRef.current = window.setTimeout(() => {
      setLanguageMenuOpen(false);
      languageMenuCloseTimerRef.current = null;
    }, LANGUAGE_MENU_CLOSE_DELAY_MS);
  }

  return (
    <main id="top" lang={language === "zh" ? "zh-Hant" : "en"}>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="page-shell" data-page={page}>
        <header className="site-header glass">
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
                if (event.pointerType !== "mouse") return;
                cancelLanguageMenuClose();
                setLanguageMenuOpen(true);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") scheduleLanguageMenuClose();
              }}
              onFocusCapture={cancelLanguageMenuClose}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  cancelLanguageMenuClose();
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
                onClick={() => {
                  cancelLanguageMenuClose();
                  setLanguageMenuOpen((open) => !open);
                }}
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

        {page === "home" ? <section className="hero glass" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✦</span> {copy.hero.eyebrow}</p>
            <h1 id="hero-title">{copy.hero.title}<span>{copy.hero.titleAccent}</span></h1>
            <p className="hero-intro">{copy.hero.intro}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={pageHref("interests", language)}>{copy.hero.primaryAction}</Link>
              <Link className="text-link" href={pageHref("thinking", language)}>{copy.hero.secondaryAction} <span aria-hidden="true">↘</span></Link>
            </div>
          </div>

          <div className="system-portrait" aria-label={copy.hero.portraitLabel}>
            <div className="orbit orbit-a"><span /></div>
            <div className="orbit orbit-b"><span /></div>
            <div className="portrait-core">
              <span className="core-label">CURIOUS<br />SYSTEMS</span>
            </div>
            <div className="axis axis-x" aria-hidden="true" />
            <div className="axis axis-y" aria-hidden="true" />
            <span className="coordinate coordinate-a">EVIDENCE</span>
            <span className="coordinate coordinate-b">BOUNDARY</span>
            <span className="coordinate coordinate-c">UPDATE</span>
          </div>
        </section> : null}

        {page === "interests" ? <>
        <section className="section-block" id="interests" aria-labelledby="interests-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{copy.interests.kicker}</p>
              <h2 id="interests-title">{copy.interests.title}</h2>
            </div>
            <p>{copy.interests.intro}</p>
          </div>
          <div className="interest-grid">
            {copy.interests.items.map((interest) => (
              <article className="interest-card glass" key={interest.number}>
                <div className="interest-top"><span>{interest.number}</span><i aria-hidden="true" /></div>
                <h3>{interest.title}</h3>
                <p>{interest.text}</p>
                <div className="tag-row">
                  {interest.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-grid section-block" aria-labelledby="learning-title">
          <div className="learning-copy glass">
            <p className="section-kicker">{copy.learning.kicker}</p>
            <h2 id="learning-title">{copy.learning.title}<br />{copy.learning.titleAccent}</h2>
            <p>{copy.learning.intro}</p>
          </div>
          <ol className="learning-steps glass">
            {copy.learning.steps.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="question-section section-block" aria-labelledby="questions-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">{copy.questions.kicker}</p>
              <h2 id="questions-title">{copy.questions.title}</h2>
            </div>
            <p>{copy.questions.intro}</p>
          </div>
          <div className="question-list">
            {copy.questions.items.map((question, index) => (
              <article className="open-question glass" key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{question}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>
        </> : null}

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
