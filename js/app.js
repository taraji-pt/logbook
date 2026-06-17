window.appData = {
    tips: [],
    settings: {}
};

document.addEventListener('DOMContentLoaded', async () => {

    await loadSidebar();

    await loadData();

    if (
        window.location.pathname.endsWith('index.html') ||
        window.location.pathname === '/' ||
        window.location.pathname.endsWith('/logbook/')
    ) {

        initializeDashboard();

    }

});
