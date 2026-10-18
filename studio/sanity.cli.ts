import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "your-project-id",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Studio sẽ được deploy miễn phí tại https://therider.sanity.studio (đổi tên nếu đã có người dùng)
  studioHost: "therider",
  deployment: { autoUpdates: true },
});
