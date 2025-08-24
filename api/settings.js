import prisma from './_db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const row = await prisma.setting.findUnique({ where: { key: 'app_settings' } });
      return res.status(200).json({ ok: true, data: row ? row.value : null });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const saved = await prisma.setting.upsert({
        where: { key: 'app_settings' },
        update: { value: body },
        create: { key: 'app_settings', value: body },
      });
      return res.status(200).json({ ok: true, data: saved.value });
    }
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
}
