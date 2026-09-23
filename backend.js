const publicSupabase = window.supabase?.createClient(
  window.SUPABASE_CONFIG.url,
  window.SUPABASE_CONFIG.publishableKey
);

document.querySelector("#leadForm")?.addEventListener("submit", async (event) => {
  if (!publicSupabase) return;
  const status = document.querySelector("#formStatus");
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  const { error } = await publicSupabase.from("leads").insert(values);
  if (error) {
    console.error("Lead submission failed:", error);
    status.textContent = "提交失败，请稍后重试或直接联系客服。";
  }
});
