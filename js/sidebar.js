document.addEventListener("DOMContentLoaded", () => {

    const sidebar =
        document.querySelector(".sidebar");

    const button =
        document.getElementById("toggleSidebar");

    if(localStorage.getItem("sidebarCollapsed") === "true"){

        document.body.classList.add(
            "sidebar-collapsed"
        );

    }

    if(button){

        button.addEventListener("click", () => {

            document.body.classList.toggle(
                "sidebar-collapsed"
            );

            localStorage.setItem(
                "sidebarCollapsed",
                document.body.classList.contains(
                    "sidebar-collapsed"
                )
            );

        });

    }

});
