import type { Preview } from "@storybook/react";
import "../stories/storybook.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
};

export default preview;
