import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

type Agent = {
  id: string;
  tasks: string[];
  datatype: string;
  subtype: string;
  nft_required: boolean;
  storage: string;
};

function classifyMessage(message: string): Promise<{ task: string }> {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['classificator/classify.py', message]);

    let data = '';
    py.stdout.on('data', chunk => (data += chunk));
    py.stderr.on('data', err => console.error('Python error:', err.toString()));

    py.on('close', code => {
      if (code !== 0) return reject(new Error('Classifier failed'));
      try {
        const result = JSON.parse(data);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export async function handleOrchestratedMessage(message: string) {
  // 1. Classifica a task
  const { task } = await classifyMessage(message);
  console.log('🔎 Task classificada:', task);

  // 2. Lê os agentes
  const agentsPath = path.join(__dirname, 'agents.json');
  const agentsData = fs.readFileSync(agentsPath, 'utf-8');
  const agents: Agent[] = JSON.parse(agentsData);

  // 3. Busca agente com task igual (case insensitive)
  const normalizedTask = task.trim().toLowerCase();

  const matchingAgent = agents.find(agent => 
    agent.tasks.some(t => t.trim().toLowerCase() === normalizedTask)
  );

  // 4. Monta resposta
  if (matchingAgent) {
    return {
      message: `Para essa tarefa "${task}", recomendo o agente "${matchingAgent.id}" que é especializado em "${matchingAgent.tasks.join(', ')}".`
    };
  } else {
    return {
      message: `Tarefa "${task}" classificada, mas nenhum agente especializado está disponível para essa tarefa.`
    };
  }
}
