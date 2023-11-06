require("dotenv").config();
const { app } = require("@azure/functions");
var postmark = require("postmark");

app.http("postmark", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    var client = new postmark.ServerClient(process.env.SERVERTOKEN);

    try {
      const body = await request.json();

      if (!body.from) {
        return {
          body: "Invalid email request: 'from' field is missing",
          status: 400,
        };
      }

      if (!body.to) {
        return {
          body: "Invalid email request: 'to' field is missing",
          status: 400,
        };
      }

      if (!body.subject) {
        return {
          body: "Subject is not exist",
          status: 400,
        };
      }

      if (!body.textbody) {
        return {
          body: "Textbody is not exist",
          status: 400,
        };
      }

      const result = await client.sendEmail({
        From: body.from,
        To: body.to,
        Subject: body.subject,
        Textbody: body.textbody,
      });
      if (result.Message === "OK") {
        return {
          body: "Email sent successfully",
          status: 200,
        };
      } else {
        return {
          body: result.Message,
          status: result.ErrorCode,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        body: "Error sending email",
        status: 500,
      };
    }
  },
});
