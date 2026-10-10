# NutriSnap login tests

This folder contains five beginner-friendly Robot Framework tests for the
NutriSnap login page. The tests use SeleniumLibrary and Chrome and do not
modify the React application.

The locators match the current React component:

- Username: `input[placeholder="Username"]`
- Password: `input[placeholder="Password"]`
- Login button: the submit button containing `Login`
- Login error: the red paragraph inside the form
- Successful redirect: `/main-page`

## Windows CMD setup

Run these commands from the repository root:

```cmd
py -m venv tests\robot\.venv
tests\robot\.venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r tests\robot\requirements.txt
```

Make sure Google Chrome is installed. Selenium Manager will find or download
the matching ChromeDriver when the tests start.

Start the frontend in another CMD window:

```cmd
npm run dev
```

Set the password for the valid-login test. The password is never stored in the
test files:

```cmd
set NUTRISNAP_TEST_PASSWORD=your-test-password
```

The username defaults to `mac`. To override it:

```cmd
set NUTRISNAP_TEST_USERNAME=mac
```

Run the five tests:

```cmd
robot -d tests\robot tests\robot\login_tests.robot
```

Open the generated Robot Framework report and log:

```cmd
start tests\robot\report.html
start tests\robot\log.html
```

The frontend must be configured with its normal `VITE_BE_URL` so invalid and
valid credential tests can reach the authentication API. If the frontend or
backend is not running, the affected tests will fail because the application
cannot be exercised.
