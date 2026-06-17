async function loadSidebar() {

    const sidebarContainer = document.getElementById('sidebar-container');

    if (!sidebarContainer) {
        return;
    }

    try {

        const response = await fetch('components/sidebar.html');
        const html = await response.text();

        sidebarContainer.innerHTML = html;

        initializeSidebar();
        setActivePage();

    } catch (error) {

        console.error('Erro ao carregar sidebar:', error);

    }

}

function initializeSidebar() {

    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');

    if (!sidebar || !toggle || !mainContent) {
        return;
    }

    const isCollapsed =
        localStorage.getItem('sidebar-collapsed') === 'true';

    if (isCollapsed) {

        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');

    }

    toggle.addEventListener('click', () => {

        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');

        localStorage.setItem(
            'sidebar-collapsed',
            sidebar.classList.contains('collapsed')
        );

    });

}

function setActivePage() {

    const currentPage =
        window.location.pathname.split('/').pop() || 'index.html';

    const navItems =
        document.querySelectorAll('.nav-item');

    navItems.forEach(item => {

        const href = item.getAttribute('href');

        if (href === currentPage) {

            item.classList.add('active');

        }

    });

}
