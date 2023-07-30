import { MockAgent } from "undici";
import { getFixture } from "./fixture.js";

const agent = new MockAgent();
agent.disableNetConnect();

export const mockAgent = () => {
  // Get bookmark
  agent
    .get(/https:\/\/(website|another).example/)
    .intercept({ path: "/notes/lunch" })
    .reply(200, getFixture("bookmark.html"));

  // Get bookmark (Not Found)
  agent
    .get("https://website.example")
    .intercept({ path: "/404.html" })
    .reply(404, {
      message: "Not found",
    });

  return agent;
};
