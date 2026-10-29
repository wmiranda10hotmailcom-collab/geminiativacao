export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "1369810175235012";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Dispara um evento padrão ou customizado para o Meta Pixel (Facebook Ads).
 * Permite desduplicação opcional usando sessionStorage.
 */
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>,
  options?: { deduplicateKey?: string }
) {
  if (typeof window === "undefined") return;

  if (options?.deduplicateKey) {
    try {
      const alreadyTracked = sessionStorage.getItem(options.deduplicateKey);
      if (alreadyTracked) {
        console.log(`[Meta Pixel] Evento "${eventName}" já enviado nesta sessão.`);
        return;
      }
      sessionStorage.setItem(options.deduplicateKey, "1");
    } catch {
      // Ignore sessionStorage errors (e.g. private mode)
    }
  }

  if (typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
    console.log(`[Meta Pixel] Evento "${eventName}" disparado com sucesso:`, params);
  } else {
    console.warn(`[Meta Pixel] window.fbq ainda não está disponível.`);
  }
}
