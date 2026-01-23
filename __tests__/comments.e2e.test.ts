import request from "supertest";

import {setupApp} from "../src/setup-app";
import express from "express";
import {COMMENTS_PATH} from "../src/core/paths/paths";
import mongoose from "mongoose";
import {SETTINGS} from "../src/core/settings/settings";

describe("Mongoose integration", () => {
    let app: any

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(SETTINGS.MONGO_URL);
        app = express();
        setupApp(app);
    });

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close();
    });

    describe("COMMENTS", () => {

        it("should return 'Hello world!'", async () => {
            const res = await request.agent(app).get("/");
            expect(res.status).toBe(200);
            expect(res.text).toBe("Hello world!");
        });



        it("should clear all data with status 202", async () => {
            const res = await request.agent(app).delete("/testing/all-data");
            expect(res.status).toBe(204);
        });

        // it("should return empty array", async () => {
        //     const res = await request.agent(app).get(`${COMMENTS_PATH}/ljkhkljh43k2jhkj234`);
        //     expect(res.status).toBe(200);
        //     expect(res.body).toEqual([]);
        // });

        // it("GET drivers = []", async () => {
        //     await request.agent(app).get("/videos/").expect([]);
        // });
        //
        // it("- POST does not create the videos with incorrect data (no title, no author,)", async function () {
        //     await request
        //         .agent(app)
        //         .post("/videos")
        //         .send({
        //             title: "",
        //             author: "",
        //             availableResolutions: [""]
        //         })
        //         .expect(400);
        //
        //     const res = await request.agent(app).get("/videos");
        //     expect(res.body).toEqual([]);
        // });
        //
        // it("- GET videos by ID with incorrect id", async () => {
        //     await request.agent(app).get("/videos/helloWorld").expect(404);
        // });

        // it("+ GET videos by ID with correct id", async () => {
        //     const response = await request
        //         .agent(app)
        //         .get("/videos/" + dbVideo.videos[dbVideo.videos.length - 1].id)
        //         .send(testVideosData)
        //         .expect(200);
        //
        //     // Проверяем ответ второго видео
        //     expect(response.body).toMatchObject({
        //         id: expect.any(Number),
        //         title: "string",
        //         author: "string",
        //         canBeDownloaded: false,
        //         minAgeRestriction: null,
        //         availableResolutions: ["P240"],
        //         createdAt: expect.any(String),
        //         publicationDate: expect.any(String)
        //     });
        // });

        // it("GET videos", async () => {
        //     const response = await request.agent(app).get("/videos").expect(200);
        //
        //     // Проверяем ответ второго видео
        //     expect(response.body).toMatchObject([
        //         {
        //             id: expect.any(Number),
        //             title: "string",
        //             author: "string",
        //             canBeDownloaded: false,
        //             minAgeRestriction: null,
        //             availableResolutions: ["P144"],
        //             createdAt: expect.any(String),
        //             publicationDate: expect.any(String)
        //         },
        //         {
        //             id: expect.any(Number),
        //             title: "string",
        //             author: "string",
        //             canBeDownloaded: false,
        //             minAgeRestriction: null,
        //             availableResolutions: ["P240"],
        //             createdAt: expect.any(String),
        //             publicationDate: expect.any(String)
        //         }
        //     ]);
        // });

        // it("DELETE driver by ID with correct id", async () => {
        //     await request
        //         .agent(app)
        //         .delete("/videos/" + dbVideo.videos[dbVideo.videos.length - 1].id)
        //         .expect(204);
        // });
    });
});
