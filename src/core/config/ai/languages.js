export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  NL: 'nl',
  TR: 'tr',
};

export const SYSTEM_PROMPTS = {
  [SUPPORTED_LANGUAGES.EN]: 'You are a helpful assistant. Please respond in English.',
  [SUPPORTED_LANGUAGES.NL]: 'U bent een behulpzame assistent. Reageer in het Nederlands.',
  [SUPPORTED_LANGUAGES.TR]: 'Sen yardımcı bir asistansın. Türkçe yanıt ver.',
};

export const TASK_MESSAGES = {
  summary: {
    [SUPPORTED_LANGUAGES.EN]: 'Summarize the text.',
    [SUPPORTED_LANGUAGES.NL]: 'Vat de tekst samen.',
    [SUPPORTED_LANGUAGES.TR]: 'Metni özetle.',
  },
  analysis: {
    [SUPPORTED_LANGUAGES.EN]: 'Perform detailed analysis.',
    [SUPPORTED_LANGUAGES.NL]: 'Voer een gedetailleerde analyse uit.',
    [SUPPORTED_LANGUAGES.TR]: 'Detaylı analiz yap.',
  },
  ideas: {
    [SUPPORTED_LANGUAGES.EN]: 'Generate creative ideas.',
    [SUPPORTED_LANGUAGES.NL]: 'Genereer creatieve ideeën.',
    [SUPPORTED_LANGUAGES.TR]: 'Yaratıcı fikirler üret.',
  },
};

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.EN;
