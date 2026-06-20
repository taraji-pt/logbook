const PASSWORD =
    'Teresinha2025*';

function checkAuth() {

    const isAuthenticated =
        localStorage.getItem(
            'authenticated'
        );

    if (
        !isAuthenticated
    ) {

        window.location.href =
            'login.html';

    }

}

function login() {

    const password =
        document.getElementById(
            'passwordInput'
        ).value;

    const errorElement =
        document.getElementById(
            'loginError'
        );

    if (
        password ===
        PASSWORD
    ) {

        localStorage.setItem(
            'authenticated',
            'true'
        );

        errorElement.textContent =
            '';

        window.location.href =
            'index.html';

        return;

    }

    errorElement.textContent =
        'Invalid password';

}

function logout() {

    localStorage.removeItem(
        'authenticated'
    );

    window.location.href =
        'login.html';

}

function togglePassword() {

    const input =
        document.getElementById(
            'passwordInput'
        );

    input.type =
        input.type ===
        'password'
            ? 'text'
            : 'password';

}
