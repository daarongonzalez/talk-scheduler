function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function validateTalk(body) {
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const date = typeof body?.date === "string" ? body.date.trim() : "";
  if (!name) throw new Error("Name is required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Date must be YYYY-MM-DD");
  return { name, date };
}

async function handleTalks(request, env, id) {
  if (request.method === "GET" && !id) {
    const { results } = await env.DB.prepare(
      "SELECT id, name, date FROM talks ORDER BY date DESC, id DESC"
    ).all();
    return json(results);
  }

  if (request.method === "POST" && !id) {
    const { name, date } = validateTalk(await request.json());
    const row = await env.DB.prepare(
      "INSERT INTO talks (name, date) VALUES (?, ?) RETURNING id, name, date"
    ).bind(name, date).first();
    return json(row, 201);
  }

  if (request.method === "PATCH" && id) {
    const { name, date } = validateTalk(await request.json());
    const row = await env.DB.prepare(
      "UPDATE talks SET name = ?, date = ?, updated_at = datetime('now') WHERE id = ? RETURNING id, name, date"
    ).bind(name, date, id).first();
    if (!row) return json({ error: "Not found" }, 404);
    return json(row);
  }

  if (request.method === "DELETE" && id) {
    const res = await env.DB.prepare("DELETE FROM talks WHERE id = ?").bind(id).run();
    if (res.meta.changes === 0) return json({ error: "Not found" }, 404);
    return new Response(null, { status: 204 });
  }

  return json({ error: "Not found" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/talks" || url.pathname.startsWith("/api/talks/")) {
      const id = url.pathname.split("/")[3] || null;
      try {
        return await handleTalks(request, env, id);
      } catch (err) {
        return json({ error: err.message || "Bad request" }, 400);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
