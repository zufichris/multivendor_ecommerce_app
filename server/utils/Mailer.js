import nodemailer from "nodemailer";
const verifymail = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "iqtechmarket@gmail.com",
      pass: "umuofhicbcwizxyn",
    },
  });
  await transporter
    .sendMail({
      from: "iqtechmarket@gmail.com",
      to: email,
      subject: "verify your account",
      html: `<a style='background:red,padding:4px,font-weight:600' href=${link}>click to verify your account</a>`,
    })
    .catch((err) => {
      return;
    });
};

export default verifymail;
