const forgotPassword = () => {
  const newResetUrl = 'https://lock-manager-v1.web.app/app/locks'; 
  const backgroundColor = '#848585'
  const message = `
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: ${backgroundColor}" leftmargin="0">
<!--100% body table-->
<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="${backgroundColor}" style="
      @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
      font-family: 'Open Sans', sans-serif;
    ">
  <tr>
    <td>
      <table style="background-color: 
${backgroundColor}; max-width: 670px; margin: 0 auto" width="100%" border="0"
        align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td style="height: 80px">&nbsp;</td>
        </tr>

        <tr>
          <td>
            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="
                  max-width: 670px;
                  background: #fff;
                  border-radius: 3px;
                  text-align: center;
                  -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                ">
                <tr>
          <td 
          style="text-align: left; 
            background-color: #6F6F6E; 
              color: #FFFFFF;
              padding-left:35px">
            <h2>Note App</h2>
          </td>
        </tr>
              <tr>
                <td style="height: 40px">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding: 0 35px">
                  <h1 style="
                        color: #1e1e2d;
                        font-weight: 600;
                        margin: 0;
                        font-size: 32px;
                        font-family: 'Rubik', sans-serif;
                      ">
                    Password Reset
                  </h1>
        <br style="margin-top: 10px" />
                  <p style="
                        color: #202124;
                        font-size: 15px;
                        line-height: 24px;
                        margin: 0;
                        text-align: left;
                      ">
                    We received a request to change your password. Click the button below to set your new password.
                  </p>


                  <a href=${newResetUrl} style="
                        background: #2F9AFF;
                        text-decoration: none !important;
                        font-weight: 500;
                        letter-spacing: 1.5px;
                        margin: 15px 0px;
                        color: #fff;
                        font-size: 15px;
                        padding: 10px 24px;
                        display: inline-block;
                        border-radius: 2px;
                      ">Reset Password</a>
                  <br />
                  <p style="
                    color: #202124;
                    font-size: 15px;
                    line-height: 24px;
                    margin: 0;
                    text-align: left;
                  ">
                  If you did not want to change your password, you can safely ignore this email.
                </p>
                </td>
              </tr>
              <tr>
                <td style="height: 40px">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="height: 20px">&nbsp;</td>
        </tr>
        <tr>
          <td style="text-align: center">
            <p style="
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: 18px;
                  margin: 0 0 0;
                ">
              &copy; 2022 Note app. All rights reserved. 
            </p>
          </td>
        </tr>
        <tr>
          <td style="height: 80px">&nbsp;</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
    `;
  return message;
}

const registrationReceipt = () => {
  const backgroundColor = '#848585'
  const message = `
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: ${backgroundColor}" leftmargin="0">
  <!--100% body table-->
  <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="${backgroundColor}" style="
        @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
        font-family: 'Open Sans', sans-serif;
      ">
    <tr>
      <td>
        <table style="background-color: 
${backgroundColor}; max-width: 670px; margin: 0 auto" width="100%" border="0"
          align="center" cellpadding="0" cellspacing="0">
          <tr>
            <td style="height: 80px">&nbsp;</td>
          </tr>

          <tr>
            <td>
              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="
                    max-width: 670px;
                    background: #fff;
                    border-radius: 3px;
                    text-align: center;
                    -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                  ">
                  <tr>
            <td 
            style="text-align: left; 
            	background-color: #6F6F6E; 
                color: #FFFFFF;
                padding-left:35px">
              <h2>Note App</h2>
            </td>
          </tr>
                <tr>
                  <td style="height: 40px">&nbsp;</td>
                </tr>
                <tr>
                  <td style="padding: 0 35px">
                    <h1 style="
                          color: #1e1e2d;
                          font-weight: 600;
                          margin: 0;
                          font-size: 32px;
                          font-family: 'Rubik', sans-serif;
                        ">
                      Congratulation
                    </h1>
					<br style="margin-top: 10px" />
                    <p style="
                          color: #202124;
                          font-size: 15px;
                          line-height: 24px;
                          margin: 0;
                          text-align: left;
                        ">
                      You have successfully created an account. You can now use the app to the fullest. Thank you for being part of the community.
                    </p>


                  <br style="margin-top: 10px" />
                  </td>
                </tr>
                <tr>
                  <td style="height: 40px">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="height: 20px">&nbsp;</td>
          </tr>
          <tr>
            <td style="text-align: center">
              <p style="
                    font-size: 14px;
                    color: #FFFFFF;
                    line-height: 18px;
                    margin: 0 0 0;
                  ">
                &copy; 2022 Note app. All rights reserved. 
              </p>
            </td>
          </tr>
          <tr>
            <td style="height: 80px">&nbsp;</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
    `;
  return message;
}

module.exports = { forgotPassword, registrationReceipt };