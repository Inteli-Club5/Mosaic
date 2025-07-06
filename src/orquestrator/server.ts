import express from 'express';
import bodyParser from 'body-parser';
import path from "path";
import dotenv from 'dotenv';
import {
  HederaConversationalAgent,
  ServerSigner,
  HederaAccountPlugin,
  HederaHCSPlugin
} from 'hedera-agent-kit';

import { handleOrchestratedMessage } from './orquestrador';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

let agent: HederaConversationalAgent;

async function initAgent() {
  const signer = new ServerSigner(
    process.env.HEDERA_ACCOUNT_ID!,
    process.env.HEDERA_PRIVATE_KEY!,
    'testnet'
  );

  agent = new HederaConversationalAgent(signer, {
    openAIApiKey: process.env.OPENAI_API_KEY!,
    operationalMode: 'autonomous',
    pluginConfig: {
      plugins: [new HederaAccountPlugin(), new HederaHCSPlugin()]
    }
  });

  await agent.initialize();
  console.log('✅ Hedera Agent initialized');
}

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await handleOrchestratedMessage(message);
    res.json({ reply: response.message });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


initAgent().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
