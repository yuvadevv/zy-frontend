import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Design System/cards/StatCard",
  component: StatCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };