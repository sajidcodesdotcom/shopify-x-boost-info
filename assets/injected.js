(function () {
    if (window.Shopify) {
        let boostVersions = {};
        let widgetIntegrationGeneralSettings = {};
        for (let key in window) {
            if (key.includes("bcsf")) {
                boostVersions.V1 = "V1";
            }
            if (key.includes("BoostPFS")) {
                boostVersions.V2 = "V2";
            }
            if (key.includes("boostSDAppConfig") && key.includes("boostSD")) {
                boostVersions.V3 = "V3";
            }
            if (
                key.includes("boostWidgetIntegration") &&
                window.boostWidgetIntegration != "undefined"
            ) {
                boostVersions.turbo = "Turbo";
                widgetIntegrationGeneralSettings =
                    boostWidgetIntegration.generalSettings;
            }
        }
        const shopifyObject = JSON.stringify(window.Shopify);
        boostVersions = JSON.stringify(boostVersions);
        widgetIntegrationGeneralSettings = JSON.stringify(
            widgetIntegrationGeneralSettings
        );
        window.postMessage({
            type: "from_page",
            shopifyObject,
            boostVersions,
            widgetIntegrationGeneralSettings,
        });
    }
})();
