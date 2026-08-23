import type { Meta, StoryObj } from "@storybook/react";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Design System/feedback/Toast",
  component: Toast,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };