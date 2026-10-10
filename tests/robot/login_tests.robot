*** Settings ***
Documentation    Beginner-friendly login tests for NutriSnap.
Library          SeleniumLibrary
Library          OperatingSystem
Test Setup       Open Login Page
Test Teardown    Close Browser

*** Variables ***
${LOGIN_URL}       http://localhost:5173/login
${MAIN_PAGE_URL}   http://localhost:5173/main-page
${USERNAME_INPUT}  css=input[placeholder="Username"]
${PASSWORD_INPUT}  css=input[placeholder="Password"]
${LOGIN_BUTTON}    xpath=//button[@type="submit" and normalize-space(.)="Login"]
${ERROR_MESSAGE}   css=form p[style*="color: red"]

*** Test Cases ***
Login Page Loads Successfully
    Wait Until Page Contains    Welcome Back
    Location Should Be    ${LOGIN_URL}

Username And Password Fields Are Visible
    Element Should Be Visible    ${USERNAME_INPUT}
    Element Should Be Visible    ${PASSWORD_INPUT}

Empty Login Is Rejected
    Click Button    ${LOGIN_BUTTON}
    Page Should Contain    Welcome Back
    Location Should Be    ${LOGIN_URL}

Invalid Username Or Password Is Rejected
    Input Text        ${USERNAME_INPUT}    invalid-${TEST_USERNAME}
    Input Password    ${PASSWORD_INPUT}    invalid-${TEST_USERNAME}
    Click Button      ${LOGIN_BUTTON}
    Wait Until Element Is Visible    ${ERROR_MESSAGE}
    Page Should Contain Element    ${ERROR_MESSAGE}
    Location Should Be    ${LOGIN_URL}

Valid Credentials Successfully Log In
    ${password}=    Get Environment Variable    NUTRISNAP_TEST_PASSWORD    ${EMPTY}
    Skip If    '${password}' == ''    Set NUTRISNAP_TEST_PASSWORD before running this test.
    Input Text        ${USERNAME_INPUT}    ${TEST_USERNAME}
    Input Password    ${PASSWORD_INPUT}    ${password}
    Click Button      ${LOGIN_BUTTON}
    Wait Until Location Is    ${MAIN_PAGE_URL}    15 seconds
    Page Should Contain    Username:

*** Keywords ***
Open Login Page
    ${username}=    Get Environment Variable    NUTRISNAP_TEST_USERNAME    mac
    Set Suite Variable    ${TEST_USERNAME}    ${username}
    Open Browser    ${LOGIN_URL}    chrome
    Wait Until Page Contains    Welcome Back
