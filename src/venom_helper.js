const venom = require("venom-bot");
const fs = require("fs");

function handleRatingsResponse(message) {
  const { quotedMsg, from, content } = message;
  const { footer, caption } = quotedMsg;
  if (footer === "please provide your feedback") {
    let merchant_name = caption.replace("Thank you for visiting ", "");
    merchant_name = merchant_name.replace(". How was your experience ?", "");
    let msg = "";
    if (merchant_name) {
      switch (content) {
        case "Good 😃":
        case "Memorable 😍":
          msg = `Thank you so much🙏. Can you write a review about us(${merchant_name}) on Google maps. Would be really helpful for new guests. It can be short one as well. Your review means a lot. You can write it here : https://bit.ly/3Cuir6y`;
          break;
        default:
          msg = `We’re really sorry for not meeting your expectations🙇🏻. Please tell us more about your experience at ${merchant_name}. It would help us to serve you better next time and rectify what went wrong this time.`;
          break;
      }

      if (msg && global.WA_CLIENT) {
        global.WA_CLIENT.sendText(from, msg)
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
    }
  }
}

function handleResponse(message) {
  const { type } = message;
  switch (type) {
    case "buttons_response":
      handleRatingsResponse(message);
      break;
    default:
      break;
  }
}

async function initVenom(sessionName) {
  if (global.WA_CLIENT) {
    await global.WA_CLIENT.logout();
    await fs.rmdirSync("tokens", {
      recursive: true
    });
  }

  global.WA_CLIENT = null;
  global.WA_QR = null;
  global.WA_STATUS = null;

  await venom
    .create(
      sessionName,
      (base64Qrimg) => {
        global.WA_QR = base64Qrimg;
      },
      (statusSession, session) => {
        global.WA_STATUS = statusSession;
        //Create session wss return "serverClose" case server for close
        console.log("Session name: ", session);
      },
      {
        logQR: false,
        autoClose: 0,
        statusFind: (a) => console.log("status", a)
      }
    )
    .then((cli) => {
      global.WA_CLIENT = cli;
      cli.onMessage((message) => {
        handleResponse(message);
      });
      // start(client);
    })
    .catch((erro) => {
      console.log(erro);
    });
}

module.exports = { initVenom };
