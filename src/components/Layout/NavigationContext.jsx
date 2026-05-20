import { createContext } from "react";

export const NavigationContext = createContext({
    selectedPage: "",
    setSelectedPage: () => { },
    getPage: () => { },
    isGameModalOpen: false,
    setIsGameModalOpen: () => { },
    supportWhatsApp: "",
    supportTelegram: "",
    supportEmail: "",
    supportParent: "",
});