import type { Meta, StoryObj } from "@storybook/react";
import { OrderCard } from "./OrderCard";

const meta: Meta<typeof OrderCard> = {
  title: "Design System/cards/OrderCard",
  component: OrderCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof OrderCard>;

export const Default: Story = { args: {} };
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { isDisabled: true } };