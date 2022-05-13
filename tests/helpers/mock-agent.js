import { MockAgent } from "undici";
import { getFixture } from "./fixture.js";

const agent = new MockAgent();
agent.disableNetConnect();

export const mockAgent = () => {
  const client = agent.get("https://website.example");
  const bookmark = getFixture("bookmark.html");

  // Get bookmark
  client.intercept({ path: "/notes/lunch" }).reply(200, bookmark);

  // Get bookmark (Not Found)
  client.intercept({ path: "/404.html" }).reply(404, {
    message: "Not found"
  });

  return client;
};
