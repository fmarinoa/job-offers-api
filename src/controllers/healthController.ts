import { FastifyReply, FastifyRequest } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

import { getEnv } from '../helpers/envs';

const { version, name } = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));

export const landingInfo = async (
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<never> => {
  return reply.code(200).type('text/html').send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${name}</title>
        <style>
          body { 
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: #111; 
            color: #eee; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100dvh; 
          }
          .card {
            background: #222; 
            padding: 2rem; 
            border-radius: 12px; 
            text-align: center; 
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            box-sizing: border-box;
          }
          a {
            color: #4da3ff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
        <body>
          <div class="card">
            <h1>✅ ${name} is running</h1>
            <p>Welcome to ${name} service</p>
            <p>Version: ${version}</p>
            <p>By: <a href="https://github.com/fmarinoa" target="_blank">fmarinoa</a></p>
          </div>
        </body>
      </html>
    `);
};

export const status = async (_request: FastifyRequest, reply: FastifyReply): Promise<never> => {
  const uptime = process.uptime().toFixed(0);
  const env = getEnv();

  return reply.code(200).send({
    status: '👍',
    service: name,
    version,
    uptime: `${uptime}s`,
    env,
    timestamp: new Date().toISOString(),
  });
};
