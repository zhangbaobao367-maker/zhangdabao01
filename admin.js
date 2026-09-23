const adminClient = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.publishableKey);
const loginCard = document.querySelector("#loginCard");
const dashboard = document.querySelector("#dashboard");
const signOut = document.querySelector("#signOut");

function showDashboard(session) {
  const loggedIn = Boolean(session);
  loginCard.classList.toggle("hidden", loggedIn);
  dashboard.classList.toggle("hidden", !loggedIn);
  signOut.classList.toggle("hidden", !loggedIn);
  if (loggedIn) loadDashboard();
}

async function loadDashboard() {
  const settings = await adminClient.from("site_settings").select("customer_service_url").eq("id", 1).maybeSingle();
  if (settings.data) document.querySelector("[name=customer_service_url]").value = settings.data.customer_service_url || "";
  const result = await adminClient.from("leads").select("name,email,phone,city,topic,created_at").order("created_at", { ascending: false }).limit(100);
  const list = document.querySelector("#leadsList");
  if (result.error) { list.innerHTML = `<p class="muted">加载失败：${result.error.message}</p>`; return; }
  list.innerHTML = result.data.length ? result.data.map((lead) => `<div class="lead-row"><span>${lead.name || "-"}</span><span>${lead.email || "-"}</span><span>${lead.phone || lead.city || "-"}</span><span>${new Date(lead.created_at).toLocaleString()}</span></div>`).join("") : "<p class=\"muted\">暂无提交资料。</p>";
}

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.target).entries());
  const { error } = await adminClient.auth.signInWithPassword(values);
  document.querySelector("#loginStatus").textContent = error ? `登录失败：${error.message}` : "";
});
document.querySelector("#settingsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const value = document.querySelector("[name=customer_service_url]").value;
  const { error } = await adminClient.from("site_settings").upsert({ id: 1, customer_service_url: value });
  document.querySelector("#settingsStatus").textContent = error ? `保存失败：${error.message}` : "已保存";
});
signOut.addEventListener("click", () => adminClient.auth.signOut());
adminClient.auth.onAuthStateChange((_event, session) => showDashboard(session));
adminClient.auth.getSession().then(({ data }) => showDashboard(data.session));
