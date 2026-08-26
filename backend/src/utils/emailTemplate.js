export const baseEmailTemplate = ({
  title,
  bodyContent,
  buttonText,
  buttonUrl,
}) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:30px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <tr>
              <td style="background-color:#2563eb; padding:24px 32px;">
                <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">XTracker</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <h2 style="margin:0 0 16px 0; font-size:20px; color:#111827;">${title}</h2>
                <div style="font-size:15px; line-height:1.6; color:#374151;">
                  ${bodyContent}
                </div>

                ${
                  buttonText && buttonUrl
                    ? `
                <table cellpadding="0" cellspacing="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:6px; background-color:#2563eb;">
                      <a href="${buttonUrl}" target="_blank" style="display:inline-block; padding:12px 24px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600;">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
                `
                    : ""
                }
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px; background-color:#f9fafb; border-top:1px solid #e5e7eb;">
                <p style="margin:0; font-size:12px; color:#9ca3af;">
                  This is an automated message from XTracker. If you didn't expect this email, you can safely ignore it.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
