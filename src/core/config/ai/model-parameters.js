export const MODEL_PARAMETERS = {
  defaults: {
    temperature: 0.7,
    maxTokens: 1000,
  },
  tasks: {
    summary: {
      temperature: 0.3,
      maxTokens: 300,
    },
    analysis: {
      temperature: 0.7,
      maxTokens: 2000,
    },
    ideas: {
      temperature: 1.1,
      maxTokens: 1500,
    },
  },
};
