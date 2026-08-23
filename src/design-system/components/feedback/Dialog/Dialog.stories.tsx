import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Design System/feedback/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };