import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import {
  HederaConversationalAgent,
  ServerSigner,
  HederaAccountPlugin,
  HederaHCSPlugin
} from 'hedera-agent-kit';

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

app.post('/chat', async (req: any, res: any) => {
  const { message, chatHistory = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const response = await agent.processMessage(message, chatHistory);
    console.log('Agent full response:', JSON.stringify(response, null, 2));

    res.json({ reply: response.message }); // usa o message aqui
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({ error: 'Internal agent error' });
  }
});



initAgent().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

