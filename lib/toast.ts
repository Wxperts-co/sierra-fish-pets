export function showErrorToast(message: string) {
  if (typeof window === "undefined") return;

  const id = "app-toast-root";
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement("div");
    container.id = id;
    container.style.position = "fixed";
    container.style.top = "1rem";
    container.style.right = "1rem";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const el = document.createElement("div");
  el.textContent = message;
  el.style.background = "#1f2937";
  el.style.color = "white";
  el.style.padding = "0.5rem 0.75rem";
  el.style.borderRadius = "0.5rem";
  el.style.boxShadow = "0 6px 18px rgba(15,23,42,0.25)";
  el.style.marginTop = "0.5rem";
  el.style.fontSize = "0.9rem";

  container.appendChild(el);

  setTimeout(() => {
    el.style.transition = "opacity 300ms";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

export default showErrorToast;
