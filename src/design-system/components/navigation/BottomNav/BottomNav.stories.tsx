import type { Meta, StoryObj } from "@storybook/react";
import { BottomNav } from "./BottomNav";

const meta: Meta<typeof BottomNav> = {
  title: "Design System/navigation/BottomNav",
  component: BottomNav,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BottomNav>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };