// import request from "supertest";
// import { StatusCodes } from "../../../global/enums";
// import { PasswordManager } from "../../../config/auth/passwordManager";
// import app from "../../..";

// describe("Authentication", () => {
//   describe("hash password", () => {
//     it("Should hash a password correctly", async () => {
//       const password = "123456";
//       const hashedPassword = await new PasswordManager(password).hashPassWord();
//       expect(hashedPassword).not.toBe(password);
//     });
//     it("Should Handle empty strings", async () => {
//       const password = "";
//       const hashedPassword = await new PasswordManager(password).hashPassWord();
//       expect(hashedPassword).toEqual(password);
//     });
//     it("Should handle undefined,null passwords", async () => {
//       const password = null;
//       const hashedPassword = await new PasswordManager(password).hashPassWord();
//       expect(hashedPassword).toBeNull();
//     });
//   });
//   describe("Authentication Middleware", () => {
//     it("Should Allow Access To Public Route /api/v1", async () => {
//       const response = await request(app).get("/api/v1/");
//       expect(response.status).toBe(StatusCodes.ok);
//     });

//     it("Should redirect to /api/v1/ if user is not authenticated", async () => {
//       const response = await request(app).get("/api/v1/protected");
//       //FIXME
//       expect(response.status).toBe(502);
//     });

//     it("Should Allow access to /api/v1/protected if user is authenticated", async () => {
//       app.use((req, res, next) => {
//         req.user = "User Data";
//         next();
//       });
//       const response = await request(app).get("/api/v1/protected");
//       expect(response.status).toBe(502)
//     });
//   });
// });
