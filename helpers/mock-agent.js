import { MockAgent } from "undici";

import { getFixture } from "./fixture.js";

/**
 * @returns {import("undici").MockAgent} Undici MockAgent
 * @see {@link https://undici.nodejs.org/#/docs/api/MockAgent}
 */
export const mockClient = () => {
  const agent = new MockAgent();
  agent.disableNetConnect();

  // Get bookmark
  agent
    .get(/https:\/\/(website|another).example/)
    .intercept({ path: "/notes/lunch" })
    .reply(200, getFixture("fixtures/bookmark.html"));

  // Get bookmark (Moved Permanently)
  agent
    .get("https://short.example")
    .intercept({ path: "/lunch" })
    .reply(301, "", {
      headers: { location: "https://website.example/2019/01/lunch" },
    });

  agent
    .get("https://website.example")
    .intercept({ path: "/2019/01/lunch" })
    .reply(200, getFixture("fixtures/bookmark.html"));

  // Get page without MF2
  agent
    .get("https://github.com")
    .intercept({ path: "/getindiekit/mf2tojf2" })
    .reply(200, getFixture("fixtures/repo.html"));

  // Get bookmark (Not Found)
  agent
    .get("https://website.example")
    .intercept({ path: "/404.html" })
    .reply(404, {
      message: "Not found",
    });

  return agent;
};
