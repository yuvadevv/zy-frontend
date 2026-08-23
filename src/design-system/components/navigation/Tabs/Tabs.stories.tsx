import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Design System/navigation/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };