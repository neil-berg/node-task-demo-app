const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
  sgMail.send({
    to: {
      name,
      email
    },
    from: {
      name: 'Neil Berg',
      email: 'neil@neilberg.dev'
    },
    subject: '🍷 Welcome to Cork!',
    // text: `Welcome to Cork, ${name}! How do you like it?`,
    html: `
      <h2>Welcome to Cork, ${name}!</h2>
      <p>How do you like the service?</p>
      <p>Does styling work?</p>
    `
  });
};

const sendCancellationEmail = (name, email) => {
  sgMail.send({
    to: {
      name,
      email
    },
    from: {
      name: 'Neil Berg',
      email: 'neil@neilberg.dev'
    },
    subject: 'Cork Account Cancellation',
    html: `
      <h2>${name}, we're sad to see you leave Cork!</h2>
      <p>Would you let us know why you are leaving?</p>
      <p>If you have any questions or comments, please email me at <a href="mailto:neil@neilberg.dev">neil@neilberg.dev</a></p>
    `
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
