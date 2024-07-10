const express = require("express");
const fs = require("fs");
var cors = require("cors");
const {
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
  getAllChat,
  sendImageToGroup,
} = require("./controller");
const { initVenom } = require("./venom_helper");
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ serverStatus: "running fine" });
});

app.get("/reset", async (req, res) => {
  try {
    if (global.WA_CLIENT) {
      await global.WA_CLIENT.logout();
      await global.WA_CLIENT.close();
      global.WA_CLIENT = null;
      global.WA_QR = null;
      global.WA_STATUS = null;
    }
    await fs.rmdirSync("tokens", {
      recursive: true
    });
    return res.status(200).send({ status: "reset successful" });
  } catch (e) {
    return res
      .status(400)
      .send({ status: "unable to reset instance", error: e });
  }
});
initVenom("sandi_kargo");


app.get("/init", (req, res) => {
  try {
    initVenom("sandi_kargo");
    return res
      .status(200)
      .send({ status: "Starting instance, get qr after 10 sec" });
  } catch (e) {
    return res
      .status(400)
      .send({ status: "unable to start instance", error: e });
  }
});

app.get("/get-qr", getQR);
app.get("/status", getStatus);
app.post("/send-first-message", sendFirstMessage);
app.post("/send-social-voucher", sendSocialVoucherLink);
app.post("/send-discount-voucher", sendDiscountVoucher);
app.post("/send-dine-in-to-delivery", sendDineInToDelivery);
app.post("/send-delivery-to-dine-in", sendDeliveryToDineIn);

//misc
app.post("/send-text", sendTextMessage);
app.post("/send-contact", sendContactMessage);
app.post("/send-image", sendImageMessage);


app.get("/getAllChat ", getAllChat);


app.post("/send-image-group", sendImageToGroup);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
