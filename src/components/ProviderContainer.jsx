import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import CategoryButton from "./CategoryButton";
import { AppContext } from "../AppContext";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect,
    onOpenProviders
}) => {
    const { contextData } = useContext(AppContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();
    const providers = categories.filter(cat => cat.code !== "home" && cat.code);

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) ||
            (hashCode === provider.code);
    };

    const handleToggleProviders = (e) => {
        e.preventDefault();
        setIsExpanded((previous) => !previous);
        if (onOpenProviders) onOpenProviders();
    };

    return (
        <div className="slots-main-desktop__provider-section mt-3">
            <div className="slots-layout-content-menu">
                {providers.map((provider, index) => (
                    <CategoryButton
                        key={provider.id ?? provider.code ?? index}
                        title={provider.name}
                        code={provider.code}
                        icon={provider.image_local ? contextData.cdnUrl + provider.image_local : null}
                        count={provider.element_count}
                        active={isSelected(provider)}
                        onClick={(e) => handleClick(e, provider)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProviderContainer;