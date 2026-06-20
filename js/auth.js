const PASSWORD =
    'lol';

const AUTH_VERSION =
    'v1';

function checkAuth() {

    const isAuthenticated =
        localStorage.getItem(
            'authenticated'
        );

    const authVersion =
        localStorage.getItem(
            'authVersion'
        );

    if (
        !isAuthenticated ||
        authVersion !==
            AUTH_VERSION
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

        localStorage.setItem(
            'authVersion',
            AUTH_VERSION
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

    localStorage.removeItem(
        'authVersion'
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
