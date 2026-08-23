import type { Meta, StoryObj } from "@storybook/react";
import { PageLoader } from "./PageLoader";

const meta: Meta<typeof PageLoader> = {
  title: "Design System/loaders/PageLoader",
  component: PageLoader,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof PageLoader>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };