function getQR(req, res) {
    try {
      if (global.WA_STATUS) {
        switch (global.WA_STATUS) {
          case "chatsAvailable":
          case "CONNECTED":
          case "qrReadSuccess":
            return res.status(200).send({ message: "already connected to chat" });
          default:
            break;
        }
      }
      if (!global.WA_QR) {
        return res.status(404).send({ error: "QR not found / not generated" });
      } else {
        const im = global.WA_QR.split(",")[1];
  
        const img = Buffer.from(im, "base64");
  
        res.writeHead(200, {
          "Content-Type": "image/png",
          "Content-Length": img.length,
        });
  
        res.end(img);
        return res.status(200).send(global.WA_QR);
      }
    } catch (e) {
      return res
        .status(400)
        .send({ status: "unable to start instance", error: e });
    }
  }
  
  async function getStatus(req, res) {
    try {
      let status = global.WA_STATUS
      if (global.WA_CLIENT) {
        status = await global.WA_CLIENT.getConnectionState()
        console.log("global.WA_CLIENT.getConnectionState()", await global.WA_CLIENT.getConnectionState())
      }
      return res.status(200).send({ status: status });
    } catch(e){
      return res.status(200).send({ status: 'error while getting status', error: e });
    }
  }
  
  async function sendFirstMessage(req, res) {
    try {
      console.log("first message requesetd")
      const { phone, merchant_name } = req.body;
      if (!phone || !merchant_name) {
        return res
          .status(404)
          .send({ error: "phone / merchant_name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
  
      const buttons = [
        {
          buttonText: {
            displayText: "Good 😃",
          },
        },
        {
          buttonText: {
            displayText: "Memorable 😍",
          },
        },
        {
          buttonText: {
            displayText: "Could be better 😞",
          },
        },
      ];
      let msg = `Thank you for visiting ${merchant_name}. How was your experience ?`;
      await global.WA_CLIENT.sendButtons(
        `${phone}@c.us`,
        msg,
        buttons,
        "please provide your feedback"
      )
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  async function sendSocialVoucherLink(req, res) {
    try {
      const { phone, merchant_name } = req.body;
      if (!phone || !merchant_name) {
        return res
          .status(404)
          .send({ error: "phone / merchant_name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      let msg = `As a token of gratitude✨, here’s a social voucher (Social voucher link) that you can use and even can share with your friends🧉 which can be redeemable on the next purchase. We hope to serve you soon at ${merchant_name} 🍽️`;
      await global.WA_CLIENT.sendText(`${phone}@c.us`, msg)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  async function sendDiscountVoucher(req, res) {
    try {
      const { phone, merchant_name } = req.body;
      if (!phone || !merchant_name) {
        return res
          .status(404)
          .send({ error: "phone / merchant_name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      let msg = `Please give us one more chance to make it right 🥺. As a token of apology, here’s a discount voucher (discount voucher🈹) for your next visit. We will make sure that we meet your expectations on your next visit to ${merchant_name}`;
      await global.WA_CLIENT.sendText(`${phone}@c.us`, msg)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  async function sendDineInToDelivery(req, res) {
    try {
      const { phone, merchant_name } = req.body;
      if (!phone || !merchant_name) {
        return res
          .status(404)
          .send({ error: "phone / merchant_name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      let msg = `We see that you have enjoyed our Pita bread on your visit to our restaurant ${merchant_name}😋. How about ordering from us directly🥡 for your next meal. We will deliver it to you with similar convenience of ordering from Zomato/swiggy. Ordering directly from us means a lot.`;
      await global.WA_CLIENT.sendText(`${phone}@c.us`, msg)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  async function sendDeliveryToDineIn(req, res) {
    try {
      const { phone, merchant_name } = req.body;
      if (!phone || !merchant_name) {
        return res
          .status(404)
          .send({ error: "phone / merchant_name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      let msg = `We see that you have ordered a delivery from us. How about visiting us and experiencing our dine-in. We can guarantee you that your experience would be memorable 🤝 and the food will be tastier😋. Please give us a chance and meet us soon🍽️. Thank you from ${merchant_name}`;
      await global.WA_CLIENT.sendText(`${phone}@c.us`, msg)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  async function sendTextMessage(req, res) {
    try {
      const { phone, message } = req.body;
      if (!phone || !message) {
        return res
          .status(404)
          .send({ error: "phone / message is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      await global.WA_CLIENT.sendText(`${phone}@c.us`, message)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  
  async function sendContactMessage(req, res) {
    try {
      const { phone, number, name } = req.body;
      if (!phone || !number || !name) {
        return res
          .status(404)
          .send({ error: "phone / number / name is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      await global.WA_CLIENT.sendContactVcard(`${phone}@c.us`, number, name)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  
  async function sendImageMessage(req, res) {
    try {
      const { phone, message, url_image } = req.body;

      console.log(url_image)
      if (!phone || !message || !url_image) {
        return res
          .status(404)
          .send({ error: "phone / message is missing " });
      }
      if (!global.WA_CLIENT) {
        return res.status(404).send({ error: "Client not found, please init" });
      }
      await global.WA_CLIENT.sendImage(`${phone}@c.us`, url_image,'unnamed.jpg',message)
        .then((result) => {
          return res.status(200).send({ result: result });
        })
        .catch((err) => {
          return res.status(400).send({ error: err });
        });
    } catch (e) {
      return res.status(400).send({ status: "unable to send message", error: e });
    }
  }
  
  module.exports = {
    getQR,
    getStatus,
    sendFirstMessage,
    sendSocialVoucherLink,
    sendDiscountVoucher,
    sendDineInToDelivery,
    sendDeliveryToDineIn,
    sendTextMessage,
    sendContactMessage,
    sendImageMessage,
  };
  