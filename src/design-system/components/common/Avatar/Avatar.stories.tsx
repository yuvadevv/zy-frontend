import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Design System/common/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };