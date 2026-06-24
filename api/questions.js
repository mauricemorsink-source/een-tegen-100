import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method === "GET") {
      const rows = await sql`
        SELECT * FROM questions ORDER BY date_added DESC
      `;
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const q = req.body;
      await sql`
        INSERT INTO questions
          (id, text, answer_a, answer_b, answer_c, correct_answer,
           category, category2, class_type, difficulty,
           starters, afvallers, dropout_pct, episode, notes, date_added)
        VALUES
          (${q.id}, ${q.text}, ${q.answerA}, ${q.answerB}, ${q.answerC},
           ${q.correctAnswer}, ${q.category}, ${q.category2 ?? null},
           ${q.classType}, ${q.difficulty ?? null},
           ${q.starters ?? null}, ${q.afvallers ?? null}, ${q.dropoutPct ?? null},
           ${q.episode ?? null}, ${q.notes ?? null},
           ${q.dateAdded ?? new Date().toISOString()})
        ON CONFLICT (id) DO UPDATE SET
          text          = EXCLUDED.text,
          answer_a      = EXCLUDED.answer_a,
          answer_b      = EXCLUDED.answer_b,
          answer_c      = EXCLUDED.answer_c,
          correct_answer= EXCLUDED.correct_answer,
          category      = EXCLUDED.category,
          category2     = EXCLUDED.category2,
          class_type    = EXCLUDED.class_type,
          difficulty    = EXCLUDED.difficulty,
          starters      = EXCLUDED.starters,
          afvallers     = EXCLUDED.afvallers,
          dropout_pct   = EXCLUDED.dropout_pct,
          episode       = EXCLUDED.episode,
          notes         = EXCLUDED.notes
      `;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
