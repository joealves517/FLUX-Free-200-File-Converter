import { m } from "$lib/paraglide/messages";
import { setLocale } from "$lib/paraglide/runtime";

export default defineBackground(() => {
  if (typeof chrome !== 'undefined' && chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((err) => {
      console.error("Failed to set side panel behavior:", err);
    });
  }

  if (typeof chrome !== 'undefined' && chrome.contextMenus) {
    chrome.runtime.onInstalled.addListener(() => {
      let lang = chrome.i18n.getUILanguage().split('-')[0];
      // handle specific zh locales if needed, but basic lang should be fine for setLocale
      setLocale(chrome.i18n.getUILanguage() === 'zh-CN' ? 'zh-Hans' : (chrome.i18n.getUILanguage() === 'zh-TW' ? 'zh-Hant' : lang) as any);
      
      chrome.contextMenus.create({
        id: "convert-with-flux",
        title: (m as any)["context_menu.convert_with_flux"] ? (m as any)["context_menu.convert_with_flux"]() : "Convert with FLUX",
        contexts: ["image", "video", "audio", "link"]
      });
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "convert-with-flux") {
        const url = info.srcUrl || info.linkUrl;
        if (url) {
          // Save to storage so the panel can pick it up
          chrome.storage.local.get("queuedUrls", (data) => {
            const queuedUrls = data.queuedUrls || [];
            queuedUrls.push(url);
            chrome.storage.local.set({ queuedUrls });
          });

          // Open the side panel for this window
          if (tab?.windowId && chrome.sidePanel && chrome.sidePanel.open) {
            chrome.sidePanel.open({ windowId: tab.windowId });
          }
        }
      }
    });
  }
});
