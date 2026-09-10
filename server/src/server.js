import app from './app.js';
import { connectDatabase } from './config/database.js';
import { validateEnvironment } from './config/environment.js';

validateEnvironment();

const port = Number(process.env.PORT || 5000);

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`SkillConnect API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB', error);
    process.exit(1);
  });
