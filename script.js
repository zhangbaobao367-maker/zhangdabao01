// Replace this URL with the company's customer-service system after acceptance.
const CUSTOMER_SERVICE_URL = "https://example.com/customer-service";

const regions = [
  { name: "北美", en: "NORTH AMERICA", description: "连接成熟市场与专业人才" },
  { name: "拉丁美洲", en: "LATIN AMERICA", description: "发现充满活力的区域机会" },
  { name: "欧洲", en: "EUROPE", description: "探索多元文化与创新资源" },
  { name: "亚洲", en: "ASIA", description: "链接高速发展的核心市场" },
  { name: "东南亚", en: "SOUTHEAST ASIA", description: "进入增长中的新兴区域" },
  { name: "更多区域", en: "MORE REGIONS", description: "验收后可扩展新的分类" }
];

let currentRegion = 0;
let currentPage = 1;
const perPage = 16;

const peopleTrack = document.querySelector("#peopleTrack");
const regionOptions = document.querySelector("#regionOptions");
const libraryGrid = document.querySelector("#libraryGrid");
const pagination = document.querySelector("#pagination");
const libraryTitle = document.querySelector("#libraryTitle");
const libraryDescription = document.querySelector("#libraryDescription");

function placeholderImage(label) {
  return `<span>IMAGE PLACEHOLDER<br />${label}</span>`;
}

function renderPeople() {
  const cards = Array.from({ length: 8 }, (_, index) => `
    <article class="person-card open-form">
      <div class="person-image">${placeholderImage(`PERSON ${String(index + 1).padStart(2, "0")}`)}</div>
      <div class="person-info"><strong>人才姓名占位</strong><small>职位 / 专业领域待填入</small></div>
    </article>
  `);
  peopleTrack.innerHTML = cards.join("");
}

function renderRegions() {
  regionOptions.innerHTML = regions.map((region, index) => `
    <button class="region-card ${index === currentRegion ? "active" : ""}" data-region="${index}" type="button">
      <span class="number">0${index + 1}</span><strong>${region.name}</strong><small>${region.en}</small><span>↗</span>
    </button>
  `).join("");
  regionOptions.querySelectorAll(".region-card").forEach((card) => card.addEventListener("click", () => {
    currentRegion = Number(card.dataset.region);
    currentPage = 1;
    renderRegions();
    renderLibrary();
    document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
  }));
}

function renderLibrary() {
  const region = regions[currentRegion];
  const total = 100;
  const start = (currentPage - 1) * perPage;
  const count = Math.min(perPage, total - start);
  libraryTitle.textContent = `${region.name}资源库`;
  libraryDescription.textContent = `${region.description} · 共 ${total} 个展示位，当前第 ${currentPage} 页`;
  libraryGrid.innerHTML = Array.from({ length: count }, (_, index) => {
    const number = start + index + 1;
    return `<article class="library-card open-form"><div class="card-image">${placeholderImage(`${region.en} · ${String(number).padStart(3, "0")}`)}</div><h3>资源名称待填入</h3><p>这里填写个人或资源的自我介绍，支持 2–3 行简短说明。</p></article>`;
  }).join("");
  const pages = Math.ceil(total / perPage);
  pagination.innerHTML = Array.from({ length: pages }, (_, index) => `<button type="button" class="page-button ${index + 1 === currentPage ? "active" : ""}" data-page="${index + 1}">${index + 1}</button>`).join("");
  pagination.querySelectorAll(".page-button").forEach((button) => button.addEventListener("click", () => {
    currentPage = Number(button.dataset.page);
    renderLibrary();
    document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
  }));
}

function renderRunways() {
  const cards = Array.from({ length: 12 }, (_, index) => `<div class="runway-card">${placeholderImage(`PHOTO ${String(index + 1).padStart(2, "0")}`)}</div>`);
  document.querySelector("#runwayLeft").innerHTML = cards.join("") + cards.join("");
  document.querySelector("#runwayRight").innerHTML = cards.slice().reverse().join("") + cards.slice().reverse().join("");
}

const modal = document.querySelector("#formModal");
function openForm() { modal.hidden = false; document.body.style.overflow = "hidden"; setTimeout(() => modal.querySelector("input")?.focus(), 0); }
function closeForm() { modal.hidden = true; document.body.style.overflow = ""; }

document.addEventListener("click", (event) => {
  if (event.target.closest(".open-form")) openForm();
});
document.querySelector("#closeModal").addEventListener("click", closeForm);
modal.addEventListener("click", (event) => { if (event.target === modal) closeForm(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) closeForm(); });
document.querySelector("#leadForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#formStatus").textContent = "资料已记录（演示模式）。接入公司接口后即可发送到您的系统。";
  event.target.reset();
});
document.querySelector("#supportFab").addEventListener("click", () => window.open(CUSTOMER_SERVICE_URL, "_blank", "noopener,noreferrer"));
document.querySelector("#peoplePrev").addEventListener("click", () => { peopleTrack.scrollBy({ left: -300, behavior: "smooth" }); });
document.querySelector("#peopleNext").addEventListener("click", () => { peopleTrack.scrollBy({ left: 300, behavior: "smooth" }); });

renderPeople();
renderRegions();
renderRunways();
renderLibrary();
