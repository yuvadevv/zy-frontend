import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./TopBar";

const meta: Meta<typeof TopBar> = {
  title: "Design System/navigation/TopBar",
  component: TopBar,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TopBar>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };