import OpenAI from 'openai'

export const OpenAi = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})