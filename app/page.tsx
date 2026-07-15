const interests = [
  {
    number: "01",
    title: "物理與自然世界",
    text: "從模型、實驗、量測與誤差出發，理解科學如何建立可驗證、但有適用範圍的解釋。",
    tags: ["模型", "因果", "物理教育"],
  },
  {
    number: "02",
    title: "人工智能與程式開發",
    text: "關注 AI 如何協助學習、研究與多步驟任務，也持續追問可靠性、審查權與實際生產力。",
    tags: ["AI", "程式設計", "智能代理"],
  },
  {
    number: "03",
    title: "自動化與生活效率",
    text: "尋找流程中的重複、錯誤與認知負擔，設計可以重複執行、容易驗證而且不增加摩擦的工具。",
    tags: ["流程", "驗證", "低摩擦"],
  },
  {
    number: "04",
    title: "經濟、投資與市場",
    text: "從利率、通脹、企業基本面與風險理解長期變化，區分短期情緒與結構性因素。",
    tags: ["基本面", "風險", "長期變化"],
  },
  {
    number: "05",
    title: "科技產品與數碼工具",
    text: "在規格以外，比較穩定性、使用摩擦、隱私、支援與長期價值，判斷產品是否真正解決問題。",
    tags: ["產品體驗", "隱私", "長期價值"],
  },
  {
    number: "06",
    title: "攝影與影像表達",
    text: "探索畫面如何傳遞資訊，以及器材、便攜性、影像品質、構圖與視覺層次之間的取捨。",
    tags: ["攝影", "構圖", "視覺敘事"],
  },
  {
    number: "07",
    title: "數碼空間設計",
    text: "比較版面、資訊層級與介面風格，在科技感、清晰閱讀與適度視覺效果之間尋找平衡。",
    tags: ["介面", "Bento", "資訊層級"],
  },
  {
    number: "08",
    title: "系統性學習",
    text: "先理解原理，再比較來源、確認定義、檢查推論與邊界，最後整理成可以反覆使用的框架。",
    tags: ["原理", "原始資料", "知識框架"],
  },
];

const thinkingPrinciples = [
  ["證據先於信心", "合理不等於已證實。先了解資料來源、研究方法、限制與其他可能解釋。"],
  ["原理先於操作", "比起記住按鈕與步驟，我更想知道系統為什麼有效，以及何時會失效。"],
  ["邊界情況很重要", "一般情況下可行的方法，遇上缺失資料、極端數值或特殊條件，未必仍然可靠。"],
  ["短期反應不等於長期影響", "新聞、價格和情緒可以快速改變，但結構性趨勢需要更長時間與更多證據。"],
  ["系統會影響個人行為", "制度、環境、誘因與資訊設計，都會改變人的選擇和最後結果。"],
  ["效率不只是更快", "有用的效率也要照顧準確性、可靠性、可維護性與人的負擔。"],
  ["願意更新觀點", "當新證據更有力，修正原本判斷不是動搖，而是對事實保持誠實。"],
  ["複雜問題少有單一答案", "證據不足或價值取捨不同時，應呈現多種觀點及各自代價。"],
];

const learningSteps = [
  ["01", "理解原理", "先問機制與定義，不急於記住結論。"],
  ["02", "回到來源", "查看正式或原始資料，知道說法從何而來。"],
  ["03", "比較證據", "確認不同來源是否使用相同口徑與假設。"],
  ["04", "測試邊界", "尋找例外、極端情況與可能失效的條件。"],
  ["05", "重新解釋", "把複雜內容整理成可以反覆使用的理解框架。"],
];

const questions = [
  "AI 應如何協助人類，而不削弱獨立思考能力？",
  "哪些工作適合完全自動化，哪些應保留人工判斷？",
  "科學模型在甚麼情況下能幫助日常決策？",
  "經濟增長為甚麼未必改善所有人的生活感受？",
  "如何在效率、準確性與人的自主權之間取得平衡？",
  "科技應如何服務生活，而不是讓生活圍繞科技運轉？",
];

