import request from "supertest";
import { expect } from "chai";
import { app } from "../app"; // Certifique-se de que a exportação em app.ts é nomeada

describe("Video Downloader", () => {
  it("should return 400 if no URL is provided", (done) => {
    request(app)
      .post("/download")
      .send({ url: "" })
      .expect(400)
      .end((err: any, res: request.Response) => {
        // Adicionados tipos explícitos
        if (err) return done(err);
        expect(res.body)
          .to.have.property("error")
          .that.equals("No URL provided");
        done();
      });
  });

  it("should return 200 and download video for valid URL", (done) => {
    request(app)
      .post("/download")
      .send({
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        format: "mp4",
      })
      .expect(200)
      .end((err: any, res: request.Response) => {
        // Adicionados tipos explícitos
        if (err) return done(err);
        expect(res.body)
          .to.have.property("message")
          .that.equals("Video downloaded successfully");
        done();
      });
  });
});
