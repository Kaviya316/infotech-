document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    sidebarToggle.addEventListener('click', () => {
        if (sidebar.style.transform === 'translateX(0%)') {
            sidebar.style.transform = 'translateX(100%)';
        } else {
            sidebar.style.transform = 'translateX(0%)';
        }
    });
});
