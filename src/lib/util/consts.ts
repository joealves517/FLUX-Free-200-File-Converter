const PUB_DISABLE_ALL_EXTERNAL_REQUESTS = "false";
const PUB_ENV = "production";

export const GITHUB_URL_FLUX = "https://github.com/joealves517/FLUX-Free-200-File-Converter";
export const __GITHUB_URL_FLUXD__ = "https://github.com/vert-sh/vertd";
export const GITHUB_API_URL = "https://api.github.com/repos/joealves517/FLUX-Free-200-File-Converter";
export const DISCORD_URL = "https://discord.gg/kqevGxYPak";
export const FLUX_NAME =
	PUB_ENV === "development"
		? "FLUX Local"
		: PUB_ENV === "nightly"
			? "FLUX Nightly"
			: "FLUX.sh";
export const CONTACT_EMAIL = "hello@flux.sh";

// i'm not entirely sure this should be in consts.ts, but it is technically a constant as .env is static for FLUX
export const DISABLE_ALL_EXTERNAL_REQUESTS =
	PUB_DISABLE_ALL_EXTERNAL_REQUESTS === "true";

export const GB = 1024 * 1024 * 1024;
