import { Language } from './types';

type TranslationSet = {
  [key: string]: string;
};

type AllTranslations = {
  [lang in Language]: TranslationSet;
};

export const translations: AllTranslations = {
  en: {
    title: 'Bible Speak',
    blurb: 'AI-powered exegesis to unlock the richness of the original biblical texts.',
    searchPlaceholder: 'Enter a topic, theme, or question... (e.g., "the armor of God")',
    searchButton: 'Search',
    relevance: 'Relevance',
    context: 'Context',
    keyTerms: 'Key Terms',
    originalLanguage: 'Original Language',
    savedTopics: 'Saved Topics',
    bookmarkedVerses: 'Bookmarked Verses',
    remove: 'Remove',
    searchThisTopic: 'Search this topic',
    about: 'About',
    close: 'Close',
    show: 'Show',
    hide: 'Hide',
    initialMessageTitle: 'Welcome to Bible Speak',
    initialMessageBody: 'Your personal tool for deep, contextual Bible study. Start by entering a topic, theme, or question in the search bar above to discover relevant verses with rich historical and linguistic analysis.',
    aboutTitle: 'About Bible Speak',
    aboutPurposeTitle: 'Our Purpose',
    aboutPurposeBody: 'In an age of confusion, clarity is essential. Bible Speak was created to combat the superficial understanding and misinterpretation of Scripture that is common today. By leveraging AI, we provide immediate access to every verse on a given topic, anchored in its proper historical, literary, and linguistic context. Our goal is to equip believers for a deeper, more accurate, and richer understanding of God\'s Word, moving them from ambiguity to confidence.',
    aboutDoctrineTitle: 'Our Doctrine',
    aboutDoctrineBody: 'This tool operates from a high view of Scripture, affirming its inerrancy, authority, and sufficiency. We hold to the core tenets of historic, orthodox Christianity, including the Trinity, the full deity and humanity of Christ, His substitutionary atonement, and salvation by grace through faith alone. The contextual analyses are guided by a historical-grammatical hermeneutic, consistent with the principles of the Protestant Reformation.',
    error: 'An error occurred during the search. Please try again.',
    loadingTitle: 'Searching the Scriptures...',
    loadingBody: 'Performing deep contextual analysis across all 66 books to ensure every relevant verse is found.',
    loadingTime: 'This process is thorough and may take up to 60 seconds.',
    cancelSearch: 'Cancel Search',
    searchCancelled: 'The search was cancelled.',
  },
  ko: {
    title: 'Bible Speak',
    blurb: '성경 원문의 풍부함을 열어주는 AI 기반 성경 해석 도구입니다.',
    searchPlaceholder: '주제, 테마, 또는 질문을 입력하세요... (예: "하나님의 전신갑주")',
    searchButton: '검색',
    relevance: '관련성',
    context: '문맥',
    keyTerms: '핵심 용어',
    originalLanguage: '원어',
    savedTopics: '저장된 주제',
    bookmarkedVerses: '북마크된 구절',
    remove: '삭제',
    searchThisTopic: '이 주제로 검색',
    about: '소개',
    close: '닫기',
    show: '표시',
    hide: '숨기기',
    initialMessageTitle: 'Bible Speak에 오신 것을 환영합니다',
    initialMessageBody: '깊이 있고 문맥적인 성경 연구를 위한 개인 도구입니다. 상단의 검색창에 주제, 테마, 또는 질문을 입력하여 풍부한 역사적, 언어적 분석과 함께 관련 구절을 찾아보세요.',
    aboutTitle: 'Bible Speak 소개',
    aboutPurposeTitle: '우리의 목적',
    aboutPurposeBody: '혼란의 시대에 명확성은 필수적입니다. Bible Speak는 오늘날 흔히 볼 수 있는 성경에 대한 피상적인 이해와 오해에 맞서기 위해 만들어졌습니다. AI를 활용하여, 주어진 주제에 대한 모든 구절을 적절한 역사적, 문학적, 언어적 문맥에 근거하여 즉시 제공합니다. 우리의 목표는 신자들이 모호함에서 확신으로 나아가도록, 하나님의 말씀을 더 깊고, 더 정확하고, 더 풍부하게 이해할 수 있도록 돕는 것입니다.',
    aboutDoctrineTitle: '우리의 신조',
    aboutDoctrineBody: '이 도구는 성경의 무오성, 권위, 그리고 충분성을 확증하는 높은 성경관을 바탕으로 운영됩니다. 우리는 삼위일체, 그리스도의 완전한 신성과 인성, 그의 대속적 속죄, 그리고 오직 믿음을 통한 은혜에 의한 구원을 포함한 역사적, 정통 기독교의 핵심 교리를 견지합니다. 문맥 분석은 개신교 종교개혁의 원칙과 일치하는 역사적-문법적 해석학에 의해 안내됩니다.',
    error: '검색 중 오류가 발생했습니다. 다시 시도해 주세요.',
    loadingTitle: '성경을 검색 중입니다...',
    loadingBody: '모든 관련 구절을 찾기 위해 66권 전체에 걸쳐 심층적인 문맥 분석을 수행하고 있습니다.',
    loadingTime: '이 과정은 철저하며 최대 60초가 소요될 수 있습니다.',
    cancelSearch: '검색 취소',
    searchCancelled: '검색이 취소되었습니다.',
  }
};
