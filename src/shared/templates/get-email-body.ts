/* istanbul ignore file */
import getEmailHeaderTemplate from './get-email-header.template';
import getEmailFooterTemplate from './get-email-footer.template';

const TITLE = 'Password reset';

export const resetTemplete = (firstName: string, url: string): string => `
${getEmailHeaderTemplate(TITLE)}
  <div class="container">
    <div class="box-container">
        <h1>Password reset</h1>
        <div>Hello ${firstName},<br><br>
        We received a request to reset the password on your snap account. <br>
        Click on the link below to complete the reset. <br><br>
        </div>
        <a style="color: white" class="btn btn-primary mt-5" href=${url} target="_blank">Reset password</a>
        <br>Can't see the button ? Use
        <a href=${url} class="text-primary" target="_blank">this link</a>
        <br><br>
        Thanks for helping us keep your account secure.<br><br>
        Learn more about us <a href="https://google.rw" class="text-primary" target="_blank">here</a>
    </div>
  </div>
  ${getEmailFooterTemplate()}
`;

export const confirmresetTemplete = (firstName: string): string => `
${getEmailHeaderTemplate('Successful Changed your password!')}
  <div class="container">
    <div class="box-container">
        <h1>Successful Changed your password!</h1>
        <div>Hello ${firstName},<br><br>
        We have successful reset your passwrod! <br><br>
        </div>
        Thanks for helping us keep your account secure.<br><br>
        Learn more about us <a href="https://google.rw" class="text-primary" target="_blank">here</a>
    </div>
  </div>
  ${getEmailFooterTemplate()}
`;

export const accountBlockedTemplate = (firstName: string): string => `
${getEmailHeaderTemplate('Account has been blocked :(')}
  <div class="container">
    <div class="box-container">
        <h1>Your account has been locked!</h1>
        <div>Hello ${firstName},<br><br>
        We've noticed some unusual activity on your account.</br></br>
        To help protect you from potential fraud or abuse of your account,
        we've temporarily locked your account. We know this is frustrating, but we can help you get back into your
        account with just a few steps.

        <h3>Reason of action:</h3>
        Multiple failed login attempts.</br></br>
        <h3>How to solve this issue:</h3>
            - Wait between one to two weeks for one of our agents to contact you<br>
            - Contact any of our admins who will be of support
        </div>
        <br><br>
        Learn more about us <a href="https://google.rw" class="text-primary" target="_blank">here</a>
    </div>
  </div>
  ${getEmailFooterTemplate()}
`;
