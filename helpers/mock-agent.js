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

  // Get bookmark (HTML with character set)
  agent
    .get("https://website.example")
    .intercept({ path: "/notes/dinner" })
    .reply(200, getFixture("fixtures/bookmark.html"), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });

  // Get image (Unsupported content type)
  agent
    .get("https://website.example")
    .intercept({ path: "/photo.jpg" })
    .reply(200, "", {
      headers: { "content-type": "image/jpeg" },
    });

  // Get slow page (Timeout)
  agent
    .get("https://website.example")
    .intercept({ path: "/slow" })
    .reply(200, getFixture("fixtures/bookmark.html"))
    .delay(500);

  // Get bookmark (Not Found)
  agent
    .get("https://website.example")
    .intercept({ path: "/404.html" })
    .reply(404, {
      message: "Not found",
    });

  return agent;
};
