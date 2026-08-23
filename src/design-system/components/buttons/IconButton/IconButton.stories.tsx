import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Design System/buttons/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };