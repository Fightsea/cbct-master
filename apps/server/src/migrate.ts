import db from '@/db';

(async () => {
  try {
    await db.migrate.latest({ directory: __dirname + '/db/migrations' });
  } catch (e: any) {
    console.error(e.message);
  }
})();
