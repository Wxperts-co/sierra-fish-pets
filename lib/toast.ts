function getToastContainer(): HTMLElement {
  const id = "app-toast-root";
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement("div");
    container.id = id;
    container.style.position = "fixed";
    container.style.top = "1.25rem";
    container.style.right = "1.25rem";
    container.style.zIndex = "999999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "0.625rem";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);
  }
  return container;
}

export function showErrorToast(message: string) {
  if (typeof window === "undefined") return;

  const container = getToastContainer();

  const el = document.createElement("div");
  el.style.pointerEvents = "auto";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.gap = "0.75rem";
  el.style.background = "#fff1f2"; // red-50
  el.style.border = "1.5px solid #fecdd3"; // red-200
  el.style.color = "#9f1239"; // red-800
  el.style.padding = "0.75rem 1.125rem";
  el.style.borderRadius = "0.875rem";
  el.style.boxShadow = "0 10px 25px -5px rgba(225, 29, 72, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
  el.style.fontSize = "0.875rem";
  el.style.fontWeight = "600";
  el.style.lineHeight = "1.4";
  el.style.maxWidth = "24rem";
  el.style.transform = "translateX(120%)";
  el.style.opacity = "0";
  el.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease";

  // Icon
  const icon = document.createElement("span");
  icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.flexShrink = "0";

  const textNode = document.createElement("span");
  textNode.textContent = message;

  el.appendChild(icon);
  el.appendChild(textNode);
  container.appendChild(el);

  // Trigger animation
  requestAnimationFrame(() => {
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
  });

  setTimeout(() => {
    el.style.transform = "translateX(120%)";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 350);
  }, 4000);
}

export function showSuccessToast(message: string) {
  if (typeof window === "undefined") return;

  const container = getToastContainer();

  const el = document.createElement("div");
  el.style.pointerEvents = "auto";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.gap = "0.75rem";
  el.style.background = "#ecfdf5"; // emerald-50
  el.style.border = "1.5px solid #a7f3d0"; // emerald-200
  el.style.color = "#065f46"; // emerald-800
  el.style.padding = "0.75rem 1.125rem";
  el.style.borderRadius = "0.875rem";
  el.style.boxShadow = "0 10px 25px -5px rgba(16, 185, 129, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
  el.style.fontSize = "0.875rem";
  el.style.fontWeight = "600";
  el.style.lineHeight = "1.4";
  el.style.maxWidth = "24rem";
  el.style.transform = "translateX(120%)";
  el.style.opacity = "0";
  el.style.transition = "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease";

  // Icon
  const icon = document.createElement("span");
  icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  icon.style.display = "flex";
  icon.style.alignItems = "center";
  icon.style.flexShrink = "0";

  const textNode = document.createElement("span");
  textNode.textContent = message;

  el.appendChild(icon);
  el.appendChild(textNode);
  container.appendChild(el);

  // Trigger animation
  requestAnimationFrame(() => {
    el.style.transform = "translateX(0)";
    el.style.opacity = "1";
  });

  setTimeout(() => {
    el.style.transform = "translateX(120%)";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 350);
  }, 4000);
}

export default showErrorToast;
