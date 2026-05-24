/**
 * Hash-based client router for FLUX Chrome Extension.
 * Replaces SvelteKit's $app/state and $app/navigation.
 */

let currentPath = $state(parseHash(window.location.hash));

function parseHash(hash: string): string {
  const path = hash.replace(/^#/, "") || "/";
  return path.endsWith("/") ? path : path + "/";
}

function updateFromHash() {
  currentPath = parseHash(window.location.hash);
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", updateFromHash);
}

/**
 * Reactive page object — drop-in replacement for SvelteKit's `page` from `$app/state`.
 * Components can read `page.url.pathname` reactively.
 */
export const page = {
  get url() {
    return new URL(`http://localhost${currentPath}`);
  },
};

/**
 * Navigate to a path. Drop-in replacement for SvelteKit's `goto()`.
 * @example goto("/convert")
 */
export function goto(path: string) {
  const normalized = path.endsWith("/") ? path : path + "/";
  window.location.hash = normalized;
}
