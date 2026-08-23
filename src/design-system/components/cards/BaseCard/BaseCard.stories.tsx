import type { Meta, StoryObj } from "@storybook/react";
import { BaseCard } from "./BaseCard";

const meta: Meta<typeof BaseCard> = {
  title: "Design System/cards/BaseCard",
  component: BaseCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BaseCard>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };