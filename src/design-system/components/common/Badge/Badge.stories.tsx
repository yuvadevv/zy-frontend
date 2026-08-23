import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/common/Badge",
  component: Badge,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };