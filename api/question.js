import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "id required" });

  try {
    if (req.method === "PUT") {
      const q = req.body;
      await sql`
        UPDATE questions SET
          text          = ${q.text},
          answer_a      = ${q.answerA},
          answer_b      = ${q.answerB},
          answer_c      = ${q.answerC},
          correct_answer= ${q.correctAnswer},
          category      = ${q.category},
          category2     = ${q.category2 ?? null},
          difficulty    = ${q.difficulty ?? null},
          starters      = ${q.starters ?? null},
          afvallers     = ${q.afvallers ?? null},
          dropout_pct   = ${q.dropoutPct ?? null},
          episode       = ${q.episode ?? null},
          notes         = ${q.notes ?? null}
        WHERE id = ${id}
      `;
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      await sql`DELETE FROM questions WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
