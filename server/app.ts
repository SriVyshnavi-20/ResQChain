import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express, { type ErrorRequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config';
import { db } from './db';
import { HttpError } from './lib/errors';
import { announcementsRouter } from './routes/announcements';
import { assignmentsRouter } from './routes/assignments';
import { authRouter } from './routes/auth';
import { bootstrapRouter } from './routes/bootstrap';
import { govRouter } from './routes/gov';
import { inventoryRouter } from './routes/inventory';
import { meRouter } from './routes/me';
import { ngoRouter } from './routes/ngo';
import { publicRouter } from './routes/public';
import { reportsRouter } from './routes/reports';
import { requestsRouter } from './routes/requests';
import { sheltersRouter } from './routes/shelters';
import { sosRouter } from './routes/sos';
import { volunteerTasksRouter } from './routes/volunteerTasks';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  if (config.trustProxy) app.set('trust proxy', config.trustProxy);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"]
        }
      }
    })
  );
  if (config.corsOrigins.length) app.use(cors({ origin: config.corsOrigins, credentials: false }));
  app.use(express.json({ limit: '100kb' }));

  const limiter = (windowMin: number, max: number, message: string) =>
    rateLimit({
      windowMs: windowMin * 60_000,
      limit: max,
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      handler: (_req, res) => {
        res.status(429).json({ error: { message, code: 'RATE_LIMITED' } });
      }
    });

  const api = express.Router();
  api.use(limiter(15, 3000, 'Too many requests. Please slow down.'));
  api.use('/auth/login', limiter(15, 30, 'Too many login attempts. Try again in a few minutes.'));
  api.use('/auth/register', limiter(60, 30, 'Too many sign-up attempts. Try again later.'));
  api.use('/auth/forgot-password', limiter(60, 10, 'Too many reset requests. Try again later.'));
  api.use('/sos', limiter(10, 15, 'Too many SOS alerts from this connection. Call 112 for immediate help.'));

  api.get('/health', (_req, res) => {
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', time: new Date().toISOString() });
  });
  api.use('/public', publicRouter);
  api.use('/auth', authRouter);
  api.use('/bootstrap', bootstrapRouter);
  api.use('/me', meRouter);
  api.use('/requests', requestsRouter);
  api.use('/sos', sosRouter);
  api.use('/shelters', sheltersRouter);
  api.use('/announcements', announcementsRouter);
  api.use('/assignments', assignmentsRouter);
  api.use('/volunteer-tasks', volunteerTasksRouter);
  api.use('/inventory', inventoryRouter);
  api.use('/ngo', ngoRouter);
  api.use('/gov', govRouter);
  api.use('/reports', reportsRouter);
  api.use((_req, res) => {
    res.status(404).json({ error: { message: 'API route not found.', code: 'NOT_FOUND' } });
  });
  app.use('/api', api);

  // Serve the built SPA (single-port production deployment).
  if (config.serveStatic && fs.existsSync(path.join(config.distDir, 'index.html'))) {
    app.use(express.static(config.distDir, { index: false, maxAge: '1h' }));
    app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(config.distDir, 'index.html')));
  }

  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: { message: err.message, code: err.code, details: err.details } });
      return;
    }
    if (err?.type === 'entity.parse.failed') {
      res.status(400).json({ error: { message: 'Malformed JSON body.', code: 'BAD_REQUEST' } });
      return;
    }
    if (err?.type === 'entity.too.large') {
      res.status(413).json({ error: { message: 'Request body too large.', code: 'TOO_LARGE' } });
      return;
    }
    console.error('[server] Unhandled error:', err);
    res.status(500).json({ error: { message: 'Something went wrong on our side. Please try again.', code: 'INTERNAL' } });
  };
  app.use(onError);
  return app;
}