export default function Home() {
  return (
    <main id="top">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <div className="page-shell">
        <header className="site-header glass">
          <a className="brand" href="#top" aria-label="返回頁首">
            <span className="brand-dot" aria-hidden="true" />
            ［公開顯示名稱］
          </a>
          <nav aria-label="主要導覽">
            <a href="#about">關於</a>
            <a href="#interests">長期興趣</a>
            <a href="#thinking">如何思考</a>
            <a href="#values">生活價值</a>
          </nav>
        </header>

        <section className="hero glass" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✦</span> 物理 · 科技 · 系統 · 人</p>
            <h1 id="hero-title">從物理、科技與系統出發，<span>持續理解世界如何運作。</span></h1>
            <p className="hero-intro">
              我喜歡把複雜問題拆開，尋找真正影響結果的因素；以證據建立理解，也為新的證據保留修正空間。
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#interests">探索長期興趣</a>
              <a className="text-link" href="#thinking">看看我如何思考 <span aria-hidden="true">↘</span></a>
            </div>
          </div>

          <div className="system-portrait" aria-label="一幅以軌道、節點與座標構成的抽象系統圖">
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
        </section>

        <section className="about-grid" id="about" aria-labelledby="about-title">
          <article className="about-main glass">
            <p className="section-kicker">ABOUT THIS SPACE</p>
            <h2 id="about-title">一個整理長期好奇心的<br />個人數碼花園</h2>
            <p>
              我以物理作為主要學習背景，並長期關注人工智能、程式設計、資料分析、自動化、經濟與科技發展。這裡不是履歷，也不是答案陳列室，而是記錄理解如何逐步形成的地方。
            </p>
            <p>
              我不只想知道工具「可以使用」，也想理解它為甚麼有效、在甚麼情況下失效、是否可靠，以及它有沒有真正改善人的生活。
            </p>
          </article>

          <aside className="question-card glass" aria-label="反覆追問的問題">
            <span className="large-mark" aria-hidden="true">?</span>
            <p>面對一個說法，我經常先問：</p>
            <blockquote>「還有沒有其他合理的解釋？」</blockquote>
            <span className="card-note">保持好奇，也保持審慎。</span>
          </aside>

          <aside className="method-card glass" aria-label="理解方法">
            <p className="section-kicker">A WAY OF SEEING</p>
            <div className="method-line"><span>觀察</span><i /><span>拆解</span><i /><span>驗證</span><i /><span>更新</span></div>
          </aside>
        </section>

        <section className="section-block" id="interests" aria-labelledby="interests-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">LONG-TERM CURIOSITIES</p>
              <h2 id="interests-title">長期核心興趣</h2>
            </div>
            <p>這些主題彼此交疊：自然規律影響科技，科技改變制度，而制度與工具又塑造人的選擇。</p>
          </div>
          <div className="interest-grid">
            {interests.map((interest) => (
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

        <section className="thinking-section glass" id="thinking" aria-labelledby="thinking-title">
          <div className="thinking-intro">
            <p className="section-kicker">HOW I THINK</p>
            <h2 id="thinking-title">我如何思考</h2>
            <p>這些不是固定答案，而是一組協助我減少盲點、檢查判斷的方法。</p>
          </div>
          <div className="principles">
            {thinkingPrinciples.map(([title, text], index) => (
              <article className="principle" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="learning-grid section-block" aria-labelledby="learning-title">
          <div className="learning-copy glass">
            <p className="section-kicker">LEARNING PROCESS</p>
            <h2 id="learning-title">學習不是收集答案，<br />而是建立可以更新的理解。</h2>
            <p>我偏好由原理開始，沿着來源、證據和邊界逐步檢查，再把知識整理成能夠重新使用的框架。</p>
          </div>
          <ol className="learning-steps glass">
            {learningSteps.map(([number, title, text]) => (
              <li key={number}>
                <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="question-section section-block" aria-labelledby="questions-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">OPEN QUESTIONS</p>
              <h2 id="questions-title">值得長期追問的問題</h2>
            </div>
            <p>有些問題沒有快速結論，但值得在不同時間、帶着新的證據再次回來。</p>
          </div>
          <div className="question-list">
            {questions.map((question, index) => (
              <article className="open-question glass" key={question}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{question}</p>
                <i aria-hidden="true">↗</i>
              </article>
            ))}
          </div>
        </section>

        <section className="values-section glass" id="values" aria-labelledby="values-title">
          <div className="values-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="values-copy">
            <p className="section-kicker">A LIFE I VALUE</p>
            <h2 id="values-title">我重視的生活</h2>
            <blockquote>
              「我認為理想生活不只來自成就，也來自健康、穩定、選擇能力、可信任的關係，以及對自己生活方向的掌握。」
            </blockquote>
            <div className="value-tags">
              {['身心健康', '財務安全', '持續成長', '自主選擇', '生活秩序', '接受不完美'].map((value) => <span key={value}>{value}</span>)}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div><span className="brand-dot" aria-hidden="true" />［公開顯示名稱］</div>
          <p>一個持續學習、整理思想與記錄探索的個人空間。</p>
          <a href="#top">回到頁首 <span aria-hidden="true">↑</span></a>
        </footer>
      </div>
    </main>
  );
}
