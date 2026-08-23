import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Design System/common/Divider",
  component: Divider,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };