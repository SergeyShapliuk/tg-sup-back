// api/bot/route.ts


// Для Vercel Serverless (Next.js App Router)
import { handler } from '../../src/bot';

export { handler as GET, handler as POST };

// Или для Pages Router:
// export default handler;
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
