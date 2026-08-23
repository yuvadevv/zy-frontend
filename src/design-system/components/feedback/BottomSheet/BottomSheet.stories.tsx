import type { Meta, StoryObj } from "@storybook/react";
import { BottomSheet } from "./BottomSheet";

const meta: Meta<typeof BottomSheet> = {
  title: "Design System/feedback/BottomSheet",
  component: BottomSheet,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BottomSheet>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };