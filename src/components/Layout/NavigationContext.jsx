import { createContext } from "react";

export const NavigationContext = createContext({
    selectedPage: "",
    setSelectedPage: () => { },
    getPage: () => { },
    isGameModalOpen: false,
    setIsGameModalOpen: () => { },
    isHeaderGameModalOpen: false,
    openHeaderGameModal: () => { },
    closeHeaderGameModal: () => { },
    supportWhatsApp: "",
    supportTelegram: "",
    supportEmail: "",
    supportParent: "",
});
