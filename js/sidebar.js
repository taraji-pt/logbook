document.addEventListener(
    "DOMContentLoaded",
    () => {

        const sidebar =
            document.querySelector(
                ".sidebar"
            );

        const toggleButton =
            document.getElementById(
                "toggleSidebar"
            );

        // Aplicar estado guardado

        const collapsed =
            localStorage.getItem(
                "sidebarCollapsed"
            );

        if(
            collapsed === "true"
        ){
            sidebar.classList.add(
                "collapsed"
            );
        }

        // Botão toggle

        if(toggleButton){

            toggleButton.addEventListener(
                "click",
                () => {

                    sidebar.classList.toggle(
                        "collapsed"
                    );

                    localStorage.setItem(
                        "sidebarCollapsed",
                        sidebar.classList.contains(
                            "collapsed"
                        )
                    );

                }
            );

        }

    }
);